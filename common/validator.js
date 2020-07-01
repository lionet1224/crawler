const validator = require('validator')
const { ParameterException } = require('./http-exception')
const xss = require('xss')
const { isFileExists } = require('../app/extend/helper')

class Validator {
  constructor(params, config, flag) {
    this.data = flag ? params : params.request.body;
    this.config = config
    this.result = {}

    this.parse();
  }

  parse() {
    Object.keys(this.config).forEach(key => {
      let verify = this.config[key]
      verify.split('|').forEach(rule => {
        let result = this.verify(rule, key)
        if (!result.flag) {
          throw new ParameterException(result.errorMessage)
        } else {
          this.result[key] = this.data[key] ? xss(this.data[key], {
            whiteList: ['href', 'target', 'title', 'alt', 'src', 'class', 'id']
          }) : undefined;
        }
      })
    })
  }

  verify(rule, key) {
    let r = rule.split(':')
    let name = r[0]
    let data = this.data[key] ? this.data[key] + '' : "";
    let result = {
      flag: true,
      errorMessage: ''
    }

    switch (name) {
      case 'required':
        result = {
          flag: data != '',
          errorMessage: `${key}不能为空`
        }
        break
      case 'min':
        result = {
          flag: data == "" || validator.isLength(data, {
            min: r[1]
          }),
          errorMessage: `${key}最小长度为${r[1]}位`
        }
        break
      case 'max':
        result = {
          flag: data == "" || validator.isLength(data, {
            max: r[1]
          }),
          errorMessage: `${key}最大长度为${r[1]}位`
        }
        break
      case 'email':
        result = {
          flag: data == "" || validator.isEmail(data),
          errorMessage: `${key}不是一个邮箱`
        }
        break
      case 'length':
        result = {
          flag: validator.isLength(data, {
            min: r[1], max: r[1]
          }),
          errorMessage: `${key}长度必须为${r[1]}位`
        }
        break;
      case 'number':
        result = {
          flag: data == "" || validator.isNumeric(data),
          errorMessage: `${key}不是一个数字`
        }
        break;
      case 'include':
        result = {
          flag: data == "" || r[1].split(',').includes(data),
          errorMessage: `${key}的值需为(${r[1]})其中的一项`
        }
        break;
      case 'json':
        result = {
          flag: data == "" || validator.isJSON(data),
          errorMessage: `${key}不是一个json`
        }
        break;
      case 'file':
        result = {
          flag: data == "" || isFileExists(data),
          errorMessage: `${data}路径的文件不存在`
        }
        break;
      default:
        break
    }

    return result
  }

  get(key, def = null) {
    if(typeof key == 'boolean' && key){
      return this.result;
    }

    if(this.result[key] === undefined){
      return def;
    }
    return this.result[key]
  }
}

module.exports = Validator