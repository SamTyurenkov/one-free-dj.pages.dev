let minify = require("gulp-uglify"),
  gulpif = require("gulp-if"),
  concat = require("gulp-concat"),
  strip = require("gulp-strip-comments"),
  corejs = require("core-js/stable"),
  regeneratorRuntime = require("regenerator-runtime"),
  scriptsPATH = {
    input: "./src/js/",
    output: "./build/js/",
  };
var babel = require("gulp-babel");

module.exports = function () {

  $.gulp.task("scripts:global", () => {
    return $.gulp
      .src([scriptsPATH.input + "*.js"])
      .pipe(
        babel({
          presets: ["@babel/preset-env"],
        })
      )
      .pipe(minify())
      .pipe(concat("scripts.js"))
      .pipe($.gulp.dest(scriptsPATH.output))
      .pipe($.browserSync.stream());
  });

  $.gulp.task("scripts:libs", () => {
    return $.gulp
      .src([
       "./node_modules/swiper/swiper-bundle.min.js",
       "./node_modules/wavesurfer.js/dist/wavesurfer.min.js",
      ])
      .pipe(
        babel({
          presets: ["@babel/preset-env"],
        })
      )
      .pipe(minify())
      .pipe(concat("libs.js"))
      .pipe($.gulp.dest(scriptsPATH.output))
      .pipe($.browserSync.stream());
  });
};
