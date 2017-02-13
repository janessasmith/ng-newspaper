/*
    create by BaiZhiming 2016-2-24
*/
"use strict";
angular.module("manageConfigPermissionServiceModule", [])
    .factory("manageConfigPermissionService", ["$q", "trsHttpService", "globleParamsSet", function($q, trsHttpService, globleParamsSet) {
        return {
            isAdministrator: function() {
                var deffer = $q.defer();
                var flag = false;
                var params = {
                    serviceid: "mlf_extuser",
                    methodname: "isAdministrator"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        deffer.resolve(data.ISADMINISTRATOR === "true" ? true : false);
                    });
                return deffer.promise;
            },
            getPermissionData: function() {
                var deffer = $q.defer();
                var params = {
                    serviceid: "mlf_metadataright",
                    methodname: "queryCanOperOfConfiguration",
                    Classify: "configmodule"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        deffer.resolve(globleParamsSet.handlePermissionData(data));
                    });
                return deffer.promise;
            }
        };
    }]);
