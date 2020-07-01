const Service = require('egg').Service;
const schedule = require('node-schedule');
const { NotFound } = require('../../common/http-exception');
const { SP_ADMIN } = require('../../common/auth');
const schedulesList = {};

class ScheduleService extends Service{
  async init(){
    const { Schedule, User } = this.ctx.model;
    let schedules = await Schedule.findAll({
      where: {
        status: 1
      }
    })

    if(!schedules) return;

    schedules.map(item => {
      this.define(item);

      if(item.startUp == 1){
        this.run(item);
      }
    })
  }

  async create(data){
    const { Schedule, Reptile } = this.ctx.model;
    let reptile = await Reptile.findOne({
      where: {
        rid: data.get('rid')
      }
    });

    if(!reptile) throw new NotFound('没有找到对应的爬虫');

    let result = await Schedule.create({
      name: data.get('name'),
      describe: data.get('describe'),
      cron: data.get('cron'),
      query: data.get('query'),
      user_id: this.ctx.auth.id,
      rid: reptile.rid,
      sid: this.ctx.helper.createID(),
    })

    this.define(result);

    return result;
  }

  async define(data){
    try{
      schedulesList[data.sid] && schedulesList[data.sid].cancel();
      schedulesList[data.sid] = schedule.scheduleJob(data.cron, () => {
        this.run(data);
      })
      this.logger.info(`定时任务<${data.name || '未知名字'}>成功定时`);
    } catch(err){
      this.ctx.logger.error(`定时任务发生错误： ${err}`);
    }
  }

  async run(data){
    // 执行时,将权限修改为创建人对应的权限
    this.ctx.auth = {scope: SP_ADMIN}
    this.service.reptile.run(new this.ctx.helper.Validator({
      rid: data.rid,
      cache: 'false',
      set: data.dataValues.set
    }), data.id)
  }

  async cancel(data){
    if(!data || !schedulesList[data.sid]) return;
    schedulesList[data.sid] && schedulesList[data.sid].cancel();
    schedulesList[data.sid] = null;
    this.logger.info(`定时任务<${data.name || '未知名字'}>成功关闭`);
  }

  async update(data){
    const { Schedule, User } = this.ctx.model;

    const schedule = await Schedule.findOne({
      where: {
        sid: data.get('sid')
      },
      attributes: {
        exclude: ['deleted_at', 'user_id']
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['uid', 'username', 'created_at', 'updated_at', 'portrait', 'scope']
      }]
    })

    if(!schedule) throw new NotFound('这个定时任务不存在');

    let prevStatus = schedule.status;

    await schedule.update({
      cron: data.get('cron', schedule.cron),
      name: data.get('name', schedule.name),
      describe: data.get('describe', schedule.describe),
      query: data.get('query', schedule.query),
      status: data.get('status', schedule.status)
    });

    if(schedule.status != prevStatus){
      if(schedule.status == 1){
        this.define(schedule);
      } else {
        this.cancel(schedule)
      }
    }

    return schedule;
  }

  async delete(data){
    const { Schedule } = this.ctx.model;

    const schedule = await Schedule.findOne({
      where: {
        sid: data.get('sid')
      },
    })

    if(!schedule) throw NotFound('定时任务不存在');

    this.cancel(schedule);
    await schedule.destroy();
  }

  async index(){
    const { Schedule, User, ReptileLog } = this.ctx.model;

    const schedule = await Schedule.findAll({
      attributes: {
        exclude: ['deleted_at', 'user_id', 'id']
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['uid', 'username', 'created_at', 'updated_at', 'portrait', 'scope']
      }, {
        model: ReptileLog,
        as: 'log',
        limit: 1,
        order: [['created_at', 'desc']],
        attributes: ['created_at']
      }]
    })

    schedule.map(item => {
      item.dataValues.nomarl = !!schedulesList[item.sid];
      delete item.dataValues.id;
    })

    return schedule;
  }
}

module.exports = ScheduleService;