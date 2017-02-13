"use strict";
angular.module('ckmModule', [])
    .controller('ckmCtrl', ['$scope', '$q', 'trsHttpService', '$validation', 'trsconfirm', function($scope, $q, trsHttpService, $validationProvider, trsconfirm) {
        initStatus();
        initData();

        $scope.setSelctedIp = function(item) {
            $scope.selectedIp = angular.copy(item);

        };
        $scope.save = function() {
            $validationProvider.validate($scope.createckmDataForm).success(function() {
                var hostName = angular.isDefined($scope.selectedIp.id) ? "/dicttool/ckm/update" : "/dicttool/ckm/create";
                trsHttpService.httpServer(hostName, $scope.selectedIp, "post").then(function(data) {
                    requestData();
                    $scope.selectedIp = {};
                    $scope.createckmDataForm.$setPristine();
                });
            });
        };
        $scope.cancelorDelete = function() {
            trsconfirm.alertType("确定要删除么？", "确定要删除么？", "warning", true, function() {
                if (angular.isDefined($scope.selectedIp.id)) {
                    var hostName = "/dicttool/ckm/delete?id=" + $scope.selectedIp.id;
                    trsHttpService.httpServer(hostName, {}, "post").then(function(data) {
                        requestData();
                        initStatus();
                    });
                } else {
                    initStatus();
                }
            });
        };
        $scope.createServer = function() {
            $scope.createckmDataForm.$setPristine();
            initStatus();
        };

        function initData() {
            requestData();
        }

        function initStatus() {
            $scope.selectedIp = {};
            $scope.params = {};
        }

        function requestData(callback) {
            // var deferred = $q.defer();
            trsHttpService.httpServer('/dicttool/ckm/getall', {}, "post").then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.datas = data;
                }
            }, function(data) {});
        }

    }]);
