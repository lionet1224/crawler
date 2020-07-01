const moment = require('moment')

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const Config = app.model.define('config', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: STRING(32),
      allowNull: false,
      comment: '配置key'
    },
    value: {
      type: STRING(255),
      allowNull: true,
      comment: '配置内容'
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

  return Config;
}