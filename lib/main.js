(function () {

/*
    var contextMenu = require("context-menu");
    var request = require("request");
    var selection = require("selection");
    var data = require("self").data;
    
    var onMessageListener = function (text) {
        if (text.length === 0) {
            throw ("Text to translate must not be empty");
        }
        console.log("input: " + text);
        var url = "https://twitter.com/#!/search/%23" + text;
        require("tabs").open(url);
    };
     
    exports.main = function (options, callbacks) {
        console.log(options.loadReason);
     
        // Create a new context menu item.
        var menuItem = contextMenu.Item({
            image: data.url("twitter_newbird_blue.png"),
            label: "Lookup on Twitter",
            context: contextMenu.SelectionContext(),
            contentScriptFile: data.url("contextScript.js"),
            onMessage: onMessageListener
        });
    };
     
    exports.onUnload = function (reason) {
      console.log(reason);
    };
*/

    var data = require("self").data;
    var wifi = require("wifi").wifi;
    var widget = require("widget");
    var panel = require("panel");
    var request = require("request");
    
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
    };
    
    var bindEvents = function (that) {
        that.wifiListener.on("wifiChange", function (data) {
            that.model.latestWifi = data;
            request.Request({
                url: "http://127.0.0.1:5984/fingerprints/_bulk_docs",
                content: JSON.stringify({
                    docs: data.fingerprints
                }),
                contentType: "application/json",
                onComplete: function (response) {
                    console.log(JSON.stringify(response.json))
                }
            }).post();
            that.taginPanel.port.emit("wifiReceived", that.model.latestWifi);
        });
        that.taginPanel.port.on("tagSubmitted", function (tag) {
            console.log(tag);
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