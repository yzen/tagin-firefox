(function () {

    var {Cc, Ci, Cu, Cr, Cm} = require("chrome");
    var uuidGenerator = Cc["@mozilla.org/uuid-generator;1"].getService(Ci.nsIUUIDGenerator);

    var utils = {};
    
    utils.getUUID = function () {
        return uuidGenerator.generateUUID().toString().replace(/[\{\}]/gi, "");
    };
    
    utils.getUUIDUrn = function () {
        return "urn:uuid:" + utils.getUUID();
    };
    
    utils.isArrayable = function (list) {
        return list && 
            typeof list === "object" && 
            typeof list.length === "number" && 
            !(list.propertyIsEnumerable("length")) && 
            typeof list.splice === 'function';
    };
    
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
    
    var transformImpl = function (list, togo, key, args) {
        var value = list[key];
        var i = 1;
        for (i; i < args.length; ++i) {
            value = args[i](value, key);
        }
        togo[key] = value;
    };
    
    utils.map = function (list) {
        if (!list) {
            return;
        }
        var isArrayable = utils.isArrayable(list);
        var togo = isArrayable ? [] : {};
        if (isArrayable) {
            var i;
            for (i = 0; i < list.length; ++i) {
                transformImpl(list, togo, i, arguments);
            }
        } else {
            var key;
            for (key in list) {
                transformImpl(list, togo, key, arguments);
            }
        }
        return togo;
    };
    
    exports.utils = utils;
    
})();