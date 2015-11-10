module.exports = {
    copy: {
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
            }
        ]

    }
};