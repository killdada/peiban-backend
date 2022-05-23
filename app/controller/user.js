'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const xlsx = require('node-xlsx').default;

class UsersController extends Controller {
  async record() {
    const { ctx } = this;
    ctx.helper.success({
      ctx, res: {
        sum: 0,
        list: [],
      },
    });
  }
  async create() {
    const rule = {
      sex: {
        type: 'string',
        required: true,
        message: '必填项',
      },
      name: {
        type: 'string',
        required: true,
        message: '必填项',
      },
    };
    const data = this.ctx.request.body;
    await this.ctx.validate(rule, data);
    // this.ctx.body = await this.service[Modal].create(data);
  }
  async index() {
    const { ctx, service } = this;
    // 调用 Service 进行业务处理
    const payload = ctx.query;
    const res = await service.users.findList(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
  async export() {
    const { ctx, service } = this;
    // 调用 Service 进行业务处理
    try {
      // 检查有没有授权
      await service.users.export();
      const res = await service.users.findAll();
      const data = [
        [
          '姓名',
          '帐号',
          '本周学习时长',
          '累计学习时长',
          '本周练习次数',
          '累计练习次数',
        ],
      ];
      const formatLearnTime = ctx.helper.formatLearnTime;
      res.forEach(item => {
        data.push([
          item.user_show_name,
          item.username,
          formatLearnTime(item.week_time),
          formatLearnTime(item.total_time),
          item.practice_week_num,
          item.practice_total_num,
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
      const filename = '用户清单.xlsx';
      const buffer = xlsx.build([{ name: '学习统计', data }], options); // Returns a buffer
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

module.exports = UsersController;
