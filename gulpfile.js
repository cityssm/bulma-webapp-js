"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gulp = require("gulp");
var minify = require("gulp-minify");
function jsMinFn() {
    return gulp.src("src/*.js", { allowEmpty: true })
        .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
        .pipe(gulp.dest('dist'));
}
gulp.task("javascript-min", jsMinFn);
function watchFn() {
    gulp.watch("src/*.js", jsMinFn);
}
gulp.task("watch", watchFn);
gulp.task("default", function () {
    jsMinFn();
    watchFn();
});
