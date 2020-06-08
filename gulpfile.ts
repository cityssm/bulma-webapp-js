import * as gulp from "gulp";
import * as minify from "gulp-minify";

/*
 * Minify public/javascripts
 */

function jsMinFn () {

  return gulp.src("src/*.js", { allowEmpty: true })
    .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
    .pipe(gulp.dest('dist'))
}


gulp.task("javascript-min", jsMinFn)

/*
 * Watch
 */

function watchFn() {
  gulp.watch("src/*.js", jsMinFn);
}

gulp.task("watch", watchFn);

/*
 * Initialize default
 */

gulp.task("default",function() {
  jsMinFn();
  watchFn();
});
