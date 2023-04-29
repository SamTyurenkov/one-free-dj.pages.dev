let
  babel = require('gulp-babel'),
  webpack = require('webpack-stream'),
  minify = require("gulp-uglify"),
  gulpif = require("gulp-if"),
  concat = require("gulp-concat"),
  strip = require("gulp-strip-comments"),
  corejs = require("core-js/stable"),
  regeneratorRuntime = require("regenerator-runtime"),
  scriptsPATH = {
    input: "./src/js/",
    output: "./build/js/",
  };

module.exports = function () {

  $.gulp.task("scripts:global", () => {
    return $.gulp
      .src([scriptsPATH.input + "*.js"])
      .pipe(
        webpack({
          //entry: ['babel-polyfill'],
          mode: 'development',
          devtool: false,
          module: {
            // rules: [
            //   {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //       loader: 'babel-loader',
            //       options: {
            //         presets: ['@babel/preset-env']
            //       }
            //     }
            //   }
            // ]
          }
        })
      )
      .pipe(
        babel({
          presets: ["@babel/preset-env"],
        })
      )
      .pipe(concat("scripts.js"))
      .pipe($.gulp.dest(scriptsPATH.output))
      .pipe($.browserSync.stream());
  });

  $.gulp.task("scripts:libs", () => {
    return $.gulp
      .src([
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/swiper/swiper-bundle.min.js",
      ])
      .pipe(
        babel({
          presets: ["@babel/preset-env"],
        })
      )
      //.pipe(minify())
      .pipe(concat("libs.js"))
      .pipe($.gulp.dest(scriptsPATH.output))
      .pipe($.browserSync.stream());
  });
};
