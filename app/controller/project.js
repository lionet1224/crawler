const Controller = require('egg').Controller;

class ProjectController extends Controller{
  async create(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      name: 'required|min:1',
      describe: ''
    })

    let data = await ctx.service.project.create(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data, '创建成功');
  }

  async delete(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      pid: 'required|min:32|max:32'
    })

    await ctx.service.project.delete(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.success('删除成功');
  }

  async index(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx.query, {
      page: 'number',
      order: 'include:desc,asc'
    }, true);

    let data = await ctx.service.project.index(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async update(){
    let ctx = this.ctx;

    let verify = new ctx.Validator(ctx, {
      pid: 'required|min:32|max:32',
      name: '',
      describe: ''
    })

    let data = await ctx.service.project.update(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data, '修改成功');
  }

  async show(){
    let ctx = this.ctx;

    let verify = new ctx.Validator(ctx.params, {
      pid: 'required|min:32|max:32',
    }, true)

    let data = await ctx.service.project.show(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }
}

module.exports = ProjectController;