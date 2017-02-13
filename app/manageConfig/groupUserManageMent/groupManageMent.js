"use strict";
/**
 * customMonitor Module
 *
 * Description 子用户管理
 * Author:SMG 2016-5-11
 */
angular.module('groupManageMentModule', ['groupUserRightsModule']).
controller('groupManageMentController', ['$scope', '$state', '$timeout', 'treeService', 'trsHttpService', 'trsconfirm', 'trsspliceString', 'trsGroupTreeLocationService', function($scope, $state, $timeout, treeService, trsHttpService, trsconfirm, trsspliceString, trsGroupTreeLocationService) {
    $state.go('manageconfig.groupmanage.user', { status: 30 });
    $scope.$on("changeGroup", function(e, newLocation) {
        $scope.$broadcast("changeGroupList", newLocation);
    });
}]);
