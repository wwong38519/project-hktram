var gulp = require('gulp');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var src = 'src';
var dist = 'dist';
var entryFilename = 'app.jsx';
var destFilename = 'app.js';
var entryFile = src+'/'+entryFilename;
var option = {entries: entryFile, extension: ['.jsx'], debug: true};

var swallow = function(err) {
	console.log(err.message);
	this.emit('end');
};

gulp.task('lint', function() {
	return gulp.src([src+'/*.js*'])
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('build', function() {
	return browserify(option)
		.transform(babelify)
		.bundle()
		.on('error', swallow)
		.pipe(source(destFilename))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(dist));
});

gulp.task('copy', function() {
	return gulp.src(src+'/*.html')
		.pipe(gulp.dest(dist));
});

gulp.task('watch', ['build', 'copy'], function() {
	gulp.watch([src+'/*.jsx', src+'/*.js'], ['build']);
	gulp.watch(src+'/*.html', ['copy']);
});

gulp.task('default', ['build', 'copy']);
