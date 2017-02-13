/**
 * Created by MRQ on 2016/1/12.
 */
"use strict";
angular.module('draftCorrelationModule', [])
    .controller('draftCorrelationCtrl', ['$scope', "$modalInstance", 'trsHttpService', "params", function($scope, $modalInstance, trsHttpService, params) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                serviceid: "mlf_paper",
                PaperId: params.PaperId,
                SrcDocId: params.SrcDocId
            };
            if (params.position == 0) {
                $scope.params.methodname = 'queryRelateDocsInDaiYong';
            } else if (params.position == 1) {
                $scope.params.methodname = 'queryRelateDocsInJinRi';
            } else if (params.position == 2) {
                $scope.params.methodname = 'queryRelateDocsInShangBan';
            } else if (params.position == 3) {
                $scope.params.methodname = 'queryReleteDocsInYiQianFa';
            };
            $scope.status = {
                hasPic: "1"
            }
        }

        function initData() {
            requestData();
        }

        function requestData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.items = data;
            });
        }
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $modalInstance.dismiss();
        };
        $scope.position = function(position) {
            if (position == 31) {
                return "待用稿";
            } else if (position == 34) {
                return "上版稿";
            } else if (position > 34) {
                return "已签稿";
            } else {
                return "今日稿";
            }
        }
    }]);
