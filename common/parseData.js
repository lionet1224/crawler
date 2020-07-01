class Parse{
  constructor(res, set){
    this.res = res;
    this.set = set;
    this.error = null;

    this.parse();
  }

  parse(){
    try{
      this.result = this.parseMain(null, null, this.set.type);
    } catch(err){
      console.log(err);
      this.error = '解析数据时发生错误';
    }
  }

  getCurrent(){
    let type = this.set.type;
    return type == 'api' ? this.res.data : type == 'dom' ? this.res.data('html') : this.res.data;
  }

  parseMain(set, data, type = 'dom'){
    let result = {};
    let field = set || this.set.field;

    Object.keys(field).forEach(key => {
      let val = field[key];
      let valType = typeof val;
      let rules = valType == 'string' ? val.split('|') : val[0].split('|');
      let current = data || this.getCurrent();

      rules.map(rule => {
        let data = rule.split(':');
        let keys = data[1] && data[1].split(',');

        if(type == 'api'){
          current = this.parseApi(data, keys, current);
        } else if(type == 'dom'){
          current = this.parseDom(data, keys, current);
        }
      })

      if(valType == 'string'){
        result[key] = val ? current : null;
      } else {
        let _this = this;
        let list = [];
        if(type == 'api'){
          current.slice(val[2] || 0).map(item => {
            list.push(this.parseMain(val[1], item, type));
          })
        } else if(type == 'dom'){
          current.slice(val[2] || 0).each(function(){
            list.push(_this.parseMain(val[1], _this.res.data(this), type));
          })
        }

        result[key] = list;
      }
    })

    return result;
  }

  parseApi(data, keys, current){
    switch(data[0]){
      case 'v':
        keys.map(k => current = current[k]);
        break;
      case 'list':
        current = current.map(item => this.keyDatas(item, keys));
        break;
      case 'index':
        current = current[data[1]];
        break;
      case 'keys':
        current = this.keyDatas(current, keys);
        break;
      case 'headers':
        return this.res.headers[data[1]]
    }
    return current;
  }

  parseDom(data, keys, current){
    switch(data[0]){
      case 'v':
        keys.map(k => current = current.find(k.replace(/\&gt;/g, '>')));
        break;
      case 'index':
        current = current.eq(data[1]);
        break;
      case 'attr':
        current = current.attr(data[1]);
        break;
      case 'text':
        current = current.text();
        break;
      case 'html':
        current = current.html();
        break;
      case 'remove':
        current.find(data[1]).remove();
        break;
      case 'replace':
        current = current.replace(new RegExp(keys[0], keys[2] || 'g'), keys[1] || '');
        break;
      case 'headers':
        return this.res.headers[data[1]]
    }
    return current;
  }

  keyDatas(data, keys){
    let result = {}
    keys.map(key => {
      result[key] = data ? data[key] : null;
    })
    return result;
  }

  get(){
    return this.result;
  }
}

module.exports = Parse;