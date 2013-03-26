> Adapter for the Dart [unittest] testing framework.

For more information on Karma-runner see the [homepage].

## Getting Started

You'll need node.js: http://nodejs.org/download/

Install karma and karma-dart adapter npms:

    npm install karma@canary-dart karma-dart@canary

Refer to [npm install] documentation for more details and install options.

and you'll need the following dependencies in your pubspec.yaml

    unittest: any
    browser: any
    js: any

The following is an example of karma config.

```javascript
basePath = '.';
frameworks = ['dart-unittest'];

// list of files / patterns to load in the browser
// all tests must be 'included', but all other libraries must be 'served' and
// optionally 'watched' only.
files = [
  'tests/*.dart',
  {pattern: '**/*.dart', watched: true, included: false, served: true},
  'packages/browser/dart.js'
];

autoWatch = true;

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

plugins = [
  'karma-dart'
]
```

You can run karma from the local folder:

    node node_modules/karma/bin/karma start karma-dart.conf

or if you installed it with -g flag just

    karma start karma-dart.conf

Then just open http://localhost:9876/ in [Dartium].

## Testing Web Components

karma-dart adapter does not invoke DWC compiler, however it will detect changes
to generated files and run your tests automatically.

When using Dart Editor, it will automatically invoke DWC compiler when you change
the HTML/dart files and write them to the "web/out" folder. Just make sure your
tests import files from the out folder, and your karma config serves/watches dart
file in the out folder as well.

```dart
library click_counter_test;

import 'package:unittest/unittest.dart';
import 'dart:html';
import '../web/out/xclickcounter.dart';

main() {
  test('CounterComponent.increment', () {
    var hello = new DivElement();
    var component = new CounterComponent.forElement(hello);
    expect(component.count, equals(0));
    component.increment();
    expect(component.count, equals(1));
  });
}
```


## Known Limitations/Issues

* Each test file must be a library -- due to the nature of the test runner, this is required.
* When Dart syntax error is encountered, karma SOMETIMES gets stuck until captureTimeout. There is no way to work around this until https://code.google.com/p/dart/issues/detail?id=5958


[homepage]: https://github.com/karma-runner
[unittest]: http://api.dartlang.org/docs/releases/latest/unittest.html
[npm install]: https://npmjs.org/doc/install.html
[Dartium]: http://www.dartlang.org/dartium/
