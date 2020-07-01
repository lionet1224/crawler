const jwt = require('jsonwebtoken')
const config = require('../../config/config.default')
const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
const { encodeBase64 } = require('bcryptjs')

const { keys } = config({});

function random(num) {
  return Math.floor(num * Math.random())
}

function createString(data, num) {
  let result = ''
  for (let i = 0; i < num; i++) {
    result += data[random(data.length)]
  }
  return result;
}

function createID(){
  return createString(`0123456789qwertyuiopasdfghjklzxcvbnm`.toLocaleUpperCase(), 32);
}

function createAuthCode() {
  return createString('0123456789', 6)
}

function generateToken(id, uid, scope, ex = 60 * 60 * 24 * 3){
  const token = jwt.sign({
    id, uid, scope
  }, keys, {
    expiresIn: ex
  })
  return token;
}

class HttpDataResolve {
  static success(msg = 'success', code = 200) {
    return {
      msg,
      code
    }
  }

  static json(data, msg = 'success', code = 200) {
    return {
      data,
      msg,
      code
    }
  }

  static data(old, data){
    return {
      ...old, ...data
    }
  }
}

function parsePath(url, data = {}){
  let reg = /\{\s*(\w*)\s*\}/g;
  let query = data.query;
  let isGBK = (data.transform || '').toLocaleUpperCase() == 'GBK';

  url = url ? url.replace(reg, (match, key) => {
    let name = query ? query[key] : '';
    return data.hrefTransform 
      ? (isGBK ? toGBK(name) : encode(name)) 
      : name;
  }) : false;
  
  return url;
}

function awaitTo(promise){
  return promise
    .then(data => [data, null])
    .catch(err => [null, err])
}

class Validator{
  constructor(data){
    this.data = data;
  }

  get(key){
    if(typeof key == 'boolean' && key){
      return this.data;
    }
    return this.data[key];
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function getParams(obj, keys){
  let result = {};
  obj && keys.map(key => {
    obj[key] != undefined && (result[key] = obj[key])
  });
  return result;
}

function isFileExists(p){
  let flag = fs.existsSync(path.join(__dirname, '../public', p.slice(7)));
  return flag;
}

function listData(data, size, page){
  let result = {
    list: data.rows,
    meta: {
      total: data.count,
      page_size: size,
      current_page: page,
      total_pages: Math.ceil(data.count / size)
    }
  };
  return result;
}

function classify(data, type = 'month'){
	let res = {};

	let len = data.length - 1,
		left = 0, right = len;

	while(left < right){
		let lData = process(data[left], type),
			rData = process(data[right], type);

		if(!res[lData]) res[lData] = {success: 0, error: 0}
		if(!res[rData]) res[rData] = {success: 0, error: 0}

		data[left].status == 1 ? res[lData].success++ : res[lData].error++;
		data[right].status == 1 ? res[rData].success++ : res[rData].error++;

		left++
		right--
	}

	function process(val, type){
		let date = new Date(val.created_at);

		let month = date.getMonth() + 1,
			day = date.getDate();


		let arr = {
			'year': `${month}`,
			'month': `${month}-${day}`
		}

		return arr[type];
	}

	return res;
}

function toGBK(str){
  if(str==null || typeof(str)=='undefined' || str=='')
      return '';

  var a = str.toString().split('');

  for(var i=0; i<a.length; i++) {
      var ai = a[i];
      if( (ai>='0' && ai<='9') || (ai>='A' && ai<='Z') || (ai>='a' && ai<='z') || ai==='.' || ai==='-' || ai==='_') continue;
      var b = iconv.encode(ai, 'gbk');
      var e = ['']; // 注意先放个空字符串，最保证前面有一个%
      for(var j = 0; j<b.length; j++)
          e.push( b.toString('hex', j, j+1).toUpperCase() );
      a[i] = e.join('%');
  }
  return a.join('');
}

function encode(url){
  url = encodeURIComponent(url);
  url = url.replace(/\%3A/g, ":");
  url = url.replace(/\%2F/g, "/");
  url = url.replace(/\%3F/g, "?");
  url = url.replace(/\%3D/g, "=");
  url = url.replace(/\%26/g, "&");
  return url;
}

module.exports = {
  createID,
  createString,
  generateToken,
  createAuthCode,
  HttpDataResolve,
  random,
  parsePath,
  awaitTo,
  Validator,
  formatBytes,
  getParams,
  isFileExists,
  listData,
  classify,
  toGBK,
  encode
}