const Controller = require('egg').Controller;

class ReptileTypeController extends Controller{
  async create(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      name: 'required|min:1',
      pid: 'required|min:32|max:32',
      describe: ''
    });

    let data = await ctx.service.reptileType.create(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data, '创建成功');
  }

  async index(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx.query, {
      pid: 'required|min:32|max:32',
      page: 'number',
      order: 'include:desc,asc'
    }, true);
    
    let data = await ctx.service.reptileType.index(verify);
    
    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async show(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx.params, {
      rid: 'required|min:32|max:32'
    }, true);

    let data = await ctx.service.reptileType.show(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async delete(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      rid: 'required|min:32|max:32',
    })

    await ctx.service.reptileType.delete(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.success('删除成功');
  }
  
  async update(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      rid: 'required|min:32|max:32',
      name: '',
      describe: '',
      public: 'include:1,2'
    })

    let data = await ctx.service.reptileType.update(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data, '修改成功');
  }
}
  

module.exports = ReptileTypeController;