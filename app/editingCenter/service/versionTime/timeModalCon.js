"use strict";
/*
    created by cc 2015-11-16
 */
angular.module('editingCenterObjTimeModule', []).
controller('editCompiledobjTimeCtrl', ['$scope', "trsconfirm", "$modalInstance", "params", "trsHttpService", "initVersionService", function($scope, trsconfirm, $modalInstance, params, trsHttpService, initVersionService) {
    $scope.close = function() {
        $modalInstance.dismiss();
    };
    initStatus();
    initdata();
    //初始化数据
    function initdata() {
        $scope.items = params;
        getVersionTime(false);
    }
    //初始化状态
    function initStatus() {
        $scope.params = {
            serviceid: "mlf_metadatalog",
            methodname: "query",
            CURRPAGE: 1,
            MetaDataId: params.operationLog[0].times[0].value.METADATAID,
        };
        $scope.status = {
            operationLogNoMore: true,
        };
    }
    //点击加载更多
    $scope.getLoadMore = function() {
        $scope.params.CURRPAGE += 1;
        getVersionTime(true);
    };

    /**
     * getVersionTime  加载操作日志
     * @param  {Boolean} isGetMore [description：判断是否加载跟多]
     * 
     */
    function getVersionTime(isGetmore) {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
        	if(!data.DATA)return;
            if (!!isGetmore) {
                $scope.items.operationLog[0].times = $scope.items.operationLog[0].times.concat((initVersionService.getDayContent(data.DATA)[0].times));
            }
            $scope.status.operationLogNoMore = data.PAGER.CURRPAGE >= data.PAGER.PAGECOUNT;
        });
    }
}]);
