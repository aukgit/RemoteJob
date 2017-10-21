'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');

gulp.task('sass', function () {
  return gulp.src('css/scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('css')).pipe(plumber());
});


gulp.task('watch',() => {
  gulp.watch('css/scss/**/*.scss',['sass']);
});

gulp.task('default',['sass','watch']);
