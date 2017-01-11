var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

function errorlog(error) {
    console.error.bind(error);
    this.emit('end');
}

gulp.task('styles', function() {
    var processors = [
      autoprefixer({browsers:['last 2 version']})
    ];

    gulp.src('*.scss')
    .pipe(sass({
        styles: 'expanded'
    })).on('error', errorlog)
    .pipe(postcss(processors))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());

});

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('*.scss', ['styles']);
    gulp.watch('*.html').on("change", reload);
});

gulp.task('default', ['styles', 'watch']);