/*
 *  Project: dragit
 *  Description: Take an image and drag parts of it around itself. Requires jquery-ui-draggable
 *  Author: Andy Joslin, andy-joslin.github.com
 *  License: GPL
 */

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.
	
	// window and document are passed through as local variables rather than globals
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the plugin-global vars
	var dragitStr = 'dragit';
	var defaults = {
		image       : 'mario.jpg',
		imageWidth  : 885,
		imageHeight : 1024,
		radius      : 40,
	};

	// Plugin 'master' object
	function Dragit( element, options ) {
		var self = this;

		self.$element = $(element); //jquery element

		self.options = $.extend({}, defaults, options) ;

		self._defaults = defaults;
		self._name = dragitStr;

		self.$element.append('<div class="dragit_img"></div>');
		self.$image = self.$element.children().last();

		self.$image.css({
			'position'         : 'absolute', 
			'left'             : 0, 
			'top'              : 0,
			'background-image' : 'url("'+self.options.image+'")',
			'width'            : self.options.imageWidth+'px',
			'height'           : self.options.imageHeight+'px',
			'z-index'          : 0,
		});

		console.log("creating");

		$(document).mousedown(function(evt)
		{
			self.onMouseEvent(evt, 'down');
		});
		$(document).mousemove(function(evt)
		{
			self.onMouseEvent(evt, 'drag');
		});
		$(document).mouseup(function(evt)
		{
			self.onMouseEvent(evt, 'up');
		});

		//array holding all the new little images created by dragging
		self.dragObjs = [];

		//small object to help with mouse stuffs
		self.mouse = {
			down: false,
			x: 0,
			y: 0,
			dragObj: null, //current object mouse is linked to
		}
	}

	Dragit.prototype.onMouseEvent = function(evt, type)
	{
		this.mouse.x = evt.pageX;
		this.mouse.y = evt.pageY;

		if (type=='down') 
			this.onMouseDown();
		else if (type=='up')
			this.onMouseUp();
		else if (type=='drag')
			this.onMouseDrag(evt.pageX, evt.pageY);
	}

	Dragit.prototype.onMouseDown = function()
	{
		var left = this.$image.offset().left;
		var top = this.$image.offset().top;
		var right = left + this.options.imageWidth;
		var bot = top + this.options.imageHeight;

		this.mouse.down=true;

		//find a new dragger for the mouse: if mouse is over a current drag, use that
		//else create a new drag from background image
		var mouseLink = null;
		for (var i=0; i<this.dragObjs.length; i++)
		{
			
			//distance to the 'hole' created by this dragger (whitespace)
			var dxhole=Math.abs(this.mouse.x-this.dragObjs[i].origx);
			var dyhole=Math.abs(this.mouse.y-this.dragObjs[i].origy);
			
			//distance to the dragger itself
			var dxdragger=Math.abs(this.mouse.x-this.dragObjs[i].x);
			var dydragger=Math.abs(this.mouse.y-this.dragObjs[i].y);
			
			//if you click on a dragger, you're good (even if a hole is underneath)
			if (dxdragger<this.options.radius && dydragger<this.options.radius)
				mouseLink = this.dragObjs[i];
			//if you click on a hole, nothin' happens
			else if (dxhole<this.options.radius && dyhole<this.options.radius)
				mouseLink = false
		}

		console.log(left);
		console.log(top);
		console.log(this.mouse.x);
		console.log(this.mouse.y);

		//if still found no dragObj for mouse, create a new one
		//and the current click inside the image bounds
		if (mouseLink === false) {
			//if someone set it to false, we do nothing
		} else if (!mouseLink &&
			this.mouse.x > left && this.mouse.x < right && 
			this.mouse.y > top && this.mouse.y < bot)
		{
			mouseLink = new Dragger(this.$element, this.$image, this.mouse.x, this.mouse.y, this.options);
			this.dragObjs.push(mouseLink);
		}

		this.mouse.dragObj = mouseLink;
	}

	Dragit.prototype.onMouseDrag = function(x,y)
	{
		if (!this.mouse.down || !this.mouse.dragObj)
			return;

		this.mouse.dragObj.setPosition(x,y);
	}

	Dragit.prototype.onMouseUp = function(x,y)
	{
		this.mouse.down=false;
	}

	//Dragger Object
	//Creates little circle based on the image and click
	function Dragger($parent, $image, x, y, options)
	{
		console.log("new dragger");

		this.origx=x;
		this.origy=y;

		this.radius = options.radius;
		this.imagex = x-$image.offset().left-this.radius;
		this.imagey = y-$image.offset().top-this.radius;

		var setCircleCss = function($el, radius)
		{
			$el.css({
				'position' : 'absolute',
				'width'                 : 2*radius+'px',
				'height'                : 2*radius+'px',
				'-moz-border-radius'    : radius+'px',
				'-webkit-border-radius' : radius+'px',
				'z-index'               : 2,
			})
			return $el
		}

		//create circle with white bg under it - we're "erasing" part of the image
		$parent.append('<div class="dragger_white"></div>');
		var $whiteCircle = $parent.children().last();

		setCircleCss($whiteCircle, this.radius);
		$whiteCircle.css({
			'left'             : x-this.radius,
			'top'              : y-this.radius,
			'background-color' : 'white',
			'z-index'          : 1,
		});

		//create circle with background image at position
		$parent.append('<div class="dragger"></div>');
		this.$element = $parent.children().last();

		setCircleCss(this.$element, this.radius);
		this.$element.css({
			'background-image'      : 'url("'+options.image+'")',
			'background-position'   : (-this.imagex)+'px'+' '+(-this.imagey)+'px',
		});


		
		this.setPosition(x,y);
	}

	Dragger.prototype.setPosition = function(x,y)
	{
		this.x = x;
		this.y = y;
		this.$element.css({
			left : this.x - this.radius,
			top  : this.y - this.radius,
		});
	}
	
	// A really lightweight plugin wrapper around the constructor, 
	// preventing against multiple instantiations
	$.fn.dragit = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + dragitStr)) {
				$.data(this, 'plugin_' + dragitStr, new Dragit( this, options ));
			}
		});
	}

})(jQuery, window, document);