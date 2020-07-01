module.exports = () => {
  return async function notFoundHandler(ctx, next){
    await next();
    if(ctx.status === 404 && !ctx.body){
      ctx.body = { msg: '没有对应的API', code: 10006 }
    }
  }
}