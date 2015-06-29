module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['dart-unittest'],

    // list of files / patterns to load in the browser
    // all tests must be 'included', but all other libraries must be 'served' and
    // optionally 'watched' only.
    files: [
      {pattern: 'simple.spec.dart', included: true},
      // {pattern: './*.spec.dart', watched: true, included: false, served: true},
      // Dependencies, installed with `pub install`.
      {pattern: 'packages/**/*.dart', included: false, watched: false}
    ],

    autoWatch: true,

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 5000,
    logLevel: config.LOG_DEBUG,
    customLaunchers: {
      DartiumWithWebPlatform: {
        base: 'Dartium',
        flags: ['--enable-experimental-web-platform-features'] }
    },

    browsers: ['DartiumWithWebPlatform'],

    plugins: [
      'karma-chrome-launcher',
      require('../../lib')
    ]
  })
}
