module.exports = function (grunt) {
	/**
	 * Read the exportNames.json to set the exportName for the grunt
	 * run this before a task that uses the exportName (<%= exportName %>)
	 */
	grunt.registerTask('dcodeGetExportName', 'Read the exportNames.json to set the exportName for the grunt', function (target) {
		var
			currentProject = grunt.config('config.mail'),
			exportNames = grunt.file.readJSON('exportNames.json');

		if(exportNames.hasOwnProperty(currentProject) && exportNames[currentProject]){
			grunt.config('exportName', exportNames[currentProject]);
		}
		else {
			grunt.fatal('The export name for the ' + currentProject + ' is not defined');
		}
	});
};