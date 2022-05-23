"use strict";
const { Service } = require("egg");

class UserService extends Service {
  async findAll() {
    return this.ctx.model.Users.find();
  }
  async findList({ pageSize, page } = {}) {
    const { QueryPage } = this.ctx.helper;
    const model = this.ctx.model.Users;
    const result = await QueryPage(
      {
        page,
        pageSize,
      },
      () => {
        return model.find();
      }
    );
    return result;
  }
  async logout() {
    //
  }
  async login({ name, password } = {}) {
    const { ctx, service } = this;
    const user = await ctx.model.Users.findOne({ name });
    if (!user) {
      return {
        msg: "用户名错误",
      };
    }
    const verifyPsw = await ctx.compare(password, user.password);
    if (!verifyPsw) {
      return {
        msg: "用户密码错误",
      };
    }
    // 生成Token令牌
    return {
      access_token: await service.actionToken.apply(user._id),
      user_info: {
        UserName: user.showName,
      },
    };
  }
  // eslint-disable-next-line no-unused-vars
  async create({ _id, ...data } = {}) {
    const model = this.ctx.model.Users;
    if (!data.name) {
      return await model.create(data);
    }
    const find = await model.findOne({ name: data.name });

    if (!find) {
      return await model.create(data);
    }
    return this.ctx.throw(417, "账号已存在！");
  }
  async export() {
    return await this.service.actionToken.verify();
  }
}
module.exports = UserService;
