'use strict';

var path = require('path');
var crisper = require('crisper');
var oassign = require('object-assign');

function getDestPath(filepath) {
  var basename = path.basename(filepath, path.extname(filepath));
  var base = path.dirname(path.resolve(process.cwd(), filepath));
  var dest = {};

  ['html', 'js'].forEach(function(type) {
    var name = basename + '.' + type;
      dest[type] = {
      base: base,
      path: path.join(base, name),
      name: name
    };
  });

  return dest;
}

module.exports = function (grunt) {
  grunt.registerMultiTask('crisper', '', function () {
    var options = this.options({
      cleanup: true
    });

    this.files.forEach(function (file) {
      var contents = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(file) {
        var content = grunt.file.read(file);

        if (options.cleanup) {
          grunt.log.warn('Source file "' + file + '" will be removed');
          grunt.file.delete(file);
        }

        return content;
      }).join('\n');

      var destpath = getDestPath(file.dest);
      var split = crisper(oassign({}, {
        source: contents,
        jsFileName: destpath.js.name
      }, options));

      grunt.file.write(destpath.html.path, split.html);
      grunt.file.write(destpath.js.path, split.js);
    });
  });
};
