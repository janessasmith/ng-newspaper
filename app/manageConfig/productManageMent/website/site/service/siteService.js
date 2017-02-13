/*
author:you 2015-1-7
 */
"use strict";
angular.module("mangeProSiteServiceModule", [])
    .controller("mangeProSiteModCtrl", ["$scope", "$modalInstance", "$stateParams", "params", "productMangageMentWebsiteService", "trsHttpService", function($scope, $modalInstance, $stateParams, params, productMangageMentWebsiteService, trsHttpService) {
        initStatus();
        // console.log(params);
        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
        $scope.confirm = function() {
            $scope.newsite.SiteName = $scope.newsite.SiteDesc;
            $scope.newsite.SiteOrder = $scope.allSitesSelected.value;
            $scope.newsite.ObjectId = angular.isDefined($scope.newsite.ObjectId) ? parseInt($scope.newsite.ObjectId) : 0;
            $scope.newsite.TempId = JSON.stringify({
                "CHNLTEMPID": angular.isDefined($scope.temp) ? parseInt($scope.temp.TEMPID) : 0,
                "OTHERTEMPID": angular.isDefined($scope.otherTemp) ? parseInt($scope.otherTemp.TEMPID) : 0,
                "DOCTEMPID": angular.isDefined($scope.xilanTemp) ? parseInt($scope.xilanTemp.TEMPID) : 0,
            });
            $scope.newsite.repeatUseTime = $scope.newsite.repeatUseTime === '' ? 0 : $scope.newsite.repeatUseTime;
            $modalInstance.close($scope.newsite);
        };
        /**
         * [queryTemplate description]模板弹窗打开
         * @param  {[type]} TEMPLATETYPE [description]
         * @return {[type]}              [description]
         */
        function queryTemplate(TEMPLATETYPE, TEMP) {
            var params = {
                ObjectType: "103",
                ObjectId: $stateParams.site,
                TEMPLATETYPE: TEMPLATETYPE,
                TempName: "",
            };
            productMangageMentWebsiteService.bindTemplate(params, function(result) {
                $scope[TEMP] = result;
            });
        }
        /**
         * [channlViews description]站点首页模板点击
         * @return {[type]} [description]
         */
        $scope.channlViews = function() {
            queryTemplate(1, "temp");
        };
        /**
         * [channlOtherViews description]其他首页模板点击
         * @return {[type]} [description]
         */
        $scope.channlOtherViews = function() {
            queryTemplate(1, "otherTemp");
        };
        /**
         * [defaultArticleViews description]默认文章模板点击
         * @return {[type]} [description]
         */
        $scope.defaultArticleViews = function() {
            queryTemplate(2, "xilanTemp");
        };
        //检查是否检查稿件属性
        $scope.checkAttr = function() {
            $scope.newsite.CheckFgdAttribute = $scope.newsite.CheckFgdAttribute === 1 ? 0 : 1;
        };
        $scope.examineEngName = function() {
            var examParams = {
                serviceid: "mlf_websiteconfig",
                methodname: "checkWebSitePath",
                DataPath: $scope.newsite.DataPath
            };
            examParams.SiteId = angular.isDefined($scope.newsite.siteId) ? $scope.newsite.siteId : 0;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), examParams, "get").then(function(data) {
                $scope.examEng = data;
            });
        };

        function initStatus() {
            $scope.title = params.title;
            $scope.allSites = [];
            angular.forEach(params.allSite, function(data, index, array) {
                $scope.allSites.push({
                    name: data.SITEDESC,
                    value: data.SITEORDER
                });
            });
            $scope.allSites.unshift({
                name: "最前面",
                value: -1
            });
            if (params.siteInfo !== "") {
                $scope.newsite = params.siteInfo;
                $scope.temp = params.siteInfo.temp;
                $scope.otherTemp = params.siteInfo.otherTemp;
                $scope.xilanTemp = params.siteInfo.xilanTemp;
                //处理编辑站点排序默认选中站点开始
                var i = 0;
                while (i < $scope.allSites.length) {
                    //去除本站点在排序列表上展现，并且将本站点的前一个站点设为默认位置。
                    if ($scope.allSites[i].value === params.siteInfo.SiteOrder) {
                        $scope.allSites.splice(i, 1);
                        $scope.allSitesSelected = angular.copy($scope.allSites[i - 1]);
                    } else {
                        i++;
                    }
                }
            } else {
                $scope.allSitesSelected = angular.copy($scope.allSites[0]);
                $scope.newsite = {
                    CheckFgdAttribute: 0,
                    repeatUseTime: 0,
                };
            }
        }
    }]);
