let plumber = require("gulp-plumber"),
    sass = require("gulp-sass")(require("sass")),
    concat = require("gulp-concat-css"),
    prefix = require("gulp-autoprefixer"),
    minifyCSS = require("gulp-minify-css"),
    postcss = require("gulp-postcss"),
    postcssLogical = require("postcss-logical"),
    postcssDirPseudoClass = require("postcss-dir-pseudo-class");

stylesPATH = {
    input: "./src/css/",
    output: "./build/css/",
};

module.exports = function () {

    $.gulp.task("scss:libs", function () {
        return $.gulp
            .src([
                "./node_modules/swiper/swiper-bundle.min.css",
               ])
            .pipe(concat("libs.css"))
            .pipe(minifyCSS())
            .pipe($.gulp.dest(stylesPATH.output))
            .pipe($.browserSync.stream());
    });
    $.gulp.task("scss:global", function () {
        return $.gulp
            .src(stylesPATH.input + "*.scss")
            .pipe(sass())
            .pipe(prefix("last 3 versions"))
            .pipe(concat("styles.css"))
            .pipe(minifyCSS())
            .pipe($.gulp.dest(stylesPATH.output))
            .pipe($.browserSync.stream());
    });
};
