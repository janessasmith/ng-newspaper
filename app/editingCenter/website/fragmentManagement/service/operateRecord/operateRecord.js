/*
    Create by BaiZhiming 2016-1-6
*/
'use strict';
angular.module("operateRecordModule", [])
    .controller("operateRecordCtrl", ["$scope", "$modalInstance", "$stateParams", "$filter", "trsHttpService", function($scope, $modalInstance, $stateParams, $filter, trsHttpService) {
        initStatus();
        initData();
        $scope.cancel = function() {
            $modalInstance.close();
        };
        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        $scope.changeTime = function(time) {
            time = $filter('date')(time, "yyyy-MM-dd HH:mm").toString();
            return time;
        };
        $scope.search = function(){
            $scope.params.StartTime = angular.isDefined($scope.startTime)?$scope.startTime:"";
            $scope.params.EndTime = angular.isDefined($scope.endTime)?$scope.endTime:"";
            $scope.params.OperateUser = angular.isDefined($scope.OPERATEUSER)?$scope.OPERATEUSER:""; 
            requestData();
        };

        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 10,
                "ITEMCOUNT": 0
            };
            $scope.params = {
                "serviceid": "mlf_widget",
                "methodname": "queryWidgetLogsOfTemplate",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "TemplateId": $stateParams.tempid
            };
        }

        function initData() {
            requestData();
        }

        function requestData(callback) {
            trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, 'get').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.items = data.DATA;
                    $scope.page = data.PAGER;
                    angular.isDefined($scope.page) ? $scope.page.PAGESIZE =
                        $scope.page.PAGESIZE.toString() : $scope.page = {
                            "PAGESIZE": 0,
                            "ITEMCOUNT": 0,
                            "PAGECOUNT": 0
                        };
                }
                $scope.selectedArray = [];
            }, function(data) {});
        }
    }]);
