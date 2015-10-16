/*global describe, before, it*/

'use strict';

var path = require('path');
var assert = require('assert');
var grunt = require('grunt');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var opts = grunt.cli.options;

grunt.task.init([]);
grunt.config.init({});
grunt.log.muted = false;
opts.redirect = !opts.silent;

var directory = function directory(dir) {
  return function directory(done) {
    process.chdir(__dirname);
    rimraf(dir, function (err) {
      if (err) {
        return done(err);
      }
      mkdirp(dir, function (err) {
        if (err) {
          return done(err);
        }

        process.chdir(dir);

        // prepare vulcanized file
        grunt.file.copy(path.join(__dirname, 'fixtures/vulcanized.html'),
        path.join(__dirname, 'tmp/app/vulcanized.html'));

        done();
      });
    });
  };
};

describe('Crisper grunt task', function () {

  before(directory('tmp'));

  var targets = {
    dist: {
      options: {
        cleanup: false
      },
      src: 'app/vulcanized.html',
      dest: 'dist/vulcanized-csp.html'
    }
  };

  it('should generates separated js/html files', function () {
    grunt.config('crisper', {dist: targets.dist});
    grunt.task.run('crisper:dist');
    grunt.task.start();

    var html = grunt.file.read(path.join(__dirname, 'tmp/dist/vulcanized-csp.html'));
    var js = grunt.file.read(path.join(__dirname, 'tmp/dist/vulcanized-csp.js'));
    var rex = {
      js: /Polymer\({/,
      html: /<script src=\"vulcanized-csp.js\"><\/script><\/body><\/html>/
    };

    assert(html);
    assert(js);
    assert(rex.html.test(html));
    assert(rex.js.test(js));
  });

  it('should generates separated js/html files', function () {
    // turn on cleanup option
    targets.dist.options.cleanup = true;
    grunt.config('crisper', {dist: targets.dist});
    grunt.task.run('crisper:dist');
    grunt.task.start();

    grunt.file.read(path.join(__dirname, 'tmp/dist/vulcanized-csp.html'));

    assert(!grunt.file.exists(path.join(__dirname, 'tmp/app/vulcanized-csp.html')));
  });
});
