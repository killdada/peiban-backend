"use strict";

const Controller = require("egg").Controller;

const findCatalogs = async (ctx, service, lessonId) => {
  return service.catalog.findByCourseId(lessonId);
};

const addCatalogInfo = async (ctx, service, list) => {
  const result = [];
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    list.forEach(async (item) => {
      const catalogs = await findCatalogs(ctx, service, item.id || item._id);
      result.push({
        ...item,
        catalogs,
        catalog_num: catalogs.length,
      });
      if (result.length === list.length) {
        resolve(result);
      }
    });
  });
};

class LessonController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {
      name: {
        type: "string",
        required: true,
        allowEmpty: false,
      }, // 课程名称
      category: {
        type: "string",
        required: true,
        allowEmpty: false,
      },
      // 课程属于哪个分类下面的分类id
      img: {
        type: "string",
        required: true,
        allowEmpty: false,
      }, // 图片IMGid
      lector: {
        type: "string",
        required: true,
        allowEmpty: false,
      }, // 讲师
    };
  }

  async publish() {
    const { ctx, service } = this;
    const courseId = ctx.params.id;
    const catalogs = await findCatalogs(ctx, service, courseId);
    if (catalogs.length) {
      await service.lesson.publish(courseId);
      ctx.helper.success({ ctx, msg: "发布成功" });
    } else {
      ctx.helper.error({ ctx, msg: "请先为课程增加目录再发布" });
    }
  }

  async down() {
    const { ctx, service } = this;
    const courseId = ctx.params.id;
    await service.lesson.down(courseId);
    ctx.helper.success({ ctx, msg: "下架成功" });
  }

  async getAll() {
    const { ctx, service } = this;
    // 调用 Service 进行业务处理
    const res = await service.lesson.getAll();
    // 设置响应内容和响应状态码
    const data = res.map((item) => {
      return { id: item._id, name: item.name };
    });
    ctx.helper.success({ ctx, res: data });
  }

  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const res = await service.lesson.show(id);
    res.id = res._id;
    res.remark = res.desc;
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    const res = await service.lesson.findList(payload);
    if (res.length) {
      const data = await addCatalogInfo(ctx, service, res.data);
      ctx.helper.success({ ctx, res: { ...res, data } });
    } else {
      ctx.helper.success({ ctx, res });
    }
  }
  async create() {
    const { ctx, service } = this;
    // 校验参数
    // eslint-disable-next-line no-empty
    ctx.validate(this.createRule);
    // 组装参数
    const payload = ctx.request.body || {};
    const imgurl = ctx.helper.getQiniuImgUrl(payload.img);
    const data = {
      category_id: payload.category,
      desc: payload.desc,
      img_media_id: payload.img,
      img: imgurl,
      lector: payload.lector,
      name: payload.name,
      status: 0,
    };
    const category = await service.category.show(payload.category);
    data.cateory_name = category.name;
    data.category = category.name;
    // 调用 Service 进行业务处理
    try {
      await service.lesson.create(data);
      ctx.helper.success({ ctx, res: "ok", msg: "添加成功" });
    } catch (error) {
      if (error.code === this.config.mongoose.duplicateErrorCode) {
        ctx.helper.error({ ctx, msg: "课程名称已存在" });
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
    const imgurl = ctx.helper.getQiniuImgUrl(payload.img);
    const data = {
      category_id: payload.category_id,
      desc: payload.desc,
      img_media_id: payload.img,
      img: imgurl,
      lector: payload.lector,
      name: payload.name,
    };
    const category = await service.category.show(payload.category);
    data.cateory_name = category.name;
    data.category = category.name;
    const { id } = ctx.params;
    data._id = id;
    try {
      await service.lesson.update(data);
      ctx.helper.success({ ctx, res: "ok", msg: "添加成功" });
    } catch (error) {
      if (error.code === this.config.mongoose.duplicateErrorCode) {
        ctx.helper.error({ ctx, msg: "课程名称已存在" });
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
    await service.lesson.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
}

module.exports = LessonController;
