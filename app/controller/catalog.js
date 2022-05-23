'use strict';

const Controller = require('egg').Controller;

const Service = 'catalog';

class CatalogController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {
      media_type: {
        type: 'number',
        required: true,
        allowEmpty: false,
      }, // 目录的类型
      upload_type: {
        type: 'number',
        required: true,
        allowEmpty: false,
      }, // 目录上传的形式，1是手动上传，2是绑定现有素材
      name: {
        type: 'string',
        required: true,
        allowEmpty: false,
      }, // 目录名
      alias: {
        type: 'string',
        required: true,
        allowEmpty: false,
      }, // 目录别名
      vedio: {
        type: 'string',
        required: true,
        allowEmpty: false,
      }, // 目录绑定素材key
    };
  }

  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const res = await service[Service].show(id);
    const data = {
      ...res._doc,
      id: res._id,
    };
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: data });
  }
  async index() {
    const { ctx, service } = this;
    const payload = ctx.query;
    const res = await service[Service].findList(payload);
    ctx.helper.success({ ctx, res });
  }
  async create() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(this.createRule);
    // 组装参数
    const payload = ctx.request.body || {};

    const { vedio } = payload;
    const videourl = ctx.helper.getQiniuImgUrl(vedio);
    const video_img_url = payload.media_type === 3 ? await ctx.helper.getQiniuVideoImg(vedio) : '';
    const data = {
      media_type: payload.media_type, // 目录的类型
      upload_type: payload.upload_type, // 目录上传的形式，1是手动上传，2是绑定现有素材
      name: payload.name, // 目录名
      alias: payload.alias, // 目录别名
      play_time: payload.play_time,
      video_media_id: payload.vedio, // 目录绑定素材key
      desc: payload.desc,
      video_type: payload.media_type,
      video_url: videourl,
      video_img_url,
      course_id: ctx.params.id,
    };
    // 调用 Service 进行业务处理
    await service[Service].create(data);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: 'ok', msg: '添加成功' });
  }
  async update() {
    const { ctx, service } = this;
    ctx.validate(this.createRule);
    // 组装参数
    const payload = ctx.request.body || {};

    const { vedio } = payload;
    const videourl = ctx.helper.getQiniuImgUrl(vedio);
    const video_img_url = payload.media_type === 3 ? await ctx.helper.getQiniuVideoImg(vedio) : '';

    const data = {
      media_type: payload.media_type, // 目录的类型
      upload_type: payload.upload_type, // 目录上传的形式，1是手动上传，2是绑定现有素材
      name: payload.name, // 目录名
      alias: payload.alias, // 目录别名
      play_time: payload.play_time,
      video_media_id: payload.vedio, // 目录绑定素材key
      desc: payload.desc,
      video_type: payload.media_type,
      video_url: videourl,
      video_img_url,
      course_id: ctx.params.courseId,
    };
    data._id = ctx.params.id;
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
  async binppt() {
    const { ctx, service } = this;
    ctx.validate({
      images: {
        type: 'array',
        required: true,
        allowEmpty: false,
      }, // 目录的类型
    });
    // 组装参数
    const payload = ctx.request.body || {};

    const imgs = payload.images.map(item => {
      return {
        ...item,
        url: item.media_real_url,
      };
    });

    const data = {
      ppt: imgs,
    };
    data._id = ctx.params.id;
    // 调用 Service 进行业务处理
    await service[Service].update(data);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: 'ok', msg: '绑定成功' });
  }
  async pdftoimg() {
    const { ctx } = this;
    const payload = ctx.request.body || {};
    try {
      const res = await ctx.helper.pdftoimg(payload.media_id);
      ctx.helper.success({ ctx, res });
    } catch (error) {
      ctx.helper.error({ ctx, res: 'ok', msg: error.message || '转换失败' });
    }
  }
}

module.exports = CatalogController;
