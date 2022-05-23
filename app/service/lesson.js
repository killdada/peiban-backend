'use strict';
const { Service } = require('egg');

const Model = 'Lesson';

class LessonService extends Service {
  async getAll() {
    return this.ctx.model[Model].find();
  }
  async create(payload) {
    return await this.ctx.model[Model].create({
      ...payload,
      status: 0,
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
  async publish(_id) {
    return this.ctx.model[Model].update({
      _id,
    }, {
      status: 1,
    });
  }
  async down(_id) {
    return this.ctx.model[Model].update({
      _id,
    }, {
      status: 2,
    });
  }
  async findLessonListByCategoryId(id) {
    const model = this.ctx.model[Model];
    return model.find({ category_id: id });
  }
}
module.exports = LessonService;
