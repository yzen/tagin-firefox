(function () {
    
    var utils = require("utils").utils;
    
    var engine = function () {
        var that = {};
        
        that.storage = require("simple-storage").storage;
        
        that.getRank = function (rssi) {
            return (rssi - that.storage.min_rssi) / (that.storage.max_rssi - that.storage.min_rssi);
        };
        
        that.getRSSIRange = function (aps) {
            var range = {};
            utils.each(aps, function (ap) {
                range.min_rssi = range.min_rssi && range.min_rssi < ap.signal ? range.min_rssi : ap.signal;
                range.max_rssi = range.max_rssi && range.max_rssi > ap.signal ? range.max_rssi : ap.signal;
            });
            return range;
        };
        
        return that;
    };
    
    exports.engine = engine;
    
})();