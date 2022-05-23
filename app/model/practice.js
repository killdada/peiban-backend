'use strict';

// 课程练习
module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema, model } = mongoose;
  return model(
    'Practice',
    new Schema({
      category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      }, // 练习所属分类ID
      category_name: String, // 练习所属分类名称
      course_id: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      }, // 练习所属课程id
      course_name: String, // 练习所属课程名称
      lastest_practice_reply: String, // 最新练习的回复
      practice_num: Number, // 总的练习回复数
      topic: String, // 练习的主题
      publisher: String, // 练习的发起人
    })
  );
};
