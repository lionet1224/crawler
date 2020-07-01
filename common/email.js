const nodemailer = require('nodemailer')
const config = require('../config/config.default')
const redis = require('./redis')
const { ServerError, AuthFailed } = require('./http-exception')

const { email, myAppName } = config({});

class Email{
  constructor(){
    this.transporter = nodemailer.createTransport({
      service: email.service,
      port: email.port,
      secureConnection: true,
      auth: {
        user: email.user,
        pass: email.pass
      }
    })

    this.option = {
      from: `${myAppName} <${email.user}>`
    }
  }

  getTemplate(option){
    switch(option.type){
      case 'authcode':
        let authcodeTemp = require('../template/authcode');
        return authcodeTemp(option);
      case 'info':
        let infoTemp = require('../template/info');
        return infoTemp(option);
      default:
        return authcodeTemp({
          info: `
            系统发生了意外，导致这份邮件发送到了您这里，发送邮件配置如下：<br/>
            ${JSON.stringify(option)} <br/>
            您可以选择将其发送至QQ: 2812194244
          `
        });
    }
  }

  async send(option, delay = false){
    if(delay){
      let key = `email_${option.type}_${option.to}_delay`;
      let flag = await redis.get(key);
      if(flag) throw new AuthFailed(`发送此类邮件需要间隔${delay / 60}分钟哦`);
      await redis.set(key, true, delay)
    }
    option = Object.assign(this.option, option);
    option.html = this.getTemplate(option);

    await this.transporter.sendMail(option).catch(err => {
      throw new ServerError('邮件发送失败');
    });
  }
}

const Mailer = new Email();

module.exports = Mailer;