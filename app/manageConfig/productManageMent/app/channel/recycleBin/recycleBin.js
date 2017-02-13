/**
 * Created by MRQ on 2016/1/5.
 */
"use strict";
angular.module("productManageMentAppChannelRecycleBinModule", [])
    .controller("productManageMentAppChannelRecycleBinCtrl", ["$scope", "$state", "$stateParams", "trsHttpService", 'productMangageMentWebsiteService', 'trsconfirm', function($scope, $state, $stateParams, trsHttpService, productMangageMentWebsiteService, trsconfirm) {
        //返回上一页
        initStatus();
        initData();
        $scope.goBack = function() {
            $state.go("manageconfig.productmanage.app.channel");
        };
        //删除弹窗
        $scope.deleteViews = function(siteid) {
            productMangageMentWebsiteService.recycleDeleteViews({
                title: "彻底删除“" + $scope.selectedSite.SITENAME + "”",
                content: "您确定要彻底删除此站点"
            }, function(data) {
                var deleteParams = {
                    serviceid: "mlf_appconfig",
                    methodname: "removeChannels",
                    ChannelIds: siteid
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), deleteParams, "post")
                    .then(function(data) {
                        trsconfirm.alertType("删除成功", "", "success", false, function() {
                            initData();
                        });
                    });
            });
        };
        //搜索已删站点
        $scope.search = function() {
            $scope.queryReWebSiteParams.SiteDesc = $scope.searchWord;
            initData();
        };
        //还原弹窗
        $scope.reductionViews = function(siteid) {
            productMangageMentWebsiteService.recycleReductionViews({
                title: "还原“" + $scope.selectedSite.SITENAME + "”",
                content: "您确定要还原此站点"
            }, function(data) {
                var reSiteParams = {
                    serviceid: "mlf_appconfig",
                    methodname: "restoreChannels",
                    ChannelIds: siteid,
                    RestoreAll: false
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), reSiteParams, "post")
                    .then(function(data) {
                        trsconfirm.alertType("还原成功", "", "success", false, function() {
                            initData();
                            /*$state.transitionTo($state.current, $stateParams, {
                                reload: true
                            });*/
                            $state.go("manageconfig.productmanage.app.channel.recyclebin",$stateParams,{reload:true});
                        });
                    });
            });
        };
        $scope.selectSite = function(SITEID) {
            $scope.selectedSite = SITEID;
        };

        function initStatus() {
            $scope.selectedSite = "";
            $scope.queryReWebSiteParams = {
                serviceid: "mlf_appconfig",
                methodname: "queryRecycleChnlBySiteId",
                SiteId:$stateParams.site
            };
        }

        function initData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.queryReWebSiteParams, "post")
                .then(function(data) {
                    $scope.items = data.DATA;
                });
        }

    }]);
