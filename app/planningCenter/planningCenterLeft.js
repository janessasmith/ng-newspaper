"use strict";
angular.module('planningCenterLeftModule', ["ui.bootstrap"])
    .controller('planningCenterLeftController', ["$scope", "$q", "$location", "globleParamsSet", "trsHttpService", function($scope, $q, $location, globleParamsSet, trsHttpService) {
        initStatus();
        $scope.setPlanSelect = function(param) {
            $scope.status.selectedItem = param;
        };

        function initStatus() {
            $scope.routerPathes = $location.path().split("/");
            $scope.status = {
                selectedItem: $scope.routerPathes[2] ? $scope.routerPathes[2] : "cuemonitor",
            };
            getCommandAccess().then(function() {
                for (var i in $scope.status.commandAccess) {
                    getCommandOperRights(i);
                }
            });
        }
        /**
         * [getCommandAccess description] 协同指挥访问权限
         * @return {[type]} [description] null
         */
        function getCommandAccess() {
            var deffer = $q.defer();
            var params = {
                serviceid: "mlf_metadataright",
                methodname: "queryOperTypesByModal",
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                .then(function(data) {
                    angular.forEach(data, function(_data, index, array) {
                        data[index] = "commandAccess." + data[index];
                    });
                    $scope.status.commandAccess = globleParamsSet.handlePermissionData(data);
                    deffer.resolve();
                });
            return deffer.promise;
        }
        /**
         * [getCommandAccess description] 协同指挥访问权限
         * @return {[type]} [description] null
         */
        function getCommandOperRights(name) {
            var params = {
                serviceid: "mlf_metadataright",
                methodname: "queryOperKeysOfModal",
                ModalName: name,
                Classify: name
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                .then(function(data) {
                    $scope.$parent.initStatus[name] = globleParamsSet.handlePermissionData(data);
                });
        }
    }]);
