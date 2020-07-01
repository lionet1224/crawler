const Controller = require('egg').Controller;

class AuthcodeController extends Controller{
  async create(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      email: 'required|email',
      type: 'required|include:create,reset'
    });

    await ctx.service.authcode.create(verify);

    ctx.status = 200;
    ctx.body = this.ctx.helper.HttpDataResolve.success('发送成功，请注意查收');
  }
}

module.exports = AuthcodeController;