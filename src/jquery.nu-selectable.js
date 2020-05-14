/**
 * nuSelectable - jQuery Plugin
 * Copyright (c) 2015, Alex Suyun
 * Copyright (c) 2018, Carl-Philip Hänsch
 * Copyright (c) 2020, RA
 * Copyrights licensed under The MIT License (MIT)
 */
;
(function ($, window, document, undefined) {

    'use strict';

    var plugin = 'nuSelectable';

    // Event horizon
    function blackhole(evt) { evt.stopPropagation(); evt.preventDefault(); }

    var noop = function() { }

    var defaults = {
        start: noop,
        select: noop,
        unselect: noop,
        stop: noop,

        items: undefined,
        boxClass: undefined,
        selectedClass: undefined,

        distance: 10,
        itemsChange: true,
    };

    var THIS = function (container, options) {
        this.container = $(container);
        this.options = $.extend({}, defaults, options);
        this.selectionBox = $('<div>').addClass(this.options.boxClass);
      
        this.selecting = false;
        this._normalizeContainer();
        this._bindEvents();
        this._cacheItemData();
    };

    THIS.prototype._normalizeContainer = function () {
        this.container.css({
            '-webkit-touch-callout': 'none',
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none'
        });
    };

    THIS.prototype._cacheItemData = function () {
        this.itemData = $(this.options.items).toArray().map(
            (item, i) => ({
                element: $(item),
                selected: $(item).hasClass(this.options.selectedClass),
                position: item.getBoundingClientRect()
            })
        );
    };

    THIS.prototype._collideWithItems = function () {
        var selectionBox = this.selectionBox[0].getBoundingClientRect();
        for (var item of this.itemData) {
            var collision = !(
                selectionBox.right < item.position.left ||
                selectionBox.left > item.position.right ||
                selectionBox.bottom < item.position.top ||
                selectionBox.top > item.position.bottom
            );

            if (collision && !item.selected) {
                item.selected = true;
                item.element.addClass(this.options.selectedClass);
                this.options.select(item.element);
            }
            
            if (item.selected && !collision && this.selecting /* why? */) {
                item.selected = false;
                item.element.removeClass(this.options.selectedClass);
                this.options.unselect(item.element);
            }

        }
    };

    THIS.prototype._createBox = function () {
        this.selectionBox.appendTo(document.body).css({
            position: 'absolute',
            overflow: 'hidden',
        });
    };

    THIS.prototype._drawBox = function (css) {
        this.selectionBox.css(css).css({'z-index': Math.round(Date.now() / 1000)});
    };

    THIS.prototype._mousedown = function (evt) {
        if (evt.which !== 1) {
            return false;
        }
        if (evt.metaKey || evt.ctrlKey) {
            return false;
        }
        
        if (!this.options.disable) {
            // Defer selection: wait to achieve `distance`
            this.selecting = false;
            this.pos = [evt.pageX, evt.pageY];
        }
    };

    THIS.prototype._mousemove = function (evt) {
        var pos = this.pos;
        if (!pos) {
            // There was no mousedown
            return false;
        }

        var newpos = [evt.pageX, evt.pageY];
        var width = Math.abs(newpos[0] - pos[0]);
        var height = Math.abs(newpos[1] - pos[1]);
        
        if (!this.selecting) {
            // Initiate the selection?
            if ((width >= this.options.distance) || (height >= this.options.distance)) {
                this.selecting = true;

                // Callback
                this.options.start();

                // Re-collect selectables
                if (this.options.itemsChange) {
                    this._cacheItemData();
                }

                // Add the selection box to DOM
                this._createBox();
            }
        }

        if (this.selecting) {
            blackhole(evt);            
            var left = (newpos[0] < pos[0]) ? (pos[0] - width) : pos[0];
            var top = (newpos[1] < pos[1]) ? (pos[1] - height) : pos[1];
            this._drawBox({width: width, height: height, top: top, left: left});
            this._collideWithItems();
        }
    };

    THIS.prototype._mouseup = function (evt) {
        // Undo `mousedown`
        this.pos = undefined;

        if (this.selecting) {
            blackhole(evt);

            this.selecting = false;
            this.selectionBox.remove();

            // Callback
            this.options.stop();
        }
    };

    THIS.prototype._bindEvents = function () {
        this.container.on('mousedown', $.proxy(this._mousedown, this));
        $(document).on('mousemove', $.proxy(this._mousemove, this));
        // TODO: document may not receive mouseup?
        $(document).on('mouseup', $.proxy(this._mouseup, this));
    };

    $.fn[plugin] = function (options, ...args) {
        return this.each(function () {
            var item = $(this);
            var instance = item.data(plugin);
            if (!instance) {
                item.data(plugin, new THIS(this, options));
            } else {
                if ((typeof options === 'string') && (options[0] !== '_') && (options !== 'init')) {
                    instance[options].apply(instance, args);
                }
            }

        });
    };

})(jQuery, window, document);
