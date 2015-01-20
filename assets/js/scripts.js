/*
 * Justified Gallery - v3.5.1
 * http://miromannino.com/projects/justified-gallery/
 * Copyright (c) 2014 Miro Mannino
 * Licensed under the MIT license.
 */
(function($) {

  /* Events
    jg.complete : called when all the gallery has been created
    jg.resize : called when the gallery has been resized
  */

  $.fn.justifiedGallery = function (arg) {

    // Default options
    var defaults = {
      sizeRangeSuffixes : {
        'lt100': '',  // e.g. Flickr uses '_t'
        'lt240': '',  // e.g. Flickr uses '_m' 
        'lt320': '',  // e.g. Flickr uses '_n' 
        'lt500': '',  // e.g. Flickr uses '' 
        'lt640': '',  // e.g. Flickr uses '_z'
        'lt1024': '', // e.g. Flickr uses '_b'
      },
      rowHeight : 120,
      maxRowHeight : 0, // negative value = no limits, 0 = 1.5 * rowHeight
      margins : 1,
      lastRow : 'nojustify', // or can be 'justify' or 'hide'
      justifyThreshold: 0.75, /* if row width / available space > 0.75 it will be always justified 
                                  (i.e. lastRow setting is not considered) */
      fixedHeight : false,
      waitThumbnailsLoad : true,
      captions : true,
      cssAnimation: false,
      imagesAnimationDuration : 500, // ignored with css animations
      captionSettings : { // ignored with css animations
        animationDuration : 500,
        visibleOpacity : 0.7, 
        nonVisibleOpacity : 0.0 
      },
      rel : null, // rewrite the rel of each analyzed links
      target : null, // rewrite the target of all links
      extension : /\.[^.\\/]+$/,
      refreshTime : 100,
      randomize : false
    };

    function getSuffix(width, height, context) {
      var longestSide;
      longestSide = (width > height) ? width : height;
      if (longestSide <= 100) {
        return context.settings.sizeRangeSuffixes.lt100;
      } else if (longestSide <= 240) {
        return context.settings.sizeRangeSuffixes.lt240;
      } else if (longestSide <= 320) {
        return context.settings.sizeRangeSuffixes.lt320;
      } else if (longestSide <= 500) {
        return context.settings.sizeRangeSuffixes.lt500;
      } else if (longestSide <= 640) {
        return context.settings.sizeRangeSuffixes.lt640;
      } else {
        return context.settings.sizeRangeSuffixes.lt1024;
      }
    }

    function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function removeSuffix(str, suffix) {
      return str.substring(0, str.length - suffix.length);
    }

    function getUsedSuffix(str, context) {
      var voidSuffix = false;
      for (var si in context.settings.sizeRangeSuffixes) {
        if (context.settings.sizeRangeSuffixes[si].length === 0) {
          voidSuffix = true;
          continue;
        }
        if (endsWith(str, context.settings.sizeRangeSuffixes[si])) {
          return context.settings.sizeRangeSuffixes[si];
        }
      }

      if (voidSuffix) return "";
      else throw 'unknown suffix for ' + str;
    }

    /* Given an image src, with the width and the height, returns the new image src with the
       best suffix to show the best quality thumbnail. */
    function newSrc(imageSrc, imgWidth, imgHeight, context) {
      var matchRes = imageSrc.match(context.settings.extension);
      var ext = (matchRes != null) ? matchRes[0] : '';
      var newImageSrc = imageSrc.replace(context.settings.extension, '');
      newImageSrc = removeSuffix(newImageSrc, getUsedSuffix(newImageSrc, context));
      newImageSrc += getSuffix(imgWidth, imgHeight, context) + ext;
      return newImageSrc;
    }

    function onEntryMouseEnterForCaption (ev) {
      var $caption = $(ev.currentTarget).find('.caption');
      if (ev.data.settings.cssAnimation) {
        $caption.addClass('caption-visible').removeClass('caption-hidden');
      } else {
        $caption.stop().fadeTo(ev.data.settings.captionSettings.animationDuration, 
                               ev.data.settings.captionSettings.visibleOpacity);
      }
    }

    function onEntryMouseLeaveForCaption (ev) {
      var $caption = $(ev.currentTarget).find('.caption');
      if (ev.data.settings.cssAnimation) {
        $caption.removeClass('caption-visible').removeClass('caption-hidden');
      } else {
        $caption.stop().fadeTo(ev.data.settings.captionSettings.animationDuration, 
                               ev.data.settings.captionSettings.nonVisibleOpacity);
      }
    }

    function showImg($entry, callback, context) {
      if (context.settings.cssAnimation) {
        $entry.addClass('entry-visible');
        callback();
      } else {
        $entry.stop().fadeTo(context.settings.imagesAnimationDuration, 1.0, callback);
      }
    }

    function hideImgImmediately($entry, context) {
      if (context.settings.cssAnimation) {
        $entry.removeClass('entry-visible');
      } else {
        $entry.stop().fadeTo(0, 0);
      }
    }

    function imgFromEntry($entry) {
      var $img = $entry.find('> img');
      if ($img.length === 0) $img = $entry.find('> a > img');    
      return $img;
    }

    function displayEntry($entry, x, y, imgWidth, imgHeight, rowHeight, context) {
      var $image = imgFromEntry($entry);
      $image.css('width', imgWidth);
      $image.css('height', imgHeight);
      //if ($entry.get(0) === $image.parent().get(0)) { // this creates an error in link_around_img test
        $image.css('margin-left', - imgWidth / 2);
        $image.css('margin-top', - imgHeight / 2);
      //}
      $entry.width(imgWidth);
      $entry.height(rowHeight);
      $entry.css('top', y);
      $entry.css('left', x);

      //DEBUG// console.log('displayEntry (w: ' + $image.width() + ' h: ' + $image.height());

      // Image reloading for an high quality of thumbnails
      var imageSrc = $image.attr('src');
      var newImageSrc = newSrc(imageSrc, imgWidth, imgHeight, context);

      $image.one('error', function () {
        //DEBUG// console.log('revert the original image');
        $image.attr('src', $image.data('jg.originalSrc')); //revert to the original thumbnail, we got it.
      });

      function loadNewImage() {
        if (imageSrc !== newImageSrc) { //load the new image after the fadeIn
          $image.attr('src', newImageSrc);
        }
      }

      if ($image.data('jg.loaded') === 'skipped') {
        $image.one('load', function() {
          showImg($entry, loadNewImage, context);
          $image.data('jg.loaded', true);
        });
      } else {
        showImg($entry, loadNewImage, context);
      }

      // Captions ------------------------------
      var captionMouseEvents = $entry.data('jg.captionMouseEvents');
      if (context.settings.captions === true) {
        var $imgCaption = $entry.find('.caption');
        if ($imgCaption.length === 0) { // Create it if it doesn't exists
          var caption = $image.attr('alt');
          if (typeof caption === 'undefined') caption = $entry.attr('title');
          if (typeof caption !== 'undefined') { // Create only we found something
            $imgCaption = $('<div class="caption">' + caption + '</div>');
            $entry.append($imgCaption);
          }
        }
      
        // Create events (we check again the $imgCaption because it can be still inexistent)
        if ($imgCaption.length !== 0) {
          if (!context.settings.cssAnimation) {
            $imgCaption.stop().fadeTo(context.settings.imagesAnimationDuration, 
                                      context.settings.captionSettings.nonVisibleOpacity); 
          }
          if (typeof captionMouseEvents === 'undefined') {
            captionMouseEvents = {
              mouseenter: onEntryMouseEnterForCaption,
              mouseleave: onEntryMouseLeaveForCaption
            };
            $entry.on('mouseenter', undefined, context, captionMouseEvents.mouseenter);
            $entry.on('mouseleave', undefined, context, captionMouseEvents.mouseleave);
            $entry.data('jg.captionMouseEvents', captionMouseEvents);
          }
        }
      } else {
        if (typeof captionMouseEvents !== 'undefined') {
          $entry.off('mouseenter', undefined, context, captionMouseEvents.mouseenter);
          $entry.off('mouseleave', undefined, context, captionMouseEvents.mouseleave);
          $entry.removeData('jg.captionMouseEvents');
        }
      }

    }

    function prepareBuildingRow(context, isLastRow) {
      var settings = context.settings;
      var i, $entry, $image, imgAspectRatio, newImgW, newImgH, justify = true;
      var minHeight = 0;
      var availableWidth = context.galleryWidth - (
                            (context.buildingRow.entriesBuff.length + 1) * settings.margins);
      var rowHeight = availableWidth / context.buildingRow.aspectRatio;
      var justificable = context.buildingRow.width / availableWidth > settings.justifyThreshold;

      //Skip the last row if we can't justify it and the lastRow == 'hide'
      if (isLastRow && settings.lastRow === 'hide' && !justificable) {
        for (i = 0; i < context.buildingRow.entriesBuff.length; i++) {
          $entry = context.buildingRow.entriesBuff[i];
          if (settings.cssAnimation) 
            $entry.removeClass('entry-visible');            
          else
            $entry.stop().fadeTo(0, 0);
        }
        return -1;
      }

      // With lastRow = nojustify, justify if is justificable (the images will not become too big)
      if (isLastRow && !justificable && settings.lastRow === 'nojustify') justify = false;

      for (i = 0; i < context.buildingRow.entriesBuff.length; i++) {
        $image = imgFromEntry(context.buildingRow.entriesBuff[i]);
        imgAspectRatio = $image.data('jg.imgw') / $image.data('jg.imgh');

        if (justify) {
          newImgW = (i === context.buildingRow.entriesBuff.length - 1) ? availableWidth 
                      : rowHeight * imgAspectRatio;
          newImgH = rowHeight;

          /* With fixedHeight the newImgH must be greater than rowHeight. 
          In some cases here this is not satisfied (due to the justification).
          But we comment it, because is better to have a shorter but justified row instead 
          to have a cropped image at the end. */
          /*if (settings.fixedHeight && newImgH < settings.rowHeight) {
            newImgW = settings.rowHeight * imgAspectRatio;
            newImgH = settings.rowHeight;
          }*/

        } else {
          newImgW = settings.rowHeight * imgAspectRatio;
          newImgH = settings.rowHeight;
        }

        availableWidth -= Math.round(newImgW);
        $image.data('jg.jimgw', Math.round(newImgW));
        $image.data('jg.jimgh', Math.ceil(newImgH));
        if (i === 0 || minHeight > newImgH) minHeight = newImgH;
      }

      if (settings.fixedHeight && minHeight > settings.rowHeight) 
        minHeight = settings.rowHeight;

      return {minHeight: minHeight, justify: justify};
    }

    function rewind(context) {
      context.lastAnalyzedIndex = -1;
      context.buildingRow.entriesBuff = [];
      context.buildingRow.aspectRatio = 0;
      context.buildingRow.width = 0;
      context.offY = context.settings.margins;
    }

    function flushRow(context, isLastRow) {
      var settings = context.settings;
      var $entry, $image, minHeight, buildingRowRes, offX = settings.margins;

      //DEBUG// console.log('flush (isLastRow: ' + isLastRow + ')');

      buildingRowRes = prepareBuildingRow(context, isLastRow);
      minHeight = buildingRowRes.minHeight;
      if (isLastRow && settings.lastRow === 'hide' && minHeight === -1) {
        context.buildingRow.entriesBuff = [];
        context.buildingRow.aspectRatio = 0;
        context.buildingRow.width = 0;
        return;
      }

      if (settings.maxRowHeight > 0 && settings.maxRowHeight < minHeight)
        minHeight = settings.maxRowHeight;
      else if (settings.maxRowHeight === 0 && (1.5 * settings.rowHeight) < minHeight)
        minHeight = 1.5 * settings.rowHeight;

      for (var i = 0; i < context.buildingRow.entriesBuff.length; i++) {
        $entry = context.buildingRow.entriesBuff[i];
        $image = imgFromEntry($entry);
        displayEntry($entry, offX, context.offY, $image.data('jg.jimgw'), 
                     $image.data('jg.jimgh'), minHeight, context);
        offX += $image.data('jg.jimgw') + settings.margins;
      }

      //Gallery Height
      context.$gallery.height(context.offY + minHeight + settings.margins + 
        (context.spinner.active ? context.spinner.$el.innerHeight() : 0)
      );

      if (!isLastRow || (minHeight <= context.settings.rowHeight && buildingRowRes.justify)) {
        //Ready for a new row
        context.offY += minHeight + context.settings.margins;

        //DEBUG// console.log('minHeight: ' + minHeight + ' offY: ' + context.offY);

        context.buildingRow.entriesBuff = []; //clear the array creating a new one
        context.buildingRow.aspectRatio = 0;
        context.buildingRow.width = 0;
        context.$gallery.trigger('jg.rowflush');
      }
    }

    function checkWidth(context) {
      context.checkWidthIntervalId = setInterval(function () {
        var galleryWidth = parseInt(context.$gallery.width(), 10);
        if (context.galleryWidth !== galleryWidth) {
          //DEBUG// console.log("resize. old: " + context.galleryWidth + " new: " + galleryWidth);
          
          context.galleryWidth = galleryWidth;
          rewind(context);

          // Restart to analyze
          startImgAnalyzer(context, true);
        }
      }, context.settings.refreshTime);
    } 

    function startLoadingSpinnerAnimation(spinnerContext) {
      clearInterval(spinnerContext.intervalId);
      spinnerContext.intervalId = setInterval(function () {
        if (spinnerContext.phase < spinnerContext.$points.length) 
          spinnerContext.$points.eq(spinnerContext.phase).fadeTo(spinnerContext.timeslot, 1);
        else
          spinnerContext.$points.eq(spinnerContext.phase - spinnerContext.$points.length)
                        .fadeTo(spinnerContext.timeslot, 0);
        spinnerContext.phase = (spinnerContext.phase + 1) % (spinnerContext.$points.length * 2);
      }, spinnerContext.timeslot);
    }

    function stopLoadingSpinnerAnimation(spinnerContext) {
      clearInterval(spinnerContext.intervalId);
      spinnerContext.intervalId = null;
    }

    function stopImgAnalyzerStarter(context) {
      context.yield.flushed = 0;
      if (context.imgAnalyzerTimeout !== null) clearTimeout(context.imgAnalyzerTimeout);
    }

    function startImgAnalyzer(context, isForResize) {
      stopImgAnalyzerStarter(context);
      context.imgAnalyzerTimeout = setTimeout(function () { 
        analyzeImages(context, isForResize); 
      }, 0.001);
      analyzeImages(context, isForResize);
    }

    function analyzeImages(context, isForResize) {
      
      /* //DEBUG// 
      var rnd = parseInt(Math.random() * 10000, 10);
      console.log('analyzeImages ' + rnd + ' start');
      console.log('images status: ');
      for (var i = 0; i < context.entries.length; i++) {
        var $entry = $(context.entries[i]);
        var $image = imgFromEntry($entry);
        console.log(i + ' (alt: ' + $image.attr('alt') + 'loaded: ' + $image.data('jg.loaded') + ')');
      }*/

      /* The first row */
      var settings = context.settings;
      var isLastRow;
      
      for (var i = context.lastAnalyzedIndex + 1; i < context.entries.length; i++) {
        var $entry = $(context.entries[i]);
        var $image = imgFromEntry($entry);

        if ($image.data('jg.loaded') === true || $image.data('jg.loaded') === 'skipped') {
          isLastRow = i >= context.entries.length - 1;

          var availableWidth = context.galleryWidth - (
                               (context.buildingRow.entriesBuff.length - 1) * settings.margins);
          var imgAspectRatio = $image.data('jg.imgw') / $image.data('jg.imgh');
          if (availableWidth / (context.buildingRow.aspectRatio + imgAspectRatio) < settings.rowHeight) {
            flushRow(context, isLastRow);
            if(++context.yield.flushed >= context.yield.every) {
              //DEBUG// console.log("yield");
              startImgAnalyzer(context, isForResize);
              return;
            }
          }

          context.buildingRow.entriesBuff.push($entry);
          context.buildingRow.aspectRatio += imgAspectRatio;
          context.buildingRow.width += imgAspectRatio * settings.rowHeight;
          context.lastAnalyzedIndex = i;

        } else if ($image.data('jg.loaded') !== 'error') {
          return;
        }
      }

      // Last row flush (the row is not full)
      if (context.buildingRow.entriesBuff.length > 0) flushRow(context, true);

      if (context.spinner.active) {
        context.spinner.active = false;
        context.$gallery.height(context.$gallery.height() - context.spinner.$el.innerHeight());
        context.spinner.$el.detach();
        stopLoadingSpinnerAnimation(context.spinner);
      }

      /* Stop, if there is, the timeout to start the analyzeImages.
          This is because an image can be set loaded, and the timeout can be set,
          but this image can be analyzed yet. 
      */
      stopImgAnalyzerStarter(context);

      //On complete callback
      if (!isForResize) 
        context.$gallery.trigger('jg.complete'); 
      else 
        context.$gallery.trigger('jg.resize');

      //DEBUG// console.log('analyzeImages ' + rnd +  ' end');
    }

    function checkSettings (context) {
      var settings = context.settings;

      function checkSuffixesRange(range) {
        if (typeof settings.sizeRangeSuffixes[range] !== 'string')
          throw 'sizeRangeSuffixes.' + range + ' must be a string';
      }

      function checkOrConvertNumber(parent, settingName) {
        if (typeof parent[settingName] === 'string') {
          parent[settingName] = parseFloat(parent[settingName], 10);
          if (isNaN(parent[settingName])) throw 'invalid number for ' + settingName;
        } else if (typeof parent[settingName] === 'number') {
          if (isNaN(parent[settingName])) throw 'invalid number for ' + settingName;
        } else {
          throw settingName + ' must be a number';
        }
      }

      if (typeof settings.sizeRangeSuffixes !== 'object')
        throw 'sizeRangeSuffixes must be defined and must be an object';

      checkSuffixesRange('lt100');
      checkSuffixesRange('lt240');
      checkSuffixesRange('lt320');
      checkSuffixesRange('lt500');
      checkSuffixesRange('lt640');
      checkSuffixesRange('lt1024');

      checkOrConvertNumber(settings, 'rowHeight');
      checkOrConvertNumber(settings, 'maxRowHeight');

      if (settings.maxRowHeight > 0 && 
          settings.maxRowHeight < settings.rowHeight) {
        settings.maxRowHeight = settings.rowHeight;
      }
      
      checkOrConvertNumber(settings, 'margins');

      if (settings.lastRow !== 'nojustify' &&
          settings.lastRow !== 'justify' &&
          settings.lastRow !== 'hide') {
        throw 'lastRow must be "nojustify", "justify" or "hide"';
      }

      checkOrConvertNumber(settings, 'justifyThreshold');
      if (settings.justifyThreshold < 0 || settings.justifyThreshold > 1)
        throw 'justifyThreshold must be in the interval [0,1]';
      if (typeof settings.cssAnimation !== 'boolean') {
        throw 'cssAnimation must be a boolean'; 
      }
      
      checkOrConvertNumber(settings.captionSettings, 'animationDuration');
      checkOrConvertNumber(settings, 'imagesAnimationDuration');

      checkOrConvertNumber(settings.captionSettings, 'visibleOpacity');
      if (settings.captionSettings.visibleOpacity < 0 || settings.captionSettings.visibleOpacity > 1)
        throw 'captionSettings.visibleOpacity must be in the interval [0, 1]';

      checkOrConvertNumber(settings.captionSettings, 'nonVisibleOpacity');
      if (settings.captionSettings.visibleOpacity < 0 || settings.captionSettings.visibleOpacity > 1)
        throw 'captionSettings.nonVisibleOpacity must be in the interval [0, 1]';

      if (typeof settings.fixedHeight !== 'boolean') {
        throw 'fixedHeight must be a boolean';  
      }

      if (typeof settings.captions !== 'boolean') {
        throw 'captions must be a boolean'; 
      }

      checkOrConvertNumber(settings, 'refreshTime');

      if (typeof settings.randomize !== 'boolean') {
        throw 'randomize must be a boolean';  
      }

    }

    return this.each(function (index, gallery) {

      var $gallery = $(gallery);
      $gallery.addClass('justified-gallery');

      var context = $gallery.data('jg.context');
      if (typeof context === 'undefined') {

        if (typeof arg !== 'undefined' && arg !== null && typeof arg !== 'object') 
          throw 'The argument must be an object';

        // Spinner init
        var $spinner = $('<div class="spinner"><span></span><span></span><span></span></div>');
        var extendedSettings = $.extend({}, defaults, arg);

        //Context init
        context = {
          settings : extendedSettings,
          imgAnalyzerTimeout : null,
          entries : null,
          buildingRow : {
            entriesBuff : [],
            width : 0,
            aspectRatio : 0
          },
          lastAnalyzedIndex : -1,
          yield : {
            every : 2, /* do a flush every context.yield.every flushes (
                  * must be greater than 1, else the analyzeImages will loop */
            flushed : 0 //flushed rows without a yield
          },
          offY : extendedSettings.margins,
          spinner : {
            active : false,
            phase : 0,
            timeslot : 150,
            $el : $spinner,
            $points : $spinner.find('span'),
            intervalId : null
          },
          checkWidthIntervalId : null,
          galleryWidth : $gallery.width(),
          $gallery : $gallery
        };

        $gallery.data('jg.context', context);

      } else if (arg === 'norewind') {
        /* Hide the image of the buildingRow to prevent strange effects when the row will be
           re-justified again */
        for (var i = 0; i < context.buildingRow.entriesBuff.length; i++) {
          hideImgImmediately(context.buildingRow.entriesBuff[i], context);
        }
        // In this case we don't rewind, and analyze all the images
      } else {
        context.settings = $.extend({}, context.settings, arg);
        rewind(context);
      }
      
      checkSettings(context);

      context.entries = $gallery.find('> a, > div:not(.spinner)').toArray();
      if (context.entries.length === 0) return;

      // Randomize
      if (context.settings.randomize) {
        context.entries.sort(function () { return Math.random() * 2 - 1; });
        $.each(context.entries, function () {
          $(this).appendTo($gallery);
        });
      }

      var imagesToLoad = false;
      var skippedImages = false;
      $.each(context.entries, function (index, entry) {
        var $entry = $(entry);
        var $image = imgFromEntry($entry);

        $entry.addClass('jg-entry');

        if ($image.data('jg.loaded') !== true && $image.data('jg.loaded') !== 'skipped') {

          // Link Rel global overwrite
          if (context.settings.rel !== null) $entry.attr('rel', context.settings.rel);

          // Link Target global overwrite
          if (context.settings.target !== null) $entry.attr('target', context.settings.target);

          // Image src
          var imageSrc = (typeof $image.data('safe-src') !== 'undefined') ? 
                            $image.data('safe-src') : $image.attr('src');
          $image.data('jg.originalSrc', imageSrc);
          $image.attr('src', imageSrc);

          var width = parseInt($image.attr('width'), 10);
          var height = parseInt($image.attr('height'), 10);
          if(context.settings.waitThumbnailsLoad !== true && !isNaN(width) && !isNaN(height)) {
            $image.data('jg.imgw', width);
            $image.data('jg.imgh', height);
            $image.data('jg.loaded', 'skipped');
            skippedImages = true;
            startImgAnalyzer(context, false);
            return true;
          }

          $image.data('jg.loaded', false);
          imagesToLoad = true;

          // Spinner start
          if (context.spinner.active === false) {
            context.spinner.active = true;
            $gallery.append(context.spinner.$el);
            $gallery.height(context.offY + context.spinner.$el.innerHeight());
            startLoadingSpinnerAnimation(context.spinner);
          }

          /* Check if the image is loaded or not using another image object.
            We cannot use the 'complete' image property, because some browsers, 
            with a 404 set complete = true */
          var loadImg = new Image();
          var $loadImg = $(loadImg);
          $loadImg.one('load', function imgLoaded () {
            //DEBUG// console.log('img load (alt: ' + $image.attr('alt') + ')');
            $image.off('load error');
            $image.data('jg.imgw', loadImg.width);
            $image.data('jg.imgh', loadImg.height);
            $image.data('jg.loaded', true);
            startImgAnalyzer(context, false);
          });
          $loadImg.one('error', function imgLoadError () {
            //DEBUG// console.log('img error (alt: ' + $image.attr('alt') + ')');
            $image.off('load error');
            $image.data('jg.loaded', 'error');
            startImgAnalyzer(context, false);
          });
          loadImg.src = imageSrc;

        }

      });

      if (!imagesToLoad && !skippedImages) startImgAnalyzer(context, false);
      checkWidth(context);
    });

  };
  
}(jQuery));;// Fluidbox
// Description: Replicating the seamless lightbox transition effect seen on Medium.com, with some improvements
// Version: 1.3.5
// Author: Terry Mun
// Author URI: http://terrymun.com

// --------------------------------------------------------
//  Dependency: Paul Irish's jQuery debounced resize event
// --------------------------------------------------------
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

// -----------------------------
//  Fluidbox plugin starts here
// -----------------------------
(function ($) {

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
			]
		}, opts);

		// Ensure that the stackIndex does not become negative
		if(settings.stackIndex < settings.stackIndexDelta) settings.stackIndexDelta = settings.stackIndex;

		// Dynamically create overlay
		$fbOverlay = $('<div />', {
			class: 'fluidbox-overlay',
			css: {
				'z-index': settings.stackIndex
			}
		});

		// Declare variables
		var $fb = this,
			$w = $(window),		// Shorthand for $(window)
			vpRatio,

			// Function:
			// 1. funcCloseFb()		- used to close any instance of opened Fluidbox
			// 2. funcPositionFb()	- used for dynamic positioning of any instance of opened Fluidbox
			// 3. funcCalcAll()		- used to run funcCalc() for every instance of targered Fluidbox thumbnail
			// 4. funcCalc()		- used to store dimensions of image, ghost element and wrapper element upon initialization or resize
			// 5. fbClickhandler()	- universal click handler for all Fluidbox items
			funcCloseFb = function () {
				$('.fluidbox-opened').trigger('click');
			},
			funcPositionFb = function ($activeFb) {
				// Get shorthand for more objects
				var $img    = $activeFb.find('img'),
					$ghost  = $activeFb.find('.fluidbox-ghost'),
					$wrap	= $activeFb.find('.fluidbox-wrap'),
					$data	= $activeFb.data(),
					fHeight = 0,
					fWidth	= 0;

				// Check natural dimensions
				if(vpRatio > $img.data().imgRatio) {
					if($data.natHeight < $w.height()*settings.viewportFill) {
						fHeight = $data.natHeight;
					} else {
						fHeight = $w.height()*settings.viewportFill;
					}
					$data.imgScale = fHeight/$img.height();
				} else {
					if($data.natWidth < $w.width()*settings.viewportFill) {
						fWidth = $data.natWidth;
					} else {
						fWidth = $w.width()*settings.viewportFill;
					}
					$data.imgScale = fWidth/$img.width();
				}	

				// Calculation goes here
				var offsetY = $w.scrollTop()-$img.offset().top+0.5*($img.data('imgHeight')*($img.data('imgScale')-1))+0.5*($w.height()-$img.data('imgHeight')*$img.data('imgScale')),
					offsetX = 0.5*($img.data('imgWidth')*($img.data('imgScale')-1))+0.5*($w.width()-$img.data('imgWidth')*$img.data('imgScale'))-$img.offset().left,
					scale   = $data.imgScale;

				// Apply CSS transforms to ghost element
				// For offsetX and Y, we round to one decimal place
				// For scale, we round to three decimal places
				$ghost.css({
					'transform': 'translate('+parseInt(offsetX*10)/10+'px,'+parseInt(offsetY*10)/10+'px) scale('+parseInt(scale*1000)/1000+')',
					top: $img.offset().top - $wrap.offset().top,
					left: $img.offset().left - $wrap.offset().left
				});
			},
			funcCalcAll = function() {
				$fb.each(function () {
					funcCalc($(this));
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

					if($(this).data('fluidbox-state') === 0 || !$(this).data('fluidbox-state')) {
						// State: Closed
						// Action: Open fluidbox

						// Wait for ghost image to be loaded successfully first, then do the rest
						$('<img />', {
							src: $img.attr('src')
						}).load(function () {
							// Preload ghost image
							$('<img />', {
								src: $activeFb.attr('href')
							}).load(function() {
								// Store natural width and heights
								$activeFb
								.data('natWidth', $(this)[0].naturalWidth)
								.data('natHeight', $(this)[0].naturalHeight);

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

								// Set thumbnail image source as background image first, preload later
								$ghost.css({
									'background-image': 'url('+$img.attr('src')+')',
									opacity: 1
								});

								// Hide original image
								$img.css({ opacity: 0 });

								$ghost.css({ 'background-image': 'url('+$activeFb.attr('href')+')' });

								// Position Fluidbox
								funcPositionFb($activeFb);
							});
						});

					} else {
						// State: Open
						// Action: Close fluidbox

						// Switch state
						$activeFb
						.data('fluidbox-state', 0)
						.removeClass('fluidbox-opened')
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
						});
						$img.css({ opacity: 1 });
					}

					e.preventDefault();
				}
			};

		// When should we close Fluidbox?
		if(settings.closeTrigger) {
			// Go through array
			$.each(settings.closeTrigger, function (i) {
				var trigger = settings.closeTrigger[i];

				// Attach events
				if(trigger.selector != 'window') {
					// If it is not 'window', we append click handler to $(document) object, allow it to bubble up
					// However, if thes selector is 'document', we use a different .on() syntax
					if(trigger.selector == 'document') {
						if(trigger.keyCode) {
							$(document).on(trigger.event, function (e) {
								if(e.keyCode == trigger.keyCode) funcCloseFb();
							});
						} else {
							$(document).on(trigger.event, funcCloseFb);
						}
					} else {
						$(document).on(trigger.event, settings.closeTrigger[i].selector, funcCloseFb);
					}
				} else {
					// If it is 'window', append click handler to $(window) object
					$w.on(trigger.event, funcCloseFb);
				}
			});
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
					class: 'fluidbox-wrap',
					css: {
						'z-index': settings.stackIndex - settings.stackIndexDelta
					}
				});

				// Add class
				var $fbItem = $(this);
				$fbItem
				.addClass('fluidbox')
				.wrapInner($fbInnerWrap)
				.find('img')
					.css({ opacity: 1 })
					.after('<div class="fluidbox-ghost" />')
					.each(function(){
						var $img = $(this);
						
						if ($img.width() > 0 && $img.height() > 0) {
							// if image is already loaded (from cache)
							funcCalc($fbItem);
							$fbItem.click(fbClickHandler);
						} else {
							// wait for image to load
							$img.load(function(){
								funcCalc($fbItem);
								$fbItem.click(fbClickHandler);
							});
						}
				});

			}
		});

		// Listen to window resize event
		// Check if user wants to debounce the resize event (it is debounced by default)
		var funcResize = function () {
			// Recalculate dimensions
			funcCalcAll();

			// Reposition Fluidbox, but only if one is found to be open
			var $activeFb = $('a.fluidbox.fluidbox-opened');
			if($activeFb.length > 0) funcPositionFb($activeFb);
		}

		if(settings.debounceResize) {
			$(window).smartresize(funcResize);
		} else {
			$(window).resize(funcResize);
		}

		// Return to allow chaining
		return $fb;
	};

})(jQuery);;/* resize background images */
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
backgroundResize();;$('#gallery').justifiedGallery({
	rowHeight: 220,
	lastRow: 'nojustify',
	margins: 1,
	captions: false,
	randomize: true
});;// Normal Clicks
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
});;/* http://prismjs.com/download.html?themes=prism&languages=markup+css+css-extras+clike+javascript+php+php-extras+scss+apacheconf+git&plugins=line-highlight+line-numbers+file-highlight+show-language */
self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var _ = self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					return o.slice();
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];
			
			if (arguments.length == 2) {
				insert = arguments[1];
				
				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}
				
				return grammar;
			}
			
			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}
			
			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type) {
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object') {
						_.languages.DFS(o[i], callback);
					}
					else if (_.util.type(o[i]) === 'Array') {
						_.languages.DFS(o[i], callback, i);
					}
				}
			}
		}
	},

	highlightAll: function(async, callback) {
		var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1];
			grammar = _.languages[language];
		}

		if (!grammar) {
			return;
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		if(!code) {
			return;
		}

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-highlight', env);

		if (async && self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language)

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					lookbehindLength = 0,
					alias = pattern.alias;

				pattern = pattern.pattern || pattern;

				for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str);

					if (match) {
						if(lookbehind) {
							lookbehindLength = match[1].length;
						}

						var from = match.index - 1 + lookbehindLength,
							match = match[0].slice(lookbehindLength),
							len = match.length,
							to = from + len,
							before = str.slice(0, from + 1),
							after = str.slice(to + 1);

						var args = [i, 1];

						if (before) {
							args.push(before);
						}

						var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias);

						args.push(wrapped);

						if (after) {
							args.push(after);
						}

						Array.prototype.splice.apply(strarr, args);
					}
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias) {
	this.type = type;
	this.content = content;
	this.alias = alias;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (Object.prototype.toString.call(o) == '[object Array]') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = '';

	for (var name in env.attributes) {
		attributes += name + '="' + (env.attributes[name] || '') + '"';
	}

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

};

if (!self.document) {
	if (!self.addEventListener) {
		// in Node.js
		return self.Prism;
	}
 	// In worker
	self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code;

		self.postMessage(JSON.stringify(_.util.encode(_.tokenize(code, _.languages[lang]))));
		self.close();
	}, false);

	return self.Prism;
}

// Get current script and highlight
var script = document.getElementsByTagName('script');

script = script[script.length - 1];

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		document.addEventListener('DOMContentLoaded', _.highlightAll);
	}
}

return self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}
;
Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/g,
	'prolog': /<\?.+?\?>/,
	'doctype': /<!DOCTYPE.+?>/,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,
		inside: {
			'tag': {
				pattern: /^<\/?[\w:-]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[\w-]+?:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
				inside: {
					'punctuation': /=|>|"/g
				}
			},
			'punctuation': /\/?>/g,
			'attr-name': {
				pattern: /[\w:-]+/g,
				inside: {
					'namespace': /^[\w-]+?:/
				}
			}

		}
	},
	'entity': /\&#?[\da-z]{1,8};/gi
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});
;
Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//g,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
		inside: {
			'punctuation': /[;:]/g
		}
	},
	'url': /url\((["']?).*?\1\)/gi,
	'selector': /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
	'property': /(\b|\B)[\w-]+(?=\s*:)/ig,
	'string': /("|')(\\?.)*?\1/g,
	'important': /\B!important\b/gi,
	'punctuation': /[\{\};:]/g,
	'function': /[-a-z0-9]+(?=\()/ig
};

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/ig,
			inside: {
				'tag': {
					pattern: /<style[\w\W]*?>|<\/style>/ig,
					inside: Prism.languages.markup.tag.inside
				},
				rest: Prism.languages.css
			},
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').+?\1/ig,
			inside: {
				'attr-name': {
					pattern: /^\s*style/ig,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/gi,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
};
Prism.languages.css.selector = {
	pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/g,
	inside: {
		'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/g,
		'pseudo-class': /:[-\w]+(?:\(.*\))?/g,
		'class': /\.[-:\.\w]+/g,
		'id': /#[-:\.\w]+/g
	}
};

Prism.languages.insertBefore('css', 'ignore', {
	'hexcode': /#[\da-f]{3,6}/gi,
	'entity': /\\[\da-f]{1,8}/gi,
	'number': /[\d%\.]+/g
});;
Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//g,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*?(\r?\n|$)/g,
			lookbehind: true
		}
	],
	'string': /("|')(\\?.)*?\1/g,
	'class-name': {
		pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,
	'function': {
		pattern: /[a-z0-9_]+\(/ig,
		inside: {
			punctuation: /\(/
		}
	},
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
	'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[{}[\];(),.:]/g
};
;
Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g,
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
		lookbehind: true
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/ig,
			inside: {
				'tag': {
					pattern: /<script[\w\W]*?>|<\/script>/ig,
					inside: Prism.languages.markup.tag.inside
				},
				rest: Prism.languages.javascript
			},
			alias: 'language-javascript'
		}
	});
}
;
/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 *
 * Supports the following:
 * 		- Extends clike syntax
 * 		- Support for PHP 5.3+ (namespaces, traits, generators, etc)
 * 		- Smarter constant and function matching
 *
 * Adds the following new token classes:
 * 		constant, delimiter, variable, function, package
 */

Prism.languages.php = Prism.languages.extend('clike', {
	'keyword': /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/ig,
	'constant': /\b[A-Z0-9_]{2,}\b/g,
	'comment': {
		pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])(\/\/|#).*?(\r?\n|$))/g,
		lookbehind: true
	}
});

Prism.languages.insertBefore('php', 'keyword', {
	'delimiter': /(\?>|<\?php|<\?)/ig,
	'variable': /(\$\w+)\b/ig,
	'package': {
		pattern: /(\\|namespace\s+|use\s+)[\w\\]+/g,
		lookbehind: true,
		inside: {
			punctuation: /\\/
		}
	}
});

// Must be defined after the function pattern
Prism.languages.insertBefore('php', 'operator', {
	'property': {
		pattern: /(->)[\w]+/g,
		lookbehind: true
	}
});

// Add HTML support of the markup language exists
if (Prism.languages.markup) {

	// Tokenize all inline PHP blocks that are wrapped in <?php ?>
	// This allows for easy PHP + markup highlighting
	Prism.hooks.add('before-highlight', function(env) {
		if (env.language !== 'php') {
			return;
		}

		env.tokenStack = [];

		env.backupCode = env.code;
		env.code = env.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/ig, function(match) {
			env.tokenStack.push(match);

			return '{{{PHP' + env.tokenStack.length + '}}}';
		});
	});

	// Restore env.code for other plugins (e.g. line-numbers)
	Prism.hooks.add('before-insert', function(env) {
		if (env.language === 'php') {
			env.code = env.backupCode;
			delete env.backupCode;
		}
	});

	// Re-insert the tokens after highlighting
	Prism.hooks.add('after-highlight', function(env) {
		if (env.language !== 'php') {
			return;
		}

		for (var i = 0, t; t = env.tokenStack[i]; i++) {
			env.highlightedCode = env.highlightedCode.replace('{{{PHP' + (i + 1) + '}}}', Prism.highlight(t, env.grammar, 'php'));
		}

		env.element.innerHTML = env.highlightedCode;
	});

	// Wrap tokens in classes that are missing them
	Prism.hooks.add('wrap', function(env) {
		if (env.language === 'php' && env.type === 'markup') {
			env.content = env.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, "<span class=\"token php\">$1</span>");
		}
	});

	// Add the rules before all others
	Prism.languages.insertBefore('php', 'comment', {
		'markup': {
			pattern: /<[^?]\/?(.*?)>/g,
			inside: Prism.languages.markup
		},
		'php': /\{\{\{PHP[0-9]+\}\}\}/g
	});
}
;
Prism.languages.insertBefore('php', 'variable', {
	'this': /\$this/g,
	'global': /\$_?(GLOBALS|SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/g,
	'scope': {
		pattern: /\b[\w\\]+::/g,
		inside: {
			keyword: /(static|self|parent)/,
			punctuation: /(::|\\)/
		}
	}
});;
Prism.languages.scss = Prism.languages.extend('css', {
	'comment': {
		pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|\/\/.*?(\r?\n|$))/g,
		lookbehind: true
	},
	// aturle is just the @***, not the entire rule (to highlight var & stuffs)
	// + add ability to highlight number & unit for media queries
	'atrule': /@[\w-]+(?=\s+(\(|\{|;))/gi,
	// url, compassified
	'url': /([-a-z]+-)*url(?=\()/gi,
	// CSS selector regex is not appropriate for Sass
	// since there can be lot more things (var, @ directive, nesting..)
	// a selector must start at the end of a property or after a brace (end of other rules or nesting)
	// it can contain some caracters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
	// the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
	// can "pass" as a selector- e.g: proper#{$erty})
	// this one was ard to do, so please be careful if you edit this one :)
	'selector': /([^@;\{\}\(\)]?([^@;\{\}\(\)]|&|\#\{\$[-_\w]+\})+)(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/gm
});

Prism.languages.insertBefore('scss', 'atrule', {
	'keyword': /@(if|else if|else|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)|(?=@for\s+\$[-_\w]+\s)+from/i
});

Prism.languages.insertBefore('scss', 'property', {
	// var and interpolated vars
	'variable': /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i
});

Prism.languages.insertBefore('scss', 'ignore', {
	'placeholder': /%[-_\w]+/i,
	'statement': /\B!(default|optional)\b/gi,
	'boolean': /\b(true|false)\b/g,
	'null': /\b(null)\b/g,
	'operator': /\s+([-+]{1,2}|={1,2}|!=|\|?\||\?|\*|\/|\%)\s+/g
});
;
Prism.languages.apacheconf = {
	'comment': /\#.*/g,
	'directive-inline': {
		pattern: /^\s*\b(AcceptFilter|AcceptPathInfo|AccessFileName|Action|AddAlt|AddAltByEncoding|AddAltByType|AddCharset|AddDefaultCharset|AddDescription|AddEncoding|AddHandler|AddIcon|AddIconByEncoding|AddIconByType|AddInputFilter|AddLanguage|AddModuleInfo|AddOutputFilter|AddOutputFilterByType|AddType|Alias|AliasMatch|Allow|AllowCONNECT|AllowEncodedSlashes|AllowMethods|AllowOverride|AllowOverrideList|Anonymous|Anonymous_LogEmail|Anonymous_MustGiveEmail|Anonymous_NoUserID|Anonymous_VerifyEmail|AsyncRequestWorkerFactor|AuthBasicAuthoritative|AuthBasicFake|AuthBasicProvider|AuthBasicUseDigestAlgorithm|AuthDBDUserPWQuery|AuthDBDUserRealmQuery|AuthDBMGroupFile|AuthDBMType|AuthDBMUserFile|AuthDigestAlgorithm|AuthDigestDomain|AuthDigestNonceLifetime|AuthDigestProvider|AuthDigestQop|AuthDigestShmemSize|AuthFormAuthoritative|AuthFormBody|AuthFormDisableNoStore|AuthFormFakeBasicAuth|AuthFormLocation|AuthFormLoginRequiredLocation|AuthFormLoginSuccessLocation|AuthFormLogoutLocation|AuthFormMethod|AuthFormMimetype|AuthFormPassword|AuthFormProvider|AuthFormSitePassphrase|AuthFormSize|AuthFormUsername|AuthGroupFile|AuthLDAPAuthorizePrefix|AuthLDAPBindAuthoritative|AuthLDAPBindDN|AuthLDAPBindPassword|AuthLDAPCharsetConfig|AuthLDAPCompareAsUser|AuthLDAPCompareDNOnServer|AuthLDAPDereferenceAliases|AuthLDAPGroupAttribute|AuthLDAPGroupAttributeIsDN|AuthLDAPInitialBindAsUser|AuthLDAPInitialBindPattern|AuthLDAPMaxSubGroupDepth|AuthLDAPRemoteUserAttribute|AuthLDAPRemoteUserIsDN|AuthLDAPSearchAsUser|AuthLDAPSubGroupAttribute|AuthLDAPSubGroupClass|AuthLDAPUrl|AuthMerging|AuthName|AuthnCacheContext|AuthnCacheEnable|AuthnCacheProvideFor|AuthnCacheSOCache|AuthnCacheTimeout|AuthnzFcgiCheckAuthnProvider|AuthnzFcgiDefineProvider|AuthType|AuthUserFile|AuthzDBDLoginToReferer|AuthzDBDQuery|AuthzDBDRedirectQuery|AuthzDBMType|AuthzSendForbiddenOnFailure|BalancerGrowth|BalancerInherit|BalancerMember|BalancerPersist|BrowserMatch|BrowserMatchNoCase|BufferedLogs|BufferSize|CacheDefaultExpire|CacheDetailHeader|CacheDirLength|CacheDirLevels|CacheDisable|CacheEnable|CacheFile|CacheHeader|CacheIgnoreCacheControl|CacheIgnoreHeaders|CacheIgnoreNoLastMod|CacheIgnoreQueryString|CacheIgnoreURLSessionIdentifiers|CacheKeyBaseURL|CacheLastModifiedFactor|CacheLock|CacheLockMaxAge|CacheLockPath|CacheMaxExpire|CacheMaxFileSize|CacheMinExpire|CacheMinFileSize|CacheNegotiatedDocs|CacheQuickHandler|CacheReadSize|CacheReadTime|CacheRoot|CacheSocache|CacheSocacheMaxSize|CacheSocacheMaxTime|CacheSocacheMinTime|CacheSocacheReadSize|CacheSocacheReadTime|CacheStaleOnError|CacheStoreExpired|CacheStoreNoStore|CacheStorePrivate|CGIDScriptTimeout|CGIMapExtension|CharsetDefault|CharsetOptions|CharsetSourceEnc|CheckCaseOnly|CheckSpelling|ChrootDir|ContentDigest|CookieDomain|CookieExpires|CookieName|CookieStyle|CookieTracking|CoreDumpDirectory|CustomLog|Dav|DavDepthInfinity|DavGenericLockDB|DavLockDB|DavMinTimeout|DBDExptime|DBDInitSQL|DBDKeep|DBDMax|DBDMin|DBDParams|DBDPersist|DBDPrepareSQL|DBDriver|DefaultIcon|DefaultLanguage|DefaultRuntimeDir|DefaultType|Define|DeflateBufferSize|DeflateCompressionLevel|DeflateFilterNote|DeflateInflateLimitRequestBody|DeflateInflateRatioBurst|DeflateInflateRatioLimit|DeflateMemLevel|DeflateWindowSize|Deny|DirectoryCheckHandler|DirectoryIndex|DirectoryIndexRedirect|DirectorySlash|DocumentRoot|DTracePrivileges|DumpIOInput|DumpIOOutput|EnableExceptionHook|EnableMMAP|EnableSendfile|Error|ErrorDocument|ErrorLog|ErrorLogFormat|Example|ExpiresActive|ExpiresByType|ExpiresDefault|ExtendedStatus|ExtFilterDefine|ExtFilterOptions|FallbackResource|FileETag|FilterChain|FilterDeclare|FilterProtocol|FilterProvider|FilterTrace|ForceLanguagePriority|ForceType|ForensicLog|GprofDir|GracefulShutdownTimeout|Group|Header|HeaderName|HeartbeatAddress|HeartbeatListen|HeartbeatMaxServers|HeartbeatStorage|HeartbeatStorage|HostnameLookups|IdentityCheck|IdentityCheckTimeout|ImapBase|ImapDefault|ImapMenu|Include|IncludeOptional|IndexHeadInsert|IndexIgnore|IndexIgnoreReset|IndexOptions|IndexOrderDefault|IndexStyleSheet|InputSed|ISAPIAppendLogToErrors|ISAPIAppendLogToQuery|ISAPICacheFile|ISAPIFakeAsync|ISAPILogNotSupported|ISAPIReadAheadBuffer|KeepAlive|KeepAliveTimeout|KeptBodySize|LanguagePriority|LDAPCacheEntries|LDAPCacheTTL|LDAPConnectionPoolTTL|LDAPConnectionTimeout|LDAPLibraryDebug|LDAPOpCacheEntries|LDAPOpCacheTTL|LDAPReferralHopLimit|LDAPReferrals|LDAPRetries|LDAPRetryDelay|LDAPSharedCacheFile|LDAPSharedCacheSize|LDAPTimeout|LDAPTrustedClientCert|LDAPTrustedGlobalCert|LDAPTrustedMode|LDAPVerifyServerCert|LimitInternalRecursion|LimitRequestBody|LimitRequestFields|LimitRequestFieldSize|LimitRequestLine|LimitXMLRequestBody|Listen|ListenBackLog|LoadFile|LoadModule|LogFormat|LogLevel|LogMessage|LuaAuthzProvider|LuaCodeCache|LuaHookAccessChecker|LuaHookAuthChecker|LuaHookCheckUserID|LuaHookFixups|LuaHookInsertFilter|LuaHookLog|LuaHookMapToStorage|LuaHookTranslateName|LuaHookTypeChecker|LuaInherit|LuaInputFilter|LuaMapHandler|LuaOutputFilter|LuaPackageCPath|LuaPackagePath|LuaQuickHandler|LuaRoot|LuaScope|MaxConnectionsPerChild|MaxKeepAliveRequests|MaxMemFree|MaxRangeOverlaps|MaxRangeReversals|MaxRanges|MaxRequestWorkers|MaxSpareServers|MaxSpareThreads|MaxThreads|MergeTrailers|MetaDir|MetaFiles|MetaSuffix|MimeMagicFile|MinSpareServers|MinSpareThreads|MMapFile|ModemStandard|ModMimeUsePathInfo|MultiviewsMatch|Mutex|NameVirtualHost|NoProxy|NWSSLTrustedCerts|NWSSLUpgradeable|Options|Order|OutputSed|PassEnv|PidFile|PrivilegesMode|Protocol|ProtocolEcho|ProxyAddHeaders|ProxyBadHeader|ProxyBlock|ProxyDomain|ProxyErrorOverride|ProxyExpressDBMFile|ProxyExpressDBMType|ProxyExpressEnable|ProxyFtpDirCharset|ProxyFtpEscapeWildcards|ProxyFtpListOnWildcard|ProxyHTMLBufSize|ProxyHTMLCharsetOut|ProxyHTMLDocType|ProxyHTMLEnable|ProxyHTMLEvents|ProxyHTMLExtended|ProxyHTMLFixups|ProxyHTMLInterp|ProxyHTMLLinks|ProxyHTMLMeta|ProxyHTMLStripComments|ProxyHTMLURLMap|ProxyIOBufferSize|ProxyMaxForwards|ProxyPass|ProxyPassInherit|ProxyPassInterpolateEnv|ProxyPassMatch|ProxyPassReverse|ProxyPassReverseCookieDomain|ProxyPassReverseCookiePath|ProxyPreserveHost|ProxyReceiveBufferSize|ProxyRemote|ProxyRemoteMatch|ProxyRequests|ProxySCGIInternalRedirect|ProxySCGISendfile|ProxySet|ProxySourceAddress|ProxyStatus|ProxyTimeout|ProxyVia|ReadmeName|ReceiveBufferSize|Redirect|RedirectMatch|RedirectPermanent|RedirectTemp|ReflectorHeader|RemoteIPHeader|RemoteIPInternalProxy|RemoteIPInternalProxyList|RemoteIPProxiesHeader|RemoteIPTrustedProxy|RemoteIPTrustedProxyList|RemoveCharset|RemoveEncoding|RemoveHandler|RemoveInputFilter|RemoveLanguage|RemoveOutputFilter|RemoveType|RequestHeader|RequestReadTimeout|Require|RewriteBase|RewriteCond|RewriteEngine|RewriteMap|RewriteOptions|RewriteRule|RLimitCPU|RLimitMEM|RLimitNPROC|Satisfy|ScoreBoardFile|Script|ScriptAlias|ScriptAliasMatch|ScriptInterpreterSource|ScriptLog|ScriptLogBuffer|ScriptLogLength|ScriptSock|SecureListen|SeeRequestTail|SendBufferSize|ServerAdmin|ServerAlias|ServerLimit|ServerName|ServerPath|ServerRoot|ServerSignature|ServerTokens|Session|SessionCookieName|SessionCookieName2|SessionCookieRemove|SessionCryptoCipher|SessionCryptoDriver|SessionCryptoPassphrase|SessionCryptoPassphraseFile|SessionDBDCookieName|SessionDBDCookieName2|SessionDBDCookieRemove|SessionDBDDeleteLabel|SessionDBDInsertLabel|SessionDBDPerUser|SessionDBDSelectLabel|SessionDBDUpdateLabel|SessionEnv|SessionExclude|SessionHeader|SessionInclude|SessionMaxAge|SetEnv|SetEnvIf|SetEnvIfExpr|SetEnvIfNoCase|SetHandler|SetInputFilter|SetOutputFilter|SSIEndTag|SSIErrorMsg|SSIETag|SSILastModified|SSILegacyExprParser|SSIStartTag|SSITimeFormat|SSIUndefinedEcho|SSLCACertificateFile|SSLCACertificatePath|SSLCADNRequestFile|SSLCADNRequestPath|SSLCARevocationCheck|SSLCARevocationFile|SSLCARevocationPath|SSLCertificateChainFile|SSLCertificateFile|SSLCertificateKeyFile|SSLCipherSuite|SSLCompression|SSLCryptoDevice|SSLEngine|SSLFIPS|SSLHonorCipherOrder|SSLInsecureRenegotiation|SSLOCSPDefaultResponder|SSLOCSPEnable|SSLOCSPOverrideResponder|SSLOCSPResponderTimeout|SSLOCSPResponseMaxAge|SSLOCSPResponseTimeSkew|SSLOCSPUseRequestNonce|SSLOpenSSLConfCmd|SSLOptions|SSLPassPhraseDialog|SSLProtocol|SSLProxyCACertificateFile|SSLProxyCACertificatePath|SSLProxyCARevocationCheck|SSLProxyCARevocationFile|SSLProxyCARevocationPath|SSLProxyCheckPeerCN|SSLProxyCheckPeerExpire|SSLProxyCheckPeerName|SSLProxyCipherSuite|SSLProxyEngine|SSLProxyMachineCertificateChainFile|SSLProxyMachineCertificateFile|SSLProxyMachineCertificatePath|SSLProxyProtocol|SSLProxyVerify|SSLProxyVerifyDepth|SSLRandomSeed|SSLRenegBufferSize|SSLRequire|SSLRequireSSL|SSLSessionCache|SSLSessionCacheTimeout|SSLSessionTicketKeyFile|SSLSRPUnknownUserSeed|SSLSRPVerifierFile|SSLStaplingCache|SSLStaplingErrorCacheTimeout|SSLStaplingFakeTryLater|SSLStaplingForceURL|SSLStaplingResponderTimeout|SSLStaplingResponseMaxAge|SSLStaplingResponseTimeSkew|SSLStaplingReturnResponderErrors|SSLStaplingStandardCacheTimeout|SSLStrictSNIVHostCheck|SSLUserName|SSLUseStapling|SSLVerifyClient|SSLVerifyDepth|StartServers|StartThreads|Substitute|Suexec|SuexecUserGroup|ThreadLimit|ThreadsPerChild|ThreadStackSize|TimeOut|TraceEnable|TransferLog|TypesConfig|UnDefine|UndefMacro|UnsetEnv|Use|UseCanonicalName|UseCanonicalPhysicalPort|User|UserDir|VHostCGIMode|VHostCGIPrivs|VHostGroup|VHostPrivs|VHostSecure|VHostUser|VirtualDocumentRoot|VirtualDocumentRootIP|VirtualScriptAlias|VirtualScriptAliasIP|WatchdogInterval|XBitHack|xml2EncAlias|xml2EncDefault|xml2StartParse)\b/gmi,
		alias: 'property'
	},
	'directive-block': {
		pattern: /<\/?\b(AuthnProviderAlias|AuthzProviderAlias|Directory|DirectoryMatch|Else|ElseIf|Files|FilesMatch|If|IfDefine|IfModule|IfVersion|Limit|LimitExcept|Location|LocationMatch|Macro|Proxy|RequireAll|RequireAny|RequireNone|VirtualHost)\b *.*>/gi,
		inside: {
			'directive-block': {
				pattern: /^<\/?\w+/,
				inside: {
					'punctuation': /^<\/?/
				},
				alias: 'tag'
			},
			'directive-block-parameter': {
				pattern: /.*[^>]/,
				inside: {
					'punctuation': /:/,
					'string': {
						pattern: /("|').*\1/g,
						inside: {
							'variable': /(\$|%)\{?(\w\.?(\+|\-|:)?)+\}?/g
						}
					}
				},
				alias: 'attr-value'
			},
			'punctuation': />/
		},
		alias: 'tag'
	},
	'directive-flags': {
		pattern: /\[(\w,?)+\]/g,
		alias: 'keyword'
	},
	'string': {
		pattern: /("|').*\1/g,
		inside: {
			'variable': /(\$|%)\{?(\w\.?(\+|\-|:)?)+\}?/g
		}
	},
	'variable': /(\$|%)\{?(\w\.?(\+|\-|:)?)+\}?/g,
	'regex': /\^?.*\$|\^.*\$?/g
};
;
Prism.languages.git = {
	/*
	 * A simple one line comment like in a git status command
	 * For instance:
	 * $ git status
	 * # On branch infinite-scroll
	 * # Your branch and 'origin/sharedBranches/frontendTeam/infinite-scroll' have diverged,
	 * # and have 1 and 2 different commits each, respectively.
	 * nothing to commit (working directory clean)
	 */
	'comment': /^#.*$/m,

	/*
	 * a string (double and simple quote)
	 */
	'string': /("|')(\\?.)*?\1/gm,

	/*
	 * a git command. It starts with a random prompt finishing by a $, then "git" then some other parameters
	 * For instance:
	 * $ git add file.txt
	 */
	'command': {
		pattern: /^.*\$ git .*$/m,
		inside: {
			/*
			 * A git command can contain a parameter starting by a single or a double dash followed by a string
			 * For instance:
			 * $ git diff --cached
			 * $ git log -p
			 */
			'parameter': /\s(--|-)\w+/m
		}
	},

	/*
	 * Coordinates displayed in a git diff command
	 * For instance:
	 * $ git diff
	 * diff --git file.txt file.txt
	 * index 6214953..1d54a52 100644
	 * --- file.txt
	 * +++ file.txt
	 * @@ -1 +1,2 @@
	 * -Here's my tetx file
	 * +Here's my text file
	 * +And this is the second line
	 */
	'coord': /^@@.*@@$/m,

	/*
	 * Regexp to match the changed lines in a git diff output. Check the example above.
	 */
	'deleted': /^-(?!-).+$/m,
	'inserted': /^\+(?!\+).+$/m,

	/*
	 * Match a "commit [SHA1]" line in a git log output.
	 * For instance:
	 * $ git log
	 * commit a11a14ef7e26f2ca62d4b35eac455ce636d0dc09
	 * Author: lgiraudel
	 * Date:   Mon Feb 17 11:18:34 2014 +0100
	 *
	 *     Add of a new line
	 */
	'commit_sha1': /^commit \w{40}$/m
};
;
(function(){

if(!window.Prism) {
	return;
}

function $$(expr, con) {
	return Array.prototype.slice.call((con || document).querySelectorAll(expr));
}

function hasClass(element, className) {
  className = " " + className + " ";
  return (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1
}

var CRLF = crlf = /\r?\n|\r/g;
    
function highlightLines(pre, lines, classes) {
	var ranges = lines.replace(/\s+/g, '').split(','),
	    offset = +pre.getAttribute('data-line-offset') || 0;
	
	var lineHeight = parseFloat(getComputedStyle(pre).lineHeight);

	for (var i=0, range; range = ranges[i++];) {
		range = range.split('-');
					
		var start = +range[0],
		    end = +range[1] || start;
		
		var line = document.createElement('div');
		
		line.textContent = Array(end - start + 2).join(' \r\n');
		line.className = (classes || '') + ' line-highlight';

    //if the line-numbers plugin is enabled, then there is no reason for this plugin to display the line numbers
    if(!hasClass(pre, 'line-numbers')) {
      line.setAttribute('data-start', start);

      if(end > start) {
        line.setAttribute('data-end', end);
      }
    }

		line.style.top = (start - offset - 1) * lineHeight + 'px';

    //allow this to play nicely with the line-numbers plugin
    if(hasClass(pre, 'line-numbers')) {
      //need to attack to pre as when line-numbers is enabled, the code tag is relatively which screws up the positioning
      pre.appendChild(line);
    } else {
      (pre.querySelector('code') || pre).appendChild(line);
    }
	}
}

function applyHash() {
	var hash = location.hash.slice(1);
	
	// Remove pre-existing temporary lines
	$$('.temporary.line-highlight').forEach(function (line) {
		line.parentNode.removeChild(line);
	});
	
	var range = (hash.match(/\.([\d,-]+)$/) || [,''])[1];
	
	if (!range || document.getElementById(hash)) {
		return;
	}
	
	var id = hash.slice(0, hash.lastIndexOf('.')),
	    pre = document.getElementById(id);
	    
	if (!pre) {
		return;
	}
	
	if (!pre.hasAttribute('data-line')) {
		pre.setAttribute('data-line', '');
	}

	highlightLines(pre, range, 'temporary ');

	document.querySelector('.temporary.line-highlight').scrollIntoView();
}

var fakeTimer = 0; // Hack to limit the number of times applyHash() runs

Prism.hooks.add('after-highlight', function(env) {
	var pre = env.element.parentNode;
	var lines = pre && pre.getAttribute('data-line');
	
	if (!pre || !lines || !/pre/i.test(pre.nodeName)) {
		return;
	}
	
	clearTimeout(fakeTimer);
	
	$$('.line-highlight', pre).forEach(function (line) {
		line.parentNode.removeChild(line);
	});
	
	highlightLines(pre, lines);
	
	fakeTimer = setTimeout(applyHash, 1);
});

addEventListener('hashchange', applyHash);

})();
;
Prism.hooks.add('after-highlight', function (env) {
	// works only for <code> wrapped inside <pre data-line-numbers> (not inline)
	var pre = env.element.parentNode;
	if (!pre || !/pre/i.test(pre.nodeName) || pre.className.indexOf('line-numbers') === -1) {
		return;
	}

	var linesNum = (1 + env.code.split('\n').length);
	var lineNumbersWrapper;

	lines = new Array(linesNum);
	lines = lines.join('<span></span>');

	lineNumbersWrapper = document.createElement('span');
	lineNumbersWrapper.className = 'line-numbers-rows';
	lineNumbersWrapper.innerHTML = lines;

	if (pre.hasAttribute('data-start')) {
		pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
	}

	env.element.appendChild(lineNumbersWrapper);

});;
(function(){

if (!self.Prism || !self.document || !document.querySelector) {
	return;
}

var Extensions = {
	'js': 'javascript',
	'html': 'markup',
	'svg': 'markup',
	'xml': 'markup',
	'py': 'python',
	'rb': 'ruby'
};

Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function(pre) {
	var src = pre.getAttribute('data-src');
	var extension = (src.match(/\.(\w+)$/) || [,''])[1];
	var language = Extensions[extension] || extension;
	
	var code = document.createElement('code');
	code.className = 'language-' + language;
	
	pre.textContent = '';
	
	code.textContent = 'Loading…';
	
	pre.appendChild(code);
	
	var xhr = new XMLHttpRequest();
	
	xhr.open('GET', src, true);

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			
			if (xhr.status < 400 && xhr.responseText) {
				code.textContent = xhr.responseText;
			
				Prism.highlightElement(code);
			}
			else if (xhr.status >= 400) {
				code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
			}
			else {
				code.textContent = '✖ Error: File does not exist or is empty';
			}
		}
	};
	
	xhr.send(null);
});

})();
;
(function(){

if (!self.Prism) {
	return;
}

var Languages = {
	'csharp': 'C#',
	'cpp': 'C++'
};
Prism.hooks.add('before-highlight', function(env) {
	var language = Languages[env.language] || env.language;
	env.element.setAttribute('data-language', language);
});

})();
;
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
