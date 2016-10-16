var gulp = require('gulp'),
    gulputil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify');

gulp.task('browserify', function () {
    return browserify('./src/main/webapp/js/app/app.js')
        .bundle()
        .on('error', function(e){
            gulputil.log(e);
        })
        .pipe(source('index.js'))
        .pipe(gulp.dest('./src/main/webapp/js'))
});

gulp.task('watch', function() {
    gulp.watch('src/main/webapp/js/app/*.js', ['browserify']);
});

gulp.task('default', ['browserify']);