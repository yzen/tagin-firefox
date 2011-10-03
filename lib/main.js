(function () {

    var data = require("self").data;
    var wifi = require("wifi").wifi;
    var widget = require("widget");
    var panel = require("panel");
    var request = require("request");
    var utils = require("utils").utils;
    
    var serverUrl = "http://127.0.0.1:8080/"
    
    var setupMain = function (that) {
    
        that.taginPanel = panel.Panel({
            width: 400,
            height: 300,
            contentURL: data.url("tagin.html"),
            contentScriptFile: [
                data.url("jquery-1.6.4.min.js"), 
                data.url("taginUI.js")
            ]
        });
        
        that.widget = widget.Widget({
            id: "tagin",
            label: "Tagin Widget",
            contentURL: data.url("tagin2_final_icon_64.png"),
            panel: that.taginPanel
        });
        
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
    
    var post = function (content, callback, pathname) {
        request.Request({
            url: serverUrl + pathname,
            content: JSON.stringify(content),
            contentType: "application/json",
            onComplete: callback
        }).post();
    };
        
    var bindEvents = function (that) {
        that.wifiListener.on("wifiChange", function (data) {
            that.model.latestWifi = data;
            that.fetch();
        });
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