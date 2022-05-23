'use strict';
const { Service } = require('egg');

const Model = 'Material';

class MaterialService extends Service {
  async create(list) {
    return await this.ctx.model[Model].insertMany(list);
  }
  async update({
    _id,
    ...update
  } = {}) {
    return this.ctx.model[Model].update({
      _id,
    }, update);
  }
  async findList({ pageSize, page, media_type,
    show_name } = {}) {
    const { QueryPage } = this.ctx.helper;
    const model = this.ctx.model[Model];
    const reg = new RegExp(show_name, 'i'); // 不区分大小写
    const query = {
      show_name: { $regex: reg },
    };
    if (media_type && media_type !== '') {
      query.media_type = media_type;
    }

    const result = await QueryPage({
      page,
      pageSize,
    }, () => {
      return model.find(query);
    });
    return result;
  }
  async findAll() {
    return this.ctx.model[Model].find();
  }
}
module.exports = MaterialService;
