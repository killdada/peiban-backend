'use strict';
const { Service } = require('egg');

const Model = 'Feedback';

class FeedbackService extends Service {
  async findAll() {
    return this.ctx.model[Model].find();
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
  async export() {
    return await this.service.actionToken.verify();
  }
}
module.exports = FeedbackService;
