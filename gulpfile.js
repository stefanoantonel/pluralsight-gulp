var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var util = require('gulp-util'); //allow console log functions.
var gulpif = require('gulp-if'); // second argument is a stream not function
var args = require('yargs').argv;
var plumber = require('gulp-plumber'); //for error handling 
var config = require('./gulp.config')(); //adding config to hardcoded paths make sure to excecuted using ()
var inject = require('gulp-inject'); //to inject the js and css to the index.html
var clean = require('gulp-clean');
var imagemin = require('gulp-imagemin');

gulp.task('vet', ['show-something'], function() {
	log('Analyzing source with JSHint and JSCS');
	return gulp
		.src(['./scr/**/*/.js', './*.js'])
		.pipe(gulpif(args.verbose, jscs()))
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {verbose: true})) //it is needed for jshint
		.pipe(jshint.reporter('fail'));
});

gulp.task('show-something', function() {
	//if we don't use streams use  to execute it. 
	log('Test to show dependencies');
});

gulp.task('file-watcher', function() {
	gulp.watch(config.alljs, ['show-something']);
});

gulp.task('inject', function() {
	return gulp
		.src(config.index)
		.pipe(inject(gulp.src(config.js)))
		.pipe(inject(gulp.src(config.css)))
		.pipe(gulp.dest(config.client));
});

gulp.task('copy-build', ['inject', 'images'], function() {
	log('Copying files to Build directory');
	return gulp
		.src(config.allclient)
		.pipe(gulp.dest(config.build));
});

gulp.task('clean-build', function() {
	log('Starting cleaning the entire build folder');
	return gulp
		.src(config.build, {read: false})
        .pipe(clean());
});

gulp.task('images', ['clean-build'], function() {
	log('Copying images and optimize them');
	return gulp
		.src(config.allimages)
		.on('end', function(){ log('Images folder: ' + config.images); })
		.pipe(imagemin())
		.pipe(gulp.dest(config.build + 'images'))
});
/////////////////////

function log(msg) {
	if(typeof(msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				util.log(util.colors.blue(msg[item]));
			}
		}
	}
	else {
		util.log(util.colors.blue(msg));
	}
}

