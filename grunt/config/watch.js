module.exports = {

    scripts: {
        files: ['client/app/**/*.js'],
        tasks: ['jshint'],
        options: {
            atBegin:true,
            spawn: false,
        },
    },
    css: {
        files: ['client/assets/**/*.scss'],
        tasks: ['sass:dev'],
        options: {
            atBegin:true,
            spawn: false,
        },
    },
    ngtemplates: {
        files: ['client/app/**/*.js'],
        tasks: ['ngtemplates'],
        options: {
            atBegin:true,
            spawn: false,
        },
    },
    copy: {
        files: ['client/**'],
        tasks: ['copy:dev'],
        options: {
            atBegin:true,
            spawn: false,
        },
    }
};