var gulp = require('gulp')
var babel = require('gulp-babel')
var watch = require('gulp-watch')
var plumber = require('gulp-plumber')

var src = 'src/*.js'
var target = 'build'

gulp.task('compile', function () {
  return gulp.src(src)
    .pipe(watch(src, {verbose: true}))
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest(target))
})
