/*global jQuery*/

var tagin = tagin || {};

(function ($) {

    "use strict";
    
    tagin.utils = tagin.utils || {};
    
    // Define jQuery selectors based on selectors block from options.
    tagin.utils.setupSelectors = function (that) {
        that.selectors = {};
        $.each(that.options.selectors, function (name, selector) {
            that.selectors[name] = $(selector);
        });
    };

    // Base init function for a typical component.
    tagin.utils.init = function (name, options) {
        var that = {};
        that.options = $.extend(true, {}, tagin.utils.getDefaults(name), options);
        if (that.options.selectors) {
            tagin.utils.setupSelectors(that);
        }
        return that;
    };
    
    // Convert tag distances object to sorted array.
    tagin.utils.toArray = function (data) {
        var key, arr = [];
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                arr.push({
                    tag: key,
                    distance: data[key]
                });
            }
        }
        return arr.sort(function (a, b) {
            return b.distance - a.distance;
        });
    };
    
    // Private defaults structure for storing component defaults.
    var defaults = {};
    
    // A function used for specifying component defaults.
    tagin.utils.defaults = function (name, componentDefaults) {
        defaults[name] = componentDefaults;
    };
    
    // A function used for retreiving defined component defaults.
    tagin.utils.getDefaults = function (name) {
        return defaults[name] || {};
    };

})(jQuery);