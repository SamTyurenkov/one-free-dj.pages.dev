module.exports = function() {
    $.gulp.task('watch', function(){
        $.gulp.watch('./src/css/*.scss',{usePolling:true},$.gulp.series('styles'));
        $.gulp.watch('./src/js/*.js',$.gulp.series('scripts'));
        $.gulp.watch('./src/images/*.{png,jpg,gif,svg,jpeg}',$.gulp.series('imgs'));
        $.gulp.watch('./build/images/*.{png,jpg,jpeg}',$.gulp.series('webp'));
    });
};
