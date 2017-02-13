'use strict';
/**
 *  Module  策划中心详情页面
 *
 * Description
 */
angular.module('planNetwrokDetailModule', []).controller('planNetwrokDetailCtrl', ['$scope', '$stateParams', '$q', 'trsHttpService','$sce', function($scope, $stateParams, $q, trsHttpService,$sce) {
    initStatus();
    initData();

    function initStatus() {
        $scope.params = {
            typeid: "widget",
            serviceid: "networkmedia",
            modelid: "detail",
            key:$stateParams.key

        };
        $scope.data = {
            items: "",
            time: "",
            //selectedArray: [],
        };
    }

    /**
     * [initData description]初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        getCuemonitorDetail();
    }

    function getCuemonitorDetail() {
        trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(),  $scope.params, "get").then(function(data) {
            $scope.data.planDetail = data.CONTENT.RESULT;
            $scope.data.planDetail.CODEDESC=data.CONTENT.RESULT.TITLE;
            $scope.data.planDetail.COMMENTS=data.CONTENT.RESULT.CONTENT;
        });
    }

}]);
