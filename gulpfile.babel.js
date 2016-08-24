'use strict';

/**
 * Import modules:
 */
import path from 'path';
import fs from 'fs';

import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import pug from 'gulp-pug';
import svg from 'gulp-svgo';
import smushit from 'gulp-smushit';
import sass from 'gulp-sass';
import base64 from 'gulp-base64';
import inline from 'gulp-inline-source';
import htmlmin from 'gulp-html-minifier';

/**
 * Import PostCSS modules:
 */

// import precss from 'precss';
import mqpacker from 'css-mqpacker';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
// import rucksack from 'rucksack-css';
// import assets from 'postcss-assets';
// import mixins from 'postcss-mixins';
// import atImport from 'postcss-import';
import comments from 'postcss-discard-comments';
import browserSync from 'browser-sync';

/**
 * Initial Properties
 */
const dirs = {
	src: 'src',
	dest: 'hello'
	// dest: '../blog/themes/Simple/source/'
};
const reload = browserSync.reload;

const processors = [
	autoprefixer(['last 8 versions']),
	mqpacker(),
	comments({
		removeAll: true
	}),
	cssnano()
];

/**
 * gulp:tasks
 */
gulp.task('styles', () => {
	return gulp.src(`${dirs.src}/css/*.scss`)
		// .pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(base64({
			baseDir: `${dirs.dest}/images/`,
			extensions: ['svg', 'png'],
			exclude:    ['woff'],
			maxImageSize: 8 * 1024, // bytes,
			deleteAfterEncoding: false
		}))
		.pipe(postcss(processors))
		// .pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(`${dirs.dest}/styles/`))
});

gulp.task('babel', () => {
	return gulp.src(`${dirs.src}/js/**/*.+(js|es6)`)
		// .pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		// .pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(`${dirs.dest}/scripts/`));
});

gulp.task('images', ['svgs'], () => {
	return gulp.src(`${dirs.src}/img/**/*.+(jpg|png)`)
		.pipe(smushit())
		.pipe(gulp.dest(`${dirs.dest}/images`));
});

gulp.task('svgs', () => {
	return gulp.src([`${dirs.src}/img/**/*.svg`, `!${dirs.src}/img/icons/*.svg`])
		.pipe(svg({
			removeTitle: true,
		}))
		.pipe(gulp.dest(`${dirs.dest}/images`));
});

gulp.task('views', () => {
	return gulp.src(`${dirs.src}/pug/*.+(jade|pug)`)
	.pipe(pug({
		pretty: false
	}))
	.pipe(gulp.dest('./'));
});

gulp.task('html', () => {
	return gulp.src(`./*.html`)
	.pipe(inline())
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest('./'));
});

gulp.task('watch', () => {
	gulp.watch(`${dirs.src}/pug/**/*.+(html|pug)`, ['views', reload]);
	gulp.watch(`${dirs.src}/css/**/*.+(css|scss)`, ['styles', reload]);
	gulp.watch(`${dirs.src}/img/**/*.+(jpg|svg|png)`, ['images', reload]);
	gulp.watch(`${dirs.src}/js/**/*.+(js|es6)`, ['babel', reload]);
});

gulp.task('sync', () => {
	browserSync({
		server: {
			baseDir: "./"
		},
		notify: false,
		port: 3000
	});
});


/**
 * Register Tasks:
 */
gulp.task('default', ['styles', 'babel', 'views', 'images', 'sync', 'watch']);
gulp.task('theme', ['styles', 'babel', 'images', 'watch']);
gulp.task('deploy', ['styles', 'babel', 'views', 'images', 'sync', 'watch', 'html']);
