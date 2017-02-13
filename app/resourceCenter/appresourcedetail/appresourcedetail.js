"use strict";
angular.module('appResourceDetailModule', [])
    .controller('appResourceDetailCtrl', ['$scope', '$stateParams', '$sce', 'trsHttpService', function($scope, $stateParams, $sce, trsHttpService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                "serviceid": "jtcpg",
                "modelid": "detailData",   
                "typeid":"zyzx",
                "guid": $stateParams.guid,
                "indexName": $stateParams.indexname
            };
        }

        function initData() {
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                $scope.detailInfos = data.content[0];
                $scope.detailInfos.CONTENT = data.content[0] && $sce.trustAsHtml(data.content[0].CONTENT);
            });
        }
    }]);
