/**
 * Set recipients of the test mail
 *
 * grunt sento -email=email@adress.com
 * grunt sento -email=email@adress1.com,adresse2@email.com
 */
module.exports = function (grunt, options) {
	grunt.registerTask('sento', function () {
		if (grunt.option('email') && grunt.option('email') != '') {
			var configFile = grunt.file.readJSON('config.json');
			configFile['recipient'] = grunt.option('email').split(',');

			grunt.file.write('config.json', JSON.stringify(configFile, null, '\t'));
			grunt.log.ok('The recipients were updated to : *' + grunt.option('email') + '*');
		}
		else {
			grunt.fail.warn('provide the option -email=adress@here,addres2@here');
		}
	});
};
