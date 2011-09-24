(function () {
    
    var utils = require("utils").utils;
    
    var engine = function () {
        var that = {};
        
        that.storage = require("simple-storage").storage;
        
        that.getRank = function (rssi) {
            return (rssi - that.storage.min_rssi) / (that.storage.max_rssi - that.storage.min_rssi);
        };
        
        return that;
    };
    
    exports.engine = engine;
    
})();