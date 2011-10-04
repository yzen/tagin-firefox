(function () {
    
    var utils = require("utils").utils;
    
    var storage = function () {
        var that = {};
        
        that.storage = require("simple-storage").storage;
        
        // Either return a radioId (uuid) of machine's wireless card. If it is not saved
        // in the simple-storage, generate a new one and save in the simple-storage.
        that.getRadioId = function () {
            var radioId = that.storage.radioId;
            if (!radioId) {
                radioId = utils.getUUID();
            }
            that.storage.radioId = radioId;
            return radioId;
        };
        
        return that;
    };
    
    exports.storage = storage;
    
})();