'use strict';

const fs = require('fs');
const gulp = require('gulp');
const debug = require('gulp-debug');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const gulpIf = require("gulp-if");

const isProd = !!(!process.env.NODE_ENV || process.env.NODE_ENV === "production");
const isDev = !isProd;
console.warn("Current mode is " + (isDev ? "development" : "production"));

const DIST_DIR = "dist";

var paths = {
    js: [
        "src/WebGL.js",
        "src/three.js",
        "src/GLTFLoader.js",
        "src/OrbitControls.js",
        "src/RoomEnvironment.js",
        "src/index.js"
    ],
    copy: [
        "assets/*.*"
    ]
};

gulp.task('cleanDist', function () {
    return del(DIST_DIR+'/**/*',{force:true});
});

gulp.task("copyAssets", function () {
    return gulp.src(paths.copy)
        .pipe(gulpIf(isDev, debug({title: 'copyAssets:'})))
        .pipe(gulp.dest(DIST_DIR));
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

gulp.task("default", gulp.series("cleanDist", gulp.parallel("copyAssets", "uglifyjs")));