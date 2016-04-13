var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');
var tsProject = ts.createProject('./tsconfig.json');


gulp.task('build', function() {
     return gulp.src('./app/**/*.ts', { base: '.' })
     .pipe(ts(tsProject))
     .pipe(gulp.dest('./dist'));
});

gulp.task('test', function() {
    //find test code - note use of 'base'
    return gulp.src('./test/**/*.ts', { base: '.' })
    /*transpile*/
    .pipe(ts(tsProject))
    /*flush to disk*/
    .pipe(gulp.dest('./dist'))
    /*execute tests*/
    .pipe(mocha({
        reporter: 'progress'
    }));
});

gulp.task('watch', function() {
    gulp.watch(['app/**/*.ts'], ['build']);
    gulp.watch(['test/**/*.ts'], ['test']);
});


/* single command to hook into VS Code */
gulp.task('default', ['watch']);
//gulp.task('default', ['build','test']);