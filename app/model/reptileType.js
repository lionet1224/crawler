const moment = require('moment')

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const ReptileType = app.model.define('ReptileType', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rid: {
      type: STRING(32),
      allowNull: false,
      comment: '加密id'
    },
    name: {
      type: STRING(128),
      allowNull: false,
      comment: '分类名'
    },
    public: {
      type: STRING(32),
      allowNull: false,
      defaultValue: '1',
      comment: '是否公开，1公开，2不公开'
    },
    describe: {
      type: STRING(255),
      allowNull: true,
      comment: '分类说明'
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

  ReptileType.associate = () => {
    ReptileType.belongsTo(app.model.Project, {
      foreignKey: 'project_id', targetKey: 'id', as: 'project'
    })
    ReptileType.hasMany(app.model.Reptile, {
      foreignKey: 'type_id', targetKey: 'id', as: 'reptile'
    })
  }

  return ReptileType;
}