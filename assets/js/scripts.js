/* ========================================================================
 * Bootstrap: transition.js v3.2.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);
;/* ========================================================================
 * Bootstrap: alert.js v3.2.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.2.0'

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
;/* ========================================================================
 * Bootstrap: button.js v3.2.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.2.0'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    $el[val](data[state] == null ? this.options[state] : data[state])

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    Plugin.call($btn, 'toggle')
    e.preventDefault()
  })

}(jQuery);
;/* ========================================================================
 * Bootstrap: carousel.js v3.2.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element).on('keydown.bs.carousel', $.proxy(this.keydown, this))
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.2.0'

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true
  }

  Carousel.prototype.keydown = function (e) {
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);
;/* ========================================================================
 * Bootstrap: collapse.js v3.2.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.2.0'

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      Plugin.call(actives, 'hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var href
    var $this   = $(this)
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    Plugin.call($target, option)
  })

}(jQuery);
;/* ========================================================================
 * Bootstrap: dropdown.js v3.2.0
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.2.0'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.trigger('focus')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $parent = getParent($(this))
      var relatedTarget = { relatedTarget: this }
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);
;/* ========================================================================
 * Bootstrap: modal.js v3.2.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.2.0'

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.$body.addClass('modal-open')

    this.setScrollbar()
    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.$body.removeClass('modal-open')

    this.resetScrollbar()
    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(150) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  Modal.prototype.checkScrollbar = function () {
    if (document.body.clientWidth >= window.innerWidth) return
    this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);
;/* ========================================================================
 * Bootstrap: tooltip.js v3.2.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.2.0'

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(document.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $parent      = this.$element.parent()
        var parentDim    = this.getPosition($parent)

        placement = placement == 'bottom' && pos.top   + pos.height       + actualHeight - parentDim.scroll > parentDim.height ? 'top'    :
                    placement == 'top'    && pos.top   - parentDim.scroll - actualHeight < 0                                   ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth      > parentDim.width                                    ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth      < parentDim.left                                     ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var arrowDelta          = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowPosition       = delta.left ? 'left'        : 'top'
    var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    this.$element.removeAttr('aria-describedby')

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element
    var el     = $element[0]
    var isBody = el.tagName == 'BODY'
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
      scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
      width:  isBody ? $(window).width()  : $element.outerWidth(),
      height: isBody ? $(window).height() : $element.outerHeight()
    }, isBody ? { top: 0, left: 0 } : $element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
;/* ========================================================================
 * Bootstrap: popover.js v3.2.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.2.0'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').empty()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
;/* ========================================================================
 * Bootstrap: scrollspy.js v3.2.0
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.2.0'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);
;/* ========================================================================
 * Bootstrap: tab.js v3.2.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.2.0'

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  })

}(jQuery);
;/* ========================================================================
 * Bootstrap: affix.js v3.2.0
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.2.0'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin != null) this.$element.css('top', '')

    var affixType = 'affix' + (affix ? '-' + affix : '')
    var e         = $.Event(affixType + '.bs.affix')

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

    this.$element
      .removeClass(Affix.RESET)
      .addClass(affixType)
      .trigger($.Event(affixType.replace('affix', 'affixed')))

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - this.$element.height() - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
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
backgroundResize();;/*
    json2.js
    2012-10-08

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());/**
 * History.js jQuery Adapter
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

// Closure
(function(window,undefined){
    "use strict";

    // Localise Globals
    var
        History = window.History = window.History||{},
        jQuery = window.jQuery;

    // Check Existence
    if ( typeof History.Adapter !== 'undefined' ) {
        throw new Error('History.js Adapter has already been loaded...');
    }

    // Add the Adapter
    History.Adapter = {
        /**
         * History.Adapter.bind(el,event,callback)
         * @param {Element|string} el
         * @param {string} event - custom and standard events
         * @param {function} callback
         * @return {void}
         */
        bind: function(el,event,callback){
            jQuery(el).bind(event,callback);
        },

        /**
         * History.Adapter.trigger(el,event)
         * @param {Element|string} el
         * @param {string} event - custom and standard events
         * @param {Object=} extra - a object of extra event data (optional)
         * @return {void}
         */
        trigger: function(el,event,extra){
            jQuery(el).trigger(event,extra);
        },

        /**
         * History.Adapter.extractEventData(key,event,extra)
         * @param {string} key - key for the event data to extract
         * @param {string} event - custom and standard events
         * @param {Object=} extra - a object of extra event data (optional)
         * @return {mixed}
         */
        extractEventData: function(key,event,extra){
            // jQuery Native then jQuery Custom
            var result = (event && event.originalEvent && event.originalEvent[key]) || (extra && extra[key]) || undefined;

            // Return
            return result;
        },

        /**
         * History.Adapter.onDomLoad(callback)
         * @param {function} callback
         * @return {void}
         */
        onDomLoad: function(callback) {
            jQuery(callback);
        }
    };

    // Try and Initialise History
    if ( typeof History.init !== 'undefined' ) {
        History.init();
    }

})(window);

/**
 * History.js HTML4 Support
 * Depends on the HTML5 Support
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){
    "use strict";

    // ========================================================================
    // Initialise

    // Localise Globals
    var
        document = window.document, // Make sure we are using the correct document
        setTimeout = window.setTimeout||setTimeout,
        clearTimeout = window.clearTimeout||clearTimeout,
        setInterval = window.setInterval||setInterval,
        History = window.History = window.History||{}; // Public History Object

    // Check Existence
    if ( typeof History.initHtml4 !== 'undefined' ) {
        throw new Error('History.js HTML4 Support has already been loaded...');
    }


    // ========================================================================
    // Initialise HTML4 Support

    // Initialise HTML4 Support
    History.initHtml4 = function(){
        // Initialise
        if ( typeof History.initHtml4.initialized !== 'undefined' ) {
            // Already Loaded
            return false;
        }
        else {
            History.initHtml4.initialized = true;
        }


        // ====================================================================
        // Properties

        /**
         * History.enabled
         * Is History enabled?
         */
        History.enabled = true;


        // ====================================================================
        // Hash Storage

        /**
         * History.savedHashes
         * Store the hashes in an array
         */
        History.savedHashes = [];

        /**
         * History.isLastHash(newHash)
         * Checks if the hash is the last hash
         * @param {string} newHash
         * @return {boolean} true
         */
        History.isLastHash = function(newHash){
            // Prepare
            var oldHash = History.getHashByIndex(),
                isLast;

            // Check
            isLast = newHash === oldHash;

            // Return isLast
            return isLast;
        };

        /**
         * History.isHashEqual(newHash, oldHash)
         * Checks to see if two hashes are functionally equal
         * @param {string} newHash
         * @param {string} oldHash
         * @return {boolean} true
         */
        History.isHashEqual = function(newHash, oldHash){
            newHash = encodeURIComponent(newHash).replace(/%25/g, "%");
            oldHash = encodeURIComponent(oldHash).replace(/%25/g, "%");
            return newHash === oldHash;
        };

        /**
         * History.saveHash(newHash)
         * Push a Hash
         * @param {string} newHash
         * @return {boolean} true
         */
        History.saveHash = function(newHash){
            // Check Hash
            if ( History.isLastHash(newHash) ) {
                return false;
            }

            // Push the Hash
            History.savedHashes.push(newHash);

            // Return true
            return true;
        };

        /**
         * History.getHashByIndex()
         * Gets a hash by the index
         * @param {integer} index
         * @return {string}
         */
        History.getHashByIndex = function(index){
            // Prepare
            var hash = null;

            // Handle
            if ( typeof index === 'undefined' ) {
                // Get the last inserted
                hash = History.savedHashes[History.savedHashes.length-1];
            }
            else if ( index < 0 ) {
                // Get from the end
                hash = History.savedHashes[History.savedHashes.length+index];
            }
            else {
                // Get from the beginning
                hash = History.savedHashes[index];
            }

            // Return hash
            return hash;
        };


        // ====================================================================
        // Discarded States

        /**
         * History.discardedHashes
         * A hashed array of discarded hashes
         */
        History.discardedHashes = {};

        /**
         * History.discardedStates
         * A hashed array of discarded states
         */
        History.discardedStates = {};

        /**
         * History.discardState(State)
         * Discards the state by ignoring it through History
         * @param {object} State
         * @return {true}
         */
        History.discardState = function(discardedState,forwardState,backState){
            //History.debug('History.discardState', arguments);
            // Prepare
            var discardedStateHash = History.getHashByState(discardedState),
                discardObject;

            // Create Discard Object
            discardObject = {
                'discardedState': discardedState,
                'backState': backState,
                'forwardState': forwardState
            };

            // Add to DiscardedStates
            History.discardedStates[discardedStateHash] = discardObject;

            // Return true
            return true;
        };

        /**
         * History.discardHash(hash)
         * Discards the hash by ignoring it through History
         * @param {string} hash
         * @return {true}
         */
        History.discardHash = function(discardedHash,forwardState,backState){
            //History.debug('History.discardState', arguments);
            // Create Discard Object
            var discardObject = {
                'discardedHash': discardedHash,
                'backState': backState,
                'forwardState': forwardState
            };

            // Add to discardedHash
            History.discardedHashes[discardedHash] = discardObject;

            // Return true
            return true;
        };

        /**
         * History.discardedState(State)
         * Checks to see if the state is discarded
         * @param {object} State
         * @return {bool}
         */
        History.discardedState = function(State){
            // Prepare
            var StateHash = History.getHashByState(State),
                discarded;

            // Check
            discarded = History.discardedStates[StateHash]||false;

            // Return true
            return discarded;
        };

        /**
         * History.discardedHash(hash)
         * Checks to see if the state is discarded
         * @param {string} State
         * @return {bool}
         */
        History.discardedHash = function(hash){
            // Check
            var discarded = History.discardedHashes[hash]||false;

            // Return true
            return discarded;
        };

        /**
         * History.recycleState(State)
         * Allows a discarded state to be used again
         * @param {object} data
         * @param {string} title
         * @param {string} url
         * @return {true}
         */
        History.recycleState = function(State){
            //History.debug('History.recycleState', arguments);
            // Prepare
            var StateHash = History.getHashByState(State);

            // Remove from DiscardedStates
            if ( History.discardedState(State) ) {
                delete History.discardedStates[StateHash];
            }

            // Return true
            return true;
        };


        // ====================================================================
        // HTML4 HashChange Support

        if ( History.emulated.hashChange ) {
            /*
             * We must emulate the HTML4 HashChange Support by manually checking for hash changes
             */

            /**
             * History.hashChangeInit()
             * Init the HashChange Emulation
             */
            History.hashChangeInit = function(){
                // Define our Checker Function
                History.checkerFunction = null;

                // Define some variables that will help in our checker function
                var lastDocumentHash = '',
                    iframeId, iframe,
                    lastIframeHash, checkerRunning,
                    startedWithHash = Boolean(History.getHash());

                // Handle depending on the browser
                if ( History.isInternetExplorer() ) {
                    // IE6 and IE7
                    // We need to use an iframe to emulate the back and forward buttons

                    // Create iFrame
                    iframeId = 'historyjs-iframe';
                    iframe = document.createElement('iframe');

                    // Adjust iFarme
                    // IE 6 requires iframe to have a src on HTTPS pages, otherwise it will throw a
                    // "This page contains both secure and nonsecure items" warning.
                    iframe.setAttribute('id', iframeId);
                    iframe.setAttribute('src', '#');
                    iframe.style.display = 'none';

                    // Append iFrame
                    document.body.appendChild(iframe);

                    // Create initial history entry
                    iframe.contentWindow.document.open();
                    iframe.contentWindow.document.close();

                    // Define some variables that will help in our checker function
                    lastIframeHash = '';
                    checkerRunning = false;

                    // Define the checker function
                    History.checkerFunction = function(){
                        // Check Running
                        if ( checkerRunning ) {
                            return false;
                        }

                        // Update Running
                        checkerRunning = true;

                        // Fetch
                        var
                            documentHash = History.getHash(),
                            iframeHash = History.getHash(iframe.contentWindow.document);

                        // The Document Hash has changed (application caused)
                        if ( documentHash !== lastDocumentHash ) {
                            // Equalise
                            lastDocumentHash = documentHash;

                            // Create a history entry in the iframe
                            if ( iframeHash !== documentHash ) {
                                //History.debug('hashchange.checker: iframe hash change', 'documentHash (new):', documentHash, 'iframeHash (old):', iframeHash);

                                // Equalise
                                lastIframeHash = iframeHash = documentHash;

                                // Create History Entry
                                iframe.contentWindow.document.open();
                                iframe.contentWindow.document.close();

                                // Update the iframe's hash
                                iframe.contentWindow.document.location.hash = History.escapeHash(documentHash);
                            }

                            // Trigger Hashchange Event
                            History.Adapter.trigger(window,'hashchange');
                        }

                        // The iFrame Hash has changed (back button caused)
                        else if ( iframeHash !== lastIframeHash ) {
                            //History.debug('hashchange.checker: iframe hash out of sync', 'iframeHash (new):', iframeHash, 'documentHash (old):', documentHash);

                            // Equalise
                            lastIframeHash = iframeHash;
                            
                            // If there is no iframe hash that means we're at the original
                            // iframe state.
                            // And if there was a hash on the original request, the original
                            // iframe state was replaced instantly, so skip this state and take
                            // the user back to where they came from.
                            if (startedWithHash && iframeHash === '') {
                                History.back();
                            }
                            else {
                                // Update the Hash
                                History.setHash(iframeHash,false);
                            }
                        }

                        // Reset Running
                        checkerRunning = false;

                        // Return true
                        return true;
                    };
                }
                else {
                    // We are not IE
                    // Firefox 1 or 2, Opera

                    // Define the checker function
                    History.checkerFunction = function(){
                        // Prepare
                        var documentHash = History.getHash()||'';

                        // The Document Hash has changed (application caused)
                        if ( documentHash !== lastDocumentHash ) {
                            // Equalise
                            lastDocumentHash = documentHash;

                            // Trigger Hashchange Event
                            History.Adapter.trigger(window,'hashchange');
                        }

                        // Return true
                        return true;
                    };
                }

                // Apply the checker function
                History.intervalList.push(setInterval(History.checkerFunction, History.options.hashChangeInterval));

                // Done
                return true;
            }; // History.hashChangeInit

            // Bind hashChangeInit
            History.Adapter.onDomLoad(History.hashChangeInit);

        } // History.emulated.hashChange


        // ====================================================================
        // HTML5 State Support

        // Non-Native pushState Implementation
        if ( History.emulated.pushState ) {
            /*
             * We must emulate the HTML5 State Management by using HTML4 HashChange
             */

            /**
             * History.onHashChange(event)
             * Trigger HTML5's window.onpopstate via HTML4 HashChange Support
             */
            History.onHashChange = function(event){
                //History.debug('History.onHashChange', arguments);

                // Prepare
                var currentUrl = ((event && event.newURL) || History.getLocationHref()),
                    currentHash = History.getHashByUrl(currentUrl),
                    currentState = null,
                    currentStateHash = null,
                    currentStateHashExits = null,
                    discardObject;

                // Check if we are the same state
                if ( History.isLastHash(currentHash) ) {
                    // There has been no change (just the page's hash has finally propagated)
                    //History.debug('History.onHashChange: no change');
                    History.busy(false);
                    return false;
                }

                // Reset the double check
                History.doubleCheckComplete();

                // Store our location for use in detecting back/forward direction
                History.saveHash(currentHash);

                // Expand Hash
                if ( currentHash && History.isTraditionalAnchor(currentHash) ) {
                    //History.debug('History.onHashChange: traditional anchor', currentHash);
                    // Traditional Anchor Hash
                    History.Adapter.trigger(window,'anchorchange');
                    History.busy(false);
                    return false;
                }

                // Create State
                currentState = History.extractState(History.getFullUrl(currentHash||History.getLocationHref()),true);

                // Check if we are the same state
                if ( History.isLastSavedState(currentState) ) {
                    //History.debug('History.onHashChange: no change');
                    // There has been no change (just the page's hash has finally propagated)
                    History.busy(false);
                    return false;
                }

                // Create the state Hash
                currentStateHash = History.getHashByState(currentState);

                // Check if we are DiscardedState
                discardObject = History.discardedState(currentState);
                if ( discardObject ) {
                    // Ignore this state as it has been discarded and go back to the state before it
                    if ( History.getHashByIndex(-2) === History.getHashByState(discardObject.forwardState) ) {
                        // We are going backwards
                        //History.debug('History.onHashChange: go backwards');
                        History.back(false);
                    } else {
                        // We are going forwards
                        //History.debug('History.onHashChange: go forwards');
                        History.forward(false);
                    }
                    return false;
                }

                // Push the new HTML5 State
                //History.debug('History.onHashChange: success hashchange');
                History.pushState(currentState.data,currentState.title,encodeURI(currentState.url),false);

                // End onHashChange closure
                return true;
            };
            History.Adapter.bind(window,'hashchange',History.onHashChange);

            /**
             * History.pushState(data,title,url)
             * Add a new State to the history object, become it, and trigger onpopstate
             * We have to trigger for HTML4 compatibility
             * @param {object} data
             * @param {string} title
             * @param {string} url
             * @return {true}
             */
            History.pushState = function(data,title,url,queue){
                //History.debug('History.pushState: called', arguments);

                // We assume that the URL passed in is URI-encoded, but this makes
                // sure that it's fully URI encoded; any '%'s that are encoded are
                // converted back into '%'s
                url = encodeURI(url).replace(/%25/g, "%");

                // Check the State
                if ( History.getHashByUrl(url) ) {
                    throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
                }

                // Handle Queueing
                if ( queue !== false && History.busy() ) {
                    // Wait + Push to Queue
                    //History.debug('History.pushState: we must wait', arguments);
                    History.pushQueue({
                        scope: History,
                        callback: History.pushState,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }

                // Make Busy
                History.busy(true);

                // Fetch the State Object
                var newState = History.createStateObject(data,title,url),
                    newStateHash = History.getHashByState(newState),
                    oldState = History.getState(false),
                    oldStateHash = History.getHashByState(oldState),
                    html4Hash = History.getHash(),
                    wasExpected = History.expectedStateId == newState.id;

                // Store the newState
                History.storeState(newState);
                History.expectedStateId = newState.id;

                // Recycle the State
                History.recycleState(newState);

                // Force update of the title
                History.setTitle(newState);

                // Check if we are the same State
                if ( newStateHash === oldStateHash ) {
                    //History.debug('History.pushState: no change', newStateHash);
                    History.busy(false);
                    return false;
                }

                // Update HTML5 State
                History.saveState(newState);

                // Fire HTML5 Event
                if(!wasExpected)
                    History.Adapter.trigger(window,'statechange');

                // Update HTML4 Hash
                if ( !History.isHashEqual(newStateHash, html4Hash) && !History.isHashEqual(newStateHash, History.getShortUrl(History.getLocationHref())) ) {
                    History.setHash(newStateHash,false);
                }
                
                History.busy(false);

                // End pushState closure
                return true;
            };

            /**
             * History.replaceState(data,title,url)
             * Replace the State and trigger onpopstate
             * We have to trigger for HTML4 compatibility
             * @param {object} data
             * @param {string} title
             * @param {string} url
             * @return {true}
             */
            History.replaceState = function(data,title,url,queue){
                //History.debug('History.replaceState: called', arguments);

                // We assume that the URL passed in is URI-encoded, but this makes
                // sure that it's fully URI encoded; any '%'s that are encoded are
                // converted back into '%'s
                url = encodeURI(url).replace(/%25/g, "%");

                // Check the State
                if ( History.getHashByUrl(url) ) {
                    throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
                }

                // Handle Queueing
                if ( queue !== false && History.busy() ) {
                    // Wait + Push to Queue
                    //History.debug('History.replaceState: we must wait', arguments);
                    History.pushQueue({
                        scope: History,
                        callback: History.replaceState,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }

                // Make Busy
                History.busy(true);

                // Fetch the State Objects
                var newState        = History.createStateObject(data,title,url),
                    newStateHash = History.getHashByState(newState),
                    oldState        = History.getState(false),
                    oldStateHash = History.getHashByState(oldState),
                    previousState   = History.getStateByIndex(-2);

                // Discard Old State
                History.discardState(oldState,newState,previousState);

                // If the url hasn't changed, just store and save the state
                // and fire a statechange event to be consistent with the
                // html 5 api
                if ( newStateHash === oldStateHash ) {
                    // Store the newState
                    History.storeState(newState);
                    History.expectedStateId = newState.id;
    
                    // Recycle the State
                    History.recycleState(newState);
    
                    // Force update of the title
                    History.setTitle(newState);
                    
                    // Update HTML5 State
                    History.saveState(newState);

                    // Fire HTML5 Event
                    //History.debug('History.pushState: trigger popstate');
                    History.Adapter.trigger(window,'statechange');
                    History.busy(false);
                }
                else {
                    // Alias to PushState
                    History.pushState(newState.data,newState.title,newState.url,false);
                }

                // End replaceState closure
                return true;
            };

        } // History.emulated.pushState



        // ====================================================================
        // Initialise

        // Non-Native pushState Implementation
        if ( History.emulated.pushState ) {
            /**
             * Ensure initial state is handled correctly
             */
            if ( History.getHash() && !History.emulated.hashChange ) {
                History.Adapter.onDomLoad(function(){
                    History.Adapter.trigger(window,'hashchange');
                });
            }

        } // History.emulated.pushState

    }; // History.initHtml4

    // Try to Initialise History
    if ( typeof History.init !== 'undefined' ) {
        History.init();
    }

})(window);
/**
 * History.js Core
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){
    "use strict";

    // ========================================================================
    // Initialise

    // Localise Globals
    var
        console = window.console||undefined, // Prevent a JSLint complain
        document = window.document, // Make sure we are using the correct document
        navigator = window.navigator, // Make sure we are using the correct navigator
        sessionStorage = false, // sessionStorage
        setTimeout = window.setTimeout,
        clearTimeout = window.clearTimeout,
        setInterval = window.setInterval,
        clearInterval = window.clearInterval,
        JSON = window.JSON,
        alert = window.alert,
        History = window.History = window.History||{}, // Public History Object
        history = window.history; // Old History Object

    try {
        sessionStorage = window.sessionStorage; // This will throw an exception in some browsers when cookies/localStorage are explicitly disabled (i.e. Chrome)
        sessionStorage.setItem('TEST', '1');
        sessionStorage.removeItem('TEST');
    } catch(e) {
        sessionStorage = false;
    }

    // MooTools Compatibility
    JSON.stringify = JSON.stringify||JSON.encode;
    JSON.parse = JSON.parse||JSON.decode;

    // Check Existence
    if ( typeof History.init !== 'undefined' ) {
        throw new Error('History.js Core has already been loaded...');
    }

    // Initialise History
    History.init = function(options){
        // Check Load Status of Adapter
        if ( typeof History.Adapter === 'undefined' ) {
            return false;
        }

        // Check Load Status of Core
        if ( typeof History.initCore !== 'undefined' ) {
            History.initCore();
        }

        // Check Load Status of HTML4 Support
        if ( typeof History.initHtml4 !== 'undefined' ) {
            History.initHtml4();
        }

        // Return true
        return true;
    };


    // ========================================================================
    // Initialise Core

    // Initialise Core
    History.initCore = function(options){
        // Initialise
        if ( typeof History.initCore.initialized !== 'undefined' ) {
            // Already Loaded
            return false;
        }
        else {
            History.initCore.initialized = true;
        }


        // ====================================================================
        // Options

        /**
         * History.options
         * Configurable options
         */
        History.options = History.options||{};

        /**
         * History.options.hashChangeInterval
         * How long should the interval be before hashchange checks
         */
        History.options.hashChangeInterval = History.options.hashChangeInterval || 100;

        /**
         * History.options.safariPollInterval
         * How long should the interval be before safari poll checks
         */
        History.options.safariPollInterval = History.options.safariPollInterval || 500;

        /**
         * History.options.doubleCheckInterval
         * How long should the interval be before we perform a double check
         */
        History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;

        /**
         * History.options.disableSuid
         * Force History not to append suid
         */
        History.options.disableSuid = History.options.disableSuid || false;

        /**
         * History.options.storeInterval
         * How long should we wait between store calls
         */
        History.options.storeInterval = History.options.storeInterval || 1000;

        /**
         * History.options.busyDelay
         * How long should we wait between busy events
         */
        History.options.busyDelay = History.options.busyDelay || 250;

        /**
         * History.options.debug
         * If true will enable debug messages to be logged
         */
        History.options.debug = History.options.debug || false;

        /**
         * History.options.initialTitle
         * What is the title of the initial state
         */
        History.options.initialTitle = History.options.initialTitle || document.title;

        /**
         * History.options.html4Mode
         * If true, will force HTMl4 mode (hashtags)
         */
        History.options.html4Mode = History.options.html4Mode || false;

        /**
         * History.options.delayInit
         * Want to override default options and call init manually.
         */
        History.options.delayInit = History.options.delayInit || false;


        // ====================================================================
        // Interval record

        /**
         * History.intervalList
         * List of intervals set, to be cleared when document is unloaded.
         */
        History.intervalList = [];

        /**
         * History.clearAllIntervals
         * Clears all setInterval instances.
         */
        History.clearAllIntervals = function(){
            var i, il = History.intervalList;
            if (typeof il !== "undefined" && il !== null) {
                for (i = 0; i < il.length; i++) {
                    clearInterval(il[i]);
                }
                History.intervalList = null;
            }
        };


        // ====================================================================
        // Debug

        /**
         * History.debug(message,...)
         * Logs the passed arguments if debug enabled
         */
        History.debug = function(){
            if ( (History.options.debug||false) ) {
                History.log.apply(History,arguments);
            }
        };

        /**
         * History.log(message,...)
         * Logs the passed arguments
         */
        History.log = function(){
            // Prepare
            var
                consoleExists = !(typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.apply === 'undefined'),
                textarea = document.getElementById('log'),
                message,
                i,n,
                args,arg
                ;

            // Write to Console
            if ( consoleExists ) {
                args = Array.prototype.slice.call(arguments);
                message = args.shift();
                if ( typeof console.debug !== 'undefined' ) {
                    console.debug.apply(console,[message,args]);
                }
                else {
                    console.log.apply(console,[message,args]);
                }
            }
            else {
                message = ("\n"+arguments[0]+"\n");
            }

            // Write to log
            for ( i=1,n=arguments.length; i<n; ++i ) {
                arg = arguments[i];
                if ( typeof arg === 'object' && typeof JSON !== 'undefined' ) {
                    try {
                        arg = JSON.stringify(arg);
                    }
                    catch ( Exception ) {
                        // Recursive Object
                    }
                }
                message += "\n"+arg+"\n";
            }

            // Textarea
            if ( textarea ) {
                textarea.value += message+"\n-----\n";
                textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
            }
            // No Textarea, No Console
            else if ( !consoleExists ) {
                alert(message);
            }

            // Return true
            return true;
        };


        // ====================================================================
        // Emulated Status

        /**
         * History.getInternetExplorerMajorVersion()
         * Get's the major version of Internet Explorer
         * @return {integer}
         * @license Public Domain
         * @author Benjamin Arthur Lupton <contact@balupton.com>
         * @author James Padolsey <https://gist.github.com/527683>
         */
        History.getInternetExplorerMajorVersion = function(){
            var result = History.getInternetExplorerMajorVersion.cached =
                    (typeof History.getInternetExplorerMajorVersion.cached !== 'undefined')
                ?   History.getInternetExplorerMajorVersion.cached
                :   (function(){
                        var v = 3,
                                div = document.createElement('div'),
                                all = div.getElementsByTagName('i');
                        while ( (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0] ) {}
                        return (v > 4) ? v : false;
                    })()
                ;
            return result;
        };

        /**
         * History.isInternetExplorer()
         * Are we using Internet Explorer?
         * @return {boolean}
         * @license Public Domain
         * @author Benjamin Arthur Lupton <contact@balupton.com>
         */
        History.isInternetExplorer = function(){
            var result =
                History.isInternetExplorer.cached =
                (typeof History.isInternetExplorer.cached !== 'undefined')
                    ?   History.isInternetExplorer.cached
                    :   Boolean(History.getInternetExplorerMajorVersion())
                ;
            return result;
        };

        /**
         * History.emulated
         * Which features require emulating?
         */

        if (History.options.html4Mode) {
            History.emulated = {
                pushState : true,
                hashChange: true
            };
        }

        else {

            History.emulated = {
                pushState: !Boolean(
                    window.history && window.history.pushState && window.history.replaceState
                    && !(
                        (/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
                        || (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent) /* disable for the mercury iOS browser, or at least older versions of the webkit engine */
                    )
                ),
                hashChange: Boolean(
                    !(('onhashchange' in window) || ('onhashchange' in document))
                    ||
                    (History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
                )
            };
        }

        /**
         * History.enabled
         * Is History enabled?
         */
        History.enabled = !History.emulated.pushState;

        /**
         * History.bugs
         * Which bugs are present
         */
        History.bugs = {
            /**
             * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call
             * https://bugs.webkit.org/show_bug.cgi?id=56249
             */
            setHash: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

            /**
             * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
             * https://bugs.webkit.org/show_bug.cgi?id=42940
             */
            safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

            /**
             * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
             */
            ieDoubleCheck: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8),

            /**
             * MSIE 6 requires the entire hash to be encoded for the hashes to trigger the onHashChange event
             */
            hashEscape: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7)
        };

        /**
         * History.isEmptyObject(obj)
         * Checks to see if the Object is Empty
         * @param {Object} obj
         * @return {boolean}
         */
        History.isEmptyObject = function(obj) {
            for ( var name in obj ) {
                if ( obj.hasOwnProperty(name) ) {
                    return false;
                }
            }
            return true;
        };

        /**
         * History.cloneObject(obj)
         * Clones a object and eliminate all references to the original contexts
         * @param {Object} obj
         * @return {Object}
         */
        History.cloneObject = function(obj) {
            var hash,newObj;
            if ( obj ) {
                hash = JSON.stringify(obj);
                newObj = JSON.parse(hash);
            }
            else {
                newObj = {};
            }
            return newObj;
        };


        // ====================================================================
        // URL Helpers

        /**
         * History.getRootUrl()
         * Turns "http://mysite.com/dir/page.html?asd" into "http://mysite.com"
         * @return {String} rootUrl
         */
        History.getRootUrl = function(){
            // Create
            var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
            if ( document.location.port||false ) {
                rootUrl += ':'+document.location.port;
            }
            rootUrl += '/';

            // Return
            return rootUrl;
        };

        /**
         * History.getBaseHref()
         * Fetches the `href` attribute of the `<base href="...">` element if it exists
         * @return {String} baseHref
         */
        History.getBaseHref = function(){
            // Create
            var
                baseElements = document.getElementsByTagName('base'),
                baseElement = null,
                baseHref = '';

            // Test for Base Element
            if ( baseElements.length === 1 ) {
                // Prepare for Base Element
                baseElement = baseElements[0];
                baseHref = baseElement.href.replace(/[^\/]+$/,'');
            }

            // Adjust trailing slash
            baseHref = baseHref.replace(/\/+$/,'');
            if ( baseHref ) baseHref += '/';

            // Return
            return baseHref;
        };

        /**
         * History.getBaseUrl()
         * Fetches the baseHref or basePageUrl or rootUrl (whichever one exists first)
         * @return {String} baseUrl
         */
        History.getBaseUrl = function(){
            // Create
            var baseUrl = History.getBaseHref()||History.getBasePageUrl()||History.getRootUrl();

            // Return
            return baseUrl;
        };

        /**
         * History.getPageUrl()
         * Fetches the URL of the current page
         * @return {String} pageUrl
         */
        History.getPageUrl = function(){
            // Fetch
            var
                State = History.getState(false,false),
                stateUrl = (State||{}).url||History.getLocationHref(),
                pageUrl;

            // Create
            pageUrl = stateUrl.replace(/\/+$/,'').replace(/[^\/]+$/,function(part,index,string){
                return (/\./).test(part) ? part : part+'/';
            });

            // Return
            return pageUrl;
        };

        /**
         * History.getBasePageUrl()
         * Fetches the Url of the directory of the current page
         * @return {String} basePageUrl
         */
        History.getBasePageUrl = function(){
            // Create
            var basePageUrl = (History.getLocationHref()).replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
                return (/[^\/]$/).test(part) ? '' : part;
            }).replace(/\/+$/,'')+'/';

            // Return
            return basePageUrl;
        };

        /**
         * History.getFullUrl(url)
         * Ensures that we have an absolute URL and not a relative URL
         * @param {string} url
         * @param {Boolean} allowBaseHref
         * @return {string} fullUrl
         */
        History.getFullUrl = function(url,allowBaseHref){
            // Prepare
            var fullUrl = url, firstChar = url.substring(0,1);
            allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;

            // Check
            if ( /[a-z]+\:\/\//.test(url) ) {
                // Full URL
            }
            else if ( firstChar === '/' ) {
                // Root URL
                fullUrl = History.getRootUrl()+url.replace(/^\/+/,'');
            }
            else if ( firstChar === '#' ) {
                // Anchor URL
                fullUrl = History.getPageUrl().replace(/#.*/,'')+url;
            }
            else if ( firstChar === '?' ) {
                // Query URL
                fullUrl = History.getPageUrl().replace(/[\?#].*/,'')+url;
            }
            else {
                // Relative URL
                if ( allowBaseHref ) {
                    fullUrl = History.getBaseUrl()+url.replace(/^(\.\/)+/,'');
                } else {
                    fullUrl = History.getBasePageUrl()+url.replace(/^(\.\/)+/,'');
                }
                // We have an if condition above as we do not want hashes
                // which are relative to the baseHref in our URLs
                // as if the baseHref changes, then all our bookmarks
                // would now point to different locations
                // whereas the basePageUrl will always stay the same
            }

            // Return
            return fullUrl.replace(/\#$/,'');
        };

        /**
         * History.getShortUrl(url)
         * Ensures that we have a relative URL and not a absolute URL
         * @param {string} url
         * @return {string} url
         */
        History.getShortUrl = function(url){
            // Prepare
            var shortUrl = url, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();

            // Trim baseUrl
            if ( History.emulated.pushState ) {
                // We are in a if statement as when pushState is not emulated
                // The actual url these short urls are relative to can change
                // So within the same session, we the url may end up somewhere different
                shortUrl = shortUrl.replace(baseUrl,'');
            }

            // Trim rootUrl
            shortUrl = shortUrl.replace(rootUrl,'/');

            // Ensure we can still detect it as a state
            if ( History.isTraditionalAnchor(shortUrl) ) {
                shortUrl = './'+shortUrl;
            }

            // Clean It
            shortUrl = shortUrl.replace(/^(\.\/)+/g,'./').replace(/\#$/,'');

            // Return
            return shortUrl;
        };

        /**
         * History.getLocationHref(document)
         * Returns a normalized version of document.location.href
         * accounting for browser inconsistencies, etc.
         *
         * This URL will be URI-encoded and will include the hash
         *
         * @param {object} document
         * @return {string} url
         */
        History.getLocationHref = function(doc) {
            doc = doc || document;

            // most of the time, this will be true
            if (doc.URL === doc.location.href)
                return doc.location.href;

            // some versions of webkit URI-decode document.location.href
            // but they leave document.URL in an encoded state
            if (doc.location.href === decodeURIComponent(doc.URL))
                return doc.URL;

            // FF 3.6 only updates document.URL when a page is reloaded
            // document.location.href is updated correctly
            if (doc.location.hash && decodeURIComponent(doc.location.href.replace(/^[^#]+/, "")) === doc.location.hash)
                return doc.location.href;

            if (doc.URL.indexOf('#') == -1 && doc.location.href.indexOf('#') != -1)
                return doc.location.href;
            
            return doc.URL || doc.location.href;
        };


        // ====================================================================
        // State Storage

        /**
         * History.store
         * The store for all session specific data
         */
        History.store = {};

        /**
         * History.idToState
         * 1-1: State ID to State Object
         */
        History.idToState = History.idToState||{};

        /**
         * History.stateToId
         * 1-1: State String to State ID
         */
        History.stateToId = History.stateToId||{};

        /**
         * History.urlToId
         * 1-1: State URL to State ID
         */
        History.urlToId = History.urlToId||{};

        /**
         * History.storedStates
         * Store the states in an array
         */
        History.storedStates = History.storedStates||[];

        /**
         * History.savedStates
         * Saved the states in an array
         */
        History.savedStates = History.savedStates||[];

        /**
         * History.noramlizeStore()
         * Noramlize the store by adding necessary values
         */
        History.normalizeStore = function(){
            History.store.idToState = History.store.idToState||{};
            History.store.urlToId = History.store.urlToId||{};
            History.store.stateToId = History.store.stateToId||{};
        };

        /**
         * History.getState()
         * Get an object containing the data, title and url of the current state
         * @param {Boolean} friendly
         * @param {Boolean} create
         * @return {Object} State
         */
        History.getState = function(friendly,create){
            // Prepare
            if ( typeof friendly === 'undefined' ) { friendly = true; }
            if ( typeof create === 'undefined' ) { create = true; }

            // Fetch
            var State = History.getLastSavedState();

            // Create
            if ( !State && create ) {
                State = History.createStateObject();
            }

            // Adjust
            if ( friendly ) {
                State = History.cloneObject(State);
                State.url = State.cleanUrl||State.url;
            }

            // Return
            return State;
        };

        /**
         * History.getIdByState(State)
         * Gets a ID for a State
         * @param {State} newState
         * @return {String} id
         */
        History.getIdByState = function(newState){

            // Fetch ID
            var id = History.extractId(newState.url),
                str;

            if ( !id ) {
                // Find ID via State String
                str = History.getStateString(newState);
                if ( typeof History.stateToId[str] !== 'undefined' ) {
                    id = History.stateToId[str];
                }
                else if ( typeof History.store.stateToId[str] !== 'undefined' ) {
                    id = History.store.stateToId[str];
                }
                else {
                    // Generate a new ID
                    while ( true ) {
                        id = (new Date()).getTime() + String(Math.random()).replace(/\D/g,'');
                        if ( typeof History.idToState[id] === 'undefined' && typeof History.store.idToState[id] === 'undefined' ) {
                            break;
                        }
                    }

                    // Apply the new State to the ID
                    History.stateToId[str] = id;
                    History.idToState[id] = newState;
                }
            }

            // Return ID
            return id;
        };

        /**
         * History.normalizeState(State)
         * Expands a State Object
         * @param {object} State
         * @return {object}
         */
        History.normalizeState = function(oldState){
            // Variables
            var newState, dataNotEmpty;

            // Prepare
            if ( !oldState || (typeof oldState !== 'object') ) {
                oldState = {};
            }

            // Check
            if ( typeof oldState.normalized !== 'undefined' ) {
                return oldState;
            }

            // Adjust
            if ( !oldState.data || (typeof oldState.data !== 'object') ) {
                oldState.data = {};
            }

            // ----------------------------------------------------------------

            // Create
            newState = {};
            newState.normalized = true;
            newState.title = oldState.title||'';
            newState.url = History.getFullUrl(oldState.url?oldState.url:(History.getLocationHref()));
            newState.hash = History.getShortUrl(newState.url);
            newState.data = History.cloneObject(oldState.data);

            // Fetch ID
            newState.id = History.getIdByState(newState);

            // ----------------------------------------------------------------

            // Clean the URL
            newState.cleanUrl = newState.url.replace(/\??\&_suid.*/,'');
            newState.url = newState.cleanUrl;

            // Check to see if we have more than just a url
            dataNotEmpty = !History.isEmptyObject(newState.data);

            // Apply
            if ( (newState.title || dataNotEmpty) && History.options.disableSuid !== true ) {
                // Add ID to Hash
                newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/,'');
                if ( !/\?/.test(newState.hash) ) {
                    newState.hash += '?';
                }
                newState.hash += '&_suid='+newState.id;
            }

            // Create the Hashed URL
            newState.hashedUrl = History.getFullUrl(newState.hash);

            // ----------------------------------------------------------------

            // Update the URL if we have a duplicate
            if ( (History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState) ) {
                newState.url = newState.hashedUrl;
            }

            // ----------------------------------------------------------------

            // Return
            return newState;
        };

        /**
         * History.createStateObject(data,title,url)
         * Creates a object based on the data, title and url state params
         * @param {object} data
         * @param {string} title
         * @param {string} url
         * @return {object}
         */
        History.createStateObject = function(data,title,url){
            // Hashify
            var State = {
                'data': data,
                'title': title,
                'url': url
            };

            // Expand the State
            State = History.normalizeState(State);

            // Return object
            return State;
        };

        /**
         * History.getStateById(id)
         * Get a state by it's UID
         * @param {String} id
         */
        History.getStateById = function(id){
            // Prepare
            id = String(id);

            // Retrieve
            var State = History.idToState[id] || History.store.idToState[id] || undefined;

            // Return State
            return State;
        };

        /**
         * Get a State's String
         * @param {State} passedState
         */
        History.getStateString = function(passedState){
            // Prepare
            var State, cleanedState, str;

            // Fetch
            State = History.normalizeState(passedState);

            // Clean
            cleanedState = {
                data: State.data,
                title: passedState.title,
                url: passedState.url
            };

            // Fetch
            str = JSON.stringify(cleanedState);

            // Return
            return str;
        };

        /**
         * Get a State's ID
         * @param {State} passedState
         * @return {String} id
         */
        History.getStateId = function(passedState){
            // Prepare
            var State, id;

            // Fetch
            State = History.normalizeState(passedState);

            // Fetch
            id = State.id;

            // Return
            return id;
        };

        /**
         * History.getHashByState(State)
         * Creates a Hash for the State Object
         * @param {State} passedState
         * @return {String} hash
         */
        History.getHashByState = function(passedState){
            // Prepare
            var State, hash;

            // Fetch
            State = History.normalizeState(passedState);

            // Hash
            hash = State.hash;

            // Return
            return hash;
        };

        /**
         * History.extractId(url_or_hash)
         * Get a State ID by it's URL or Hash
         * @param {string} url_or_hash
         * @return {string} id
         */
        History.extractId = function ( url_or_hash ) {
            // Prepare
            var id,parts,url, tmp;

            // Extract
            
            // If the URL has a #, use the id from before the #
            if (url_or_hash.indexOf('#') != -1)
            {
                tmp = url_or_hash.split("#")[0];
            }
            else
            {
                tmp = url_or_hash;
            }
            
            parts = /(.*)\&_suid=([0-9]+)$/.exec(tmp);
            url = parts ? (parts[1]||url_or_hash) : url_or_hash;
            id = parts ? String(parts[2]||'') : '';

            // Return
            return id||false;
        };

        /**
         * History.isTraditionalAnchor
         * Checks to see if the url is a traditional anchor or not
         * @param {String} url_or_hash
         * @return {Boolean}
         */
        History.isTraditionalAnchor = function(url_or_hash){
            // Check
            var isTraditional = !(/[\/\?\.]/.test(url_or_hash));

            // Return
            return isTraditional;
        };

        /**
         * History.extractState
         * Get a State by it's URL or Hash
         * @param {String} url_or_hash
         * @return {State|null}
         */
        History.extractState = function(url_or_hash,create){
            // Prepare
            var State = null, id, url;
            create = create||false;

            // Fetch SUID
            id = History.extractId(url_or_hash);
            if ( id ) {
                State = History.getStateById(id);
            }

            // Fetch SUID returned no State
            if ( !State ) {
                // Fetch URL
                url = History.getFullUrl(url_or_hash);

                // Check URL
                id = History.getIdByUrl(url)||false;
                if ( id ) {
                    State = History.getStateById(id);
                }

                // Create State
                if ( !State && create && !History.isTraditionalAnchor(url_or_hash) ) {
                    State = History.createStateObject(null,null,url);
                }
            }

            // Return
            return State;
        };

        /**
         * History.getIdByUrl()
         * Get a State ID by a State URL
         */
        History.getIdByUrl = function(url){
            // Fetch
            var id = History.urlToId[url] || History.store.urlToId[url] || undefined;

            // Return
            return id;
        };

        /**
         * History.getLastSavedState()
         * Get an object containing the data, title and url of the current state
         * @return {Object} State
         */
        History.getLastSavedState = function(){
            return History.savedStates[History.savedStates.length-1]||undefined;
        };

        /**
         * History.getLastStoredState()
         * Get an object containing the data, title and url of the current state
         * @return {Object} State
         */
        History.getLastStoredState = function(){
            return History.storedStates[History.storedStates.length-1]||undefined;
        };

        /**
         * History.hasUrlDuplicate
         * Checks if a Url will have a url conflict
         * @param {Object} newState
         * @return {Boolean} hasDuplicate
         */
        History.hasUrlDuplicate = function(newState) {
            // Prepare
            var hasDuplicate = false,
                oldState;

            // Fetch
            oldState = History.extractState(newState.url);

            // Check
            hasDuplicate = oldState && oldState.id !== newState.id;

            // Return
            return hasDuplicate;
        };

        /**
         * History.storeState
         * Store a State
         * @param {Object} newState
         * @return {Object} newState
         */
        History.storeState = function(newState){
            // Store the State
            History.urlToId[newState.url] = newState.id;

            // Push the State
            History.storedStates.push(History.cloneObject(newState));

            // Return newState
            return newState;
        };

        /**
         * History.isLastSavedState(newState)
         * Tests to see if the state is the last state
         * @param {Object} newState
         * @return {boolean} isLast
         */
        History.isLastSavedState = function(newState){
            // Prepare
            var isLast = false,
                newId, oldState, oldId;

            // Check
            if ( History.savedStates.length ) {
                newId = newState.id;
                oldState = History.getLastSavedState();
                oldId = oldState.id;

                // Check
                isLast = (newId === oldId);
            }

            // Return
            return isLast;
        };

        /**
         * History.saveState
         * Push a State
         * @param {Object} newState
         * @return {boolean} changed
         */
        History.saveState = function(newState){
            // Check Hash
            if ( History.isLastSavedState(newState) ) {
                return false;
            }

            // Push the State
            History.savedStates.push(History.cloneObject(newState));

            // Return true
            return true;
        };

        /**
         * History.getStateByIndex()
         * Gets a state by the index
         * @param {integer} index
         * @return {Object}
         */
        History.getStateByIndex = function(index){
            // Prepare
            var State = null;

            // Handle
            if ( typeof index === 'undefined' ) {
                // Get the last inserted
                State = History.savedStates[History.savedStates.length-1];
            }
            else if ( index < 0 ) {
                // Get from the end
                State = History.savedStates[History.savedStates.length+index];
            }
            else {
                // Get from the beginning
                State = History.savedStates[index];
            }

            // Return State
            return State;
        };
        
        /**
         * History.getCurrentIndex()
         * Gets the current index
         * @return (integer)
        */
        History.getCurrentIndex = function(){
            // Prepare
            var index = null;
            
            // No states saved
            if(History.savedStates.length < 1) {
                index = 0;
            }
            else {
                index = History.savedStates.length-1;
            }
            return index;
        };

        // ====================================================================
        // Hash Helpers

        /**
         * History.getHash()
         * @param {Location=} location
         * Gets the current document hash
         * Note: unlike location.hash, this is guaranteed to return the escaped hash in all browsers
         * @return {string}
         */
        History.getHash = function(doc){
            var url = History.getLocationHref(doc),
                hash;
            hash = History.getHashByUrl(url);
            return hash;
        };

        /**
         * History.unescapeHash()
         * normalize and Unescape a Hash
         * @param {String} hash
         * @return {string}
         */
        History.unescapeHash = function(hash){
            // Prepare
            var result = History.normalizeHash(hash);

            // Unescape hash
            result = decodeURIComponent(result);

            // Return result
            return result;
        };

        /**
         * History.normalizeHash()
         * normalize a hash across browsers
         * @return {string}
         */
        History.normalizeHash = function(hash){
            // Prepare
            var result = hash.replace(/[^#]*#/,'').replace(/#.*/, '');

            // Return result
            return result;
        };

        /**
         * History.setHash(hash)
         * Sets the document hash
         * @param {string} hash
         * @return {History}
         */
        History.setHash = function(hash,queue){
            // Prepare
            var State, pageUrl;

            // Handle Queueing
            if ( queue !== false && History.busy() ) {
                // Wait + Push to Queue
                //History.debug('History.setHash: we must wait', arguments);
                History.pushQueue({
                    scope: History,
                    callback: History.setHash,
                    args: arguments,
                    queue: queue
                });
                return false;
            }

            // Log
            //History.debug('History.setHash: called',hash);

            // Make Busy + Continue
            History.busy(true);

            // Check if hash is a state
            State = History.extractState(hash,true);
            if ( State && !History.emulated.pushState ) {
                // Hash is a state so skip the setHash
                //History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',arguments);

                // PushState
                History.pushState(State.data,State.title,State.url,false);
            }
            else if ( History.getHash() !== hash ) {
                // Hash is a proper hash, so apply it

                // Handle browser bugs
                if ( History.bugs.setHash ) {
                    // Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249

                    // Fetch the base page
                    pageUrl = History.getPageUrl();

                    // Safari hash apply
                    History.pushState(null,null,pageUrl+'#'+hash,false);
                }
                else {
                    // Normal hash apply
                    document.location.hash = hash;
                }
            }

            // Chain
            return History;
        };

        /**
         * History.escape()
         * normalize and Escape a Hash
         * @return {string}
         */
        History.escapeHash = function(hash){
            // Prepare
            var result = History.normalizeHash(hash);

            // Escape hash
            result = window.encodeURIComponent(result);

            // IE6 Escape Bug
            if ( !History.bugs.hashEscape ) {
                // Restore common parts
                result = result
                    .replace(/\%21/g,'!')
                    .replace(/\%26/g,'&')
                    .replace(/\%3D/g,'=')
                    .replace(/\%3F/g,'?');
            }

            // Return result
            return result;
        };

        /**
         * History.getHashByUrl(url)
         * Extracts the Hash from a URL
         * @param {string} url
         * @return {string} url
         */
        History.getHashByUrl = function(url){
            // Extract the hash
            var hash = String(url)
                .replace(/([^#]*)#?([^#]*)#?(.*)/, '$2')
                ;

            // Unescape hash
            hash = History.unescapeHash(hash);

            // Return hash
            return hash;
        };

        /**
         * History.setTitle(title)
         * Applies the title to the document
         * @param {State} newState
         * @return {Boolean}
         */
        History.setTitle = function(newState){
            // Prepare
            var title = newState.title,
                firstState;

            // Initial
            if ( !title ) {
                firstState = History.getStateByIndex(0);
                if ( firstState && firstState.url === newState.url ) {
                    title = firstState.title||History.options.initialTitle;
                }
            }

            // Apply
            try {
                document.getElementsByTagName('title')[0].innerHTML = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
            }
            catch ( Exception ) { }
            document.title = title;

            // Chain
            return History;
        };


        // ====================================================================
        // Queueing

        /**
         * History.queues
         * The list of queues to use
         * First In, First Out
         */
        History.queues = [];

        /**
         * History.busy(value)
         * @param {boolean} value [optional]
         * @return {boolean} busy
         */
        History.busy = function(value){
            // Apply
            if ( typeof value !== 'undefined' ) {
                //History.debug('History.busy: changing ['+(History.busy.flag||false)+'] to ['+(value||false)+']', History.queues.length);
                History.busy.flag = value;
            }
            // Default
            else if ( typeof History.busy.flag === 'undefined' ) {
                History.busy.flag = false;
            }

            // Queue
            if ( !History.busy.flag ) {
                // Execute the next item in the queue
                clearTimeout(History.busy.timeout);
                var fireNext = function(){
                    var i, queue, item;
                    if ( History.busy.flag ) return;
                    for ( i=History.queues.length-1; i >= 0; --i ) {
                        queue = History.queues[i];
                        if ( queue.length === 0 ) continue;
                        item = queue.shift();
                        History.fireQueueItem(item);
                        History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
                    }
                };
                History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
            }

            // Return
            return History.busy.flag;
        };

        /**
         * History.busy.flag
         */
        History.busy.flag = false;

        /**
         * History.fireQueueItem(item)
         * Fire a Queue Item
         * @param {Object} item
         * @return {Mixed} result
         */
        History.fireQueueItem = function(item){
            return item.callback.apply(item.scope||History,item.args||[]);
        };

        /**
         * History.pushQueue(callback,args)
         * Add an item to the queue
         * @param {Object} item [scope,callback,args,queue]
         */
        History.pushQueue = function(item){
            // Prepare the queue
            History.queues[item.queue||0] = History.queues[item.queue||0]||[];

            // Add to the queue
            History.queues[item.queue||0].push(item);

            // Chain
            return History;
        };

        /**
         * History.queue (item,queue), (func,queue), (func), (item)
         * Either firs the item now if not busy, or adds it to the queue
         */
        History.queue = function(item,queue){
            // Prepare
            if ( typeof item === 'function' ) {
                item = {
                    callback: item
                };
            }
            if ( typeof queue !== 'undefined' ) {
                item.queue = queue;
            }

            // Handle
            if ( History.busy() ) {
                History.pushQueue(item);
            } else {
                History.fireQueueItem(item);
            }

            // Chain
            return History;
        };

        /**
         * History.clearQueue()
         * Clears the Queue
         */
        History.clearQueue = function(){
            History.busy.flag = false;
            History.queues = [];
            return History;
        };


        // ====================================================================
        // IE Bug Fix

        /**
         * History.stateChanged
         * States whether or not the state has changed since the last double check was initialised
         */
        History.stateChanged = false;

        /**
         * History.doubleChecker
         * Contains the timeout used for the double checks
         */
        History.doubleChecker = false;

        /**
         * History.doubleCheckComplete()
         * Complete a double check
         * @return {History}
         */
        History.doubleCheckComplete = function(){
            // Update
            History.stateChanged = true;

            // Clear
            History.doubleCheckClear();

            // Chain
            return History;
        };

        /**
         * History.doubleCheckClear()
         * Clear a double check
         * @return {History}
         */
        History.doubleCheckClear = function(){
            // Clear
            if ( History.doubleChecker ) {
                clearTimeout(History.doubleChecker);
                History.doubleChecker = false;
            }

            // Chain
            return History;
        };

        /**
         * History.doubleCheck()
         * Create a double check
         * @return {History}
         */
        History.doubleCheck = function(tryAgain){
            // Reset
            History.stateChanged = false;
            History.doubleCheckClear();

            // Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
            // Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
            if ( History.bugs.ieDoubleCheck ) {
                // Apply Check
                History.doubleChecker = setTimeout(
                    function(){
                        History.doubleCheckClear();
                        if ( !History.stateChanged ) {
                            //History.debug('History.doubleCheck: State has not yet changed, trying again', arguments);
                            // Re-Attempt
                            tryAgain();
                        }
                        return true;
                    },
                    History.options.doubleCheckInterval
                );
            }

            // Chain
            return History;
        };


        // ====================================================================
        // Safari Bug Fix

        /**
         * History.safariStatePoll()
         * Poll the current state
         * @return {History}
         */
        History.safariStatePoll = function(){
            // Poll the URL

            // Get the Last State which has the new URL
            var
                urlState = History.extractState(History.getLocationHref()),
                newState;

            // Check for a difference
            if ( !History.isLastSavedState(urlState) ) {
                newState = urlState;
            }
            else {
                return;
            }

            // Check if we have a state with that url
            // If not create it
            if ( !newState ) {
                //History.debug('History.safariStatePoll: new');
                newState = History.createStateObject();
            }

            // Apply the New State
            //History.debug('History.safariStatePoll: trigger');
            History.Adapter.trigger(window,'popstate');

            // Chain
            return History;
        };


        // ====================================================================
        // State Aliases

        /**
         * History.back(queue)
         * Send the browser history back one item
         * @param {Integer} queue [optional]
         */
        History.back = function(queue){
            //History.debug('History.back: called', arguments);

            // Handle Queueing
            if ( queue !== false && History.busy() ) {
                // Wait + Push to Queue
                //History.debug('History.back: we must wait', arguments);
                History.pushQueue({
                    scope: History,
                    callback: History.back,
                    args: arguments,
                    queue: queue
                });
                return false;
            }

            // Make Busy + Continue
            History.busy(true);

            // Fix certain browser bugs that prevent the state from changing
            History.doubleCheck(function(){
                History.back(false);
            });

            // Go back
            history.go(-1);

            // End back closure
            return true;
        };

        /**
         * History.forward(queue)
         * Send the browser history forward one item
         * @param {Integer} queue [optional]
         */
        History.forward = function(queue){
            //History.debug('History.forward: called', arguments);

            // Handle Queueing
            if ( queue !== false && History.busy() ) {
                // Wait + Push to Queue
                //History.debug('History.forward: we must wait', arguments);
                History.pushQueue({
                    scope: History,
                    callback: History.forward,
                    args: arguments,
                    queue: queue
                });
                return false;
            }

            // Make Busy + Continue
            History.busy(true);

            // Fix certain browser bugs that prevent the state from changing
            History.doubleCheck(function(){
                History.forward(false);
            });

            // Go forward
            history.go(1);

            // End forward closure
            return true;
        };

        /**
         * History.go(index,queue)
         * Send the browser history back or forward index times
         * @param {Integer} queue [optional]
         */
        History.go = function(index,queue){
            //History.debug('History.go: called', arguments);

            // Prepare
            var i;

            // Handle
            if ( index > 0 ) {
                // Forward
                for ( i=1; i<=index; ++i ) {
                    History.forward(queue);
                }
            }
            else if ( index < 0 ) {
                // Backward
                for ( i=-1; i>=index; --i ) {
                    History.back(queue);
                }
            }
            else {
                throw new Error('History.go: History.go requires a positive or negative integer passed.');
            }

            // Chain
            return History;
        };


        // ====================================================================
        // HTML5 State Support

        // Non-Native pushState Implementation
        if ( History.emulated.pushState ) {
            /*
             * Provide Skeleton for HTML4 Browsers
             */

            // Prepare
            var emptyFunction = function(){};
            History.pushState = History.pushState||emptyFunction;
            History.replaceState = History.replaceState||emptyFunction;
        } // History.emulated.pushState

        // Native pushState Implementation
        else {
            /*
             * Use native HTML5 History API Implementation
             */

            /**
             * History.onPopState(event,extra)
             * Refresh the Current State
             */
            History.onPopState = function(event,extra){
                // Prepare
                var stateId = false, newState = false, currentHash, currentState;

                // Reset the double check
                History.doubleCheckComplete();

                // Check for a Hash, and handle apporiatly
                currentHash = History.getHash();
                if ( currentHash ) {
                    // Expand Hash
                    currentState = History.extractState(currentHash||History.getLocationHref(),true);
                    if ( currentState ) {
                        // We were able to parse it, it must be a State!
                        // Let's forward to replaceState
                        //History.debug('History.onPopState: state anchor', currentHash, currentState);
                        History.replaceState(currentState.data, currentState.title, currentState.url, false);
                    }
                    else {
                        // Traditional Anchor
                        //History.debug('History.onPopState: traditional anchor', currentHash);
                        History.Adapter.trigger(window,'anchorchange');
                        History.busy(false);
                    }

                    // We don't care for hashes
                    History.expectedStateId = false;
                    return false;
                }

                // Ensure
                stateId = History.Adapter.extractEventData('state',event,extra) || false;

                // Fetch State
                if ( stateId ) {
                    // Vanilla: Back/forward button was used
                    newState = History.getStateById(stateId);
                }
                else if ( History.expectedStateId ) {
                    // Vanilla: A new state was pushed, and popstate was called manually
                    newState = History.getStateById(History.expectedStateId);
                }
                else {
                    // Initial State
                    newState = History.extractState(History.getLocationHref());
                }

                // The State did not exist in our store
                if ( !newState ) {
                    // Regenerate the State
                    newState = History.createStateObject(null,null,History.getLocationHref());
                }

                // Clean
                History.expectedStateId = false;

                // Check if we are the same state
                if ( History.isLastSavedState(newState) ) {
                    // There has been no change (just the page's hash has finally propagated)
                    //History.debug('History.onPopState: no change', newState, History.savedStates);
                    History.busy(false);
                    return false;
                }

                // Store the State
                History.storeState(newState);
                History.saveState(newState);

                // Force update of the title
                History.setTitle(newState);

                // Fire Our Event
                History.Adapter.trigger(window,'statechange');
                History.busy(false);

                // Return true
                return true;
            };
            History.Adapter.bind(window,'popstate',History.onPopState);

            /**
             * History.pushState(data,title,url)
             * Add a new State to the history object, become it, and trigger onpopstate
             * We have to trigger for HTML4 compatibility
             * @param {object} data
             * @param {string} title
             * @param {string} url
             * @return {true}
             */
            History.pushState = function(data,title,url,queue){
                //History.debug('History.pushState: called', arguments);

                // Check the State
                if ( History.getHashByUrl(url) && History.emulated.pushState ) {
                    throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
                }

                // Handle Queueing
                if ( queue !== false && History.busy() ) {
                    // Wait + Push to Queue
                    //History.debug('History.pushState: we must wait', arguments);
                    History.pushQueue({
                        scope: History,
                        callback: History.pushState,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }

                // Make Busy + Continue
                History.busy(true);

                // Create the newState
                var newState = History.createStateObject(data,title,url);

                // Check it
                if ( History.isLastSavedState(newState) ) {
                    // Won't be a change
                    History.busy(false);
                }
                else {
                    // Store the newState
                    History.storeState(newState);
                    History.expectedStateId = newState.id;

                    // Push the newState
                    history.pushState(newState.id,newState.title,newState.url);

                    // Fire HTML5 Event
                    History.Adapter.trigger(window,'popstate');
                }

                // End pushState closure
                return true;
            };

            /**
             * History.replaceState(data,title,url)
             * Replace the State and trigger onpopstate
             * We have to trigger for HTML4 compatibility
             * @param {object} data
             * @param {string} title
             * @param {string} url
             * @return {true}
             */
            History.replaceState = function(data,title,url,queue){
                //History.debug('History.replaceState: called', arguments);

                // Check the State
                if ( History.getHashByUrl(url) && History.emulated.pushState ) {
                    throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
                }

                // Handle Queueing
                if ( queue !== false && History.busy() ) {
                    // Wait + Push to Queue
                    //History.debug('History.replaceState: we must wait', arguments);
                    History.pushQueue({
                        scope: History,
                        callback: History.replaceState,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }

                // Make Busy + Continue
                History.busy(true);

                // Create the newState
                var newState = History.createStateObject(data,title,url);

                // Check it
                if ( History.isLastSavedState(newState) ) {
                    // Won't be a change
                    History.busy(false);
                }
                else {
                    // Store the newState
                    History.storeState(newState);
                    History.expectedStateId = newState.id;

                    // Push the newState
                    history.replaceState(newState.id,newState.title,newState.url);

                    // Fire HTML5 Event
                    History.Adapter.trigger(window,'popstate');
                }

                // End replaceState closure
                return true;
            };

        } // !History.emulated.pushState


        // ====================================================================
        // Initialise

        /**
         * Load the Store
         */
        if ( sessionStorage ) {
            // Fetch
            try {
                History.store = JSON.parse(sessionStorage.getItem('History.store'))||{};
            }
            catch ( err ) {
                History.store = {};
            }

            // Normalize
            History.normalizeStore();
        }
        else {
            // Default Load
            History.store = {};
            History.normalizeStore();
        }

        /**
         * Clear Intervals on exit to prevent memory leaks
         */
        History.Adapter.bind(window,"unload",History.clearAllIntervals);

        /**
         * Create the initial State
         */
        History.saveState(History.storeState(History.extractState(History.getLocationHref(),true)));

        /**
         * Bind for Saving Store
         */
        if ( sessionStorage ) {
            // When the page is closed
            History.onUnload = function(){
                // Prepare
                var currentStore, item, currentStoreString;

                // Fetch
                try {
                    currentStore = JSON.parse(sessionStorage.getItem('History.store'))||{};
                }
                catch ( err ) {
                    currentStore = {};
                }

                // Ensure
                currentStore.idToState = currentStore.idToState || {};
                currentStore.urlToId = currentStore.urlToId || {};
                currentStore.stateToId = currentStore.stateToId || {};

                // Sync
                for ( item in History.idToState ) {
                    if ( !History.idToState.hasOwnProperty(item) ) {
                        continue;
                    }
                    currentStore.idToState[item] = History.idToState[item];
                }
                for ( item in History.urlToId ) {
                    if ( !History.urlToId.hasOwnProperty(item) ) {
                        continue;
                    }
                    currentStore.urlToId[item] = History.urlToId[item];
                }
                for ( item in History.stateToId ) {
                    if ( !History.stateToId.hasOwnProperty(item) ) {
                        continue;
                    }
                    currentStore.stateToId[item] = History.stateToId[item];
                }

                // Update
                History.store = currentStore;
                History.normalizeStore();

                // In Safari, going into Private Browsing mode causes the
                // Session Storage object to still exist but if you try and use
                // or set any property/function of it it throws the exception
                // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to
                // add something to storage that exceeded the quota." infinitely
                // every second.
                currentStoreString = JSON.stringify(currentStore);
                try {
                    // Store
                    sessionStorage.setItem('History.store', currentStoreString);
                }
                catch (e) {
                    if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
                        if (sessionStorage.length) {
                            // Workaround for a bug seen on iPads. Sometimes the quota exceeded error comes up and simply
                            // removing/resetting the storage can work.
                            sessionStorage.removeItem('History.store');
                            sessionStorage.setItem('History.store', currentStoreString);
                        } else {
                            // Otherwise, we're probably private browsing in Safari, so we'll ignore the exception.
                        }
                    } else {
                        throw e;
                    }
                }
            };

            // For Internet Explorer
            History.intervalList.push(setInterval(History.onUnload,History.options.storeInterval));

            // For Other Browsers
            History.Adapter.bind(window,'beforeunload',History.onUnload);
            History.Adapter.bind(window,'unload',History.onUnload);

            // Both are enabled for consistency
        }

        // Non-Native pushState Implementation
        if ( !History.emulated.pushState ) {
            // Be aware, the following is only for native pushState implementations
            // If you are wanting to include something for all browsers
            // Then include it above this if block

            /**
             * Setup Safari Fix
             */
            if ( History.bugs.safariPoll ) {
                History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
            }

            /**
             * Ensure Cross Browser Compatibility
             */
            if ( navigator.vendor === 'Apple Computer, Inc.' || (navigator.appCodeName||'') === 'Mozilla' ) {
                /**
                 * Fix Safari HashChange Issue
                 */

                // Setup Alias
                History.Adapter.bind(window,'hashchange',function(){
                    History.Adapter.trigger(window,'popstate');
                });

                // Initialise Alias
                if ( History.getHash() ) {
                    History.Adapter.onDomLoad(function(){
                        History.Adapter.trigger(window,'hashchange');
                    });
                }
            }

        } // !History.emulated.pushState


    }; // History.initCore

    // Try to Initialise History
    if (!History.options || !History.options.delayInit) {
        History.init();
    }

})(window);
;// For random header background images
// This approach was used in order to manipulate pseudo-elements
var count = 15,
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

;$(document).ready(function(){
	$("ul.list-inline li a").tooltip();
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
