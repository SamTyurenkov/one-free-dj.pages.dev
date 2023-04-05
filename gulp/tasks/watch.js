module.exports = function() {
    $.gulp.task('watch', function(){
        $.gulp.watch('./src/css/*.scss',{usePolling:true},$.gulp.series('styles','filejson'));
        $.gulp.watch('./src/js/*.js',$.gulp.series('scripts','filejson'));
        $.gulp.watch('./src/images/*.{png,jpg,gif,svg,jpeg}',$.gulp.series('imgs','filejson'));
        $.gulp.watch('./build/images/*.{png,jpg,jpeg}',$.gulp.series('webp','filejson'));
    });
};
