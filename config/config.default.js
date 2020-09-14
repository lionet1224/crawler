/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  // config.env = 'prod';

  // use for cookie sign key, should change to your own and keep security
  config.keys = 'lionet_91288291175891230982_Crawler';

  // add your middleware config here
  config.middleware = ['errorHandler', 'notfoundHandler'];

  config.errorHandler = {
    match: '/api'
  }

  // add your user config here
  const userConfig = {
    myAppName: 'Crawler',
  };

  config.security = {
    csrf: {
      enable: false
    }
  }

  config.redis = {
    enable: true,
    port: 6379,
    host: '127.0.0.1',
    password: '',
    db: 0
  }

  config.email = {
    service: 'qq',
    port: '465',
    user: 'rabbitpie@qq.com',
    pass: 'towvlzxfdsorjefe'
  }

  config.uploadDir = 'app/public/images'

  config.multipart = {
    mode: 'file',
    fileSize: '10mb'
  }

  config.systemConfig = [
    {key: 'request-proxy-ip', value: {list: [], enable: false}},
    {key: 'request-fillable-params', value: {list: ['query', 'headers', 'proxyEnable']}},
    {key: 'request-default-option', value: {option: {
      uri: config.uri,
      method: 'GET',
      timeout: 5000,
      rejectUnauthorized: false,
      strictSSL: false,
      gzip: true,
      encoding: null,
      headers: {},
      jar: true
    }}},
    {key: 'request-domain-white-list', value: {list: ['*']}},
    {key: 'request-auto-delete-proxy', value: {enable: true}},
    {key: 'upload-image-extname', value: {list: ['.jpg', '.jpeg', '.png', '.gif']}},
    {key: 'upload-image-size', value: {size: 1024 * 1024 * 5}},
  ]

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  return {
    ...config,
    ...userConfig,
  };
};
