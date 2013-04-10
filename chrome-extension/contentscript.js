// Test the text of the body element against our regular expression.
if (/window\.__karma__/.test(document.body.innerHTML)) {
  // TODO(pavelgj): find a better way to parse files out of the page.
  var filesRegex = /window\.__karma__\.files = \{(.*)\};/m;
  var filesSrc = (filesRegex.exec(document.body.innerHTML.replace(/[\n\r]/g, ' ')))[1];
  eval('var files = {' + filesSrc + '}');
  chrome.extension.sendRequest({action: 'load', files: files}, function(response) {
    // When new redirect rules are in place, we bootstrap Dart.
    var dartJs = document.createElement("script");
    dartJs.setAttribute('type', 'text/javascript');
    // TODO(pavelgj): unhardcode the path to dart.js.
    dartJs.setAttribute("src", '/base/packages/browser/dart.js');
    window.document.body.appendChild(dartJs);
  });
}
