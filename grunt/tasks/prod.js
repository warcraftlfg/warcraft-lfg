module.exports = function(grunt) {
    grunt.registerTask('prod', ['clean','copy','sass:prod','uglify:my_target']);
    //TODO Add uglify
    //TODO Add files inside index.html
};