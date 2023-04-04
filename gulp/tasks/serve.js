module.exports = function() {
    $.gulp.task('serve', function() {
        $.browserSync.init({
           // proxy: "E:/WORDPRESS/one_free_dj/index.html" //::1 pbg.local
        })
    });
};