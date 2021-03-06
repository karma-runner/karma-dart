# karma-dart

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/karma-runner/karma-dart)
 [![npm version](https://img.shields.io/npm/v/karma-dart.svg?style=flat-square)](https://www.npmjs.com/package/karma-dart) [![npm downloads](https://img.shields.io/npm/dm/karma-dart.svg?style=flat-square)](https://www.npmjs.com/package/karma-dart)

[![Build Status](https://img.shields.io/travis/karma-runner/karma-dart/master.svg?style=flat-square)](https://travis-ci.org/karma-runner/karma-dart) [![Dependency Status](https://img.shields.io/david/karma-runner/karma-dart.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-dart) [![devDependency Status](https://img.shields.io/david/dev/karma-runner/karma-dart.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-dart#info=devDependencies)


> Adapter for the Dart [unittest] testing framework.

For more information on Karma-runner see the [homepage].

## Getting Started

You'll need node.js: http://nodejs.org/download/

Install karma and karma-dart adapter npms:

```bash
$ npm install karma-dart
```

Refer to [npm install] documentation for more details and install options.

and you'll need the following dependencies in your pubspec.yaml

```yaml
unittest: any
browser: any
```

The following is an example of karma config.

```javascript
module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['dart-unittest'],

    // list of files / patterns to load in the browser
    // all tests must be 'included', but all other libraries must be 'served' and
    // optionally 'watched' only.
    files: [
      'test/*.dart',
      {pattern: '**/*.dart', watched: true, included: false, served: true},
      'packages/browser/dart.js',
      'packages/browser/interop.js'
    ],

    autoWatch: true,

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 5000,

    plugins: [
      'karma-dart'
    ]
  });
};
```

You can run karma from the local folder:
```bash
$ node node_modules/karma/bin/karma start karma-dart.conf
```

or if you installed it with -g flag just

```bash
$ karma start karma-dart.conf
```
Then just open http://localhost:9876/ in [Dartium].

## Known Limitations/Issues

* Missing Dartium launcher.
* Each test file must be a library -- due to the nature of the test runner, this is required.

[homepage]: https://github.com/karma-runner
[unittest]: http://api.dartlang.org/docs/releases/latest/unittest.html
[npm install]: https://npmjs.org/doc/install.html
[Dartium]: http://www.dartlang.org/dartium/
