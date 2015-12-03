module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    uglify: {
      options: {
        mangle: false,
        sourceMap: true
      },
      dist: {
        files: {
          'views/minified.js': ['views/lib/angular/angular.min.js', 'views/lib/angular/*.js', 'views/js/*.js']
        }
      }
    },
    jshint: {
      dist: ['Gruntfile.js', 'views/js/*.js']
    },
    watch: {
      scripts: {
        files: 'views/js/*.js',
        tasks: ['ug'],
        options: {
          interrupt: true,
        },
      },
    },
  });

  grunt.registerTask('hint', ['jshint:dist']);
  grunt.registerTask('ug', ['uglify']);

  grunt.registerTask('default', ['watch']);

};
