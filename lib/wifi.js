(function () {

    const {Cc, Ci, Cu, Cr, Cm} = require("chrome");
    var utils = require("utils").utils;
    var taginStorage = require("storage").storage();
    
    var wifiListener = function () {
        var that = utils.initEventedModule();
        
        // Grab persistant radio id (It is saved with simple-storage module).
        that.radioId = taginStorage.getRadioId();
        that.engine = require("engine").engine();
        
        that.onChange = function (accessPoints) {
        
            var beacons = {}, radios = {}, fingerprints = {};
            
            taginStorage.updateRSSIRange(accessPoints);
            that.RSSIRange = taginStorage.getRSSIRange();
            radios[that.radioId] = that.RSSIRange;
            
            var aps = utils.each(accessPoints, function (ap) {
                var urn = utils.getUUIDUrn();
                beacons[ap.mac] = {
                    type: "wlan"
                };
                fingerprints[urn] = {
                    date: Date().toString(),
                    rank: that.engine.getRank(ap.signal),
                    rssi: ap.signal,
                    beacon_mac: ap.mac,
                    radio_id: that.radioId,
                    type: "wlan"
                };
            });
            that.events.emit("wifiChange", {
                fingerprints: fingerprints,
                beacons: beacons,
                radios: radios
            });
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