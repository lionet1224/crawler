const moment = require('moment')

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const ReptileLog = app.model.define('reptileLog', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: STRING(128),
      allowNull: false,
      comment: '运行类型'
    },
    set: {
      type: TEXT,
      allowNull: true,
      comment: '爬虫当时的配置'
    },
    status: {
      type: STRING(32),
      allowNull: false,
      defaultValue: '1',
      comment: '运行状态，1正常，2错误'
    },
    errorMsg: {
      type: TEXT,
      allowNull: true,
      comment: '错误时的错误信息'
    },
    proxy: {
      type: STRING(32),
      allowNull: false,
      defaultValue: '2',
      comment: '是否命中代理ip，1是，2否'
    },
    cache: {
      type: STRING(32),
      allowNull: false,
      defaultValue: '2',
      comment: '是否命中缓存，1是，2否'
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

  ReptileLog.associate = () => {
    ReptileLog.belongsTo(app.model.User, {
      foreignKey: 'user_id', targetKey: 'id', as: 'user'
    })
    ReptileLog.belongsTo(app.model.Reptile, {
      foreignKey: 'reptile_id', targetKey: 'id', as: 'reptile'
    })
    ReptileLog.belongsTo(app.model.Schedule, {
      foreignKey: 'schedule_id', targetKey: 'id', as: 'schedule'
    })
    ReptileLog.hasOne(app.model.ReptileData, {
      foreignKey: 'reptile_log_id', targetKey: 'id', as: 'data'
    })
  }

  return ReptileLog;
}