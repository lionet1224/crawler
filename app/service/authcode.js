const Service = require('egg').Service;

class AuthcodeService extends Service{
  async create(verify){
    let authcode = this.ctx.helper.createAuthCode();
    let data = verify.get(true);
    let control = data.type == 'create' 
      ? '注册账号' : data.type == 'reset' 
      ? '修改密码' : null;
    await this.ctx.Mailer.send({
      to: data.email,
      subject: `你好呀，你的验证码来辣`,
      type: 'authcode',
      authcode,
      control
    }, 60)
    
		let key = `authcode_${data.email}_${data.type}`;
    await this.ctx.redis.set(key, authcode, 60 * 10);
  }
}

module.exports = AuthcodeService;