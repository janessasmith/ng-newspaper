"use strict";
angular.module("productMangageMentNewspaperServiceModule", [
        "productManageMentNewspaperEnableViewsModule",
        "productManageMentNewspaperDeleteViewsModule",
        "productManageMentNewspaperDisableViewsModule",
        'initAllocationDataModule'
    ])
    .factory("productMangageMentNewspaperService", ["$modal", "$q", "trsHttpService", "manageConfigPermissionService", "globleParamsSet", function($modal, $q, trsHttpService, manageConfigPermissionService, globleParamsSet) {
        return {
            //新建or编辑报纸
            manageNews: function(selectedItem, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/newspaper/service/manageNewspaper/manageNewspaper_tpl.html",
                    windowClass: 'manageNews',
                    backdrop: false,
                    resolve: {
                        selectedItem: function() {
                            return selectedItem;
                        }
                    },
                    controller: "manageNewsCtrl"
                });
                modalInstance.result.then(function(result) {
                    if (result === "success") {
                        success();
                    }
                });
            },
            //报刊排序
            pressRank: function(widgetId, chnlName, $scope, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/newspaper/service/pressRank/pressRank_tpl.html",
                    scope: $scope,
                    windowClass: 'man_produ_newpress',
                    backdrop: false,
                    controller: "productManageMentPressRankCtrl",
                    resolve: {
                        widgetParams: function() {
                            return {
                                widgetId: widgetId,
                                chnlName: chnlName
                            };
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    success(result);
                });
            },

            //批量删除
            batchDelete: function(widgetId, chnlName, $scope, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/newspaper/service/batchDelete/batchDelete_tpl.html",
                    scope: $scope,
                    windowClass: 'man_produ_newpress',
                    backdrop: false,
                    controller: "productManageMentBatchDeleteCtrl",
                    resolve: {
                        widgetParams: function() {
                            return {
                                widgetId: widgetId,
                                chnlName: chnlName
                            };
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    success(result);
                });
            },

            //启用弹窗
            enableViews: function(widgetId, chnlName, $scope, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/newspaper/service/enable/newspaper_enable_tpl.html",
                    scope: $scope,
                    windowClass: 'productManageMent-newspaper-enableViews',
                    backdrop: false,
                    controller: "productManageMentNewspaperEnableViewsCtrl",
                    resolve: {
                        widgetParams: function() {
                            return {
                                widgetId: widgetId,
                                chnlName: chnlName
                            };
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            //停用弹窗
            disableViews: function(widgetId, chnlName, $scope, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/newspaper/service/delete/newspaper_enable_tpl.html",
                    scope: $scope,
                    windowClass: 'productManageMent-newspaper-disableViews',
                    backdrop: false,
                    controller: "productManageMentNewspaperDisableViewsCtrl",
                    resolve: {
                        widgetParams: function() {
                            return {
                                widgetId: widgetId,
                                chnlName: chnlName
                            };
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            //删除弹窗
            deleteViews: function(ObjectIds, chnlName, $scope, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/newspaper/service/delete/newspaper_delete_tpl.html",
                    scope: $scope,
                    windowClass: 'productManageMent-newspaper-deleteViews',
                    backdrop: false,
                    controller: "productManageMentNewspaperDeleteViewsCtrl",
                    resolve: {
                        widgetParams: function() {
                            return {
                                ObjectIds: ObjectIds,
                            };
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            /**
             * [getRight description]获取栏目或站点的操作权限
             * @return object [description]
             */
            getRight: function(siteId, channelId, classify) {
                var deffer = $q.defer();
                var params = {
                    serviceid: "mlf_metadataright",
                    methodname: "queryOperKeyById",
                    SiteId: siteId,
                    ChannelId: channelId,
                    Classify: classify
                };
                if (siteId === "") {
                    delete params.SiteId;
                } else {
                    delete params.ChannelId;
                }
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        deffer.resolve(globleParamsSet.handlePermissionData(data));
                    });
                return deffer.promise;
            },
            /**
             * [getOperType description]获取可以看到或操作的底部标签 如：频道管理，碎片化管理，模板管理，分发配置
             * @return object [description]
             */
            getOperType: function(siteId, channelId) {
                var deffer = $q.defer();
                var params = {
                    serviceid: "mlf_metadataright",
                    methodname: "queryOperTypesBySiteId",
                    ChannelId: channelId,
                    SiteId: siteId
                };
                if (siteId === "") {
                    delete params.SiteId;
                } else {
                    delete params.ChannelId;
                }
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        deffer.resolve(globleParamsSet.handlePermissionData(data));
                    });
                return deffer.promise;
            }
        };
    }]);
