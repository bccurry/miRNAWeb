var gulp = require('gulp');
var lodash = require('lodash');

// requires browserify and vinyl-source-stream
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify('./Angular/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function() {
    gulp.watch('Angular/**/*.js', ['browserify']);
});

gulp.task('default', ['watch']);
