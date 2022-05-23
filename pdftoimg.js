'use strict';

const pdf2png = require('./lib/pdf2png.js');
// const fs = require('fs');

let projectPath = __dirname.split('\\');
projectPath.pop();
projectPath = projectPath.join('\\');

const gsPath = projectPath + '\\executables\\ghostScript';

// Rewrite the ghostscript path
pdf2png.ghostscriptPath = gsPath;


// Most simple example
const pdftoimg = url => {
  const result = [];
  let num = 0;
  return new Promise((resolve, reject) => {
    pdf2png.convert(url, resp => {
      if (!resp.success) { // 有一个错误就直接返回错误
        console.log('Something went wrong: ' + resp.error);
        reject(resp.error);
        return;
      }
      if (!num) { // 第一次的才是总数
        num = resp.imgNum;
      }
      result.push(resp.data);
      if (result.length === num) {
        console.log('所有的已经转换完成还需保存到七牛云', result);
        resolve(result);
      }
      // fs.writeFile('pdf/' + resp.imgNum + '.png', resp.data, function(err) {
      //   if (err) {
      //     console.log(err);
      //   }
      // });
    });
  });

};

// pdftoimg(__dirname + '/test.pdf');

module.exports = pdftoimg;
