'use strict';

const Controller = require('egg').Controller;

class UploadController extends Controller {

  async getUploadToken() {
    const { ctx } = this;
    const res = await ctx.helper.getQiniuUploadToken();
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = UploadController;
