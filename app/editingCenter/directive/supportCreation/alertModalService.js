'use strict';
/**
 *  Module
 *
 * Description
 */
angular.module('supportCreationAlertDetailModule', []).factory('alterModule', ['$modal', function($modal) {
    return {
        alterDeatil: function(item) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/directive/supportCreation/service/alterDetail.html",
                windowClass: 'alert-detail',
                backdrop: false,
                controller: "supportCreationAlertDetailCtrl",
                resolve: {
                    item: function() {
                        return item;
                    },
                    params: function() {
                        var params = {
                            MetaDataIds: item.METADATAID,
                        };
                        return params;
                    }
                }
            });
        }
    };
}]).controller('supportCreationAlertDetailCtrl', ['$scope', 'trsHttpService', '$sce', 'item', function($scope, trsHttpService, $sce, item) {
    initdata();
    initstatus();
    function initstatus() {
        var serviceid, guid = item.guid,
            channelName = item.channel;
        $scope.params = {
            "serviceid": 'jtcpg',
            "modelid": "detailData",
            "guid": guid,
            "channelName": channelName,
            "typeid": "zyzx",
            "indexName": item.indexname,
        };
    }

    function initdata() {
        trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
            if (data && data.content) {
                $scope.detailInfos = data.content[0];
                $scope.detailInfos.CONTENT = data.content[0] && $sce.trustAsHtml(data.content[0].CONTENT);
            }
        });
    }
}]);
