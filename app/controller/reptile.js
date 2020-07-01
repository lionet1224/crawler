const Controller = require('egg').Controller;

class ReptileController extends Controller{
  async index(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      rid: 'required|min:32|max:32',
      cache: 'include:false,true',
      set: 'json'
    })

    let data = await this.ctx.service.reptile.run(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async create(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      name: 'required|min:1',
      set: 'required|json',
      logo: '',
      describe: '',
      rid: 'required|min:32|max:32',
      status: 'include:1,2',
      public: 'include:1,2'
    })

    let data = await this.ctx.service.reptile.create(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data, '创建成功');
  }

  async update(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      name: '',
      set: 'json',
      logo: '',
      public: 'include:1,2',
      status: 'include:1,2',
      describe: '',
      rid: 'required|min:32|max:32'
    })

    let data = await this.ctx.service.reptile.update(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data, '修改成功');
  }

  async delete(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      rid: 'required|min:32|max:32'
    })

    await this.ctx.service.reptile.delete(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.success('删除成功');
  }

  async mock(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx, {
      set: 'request|json'
    })

    let data = await this.ctx.service.reptile.mock(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data);
  }

  async show(){
    let ctx = this.ctx;
    let verify = new ctx.Validator(ctx.params, {
      rid: 'required|min:32|max:32'
    }, true)

    let data = await this.ctx.service.reptile.show(verify);

    ctx.status = 200;
    ctx.body = ctx.helper.HttpDataResolve.json(data)
  }
}

module.exports = ReptileController;