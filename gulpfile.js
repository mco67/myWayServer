// Build stuff
var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

// Test stuff
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

// Debug stuff
var filelog = require('gulp-filelog');

// Load config
var tsProject = ts.createProject('./tsconfig.json');

gulp.task('build', function () {
    return gulp.src('./app/**/*.ts', { base: '.' })
        //.pipe(filelog())
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('./dist'));
});

gulp.task('pre-test', function () {
    return gulp.src(['./dist/app/**/*.js'])
        //.pipe(filelog())
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    //find test code - note use of 'base'
    return gulp.src(['./test/**/*.ts'], { base: '.' })
        // Transpile
        .pipe(ts(tsProject))
        // Flush to disk
        .pipe(gulp.dest('./dist'))
        // Execute tests
        .pipe(mocha({ reporter: 'progress' }))
        // Create the reports after tests ran
        .pipe(istanbul.writeReports())
    // Enforce a coverage of at least 90%
    //.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));;
});

gulp.task('remap-istanbul', function () {
    return gulp.src('./coverage/coverage-final.json', { base: '.' })
        //.pipe(filelog())
        .pipe(remapIstanbul({
            reports: {
                'lcovonly': './coverage/remap/lcov.info',
                'json': './coverage/remap/coverage.json',
                'html': './coverage/remap/html-report',
                'text-summary': './coverage/remap/text-summary.txt'
            }
        }));
});

gulp.task('watch', function () {
    gulp.watch(['app/**/*.ts'], ['build']);
    gulp.watch(['app/**/*.ts', 'test/**/*.ts'], ['test', 'remap-istanbul']);
});


/* single command to hook into VS Code */
gulp.task('default', ['watch']);
//gulp.task('default', ['build','test']);