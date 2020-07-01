const validator = require('../../common/validator')
const rq = require('../../common/rq')
const redis = require('../../common/redis')
const mailer = require('../../common/email');
const parse = require('../../common/parseData');
const { awaitTo } = require('./helper');
const validate = require('validator')

exports.Validator = validator;
exports.Rq = rq;
exports.redis = redis;
exports.Mailer = mailer;
exports.Parse = parse;
exports.validate = validate

exports.Get = function(option){
  return new Promise(async (resolve, reject) => {
    let retryMax = option.set.retryNum || 3;
    let num = 0;
    let ipErr = 0;
    let errs = [];
    let config = {};

    while(retryMax >= ++num){
      let [data, err] = await awaitTo(this.Rq(option));
      if(err){
        if(err.type == 'url') {
          reject({
            msg: '请求的地址为空',
            config
          });
          return;
        } else {
          if(err.type == 'ip') ipErr++;
          
          config = err.config;
          errs.push(err.msg);
        }
      } else if(data){
        resolve(data);
        return;
      }
    }

    let autoDelete = await this.service.config.show('request-auto-delete-proxy', null, {enable: true});
    if(ipErr >= retryMax && autoDelete.enable){
      let proxyConfig = await this.service.config.show(`request-proxy-ip`);
      if(proxyConfig.enable){
        proxyConfig.list && proxyConfig.list.map(async key => {
          await this.redis.del(`reptile_${key}`);
        })
        this.logger.info('已经自动删除代理IP');
      }
    }

    reject({
      msg: '获取失败',
      errs,
      config
    });
  })
}