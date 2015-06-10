var LSTORE = (function () {

  var storage = {}

  storage.set = function(key, value) {

    if ( typeof value === 'object' ) {
      value = JSON.stringify(value);
    }

    if ( typeof value === 'array' ) {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  }

  storage.get = function(key) {
    var data;

    if ( !this.hasData(key) ) {
      return false;
    }

    data = localStorage[key];

    // if json, try to parse
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }

  }

  storage.getOrSet = function(key, value) {

    if ( storage.hasData(key) ) {
      return storage.get(key)
    } else {
      return storage.set(key, value)
    }
  }

  storage.getAll = function() {

    var archive = {},
        keys    = Object.keys(localStorage);

    for (var i=0; i < keys.length; i++) {
       archive[ keys[i] ] = localStorage.getItem( keys[i] );
    }

    return archive;
  }

  storage.hasData = function(key) {

    return !!localStorage[key] && !!localStorage[key].length;
  }

  storage.remove = function(key) {
    if ( storage.hasData(key) ) {
      localStorage.removeItem(key)
    }
  }

  storage.checkSupport = function() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }



  return storage;
}());