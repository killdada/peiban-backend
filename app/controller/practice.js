'use strict';

const Controller = require('egg').Controller;

const Service = 'practice';

class PracticeController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {
      course_id: {
        type: 'string',
        required: true,
        allowEmpty: false,
      }, // 课程id
      topic: {
        type: 'string',
        required: true,
        allowEmpty: false,
      }, // 练习的主题
      publisher: {
        type: 'string',
        required: true,
        allowEmpty: false,
      }, // 练习的发起人
    };
  }

  async replyList() {
    const { ctx } = this;
    ctx.helper.success({
      ctx, res: {
        per_page: 10,
        total: 0,
        data: [],
      },
    });
  }

  // 获取可以绑定的课程列表，对于已经绑定过课程的练习，不能再绑定同一个课程了
  async getbind() {
    const { ctx, service } = this;
    // 获取已经有的所有的练习列表,和所有的课程列表数据，然后进行过滤组合
    const list = await service[Service].findAll();
    const courses = await service.lesson.getAll();
    const result = [];
    courses.forEach(item => {
      if (!list.find(list => list.course_id.equals(item._id))) {
        // 没有绑定过该课程
        result.push({
          id: item._id,
          name: item.name,
        });
      }
    });
    ctx.helper.success({ ctx, res: result });
  }

  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const res = await service[Service].show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    const res = await service[Service].findList(payload);
    ctx.helper.success({ ctx, res });
  }
  async create() {
    const { ctx, service } = this;
    // 校验参数
    // eslint-disable-next-line no-empty
    ctx.validate(this.createRule);
    // 组装参数
    const payload = ctx.request.body || {};
    const { course_id, topic, publisher } = payload;
    const lesson = await service.lesson.show(course_id);

    const data = {
      course_id,
      category_name: lesson.name,
      category_id: lesson.category_id,
      course_name: lesson.cateory_name,
      lastest_practice_reply: '',
      practice_num: 0, // 总的练习回复数
      topic, // 练习的主题
      publisher, // 练习的发起人
    };
    // 调用 Service 进行业务处理
    await service[Service].create(data);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: 'ok', msg: '添加成功' });
  }
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service[Service].destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
}

module.exports = PracticeController;
