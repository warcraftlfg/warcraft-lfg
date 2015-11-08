'use strict';

module.exports = function(grunt) {

    var path = require('path');

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'grunt/config'),
        jitGrunt: {
            customTasksDir: 'grunt/tasks'
        }
    });

};