/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1568813519599_4473";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  let mongoUrl = "mongodb://127.0.0.1:27017/peiban";
  try {
    // 如果运行的是docker容器，那么连接docker容器里面的mongodb
    const argv = process.argv.slice(2);
    const argvs = JSON.parse(argv[0]);
    if (argvs.docker === 1) {
      mongoUrl = "mongodb://mongo:27017/peiban";
    }
  } catch (error) {
    //
  }

  config.mongoose = {
    url: mongoUrl,
    duplicateErrorCode: 11000,
    options: {},
  };

  config.cors = {
    // credentials: true,
    origin:
      process.env.NODE_ENV === "production"
        ? "https://peiban.yenmysoft.com.cn"
        : "http://localhost:8888",
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
  };

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [
      "http://localhost:8888",
      "https://peiban.yenmysoft.com.cn",
    ],
  };

  config.jwt = {
    secret: "yenda",
  };

  config.alinode = {
    server: "wss://agentserver.node.aliyun.com:8080",
    appid: "81994",
    secret: "3268d25d0f8365b3497cbfb5bc6d89c93dafdc39",
  };

  return {
    ...config,
    ...userConfig,
  };
};
