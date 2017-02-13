"use strict";
/**
 * Created by ma.rongqin on 2016/2/22.
 */
angular.module("editCenPersonalVersionTimeModule", [])
    .controller("editCenPersonalVersionTimeCtrl", ["$scope", "$sce", "$stateParams", "$q", "trsHttpService", function($scope, $sce, $stateParams, $q, trsHttpService) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化参数与状态
         * @return {[type]} [description]
         */
        function initStatus() {
            $scope.status = {
                params: {
                    serviceid: "mlf_extversion",
                    methodname: "getObjFromVersion",
                    ObjectVersionId: $stateParams.objectversionid
                }
            };
            $scope.data = {
                item: ""
            };
        }
        /**
         * [initData description]初始化数据
         * @return {[type]} [description]
         */
        function initData() {
            requestData($scope.status.params).then(function(data) {
                $scope.data.item = data;
                $scope.data.htmlContent = $sce.trustAsHtml($scope.data.item.HTMLCONTENT);
            });
        }
        /**
         * [requestData description]数据请求
         * @param  {[obj]} params [description]请求参数
         * @return {[type]}        [description]
         */
        function requestData(params) {
            var deferrd = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                deferrd.resolve(data);
            });
            return deferrd.promise;
        }
    }]);
