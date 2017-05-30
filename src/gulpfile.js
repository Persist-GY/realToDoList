//img压缩插件 
var gulp = require('gulp')
var imgmin = require('gulp-imagemin')
gulp.task('imgmin', function(){ 
 gulp.src('./bg.jpg')
    .pipe(imgmin())
    .pipe(gulp.dest('./bgCompress.jpg'));
});
