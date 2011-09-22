(function () {

    var {Cc, Ci, Cu, Cr, Cm} = require("chrome");
    var utils = require("utils").utils;
    
    var wifiListener = function () {
        var that = {};
        
        that.onChange = function (accessPoints) {
            var maxRSSI, minRSSI;
            utils.each(accessPoints, function (ap) {
                maxRSSI = maxRSSI || ap.signal;
                minRSSI = minRSSI || ap.signal;
                maxRSSI = maxRSSI < ap.signal ? ap.signal : maxRSSI;
                minRSSI = minRSSI > ap.signal ? ap.signal : minRSSI;
            });
            var aps = utils.map(accessPoints, function (ap) {
                return {
                    mac: ap.mac,
                    RSSI: ap.signal,
                    maxRSSI: maxRSSI,
                    minRSSI: minRSSI,
                    rank: (ap.signal - minRSSI) / (maxRSSI - minRSSI),
                    type: "wlan"
                };
            });
            console.log(JSON.stringify(aps));
        };
        
        that.onError = function (value) {
            console.log("Error: " + value);
        };
        
        that.QueryInterface = function (iid) {
            if (iid.equals(Ci.nsIWifiListener) ||
                iid.equals(Ci.nsISupports)) {
                return this;
            }
            throw Cr.NS_ERROR_NO_INTERFACE;
        };
        
        return that;
    };
    
    var wifiService = function () {
        return Cc["@mozilla.org/wifi/monitor;1"].getService(Ci.nsIWifiMonitor);
    };

    exports.wifi = {
        wifiListener: wifiListener,
        wifiService: wifiService
    };
    
})();