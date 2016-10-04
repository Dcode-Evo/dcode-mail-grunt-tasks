module.exports = function (grunt) {
	/**
	 * This task sets lang in grunt options so you can use <%= lang %> in a task configuration
	 * run this before a task that uses the lang var
	 */
	grunt.registerTask('setLang', '', function (target) {
		var lang = grunt.option('lang');
		if (lang) {
			grunt.config('lang', '-' + lang);
		}
		else {
			var configMail = grunt.file.readJSON(grunt.config('paths.projects') + '/' + grunt.config('config.mail') + '/mailConfig.json');
			if (configMail.length === 1){
				grunt.config('lang', '-' + configMail[0].lang);
			}
			else {
				grunt.log.fail("This mail has two languages, please provide a language to proceed.")
			}
		}
	});
};