module.exports = function() {
	var client = './src/client/';
	var clientApp = client + 'app/';
	var images = client + 'images/';

	var config = {
		temp: './.tmp/',
		build: './build/',
		client: client,
		images: images,
		alljs: [
			'./src/**/*.js', 
			'./*.js'
		],
		allclient: [
			client + '**/*.*', //all files in all folders
			'!' + images + '**/*.*' //except images (later we'll optimize them)
		],
		allimages: images + '**/*.*',
		css: client + '/styles/*.css',
		index: client + 'index.html', 
		js: [
			clientApp + '**/*.module.js',
			clientApp + '**/*.js',
			'!' + clientApp + '**/*.spec.js',
		], 
		htmltemplates: clientApp + '**/*.html', //avoid the index.html

		templatecache: {
			file: 'templates.js',
			options: {
				module: 'app.core',
				standAlone: false, //if is a new module for cache use true
				root: 'app/'
			}
		}
	};

	return config;
};