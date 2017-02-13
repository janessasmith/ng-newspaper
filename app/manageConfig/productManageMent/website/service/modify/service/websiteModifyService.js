/**
 * Created by MRQ on 2016/1/6.
 */
"use strict";
angular.module("productManageMentWebsiteModifyServiceModule", [
    'websiteModifyChannlOtherViewsModule',
    'websiteModifyChannlViewsModule',
    'websiteModifyDefaultArticleViewsModule'
])
    .factory("productMangageMentWebsiteModifyService", ["$modal", function ($modal) {
        return {
            //栏目其他模板弹窗
            channlOtherViews: function () {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/service/modify/service/channlOtherTemplate/channl_other_tpl.html",
                    windowClass: 'pmm-website-modify-channl-other',
                    backdrop: false,
                    controller: "websiteModifyChannlOtherViewsCtrl"
                });
                return modalInstance.result.then(function (result) {
                    success(result);
                });
            },
            //栏目模板弹窗
            channlViews: function () {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/service/modify/service/channlTemplate/channl_tpl.html",
                    windowClass: 'pmm-website-modify-channl',
                    backdrop: false,
                    controller: "websiteModifyChannlViewsCtrl"
                });
                return modalInstance.result.then(function (result) {
                    success(result);
                });
            },
            //默认模板弹窗
            defaultArticleViews: function () {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/service/modify/service/defaultArticleTemplate/default_article_tpl.html",
                    windowClass: 'pmm-website-modify-default-article',
                    backdrop: false,
                    controller: "websiteModifyDefaultArticleViewsCtrl"
                });
                return modalInstance.result.then(function (result) {
                    success(result);
                });
            }
        }
    }]);
