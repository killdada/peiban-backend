'use strict';
const { Service } = require('egg');

const Model = 'Category';

class CategoryService extends Service {
  async getAll() {
    return this.ctx.model[Model].find();
  }
  async publish(_id) {
    // 发布分类需要先检查该分类下面有没有绑定课程并且该课程下有目录,后续增加检验
    return this.ctx.model[Model].update({ _id }, { status: 1 });
  }
  // 下架
  async down(_id) {
    return this.ctx.model[Model].update({ _id }, { status: 2 });
  }
  async create(payload) {
    return await this.ctx.model[Model].create({ ...payload, status: 0 });
  }
  async show(_id) {
    return this.ctx.model[Model].findById(_id);
  }
  async update({ _id, ...update } = {}) {
    return this.ctx.model[Model].update({ _id }, update);
  }
  async findList({ pageSize, page } = {}) {
    const { QueryPage } = this.ctx.helper;
    const model = this.ctx.model[Model];
    const result = await QueryPage({ page, pageSize }, () => {
      return model.find();
    });
    return result;
  }
  async destroy(_id) {
    return this.ctx.model[Model].findByIdAndRemove(_id);
  }

}
module.exports = CategoryService;
