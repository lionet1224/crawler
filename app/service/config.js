const { Existing, NotFound } = require('../../common/http-exception');

const Service = require('egg').Service;

class ConfigService extends Service{
  constructor(app){
    super(app)
    this.Config = this.ctx.model.Config;
  }

  async init(){
    let configs = this.config.systemConfig;

    configs.map(item => {
      item.value = JSON.stringify(item.value);
      this.create(new this.ctx.helper.Validator(item));
    })
  }

  async index(){
    const list = await this.Config.findAll({
      attributes: {
        exclude: ['deleted_at']
      }
    })

    return list;
  }

  async create(data, flag = false){
    let result = await this.show(data.get('key'));
    if(result){
      if(flag){
        throw new Existing('这条配置已经存在');
      }
      else{
        await this.additional({value: JSON.stringify(result), key: data.get('key')});
        return;
      }
    }

    let config = await this.Config.create({
      ...data.get(true)
    })

    await this.additional(config);

    return config;
  }

  async show(key, flag = false, def = null){
    let redisKey = `config_${key}`;
    let data = null;
    data = await this.ctx.redis.get(redisKey);
    if(!data){
      data = await this.Config.findOne({
        where: {
          key
        },
        attributes: {
          exclude: ['deleted_at']
        }
      })

      if(data){
        await this.ctx.redis.set(redisKey, data.value, 60 * 60 * 24 * 7);
        data = data.value;
      }
    }
    if(data){
      try{
        data = JSON.parse(data || '{}');
      } catch(err){
        await this.ctx.redis.del(redisKey);
      }
    }
    if(flag && !data){
      throw new NotFound('没有找到对应的配置')
    }
    return data || def;
  }

  async additional(config){
    switch(config.key){
      case 'request-domain-white-list':
        let data = JSON.parse(config.value || '{}');
        this.app.config.security.domainWhiteList = data.list || ['*'];
        break;
    }
  }

  async update(data){
    let config = await this.Config.findOne({
      where: {
        key: data.get('key')
      },
      attributes: {
        exclude: ['deleted_at']
      }
    });

    if(!config) throw new NotFound('没有找到对应的配置');
    let redisKey = `config_${config.key}`;

    await this.ctx.redis.del(redisKey);
    await config.update({
      ...data.get(true)
    })
    
    await this.additional(config);

    return config;
  }

  async delete(data){
    let redisKey = `config_${data.get('key')}`;
    const config = await this.Config.findOne({
      where: {
        key: data.get('key')
      }
    })

    if(!config) throw new NotFound('配置不存在');

    await this.ctx.redis.del(redisKey);
    await config.destroy();
  }
}

module.exports = ConfigService; 