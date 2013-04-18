var fs = require('fs');
var mime = require('mime');
var q = require('q');

var createIncludePattern = function(path) {
  return {pattern: path, included: true, served: true, watched: false};
};

var serveStaticFile = function(file, response, process) {
  fs.readFile(file, function(error, data) {
    if (error) {
      console.log('404: ' + file);
      response.writeHead(404);
      return response.end('NOT FOUND');
    }

    // set content type
    response.setHeader('Content-Type', 'application/dart');

    // set no cache headers
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', (new Date(0)).toString());

    // call custom process fn to transform the data
    var responseData = process && process(data.toString(), response) || data;
    response.writeHead(200);

    return response.end(responseData);
  });
};

var initDartUnittest = function(files, webServer, customFileHandlers,
    customScriptTypes, karmaDartImports) {
  customScriptTypes.push({
    extension: 'dart',
    contentType: 'application/dart'
  });

  var imports = {
    unittest: 'package:unittest/unittest.dart',
    js: 'package:js/js.dart'
  };

  if (karmaDartImports) {
    Object.keys(karmaDartImports).forEach(function(library) {
      imports[library] = karmaDartImports[library];
    });
  }
  var adapterImports = '';
  Object.keys(imports).forEach(function(library) {
    adapterImports += 'import "' + imports[library] + '" as ' + library + ';\n';
  });

  // We monkey-patch webServer.updateFilesPromise and modify the list of
  // included files to remove dart test files, and add the adapter file.
  var oldUpdateFilesPromiseFn = webServer.updateFilesPromise;
  webServer.updateFilesPromise = function(promise) {
    var defer = q.defer();
    oldUpdateFilesPromiseFn(defer.promise);
    promise.then(function(resolvedFiles) {
      var dartTestFiles = [];
      resolvedFiles.included.forEach(function(file) {
        var filePath = file.path;
        if (filePath.indexOf('.dart', filePath.length - '.dart'.length) == -1) {
          return;
        }
        dartTestFiles.push(file);
      });
      customFileHandlers.push({
        urlRegex: /\/base\/__adapter_dart_unittest.dart/,
        handler: function(request, response, staticFolder, adapterFolder,
            baseFolder, urlRoot) {
          var imports = [];
          var mainCalls = [];
          var index = 0;
          dartTestFiles.forEach(function(dartFile) {
            var filePath = dartFile.path;
            // TODO(pavelgj): This is a copy-paste from web-server.js.
            if (filePath.indexOf(adapterFolder) === 0) {
              filePath = '/adapter' + filePath.substr(adapterFolder.length);
            } else if (filePath.indexOf(baseFolder) === 0) {
              filePath = '/base' + filePath.substr(baseFolder.length);
            } else {
              filePath = '/absolute' + filePath;
            }
            imports.push("import '" + filePath + "' as test_" + index + ";");
            mainCalls.push("  test_" + index + ".main();");
            index++;
          });
          return serveStaticFile(__dirname + '/../static/adapter.dart.tmpl',
              response, function(data, response) {
            return data
                .replace('/*%ADAPTER_IMPORTS%*/', adapterImports)
                .replace('/*%TEST_IMPORTS%*/', imports.join('\n'))
                .replace('/*%TEST_MAIN_CALLS%*/', mainCalls.join('\n'));
          });
        }
      });
      dartTestFiles.forEach(function(fileToRemove) {
        var index = resolvedFiles.included.indexOf(fileToRemove);
        resolvedFiles.included.splice(index, 1);
      });
      resolvedFiles.included.unshift({
        path: '/base/__adapter_dart_unittest.dart',
        isUrl: true
      });
      defer.resolve(resolvedFiles);
    })
  };
  files.unshift(createIncludePattern(__dirname + '/adapter.js'));
};

initDartUnittest.$inject = ['config.files', 'webServer', 'customFileHandlers',
    'customScriptTypes', 'config.karmaDartImports'];

module.exports = {
  'framework:dart-unittest': ['factory', initDartUnittest]
};
