const Controller = require('egg').Controller;

class UserController extends Controller{
  async index(){
    const ctx = this.ctx;
    let verify = new ctx.Validator(ctx.query, {
      page: 'number',
      order: 'include:desc,asc'
    }, true);
    
    let data = await ctx.service.user.index(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async show(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx.params, {
      uid: 'required|min:32|max:32'
    }, true)

    let data = await ctx.service.user.show(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async me(){
    let ctx = this.ctx;

    let data = await ctx.service.user.me();

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async create(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      username: 'required|min:1|max:8',
      email: 'required|email',
      password: 'required|min:6|max:16',
      authcode: 'required|min:6|max:6'
    });

    const user = await ctx.service.user.create(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(user, '注册成功');
  }

  async update(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      username: 'min:1|max:8',
      portrait: 'file'
    })

    let data = await ctx.service.user.update(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data, '修改成功')
  }
}

module.exports = UserController;