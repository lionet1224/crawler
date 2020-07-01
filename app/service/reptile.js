const Service = require('egg').Service;
const { NotFound, AuthFailed, ParameterException } = require('../../common/http-exception');
const { ADMIN } = require('../../common/auth');
const moment = require('moment')

class ReptileService extends Service{
  async create(data){
    const { Reptile, ReptileType } = this.ctx.model;

    const type = await ReptileType.findOne({
      where: {
        rid: data.get('rid')
      }
    });
    if(!type) throw new NotFound('没有找到对应的分类');

    let reptile = await Reptile.create({
      rid: this.ctx.helper.createID(),
      name: data.get('name'),
      set: data.get('set'),
      logo: data.get('logo', null),
      public: data.get('public', 1),
      status: data.get('status', 1),
      describe: data.get('describe', ''),
      user_id: this.ctx.auth.id,
      type_id: type.id
    })

    return reptile;
  }

  async update(data){
    const { Reptile } = this.ctx.model;

    const reptile = await Reptile.findOne({
      where: {
        rid: data.get('rid')
      },
      attributes: {
        exclude: ['deleted_at', 'user_id', 'type_id']
      }
    })

    if(!reptile) throw new NotFound('爬虫不存在');

    await reptile.update({
      set: data.get('set', reptile.dataValues.set),
      name: data.get('name', reptile.name),
      logo: data.get('logo', reptile.logo),
      public: data.get('public', reptile.public),
      status: data.get('status', reptile.status),
      describe: data.get('describe', reptile.describe)
    })

    delete reptile.dataValues.id;

    return reptile;
  }

  async delete(data){
    const { Reptile } = this.ctx.model;

    const reptile = await Reptile.findOne({
      where: {
        rid: data.get('rid')
      }
    })

    if(!reptile) throw new NotFound('爬虫不存在')

    await reptile.destroy();
  }

  async runMain(reptile, set, data){
    return new Promise(async (resolve, reject) => {
      if(!reptile) {
        return reject({
          msg: '没有找到对应的源',
          type: NotFound
        });
      }
      if(reptile.status == 2 || 
        ((this.ctx.auth.scope || 0) < ADMIN && reptile.public == 2)) 
          return reject({
            msg: '源无效',
            type: AuthFailed
          })

      if(this.ctx.auth.scope < parseInt(reptile.scope)){
        return reject({
          msg: '权限不足',
          type: AuthFailed
        })
      }

      let key = `reptile_${reptile.rid}_${JSON.stringify(set)}`;
      let isRedis = (data.get('cache', 'true') == 'true' || this.ctx.auth.scope < ADMIN)
        && set.cache && set.cache.enable;
      // 解析路径
      let uri = this.ctx.helper.parsePath(set.href, set);

      if(isRedis){
        let result = await this.ctx.redis.get(key);
        if(result){
          return resolve({
            result: JSON.parse(result),
            originHref: uri,
            config: {},
            cache: true
          })
        }
      }
    
      let [res, err] = await this.ctx.helper.awaitTo(this.ctx.Get({
        uri,
        set
      }))

      if(err){
        return reject({
          config: err.config,
          errs: err.errs,
          msg: err.msg,
          type: ParameterException
        })
      }

      let result = res.data;
      if(set.field){
        let parse = new this.ctx.Parse(res, set);
    
        if(parse.error){
          return reject({
            config: err ? err.config : res.config,
            msg: parse.error,
            type: ParameterException
          })
        }

        result = parse.get();
      }

      if(set.cache && set.cache.enable){
        let jsonData = JSON.stringify(result);
        await this.ctx.redis.set(key, jsonData, set.cache.time || 60 * 60);
        await this.ctx.redis.set(`reptile_${reptile.rid}`, key, set.cache.time || 60 * 60);
      }

      resolve({
        config: res.config,
        result,
        originHref: uri
      })
    })
  }

  async run(data, sid){
    const { Reptile } = this.ctx.model;
    const reptile = await Reptile.findOne({
      where: {
        rid: data.get('rid')
      }
    })

    let fillable = await this.ctx.service.config.show('request-fillable-params', false, {list: ['query', 'headers', 'proxyEnable']});

    let set = reptile 
      ? Object.assign(JSON.parse(reptile.dataValues.set),
        this.ctx.helper.getParams(JSON.parse(data.get('set', '{}')), fillable.list)
      )
      : {};

    let type = sid ? 'schedule' : 'request';

    let log = {
      type,
      set: JSON.stringify(set),
      status: 1,
      user_id: this.ctx.auth.id,
      reptile_id: reptile ? reptile.id : null,
      schedule_id: sid,
      proxy: 2,
      cache: 2
    }

    let [res, err] = await this.ctx.helper.awaitTo(this.runMain(reptile, set, data))

    if(err){
      this.service.reptileLog.create(new this.ctx.helper.Validator({
        ...log,
        status: 2,
        errorMsg: err.errs ? JSON.stringify(err.errs) : err.msg,
        proxy: err.config && err.config.proxy ? 1 : 2
      }))

      throw new err.type(
        (this.ctx.auth.scope < ADMIN || !err.errs)
          ? err.msg
          : err.errs
        );
    }

    const reptileLog = await this.service.reptileLog.create(new this.ctx.helper.Validator({
      ...log,
      cache: res.cache ? 1 : 2,
      proxy: res.config.proxy ? 1 : 2
    }))

    if(set.store && reptileLog && !res.cache){
      this.service.reptileData.create({
        data: JSON.stringify(res.result),
        reptile_id: reptile.id,
        reptileLog_id: reptileLog.id
      });
    }

    return {
      result: res.result,
      originHref: res.originHref,
    };
  }

  async mock(data){
    let set = JSON.parse(data.get('set', '{}'));
    let uri = this.ctx.helper.parsePath(set.href, set);

    let [res, err] = await this.ctx.helper.awaitTo(this.ctx.Get({
      uri,
      set
    }))

    if(err){
      throw new ParameterException(err.errs ? JSON.stringify(err.errs) : err.msg);
    }

    let result = res.data;
    if(set.field){
      let parse = new this.ctx.Parse(res, set);
  
      if(parse.error){
        throw new ParameterException(parse.error);
      }

      result = parse.get();
    }

    return {
      result,
      headers: res.headers,
      originHref: uri
    };
  }

  async show(data){
    const { Reptile, ReptileType, User } = this.ctx.model

    const reptile = await Reptile.findOne({
      where: {
        rid: data.get('rid')
      },
      attributes: {
        exclude: ['id', 'user_id', 'type_id', 'deleted_at']
      },
      include: [{
        model: ReptileType,
        as: 'type',
        attributes: ['rid', 'name', 'public']
      }, {
        model: User,
        as: 'user',
        attributes: ['uid', 'username', 'created_at', 'updated_at', 'portrait', 'scope']
      }]
    })

    if(!reptile) throw new NotFound('爬虫不存在');

    return reptile;
  }
}

module.exports = ReptileService;