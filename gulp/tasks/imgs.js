let imagemin,
imageminGifsicle = require('imagemin-gifsicle'),
// mozjpg = require('imagemin-mozjpg'),
optipng = require('imagemin-optipng'),
imageminJpegRecompress = require('imagemin-jpeg-recompress'),
pngquant = require('imagemin-pngquant'),
cache = require('gulp-cache'),
rimraf = require('rimraf'),
plumber = require('gulp-plumber');
webp = require('gulp-webp');

imgPATH = {
    "input": ["./src/images/**/*.{png,jpg,gif,svg,jpeg}"],
    "output": "./build/images/"
}


async function loadModules() {
    imagemin = (await import('gulp-imagemin')).default;
    // imageminJpegRecompress = (await import('imagemin-jpeg-recompress')).default;
    // pngquant = (await import('imagemin-pngquant')).default;
}
loadModules();

module.exports = function() {
    $.gulp.task('imgs', async () => {
        await loadModules();
        return $.gulp.src(imgPATH.input)
        .pipe(plumber())
        .pipe(imagemin([
            imageminGifsicle({
                interlaced: true
            }),
            imageminJpegRecompress({
                loops: 4,
                min: 85,
                max: 100,
                quality: 'high'
            }),
           optipng({
                optimizationLevel: 3
            }),
            pngquant({
                quality: [0.95, 1],
                speed: 5
            })
        ], {
            verbose: true
        }))
        .pipe($.gulp.dest(imgPATH.output));
    });

    $.gulp.task('webp', () => {
        return $.gulp.src([imgPATH.output + "*.{png,jpg,jpeg}"])
        .pipe(plumber())
        .pipe(webp())
        .pipe($.gulp.dest(imgPATH.output))
    });
};
