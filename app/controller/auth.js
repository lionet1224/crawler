const Controller = require('egg').Controller;

class AuthController extends Controller{
  async login(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      email: 'required|email',
      password: 'required|min:6|max:16',
    })

    let auth = await ctx.service.auth.verify(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(auth, '登录成功');
  }

  async logout(){
    let ctx = this.ctx;

    await ctx.service.auth.logout();

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.success("登出成功");
  }
}

module.exports = AuthController;