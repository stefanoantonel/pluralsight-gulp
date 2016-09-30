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
var templatecache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var ngannotate = require('gulp-ng-annotate');
var rev = require('gulp-rev');
var revreplace = require('gulp-rev-replace');
var msbuild = require("gulp-msbuild");
var merge = require('merge-stream');

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

gulp.task('templatecache', ['clean-build'], function() {
	log('Creating AngularJS $templatecache');
	return gulp
		.src(config.htmltemplates)
		.pipe(minifyHtml({empty: true})) //true to conserv the empty tags, use allways true
		.pipe(templatecache(
			config.templatecache.file, //destination file
			config.templatecache.options
		))
		.pipe(gulp.dest(config.build))
});

gulp.task('optimize', ['inject', 'templatecache'], function() {
	log('Optimizing the javascript, css, html');

	var templateCache = config.build + config.templatecache.file;
	return gulp
		.src(config.index)
		.pipe(plumber()) //error handling
		.pipe(inject(gulp.src(templateCache, {read: false}), { 
			//get the compressed file and inject in the tag 
			starttag: '<!-- inject:templates:js -->'
		}))
		.pipe(gulp.dest(config.build));
});

gulp.task('inject-customjs-customcss', ['optimize-customjs','optimize-customcss'], function() {
	log('Optimizing and injecting the custom JS minified');
	var minifyjs = config.build + config.minify.js;
	var minifycss = config.build + config.minify.css;
	var manifest = gulp.src(config.build + "rev-manifest.json");
	return gulp
		.src(config.index)
		.pipe(revreplace({manifest: manifest}))
		.pipe(inject(gulp.src(minifyjs, {read: false}), { 
			starttag: '<!-- inject:custom:js -->'
		}))
		.pipe(inject(gulp.src(minifycss, {read: false}), { 
			starttag: '<!-- inject:custom:css -->'
		}))
		.pipe(gulp.dest(config.build));
});

gulp.task('optimize-customjs', ['clean-build'], function() {
	log('Minify the JS to build folder')
	return gulp
		.src(config.js)
		.pipe(plumber()) //error handling
		.pipe(ngannotate())
		.pipe(concat(config.minify.js))						
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest(config.build))
});

gulp.task('optimize-customcss', ['clean-build'], function() {
	log('Minify the CSS to build folder')
	return gulp
		.src(config.css)
		.pipe(plumber()) //error handling
		.pipe(concat(config.minify.css))
		.pipe(csso())
		.pipe(rev())
		.pipe(gulp.dest(config.build))
});

gulp.task('clean-deploy', function() {
	log('Cleaning the entire deploy folder');
	return gulp
		.src(config.deploy, {read: false})
        .pipe(clean());
});

/* Assumptions: 
	1) You change the locations of the projects in gulp.config.ws
	2) You have a profile to deploy called Custom
	3) You have the destination folder in C:\deploy\<name-of-solution-in-lowercase>
*/
gulp.task("build-ws", ['clean-deploy'], function(route) {
	log('You need to see ' + config.ws.length + ' MSBuild complete!');
	var tasks = config.ws.map(function(service) {
		return gulp
			.src(service)
			.pipe(plumber())
	        .pipe(msbuild({
	        	targets: ['Clean', 'Build'],
	            toolsVersion: 'auto',
	            errorOnFail: true,
	            properties: { DeployOnBuild: true, PublishProfile: "gulp-deploy" }
	    	}))
	    	.on('end', function() {
	    		log('Deployed ' + service);
	    	});
	});
	return merge(tasks);
});

gulp.task('build-clients', ['build-ws'], function() {
	log('Copying files to Deploy directory');
	var tasks = config.angularapps.folders.map(function(folder) {
		
		return gulp
			.src(folder.base + config.angularapps.files , {base: folder.base})
			.pipe(gulp.dest(config.deploy + folder.destination))
			.on('end', function() {
				log('Copied ' + folder.base);
			});
	})
	return merge(tasks);
});

gulp.task('build-deploy', ['build-clients']);

/////////////////////

function log(msg) {
	if(typeof(msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				util.log(util.colors.yellow(msg[item]));
			}
		}
	}
	else {
		util.log(util.colors.yellow(msg));
	}
}