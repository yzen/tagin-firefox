(function () {
    
    var utils = require("utils").utils;
    
    var storage = function () {
        var that = {};
        
        that.storage = require("simple-storage").storage;
        
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