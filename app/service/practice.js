'use strict';
const { Service } = require('egg');

const Model = 'Practice';

class PracticeService extends Service {
  async findAll() {
    return this.ctx.model[Model].find();
  }
  async create(payload) {
    return await this.ctx.model[Model].create({
      ...payload,
    });
  }
  async show(_id) {
    return this.ctx.model[Model].findById(_id);
  }
  async update({ _id, ...update } = {}) {
    return this.ctx.model[Model].update(
      {
        _id,
      },
      update
    );
  }
  async findList({ pageSize, page } = {}) {
    const { QueryPage } = this.ctx.helper;
    const model = this.ctx.model[Model];
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
  async destroy(_id) {
    return this.ctx.model[Model].findByIdAndRemove(_id);
  }
}
module.exports = PracticeService;
