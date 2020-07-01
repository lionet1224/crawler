const { USER } = require("../../common/auth");
const bcrypt = require('bcryptjs')
const moment = require('moment')

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: STRING(32),
      allowNull: false,
      unique: 'uid',
      comment: '加密id'
    },
    username: {
      type: STRING(64),
      allowNull: false,
      comment: '用户名称'
    },
    email: {
      type: STRING(128),
      unique: 'email',
      allowNull: false,
      comment: '用户邮箱'
    },
    password: {
      type: STRING,
      set(val) {
        // 加密
        const salt = bcrypt.genSaltSync(10)
        const pwd = bcrypt.hashSync(val, salt)
        this.setDataValue('password', pwd)
      },
      allowNull: false,
      comment: '用户密码'
    },
    scope: {
      type: STRING(10),
      defaultValue: USER,
      allowNull: false,
      comment: '用户权限'
    },
    portrait: {
      type: STRING(128),
      allowNull: true,
      comment: '头像'
    },
    token: {
      type: STRING(256),
      allowNull: true
    },
    refresh_token: {
      type: STRING(256),
      allowNull: true
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

  return User;
}