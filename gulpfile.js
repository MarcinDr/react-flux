"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //runs a local dev server
var open = require('gulp-open'); // open a url in a web browser
var browserify = require('browserify'); // bundle js
var reactify = require('reactify'); // transforms react jsx to js
var source = require('vinyl-source-stream'); // use conventional text streams with gulp
var concat = require('gulp-concat'); //concatenates files
var lint = require('gulp-eslint'); //lint js files, including JSX

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        dist: './dist',
        mainJs: './src/main.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ]
    }
}

//start a local dev server
gulp.task('connect', function() {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

//open provided html site on provided url inside browser - runs 'connect' task first
gulp.task('open', ['connect'], function() {
    gulp.src('dist/index.html').pipe(open({
        uri: config.devBaseUrl + ':' + config.port + '/'
    }));
});

//copy html files to dist folder and reload all connected server (on livereload)
gulp.task('html', function() {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', function() {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console)) //on error display error
        .pipe(source('bundle.js')) // setup name for bundled js file
        .pipe(gulp.dest(config.paths.dist + '/scripts')) // destination path for bundled file
        .pipe(connect.reload()); 
});

gulp.task('css', function(){
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

//watch task that checks for changes inside any html or js file and runs html & js task
gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('lint', function() {
    return gulp.src(config.paths.js)
               .pipe(lint({
                   config: 'eslint.config.json'
               }))
               .pipe(lint.format());
});

//runs html & open tasks
gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);