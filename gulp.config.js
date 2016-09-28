module.exports = function() {
	var client = './src/client/';
	var clientApp = client + 'app/';

	var config = {
		temp: './.tmp/',
		build: './build/',
		alljs: [
			'./src/**/*.js', 
			'./*.js'
		],
		allclient: client + '**/*.*', //all files in all folders
		client: client, 
		css: client + '/styles/*.css',
		index: client + 'index.html', 
		js: [
			clientApp + '**/*.module.js',
			clientApp + '**/*.js',
			'!' + clientApp + '**/*.spec.js',
		]
	};

	return config;
};