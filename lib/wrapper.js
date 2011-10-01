(function () {
    
    var request = require("request");
    
    var wrapper = function () {
        var that = {
            urls: {
                fingerprints: "http://127.0.0.1:5984/fingerprints/_bulk_docs"
            }
        };
        
        that.post = function (options) {
            request.Request({
                url: that.options.urls[options.url],
                content: JSON.stringify(options.data),
                contentType: "application/json",
                onComplete: options.callback
            }).post();
        };
        
        return that;
    };
    
    exports.wrapper = wrapper;
    
})();