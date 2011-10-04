(function () {

    const {Cc, Ci, Cu, Cr, Cm} = require("chrome");
    var utils = require("utils").utils;
    var taginStorage = require("storage").storage();
    var engine = require("engine").engine();
    
    var wifiListener = function () {
        var that = utils.initEventedModule();
        
        // Grab persistant radio id (It is saved with simple-storage module).
        that.radioId = taginStorage.getRadioId();
        
        // On change event handler that is triggered every time the wifi data is updated.
        that.onChange = function (accessPoints) {
            var wifi = [];
            var range = engine.getRSSIRange(accessPoints);
            
            wifi.push({
                type: "radio",
                radio_id: that.radioId,
                min_rssi: range.min_rssi,
                max_rssi: range.max_rssi
            });
        
            utils.each(accessPoints, function (ap) {
                wifi.push({
                    type: "beacon",
                    mac: ap.mac,
                    beacon_type: "wlan"
                });
                wifi.push({
                    type: "fingerprint",
                    urn: utils.getUUIDUrn(),
                    date: Date().toString(),
                    rssi: ap.signal,
                    beacon_mac: ap.mac,
                    radio_id: that.radioId
                });
            });
            that.events.emit("wifiChange", wifi);
        };
        
        // Error handler for wifi listener.
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