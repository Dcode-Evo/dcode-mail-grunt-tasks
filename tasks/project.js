/**
 *    Set/Create/Delete a project (mail folder)
 *
 *    grunt project:config => will show the config file
 *    grunt project -subject="mail subject" set new mail subject for the active project
 *    grunt project -name=mail1 will set mail1 as active project for build/serve
 *    grunt project:new -name=mail2 -subject="mail subject" (optional) create new mail project
 *    grunt project:delete -name=projectName will delete completely the project
 */
module.exports = function (grunt) {

	var project = {
		// GETTERS
		getProjectPath: function (projectName) {
			return grunt.config('paths.projects') + '/' + projectName;
		},
		/**
		 * Returns the project name and subject from project list if exists
		 * @param projectName {string|undefined}
		 * @returns {{name: string, subject: string}}
		 */
		getProject: function (projectName) {
			var self = this,
				projects = grunt.config('projects');

			if (!projectName && projects.length > 0) {
				projectName = projects[0];
			}
			if (!projectName && !projects.length) {
				projectName = '_bootstrap';
			}

			if (projectName && self.exists(projectName)) {
				return projectName;
			}
			else {
				grunt.fail.warn('Project " _' + projectName + '_ " *does not exist* \n');
			}
		},
		/**
		 * Returns the current/active project name and subject from project config.json if exists
		 * @returns {{name: string, subject: string}}||null
		 */
		getCurrentProject: function () {
			return grunt.config('config.mail');
		},

		// SETTERS
		/**
		 * Sets the provided rpoject as the current one, used for all tasks (serve, build, ...)
		 * @param projectName {string}
		 * @param subject {string}
		 */
		setCurrentProject: function (projectName) {
			grunt.config('config.mail', projectName);
			this.saveConfig();
		},

		// METHODS
		/**
		 * Checks if a project exists fith the provided --name value
		 * @param projectName
		 * @returns {boolean}
		 */
		exists: function (projectName) {
			var projectsList = grunt.config('projects'),
				index = projectsList.indexOf(projectName);

			return grunt.file.isDir(this.getProjectPath(projectName)) ||
				index > -1;
		},
		/**
		 * Adds a project object projectName: {subject: "Subject"} to the project list stored in options.projects
		 * @param projectName {string}
		 * @param subject {string}
		 */
		addProject: function (projectName, subject) {
			var projectList = grunt.config('projects');
			projectList.push(projectName);
			grunt.config('projects', projectList);
			this.saveProjects();
		},
		/**
		 * Remove a project from the project list
		 * @param projectName {string}
		 */
		removeProject: function (projectName) {
			var projectsList = grunt.config('projects'),
				index = projectsList.indexOf(projectName);
			if (index > -1) {
				projectsList.splice(index, 1);
			}
			grunt.config('projects', projectsList);

			this.saveProjects();

			// if the current project is the deleted one, update it with the first that exists in the project list
			var currentProject = this.getCurrentProject();

			if (currentProject == projectName) {
				this.setCurrentProject(this.getProject());
			}
		},
		/**
		 * Updates the subject in the config and project list and saves to json files
		 * @param subject {string}
		 */
		// TODO: update this
		updateSubject: function (subject) {
			var self = this,
				projectName = grunt.config('config.mail');
			if (!projectName || !self.exists(projectName)) {

				grunt.fail.fatal('No current/active project set *or* the project does not exist\n');
				return;
			}

			var mailConfigPath = grunt.config('paths.mail') + '/mailConfig.json',
				mailConfig = grunt.file.readJSON(mailConfigPath),
				newMailConfig = [];

			mailConfig.forEach(function (obj) {
				obj.subject = subject + ' ' + obj.lang;
				newMailConfig.push(obj);
			});

			grunt.file.write(mailConfigPath, JSON.stringify(newMailConfig, null, '\t'));
		},
		/**
		 * Saves the projects list from the grunt options.projects to the projects.json file
		 */
		saveConfig: function () {
			var config = grunt.config('config');
			config.src = undefined;

			grunt.file.write('config.json', JSON.stringify(config, null, '\t'));
		},
		/**
		 * Saves the config from the grunt options.config to the config.json file
		 */
		saveProjects: function () {
			grunt.file.write('projects.json', JSON.stringify(grunt.config('projects'), null, '\t'));
		},
		/**
		 * Callback function for grunt.file.recurse
		 * copies the files one by one from example folder to the created project folder
		 */
		copyTemplate: function (abspath, rootdir, subdir, filename) {
			var path = subdir ? subdir + '/' + filename : filename;
			grunt.file.copy(abspath, grunt.config('paths.projects') + '/' + grunt.option('name') + '/' + path);
		}
	};

	grunt.registerTask('project', 'Create a new clean email project', function (target) {

		var options = this.options({
			bootstrap: 'src/example',
			images: 'src/images',
			minified: 'src/images/minified',
			dist: 'dist'
		});

		// get --name parameter
		var nameParam = grunt.option('name') || null,
		// get --subject parameter
			subjectParam = grunt.option('subject') || null;

		if (!target) {
			// if no params provided just display the name of the current/active project
			if (!nameParam && !subjectParam) {
				// display the active project
				grunt.task.run('prompt:setProject');
				//grunt.log.ok('Active project is *' + grunt.config('config.mail') + '* (' + grunt.config('config.subject') + ')');
				return;
			}
			// if the --name param is present set the provided project as current/active
			if (nameParam) {
				var mail = project.getProject(nameParam);

				project.setCurrentProject(mail);
				grunt.log.ok('Project set to *' + grunt.option('name') + '*');
			}
			// if the --subject param is present update the current project subject
			if (subjectParam) {
				project.updateSubject(subjectParam);
			}
		}

		switch (target) {

		/**
		 * Shows the content of the config.json file
		 */
			case 'config':
				grunt.log.subhead(JSON.stringify(grunt.config('config'), null, '\t'));
				break;

		/**
		 * Create a new project from example template
		 */
			case 'new':
				if (!nameParam)
					grunt.fail.warn('Provide the project name. i.e. $ grunt project:new --name=myNewProject \n');

				if (project.exists(nameParam))
					grunt.fail.warn('Project with the name "' + nameParam + '" already exists \n');

				// create new folder with the project name from --name paramater
				var mailPath = project.getProjectPath(nameParam);
				grunt.file.mkdir(mailPath);

				//grunt.file.mkdir(project.getProjectPath(nameParam) + '/partials');
				grunt.file.mkdir(options.images + '/' + nameParam);
				// recursively copy all example files to the freshly created folder
				grunt.file.recurse(options.bootstrap + '/', project.copyTemplate);

				// get subject from --subject parameter or set the default one
				var subject = subjectParam ? subjectParam : nameParam + ' Test';

				project.addProject(nameParam, subject);
				project.setCurrentProject(nameParam);

				grunt.log.ok('Project *' + nameParam + '* created');
				break;

		/**
		 * Will DELETE all files related to the project with provided --name :
		 * - source images
		 * - minified images
		 * - mail folder from templates
		 * - translations
		 * - built mail
		 */
			case "delete":
				if (!nameParam)
					grunt.warn('Provide the project name to delete : *--name=myProject* \n');

				if (!project.exists(nameParam))
					grunt.fail.warn('Project with the name "' + nameParam + '" *does not exist* \n');

				var projectPath = project.getProjectPath(nameParam);

				grunt.file.delete(projectPath);

				if (grunt.file.isDir(options.dist + "/" + nameParam))
					grunt.file.delete(options.dist + "/" + nameParam);

				if (grunt.file.isDir(options.images + "/" + nameParam))
					grunt.file.delete(options.images + "/" + nameParam);

				if (grunt.file.isDir(options.minified + "/" + nameParam))
					grunt.file.delete(options.minified + "/" + nameParam);

				if (grunt.file.isDir(grunt.config('paths.translations') + "/" + nameParam))
					grunt.file.delete(grunt.config('paths.translations') + "/" + nameParam);

				if (grunt.file.isDir(grunt.config('paths.translations') + "/json/" + nameParam))
					grunt.file.delete(grunt.config('paths.translations') + "/json/" + nameParam);

				project.removeProject(nameParam);

				grunt.log.ok('Project ' + grunt.option('name') + ' deleted');
				break;
		}

	});
};