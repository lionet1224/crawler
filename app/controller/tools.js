const Controller = require('egg').Controller;

class ToolsController extends Controller{
  async saveImage(){
    let ctx = this.ctx;

    const data = await ctx.service.tools.saveImage();

    ctx.status = 200;
    ctx.body = this.ctx.helper.HttpDataResolve.json(data, '上传成功');
  }

  async dashboard(){
    let ctx = this.ctx;

    const data = await ctx.service.tools.dashboard();

    ctx.status = 200;
    ctx.body = this.ctx.helper.HttpDataResolve.json(data);
  }
}

module.exports = ToolsController;