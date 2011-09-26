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

    var tabs = require("tabs");
    var data = require("self").data;
    var wifi = require("wifi").wifi;
    
    var setupMain = function (that) {
        tabs.open({
            url: data.url("tagin.html"),
            isPinned: true,
            onReady: function (tab) {
                that.worker = tab.attach({
                    contentScriptFile: [
                        data.url("jquery-1.6.4.min.js"), 
                        data.url("taginUI.js")
                    ]
                });
                bindEvents(that);
            }
        });
    };
    
    var bindEvents = function (that) {
        that.wifiListener.on("wifiChange", function (data) {
            that.model.latestWifi = data;
        });
        that.worker.port.on("wifiRequested", function () {
            that.worker.port.emit("wifiReceived", that.model.latestWifi);
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
        
        return that;
    };
    
    main();

})();