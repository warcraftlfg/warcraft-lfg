module.exports = {
	app:          {
		cwd: 		'client/',
		src:        ['app/character/directive/**/*.html', 'app/guild/directive/**/*.html', 'app/filter/**/*.html'],
		dest:       'www/templates.js',
		options:    {
		 	htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true }
		}
	}
};