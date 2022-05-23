'use strict';
/* eslint-disable */
const exec = require('child_process').exec;
const tmp = require('tmp');
const fs = require('fs');
const filesource = require('./filesource');
let initialized = false;
const pdfPageCount = require('./pdfPageCount.js');

// Add Ghostscript executables path
let projectPath = __dirname.split('\\');
projectPath.pop();
projectPath = projectPath.join('\\');

exports.ghostscriptPath = projectPath + '\\executables\\ghostScript';

// for linux compability
exports.ghostscriptPath = exports.ghostscriptPath.split('\\').join('/');

function getPageCount(callback, filepathOrData) {
	pdfPageCount.count(filepathOrData, function (resp2) {
		if (!resp2.success) {
			console.log('Something went wrong: ' + resp2.error);

			return;
		}
		callback(resp2);
	});
}


function getImage(callback, options, imageFilepath, resp, i) {
	exec('gs -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=png16m -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r' +
		options.quality +
		' -dFirstPage=' + i +
		' -dLastPage=' + i +
		' -sOutputFile=' + imageFilepath +
		' ' +
		'"' + resp.data + '"', function (error, stdout, stderr) {
			// Remove temp files
			resp.clean();

			if (error !== null) {

				callback({ success: false, error: 'Error converting pdf to png: ' + error });
				return;
			}

			if (options.returnFilePath) {
				callback({ success: true, data: imageFilepath });
				return;
			}

			const img = fs.readFileSync(imageFilepath);

			// Remove temp file
			fs.unlinkSync(imageFilepath);

			callback({ success: true, data: img, number: i });
		});

}

exports.convert = function () {

	const filepathOrData = arguments[0];
	// return;
	let callback = arguments[1];

	let options = {};

	const tmpFileCreated = false;

	if (arguments[2] != null) {
		options = arguments[1];
		callback = arguments[2];
	}

	if (!initialized) {
		if (!options.useLocalGhostscript) {
			process.env.Path += ';' + exports.ghostscriptPath;
		}

		initialized = true;
	}

	options.quality = options.quality || 100;

	filesource.getDataPath(filepathOrData, function (resp) {
		if (!resp.success) {
			callback(resp);
			return;
		}

		getPageCount(function (resp2) {
			// get temporary filepath
			for (let i = 1; i <= resp2.data; i++) {

				var result = new Object();
				result.data = [];
				var her = 1;
				tmp.file({ postfix: '.png' }, function (err, imageFilepath, fd) {

					if (err) {

						callback({ success: false, error: 'Error getting second temporary filepath: ' + err });
						return;
					}
					getImage(function (resp3) {
						// result.data.push(resp3.data);
						result.data = resp3.data;
						result.imgNum = resp3.number;
						result.success = resp3.success;
						callback(result);

					}, options, imageFilepath, resp, her++);
				});


			}
		}, filepathOrData);

	});
};
