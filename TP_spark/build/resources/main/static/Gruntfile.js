module.exports = function (grunt) {

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
                    'js/min/minified.js': ['lib/angular/angular.min.js','lib/angular/angular-route.js','lib/angular/angular-ressource.js', 'js/*.js']
                }
            }
        },
        jshint: {
            dist: ['Gruntfile.js', 'js/*.js']
        },
        watch: {
            scripts: {
                files: 'js/*.js',
                tasks: ['ug'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    grunt.registerTask('hint', ['jshint:dist']);
    grunt.registerTask('ug', ['uglify']);

    grunt.registerTask('default', ['watch']);

};
