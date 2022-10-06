'use strict';

var gulp = require('gulp');
var debug = require('gulp-debug');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var terser = require('gulp-terser');
var concat = require('gulp-concat');
var gulpIf = require("gulp-if");

const isProd = !!(!process.env.NODE_ENV || process.env.NODE_ENV === "production");
const isDev = !isProd;
console.warn("Current mode is " + (isDev ? "development" : "production"));

const DIST_DIR = "docs";

var paths = {
    js: [
        "three.js",
        "GLTFLoader.js",
        "OrbitControls.js",
        "RoomEnvironment.js",
        "index.js"
    ],
    copy: [
        "assets/*.*"
    ]
};

gulp.task('cleanDist', function () {
    return del(DIST_DIR+'/**/*',{force:true});
});


gulp.task('uglifyjs', function () {
    return gulp.src(paths.js)
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(terser({ output: {comments: false} }))
        .pipe(gulpIf(isDev, debug({title: 'js_min:'})))
        .pipe(concat('load3D.js'))
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulpIf(isDev, debug({title: 'js_concat:'})))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task("default", gulp.series("uglifyjs"));