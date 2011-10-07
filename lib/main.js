/*global require, console*/

(function () {

    "use strict";

    var data = require("self").data;
    var wifi = require("wifi").wifi;
    var widget = require("widget");
    var panel = require("panel");
    var request = require("request");
    var utils = require("utils").utils;
    
    var serverUrl = "http://127.0.0.1:8080/";
    
    var post = function (content, callback, pathname) {
        request.Request({
            url: serverUrl + pathname,
            content: JSON.stringify(content),
            contentType: "application/json",
            onComplete: callback
        }).post();
    };
    
    var handleErrors = function (response, port, error) {
        if (!response) {
            console.log("ERROR: " + error);
            port.emit(error);
            return;
        }
        if (response.isError) {
            console.log("ERROR: " + response.message);
            port.emit(error);
            return;
        }
        return true;
    };

    var setupPost = function (that, error, success, path) {
        return function (toSave) {
            post(toSave || that.model.latestWifi, function (response) {
                response = response.json;
                if (handleErrors(response, that.taginPanel.port, error)) {
                    success(response);
                }
            }, path);
        };
    };

    var setupMain = function (that) {
        // Create a panel for tagin.
        that.taginPanel = panel.Panel({
            width: 400,
            height: 300,
            contentURL: data.url("html/tagin.html"),
            contentScriptFile: [
                data.url("lib/jquery-1.6.4.min.js"),
                data.url("js/utils.js"),
                data.url("js/taginUI.js")
            ]
        });
        
        // Create a widget for tagin.
        that.widget = widget.Widget({
            id: "tagin",
            label: "Tagin Widget",
            contentURL: data.url("images/tagin2_final_icon_64.png"),
            panel: that.taginPanel
        });
        
        // Fethes the related wifi/tag information based on the latest
        // wifi information provided by the wifiListener.
        that.fetch = setupPost(that, "errorFetching", function (response) {
            that.taginPanel.port.emit("wifiReceived", response);
        }, "fetch");
        
        // Save a tag along with the latest wifi information. As a success
        // callback - fetch new related tags, wifi based on newly saved data.
        that.save = setupPost(that, "errorSaving", function () {
            that.fetch();
        }, "save");
    };
        
    var bindEvents = function (that) {
        // handle wifiChange event by the wifiListener what is fired every time
        // the wifi data is updated.
        that.wifiListener.on("wifiChange", function (data) {
            that.model.latestWifi = data;
            that.fetch();
        });
        
        // handle wifiRequested event fired by the panel when it's requesting tag update.
        that.taginPanel.port.on("wifiRequested", function () {
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