import gulp from 'gulp';
import replace from 'gulp-replace';
function sourceCleanFunction() {
    return gulp
        .src('src/*.js', { allowEmpty: true })
        .pipe(replace('export {};', ''))
        .pipe(replace('Object.defineProperty(exports, "__esModule", { value: true });', ''))
        .pipe(gulp.dest('dist'));
}
gulp.task('source-clean', sourceCleanFunction);
function watchFunction() {
    gulp.watch('src/*.js', sourceCleanFunction);
}
gulp.task('watch', watchFunction);
gulp.task('default', () => {
    sourceCleanFunction();
    watchFunction();
});
