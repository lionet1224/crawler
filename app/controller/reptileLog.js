const Controller = require('egg').Controller;

class ReptileLogController extends Controller{
  async log(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx.query, {
      rid: 'min:32|max:32',
      sid: 'min:32|max:32',
      type: 'include:year,month',
    }, true)

    let data = await this.ctx.service.reptileLog.log(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async logList(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx.query, {
      rid: 'min:32|max:32',
      sid: 'min:32|max:32',
      page: 'number',
      order: 'include:asc,desc'
    }, true)

    let data = await this.ctx.service.reptileLog.logList(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async show(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx.params, {
      id: 'number',
    }, true)

    let data = await this.ctx.service.reptileLog.show(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }
}

module.exports = ReptileLogController;