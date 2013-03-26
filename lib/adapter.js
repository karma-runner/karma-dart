window.__karma__.start = function() {};
window.onerror = function(e) {
  window.__karma__.error(e);
}
