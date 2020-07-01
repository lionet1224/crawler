/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  // config.env = 'prod';

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'crawler',
    timezone: '+08:00',
    logging: false,
    define: {
      // create_time && update_time
      timestamps: true,
      // delete_time
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      // 把驼峰命名转换为下划线
      underscored: true,
      charset: 'utf8mb4'
    }
  }

  return {
    ...config,
  };
};
