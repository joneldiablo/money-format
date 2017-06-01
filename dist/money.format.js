/*
 *  money-format - v4.1.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function($, window, document, undefined) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "moneyFormat",
        defaults = {
            dollar: true
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function() {

            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like the example below
            this.format();
            this.bindEvents();
            if ($(this.element).is("[type=number]") && this.settings.dollar) {
                this.createSpan();
            }
        },
        format: function(val) {
            var $elem = $(this.element);
            var jqCommand = "text";
            if ($elem.is("input") || $elem.is("textarea")) {
                jqCommand = "val";
            } else {
                $elem.css("white-space", "nowrap");
            }
            var value = val ? val : parseFloat($elem[jqCommand]().replace(/[^\d.-]/g, ''));
            var negative = value < 0 ? "-" : "";
            var dollar = this.settings.dollar ? "$" : "";
            var decimales = Math.round(100 * (Math.abs(value) % 1)) / 100;
            var enteros = Math.trunc(Math.abs(value));
            decimales = isNaN(decimales) ? 0 : decimales;
            enteros = isNaN(enteros) ? 0 : enteros;
            decimales = (decimales == 0 ? ".00" : (decimales + ""));
            decimales = decimales.replace("0.", ".");
            decimales = (decimales.length < 3 ? decimales + "0" : decimales);
            if ($elem.is("[type=number]")) {
                $elem[jqCommand](negative + enteros + decimales);
            } else {
                enteros = enteros.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                $elem[jqCommand](negative + dollar + " " + enteros + decimales);
            }
        },
        unformat: function() {
            var $elem = $(this.element);
            var value = parseFloat($elem.val().replace(/[^\d.-]/g, ''));
            value = parseFloat(value);
            $elem.val(value);
        },
        createSpan: function() {
            var $elem = $(this.element);
            $elem.before($("<span>").text("$ "));
        },
        bindEvents: function() {
            var moneyFormat = this;
            var $elem = $(this.element);
            $elem.on("focus", function(e) {
                moneyFormat.unformat();
            });
            $elem.on("focusout", function(e) {
                moneyFormat.format();
            });
            $elem.on("keyup", function(e) {
                if (e.keyCode == 13 || e.key === "Enter") {
                    $(this).trigger("focusout");
                }
                e.preventDefault();
            });
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);