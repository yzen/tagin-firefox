(function () {
    
    var utils = require("utils").utils;
    
    var engine = function () {
        var that = {};
        
        // Calculate a range of rssi signals for the list of wifi spots.
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