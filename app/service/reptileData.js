const reptileData = require('../model/reptileData');

const Service = require('egg').Service;

class ReptileDataService extends Service{
  async create(data){
    const { ReptileData } = this.ctx.model;

    ReptileData.create({
      ...data
    })
  }
}

module.exports = ReptileDataService;