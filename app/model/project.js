const moment = require('moment')

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const Project = app.model.define('project', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pid: {
      type: STRING(32),
      allowNull: false,
      comment: '加密Id'
    },
    name: {
      type: STRING(128),
      allowNull: false,
      comment: '项目名称'
    },
    describe: {
      type: STRING(255),
      allowNull: true,
      comment: '项目描述'
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

  Project.associate = () => {
    Project.belongsTo(app.model.User, {
      foreignKey: 'user_id', targetKey: 'id', as: 'user'
    })
    Project.hasMany(app.model.ReptileType, {
      foreignKey: 'project_id', targetKey: 'id', as: 'type'
    })
  }

  return Project;
}