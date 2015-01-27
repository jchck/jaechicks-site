// Fluidbox
// Description: Replicating the seamless lightbox transition effect seen on Medium.com, with some improvements
// Version: 1.4.3
// Author: Terry Mun
// Author URI: http://terrymun.com

// -------------------------------------------------------- //
//  Dependency: Paul Irish's jQuery debounced resize event  //
// -------------------------------------------------------- //
(function($,sr){

	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;

		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
				func.apply(obj, args);
				timeout = null;
			};

			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);

			timeout = setTimeout(delayed, threshold || 100);
		};
	}
	// smartresize
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');


// ---------------------------------------------------------------------------------------------------------------------- //
//  Dependency: David Walsh (http://davidwalsh.name/css-animation-callback)                                               //
//              and                                                                                                       //
//              Jonathan Suh (https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/)  //
// ---------------------------------------------------------------------------------------------------------------------- //
function whichTransitionEvent() {
	var t,
		el = document.createElement("fakeelement");

	var transitions = {
		"transition"      : "transitionend",
		"OTransition"     : "oTransitionEnd",
		"MozTransition"   : "transitionend",
		"WebkitTransition": "webkitTransitionEnd"
	}

	for (t in transitions){
		if (el.style[t] !== undefined){
			return transitions[t];
		}
	}
}
var customTransitionEnd = whichTransitionEvent();

// -----------------------------
//  Fluidbox plugin starts here
// -----------------------------
(function ($) {

	var fbCount = 0;

	$.fn.fluidbox = function (opts) {

		// Default settings
		var settings = $.extend(true, {
			viewportFill: 0.95,
			debounceResize: true,
			stackIndex: 1000,
			stackIndexDelta: 10,
			closeTrigger: [
				{
					selector: '.fluidbox-overlay',
					event: 'click'
				},
				{
					selector: 'document',
					event: 'keyup',
					keyCode: 27
				}
			],
			immediateOpen: false
		}, opts);

		// Keyboard events
		var keyboardEvents = [
			'keyup',
			'keydown',
			'keypress'
		];

		// Ensure that the stackIndex does not become negative
		if(settings.stackIndex < settings.stackIndexDelta) settings.stackIndexDelta = settings.stackIndex;

		// Dynamically create overlay
		$fbOverlay = $('<div />', {
			'class': 'fluidbox-overlay',
			css: {
				'z-index': settings.stackIndex
			}
		});

		// Declare variables
		var $fb = this,
			$w = $(window),		// Shorthand for $(window)
			vpRatio,

			// Function:
			// 1. funcCloseFb()		- used for closing instances of opened Fluidbox
			// 2. funcPositionFb()	- used for dynamic positioning of any instance of opened Fluidbox
			// 3. funcCalcAll()		- used to run funcCalc() for every instance of targered Fluidbox thumbnail
			// 5. fbClickhandler()	- universal click handler for all Fluidbox items
			funcCloseFb = function (selector) {
				$(selector + '.fluidbox-opened').trigger('click');
			},
			funcPositionFb = function ($activeFb, customEvents) {
				// Get shorthand for more objects
				var $img    = $activeFb.find('img'),
					$ghost  = $activeFb.find('.fluidbox-ghost'),
					$wrap	= $activeFb.find('.fluidbox-wrap'),
					$data	= $activeFb.data(),
					fHeight = 0,
					fWidth	= 0;
				
				$img.data().imgRatio = $data.natWidth/$data.natHeight;

				var newHeight, missingRatioNormal, missingRatio;
                                
				// Check natural dimensions
				if(vpRatio > $img.data().imgRatio) {

					// Check if linked image is smaller or larger than intended fill
					if($data.natHeight < $w.height()*settings.viewportFill) {
						// If shorter, preserve smaller height
						fHeight = $data.natHeight;
					} else {
						fHeight = $w.height()*settings.viewportFill;
					}

					// Calculate how much to scale along the y-axis
					$data.imgScale = fHeight/$img.height();
					$data.imgScaleY = $data.imgScale;

					newHeight = $img.height()*$data.imgScaleY;
					missingRatioNormal = newHeight/$data.natHeight;
					missingRatio = $data.natWidth*missingRatioNormal/$img.width();
					
					$data.imgScaleX = missingRatio;

				} else {
					// Check if linked image is smaller or larger than intended fill
					if($data.natWidth < $w.width()*settings.viewportFill) {
						// If narrower, preserve smaller width
						fWidth = $data.natWidth;
					} else {
						fWidth = $w.width()*settings.viewportFill;
					}

					// Calculate how much to scale along the x-axis
					$data.imgScale = fWidth/$img.width();                                      
					$data.imgScaleX = $data.imgScale;

					newWidth = $img.width()*$data.imgScaleX;
					missingRatioNormal = newWidth/$data.natWidth;
					missingRatio = $data.natHeight*missingRatioNormal/$img.height();

					$data.imgScaleY = missingRatio;
				}	

				// Calculation goes here
				var offsetY = $w.scrollTop()-$img.offset().top+0.5*($img.data('imgHeight')*($img.data('imgScale')-1))+0.5*($w.height()-$img.data('imgHeight')*$img.data('imgScale')),
					offsetX = 0.5*($img.data('imgWidth')*($img.data('imgScale')-1))+0.5*($w.width()-$img.data('imgWidth')*$img.data('imgScale'))-$img.offset().left,
					scale = parseInt($data.imgScaleX * 1000) / 1000 + ',' + parseInt($data.imgScaleY * 1000) / 1000;

				// Apply CSS transforms to ghost element
				// For offsetX and Y, we round to one decimal place
				// For scale, we round to three decimal places
				$ghost.css({
					'transform': 'translate('+parseInt(offsetX*10)/10+'px,'+parseInt(offsetY*10)/10+'px) scale('+ scale +')',
					top: $img.offset().top - $wrap.offset().top,
					left: $img.offset().left - $wrap.offset().left
				}).one(customTransitionEnd, function() {
					$.each(customEvents, function(i,customEvent) {
						$activeFb.trigger(customEvent);
					});
				});
			},
			funcCalc = function ($fbItem) {
				// Get viewport ratio
				vpRatio = $w.width() / $w.height();

				// Get image dimensions and aspect ratio
				if($fbItem.hasClass('fluidbox')) {
					var $img	= $fbItem.find('img'),
						$ghost	= $fbItem.find('.fluidbox-ghost'),
						$wrap	= $fbItem.find('.fluidbox-wrap'),
						data	= $img.data();

					function imageProp() {
						// Store image dimensions in jQuery object
						data.imgWidth	= $img.width();
						data.imgHeight	= $img.height();
						data.imgRatio	= $img.width()/$img.height();

						// Resize and position ghost element
						$ghost.css({
							width: $img.width(),
							height: $img.height(),
							top: $img.offset().top - $wrap.offset().top + parseInt($img.css('borderTopWidth')) + parseInt($img.css('paddingTop')),
							left: $img.offset().left - $wrap.offset().left + parseInt($img.css('borderLeftWidth')) + parseInt($img.css('paddingLeft'))
						});

						// Calculate scale based on orientation
						if(vpRatio > data.imgRatio) {
							data.imgScale = $w.height()*settings.viewportFill/$img.height();
						} else {
							data.imgScale = $w.width()*settings.viewportFill/$img.width();
						}						
					}

					imageProp();					

					// Rerun everything on imageload, to overcome issue in Firefox
					$img.load(imageProp);
				}
			},
			fbClickHandler = function(e) {

				// Check if the fluidbox element does have .fluidbox assigned to it
				if($(this).hasClass('fluidbox')) {

					// Variables
					var $activeFb	= $(this),
						$img		= $(this).find('img'),
						$ghost		= $(this).find('.fluidbox-ghost'),
						$wrap   	= $(this).find('.fluidbox-wrap'),
						timer   	= {};

					// Functions
					// 1. fbOpen(): called when Fluidbox receives a click event and is ready to open
					// 2. fbClose(): called when Fluidbox receives a click event and is ready to close
					var fbOpen = function() {
							// Fire custom event: openstart
							$activeFb.trigger('openstart');

							// What are we doing here:
							// 1. Append overlay in fluidbox
							// 2. Toggle fluidbox state with data attribute
							// 3. Store original z-index with data attribute (so users can change z-index when they see fit in CSS file)
							// 4. Class toggle
							$activeFb
							.append($fbOverlay)
							.data('fluidbox-state', 1)
							.removeClass('fluidbox-closed')
							.addClass('fluidbox-opened');

							// Force timer to completion
							if(timer['close']) window.clearTimeout(timer['close']);

							// Set timer for opening
							timer['open'] = window.setTimeout(function() {
								// Show overlay
								$('.fluidbox-overlay').css({ opacity: 1 });
							}, 10);

							// Change wrapper z-index, so it is above everything else
							// Decrease all siblings z-index by 1 just in case
							$('.fluidbox-wrap').css({ zIndex: settings.stackIndex - settings.stackIndexDelta - 1 });
							$wrap.css({ 'z-index': settings.stackIndex + settings.stackIndexDelta });
						},
						fbClose = function() {
							// Fire custom event: closestart
							$activeFb.trigger('closestart');

							// Switch state
							$activeFb
							.data('fluidbox-state', 0)
							.removeClass('fluidbox-opened fluidbox-loaded fluidbox-loading')
							.addClass('fluidbox-closed');

							// Set timer for closing
							if(timer['open']) window.clearTimeout(timer['open']);
							timer['close'] = window.setTimeout(function() {
								$('.fluidbox-overlay').remove();
								$wrap.css({ 'z-index': settings.stackIndex - settings.stackIndexDelta });
							}, 10);

							// Hide overlay
							$('.fluidbox-overlay').css({ opacity: 0 });

							// Reverse animation on wrapped elements, and restore stacking order
							// You might want to change this value if your transition timing is longer
							$ghost.css({
								'transform': 'translate(0,0) scale(1)',
								opacity: 0,
								top: $img.offset().top - $wrap.offset().top + parseInt($img.css('borderTopWidth')) + parseInt($img.css('paddingTop')),
								left: $img.offset().left - $wrap.offset().left + parseInt($img.css('borderLeftWidth')) + parseInt($img.css('paddingLeft'))
							}).one(customTransitionEnd, function() {
								$activeFb.trigger('closeend');
							});
							$img.css({ opacity: 1 });
						};

					if($(this).data('fluidbox-state') === 0 || !$(this).data('fluidbox-state')) {
						// State: Closed
						// Action: Open fluidbox

						// Add class to indicate larger image is being loaded
						$activeFb.addClass('fluidbox-loading');

						// Set thumbnail image source as background image first, preload later
						$img.css({ opacity: 0 });
						$ghost.css({
							'background-image': 'url('+$img.attr('src')+')',
							opacity: 1
						});

						// Check if item should be opened immediately
						if(settings.immediateOpen) {
							
							// Store natural width and height of thumbnail
							// We use this to scale preliminarily
							$activeFb
							.data('natWidth', $img[0].naturalWidth)
							.data('natHeight', $img[0].naturalHeight);

							// Open immediately
							fbOpen();

							// Preliminary positioning of Fluidbox based on available image ratio
							funcPositionFb($activeFb, ['openend']);

							// Preload target image
							$('<img />', {
								src: $activeFb.attr('href')
							}).load(function() {
								// When loading is successful
								// 1. Trigger custom event: imageloaddone
								// 2. Remove loading class
								// 3. Add loaded class
								// 4. Store natural width and height
								$activeFb
								.trigger('imageloaddone').trigger('delayedloaddone')
								.removeClass('fluidbox-loading')
								.addClass('fluidbox-loaded')
								.data('natWidth', $(this)[0].naturalWidth)
								.data('natHeight', $(this)[0].naturalHeight);

								// Show linked image
								$ghost.css({
									'background-image': 'url('+$activeFb.attr('href')+')'});

								// Reposition Fluidbox
								funcPositionFb($activeFb, ['delayedreposdone']);

							}).error(function() {
								// If image fails to load, close Fluidbox
								// Trigger custom event: imageloadfail
								$activeFb.trigger('imageloadfail');
								fbClose();
							});
						} else {
							// If wait for ghost image to preload
							// Preload ghost image
							$('<img />', {
								src: $activeFb.attr('href')
							}).load(function() {
								// When loading is successful
								// 1. Trigger custom event: imageloaddone
								// 2. Remove loading class
								// 3. Add loaded class
								// 4. Store natural width and height
								$activeFb
								.trigger('imageloaddone')
								.removeClass('fluidbox-loading')
								.addClass('fluidbox-loaded')
								.data('natWidth', $(this)[0].naturalWidth)
								.data('natHeight', $(this)[0].naturalHeight);

								// Show linked image
								$ghost.css({ 'background-image': 'url('+$activeFb.attr('href')+')' });

								// Open Fluidbox
								fbOpen();

								// Position Fluidbox
								funcPositionFb($activeFb, ['openend']);

							}).error(function() {
								// If image fails to load, close Fluidbox
								// Trigger custom event: imageloadfail
								$activeFb.trigger('imageloadfail');
								fbClose();
							});
						}

					} else {
						// State: Open
						// Action: Close fluidbox
						fbClose();
					}

					e.preventDefault();
				}
			};
			var funcResize = function (selectorChoice) {
				// Recalculate dimensions
				if(!selectorChoice) {
					// Recalcualte ALL Fluidbox instances (fired upon window resize)
					$fb.each(function () {
						funcCalc($(this));
					});
				} else {
					// Recalcualte selected Fluidbox instances
					funcCalc(selectorChoice);
				}

				// Reposition Fluidbox, but only if one is found to be open
				var $activeFb = $('a.fluidbox.fluidbox-opened');
				if($activeFb.length > 0) funcPositionFb($activeFb, ['resizeend']);
			};

		if(settings.debounceResize) {
			$(window).smartresize(function() { funcResize(); });
		} else {
			$(window).resize(function() { funcResize(); });
		}

		// Go through each individual object
		$fb.each(function (i) {
			// Check if Fluidbox:
			// 1. Is an anchor element ,<a>
			// 2. Contains one and ONLY one child
			// 3. The only child is an image element, <img>
			// 4. If the element is hidden
			if($(this).is('a') && $(this).children().length === 1 && $(this).children().is('img') && $(this).css('display') !== 'none' && $(this).parents().css('display') !=='none') {

				// Define wrap
				var $fbInnerWrap = $('<div />', {
					'class': 'fluidbox-wrap',
					css: {
						'z-index': settings.stackIndex - settings.stackIndexDelta
					}
				});

				// Update count for global Fluidbox instances
				fbCount+=1;

				// Add class
				var $fbItem = $(this);
				$fbItem
				.addClass('fluidbox fluidbox-closed')
				.attr('id', 'fluidbox-'+fbCount)
				.wrapInner($fbInnerWrap)
				.find('img')
					.css({ opacity: 1 })
					.after('<div class="fluidbox-ghost" />')
					.each(function(){
						var $img = $(this);
						
						if ($img.width() > 0 && $img.height() > 0) {
							// If image is already loaded (from cache)
							funcCalc($fbItem);
							$fbItem.click(fbClickHandler);
						} else {
							// Wait for image to load
							$img.load(function(){
								funcCalc($fbItem);
								$fbItem.click(fbClickHandler);

								// Trigger custom event: thumbloaddone
								$fbItem.trigger('thumbloaddone');
							}).error(function() {
								// Trigger custom event: thumbloadfail
								$fbItem.trigger('thumbloadfail');
							});
						}
				});

				// Custom trigger
				$(this).on('recompute', function() {
					funcResize($(this));
					$(this).trigger('recomputeend');
				});

				// When should we close Fluidbox?
				var selector = '#fluidbox-'+fbCount;
				if(settings.closeTrigger) {
					// Go through array
					$.each(settings.closeTrigger, function (i) {
						var trigger = settings.closeTrigger[i];

						// Attach events
						if(trigger.selector != 'window') {
							// If it is not 'window', we append click handler to $(document) object, allow it to bubble up
							// However, if thes selector is 'document', we use a different .on() syntax
							if(trigger.selector == 'document') {
								if(trigger.keyCode && keyboardEvents.indexOf(trigger.event) > -1 ) {
									$(document).on(trigger.event, function (e) {
										if(e.keyCode == trigger.keyCode) funcCloseFb(selector);
									});
								} else {
									$(document).on(trigger.event, selector, function() {
										funcCloseFb(selector);
									});
								}
							}
						} else {
							// If it is 'window', append click handler to $(window) object
							$w.on(trigger.event, function() {
								funcCloseFb(selector);
							});
						}
					});
				}
			}
		});

		// Return to allow chaining
		return $fb;
	};

})(jQuery);;/*global jQuery */
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );
;/* resize background images */
function backgroundResize(){
    var windowH = $(window).height();
    $(".background").each(function(i){
        var path = $(this);
        // variables
        var contW = path.width();
        var contH = path.height();
        var imgW = path.attr("data-img-width");
        var imgH = path.attr("data-img-height");
        var ratio = imgW / imgH;
        // overflowing difference
        var diff = parseFloat(path.attr("data-diff"));
        diff = diff ? diff : 0;
        // remaining height to have fullscreen image only on parallax
        var remainingH = 0;
        if(path.hasClass("parallax")){
            var maxH = contH > windowH ? contH : windowH;
            remainingH = windowH - contH;
        }
        // set img values depending on cont
        imgH = contH + remainingH + diff;
        imgW = imgH * ratio;
        // fix when too large
        if(contW > imgW){
            imgW = contW;
            imgH = imgW / ratio;
        }
        //
        path.data("resized-imgW", imgW);
        path.data("resized-imgH", imgH);
        path.css("background-size", imgW + "px " + imgH + "px");
    });
}
$(window).resize(backgroundResize);
$(window).focus(backgroundResize);
backgroundResize();;// Normal Clicks
$(function() {
  $('.toggle-nav').click(function() {
    $('body').toggleClass('show-nav');
     return false;
  });
  
});


// Toggle with hitting of ESC
$(document).keyup(function(e) {
	if (e.keyCode === 27) {
   $('body').toggleClass('show-nav');
  }
});;/* http://prismjs.com/download.html?themes=prism&languages=markup+css+css-extras+clike+javascript+php+php-extras+scss+git+less&plugins=line-highlight+line-numbers+file-highlight+show-language */
self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{};var Prism=function(){var e=/\blang(?:uage)?-(?!\*)(\w+)\b/i,t=self.Prism={util:{encode:function(e){return e instanceof n?new n(e.type,t.util.encode(e.content),e.alias):"Array"===t.util.type(e)?e.map(t.util.encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]},clone:function(e){var n=t.util.type(e);switch(n){case"Object":var a={};for(var r in e)e.hasOwnProperty(r)&&(a[r]=t.util.clone(e[r]));return a;case"Array":return e.map(function(e){return t.util.clone(e)})}return e}},languages:{extend:function(e,n){var a=t.util.clone(t.languages[e]);for(var r in n)a[r]=n[r];return a},insertBefore:function(e,n,a,r){r=r||t.languages;var i=r[e];if(2==arguments.length){a=arguments[1];for(var l in a)a.hasOwnProperty(l)&&(i[l]=a[l]);return i}var o={};for(var s in i)if(i.hasOwnProperty(s)){if(s==n)for(var l in a)a.hasOwnProperty(l)&&(o[l]=a[l]);o[s]=i[s]}return t.languages.DFS(t.languages,function(t,n){n===r[e]&&t!=e&&(this[t]=o)}),r[e]=o},DFS:function(e,n,a){for(var r in e)e.hasOwnProperty(r)&&(n.call(e,r,e[r],a||r),"Object"===t.util.type(e[r])?t.languages.DFS(e[r],n):"Array"===t.util.type(e[r])&&t.languages.DFS(e[r],n,r))}},highlightAll:function(e,n){for(var a,r=document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'),i=0;a=r[i++];)t.highlightElement(a,e===!0,n)},highlightElement:function(a,r,i){for(var l,o,s=a;s&&!e.test(s.className);)s=s.parentNode;if(s&&(l=(s.className.match(e)||[,""])[1],o=t.languages[l]),o){a.className=a.className.replace(e,"").replace(/\s+/g," ")+" language-"+l,s=a.parentNode,/pre/i.test(s.nodeName)&&(s.className=s.className.replace(e,"").replace(/\s+/g," ")+" language-"+l);var g=a.textContent;if(g){g=g.replace(/^(?:\r?\n|\r)/,"");var u={element:a,language:l,grammar:o,code:g};if(t.hooks.run("before-highlight",u),r&&self.Worker){var c=new Worker(t.filename);c.onmessage=function(e){u.highlightedCode=n.stringify(JSON.parse(e.data),l),t.hooks.run("before-insert",u),u.element.innerHTML=u.highlightedCode,i&&i.call(u.element),t.hooks.run("after-highlight",u)},c.postMessage(JSON.stringify({language:u.language,code:u.code}))}else u.highlightedCode=t.highlight(u.code,u.grammar,u.language),t.hooks.run("before-insert",u),u.element.innerHTML=u.highlightedCode,i&&i.call(a),t.hooks.run("after-highlight",u)}}},highlight:function(e,a,r){var i=t.tokenize(e,a);return n.stringify(t.util.encode(i),r)},tokenize:function(e,n){var a=t.Token,r=[e],i=n.rest;if(i){for(var l in i)n[l]=i[l];delete n.rest}e:for(var l in n)if(n.hasOwnProperty(l)&&n[l]){var o=n[l];o="Array"===t.util.type(o)?o:[o];for(var s=0;s<o.length;++s){var g=o[s],u=g.inside,c=!!g.lookbehind,f=0,h=g.alias;g=g.pattern||g;for(var p=0;p<r.length;p++){var d=r[p];if(r.length>e.length)break e;if(!(d instanceof a)){g.lastIndex=0;var m=g.exec(d);if(m){c&&(f=m[1].length);var y=m.index-1+f,m=m[0].slice(f),v=m.length,k=y+v,b=d.slice(0,y+1),w=d.slice(k+1),O=[p,1];b&&O.push(b);var N=new a(l,u?t.tokenize(m,u):m,h);O.push(N),w&&O.push(w),Array.prototype.splice.apply(r,O)}}}}}return r},hooks:{all:{},add:function(e,n){var a=t.hooks.all;a[e]=a[e]||[],a[e].push(n)},run:function(e,n){var a=t.hooks.all[e];if(a&&a.length)for(var r,i=0;r=a[i++];)r(n)}}},n=t.Token=function(e,t,n){this.type=e,this.content=t,this.alias=n};if(n.stringify=function(e,a,r){if("string"==typeof e)return e;if("[object Array]"==Object.prototype.toString.call(e))return e.map(function(t){return n.stringify(t,a,e)}).join("");var i={type:e.type,content:n.stringify(e.content,a,r),tag:"span",classes:["token",e.type],attributes:{},language:a,parent:r};if("comment"==i.type&&(i.attributes.spellcheck="true"),e.alias){var l="Array"===t.util.type(e.alias)?e.alias:[e.alias];Array.prototype.push.apply(i.classes,l)}t.hooks.run("wrap",i);var o="";for(var s in i.attributes)o+=s+'="'+(i.attributes[s]||"")+'"';return"<"+i.tag+' class="'+i.classes.join(" ")+'" '+o+">"+i.content+"</"+i.tag+">"},!self.document)return self.addEventListener?(self.addEventListener("message",function(e){var n=JSON.parse(e.data),a=n.language,r=n.code;self.postMessage(JSON.stringify(t.util.encode(t.tokenize(r,t.languages[a])))),self.close()},!1),self.Prism):self.Prism;var a=document.getElementsByTagName("script");return a=a[a.length-1],a&&(t.filename=a.src,document.addEventListener&&!a.hasAttribute("data-manual")&&document.addEventListener("DOMContentLoaded",t.highlightAll)),self.Prism}();"undefined"!=typeof module&&module.exports&&(module.exports=Prism);;
Prism.languages.markup={comment:/<!--[\w\W]*?-->/g,prolog:/<\?.+?\?>/,doctype:/<!DOCTYPE.+?>/,cdata:/<!\[CDATA\[[\w\W]*?]]>/i,tag:{pattern:/<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,inside:{tag:{pattern:/^<\/?[\w:-]+/i,inside:{punctuation:/^<\/?/,namespace:/^[\w-]+?:/}},"attr-value":{pattern:/=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,inside:{punctuation:/=|>|"/g}},punctuation:/\/?>/g,"attr-name":{pattern:/[\w:-]+/g,inside:{namespace:/^[\w-]+?:/}}}},entity:/&#?[\da-z]{1,8};/gi},Prism.hooks.add("wrap",function(t){"entity"===t.type&&(t.attributes.title=t.content.replace(/&amp;/,"&"))});;
Prism.languages.css={comment:/\/\*[\w\W]*?\*\//g,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*\{))/gi,inside:{punctuation:/[;:]/g}},url:/url\((?:(["'])(\\\n|\\?.)*?\1|.*?)\)/gi,selector:/[^\{\}\s][^\{\};]*(?=\s*\{)/g,string:/("|')(\\\n|\\?.)*?\1/g,property:/(\b|\B)[\w-]+(?=\s*:)/gi,important:/\B!important\b/gi,punctuation:/[\{\};:]/g,"function":/[-a-z0-9]+(?=\()/gi},Prism.languages.markup&&(Prism.languages.insertBefore("markup","tag",{style:{pattern:/<style[\w\W]*?>[\w\W]*?<\/style>/gi,inside:{tag:{pattern:/<style[\w\W]*?>|<\/style>/gi,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.css},alias:"language-css"}}),Prism.languages.insertBefore("inside","attr-value",{"style-attr":{pattern:/\s*style=("|').+?\1/gi,inside:{"attr-name":{pattern:/^\s*style/gi,inside:Prism.languages.markup.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/gi,inside:Prism.languages.css}},alias:"language-css"}},Prism.languages.markup.tag));;
Prism.languages.css.selector={pattern:/[^\{\}\s][^\{\}]*(?=\s*\{)/g,inside:{"pseudo-element":/:(?:after|before|first-letter|first-line|selection)|::[-\w]+/g,"pseudo-class":/:[-\w]+(?:\(.*\))?/g,"class":/\.[-:\.\w]+/g,id:/#[-:\.\w]+/g}},Prism.languages.insertBefore("css","function",{hexcode:/#[\da-f]{3,6}/gi,entity:/\\[\da-f]{1,8}/gi,number:/[\d%\.]+/g});;
Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\w\W]*?\*\//g,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*?(\r?\n|$)/g,lookbehind:!0}],string:/("|')(\\\n|\\?.)*?\1/g,"class-name":{pattern:/((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/gi,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,"boolean":/\b(true|false)\b/g,"function":{pattern:/[a-z0-9_]+\(/gi,inside:{punctuation:/\(/}},number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,operator:/[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/g,ignore:/&(lt|gt|amp);/gi,punctuation:/[{}[\];(),.:]/g};;
Prism.languages.javascript=Prism.languages.extend("clike",{keyword:/\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g,number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|-?Infinity)\b/g,"function":/(?!\d)[a-z0-9_$]+(?=\()/gi}),Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,lookbehind:!0}}),Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{script:{pattern:/<script[\w\W]*?>[\w\W]*?<\/script>/gi,inside:{tag:{pattern:/<script[\w\W]*?>|<\/script>/gi,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.javascript},alias:"language-javascript"}});;
Prism.languages.php=Prism.languages.extend("clike",{keyword:/\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/gi,constant:/\b[A-Z0-9_]{2,}\b/g,comment:{pattern:/(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])(\/\/|#).*?(\r?\n|$))/g,lookbehind:!0}}),Prism.languages.insertBefore("php","keyword",{delimiter:/(\?>|<\?php|<\?)/gi,variable:/(\$\w+)\b/gi,"package":{pattern:/(\\|namespace\s+|use\s+)[\w\\]+/g,lookbehind:!0,inside:{punctuation:/\\/}}}),Prism.languages.insertBefore("php","operator",{property:{pattern:/(->)[\w]+/g,lookbehind:!0}}),Prism.languages.markup&&(Prism.hooks.add("before-highlight",function(e){"php"===e.language&&(e.tokenStack=[],e.backupCode=e.code,e.code=e.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/gi,function(n){return e.tokenStack.push(n),"{{{PHP"+e.tokenStack.length+"}}}"}))}),Prism.hooks.add("before-insert",function(e){"php"===e.language&&(e.code=e.backupCode,delete e.backupCode)}),Prism.hooks.add("after-highlight",function(e){if("php"===e.language){for(var n,a=0;n=e.tokenStack[a];a++)e.highlightedCode=e.highlightedCode.replace("{{{PHP"+(a+1)+"}}}",Prism.highlight(n,e.grammar,"php"));e.element.innerHTML=e.highlightedCode}}),Prism.hooks.add("wrap",function(e){"php"===e.language&&"markup"===e.type&&(e.content=e.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g,'<span class="token php">$1</span>'))}),Prism.languages.insertBefore("php","comment",{markup:{pattern:/<[^?]\/?(.*?)>/g,inside:Prism.languages.markup},php:/\{\{\{PHP[0-9]+\}\}\}/g}));;
Prism.languages.insertBefore("php","variable",{"this":/\$this/g,global:/\$_?(GLOBALS|SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/g,scope:{pattern:/\b[\w\\]+::/g,inside:{keyword:/(static|self|parent)/,punctuation:/(::|\\)/}}});;
Prism.languages.scss=Prism.languages.extend("css",{comment:{pattern:/(^|[^\\])(\/\*[\w\W]*?\*\/|\/\/.*?(\r?\n|$))/g,lookbehind:!0},atrule:/@[\w-]+(?=\s+(\(|\{|;))/gi,url:/([-a-z]+-)*url(?=\()/gi,selector:/([^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+)(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/gm}),Prism.languages.insertBefore("scss","atrule",{keyword:/@(if|else if|else|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)|(?=@for\s+\$[-_\w]+\s)+from/i}),Prism.languages.insertBefore("scss","property",{variable:/((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i}),Prism.languages.insertBefore("scss","function",{placeholder:/%[-_\w]+/i,statement:/\B!(default|optional)\b/gi,"boolean":/\b(true|false)\b/g,"null":/\b(null)\b/g,operator:/\s+([-+]{1,2}|={1,2}|!=|\|?\||\?|\*|\/|%)\s+/g});;
Prism.languages.git={comment:/^#.*$/m,string:/("|')(\\?.)*?\1/gm,command:{pattern:/^.*\$ git .*$/m,inside:{parameter:/\s(--|-)\w+/m}},coord:/^@@.*@@$/m,deleted:/^-(?!-).+$/m,inserted:/^\+(?!\+).+$/m,commit_sha1:/^commit \w{40}$/m};;
Prism.languages.less=Prism.languages.extend("css",{comment:[/\/\*[\w\W]*?\*\//g,{pattern:/(^|[^\\])\/\/.+/g,lookbehind:!0}],atrule:{pattern:/@[\w-]+?(?:\([^{}]+\)|[^(){};])*?(?=\s*\{)/gi,inside:{punctuation:/[:()]/g}},selector:{pattern:/(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\([^{}]*\)|[^{};@])*?(?=\s*\{)/g,inside:{variable:/@+[\w-]+/}},property:/(\b|\B)(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/gi,punctuation:/[{}();:,]/g,operator:/[+\-*\/]/}),Prism.languages.insertBefore("less","punctuation",{"function":Prism.languages.less.function}),Prism.languages.insertBefore("less","property",{variable:[{pattern:/@[\w-]+\s*:/,inside:{punctuation:/:/}},/@@?[\w-]+/],"mixin-usage":{pattern:/([{;]\s*)[.#](?!\d)[\w-]+.*?(?=[(;])/,lookbehind:!0,alias:"function"}});;
!function(){function e(e,t){return Array.prototype.slice.call((t||document).querySelectorAll(e))}function t(e,t){return t=" "+t+" ",(" "+e.className+" ").replace(/[\n\t]/g," ").indexOf(t)>-1}function n(e,n,r){for(var i,a=n.replace(/\s+/g,"").split(","),l=+e.getAttribute("data-line-offset")||0,o=parseFloat(getComputedStyle(e).lineHeight),d=0;i=a[d++];){i=i.split("-");var c=+i[0],h=+i[1]||c,s=document.createElement("div");s.textContent=Array(h-c+2).join(" \r\n"),s.className=(r||"")+" line-highlight",t(e,"line-numbers")||(s.setAttribute("data-start",c),h>c&&s.setAttribute("data-end",h)),s.style.top=(c-l-1)*o+"px",t(e,"line-numbers")?e.appendChild(s):(e.querySelector("code")||e).appendChild(s)}}function r(){var t=location.hash.slice(1);e(".temporary.line-highlight").forEach(function(e){e.parentNode.removeChild(e)});var r=(t.match(/\.([\d,-]+)$/)||[,""])[1];if(r&&!document.getElementById(t)){var i=t.slice(0,t.lastIndexOf(".")),a=document.getElementById(i);a&&(a.hasAttribute("data-line")||a.setAttribute("data-line",""),n(a,r,"temporary "),document.querySelector(".temporary.line-highlight").scrollIntoView())}}if(window.Prism){var i=(crlf=/\r?\n|\r/g,0);Prism.hooks.add("after-highlight",function(t){var a=t.element.parentNode,l=a&&a.getAttribute("data-line");a&&l&&/pre/i.test(a.nodeName)&&(clearTimeout(i),e(".line-highlight",a).forEach(function(e){e.parentNode.removeChild(e)}),n(a,l),i=setTimeout(r,1))}),addEventListener("hashchange",r)}}();;
Prism.hooks.add("after-highlight",function(e){var n=e.element.parentNode;if(n&&/pre/i.test(n.nodeName)&&-1!==n.className.indexOf("line-numbers")){var t,a=1+e.code.split("\n").length;lines=new Array(a),lines=lines.join("<span></span>"),t=document.createElement("span"),t.className="line-numbers-rows",t.innerHTML=lines,n.hasAttribute("data-start")&&(n.style.counterReset="linenumber "+(parseInt(n.getAttribute("data-start"),10)-1)),e.element.appendChild(t)}});;
!function(){if(self.Prism&&self.document&&document.querySelector){var e={js:"javascript",html:"markup",svg:"markup",xml:"markup",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell"};Array.prototype.slice.call(document.querySelectorAll("pre[data-src]")).forEach(function(t){var r=t.getAttribute("data-src"),n=(r.match(/\.(\w+)$/)||[,""])[1],s=e[n]||n,a=document.createElement("code");a.className="language-"+s,t.textContent="",a.textContent="Loading…",t.appendChild(a);var o=new XMLHttpRequest;o.open("GET",r,!0),o.onreadystatechange=function(){4==o.readyState&&(o.status<400&&o.responseText?(a.textContent=o.responseText,Prism.highlightElement(a)):a.textContent=o.status>=400?"✖ Error "+o.status+" while fetching file: "+o.statusText:"✖ Error: File does not exist or is empty")},o.send(null)})}}();;
!function(){if(self.Prism){var a={csharp:"C#",cpp:"C++"};Prism.hooks.add("before-highlight",function(e){var t=a[e.language]||e.language;e.element.setAttribute("data-language",t)})}}();;
;// For random header background images
// This approach was used in order to manipulate pseudo-elements
var count = 12,
	css = '.bg:after { background: url(/wp-content/themes/my-site/assets/img/bg/'+(Math.floor(Math.random()*(count))+1)+'.jpg) no-repeat center center fixed; }',
	head = document.head || document.getElementsByTagName('head')[0],
	style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
	style.styleSheet.cssText = css;
} else {
	style.appendChild(document.createTextNode(css));
}
head.appendChild(style);

;// Fluidbox

$(function () {
    //$('.entry-content p a').fluidbox(); // photos in entry content 
    $('.entry-content .row a').fluidbox(); // photos in a row in entry content
    $('.pictures figure a').fluidbox(); // photos in single-pictures.php
});

// Wrap every other <figure> in <div class="row"> in pic single
$('.pics > figure').each(function(i){
	if (i % 2 === 0) {
		$(this).nextAll().andSelf().slice(0,2).wrapAll('<div class="row no-gutter"></div>');
	}
});

// FitVids
$(document).ready(function(){
	$(".video-wrapper").fitVids();
});;/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can 
 * always reference jQuery with $, even when in .noConflict() mode.
 *
 * Google CDN, Latest jQuery
 * To use the default WordPress version of jQuery, go to lib/config.php and
 * remove or comment out: add_theme_support('jquery-cdn');
 * ======================================================================== */

(function($) {

// Use this variable to set up the common and page specific functions. If you 
// rename this variable, you will also need to rename the namespace below.
var Roots = {
  // All pages
  common: {
    init: function() {
      // JavaScript to be fired on all pages
    }
  },
  // Home page
  home: {
    init: function() {
      // JavaScript to be fired on the home page
    }
  },
  // About us page, note the change from about-us to about_us.
  about_us: {
    init: function() {
      // JavaScript to be fired on the about us page
    }
  }
};

// The routing fires all common scripts, followed by the page specific scripts.
// Add additional events for more control over timing e.g. a finalize event
var UTIL = {
  fire: function(func, funcname, args) {
    var namespace = Roots;
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
      namespace[func][funcname](args);
    }
  },
  loadEvents: function() {
    UTIL.fire('common');

    $.each(document.body.className.replace(/-/g, '_').split(/\s+/),function(i,classnm) {
      UTIL.fire(classnm);
    });
  }
};

$(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
