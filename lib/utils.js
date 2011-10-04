(function () {

    const {Cc, Ci, Cu, Cr, Cm} = require("chrome");
    var uuidGenerator = Cc["@mozilla.org/uuid-generator;1"].getService(Ci.nsIUUIDGenerator);

    var utils = {};
    
    // Generate an object core that can implement an evented module.
    utils.initEventedModule = function (options) {
        const EventEmitter = require('api-utils/events').EventEmitter.compose({
            constructor: function EventEmitter() this
        });
        const self = EventEmitter();
        var that = self._public;
        that.events = {
            emit: function (type, data) {
                self._emit(type, data);
            }
        };
        return that;
    };
    
    // Extract a uuid from fingerprint's urn.
    utils.uuidFromUrn = function (urn) {
        return urn.split("urn:uuid:")[1];
    };
    
    // Generate a uuid.
    utils.getUUID = function () {
        return uuidGenerator.generateUUID().toString().replace(/[\{\}]/gi, "");
    };
    
    // Generate an urn using a newly generated uuid.
    utils.getUUIDUrn = function () {
        return "urn:uuid:" + utils.getUUID();
    };
    
    // Test wether an object is arrayable.
    utils.isArrayable = function (list) {
        return list && 
            typeof list === "object" && 
            typeof list.length === "number" && 
            !(list.propertyIsEnumerable("length")) && 
            typeof list.splice === 'function';
    };
    
    // Iterates and applies a function for each element of the array or object.
    utils.each = function (list, callback) {
        if (!list) {
            return;
        }
        if (!callback || typeof callback !== "function") {
            return;
        }
        if (utils.isArrayable(list)) {
            var i;
            for (i = 0; i < list.length; ++i) {
                callback(list[i], i);
            }
        } else {
            var key;
            for (key in list) {
                callback(list[key], key);
            }
        }       
    };
    
    var mapImpl = function (list, togo, key, args) {
        var value = list[key];
        var i = 1;
        for (i; i < args.length; ++i) {
            value = args[i](value, key);
        }
        togo[key] = value;
    };
    
    // Iterate over an array and map it to a new array based on the return value of 
    // transformation functions.
    utils.map = function (list) {
        if (!list) {
            return;
        }
        var isArrayable = utils.isArrayable(list);
        var togo = isArrayable ? [] : {};
        if (isArrayable) {
            var i;
            for (i = 0; i < list.length; ++i) {
                mapImpl(list, togo, i, arguments);
            }
        } else {
            var key;
            for (key in list) {
                mapImpl(list, togo, key, arguments);
            }
        }
        return togo;
    };
    
    // Find an element of array or an object based on the lookup function.
    utils.find = function (list, callback, deflt) {
        var disp;
        if (utils.isArrayable(list)) {
            var i;
            for (i = 0; i < list.length; ++i) {
                disp = func(list[i], i);
                if (disp !== undefined) {
                    return disp;
                }
            }
        } else {
            var key;
            for (key in list) {
                disp = func(list[key], key);
                if (disp !== undefined) {
                    return disp;
                }
            }
        }
        return deflt;
    };
    
    exports.utils = utils;
    
})();