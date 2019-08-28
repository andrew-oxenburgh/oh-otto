module.exports = (grunt) ->
  grunt.initConfig
    haml:
      compile:
        files:
          './doc/doc.html' : ['./doc/*.haml']
        options:
          language:'js'
          dependencies:
            '$': 'jquery'
            '_': 'lodash'

    sass:
      options:
        sourceMap: ''
      dist:
        files:
          './public/build/desktop.css': './public/scss/desktop.scss'
          './public/build/metadata.css': './public/scss/metadata.scss'
    nodemon:
      dev:
        script: 'src/server.js'
    uglify:
      options:
        mangle: false
        compress: false
        beautify: true
        report: 'none'
        sourceMap: false
      your_target:
        files:
          'public/build/oh-otto.min.js': [
            'public/js/ob-testable.js'
            'public/js/ob-oo.js'
            'public/js/ob-init.js'
            'public/js/ob-global-nav.js'
            'public/js/ob-write.js'
            'public/js/ob-auth.js'
            'public/js/ob-ui.js'
            'public/js/ob-grid.js'
            'public/js/ob-articulate.js'
            'public/js/ob-edit.js'
            'public/js/ob-favicon.js'
            'public/js/ob-read.js'
            'public/js/ob-create.js'
            'public/js/ob-trello-auth.js'
          ]
          'public/build/third-party.min.js': [
            'public/bower_components/lodash/dist/lodash.min.js'
            'public/bower_components/auth0-lock/build/auth0-lock.min.js'
            'public/custom-ui/jquery-ui-1.11.4.custom/jquery-ui.min.js'
            'public/bower_components/jquery.cookie/jquery.cookie.js'
            'public/bower_components/jquery.storage/jquery.storage.js'
            'public/bower_components/marked/marked.min.js'
            'public/bower_components/sprintf/src/sprintf.js'
            'public/bower_components/socket.io-client/socket.io.js'
            'public/bower_components/randomcolor/randomColor.js'
            'public/bower_components/tinycolor/tinycolor.js'
          ]
    watch:
      sass:
        files: ['public/**/*.scss']
        tasks: ['sass']
        options:
          spawn: false
      all:
        files: ['public/**/*.scss', 'public/**/*.js']
        tasks: ['sass', 'uglify']
        options:
          spawn: false

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-sass'
  grunt.loadNpmTasks 'grunt-haml'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-nodemon'
  grunt.registerTask 'default', [
    'uglify'
    'sass'
  ]
  return
