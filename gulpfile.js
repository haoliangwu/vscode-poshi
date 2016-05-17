var gulp = require('gulp')
var babel = require('gulp-babel')
var plumber = require('gulp-plumber')
var mocha = require('gulp-mocha')
var clean = require('gulp-clean')

var src = 'src/**/*.js'
var testSrc = 'src/test/**Spec.js'
var target = 'lib'
var testTarget = 'lib/test'

gulp.task('clean', function () {
  return gulp.src([target, testTarget])
    .pipe(clean())
})

gulp.task('compile', function () {
  return gulp.src(src)
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest(target))
})

gulp.task('compileTest', function () {
  return gulp.src(testSrc)
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest(testTarget))
})

gulp.task('test', ['compileTest', 'compile'], function () {
  var handleError = function (err) {
    console.log(err.toString())
    this.emit('end')
  }

  return gulp.src('lib/test/**/*Spec.js')
    .pipe(mocha(
      {
        reporter: 'spec'
      }))
    .on('error', handleError)
})

gulp.task('default', ['clean'], function () {
  gulp.start('test')

  return gulp.watch([src, testSrc], ['test'])
})
