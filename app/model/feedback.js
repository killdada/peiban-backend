'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  return mongoose.model(
    'Feedback',
    new mongoose.Schema(
      {
        content: String,
        imgs: Array,
        title: String,
        user_show_name: String,
        username: String,
      },
      {
        versionKey: false,
        timestamps: true,
      }
    )
  );
};
