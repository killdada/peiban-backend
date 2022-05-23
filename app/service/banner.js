'use strict';
const { Service } = require('egg');

const Model = 'Banner';

class BannerService extends Service {
  async create(payload) {
    return await this.ctx.model[Model].create({
      ...payload,
    });
  }
  async show(_id) {
    return this.ctx.model[Model].findById(_id);
  }
  async update({
    _id,
    ...update
  } = {}) {
    return this.ctx.model[Model].update({
      _id,
    }, update);
  }
  async findList() {
    return this.ctx.model[Model].find();
  }
  async destroy(_id) {
    return this.ctx.model[Model].findByIdAndRemove(_id);
  }
}
module.exports = BannerService;
