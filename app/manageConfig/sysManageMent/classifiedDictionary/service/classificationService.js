/*
    Create by BaiZhiming 2015-12-11
*/
"use strict";
angular.module("classificationServiceModule", [])
    .factory("classificationService", ["$q", "trsHttpService", function($q, trsHttpService) {
        return {
            queryClassification: function() {
                var deferred = $q.defer();
                var params = {
                    typeid: "dicttool",
                    serviceid: "menu",
                    modelid: "menus"
                };
                //trsHttpService.httpServer("/dicttool/menu/menus", "", "get")
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get")
                    .then(function(data) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            }
        };
    }]);
