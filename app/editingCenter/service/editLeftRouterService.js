"use strict";
angular.module('editLeftRouterModule', []).factory('editLeftRouterService', [function() {
    var remRouter = {
        iWo: {
            value: "",
            param: ""
        },
        app: {
            value: "",
            param: ""
        },
        website: {
            value: "",
            param: ""
        },
        newspaper: {
            value: "",
            param: ""
        }
    };
    return {
        setRemRouter: function(tabName, value, param) {
            remRouter[tabName].value = value;
           if(!!param) remRouter[tabName].param = param;
        },

        getRemRouter: function(tabName) {
        	return remRouter[tabName];
        }
    };
}]);
