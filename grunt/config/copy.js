module.exports = {
    dev: {
        files: [
            {
                expand:true,
                cwd: 'client/',
                src: ['**'],
                dest: 'www/'
            }
        ]
    },
    prod: {
        files: [
            {
                expand:true,
                cwd: 'client/assets/images',
                src: ['**'],
                dest: 'www/assets/images'
            },
            {
                expand:true,
                cwd: 'client/assets/locales',
                src: ['**'],
                dest: 'www/assets/locales'
            },
            {
                expand:true,
                cwd: 'client/app',
                src: ['**/*.html'],
                dest: 'www/app'
            },
            {
                src: 'client/index.html',
                dest: 'www/index.html'
            },
            {
                src: 'client/robots.txt',
                dest: 'www/robots.txt'
            },
            {
                src: 'client/maintenance.html',
                dest: 'www/maintenance.html'
            },
            {
                expand:true,
                cwd: 'bower_components/font-awesome/fonts',
                src: ['**'],
                dest: 'www/assets/fonts/'
            },
            {
                expand:true,
                cwd: 'bower_components/bootstrap/fonts',
                src: ['**'],
                dest: 'www/assets/fonts/'
            }
        ]

    }
};