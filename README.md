> Adapter for the Dart [unittest] testing framework.

For more information on Karma-runner see the [homepage].

## Getting Started

    npm install karma@canary-dart
    npm install karma-dart@canary

and that you have the following dependencies in your pubspec.yaml

    unittest: any
    browser: any
    js: any

The following is an example of karma config.

```javascript
basePath = '.';
frameworks = ['dart-unittest'];

// list of files / patterns to load in the browser
// all tests must be 'included', but all other libraries must be 'server' and
// optionally 'watched' only.
files = [
  'test*.dart',
  {pattern: '**/*.dart', watched: false, included: false, served: true},
  'packages/browser/dart.js'
];

autoWatch = true;

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

plugins = [
  'karma-dart'
]
```

You can run karma locally:

    node node_modules/karma/bin/karma start karma-dart.conf

## Known Limitations/Issues

* Each test file must be a library -- due to the nature of the test runner, this is required.
* When Dart syntax error is encountered, karma might get stuck until captureTimeout. There is no way to work around this until https://code.google.com/p/dart/issues/detail?id=5958



[homepage]: https://github.com/karma-runner
[unittest]: http://api.dartlang.org/docs/releases/latest/unittest.html
