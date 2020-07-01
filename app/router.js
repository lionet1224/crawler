'use strict';

const { USER, Auth, ADMIN, SP_ADMIN } = require("../common/auth");

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  app.beforeStart(async () => {
    await app.model.sync({alter: true});
  })

  // 验证码
  router.post('/api/authcode', controller.authcode.create);
  // 上传图片
  router.post('/api/upload/image', new Auth(ADMIN).m, controller.tools.saveImage);
  // 仪表盘数据
  router.get('/api/dashboard', new Auth(ADMIN).m, controller.tools.dashboard);

  // 登录
  router.post('/api/login', controller.auth.login)
  // 登出
  router.post('/api/logout', new Auth(USER).m, controller.auth.logout);

  // 注册
  router.post('/api/users', new Auth(0).m, controller.users.create);
  // 获取用户信息
  router.get('/api/users/:uid', controller.users.show);
  // 获取自己的信息
  router.get('/api/users', new Auth(USER).m, controller.users.me);
  // 修改用户信息
  router.post('/api/users/update', new Auth(USER).m, controller.users.update);
  // 获取用户列表
  router.get('/api/users/list', new Auth(SP_ADMIN).m, controller.users.index);
  // 用户权限设置

  // 创建项目
  router.post('/api/project', new Auth(ADMIN).m, controller.project.create);
  // 删除项目
  router.post('/api/project/delete', new Auth(ADMIN).m, controller.project.delete);
  // 获取项目列表
  router.get('/api/project', new Auth(ADMIN).m, controller.project.index);
  // 修改项目
  router.post('/api/project/update', new Auth(ADMIN).m, controller.project.update);
  // 获取项目
  router.get('/api/project/:pid', new Auth(ADMIN).m, controller.project.show)

  // 创建爬虫分类
  router.post('/api/reptile/type', new Auth(ADMIN).m, controller.reptileType.create);
  // 获取项目下所有分类
  router.get('/api/reptile/type', new Auth(0).m, controller.reptileType.index)
  // 获取分类下的爬虫
  router.get('/api/reptile/type/:rid', new Auth(0).m, controller.reptileType.show);
  // 删除分类
  router.post('/api/reptile/type/delete', new Auth(ADMIN).m, controller.reptileType.delete);
  // 修改分类
  router.post('/api/reptile/type/update', new Auth(ADMIN).m, controller.reptileType.update);

  // 获取爬虫信息
  router.get('/api/reptile/detail/:rid', new Auth(ADMIN).m, controller.reptile.show);
  // 创建爬虫
  router.post('/api/reptile', new Auth(ADMIN).m, controller.reptile.create);
  // 执行爬虫
  router.post('/api/reptile/run', new Auth(0).m, controller.reptile.index);
  // 修改爬虫
  router.post('/api/reptile/update', new Auth(ADMIN).m, controller.reptile.update);
  // 删除爬虫
  router.post('/api/reptile/delete', new Auth(ADMIN).m, controller.reptile.delete);
  // 模拟执行爬虫
  router.post('/api/reptile/run/mock', new Auth(ADMIN).m, controller.reptile.mock);
  // 获取日志粗略数据
  router.get('/api/reptile/log/dashboard', new Auth(ADMIN).m, controller.reptileLog.log);
  // 获取日志列表
  router.get('/api/reptile/log/list', new Auth(ADMIN).m, controller.reptileLog.logList);
  // 获取单个日志数据
  router.get('/api/reptile/log/detail/:id', new Auth(ADMIN).m, controller.reptileLog.show);

  // 创建配置
  router.post('/api/config', new Auth(SP_ADMIN).m, controller.config.create);
  // 获取配置
  router.get('/api/config/:key', new Auth(SP_ADMIN).m, controller.config.show);
  // 修改配置
  router.post('/api/config/update', new Auth(SP_ADMIN).m, controller.config.update);
  // 删除配置
  router.post('/api/config/delete', new Auth(SP_ADMIN).m, controller.config.delete);
  // 配置列表
  router.get('/api/config', new Auth(SP_ADMIN).m, controller.config.index);

  // 创建定时任务
  router.post('/api/schedule', new Auth(ADMIN).m, controller.schedule.create);
  // 修改定时任务
  router.post('/api/schedule/update', new Auth(ADMIN).m, controller.schedule.update);
  // 删除定时任务
  router.post('/api/schedule/delete', new Auth(ADMIN).m, controller.schedule.delete);
  // 定时任务列表
  router.get('/api/schedule/list', new Auth(ADMIN).m, controller.schedule.index);
};
