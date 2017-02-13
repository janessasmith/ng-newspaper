/**
 * Created by MRQ on 2016/1/15.
 */
'use strict';
angular.module('proManaMentWebsiteFootModule', [

]).
controller('proMgrWebfooterRouterCtrl', ['$scope', '$stateParams', 'localStorageService', function($scope, $stateParams, localStorageService) {
    initStatus();
    initData();

    function initData() {
        $scope.selectThisNav = $stateParams.selectTab ? $stateParams.selectTab : (!!$stateParams.channel ? "column" : "channel");
    }

    function initStatus() {
        $scope.status = {
            isColumn: $stateParams.channel,
            parentchnl: $stateParams.parentchnl
        };
        $scope.data = {
            items: []
        };
        //从缓存中获取权限信息开始
        if (angular.isDefined($stateParams.parentchnl)) {
            //判断为获取栏目访问权限
            $scope.status.rightOperType = localStorageService.get("rightOperType_channel");
        } else {
            //判断为获取频道访问权限
            $scope.status.rightOperType = localStorageService.get("rightOperType_site");
        }
        //从缓存中获取权限信息结束
        packageData();
        //清除缓存
        //localStorageService.remove("rightOperType");
    }
    /**
     * [packageData description]动态组装底部导航条数据
     * @return null [description]
     */
    function packageData() {
        for (var key in $scope.status.rightOperType.data) {
            switch (key) {
                case "channel":
                    var data = {};
                    if (angular.isDefined($scope.status.isColumn)) {
                        data = {
                            desc: "栏目管理",
                            flag: "column"
                        };
                    } else {
                        data = {
                            desc: "频道管理",
                            flag: "channel"
                        };
                    }
                    $scope.data.items.push(data);
                    break;
                case "template":
                    $scope.data.items.push({
                        desc: "模板管理",
                        flag: "template"
                    });
                    break;
                // case "widget":
                //     $scope.data.items.push({
                //         desc: "碎片化管理",
                //         flag: "fragment"
                //     });
                //     break;
                case "publishdistribution":
                    $scope.data.items.push({
                        desc: "分发配置管理",
                        flag: "distributeconfig"
                    });
                    break;
            }
        }
    }
}]);
