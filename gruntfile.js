module.exports = function (grunt) {
  grunt.initConfig({
    pkgFile: 'package.json',
    'npm-contributors': {
      options: {
        commitMessage: 'chore: update contributors'
      }
    },
    bump: {
      options: {
        commitMessage: 'chore: release v%VERSION%',
        pushTo: 'upstream',
        commitFiles: [
          'package.json'
        ],
        prereleaseName: 'rc'
      }
    },
    karma: {
      options: {
        singleRun: true
      },
      simple: {
        configFile: 'examples/simple/karma.conf.js'
      }
    },
    eslint: {
      target: [
        'lib/*.js',
        'chrome-extension/*.js',
        'gruntfile.js',
        'examples/simple/karma.conf.js'
      ]
    }
  })

  require('load-grunt-tasks')(grunt)

  grunt.registerTask('test', ['karma'])
  grunt.registerTask('default', ['eslint'])

  grunt.registerTask('release', 'Bump the version and publish to NPM.', function (type) {
    grunt.task.run([
      'npm-contributors',
      'bump-only:' + (type || 'patch'),
      'bump-commit',
      'npm-publish'
    ])
  })
}
