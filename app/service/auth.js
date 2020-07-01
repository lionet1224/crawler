const Service = require('egg').Service;
const bcrypt = require('bcryptjs')
const { NotFound, AuthFailed } = require('../../common/http-exception');

class AuthService extends Service{
  async token(id, uid, scope, refresh_token){
    const { User } = this.ctx.model;
    let user;
    if(refresh_token){
      user = await User.findOne({
        where: {
          refresh_token
        }
      });
      if(!user) throw new NotFound('无效的Token, 请重新登录');
    } else {
      user = await User.findByPk(id);
    }
    let token = this.ctx.helper.generateToken(id, uid, scope);
    refresh_token = this.ctx.helper.generateToken(id, uid, scope, 60 * 60 * 24 * 7);
    await user.update({
      token,
      refresh_token
    })
    return {
      token, refresh_token
    }
  }

  async verify(data){
    const { User } = this.ctx.model;
    const user = await User.findOne({
      where: {
        email: data.get('email')
      }
    })
    if(!user) throw AuthFailed('账号不存在或密码不正确');

    const correct = bcrypt.compareSync(data.get('password'), user.password);
    if(!correct){
      throw new AuthFailed('账号不存在或密码不正确')
    }

    let auth = await this.token(user.id, user.uid, user.scope);
    return {
      uid: user.uid,
      username: user.username,
      portrait: user.portrait,
      scope: user.scope,
      auth
    }
  }

  async logout(){
    const { User } = this.ctx.model;
    const user = await User.findByPk(this.ctx.auth.id);
    user.update({
      token: null,
      refresh_token: null
    })
  }
}

module.exports = AuthService;