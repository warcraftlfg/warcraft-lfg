module.exports = function(grunt) {
    grunt.registerTask('dev', ['default','jshint:all','sass:prod','watch']);
    //TODO Inside watch SAAS
    //TODO Add File inside index.html
};