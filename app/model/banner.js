'use strict';

// banner轮播图  banner实际跟课程绑定，课程ID是必填的，课程id和分类id绑定，更新创建的时候通过课程ID找到了所属分类的数据，然后填充进去了，后续涉及到切换课程id的都需这样处理，因为现在的列表页返回的结果，没有去通过课程查分类，都是直接返回的
module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema, model } = mongoose;
  return model(
    'Banner',
    new Schema({
      category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      }, // banner所属分类ID
      category_name: String, // banner所属分类名称
      course_id: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      }, // banner所属课程id
      course_name: String, // banner所所属课程名称
      img_media_url: String, // 图片地址
      img_media_id: String, // 存储到七牛云的图片ID
    })
  );
};
