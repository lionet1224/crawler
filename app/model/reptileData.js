const moment = require('moment')

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const ReptileData = app.model.define('reptileDatas', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    data: {
      type: TEXT('medium'),
      allowNull: true,
      comment: '存储的数据'
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

  ReptileData.associate = () => {
    ReptileData.belongsTo(app.model.Reptile, {
      foreignKey: 'reptile_id', targetKey: 'id', as: 'reptile'
    })
    ReptileData.belongsTo(app.model.ReptileLog, {
      foreignKey: 'reptileLog_id', targetKey: 'id', as: 'reptileLog'
    })
  }

  return ReptileData;
}