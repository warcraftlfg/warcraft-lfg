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
            }
        ]

    }
};