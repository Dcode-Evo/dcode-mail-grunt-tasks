module.exports = function (grunt) {
	/**
	 * This task is used by prompt default to execute a task selected in menu
	 */
	grunt.registerTask('promptDo', '', function () {
		//grunt.log.warn(grunt.config('promptAction'));
		grunt.task.run(grunt.config('promptAction'));
	});
};