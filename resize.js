var Jimp = require("jimp");
var gutil = require('gulp-util');
var File = require('vinyl');

const PLUGIN_NAME = "gulp-jimp-resize";

function goGoGadgetImageResize (file, opt) {

	var path = file.path;
	var base = file.base;

	var suffix = "";

	if(opt.suffix) { var suffix = "-" + opt.suffix; }
	
	var extension = path.substring(path.lastIndexOf('.'));
	var name = path.substring(path.lastIndexOf('\\')+1, path.lastIndexOf('.')) + suffix + extension;
	if(opt.flattenDirectories === false){
		name = path.substring(0, path.lastIndexOf('.')) + suffix + extension;
	}

	if(!opt.width && !opt.height) { //no resizing to be done
		return new gutil.File({
			path: name,
			base: base,
			contents: file.contents
		})
	}

	var result = new Promise(function(resolve, reject) {
		Jimp.read(file.contents, function (err, image) {
			if (err) {
				reject(err);
				return;
			}

			var width = Jimp.AUTO; var height = Jimp.AUTO;

			if((opt.width && opt.width > image.bitmap.width) || 
				(opt.height && opt.height > image.bitmap.height)) {
				gutil.log(PLUGIN_NAME, 'You are resizing an image to a larger size than the original');
			}

			if(opt.width) { width = opt.width; }

			if(opt.height) { height = opt.height; }
			
			image.resize(width, height).quality(100);
        	
	       	var newImg = image.getBuffer(Jimp.MIME_JPEG, function(err, buffer){
				if (err) {
					reject(err);
					return;
				}

	       		resolve(new gutil.File({
	       			path: name,
					base: base,
	       			contents:buffer
	       		}));
	        });
		});
	})

	return result;
};

module.exports = goGoGadgetImageResize