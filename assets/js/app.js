var APP = (function ($) {

  /**
   * Modules
   *
   * app
   * tvdb
   */
  var app     = {}
  var storage = window.LSTORE;

  /**
   * Module Properties
   *
   * config
   * url
   * data
   * $el
   * settings
   * dir
   * feeds
   * init
   * plugins
   * events
   * forms
   * loader
   * routing
   * 
   * showFeed
   * showSchedule
   * 
   */
  app = {

    // Config
    config : {
      environment : window.location.href.match(/(localhost)/g) ? 'development' : 'production',
      debug : window.location.href.match(/(localhost)/g) ? true : false,
    },


    // Elements
    $el : {
      body : $('body'),

      loader: $('#loader'),

      nav : {
        main : $('#nav--main'),
      },

      heroes : $('#heroes'),
      hero_count : $('#hero-count'),

      views : {
        index : $('#view--index'),
      },

    },


    dir : {
      js : rootLocation() + 'assets/js/',
      css : rootLocation() + 'assets/css/',
      images : rootLocation() + 'assets/images/',
    },

  };



  /**
   * Init
   */
  app.init = function () {

    // routing
    this.routing.init()

    // plugin init & general event bindings
    this.plugins()
    this.events()
    this.forms.init()
    
    this.heroes.init()

    
  }



  /**
   * Plugins
   */
  app.plugins = function() {

    // Routie
    if ( window.routie && window.routie !== undefined ) {
      if ( app.config.debug ) console.log('%cPLUGIN:', 'color:#8e2fb1', 'routie.js')
    }


    // Dragula
    if ( window.dragula && window.dragula !== undefined ) {
      if ( app.config.debug ) console.log('%cPLUGIN:', 'color:#8e2fb1', 'dragula.js')

      var containers = [
        document.getElementById('heroes'),
        document.getElementById('tier1'),
        document.getElementById('tier2'),
        document.getElementById('tier3'),
        document.getElementById('tier4'),
        document.getElementById('tier5'),
      ]

      dragula( containers, {})
        .on('drag', function (el) {
          console.log( el )
        })
        .on('drop', function (el) {
          console.log( el )
        })
     
    }

    // Sticky
    if ( $.fn.sticky ) {

      $('.sticky').sticky({
        topSpacing: 60
      })
    }

  }


  /**
   * Event Listeners
   */
  app.events = function() {

    // Dropdown toggle
    $(document).on('click', '.selector', function (event) {

      event.preventDefault()


    })

   

  }



  /**
   * Heroes
   */
  app.heroes = {

    names : [
      'abathur',
      'anubarak',
      'arthas',
      'azmodan',
      'brightwing',
      'chen',
      'diablo',
      'etc',
      'falstad',
      'gazlowe',
      'illidan',
      'jaina',
      'johanna',
      'kaelthas',
      'kerrigan',
      'lili',
      'lostvikings',
      'malfurion',
      'muradin',
      'murky',
      'nazeebo',
      'nova',
      'raynor',
      'rehgar',
      'sgthammer',
      'sonya',
      'stitches',
      'sylvanas',
      'tassador',
      'thrall',
      'tychus',
      'tyrael',
      'tyrande',
      'uther',
      'valla',
      'zagara',
      'zeratul'
    ],

    init: function() {

      this.renderHeroAvatars()
      this.renderHeroCount()
    },

    renderHeroAvatars: function() {

      var _this     = app.heroes,
          extension = '.png';

      _this.names.forEach(function (hero, i) {
        
        app.$el.heroes.append('\
          <div class="hero" style="background-image:url(assets/images/avatars/'+hero+'.png)"> \
            <div class="hero-inner"></div> \
          </div> \
        ')

      })
      
    },

    renderHeroCount: function() {

      var _this = app.heroes;

      app.$el.hero_count.html( _this.names.length )
    }

  }



  /**
   * Forms
   */
  app.forms = {

    init: function() {

    },

  }



  /**
   * Loader
   */
  app.loader = {

    show : function() {

      app.$el.loader.show()

    },

    hide : function() {

      app.$el.loader.hide()

    }

  }



  /**
   * Routing
   *
   * @depencies routie.js
   */
  app.routing = {

    /**
     * Initialize
     */
    init: function() {

      // Check routie dependency
      if ( !window.routie || window.routie === undefined ) return false;
      
      this.routes()

    },

    /**
     * Routes
     *
     * /
     * #feed/
     * #feed/:encodeduri
     */
    routes : function() {

      var _this = app.routing;


      routie({

        /**
         * GET /
         */
        '': function() {
          routie('#home')
        },

        /**
         * GET /#home
         */
        'home': function() {
          _this.showView( app.$el.views.index )
          _this.setActiveNavItem( 'home' )
        },
        

      })

    },

    /**
     * Show View
     */
    showView : function($view) {

      $.each( app.$el.views, function (key, view) {
        view.hide()
      })

      // Show current view
      $view.show()

      // Hide loadoer (redundancy)
      app.loader.hide()

      if ( app.config.debug ) console.log('%cROUTER:', 'color:#e65ad7', $view.selector )
    },


    /**
     * Set Active Nav Item
     */
    setActiveNavItem: function(hash) {

      var _this = app.router,
          hash  = hash || '',
          $nav  = app.$el.nav.main;

      var lis = $nav.find('li'),
          li  = $nav.find('a[href="#'+hash+'"]').parent()

      lis.removeClass('active')
      li.addClass('active')

    }

  }






  /**
   * Curl Request
   * 
   * @param  {Object} options 
   *        
   */
  function curlRequest(options) {

    var options = options || {},
        request;

    options.url        = options.url || '';
    options.data_type  = options.data_type || 'xml';
    options.parse_json = options.parse_json || true;
    options.callback   = options.callback || undefined;

    request = $.ajax({
      url: 'ajax.php',
      type: 'POST',
      data : {
        action : 'curl',
        url : url,
        convertXML : true
      }
    })
    .done(function (data) {
      
      if ( options.parse_json ) {
        var json  = $.parseJSON(data),
            items = json.channel.item

        callback(items)
      } else {
        callback(data)
      }

    })
    .fail(function (data) {
      console.log("error", data);

      callback(data)
    })
  }  


  /**
   * searchStringInArray
   */
  function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return j;
    }
    return -1;
  }


  /**
   * substringBetween
   */
  function substringBetween( string, start, end ) {
    return string.substring( show.link.lastIndexOf(start)+1, show.link.lastIndexOf(end) );
  }

  /**
   * replaceAllInString
   */
  function replaceAllInString(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  function rootLocation() {

    var href = window.location.href,
        hash = window.location.hash;

    if ( hash.length > 0 ) {
      return href.replace(hash, '')
    } else {
      return href.replace('#', '')
    }

  }


  /**
   * Size Prototype
   * 
   * @param  {Object} obj 
   * @return {Integer}     
   */
  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };












  /**
   * DOCUMENT READY
   * -------------------------------------------------------------------
   *
   */
  document.addEventListener('DOMContentLoaded', function (event) {


    
  })


  app.init()

  return app;
})(jQuery);