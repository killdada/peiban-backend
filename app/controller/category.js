'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {
      name: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
      sort_val: {
        type: 'number',
        required: true,
        allowEmpty: false,
      },
    };
  }

  async getAll() {
    const { ctx, service } = this;
    // 调用 Service 进行业务处理
    const res = await service.category.getAll();
    // 设置响应内容和响应状态码
    const data = res.map(item => {
      return { categoryId: item._id, categoryName: item.name };
    });
    ctx.helper.success({ ctx, res: data });
  }

  async checkHasLessonAndCatalog() {
    const { ctx, service } = this;
    const lessons = await service.lesson.findLessonListByCategoryId(ctx.params.id);
    let result = false;
    if (lessons && lessons.length) {
      for (const item of lessons) {
        const catalogs = await service.catalog.findByCourseId(item.id || item._id);
        if (catalogs.length) {
          result = true;
          break;
        }
      }
    }
    return result;
  }


  async publish() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    const data = await this.checkHasLessonAndCatalog();
    if (data) {
      // 调用 Service 进行业务处理
      const res = await service.category.publish(id);
      // 设置响应内容和响应状态码
      ctx.helper.success({ ctx, res });
    } else {
      ctx.helper.error({ ctx, msg: '该分类没有课程，或者课程下面没有目录' });
    }
  }

  async down() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const res = await service.category.down(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const res = await service.category.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    const res = await service.category.findList(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
  async create() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(this.createRule);
    // 组装参数
    const payload = ctx.request.body || {};
    // 调用 Service 进行业务处理
    try {
      await service.category.create(payload);
      ctx.helper.success({ ctx, res: 'ok', msg: '添加成功' });
    } catch (error) {
      if (error.code === this.config.mongoose.duplicateErrorCode) {
        ctx.helper.error({ ctx, msg: '分类名称重复' });
      } else {
        ctx.helper.error({ ctx, msg: error.message });
      }
    }
  }
  async update() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(this.createRule);
    // 组装参数
    const payload = ctx.request.body || {};
    try {
      await service.category.update(payload);
      ctx.helper.success({ ctx, res: 'ok', msg: '更新成功' });
    } catch (error) {
      if (error.code === this.config.mongoose.duplicateErrorCode) {
        ctx.helper.error({ ctx, msg: '分类名称重复' });
      } else {
        ctx.helper.error({ ctx, msg: error.message });
      }
    }
  }
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.category.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
}

module.exports = CategoryController;
