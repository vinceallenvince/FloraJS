module.exports = function(grunt) {

  var name, latest, bannerContent, bannerContentMin, footerContent, devRelease;

  latest = '<%= pkg.name %>';
  name = '<%= pkg.name %>-v<%= pkg.version%>';

  bannerContent = '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> \n' +
                  ' *  <%= pkg.author.name %> \n' +
                  ' *  <%= pkg.author.address %> \n' +
                  ' *  <%= pkg.author.email %> \n' +
                  ' *  <%= pkg.author.twitter %> \n' +
                  ' *  License: <%= pkg.license %> */\n\n' +
                  'var ' + latest + ' = {}, exports = ' + latest + ';\n\n' +
                  '(function(exports) {\n\n' +
                  '"use strict";\n\n';

  bannerContentMin = '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> \n' +
                  '<%= pkg.author.name %> |' +
                  '<%= pkg.author.address %> | ' +
                  '<%= pkg.author.email %> | ' +
                  '<%= pkg.author.twitter %> | ' +
                  'License: <%= pkg.license %> */\n';

  footerContent = '\n}(exports));';

  devRelease = 'release/' + latest + '.js';

  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    browserify: {
      client: {
        src: ['src/**/*.js'],
        dest: devRelease
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      target: {
        src: ['src/**/*.js']
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      lax: {
        src: ['css/*.css']
      }
    },
    cssmin: {
      addBanner: {
        options: {
          banner: bannerContentMin
        },
        src: ['css/*.css'],
        dest: 'release/' + latest + '.min.css'
      }
    },
    uglify: {
      options: {
        banner: bannerContentMin,
        report: 'min',
        sourceMap: true
      },
      target: {
        src: ['release/' + latest + '.js'],
        dest: 'release/' + latest + '.min.js'
      }
    },
    copy: {
      publicJS: {
        expand: true,
        cwd: 'release/',
        src: '*.js',
        dest: 'public/scripts/',
        flatten: true,
        filter: 'isFile'
      },
      publicCSS: {
        expand: true,
        cwd: 'release/',
        src: '*.css',
        dest: 'public/css/',
        flatten: true,
        filter: 'isFile'
      }
    },
    exec: {
      test: 'npm test',
      testcoverage: 'browserify -t coverify test/*.js | testling | coverify',
      browserify: 'browserify main.js --standalone Flora -o ' + devRelease
    },
    watch: {
      files: ['src/*.js'],
      tasks: ['jshint'],
    },
    plato: {
      options: {},
      your_target: {
        files: {
          'reports': ['src/**/*.js'],
        }
      }
    },
    jsdoc : {
        dist : {
            src: ['src/*.js', 'README.md'],
            options: {
                destination: 'doc'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['cssmin', 'exec:browserify', 'copy:publicJS', 'copy:publicCSS']);
  grunt.registerTask('release', ['csslint', 'jshint', 'cssmin', 'exec:browserify', 'uglify', 'copy:publicJS', 'copy:publicCSS', 'jsdoc', 'plato']);
  grunt.registerTask('test', ['exec:test']);
  grunt.registerTask('testcoverage', ['exec:testcoverage']);
  grunt.registerTask('report', ['plato']);
  grunt.registerTask('doc', ['jsdoc']);
  grunt.registerTask('lint', ['csslint', 'jshint']);

};

