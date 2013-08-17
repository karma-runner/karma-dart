/**
 * Compares two arrays of strings, order matters.
 */
exports.areEqual = function(first, second) {
  if (first.length !== second.length) {
    return false;
  }

  for (var i = 0; i < first.length; i++) {
    if (first[i] !== second[i]) {
      return false;
    }
  }

  return true;
};
