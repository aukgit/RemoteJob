const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('css/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('css'));
});


gulp.task('watch',() => {
  gulp.watch('css/sass/**/*.scss',['sass']);
});

gulp.task('default',['sass','watch']);
