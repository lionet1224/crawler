const moment = require('moment')

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const Reptile = app.model.define('Reptile', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rid: {
      type: STRING(32),
      unique: 'rid',
      allowNull: false,
      comment: '加密Id'
    },
    name: {
      type: STRING(128),
      allowNull: false,
      comment: '爬虫名'
    },
    set: {
      type: TEXT,
      allowNull: true,
      comment: '爬虫配置'
    },
    logo: {
      type: STRING(255),
      allowNull: true,
      comment: '爬虫logo'
    },
    public: {
      type: STRING(10),
      allowNull: false,
      defaultValue: 1,
      comment: '是否开放，1开放，2关闭'
    },
    status: {
      type: STRING(10),
      allowNull: false,
      defaultValue: 1,
      comment: '状态，1为正常，2为关闭'
    },
    describe: {
      type: STRING(128),
      allowNull: true,
      comment: '这个爬虫的说明'
    },
    scope: {
      type: STRING(32),
      allowNull: false,
      defaultValue: '0',
      comment: '爬虫执行权限'
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

  Reptile.associate = () => {
    Reptile.belongsTo(app.model.User, {
      foreignKey: 'user_id', targetKey: 'id', as: 'user'
    })
    Reptile.belongsTo(app.model.ReptileType, {
      foreignKey: 'type_id', targetKey: 'id', as: 'type'
    })
  }

  return Reptile;
}