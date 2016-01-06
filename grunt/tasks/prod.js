module.exports = function(grunt) {
    grunt.registerTask('prod', ['clean','copy:prod','sass:prod','useminPrepare','concat:generated','cssmin:generated','uglify:generated','filerev','usemin']);
};