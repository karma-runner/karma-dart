// Remove old rules on load.
chrome.declarativeWebRequest.onRequest.removeRules();

var prevFiles = {};

// Called when a message is passed.
function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script) was on.
  chrome.pageAction.show(sender.tab.id);

  var files = request.files;

  if (request.action == 'load') {
    var rules = [];
    for (var file in files) {
      var regex;
      var isKnownFile =
          prevFiles[sender.tab.id] && prevFiles[sender.tab.id][file];
      if (isKnownFile) {
        if (prevFiles[sender.tab.id][file] == files[file]) {
          // We can skip this rule if the timestamp hasn't change.
          continue;
        }
        regex = '^([^\\?]*)\\?' + prevFiles[sender.tab.id][file] + '$';
      } else {
        regex = '^([^\\?]*)$';
      }
      var actions = [
        new chrome.declarativeWebRequest.RedirectByRegEx({
          from: regex,
          to: '$1?' + files[file]
        })
      ];
      if (!isKnownFile) { // is new file
        actions.push(
            new chrome.declarativeWebRequest.RemoveResponseHeader(
                {name: 'Cache-Control'}));
        actions.push(
            new chrome.declarativeWebRequest.AddResponseHeader(
                {name: 'Cache-Control', value: 'no-cache'}));
      }
      rules.push({
        conditions: [
          new chrome.declarativeWebRequest.RequestMatcher({
            url: { pathSuffix: file }
          })
        ],
        actions: actions
      });
    }
    prevFiles[sender.tab.id] = files;
    chrome.declarativeWebRequest.onRequest.addRules(rules, function(callback) {
      // We reply back only when new rules are set.
      sendResponse({});
    });
  }
  // Return nothing to let the connection be cleaned up.
};

chrome.extension.onRequest.addListener(onRequest);
