# v1.1.4
### PROJECT TASK : Change the way the projects are managed in the machine: 
- no more subject in the config.json, the subject comes now from the mailConfig and from the right language
- when all the project are deleted, the machine works anyway by setting the project to _bootstrap
- projects.json is now a simple array
- `grunt project --subject="something"` redefines the subject of the current mail in mailConfig.json file. ATTENTION: same for all languages

# v1.1.3
- execute pot2po conversion only if there is more than one language in mailConfig.json

# v1.1.2
- fix setLang task to stop grunt on error

# v1.1.1
- fix setlang task to provide feedback error when language is not provided for the litmus task

# v1.1.0
- add pot2po task, that replaces the shell task and bases on mailConfig.json instead of locales variable

# v1.0.2
- add `dcodeGetExportName` task