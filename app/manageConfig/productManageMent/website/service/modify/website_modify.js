/**
 * Created by MRQ on 2016/1/6.
 */
"use strict";
angular.module("productManageMentWebsiteModifyViewsModule", [
    'productManageMentWebsiteModifyServiceModule'
])
    .controller("productManageMentWebsiteChannelModifyViewsCtrl", ["$scope", "$modalInstance", "title","successFn",'productMangageMentWebsiteModifyService', function ($scope, $modalInstance, title,successFn,productMangageMentWebsiteModifyService) {
        initStatus();
        $scope.cancel = function () {
           $modalInstance.dismiss("cancel");
        };
        $scope.confirm = function () {
            $modalInstance.close($scope.newsite);
        };
        function initStatus() { 
             $scope.newsite  = {
                "ObjectId": "0",
                "SITENAME": "",
                "SiteDesc": "test",
                "DATAPATH": "",
                "RootDoMain": "www.baidu.com",
                "SiteOrder": "",
            };
            $scope.title = title;
        }
        //栏目模板弹窗
        $scope.channlViews = function() {
            productMangageMentWebsiteModifyService.channlViews();
        };
        //栏目其他模板弹窗
        $scope.channlOtherViews = function() {
            productMangageMentWebsiteModifyService.channlOtherViews();
        };
        //默认文章弹窗
        $scope.defaultArticleViews = function() {
            productMangageMentWebsiteModifyService.defaultArticleViews();
        };
    }]);
