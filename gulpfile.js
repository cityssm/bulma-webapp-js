"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gulp = require("gulp");
const minify = require("gulp-minify");
const jsMinFn = () => {
    return gulp.src("src/*.js", { allowEmpty: true })
        .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
        .pipe(gulp.dest('dist'));
};
gulp.task("javascript-min", jsMinFn);
const watchFn = () => {
    gulp.watch("src/*.js", jsMinFn);
};
gulp.task("watch", watchFn);
gulp.task("default", () => {
    jsMinFn();
    watchFn();
});
