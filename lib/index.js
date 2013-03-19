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

    // call custom process fn to transform the data
    var responseData = process && process(data.toString(), response) || data;
    response.writeHead(200);

    return response.end(responseData);
  });
};


var initDartUnittest = function(files, webServer, customFileHandlers, customScriptTypes) {
  customScriptTypes.push({
    extension: 'dart',
    contentType: 'application/dart'
  });

  var oldUpdateFilesPromiseFn = webServer.updateFilesPromise;
  webServer.updateFilesPromise = function(promise) {
    var defer = q.defer();
    oldUpdateFilesPromiseFn(defer.promise);
    promise.then(function(resolvedFiles) {
      var imports = [];
      var mainCalls = [];
      var count = 0;
      var toRemove = [];
      resolvedFiles.included.forEach(function(file) {
        if (file.path.indexOf('.dart', file.path.length - '.dart'.length) == -1) {
          return;
        }
        imports.push("import '/absolute" + file + "' as test_" + count + ";");
        mainCalls.push("  test_" + count + ".main();");
        count++;
        toRemove.push(file);
      });
      customFileHandlers.push({
        urlRegex: /\/base\/__adapter_dart_unittest.dart/,
        handler: function(request, response, staticFolder, adapterFolder,
            baseFolder, urlRoot) {
          return serveStaticFile(__dirname + '/../static/adapter.dart.tmpl',
              response, function(data, response) {
            return data.replace('%TEST_IMPORTS%', imports.join('\n'))
                .replace('%TEST_MAIN_CALLS%', mainCalls.join('\n'));
          });
        }
      });
      toRemove.forEach(function(itemToRemove) {
        var index = resolvedFiles.included.indexOf(itemToRemove);
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

initDartUnittest.$inject = ['config.files', 'webServer', 'customFileHandlers', 'customScriptTypes'];

module.exports = {
  'framework:dart-unittest': ['factory', initDartUnittest]
};
