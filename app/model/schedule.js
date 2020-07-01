const moment = require('moment')

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const Schedule = app.model.define('schedule', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING(64),
      allowNull: false,
      comment: '定时任务的名字'
    },
    describe: {
      type: STRING,
      allowNull: true,
      comment: '定时任务的描述'
    },
    sid: {
      type: STRING(32),
      allowNull: false,
      comment: '加密id'
    },
    rid: {
      type: STRING(32),
      allowNull: false,
      comment: '爬虫rid'
    },
    cron: {
      type: STRING(32),
      allowNull: false,
      defaultValue: '0 0 * * * *',
      comment: '定时任务的cron对象，默认定时每小时一次'
    },
    status: {
      type: STRING(32),
      allowNull: false,
      defaultValue: '1',
      comment: '是否开启, 1开启，2关闭'
    },
    set: {
      type: STRING,
      allowNull: true,
      comment: '执行爬虫的参数'
    },
    startUp: {
      type: STRING,
      allowNull: false,
      defaultValue: '2',
      comment: '项目启动的时候是否执行, 1是，2否'
    },
    created_at: {
      type: DATE,
      allowNull: false,
      get() {
        return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm')
      }
    },
    updated_at: {
      type: DATE,
      allowNull: false,
      get() {
        return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm')
      }
    },
  })

  Schedule.associate = () => {
    Schedule.belongsTo(app.model.User, {
      foreignKey: 'user_id', targetKey: 'id', as: 'user'
    })
    Schedule.hasMany(app.model.ReptileLog, {
      foreignKey: 'schedule_id', targetKey: 'id', as: 'log'
    })
  }

  return Schedule;
}