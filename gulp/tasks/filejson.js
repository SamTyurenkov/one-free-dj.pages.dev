// var gulp = require('gulp');
// var fc2json = require('gulp-file-contents-to-json');

// module.exports = function () {
//     gulp.task('filejson', function () {
//         gulp.src('build/**/*')
//             .pipe(fc2json('contents.json'))
//             .pipe(gulp.dest('./build/'));
//     });
// }
var gulp = require('gulp');
var filenamesToJSON = require("filenames-to-json");


filePATH = {
    "input": ["./build"],
}

async function runFilenamesToJSON() {
    var fileJson = await filenamesToJSON('./build/', './build/contents.json');
    // imageminJpegRecompress = (await import('imagemin-jpeg-recompress')).default;
    // pngquant = (await import('imagemin-pngquant')).default;
}

module.exports = function () {
    gulp.task('filejson', async function () {
        await runFilenamesToJSON();
        return $.gulp.src(filePATH.input)
        .pipe($.gulp.dest(filePATH.input));

    });
}