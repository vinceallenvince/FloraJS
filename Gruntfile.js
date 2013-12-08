module.exports = function(grunt) {

  var name, latest, bannerContent, bannerContentMin, footerContent,
      publicRelease, lDevRelease, lMinRelease;

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

  lDevRelease = 'release/' + latest + '.js';
  lMinRelease = 'release/' + latest + '.min.js';
  publicRelease = 'public/scripts/' + latest + '.min.js';

  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
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
        options: {
          import: false
        },
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
    concat: {
      options: {
        banner: bannerContent,
        footer: footerContent,
        stripBanners: true,
        process: function(src, filepath) {
          if (filepath === 'src/raf.js') {
            return src;
          } else {
            var className = filepath.replace('src/', '').replace('.js', '');
            return src + '\nexports.' + className + ' = ' + className + ';\n';
          }
        }
      },
      target: {
        src: ['src/Config.js', 'src/Interface.js', 'src/Utils.js', 'src/SimplexNoise.js', 'src/BorderPalette.js', 'src/ColorPalette.js',
            'src/ColorTable.js', 'src/Caption.js', 'src/InputMenu.js', 'src/Mover.js', 'src/Agent.js', 'src/Walker.js', 'src/Sensor.js',
            'src/Connector.js', 'src/Point.js', 'src/Particle.js', 'src/ParticleSystem.js', 'src/Oscillator.js', 'src/Dragger.js',
            'src/Attractor.js', 'src/Repeller.js', 'src/Stimulus.js', 'src/FlowField.js', 'src/FlowFieldMarker.js', 'src/RangeDisplay.js'],
        dest: 'release/' + latest + '.js'
      }
    },
    uglify: {
      options: {
        banner: bannerContentMin,
        mangle: true,
        compress: true,
        wrap: latest,
        exportAll: true,
        report: 'min'
      },
      target: {
        src: ['src/Config.js', 'src/Interface.js', 'src/Utils.js', 'src/SimplexNoise.js', 'src/BorderPalette.js', 'src/ColorPalette.js',
            'src/ColorTable.js', 'src/Caption.js', 'src/InputMenu.js', 'src/Mover.js', 'src/Agent.js', 'src/Walker.js', 'src/Sensor.js',
            'src/Connector.js', 'src/Point.js', 'src/Particle.js', 'src/ParticleSystem.js', 'src/Oscillator.js', 'src/Dragger.js',
            'src/Attractor.js', 'src/Repeller.js', 'src/Stimulus.js', 'src/FlowField.js', 'src/FlowFieldMarker.js', 'src/RangeDisplay.js'],
        dest: 'release/' + latest + '.min.js'
      }
    },
    copy: {
      versionDev: {
        src: 'release/' + latest + '.js',
        dest: 'release/versions/' + name + '.js'
      },
      versionMinified: {
        src: 'release/' + latest + '.min.js',
        dest: 'release/versions/' + name + '.min.js'
      },
      versionCSS: {
        src: 'release/' + latest + '.min.css',
        dest: 'release/versions/' + name + '.min.css'
      },
      publicDev: {
        src: lDevRelease,
        dest: publicRelease
      },
      publicMin: {
        src: lMinRelease,
        dest: publicRelease
      },
      publicCSS: {
        src: 'release/' + latest + '.min.css',
        dest: 'public/css/' + latest + '.min.css'
      }
    },
    watch: {
      files: ['src/*.js'],
      tasks: ['jshint'],
    },
    jasmine: {
      src: 'src/*.js',
      options: {
        version: '1.3.0',
        specs: 'specs/*.js'
      }

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

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['cssmin', 'concat', 'copy:publicDev', 'copy:publicCSS']);
  grunt.registerTask('release', ['jshint', 'cssmin', 'concat', 'uglify', 'copy:publicMin', 'copy:publicCSS', 'copy:versionCSS', 'copy:versionMinified', 'copy:versionDev', 'plato', 'jsdoc']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('report', ['plato']);
  grunt.registerTask('doc', ['jsdoc']);
};

