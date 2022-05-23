'use strict';

const path = require('path');
const fs = require('fs');

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // 纯静态资源方式和eggjs结合，eggjs提供静态资源功能并且提供代理转发
    // 注意当多页面项目情况下需要配置多个前缀路由
    const { ctx } = this;
    ctx.response.type = 'html';
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/index.html'));
  }
}

module.exports = HomeController;

