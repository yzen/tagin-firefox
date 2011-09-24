(function () {
    
    var utils = require("utils").utils;
    
    var storage = function () {
        var that = {};
        
        that.storage = require("simple-storage").storage;
        
        that.getRadioId = function () {
            var radioId = that.storage.radioId;
            if (!radioId) {
                radioId = utils.getUUID();
            }
            that.storage.radioId = radioId;
            return radioId;
        };
        
        that.getRSSIRange = function () {
            return {
                min_rssi: that.storage.min_rssi,
                max_rssi: that.storage.max_rssi
            };
        };
        
        that.updateRSSIRange = function (accessPoints) {
            utils.each(accessPoints, function (ap) {
                that.setRSSIRange(ap.signal);
            });
        };
        
        that.setRSSIRange = function (rssi) {
            that.storage.min_rssi = that.storage.min_rssi && that.storage.min_rssi < rssi ? that.storage.min_rssi : rssi;
            that.storage.max_rssi = that.storage.max_rssi && that.storage.max_rssi > rssi ? that.storage.max_rssi : rssi;
        };
        
        return that;
    };
    
    exports.storage = storage;
    
})();