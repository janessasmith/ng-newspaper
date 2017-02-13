"use strict";
angular.module('manageProAppSiteModule', ['productManageMentAppSiteRecycleBinModule'])
    .controller('manageProAppSiteController', ["$scope", "$q", "$location", "$rootScope", "$state", "$stateParams", "$modal", "trsHttpService", "manageConfigPermissionService", "trsconfirm", "productMangageMentWebsiteService", "websiteService", "localStorageService", function($scope, $q, $location, $rootScope, $state, $stateParams, $modal, trsHttpService, manageConfigPermissionService, trsconfirm, productMangageMentWebsiteService, websiteService, localStorageService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                "serviceid": "mlf_appconfig",
                "methodname": "queryAppSites"
            };
            $scope.status = {
                "data": {
                    "sites": [],
                    "selectedSite": "",
                }
            };
            manageConfigPermissionService.isAdministrator().then(function(data) {
                $scope.status.isAdministrator = data; //是否是系统管理员
            });
        }

        function initData() {
            requestData().then(function(data) {
                $scope.status.data.sites = data.DATA;
                $scope.status.data.selectedSite = getSiteById(data.DATA, $location.search().site);
            });
        }

        function requestData() {
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        $scope.clickSiteDirected = function(item) {
            productMangageMentWebsiteService.getChannelAccessAuthority(item.SITEID).then(
                function(data) {
                    //將权限信息存入缓存，用于底部路由区加载使用开始
                    localStorageService.remove("rightOperType_site"); //初始化缓存
                    localStorageService.set("rightOperType_site", {
                        type: data.router,
                        data: data.data
                    });
                    //將权限信息存入缓存，用于底部路由区加载使用结束
                    $state.go("manageconfig.productmanage.app." + data.router);
                    //联动展开左边树
                    $rootScope.$broadcast("expandLeftTree", "site");
                }
            );
        };

        $scope.search = function() {
            $scope.params.SiteDesc = $scope.searchWord;
            requestData().then(function(data) {
                $scope.status.data.sites = data.DATA;
            });
        };

        function getSiteById(sites, siteid) {
            if (sites.length > 0) {
                for (var i = 0; i < sites.length; i++) {
                    if (sites[i].SITEID == siteid)
                        return sites[i];
                }
            }
        }

        $scope.deleteSite = function(item) {
            var deleteParams = {
                serviceid: "mlf_appconfig",
                methodname: "deleteSite",
                SiteId: item.SITEID
            };
            trsconfirm.inputModel("确认删除此站点", "输入删除的理由，可选填", function(data) {
                productMangageMentWebsiteService.inputPassword(function(password) {
                    deleteParams.PassWord = password;
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), deleteParams, "post")
                        .then(function(data) {
                            trsconfirm.alertType("删除站点成功", "", "success", false, function() {
                                $rootScope.$broadcast("leftAppAddSite", true);
                                requestData().then(function(data) {
                                    $scope.status.data.sites = data.DATA;
                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: false
                                    });
                                });
                            });
                        });
                });
            });
        };

        $scope.addViews = function() {
            saveSite("站点管理-新增站点", "", $scope.status.data.sites);
        };

        function saveSite(title, siteInfo, allSite) {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/website/site/template/website_modify_tpl.html",
                windowClass: 'productManageMent-website-modify-view',
                backdrop: false,
                controller: "mangeProSiteModCtrl",
                resolve: {
                    params: function() {
                        return {
                            title: title,
                            siteInfo: siteInfo,
                            allSite: allSite,
                        };
                    }
                }
            });
            modalInstance.result.then(function(newsite) {
                newsite.serviceid = "mlf_appconfig";
                newsite.methodname = "saveNewSite";
                newsite.SiteDesc = newsite.SiteDesc;
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), newsite, "post").then(function(data) {
                    trsconfirm.alertType("保存成功", "", "success", false, function() {
                        $rootScope.$broadcast("leftAppAddSite", true);
                        requestData().then(function(data) {
                            $scope.status.data.sites = data.DATA;
                            $state.transitionTo($state.current, $stateParams, {
                                reload: false
                            });
                        });
                    });
                });
            });
        }

        //预览站点
        $scope.preview = function(item) {
            var preParams = {
                serviceid: "mlf_publish",
                methodname: "preview",
                ObjectIds: item.SITEID,
                ObjectType: "103",
                TopChannelId: '0',
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), preParams, "post")
                .then(function(data) {
                    window.open(data.DATA[0].URLS[0]);
                });
        };

        $scope.publish = function(item) {
            websiteService.websitePublish(item.SITEID, "103");
        };

        $scope.modifyViews = function(item) {
            var modParams = {
                serviceid: "mlf_appconfig",
                methodname: "findWebSiteById",
                SiteId: item.SITEID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), modParams, "post")
                .then(function(data) {
                    $rootScope.$broadcast("leftAppAddSite", true);
                    var siteInfo = {
                        ObjectId: item.SITEID,
                        repeatUseTime: data.REPEATUSETIME,
                        SiteName: data.SITEDESC,
                        SiteDesc: data.SITEDESC,
                        DataPath: data.DATAPATH,
                        SiteOrder: data.SITEORDER,
                        RootDoMain: data.ROOTDOMAIN,
                        CheckFgdAttribute: parseInt(data.CHECKFGDATTRIBUTE),
                        temp: {},
                        otherTemp: {},
                        xilanTemp: {},
                    };
                    //编辑时默认绑定模板数据转换开始
                    siteInfo.temp.TEMPID = angular.isDefined(data.GAILANTEMP[0]) ? data.GAILANTEMP[0].TEMPID : "0";
                    siteInfo.otherTemp.TEMPID = angular.isDefined(data.OTHERTEMP[0]) ? data.OTHERTEMP[0].TEMPID : "0";
                    siteInfo.xilanTemp.TEMPID = angular.isDefined(data.DOCTEMP[0]) ? data.DOCTEMP[0].TEMPID : "0";
                    siteInfo.temp.TEMPNAME = angular.isDefined(data.GAILANTEMP[0]) ? data.GAILANTEMP[0].TEMPNAME : "";
                    siteInfo.otherTemp.TEMPNAME = angular.isDefined(data.OTHERTEMP[0]) ? data.OTHERTEMP[0].TEMPNAME : "";
                    siteInfo.xilanTemp.TEMPNAME = angular.isDefined(data.DOCTEMP[0]) ? data.DOCTEMP[0].TEMPNAME : "";
                    siteInfo.siteId = $stateParams.site;
                    //编辑时默认绑定模板数据转换结束
                    saveSite("站点管理-修改站点", siteInfo, $scope.status.data.sites);
                });
        };

        $scope.$on("leftSaveAppToChildren",function(event,value){
            initData();
        });
    }]);
