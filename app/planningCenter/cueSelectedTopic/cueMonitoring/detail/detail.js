/**
 * Author:XCL
 *
 * Time:2016-03-02
 */
"use strict";
angular.module('planningCenterDetailModule', [])
    .controller('planningCenterDetailController', ['$scope', '$stateParams', 'trsHttpService', function($scope, $stateParams, trsHttpService) {
        initData();
        initStatus();

        function initStatus() {
            $scope.data = {
                rankingDetail: {},
                planDetail: {},
            };
            $scope.status={
                serviceid:$stateParams.serviceid
            };
        }

        function initData() {
            angular.isDefined($stateParams.modelid) ? getRankingDetail() : getCuemonitorDetail();
        }
        /**
         * [getRankingDetail description]获取排行榜单细缆数据
         * @return {[type]} [description]
         */
        function getRankingDetail() {
            var params = {
                serviceid: $stateParams.serviceid,
                modelid: $stateParams.modelid,
                title: $stateParams.title,
                serserved: $stateParams.serserved
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.data.rankingDetail=data;
            });
        }
        /**
         * [getCuemonitorDetail description]获取线索监控细缆数据
         * @return {[type]} [description]
         */
        function getCuemonitorDetail() {
            var params = {
                "serviceid": $stateParams.serviceid,
                "modelid": "detail",
                "guid": $stateParams.guid,
                "mid": $stateParams.mid
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                $scope.data.planDetail = data;
            });
        }
    }]);
