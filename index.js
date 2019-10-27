'use strict';
var uploadcare = require('./lib/uploadcare.js');

hexo.extend.tag.register("uploadcareurl", uploadcare.generateUrl);
