'use strict';

// app.js
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
    // 例如：参数中的密码是加密的，在此处进行解密
    // this.app.config.mysql.password = decrypt(this.app.config.mysql.password);
    // // 例如：插入一个中间件到框架的 coreMiddleware 之间
    // const statusIdx = this.app.config.coreMiddleware.indexOf('status');
    // this.app.config.coreMiddleware.splice(statusIdx + 1, 0, 'limit');
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务
    // 例如：创建自定义应用的示例
    // this.app.queue = new Queue(this.app.config.queue);
    // await this.app.queue.init();
    // // 例如：加载自定义的目录
    // this.app.loader.loadToContext(path.join(__dirname, 'app/tasks'), 'tasks', {
    // fieldClass: 'tasksClasses',
    // });
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    // 例如：从数据库加载数据到内存缓存
    // this.app.cacheData = await this.app.model.query(QUERY_CACHE_SQL);
  }

  async didReady() {
    // 应用已经启动完毕

    const ctx = await this.app.createAnonymousContext();
    const { Users, Feedback } = this.app.model;
    const count = await Users.count();
    const password = await ctx.genHash('12345678');
    if (count === 0) {
      await Users.create({
        name: 'admin', // 姓名
        password,
        showName: '管理员',
        practice_total_num: 0,
        practice_week_num: 0,
        total_time: 0,
        user_show_name: '管理员',
        username: 'admin',
        week_time: 0,
      });
      await Feedback.create({
        content: '播放卡顿',
        imgs: [],
        title: '这里有问题',
        user_show_name: '叶宁',
        username: 'yen',
      });
    }
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
    // this.app.server.on('timeout', socket => {
    // // handle socket timeout
    // });
  }
}

module.exports = AppBootHook;
