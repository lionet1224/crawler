class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async didReady() {
    // 应用已经启动完毕

    // 启动时初始化定时任务
    const ctx = await this.app.createAnonymousContext();
    ctx.service.schedule.init();

    // 初始化配置数据表
    ctx.service.config.init();
  }
}

module.exports = AppBootHook;