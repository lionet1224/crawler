const userAgent = require('../config/userAgent')
const rq = require('request')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')

async function getProxyIp(config, ctx){
  if(config.enable){
    try{
      let key = config.list[ctx.helper.random(config.list.length)];
      let data = await ctx.redis.getId(`reptile_${key}`)
      data = JSON.parse(data || '{}');
      if(data.list && data.list.length >= 1){
        let proxy = data.list[ctx.helper.random(data.list.length)]
        return `${proxy.prefix || 'http://'}${proxy.ip}:${proxy.port}`;
      }
    }catch(err){
      ctx.logger.warn('获取代理IP时发生错误: ' + err);
    }
  }

  return null;
}

module.exports = function(config = {}){
  return new Promise(async (resolve, reject) => {
    let configOption = await this.service.config.show('request-default-option', null, {
      option: {
        method: 'GET',
        timeout: 5000,
        rejectUnauthorized: false,
        strictSSL: false,
        gzip: true,
        encoding: null,
        headers: {},
        jar: true,
        // followRedirect: false
      }
    })
    config = Object.assign(configOption.option, config.set, {uri: config.uri});

    if(!config.uri || config.uri == "") {
      reject({type: 'url', msg: '请求时，错误的uri', config});
      return;
    }
    let prefix = config.uri.slice(0, 4);
    if(prefix != 'http') config.uri = 'http://' + config.uri;
    config.uri = encodeURI(config.uri)
    
    let agent = userAgent[config.device || 'pc'];
    config.headers['User-Agent'] = agent[Math.floor(agent.length * Math.random())];

    if(config.proxyEnable != false){
      let proxyConfig = await this.service.config.show(`request-proxy-ip`);
      if(proxyConfig){
        let ip = await getProxyIp(proxyConfig, this);
        ip && (config.proxy = ip);
      }
    }

    if(config.forceProxy && !config.proxy){
      return reject({type: 'err', msg: '爬虫开启了强制代理模式，但没有匹配到代理IP', config});
    }

    rq(config, (err, res, body) => {
      if(err){
        return reject({type: 'err', msg: err.message, config});
      }

      if(body.length <= 0 && config.proxy){
        return reject({type: 'ip', msg: '没有任何数据，原因: 代理ip过期或其他', config});
      }

      let datas = {
        dom(){
          return cheerio.load(iconv.decode(body, config.transform || 'utf-8'), {
            decodeEntities: false
          })
        },
        api(){ return body ? JSON.parse(body || '{}') : {} },
      }

      let data = datas[config.type];

      try{
        resolve({
          data: data ? data() : body,
          headers: res.headers,
          config,
        });
      } catch(err){
        return reject({type: 'err', msg: err.message, config});
      }
    })
  });
}