(function () {

    var data = require("self").data;
    var wifi = require("wifi").wifi;
    var widget = require("widget");
    var panel = require("panel");
    var request = require("request");
    var utils = require("utils").utils;
    
    var serverUrl = "http://127.0.0.1:8080/"
    
    var post = function (content, callback, pathname) {
        request.Request({
            url: serverUrl + pathname,
            content: JSON.stringify(content),
            contentType: "application/json",
            onComplete: callback
        }).post();
    };
    
    var setupMain = function (that) {
        // Create a panel for tagin.
        that.taginPanel = panel.Panel({
            width: 400,
            height: 300,
            contentURL: data.url("tagin.html"),
            contentScriptFile: [
                data.url("jquery-1.6.4.min.js"), 
                data.url("taginUI.js")
            ]
        });
        
        // Create a widget for tagin.
        that.widget = widget.Widget({
            id: "tagin",
            label: "Tagin Widget",
            contentURL: data.url("tagin2_final_icon_64.png"),
            panel: that.taginPanel
        });
        
        // Fethes the related wifi/tag information based on the latest
        // wifi information provided by the wifiListener.
        that.fetch = function () {
            post(that.model.latestWifi, function (response) {
                var response = response.json;
                if (response.isError) {
                    console.log("ERROR: " + response.message);
                    that.fetch();
                    return;
                }
                that.taginPanel.port.emit("wifiReceived", response);
            }, "fetch");
        };
        
        // Save a tag along with the latest wifi information. As a success
        // callback - fetch new related tags, wifi based on newly saved data.
        that.save = function (data) {
            post(data || that.model.latestWifi, function (response) {
                var response = response.json;
                if (response.isError) {
                    console.log("ERROR: " + response.message);
                    that.save(data);
                    return;
                }
                that.fetch();
            }, "save");
        };
    };
        
    var bindEvents = function (that) {
        // handle wifiChange event by the wifiListener what is fired every time
        // the wifi data is updated.
        that.wifiListener.on("wifiChange", function (data) {
            that.model.latestWifi = data;
            that.fetch();
        });
        
        // handle tagSubmitted event fired by the panel when the user tags location.
        that.taginPanel.port.on("tagSubmitted", function (tag) {
            if (!tag) {
                return;
            }
            var data;
            data = utils.map(that.model.latestWifi, function (wifi) {
                if (wifi.type !== "fingerprint") {
                    return wifi;
                }
                wifi.tag = tag;
                return wifi;
            });
            that.save(data);
        });
        
        // Start watching the wifi signals.
        that.wifiService.startWatching(that.wifiListener);
    };
    
    var main = function () {
        var that = {
            model: {}
        };
        
        that.wifiListener = wifi.wifiListener();
        that.wifiService = wifi.wifiService();
        
        setupMain(that);
        bindEvents(that);
        
        return that;
    };
    
    main();

})();