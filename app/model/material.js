'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const { Schema, model } = mongoose;
  return model(
    'Material',
    new Schema({
      // bucket_name: String, // 上传到七牛云空间的bucket_name
      // duration: Number,
      media_id: String, // 上传的素材id
      media_type: Number, // 素材类型 3视频 2 音频 1 其他
      media_url: String, // 素材的地址
      show_name: String, // 素材的标题
      size: Number, // 素材的大小
      // type: Number,
    }, {
      versionKey: false,
      timestamps: true,
    })
  );
};
