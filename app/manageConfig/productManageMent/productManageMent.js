'use strict';
angular.module('productManageMentModule', [
    'productManageMentRouterModule',
    'ui.bootstrap',
    "productManageMentLeftModule",
    "newspaperManageModule",
    "productManageMentWebsiteModule",
    "productManageMentServiceModule",
    "productManagementAppModule"
]).controller('productManageMentController', ['$scope', '$state', 'trsHttpService', '$modal', function($scope, $state, trsHttpService, $modal) {
    //左边切换站点触发右边导航切换站点广播转发，因为左边和右边是父子关系，需要由共同父来转发
    $scope.$on("changeSiteToParent", function(event, value) {
        $scope.$broadcast("changeSiteToChildren", value);
    });
    $scope.$on("leftSaveWebSite", function(event, value) {
        $scope.$broadcast("leftSaveWebSiteToChildren", value);
    });

    $scope.$on("leftSaveApp",function(event,value){
        $scope.$broadcast("leftSaveAppToChildren",value);
    });
    //console.log($scope.configureAccess);
}]);
