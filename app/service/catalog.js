'use strict';
const { Service } = require('egg');

const Model = 'Catalog';

class CatalogService extends Service {
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
  async findList({ pageSize, page } = {}) {
    const { QueryPage } = this.ctx.helper;
    const model = this.ctx.model[Model];
    const result = await QueryPage({
      page,
      pageSize,
    }, () => {
      return model.find();
    });
    return result;
  }
  async destroy(_id) {
    return this.ctx.model[Model].findByIdAndRemove(_id);
  }
  async findByCourseId(id) {
    const model = this.ctx.model[Model];
    return model.find({ course_id: id });
  }
}
module.exports = CatalogService;
