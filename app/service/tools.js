const Service = require('egg').Service;
const moment = require('moment')
const mkdirp = require('mkdirp');
const path = require('path');
const { AuthFailed, ServerError } = require('../../common/http-exception');
const fs = require('fs');

class ToolcodeService extends Service{
  async getUploadFileDir(filename, ext = []){
    let time = moment(new Date()).format('YYYYMMDD');
    let dir = path.join(this.config.uploadDir, time);
    await mkdirp(dir);
    let date = Date.now();
    let pathExt = path.extname(filename);
    if(!ext.includes(pathExt)) throw new AuthFailed('文件格式不允许，只允许: (' + ext.join(',') + ') 格式文件')
    let uploadDir = path.join(dir, date + pathExt);

    return uploadDir;
  }

  async saveImage(){
    let file = this.ctx.request.files && this.ctx.request.files[0];
    if(!file) throw new AuthFailed('没有图片');
    let exts = await this.ctx.service.config.show('upload-image-extname', false, {list: ['.jpg', '.jpeg', '.png', '.gif']});
    let dir = await this.getUploadFileDir(file.filepath, exts.list);
    let result = fs.readFileSync(file.filepath)
    let maxSize = await this.ctx.service.config.show('upload-image-size', false, {size: 1024 * 1024 * 5})
    console.log(maxSize);

    // 限制5M
    if(result.length > maxSize.size){
      throw new AuthFailed('文件限定 ' + this.ctx.helper.formatBytes(maxSize.size));
    }

    try{
      fs.writeFileSync(dir, result, 'binary');
    }catch(err){
      throw new ServerError('保存图片失败');
    }

    return {
      dir: dir.slice(3).replace(/\\/g, '/')
    };
  }

  async dashboard(){
    const { Project, ReptileType, Reptile } = this.ctx.model;

    const project = await Project.findAndCountAll({
      include: [{
        model: ReptileType,
        as: 'type',
        include: [{
          model: Reptile,
          as: 'reptile'
        }]
      }]
    });
    let reptileNum = 0;

    project.rows.map(async item => {
      reptileNum += item.type.reduce((old, val) => {
        return old += val.reptile.length;
      }, 0);
    })

    // const total = await this.ctx.service.reptileLog.log(new this.ctx.helper.Validator({}));

    return {
      // reptileLog: total.meta,
      reptileNum,
      projectNum: project.rows.length
    }
  }
}

module.exports = ToolcodeService;