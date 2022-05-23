'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async login() {
    const userLoginRule = {
      name: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
      password: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
    };
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(userLoginRule);
    // 组装参数
    const payload = ctx.request.body || {};
    // 调用 Service 进行业务处理
    const res = await service.users.login(payload);
    if (res.access_token) {
      ctx.helper.success({ ctx, res });
    } else {
      ctx.helper.error({ ctx, msg: res.msg });
    }
  }
  async loginOut() {
    const { ctx, service } = this;
    // 调用 Service 进行业务处理
    await service.users.logout();
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
}

module.exports = LoginController;
