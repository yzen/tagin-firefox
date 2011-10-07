/*global jQuery, self*/

var tagin = tagin || {};

(function ($) {

    "use strict";

    var renderTags = function (that, data) {
        $(".currentTag").detach();
        $.each(tagin.utils.toArray(data), function (i, tag) {
            that.selectors.tags.append($("<div></div>")
                .addClass("currentTag")
                .text(tag.tag)
                .css("font-size", (0.6 + tag.distance) + "em"));
        });
        that.selectors.error.hide();
        that.selectors.tags.show();
    };
    
    var countToCallback = function (callback, update, delay) {
        update(delay);
        setTimeout(function () {
            if (delay > 0) {
                --delay;
                return countToCallback(callback, update, delay);
            }
            callback();
        }, 1000)
    };

    var handleError = function (that, error) {
        that.selectors.tags.hide();
        if (error !== "errorFetching") {
            that.selectors.error.text(that.options.strings[error]).show();
            return;
        }
        countToCallback(function () {
            self.port.emit("wifiRequested");
        }, function (delay) {
            that.selectors.error.text(that.options.strings[error] + delay).show();
        }, that.options.delay);
    };

    // Bind events.
    var bindEvents = function (that) {
        that.selectors.button.click(function () {
            self.port.emit("tagSubmitted", that.selectors.tag.val());
        });
        
        self.port.on("wifiReceived", function (data) {
            renderTags(that, data);
        });
        
        $.each(["errorFetching", "errorSaving"], function (index, error) {
            self.port.on(error, function () {
                handleError(that, error);
            });
        });
    };
    
    // tagin.main's creator function.
    tagin.main = function (options) {
        var that = tagin.utils.init("tagin.main", options);
        bindEvents(that);
        return that;
    };
    
    // Define tagin.main component's defaults.
    tagin.utils.defaults("tagin.main", {
        selectors: {
            button: ".submitTag",
            tag: ".tag",
            tags: ".tags",
            error: ".error"
        },
        strings: {
            errorSaving: "Something went wrong while saving new tag. Please try again...",
            errorFetching: "Something went wrong while getting wifi data. Trying again in "
        },
        delay: 5
    });

    tagin.main();

})(jQuery);