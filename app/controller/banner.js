'use strict';

const Controller = require('egg').Controller;

const Service = 'banner';

class BannerController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {
      course_id: {
        type: 'string',
        required: true,
        allowEmpty: false,
      }, // 课程id
      img_media_id: {
        type: 'string',
        required: true,
        allowEmpty: false,
      }, // 七牛图片id
    };
  }

  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const res = await service[Service].show(id);
    const data = {
      id: res.id,
      course_id: res.course_id,
      img_media_id: res.img_media_id,
      img_url: res.img_media_url,
    };
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: data });
  }
  async index() {
    const { ctx, service } = this;
    // 组装参数
    // 调用 Service 进行业务处理
    const res = await service[Service].findList();
    const data = res.map(item => {
      // eslint-disable-next-line no-unused-vars
      const {
        // eslint-disable-next-line no-unused-vars
        __v,
        _id,
        ...other
      } = item._doc;
      return {
        ...other,
        id: _id,
      };
    });
    ctx.helper.success({ ctx, res: data });
  }
  async create() {
    const { ctx, service } = this;
    // 校验参数
    // eslint-disable-next-line no-empty
    ctx.validate(this.createRule);
    // 组装参数
    const payload = ctx.request.body || {};
    const { course_id, img_media_id } = payload;
    const imgurl = ctx.helper.getQiniuImgUrl(img_media_id);
    const lesson = await service.lesson.show(course_id);

    const data = {
      img_media_id,
      img_media_url: imgurl,
      course_id,
      category_name: lesson.name,
      category_id: lesson.category_id,
      course_name: lesson.cateory_name,
    };
    // 调用 Service 进行业务处理
    await service[Service].create(data);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: 'ok', msg: '添加成功' });
  }
  async update() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(this.createRule);
    // 组装参数
    const payload = ctx.request.body || {};
    const { course_id, img_media_id } = payload;
    const imgurl = ctx.helper.getQiniuImgUrl(img_media_id);
    const lesson = await service.lesson.show(course_id);
    const data = {
      img_media_id,
      img_media_url: imgurl,
      course_id,
      category_name: lesson.name,
      category_id: lesson.category_id,
      course_name: lesson.cateory_name,
      _id: payload.id,
    };
    // 调用 Service 进行业务处理
    await service[Service].update(data);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: 'ok', msg: '更新成功' });
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

module.exports = BannerController;
