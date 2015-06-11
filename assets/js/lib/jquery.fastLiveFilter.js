/**
 * fastLiveFilter jQuery plugin 1.0.3
 * 
 * Copyright (c) 2011, Anthony Bush
 * License: <http://www.opensource.org/licenses/bsd-license.php>
 * Project Website: http://anthonybush.com/projects/jquery_fast_live_filter/
 **/

jQuery.fn.fastLiveFilter = function(list, options) {
  // Options: input, list, timeout, callback
  options = options || {};
  list = jQuery(list);
  var input = this;
  var lastFilter = '';
  var timeout = options.timeout || 0;
  var callback = options.callback || function() {};
  
  var keyTimeout;


  // NOTE: modified to not cache - poor for performance, but fixes sorting / requerying DOM issue
  var lis = list.children();
  var len = lis.length;
  var oldDisplay = len > 0 ? lis[0].style.display : "block";
  callback(len); // do a one-time callback on initialization to make sure everything's in sync
  
  input.change(function() {
    // var startTime = new Date().getTime();
    var filter = input.val().toLowerCase();
    var li, innerText;
    var numShown = 0;
      
    var lis = $(list).children()

    for (var i = 0; i < len; i++) {
      li = lis[i];

      if ( li !== undefined ) {

        innerText = !options.selector ? 
          (li.textContent || li.innerText || "") : 
          $(li).find(options.selector).text();
        
        if (innerText.toLowerCase().indexOf(filter) >= 0) {
          if (li.style.display == "none") {
            li.style.display = oldDisplay;
          }
          numShown++;
        } else {
          if (li.style.display != "none") {
            li.style.display = "none";
          }
        }
      }
    }
    callback(numShown);
    // var endTime = new Date().getTime();
    // console.log('Search for ' + filter + ' took: ' + (endTime - startTime) + ' (' + numShown + ' results)');
    return false;
  }).keydown(function() {
    clearTimeout(keyTimeout);
    keyTimeout = setTimeout(function() {
      if( input.val() === lastFilter ) return;
      lastFilter = input.val();
      input.change();
    }, timeout);
  });
  return this; // maintain jQuery chainability
}