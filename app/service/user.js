const Service = require('egg').Service;
const { Existing, AuthFailed } = require('../../common/http-exception');
const { SP_ADMIN, ADMIN, USER } = require('../../common/auth');

class UserService extends Service{
  async index(data){
    const { User } = this.ctx.model;

    let size = 10;
    let page = parseInt(data.get('page', 1));

    const users = await User.findAndCountAll({
      limit: size,
      offset: (page - 1) * size,
      order: [['created_at', data.get('order', 'desc')]],
      attributes: {
        exclude: ['id', 'password', 'token', 'refresh_token', 'deleted_at']
      }
    })

    return this.ctx.helper.listData(users, size, page);
  }

  async create(data){
    const { User } = this.ctx.model;
    const users = await User.count();
    let scope = users <= 0 ? SP_ADMIN : ADMIN;

    if(users >= 1 && this.ctx.auth.scope < SP_ADMIN){
      scope = USER;
    }

    const has = await User.findOne({
      where: {
        email: data.get('email')
      }
    })
    if(has){
      throw new Existing('用户已存在')
    }

    if(this.app.config.env == 'prod'){
      let key = `authcode_${data.get('email')}_create`;
      const code = await this.ctx.redis.get(key);

      if(!code || code != data.get('authcode')){
        throw new AuthFailed('无效的验证码')
      }
      await this.ctx.redis.del(key);
    }

    const user = await User.create({
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
      uid: this.ctx.helper.createID(),
      scope
    })

    return {
      username: user.username,
      email: user.email,
      uid: user.uid,
      scope
    }
  }

  async show(data){
    const { User } = this.ctx.model;
    const user = await User.findOne({
      where: {
        uid: data.get('uid')
      },
      attributes: {
        exclude: ['email', 'token', 'refresh_token', 'password', 'deleted_at', 'id']
      }
    })

    if(!user) throw new NotFound('用户不存在');

    return user;
  }

  async update(data){
    const { User } = this.ctx.model;

    const user = await User.findOne({
      where: {
        id: this.ctx.auth.id
      },
      attributes: {
        exclude: ['token', 'refresh_token', 'password', 'deleted_at']
      }
    })

    if(!user) throw new NotFound('用户不存在');

    await user.update({
      portrait: data.get('portrait', user.portrait),
      username: data.get('username', user.username)
    })

    delete user.dataValues.id;

    return user;
  }

  async me(){
    const { User } = this.ctx.model;
    const user = await User.findOne({
      where: {
        uid: this.ctx.auth.uid
      },
      attributes: {
        exclude: ['token', 'refresh_token', 'password', 'deleted_at', 'id']
      }
    })

    if(!user) throw new NotFound('用户不存在');

    return user;
  }
}

module.exports = UserService;