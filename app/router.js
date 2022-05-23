'use strict';

/**
 * @param {Egg.Application} app - egg application
 * resources 命令的路由，后续增加的其他路由注意不能冲突比如练习的
 * 尽量不再去改动前端代码接口去适配，之前php定义的接口很多不合理
 */
module.exports = app => {
  const { router, controller } = app;
  const {
    login,
    user,
    category,
    lesson,
    upload,
    banner,
    practice,
    feedback,
    material,
    catalog,
    home,
  } = controller;
  const api = '/api/v1/backend';

  router.get('/', home.index);

  // 分类，分类下面可以绑定有多个课程
  router.resources('posts', `${api}/category`, app.jwt, category);
  // 分类，分类下面可以绑定有多个课程

  router.put(`${api}/category/publish/:id`, app.jwt, category.publish);
  router.put(`${api}/category/down/:id`, app.jwt, category.down);
  // 获取所有的分类不带分页
  router.get(`${api}/lesson/category`, app.jwt, category.getAll);

  // 课程,课程属于某个分类，课程下面有多个目录

  router.put(`${api}/lesson/list/pub/:id`, app.jwt, lesson.publish);
  router.put(`${api}/lesson/list/down/:id`, app.jwt, lesson.down);
  router.resources('lesson', `${api}/lesson/list`, app.jwt, lesson);
  router.delete(`${api}/lesson/:id`, app.jwt, lesson.destroy);
  // 获取所有的课程不带分页
  router.get(`${api}/lesson/all`, app.jwt, lesson.getAll);

  // 目录管理
  router.get(`${api}/lesson/catalog/:id`, app.jwt, catalog.index);
  router.delete(`${api}/lesson/catalog/:courseId/:id`, app.jwt, catalog.destroy);
  router.post(`${api}/lesson/catalog/:id`, app.jwt, catalog.create);
  router.get(`${api}/lesson/catalog/:courseId/:id`, app.jwt, catalog.show);
  router.put(`${api}/lesson/catalog/:courseId/:id`, app.jwt, catalog.update);
  router.put(`${api}/lesson/catalog/:courseId/:id`, app.jwt, catalog.update);
  router.post(`${api}/lesson/catalog/:courseId/:id/image`, app.jwt, catalog.binppt);
  router.post(`${api}/pdf2png`, app.jwt, catalog.pdftoimg);


  // banner 轮播图
  router.resources('banner', `${api}/carouse`, app.jwt, banner);

  // 课程练习。这里的注意顺序不然会冲突，或者不用resources格式
  router.get(`${api}/practice/can-bind-courses`, app.jwt, practice.getbind);
  router.get(`${api}/practice`, app.jwt, practice.index);
  router.get(`${api}/practice/:id`, app.jwt, practice.show);
  router.post(`${api}/practice/:id`, app.jwt, practice.create); // 课程ID
  router.delete(`${api}/practice/:courseId/:id`, app.jwt, practice.destroy); // 课程ID，练习ID
  router.get(`${api}/practice/reply/:id`, app.jwt, practice.replyList); // 练习的回复列表
  router.delete(`${api}/practice/reply/:practiceId/:replyId`, app.jwt, practice.replyList); // 练习回复的删除

  // 素材管理
  router.get(`${api}/material`, app.jwt, material.index);
  router.get(`${api}/material_all`, app.jwt, material.findAll);
  router.post(`${api}/material`, app.jwt, material.create);
  router.put(`${api}/material/:id`, app.jwt, material.update);


  // 登录校验
  router.post(`${api}/login`, login.login);
  router.post(`${api}/logout`, login.loginOut);

  // 鉴权成功后的回调页面
  router.get(`${api}/user/create`, user.create);
  router.get(`${api}/user/export`, user.export);
  router.get(`${api}/user`, app.jwt, user.index);
  // 用户学习记录
  router.get(`${api}/user/detail/:name`, app.jwt, user.record);

  // 用户反馈
  router.get(`${api}/feedback`, app.jwt, feedback.index);
  router.get(`${api}/feedback/export`, feedback.export);

  router.get(`${api}/qiniu_token`, app.jwt, upload.getUploadToken);
};
