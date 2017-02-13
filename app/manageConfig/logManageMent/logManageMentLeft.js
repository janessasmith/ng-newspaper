/**
 *  logManageMentLeftModule
 *
 * Description 
 * rebuild:SMG 2016-4-20
 */
"use strict";
angular.module('logManageMentLeftModule', []).
controller('logManageMentLeftCtrl', logManageMentLeft);
logManageMentLeft.$injector = ['$scope', '$state'];

function logManageMentLeft($scope, $state) {
    initStatus();
    /**
     * [initStatus description] 初始化参数状态
     */
    function initStatus() {
        $scope.status = {
            currSelected: "",
        };
        //默认跳转操作日志
        $state.go("manageconfig.logmanage.operationlog");
        $scope.status.currSelected = 'operationlog';
    }
    /**
     * [goToPage description] 跳转不同的页面
     */
    $scope.goToPage = function(path) {
        $state.go("manageconfig.logmanage." + path);
        $scope.status.currSelected = path;
    }
}
