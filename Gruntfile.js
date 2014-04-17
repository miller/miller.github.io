module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
      responsive_images: {
        myTask: {
          options: {
            sizes: [{
                name: 'phone',
                width: 300
            },{
                name: 'phone',
                width: 600,
                suffix: '@2x'
            },{
                name: 'tablet',
                width: 760
            },{
                name: 'tablet',
                width: 1520,
                suffix: '@2x'
            },{
                name: 'desktop',
                width: 680
            },{
                name: 'desktop',
                width: 1360,
                suffix: '@2x'
            }]
          },
          files: [{
            expand: true,
            src: ['**.{jpg,gif,png}'],
            cwd: 'img/raw/',
            dest: 'img/resp/'
          }]
        }
      },
    });

    grunt.loadNpmTasks('grunt-responsive-images');

    // Default task(s).
    grunt.registerTask( 'default', [ 'responsive_images' ] );
};