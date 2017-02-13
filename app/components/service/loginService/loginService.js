"use strict";
angular.module('components.service.loginServiceModule', []).
factory('loginService', ['$q', 'trsHttpService', 'localStorageService', 'trsconfirm', function($q, trsHttpService, localStorageService, trsconfirm) {
    var currLoginUser = {};
    var cacheRouter = {
        state: "",
        param: ""
    };
    return {
        getLoginSocket: function() {

            /* require(['socket', function() {
                 trsHttpService.httpServer(trsHttpService.getCheckLoginUrl(), {}, "get").then(function(data) {
                     var mySocket = socketFactory();
                     mySocket.forward(data);
                     return mySocket;
                 });
             }]);*/
        },
        checkLogin: function(user) {
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getCheckLoginUrl(), {}, "get").then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        login: function(username, password) {
            var user = {
                UserName: username,
                Password: password,
            };
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getLoginServiceUrl(), user, "post").then(function(data) {
                if (data.code === 1) {
                    deferred.resolve("success");
                } else {
                    // 
                    deferred.reject(data);
                }
            });
            return deferred.promise;
        },
        logout: function() {
            var deferred = $q.defer();
            trsHttpService.httpServer("/wcm/security/logout", {}, "get").then(function(data) {
                if (data.code === 1) {
                    deferred.resolve("success");
                } else {
                    deferred.reject("error");
                }
            });
            return deferred.promise;
        },
        getCurrLoginUser: function() {
            var deferred = $q.defer();
            var params = {
                serviceid: "mlf_extuser",
                methodname: "getCurrUserInfo"
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        setCacheRouter: function(state, param) {
            cacheRouter.state = state.name;
            cacheRouter.param = param;
        },
        getCacheRouter: function() {
            return cacheRouter;
        }
    };
}]);
