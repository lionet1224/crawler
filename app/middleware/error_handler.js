const { HttpException } = require('../../common/http-exception')

module.exports = () => {
  return async function errorHandler(ctx, next){
    try{
      await next();
    } catch(err){
      ctx.app.emit('error', err, ctx);

      const isProd = ctx.app.config.env === 'prod'
      const isHttpException = err instanceof HttpException;

      if (!isProd && !isHttpException) {
        throw err;
      }
    
      if (isHttpException) {
        ctx.body = {
          msg: err.msg,
          code: err.errorCode
        }
        ctx.status = err.code
      } else {
        ctx.body = {
          msg: '未知错误',
          code: 9999
        }
        ctx.status = 500;
      }
    }
  }
}