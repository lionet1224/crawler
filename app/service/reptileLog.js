const Service = require('egg').Service;
const moment = require('moment')

class ReptileLogService extends Service{
  async create(data){
    const { ReptileLog } = this.ctx.model;

    try{
      return await ReptileLog.create(data.get(true));
    }catch(err){
      this.ctx.logger.error(`记录爬虫执行时发生错误: ${err}`)
    }
  }

  async log(data){
    const { ReptileLog, Reptile, Schedule } = this.ctx.model;

    let logs = {};
    let rid = data.get('rid', null);
    let sid = data.get('sid', null);
    let type = data.get('type', 'month');

    if(rid){
      const reptile = await Reptile.findOne({
        where: {
          rid: rid
        }
      })
      if(!reptile) throw new NotFound('爬虫不存在');
      rid = reptile.id;
    }
    if(sid){
      const schedule = await Schedule.findOne({
        where: {
          sid: sid
        }
      })
      if(!schedule) throw new NotFound('定时任务不存在');
      sid = schedule.id;
    }
    
    await this.ctx.model.query(`
      ${
        type == 'year' ? 'select * from reptile_logs where YEAR(created_at)=YEAR(NOW())'
          : 'SELECT * FROM reptile_logs where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(created_at)'
      }
      ${rid ? `and reptile_id = ${rid}` : ''}
      ${sid ? `and schedule_id = ${sid}` : ''}
    `, {
      model: ReptileLog,
    }).then(res => {
      logs = this.ctx.helper.classify(res, type);
    })

    let filter =  {
    };
    if(rid){
      filter.reptile_id = rid;
    }
    if(sid){
      filter.schedule_id = sid;
    }

    const success = await ReptileLog.findAndCountAll({
      where: {
        ...filter,
        status: 1,
      }
    })
    const error = await ReptileLog.findAndCountAll({
      where: {
        ...filter,
        status: 2
      }
    })

    return {
      date: logs,
      meta: {
        success: success.count,
        error: error.count,
        type
      }
    };
  }

  async logList(data){
    const { ReptileLog, Reptile, Schedule, ReptileData } = this.ctx.model;

    let rid = data.get('rid', null);
    let sid = data.get('sid', null);
    let filter = {};

    if(rid){
      const reptile = await Reptile.findOne({
        where: {
          rid: rid
        }
      })
      if(!reptile) throw new NotFound('爬虫不存在');
      filter.reptile_id = reptile.id;
    }
    if(sid){
      const schedule = await Schedule.findOne({
        where: {
          sid: sid
        }
      })
      if(!schedule) throw new NotFound('定时任务不存在');
      filter.schedule_id = schedule.id;
    }

    let size = 10;
    let page = parseInt(data.get('page', 1));

    const reptileLog = await ReptileLog.findAndCountAll({
      where: filter,
      limit: size,
      offset: (page - 1) * size,
      order: [['created_at', data.get('order', 'desc')]],
      attributes: {
        exclude: ['deleted_at', 'set', 'reptile_id', 'schedule_id', 'user_id']
      },
      include: [{
        model: Reptile,
        as: 'reptile',
        attributes: {
          exclude: ['deleted_at', 'user_id', 'type_id', 'id', 'set']
        }
      }, {
        model: Schedule,
        as: 'schedule',
        attributes: {
          exclude: ['deleted_at', 'user_id', 'id']
        }
      }, {
        model: ReptileData,
        as: 'data',
        attributes: ['id']
      }]
    })

    return this.ctx.helper.listData(reptileLog, size, page);
  }

  async show(data){
    const { ReptileLog, Reptile, Schedule } = this.ctx.model;

    const reptileLog = await ReptileLog.findOne({
      where: {
        id: data.get('id')
      },
      attributes: {
        exclude: ['deleted_at', 'reptile_id', 'schedule_id', 'user_id']
      },
      include: [{
        model: Reptile,
        as: 'reptile',
        attributes: {
          exclude: ['deleted_at', 'user_id', 'type_id', 'id', 'set']
        }
      }, {
        model: Schedule,
        as: 'schedule',
        attributes: {
          exclude: ['deleted_at', 'user_id', 'id']
        }
      }]
    })

    if(!reptileLog) throw new NotFound('日志不存在');

    return reptileLog;
  }
}

module.exports = ReptileLogService;