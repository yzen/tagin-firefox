(function ($) {

    var tagin = tagin || {};
    
    var toArray = function (data) {
        var key, arr = [];
        for (key in data) {
            arr.push({
                tag: key,
                distance: data[key]
            });
        }
        return arr.sort(function (a, b) {
            return a.distance - b.distance;
        });
    };
    
    var renderTags = function (that, data) {
        $(".currentTag").detach();
        var tagArray = toArray(data), i;
        for (i = 0; i < tagArray.length; ++i) {
            var tag = tagArray[i];
            var currentTag = $("<div></div>").addClass("currentTag")
                                             .text(tag.tag)
                                             .css("font-size", (0.4 / tag.distance + 0.4) + "em");
            that.tags.append(currentTag);
        }
    };
    
    var bindEvents = function (that) {
        that.button.click(function () {
            self.port.emit("tagSubmitted", that.tag.val());
        });
        self.port.on("wifiReceived", function (data) {
            renderTags(that, data);
        });
    };
    
    var setup = function (that) {
        that.button = $(".submitTag");
        that.tag = $(".tag");
        that.tags = $(".tags");
    };
    
    tagin.main = function () {
        var that = {};
        setup(that);
        bindEvents(that);
        return that;
    };
    
    tagin.main();
    
})(jQuery);