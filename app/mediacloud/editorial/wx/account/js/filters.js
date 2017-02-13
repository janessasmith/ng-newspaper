define(function(require) {
    var app = require('app');

    app.filter('accountType', function() {
        return function(typeId) {
            if (typeId == 1) {
                return "服务号";
            }
            if (typeId == 2) {
                return "订阅号";
            }
            return "无效的类型";
        }
    });   
});