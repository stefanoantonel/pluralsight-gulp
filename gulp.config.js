module.exports = function() {
	var client = './src/client/';
	var clientApp = client + 'app/';
	var images = client + 'images/';

	var config = {
		temp: './.tmp/',
		build: './build/',
		minify: {
			js: 'minify.js',
			css: 'minify.css'
		},
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
		deploy: 'C:/deploy/',
		ws: [
			'E:/Documents/TPC/git/mobileframework-appconfigservice/AppConfigService.sln', 
			'E:/Documents/TPC/git/mobileframework-configservice/ConfigService.sln', 
			'E:/Documents/TPC/git/mobileframework-documentservice/DocumentService.sln', 
			'E:/Documents/TPC/git/mobileframework-identitymanagementservice/IdentityManagementService.sln', 
			'E:/Documents/TPC/git/mobileframework-identityservice/IdentityService.sln'
		], 
		angularapps: {
			folders: [
				{
					base: 'E:/Documents/TPC/git/mobileapps/Home/Home/public/',
					destination: 'Home/'
				},
				{
					base: 'E:/Documents/TPC/git/mobileframework-mobileapplicationmanager/MobileApplicationManager/public/',
					destination: 'mobileappmanager/'
				},
				{
					base: 'E:/Documents/TPC/git/mobileframework-sharedcomponents/',
					destination: 'sharedcomponents/'
				},
				{
					base: 'E:/Documents/TPC/git/mobileframework-storeinformationsystem/StoreInformation/public/',
					destination: 'storeinformation/'
			}
			],
			files: '**/*.*'
		}
	};

	return config;
};