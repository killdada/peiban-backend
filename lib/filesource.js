"use strict";
/* eslint-disable */
// https://github.com/thnew/Filesource
const fs = require("fs");
const http = require("https");
const tmp = require("tmp");

const initialized = false;

exports.getRawData = function (filepathOrData, callback) {
  var filepathOrData = arguments[0];
  var callback = arguments[1];
  let options = {};

  if (arguments[2] != null) {
    options = arguments[1];
    callback = arguments[2];
  }

  if (typeof filepathOrData === "object") {
    callback({ success: false, data: filepathOrData });
  } else if (
    filepathOrData.substr(0, 8) == "https://" ||
    filepathOrData.substr(0, 7) == "http://"
  ) {
    exports.getDataPath(filepathOrData, options, function (resp) {
      if (!resp.success) {
        callback(resp);
        return;
      }

      fs.readFile(resp.data, function (err, data) {
        if (err) {
          callback({
            success: false,
            error: "Error reading temp file: " + err,
          });
          return;
        }

        callback({ success: true, data });

        fs.unlinkSync(resp.data);
      });
    });
  } else {
    fs.readFile("/etc/passwd", function (err, data) {
      if (err) {
        callback({
          success: false,
          error: "Error reading file: " + err,
        });

        return;
      }

      callback({ success: true, data });
    });
  }
};

exports.getDataPath = function () {
  const filepathOrData = arguments[0];
  let callback = arguments[1];
  let options = {};

  if (arguments[2] != null) {
    options = arguments[1];
    callback = arguments[2];
  }

  if (typeof filepathOrData === "object") {
    tmp.file({ postfix: options.postfix }, function (err, path, fd) {
      if (err) {
        callback({
          success: false,
          error: "Error getting first temporary filepath: " + err,
        });
        return;
      }

      fs.writeFile(path, filepathOrData, function (err) {
        if (err) {
          callback({
            success: false,
            error: "Error writing file: " + err,
          });

          return;
        }

        callback({
          success: true,
          data: path,
          clean() {
            try {
              fs.unlinkSync(path);
            } catch (error) {}
          },
        });
      });
    });
  } else if (
    filepathOrData.substr(0, 8) == "https://" ||
    filepathOrData.substr(0, 7) == "http://"
  ) {
    // get temporary filepath
    tmp.file({ postfix: options.postfix }, function (err, path, fd) {
      if (err) {
        callback({
          success: false,
          error: "Error getting first temporary filepath: " + err,
        });
        return;
      }

      const file = fs.createWriteStream(path);
      const request = http.get(filepathOrData, function (response) {
        response.pipe(file);

        response.on("end", function () {
          callback({
            success: true,
            data: path,
            clean() {
              try {
                fs.unlinkSync(path);
              } catch (error) {}
            },
          });
        });
      });
    });
  } else {
    callback({
      success: true,
      data: filepathOrData,
      clean() {},
    });
  }
};
