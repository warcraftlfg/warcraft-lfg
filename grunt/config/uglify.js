module.exports = {

        my_target: {
            files: [{
                expand: true,
                cwd: 'client/app',
                src: '**/*.js',
                dest: 'www/app',
                ext: '.min.js'
            }]
        }

};