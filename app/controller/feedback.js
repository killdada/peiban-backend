'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const xlsx = require('node-xlsx').default;

const Service = 'feedback';

class FeedbackController extends Controller {
  async index() {
    const { ctx, service } = this;
    const payload = ctx.query;
    const res = await service[Service].findList(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
  async export() {
    const { ctx, service } = this;
    // 调用 Service 进行业务处理
    try {
      // 检查有没有授权
      await service.users.export();
      const res = await service[Service].findAll();
      const data = [[ '姓名', '帐号', '标题', '内容', '反馈时间', '图片' ]];
      res.forEach(item => {
        data.push([
          item.user_show_name,
          item.username,
          item.title,
          item.content,
          ctx.helper.formatTime(item.createdAt),
          '',
        ]);
      });
      const options = {
        '!cols': [
          { wch: 6 },
          { wch: 6 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
        ],
      };
      const filename = '用户反馈.xlsx';
      const buffer = xlsx.build([{ name: '反馈记录', data }], options); // Returns a buffer
      // 保存文件
      fs.writeFileSync(filename, buffer, 'binary');
      // 格式必须，否则前端下载解析不出来excel格式
      ctx.attachment(filename);
      ctx.set('Content-Type', 'text/xml');
      ctx.body = fs.readFileSync(filename);
      fs.unlinkSync(filename);
    } catch (error) {
      ctx.helper.error({ ctx, msg: error.message });
    }
  }
}

module.exports = FeedbackController;
