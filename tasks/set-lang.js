module.exports = function (grunt) {
	/**
	 * This task sets lang in grunt options so you can use <%= lang %> in a task configuration
	 * run this before a task that uses the lang var
	 */
	var _ = require('lodash');

	grunt.registerTask('setLang', '', function (target) {
		var lang = grunt.option('lang'),
			mailConfig = grunt.config('mailConfig');

		if (mailConfig.length > 1 && !lang) {
			grunt.fail.fatal("This mail has several languages, please provide a language to proceed.")
		}

		if(mailConfig.length === 1 && !lang){
			lang = mailConfig[0].lang;
		}

		if(mailConfig.length > 1){
			grunt.config('lang', '-' + lang);
		}

		// find the matching email settings
		var mailConfigLang = _.find(mailConfig, function (obj) {
			return obj.lang == lang
		});

		if (!mailConfigLang) {
			grunt.fail.fatal("This mail does not have the provided language ('" + lang + "').")
		}

		// set mailConfigLang, available in grunt
		grunt.config('mailConfigLang', mailConfigLang)
	});
};