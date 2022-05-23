'use strict';

const Controller = require('egg').Controller;

const Service = 'material';

const getCreateListData = (list, ctx) => {
  const data = [];
  return new Promise(resolve => {
    list.forEach(async item => {
      const { media_type, media_id, show_name } = item;
      const media_url = ctx.helper.getQiniuImgUrl(media_id);
      const res = await ctx.helper.getQiniuFileInfo(media_id);
      data.push({
        media_id,
        media_type,
        media_url,
        show_name,
        size: res.fsize,
      });
      if (data.length === list.length) {
        resolve(data);
      }
    });
  });
};

class MaterialController extends Controller {
  async index() {
    const { ctx, service } = this;
    // 组装参数
    // 调用 Service 进行业务处理
    const payload = ctx.query || {};
    const res = await service[Service].findList(payload);
    ctx.helper.success({ ctx, res });
  }
  async create() {
    const { ctx, service } = this;
    const payload = ctx.request.body || {};
    const { list } = payload;
    const data = await getCreateListData(list, ctx);
    await service[Service].create(data);
    ctx.helper.success({ ctx, res: 'ok', msg: '添加成功' });
  }
  async update() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.request.body || {};
    payload._id = ctx.params.id;
    // 调用 Service 进行业务处理
    await service[Service].update(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: 'ok', msg: '更新成功' });
  }
  async findAll() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const res = await service[Service].findAll(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = MaterialController;
