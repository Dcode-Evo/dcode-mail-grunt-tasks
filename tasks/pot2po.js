'use strict';

module.exports = function (grunt) {
	grunt.registerTask('pot2po', '', function () {

		var currentProject = grunt.config('config.mail'),
			projectPath = grunt.config('paths.projects') + '/' + currentProject,
			mailConfig = grunt.file.readJSON(projectPath + '/mailConfig.json'),
			myTerminal = require("child_process").execSync; // acces to the terminal to be able to execute shell commands

		var translationsPath = grunt.config('paths.translations'),
			poUpdate = function (path, file) {

				if (!grunt.file.exists(path + '/' + file)) {
					grunt.file.write(path + '/' + file, '');
					console.log("created file");
				}

				var cmd = (
					"cd " + path + "\n" +
					"echo 'plop'\n" +
					" echo \"Updating <%= poFile %>\"\n" +
					"msgmerge <%= poFile %> <%= potFile %> > .new.po.tmp\n" +
					"exitCode=$?\n" +
					"if [ $exitCode -ne 0 ]; then\n" +
					"echo \"Msgmerge failed with exit code $?\"\n" +
					"exit $exitCode\n" +
					"fi\n" +
					"mv .new.po.tmp <%= poFile %>\n"
				).replace(/<%= poFile %>/g, file)
					.replace(/<%= potFile %>/g, 'messages.pot');

				myTerminal(cmd, function (error, stdout, stderr) {
					if (!error) {
						grunt.log.fail('msgmerge fail');
					}
				});
			};

		mailConfig.forEach(function (config) {
			var lang = config.lang;

			// update global translations
			poUpdate(translationsPath, lang + '.po');

			// update global translations
			poUpdate(translationsPath + '/' + currentProject, lang + '.po');
		});
	});
};