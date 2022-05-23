'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  return mongoose.model('Users', new mongoose.Schema({
    name: String, // 姓名
    password: String,
    showName: String,
    practice_total_num: Number,
    practice_week_num: Number,
    total_time: Number,
    user_show_name: String,
    username: String,
    week_time: Number,
  }, {
    versionKey: false,
    timestamps: true,
  }));
};
