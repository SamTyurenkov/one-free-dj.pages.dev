"use strict";

global.$ = {
    path: {
        task: require("./gulp/path/tasks.js"),
    },
    gulp: require("gulp"),
    browserSync: require("browser-sync").create(),
    clearSource: true,
};

$.path.task.forEach(function (taskPath) {
    require(taskPath)();
});

$.gulp.task(
    "default",
    $.gulp.series(
        //    'clean',
        $.gulp.parallel(
            "scss:libs",
            "scss:global",
            "scripts:libs",
            "scripts:global",
            "imgs",
            "webp"
        ),
        $.gulp.parallel("watch", "serve")
    )
);

$.gulp.task(
    "styles",
    $.gulp.series(
        $.gulp.parallel(
            "scss:libs",
            "scss:global",
        )
    )
);

$.gulp.task(
    "scripts",
    $.gulp.series(
        $.gulp.parallel(
            "scripts:libs",
            "scripts:global",
        )
    )
);

$.gulp.task("imgs", $.gulp.series($.gulp.parallel("imgs")));
$.gulp.task("webp", $.gulp.series($.gulp.parallel("webp")));