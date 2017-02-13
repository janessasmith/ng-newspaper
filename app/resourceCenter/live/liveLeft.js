"use strict";
/*
    created By cc 2016-08-17
 */
angular.module('resourceCenterLiveLeftModule', []).controller('liveLeftCtrl', ['$scope', '$q', "$state", "$stateParams", "trsHttpService", "trsconfirm", "initComDataService", function($scope, $q, $state, $stateParams, trsHttpService, trsconfirm, initComDataService) {
    initStatus();
    initData();

    function initStatus() {
        $scope.params = {
            serviceid: "mlf_liveshowbiaoqian",
            methodname: "queryLiveShowBiaoQians"
        };
        $scope.status = {
            isdataLoaded: false,
        };
        $scope.data = {
            lists: [],
            // selectedList: {},
        };
    }

    function initData() {
        requetData();
    }

    function requetData() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
            $scope.status.isdataLoaded = true;
            $scope.data.lists = data;
            initComDataService.saveLiveChannel = data;//将左侧推送频道存储起来
            $scope.data.selectedList = $scope.data.lists[0];
            $state.go('resourcectrl.liveshow.resource', {
                liveid: $scope.data.selectedList.XWCMLIVESHOWBIAOQIANID
            });
        });
    }
    /**
     * [selectList description]选择直播分类
     * @param  {[obj]} list [description]直播分类信息
     * @return {[type]}      [description]
     */
    $scope.selectList = function(list) {
        $scope.data.selectedList = list;
        $state.go('resourcectrl.liveshow.resource', {
            liveid: list.XWCMLIVESHOWBIAOQIANID
        });
    };
}]);
