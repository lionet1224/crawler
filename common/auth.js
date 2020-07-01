const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken');
const config = require('../config/config.default');
const { Forbidden, AuthFailed } = require('./http-exception');

const { keys } = config({})

const USER = 8;
const ADMIN = 16;
const SP_ADMIN = 32;

class Auth{
  constructor(level){
    this.level = level || 0;
  }

  async reset(token){
    try{
      var decode = jwt.verify(token, keys);
    } catch(err){
      throw new Forbidden('Token过期了');
    }

    return decode;
  }

  get m(){
    return async (ctx, next) => {
      const token = basicAuth(ctx.req);
      let decode = {};
      
      if(token && token.name){
        const user = await ctx.model.User.findOne({
          where: {
            token: token.name,
          }
        });

        if(!user){
          throw new Forbidden('无效的Token');
        }
        
        try{
          decode = jwt.verify(token.name, keys);
        }catch(err){
          if(err.name === 'TokenExpiredError'){
            decode = await this.reset(token.pass);
            await next();
            let auth = await ctx.service.auth.token(decode.id, decode.uid, decode.scope, token.pass);
            ctx.body = ctx.helper.HttpDataResolve.data(ctx.body, {
              auth
            });
            return;
          }

          throw new AuthFailed('无效的Token');
        }
      }

      if(this.level != 0){
        if(!decode.scope) throw new Forbidden('无效的Token');
        else if(this.level > decode.scope) throw new Forbidden('权限不足')
      }
  
      ctx.auth = {
        scope: 0,
        ...decode
      }
      await next();
    }
  }
}

module.exports = {
  USER,
  ADMIN,
  SP_ADMIN,
  Auth
}