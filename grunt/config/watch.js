module.exports = {

    scripts: {
        files: ['client/app/**/*.js'],
        tasks: ['jshint'],
        options: {
            spawn: false,
        },
    },
    css: {
        files: ['client/assets/**/*.scss'],
        tasks: ['sass:dev'],
        options: {
            spawn: false,
        },
    },

};