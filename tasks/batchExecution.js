module.exports = function (grunt, options) {
	/**
	 * Creates array from projects.json file with only mail name
	 * @returns {Array}
	 */
	var getProjectList = function () {
		return grunt.config('projects');
	};

	/**
	 * target is the task to execute for all or provided projects projects `all:build`
	 * @param --projects (coma separated list) parameter provides the list of project to proceed `all:build --projects=mail1,mail2`
	 *            so only mail1 and mail2 will be built elsewhere all projects from projects.json will be proceed.
	 */
	grunt.registerTask('all', 'Batch, recursive task', function (target) {

		// save config to be able to restore the current project after all is done
		var current_project = grunt.config('config.mail');

		var batch, task, shellCommand = '';

		// the target will be the task to execute in batch for each mail project
		if (target) {
			task = target;
		}
		else {
			// if no target provided warn user
			grunt.fail.warn('No task to proceed. Please provide the target task: grunt all:build');
		}

		if (grunt.option('projects')) {
			batch = grunt.option('projects').split(',');
		}
		else {
			// else we create a lisk of all existing projects (must be in the projects.json)
			batch = getProjectList();
		}

		// for each project in list create a long bash command
		for (var i = 0; i < batch.length; i++) {
			shellCommand += 'grunt project --name=' + batch[i] + ' && ' +
				'grunt ' + task;
			if (i < batch.length - 1)
				shellCommand += ' && ';
		}

		//add freshly created command to the grunt shell task config
		// something that looks like this: grunt all:build =>
		// grunt project --name=test-mail && grunt build && grunt project --name=mail2 && grunt build && grunt project --name=mail3 && grunt build
		// so we switch the project every time and execute the asked task for it the we switch to the next task an so on
		grunt.config('shell.all', {
			command: shellCommand
		});

		// execute freshly created shell:all task
		grunt.task.run('shell:all');

		// and after all task end we set the current project as before all task
		grunt.option('name', current_project);
		grunt.task.run('project');
	});
};