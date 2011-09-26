(function ($) {

    var tagin = tagin || {};

    var bindEvents = function (that) {
        self.port.on("wifiReceived", function (data) {
            that.tags.text(JSON.stringify(data));
        });
    };
    
    var setup = function (that) {
        that.button = $(".submitTag");
        that.tag = $(".tag");
        that.tags = $(".tags");
    
        that.button.click(function () {
            self.port.emit("tagSubmitted", that.tag.val());
        });
    };
    
    tagin.main = function () {
        var that = {};
        bindEvents(that);
        setup(that);
        return that;
    };
    
    tagin.main();
    
})(jQuery);