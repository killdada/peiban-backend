'use strict';

// 课程类别 category_id 分类id必填
module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema, model } = mongoose;

  return model(
    'Lesson',
    new Schema({
      catalogs: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Catalog',
        },
      ],
      // catalog_num: Number, // 目录的总数 需要通过
      category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      }, // 分类ID
      cateory_name: String, // 分类名称
      category: String, // 不改动已有接口适配，有些接口之前不合理，分类名称, 注意创建课程的时候目前前端这里category代表id,更新的时候用的是category_id
      desc: String, // 课程描述
      img: String, // 图片地址
      img_media_id: String, // 存储到七牛云的图片ID
      lector: String, // 讲师名称
      name: {
        type: String,
        unique: true,
      }, // 课程名称
      status: Number, // 课程状态 0 开始状态，2已下架，1已发布
    })
  );
};
