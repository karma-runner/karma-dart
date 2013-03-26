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

plugins = [
  'karma-dart'
]
```

You can run karma locally:

    node node_modules/karma/bin/karma start karma-dart.conf

[homepage]: https://github.com/karma-runner
[unittest]: http://api.dartlang.org/docs/releases/latest/unittest.html
