const Controller = require('egg').Controller;

class ScheduleController extends Controller{
  async create(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      cron: 'required',
      rid: 'required|min:32|max:32',
      name: 'required|min:1',
      describe: '',
      query: "json"
    })

    let data = await ctx.service.schedule.create(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data, '创建成功');
  }

  async update(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      sid: 'required|min:32|max:32',
      cron: '',
      name: 'min:1',
      describe: '',
      query: 'json',
      status: 'include:1,2'
    })

    let data = await ctx.service.schedule.update(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data, '修改成功');
  }

  async delete(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      sid: 'required|min:32|max:32'
    })

    await ctx.service.schedule.delete(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.success('删除成功');
  }

  async index(){
    let ctx = this.ctx;
    
    let data = await ctx.service.schedule.index();

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }
}

module.exports = ScheduleController;