(function ($) {

    var tagin = tagin || {};

    var bindEvents = function (that) {
        self.port.on("wifiReceived", function (data) {
            $(".text").text(JSON.stringify(data));
        });
    };
    
    var setup = function (that) {
        $(".submitTag").click(function () {
            self.port.emit("wifiRequested");
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