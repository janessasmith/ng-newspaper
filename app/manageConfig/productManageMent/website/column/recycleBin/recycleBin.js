/**
 * Created by MRQ on 2016/1/5.
 */
"use strict";
angular.module("productManageMentWebsiteColumnRecycleBinModule", [])
    .controller("productManageMentWebsiteColumnRecycleBinCtrl", ["$scope", "$q", "$stateParams", "$state", "trsHttpService", "productMangageMentWebsiteService", "trsconfirm", "localStorageService", function($scope, $q, $stateParams, $state, trsHttpService, productMangageMentWebsiteService, trsconfirm, localStorageService) {
        initStatus();
        initData();
        //获取栏目操作权限开始
        function getChnlRights() {
            productMangageMentWebsiteService.getRight("", $stateParams.channel, "websetsite.channel").then(function(data) {
                $scope.status.right = data;
            });
        }

        function initStatus() {
            $scope.params = {
                serviceid: "mlf_websiteconfig",
                methodname: "queryRecycleChnlByChnlId",
                SiteId: $stateParams.site,
                ChannelId: $stateParams.channel,
                TopChannelId: $stateParams.parentchnl
            };
            $scope.status = {
                right: ""
            };
            getChnlRights();
        }

        function initData() {
            requestData().then(function(data) {
                $scope.items = data.DATA;
                angular.isDefined($scope.items) ? $scope.selectedColumn = $scope.items[0] : "";
            });
        }

        function requestData() {
            var deffered = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                deffered.resolve(data);
            });
            return deffered.promise;
        }
        $scope.goBack = function() {
            $state.go("manageconfig.productmanage.website.column");
        };
        $scope.selectedItem = function(item) {
            $scope.selectedColumn = item;
        };
        //删除弹窗
        $scope.deleteViews = function(chnldesc, chnlId) {
            productMangageMentWebsiteService.recycleDeleteViews({
                title: "删除",
                content: "您确定要彻底删除此栏目"
            }, function(data) {
                var deleteParams = {
                    serviceid: "mlf_websiteconfig",
                    methodname: "RemoveChannels",
                    ChannelIds: chnlId,
                    TopChannelId : $stateParams.parentChnl
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), deleteParams, "post")
                    .then(function(data) {
                        trsconfirm.alertType("删除成功", "删除成功", "success", false, function() {
                            initData();
                        });
                    });
            });
        };
        //还原弹窗
        $scope.reductionViews = function(chnldesc, chnlId) {
            productMangageMentWebsiteService.recycleReductionViews({
                content: "您确定要还原此站点"
            }, function(data) {
                var reSiteParams = {
                    serviceid: "mlf_websiteconfig",
                    methodname: "restoreChannels",
                    ObjectIds: chnlId,
                    SiteId: $stateParams.site,
                    TopChannelId: $stateParams.parentChnl,
                    RestoreAll: false
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), reSiteParams, "post")
                    .then(function(data) {
                        trsconfirm.alertType("还原成功", "还原成功", "success", false, function() {
                            initData();
                        });
                    });
            });
        };
    }]);
