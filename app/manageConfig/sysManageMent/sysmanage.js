'use strict';
angular.module('sysmanageModule', [
    'sysmanageRouterModule',
    'cDMainModule',
    'sysManageMentSensitiveWordModule',
    'manConSysSouCenClassifyMgrModule',
    'manageSysManageEmailConfigModule',
    'manageSysManageSMSGatewayConfigModule',
    'manageSysManageSourceManageModule',
    'manageSysManagePlanDispatchModule',
    'manageSysManageHotWordsManageModule',
    'manageSysManageStatusManageModule',
    'manageSysManageReleaseComponentManageModule',
    'manageSysManageSMSTempConfigModule',
    'manageSysManageEmailTempConfigModule',
    'manageSysManageOtherConfigurationModule',
    'manageSysManageSystemFieldModule',
]).
controller('SysmanageController', ['$scope', '$state', function($scope, $state) {
    initStatus();
    initData();

    $state.go("manageconfig.sysmanage.classifieddictionary.classification");
    $scope.setSelectedOption = function(item, title) {
        $scope.optionSelected = item;
        $scope.titleName = title;
    };

    function initData() {
        $scope.optionSelected = "classifieddictionary";
    }

    function initStatus() {
        $scope.titleName = "系统管理";
    }
}]);
