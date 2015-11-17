var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var fileinclude = require('gulp-file-include');
var bS = require('browser-sync').create();
var dist = './dist';
var distCSS = './dist/assets/css';
var nunjucksRender = require('gulp-nunjucks-render');
var notify = require("gulp-notify");

var onError = function(err) {
  console.log(err);
};

gulp.task('init', function() {
  bS.init({
    server: {
      baseDir: dist
    }
  });

  gulp.watch('./src/assets/css/**/*', ['sass']);
  gulp.watch('./src/views/**/*.html', ['layout']);
  gulp.watch(['./dist/**/*.html'], bS.reload);
});



gulp.task('fonts', function() {
  return gulp.src(['./src/assets/fonts/*.*'])
    .pipe(gulp.dest('./dist/assets/fonts/'));
});


gulp.task('layout', function() {
  nunjucksRender.nunjucks.configure(['./src/views/']);
  return gulp.src(['./src/views/pages/*.html', '!./src/views/layout.html'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(nunjucksRender())
    .pipe(gulp.dest('./dist'));
});


gulp.task('sass', function() {
  return gulp.src('./src/assets/css/main.scss')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass())
    .pipe(gulp.dest(distCSS))
    .pipe(bS.stream());
});

gulp.task('default', ['init']);
