var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var util = require('gulp-util'); //allow console log functions.
var gulpif = require('gulp-if'); // second argument is a stream not function
var args = require('yargs').argv;
var plumber = require('gulp-plumber'); //for error handling 

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
	gulp.watch('./src/**/*.js', ['show-something']);
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

