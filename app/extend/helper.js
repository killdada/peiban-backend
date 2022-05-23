/* eslint-disable no-unused-vars */
"use strict";

const moment = require("moment");
const qiniu = require("qiniu");
const pdf2png = require("../../pdftoimg.js");
const qiniuConfig = require("../../qiniu.js");

// 格式化时间
const formatTime = (time) => moment(time).format("YYYY-MM-DD HH:mm:ss");

const formatLearnTime = (time) => {
  const n = parseInt(time, 10);
  const a = parseInt(n / 60, 10); // 多少分钟
  const b = n % 60; // 余数秒
  if (a >= 60) {
    const c = a % 60; // 余数分
    const d = parseInt(a / 60, 10); // 多少小时
    return `${d}时${c}分${b}秒`;
  }
  return `${a}分${b}秒`;
};

// 处理成功响应
const success = ({ ctx, res = null, msg = "请求成功" }) => {
  ctx.body = {
    code: 200,
    data: res,
    msg,
  };
  ctx.status = 200;
};

const error = ({ ctx, res = null, msg = "请求失败", code = -1 }) => {
  ctx.body = {
    code,
    data: res,
    msg,
  };
  ctx.status = 200;
};

const Typeof = (obj) => {
  const types = [
    "Array",
    "Function",
    "Boolean",
    "Date",
    "Number",
    "Object",
    "RegExp",
    "String",
    "Window",
    "HTMLDocument",
  ];
  const result = {};
  for (const type of types) {
    const typeStr = Object.prototype.toString.call(obj) === `[object ${type}]`;
    if (typeStr) {
      const method = `is${type}`;
      result[method] = true;
      break;
    }
  }
  return result;
};

const QueryPage = async ({ page = 1, pageSize = 20 }, callback) => {
  page = +page;
  pageSize = +pageSize;
  if (!Typeof(page).isNumber) {
    page = 1;
  }
  if (!Typeof(pageSize).isNumber) {
    pageSize = 20;
  }
  if (page < 1) {
    page = 1;
  }
  if (pageSize <= 0) {
    pageSize = 20;
  }
  if (pageSize > 1000) {
    pageSize = 1000;
  }
  const count = await callback().count();
  const rows = await callback()
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  const data = rows.map((item) => {
    const { __v, _id, ...other } = item._doc;
    return {
      ...other,
      id: _id,
      created_at: formatTime(item.createdAt || 0),
    };
  });
  return {
    per_page: pageSize,
    pageSize,
    page,
    current_page: page,
    count,
    total: count,
    sum: count,
    list: data,
    data,
  };
};

const filterQuery = (query = {}) => {
  const result = {};
  Object.keys(query).forEach((key) => {
    if (query[key]) {
      result[key] = query[key];
    }
  });
  return result;
};

const getQiniuUploadToken = async () => {
  const { accessKey, secretKey, bucket, expires } = qiniuConfig;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: bucket,
    expires,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const token = putPolicy.uploadToken(mac);
  return {
    expire: expires,
    qiniu_token: token.replace("<PLEASE APPLY YOUR ACCESS KEY>:", ""),
  };
};

const getQiniuImgUrl = (key) => {
  const { accessKey, secretKey, domain } = qiniuConfig;

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const config = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, config);

  // 公开空间访问链接
  const publicDownloadUrl = bucketManager.publicDownloadUrl(domain, key);
  return publicDownloadUrl;
};

const getQiniuFileInfo = (key) => {
  const { accessKey, secretKey, bucket } = qiniuConfig;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const config = new qiniu.conf.Config();
  // config.useHttpsDomain = true;
  config.zone = qiniu.zone.Zone_z0;
  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  return new Promise((resolve, reject) => {
    bucketManager.stat(bucket, key, (err, respBody, respInfo) => {
      if (err) {
        reject(err);
      } else {
        if (respInfo.statusCode === 200) {
          resolve(respBody);
        } else {
          reject(respBody.error);
        }
      }
    });
  });
};

const getQiniuVideoImgTask = (key, savekey) => {
  const { accessKey, secretKey, bucket } = qiniuConfig;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const config = new qiniu.conf.Config();
  const operManager = new qiniu.fop.OperationManager(mac, config);
  // 处理指令集合
  const fops = [
    "vframe/jpg/offset/10|saveas/" +
      qiniu.util.urlsafeBase64Encode(`${bucket}:${savekey}`),
  ];
  const pipeline = "myapp";

  const options = {
    force: false,
  };

  // 持久化数据处理返回的是任务的persistentId，可以根据这个id查询处理状态
  return new Promise((resolve, reject) => {
    operManager.pfop(
      bucket,
      key,
      fops,
      pipeline,
      options,
      (err, respBody, respInfo) => {
        if (err) {
          reject(err);
        }
        if (respInfo.statusCode === 200) {
          resolve(respBody.persistentId);
        } else {
          reject(respBody.error);
        }
      }
    );
  });
};

const getQiniuVideoImg = (key) => {
  return new Promise((resolve, reject) => {
    const savekey = `${key}1.jpg`;
    getQiniuVideoImgTask(key, savekey)
      .then((persistentId) => {
        const config = new qiniu.conf.Config();
        const operManager = new qiniu.fop.OperationManager(null, config);
        // 持久化数据处理返回的是任务的persistentId，可以根据这个id查询处理状态
        operManager.prefop(persistentId, (err, respBody, respInfo) => {
          if (err) {
            reject(err);
          }
          if (respInfo.statusCode === 200) {
            console.log(respBody.inputBucket);
            console.log(respBody.inputKey);
            console.log(respBody.pipeline);
            console.log(respBody.reqid);
            resolve(getQiniuImgUrl(savekey));
          } else {
            reject(respBody.error);
          }
        });
      })
      .catch((e) => {
        reject(e);
      });
  });
};

const pdftoimg = async (key) => {
  try {
    const url = getQiniuImgUrl(key);
    const res = await pdf2png(url); // 获得转换后的文件buffer数组
    const config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z2;
    // 是否使用https域名
    // config.useHttpsDomain = true;
    // 上传是否使用cdn加速
    // config.useCdnDomain = true;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const data = await getQiniuUploadToken();
    const uploadToken = data.qiniu_token;

    const result = [];
    return new Promise((resolve, reject) => {
      res.forEach((item, i) => {
        formUploader.put(
          uploadToken,
          `${key}${i}.png`,
          item,
          putExtra,
          (respErr, respBody, respInfo) => {
            if (respErr) {
              reject(respErr);
            }
            if (respInfo.statusCode === 200) {
              result.push({
                media_id: respBody.key,
                url: getQiniuImgUrl(respBody.key),
              });
            } else {
              reject(respBody.error);
            }
            if (result.length === res.length) {
              resolve(result);
            }
          }
        );
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  getQiniuUploadToken,
  getQiniuVideoImg,
  getQiniuImgUrl,
  getQiniuFileInfo,
  pdftoimg,
  filterQuery,
  QueryPage,
  Typeof,
  success,
  error,
  formatTime,
  formatLearnTime,
};
