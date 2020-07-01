const Controller = require('egg').Controller;

class ConfigController extends Controller{
  async index(){
    let ctx = this.ctx;

    let data = await ctx.service.config.index();

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async create(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      key: 'required|min:1',
      value: 'json'
    });

    let config = await ctx.service.config.create(verify, true);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(config, '创建成功');
  }

  async show(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx.params, {
      key: 'required|min:1',
    }, true);

    let config = await ctx.service.config.show(verify.get('key'), true);
    
    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(config);
  }

  async update(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      key: 'required|min:1',
      value: 'json'
    });
    
    let config = await ctx.service.config.update(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(config, '修改成功');
  }

  async delete(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      key: 'required|min:1'
    })

    await ctx.service.config.delete(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.success('删除成功');
  }
}

module.exports = ConfigController;