'use strict';

// 课程类别
module.exports = app => {
  const mongoose = app.mongoose;
  return mongoose.model(
    'Category',
    new mongoose.Schema({
      name: {
        type: String,
        unique: true,
      }, // 分类名称
      sort_val: Number, // 排序
      status: Number, // 分类的状态 0 刚创建的草稿状态，1：已发布，2：已下架
    })
  );
};
