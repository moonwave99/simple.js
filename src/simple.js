/*
 * simple.js - client side [M]VC kept simple.
 * v0.1 - by Diego Caponera - http://www.diegocaponera.com/
 * MIT Licensed.
 * Thanks to Paul Irish for the main idea, to Jason Garber for taking it further,
 * to John Resig for the following snippet and all the useful resources out there.
 */

//================================================================================

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();

//================================================================================

(function(){

	this.Controller = Class.extend({

		_element : null,
		_basePath : '',

		init : function(basePath){

			this._basePath = basePath;

		},

		startup : function(element){

			this._element = element;

		}

	});

	this.Router = Class.extend({

		_controllers : [],

		exec : function(controller, action, element) {

			if ( typeof( $(element).attr('data-disabled') ) == 'undefined' && controller !== "" && this._controllers[controller] && typeof this._controllers[controller][action] == "function" ) {
	      		this._controllers[controller][action].apply(this._controllers[controller], Array.prototype.slice.call(arguments).slice(2));
			}

		},

		setControllers : function(controllers){

			// Initialize controllers
			for(var i in controllers){

				this._controllers[i] = new controllers[i](this.basePath);

			}

			// Closure of my dreams
			var _self = this;

			// Run startup actions [if any]. If no action is given, 'startup' action is called by default
			$.each($('[data-startup]'), function(){
				_self.exec(
					$(this).attr('data-controller'),
					$(this).attr('data-action') || 'startup',
					this
				);
			});

		},

		init : function(basePath){

			// Assign basePath
			this.basePath = basePath;

			// Closure of my dreams
			var _self = this;

			// Bind clickable elements to controllers
			$(document).on('click', 'a[data-controller], button[data-controller], input[type="button"][data-controller], .clickable[data-controller]', function(event){

				event.preventDefault();

				_self.exec(
					$(this).attr('data-controller'),
					$(this).attr('data-action'),
					this
				);
				
				

			});

			// Bind forms to controllers
			$(document).on('submit', 'form[data-controller]', function(event){

				event.preventDefault();

				_self.exec(
					$(this).attr('data-controller'),
					$(this).attr('data-action'),
					this
				);				

			});

		}

	});

})();