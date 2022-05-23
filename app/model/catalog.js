'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema, model } = mongoose;
  return model(
    'Catalog',
    new Schema({
      alias: String, // 目录别名
      course_id: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      }, // 目录所属课程ID,
      desc: String, // 目录描述
      name: String, // 目录名
      play_time: String, // 目录时长
      video_media_id: String, // 目录七牛Key
      video_img_url: String, // 目录视频截图
      video_url: String, // 目录绑定的素材真正的播放地址
      video_type: Number, // 目录类型，3视频2音频
      upload_type: Number, // 目录绑定的素材是通过手动还是直接绑定，1手动 2绑定
      ppt: Array,
    }, {
      versionKey: false,
      timestamps: true,
    })
  );
};
