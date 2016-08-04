module.exports = function (grunt, options) {
	grunt.registerTask('checkConfig', 'Check if the mail flow was configured', function (target) {
		configFile = grunt.file.readJSON('config.json');

		if (configFile.distantPath == "") {
			grunt.fail.warn("Distant path"['red'].bold + " is not defined in config.json !"['red']);
		}
	});
};