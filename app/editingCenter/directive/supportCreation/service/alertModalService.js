'use strict';
/**
 *  Module
 *
 * Description
 */
angular.module('supportCreationAlertDetailModule', []).factory('alterModule', ['$modal', function($modal) {
    return {
        alterDeatil: function(item, indexname) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/directive/supportCreation/service/alterDetail.html",
                windowClass: 'alert-detail',
                backdrop: false,
                controller: "supportCreationAlertDetailCtrl",
                resolve: {
                    item: function() {
                        return item;
                    },
                    indexname: function() {
                        return indexname;
                    },
                }
            });
        },
        creationDetail: function(creatid) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/directive/supportCreation/service/alterDetail.html",
                windowClass: 'alert-detail',
                backdrop: false,
                controller: "supportCreationDetailCtrl",
                resolve: {
                    creatid: function() {
                        return creatid;
                    },
                }
            });
        }
    };
}]).controller('supportCreationAlertDetailCtrl', ['$scope', 'trsHttpService', '$sce', 'item', '$modalInstance', 'indexname', function($scope, trsHttpService, $sce, item, $modalInstance, indexname) {
    initstatus();
    initdata();

    function initstatus() {
        var serviceid, guid = item.ZB_GUID;
        $scope.params = {
            "serviceid": 'jtcpg',
            "modelid": "detailData",
            "guid": guid,
            "typeid": "zyzx",
            "indexName": indexname,
        };
    }

    function initdata() {
        trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
            $scope.detailInfos = data.content[0];
            $scope.detailInfos.CONTENT = data.content[0] && $sce.trustAsHtml(data.content[0].CONTENT);
        });
    }
    $scope.close = function() {
        $modalInstance.close();
    };
}]).controller('supportCreationDetailCtrl', ['$scope', 'trsHttpService', '$sce', 'creatid', '$modalInstance', function($scope, trsHttpService, $sce, creatid, $modalInstance) {
    initstatus();
    initdata();

    function initstatus() {
        $scope.params = {
            serviceid: "mlf_releasesource",
            methodname: "getCreationInfo",
            CreationId: creatid
        };
    }

    function initdata() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "post").then(function(data) {
            $scope.detailInfos = data;
            $scope.detailInfos.DOCTITLE = data.METATITLE;
            $scope.detailInfos.CONTENT =$sce.trustAsHtml(data.CONTENT);
        });

    }
    $scope.close = function() {
        $modalInstance.close();
    };
}]);
