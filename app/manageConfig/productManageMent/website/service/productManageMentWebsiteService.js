/**
 * Created by MRQ on 2016/1/6.
 */
"use strict";
angular.module("productManageMentWebsiteServiceModule", [
        'productManageMentWebsiteServiceCtrlModule',
        'productManageMentWebsiteDeleteViewsModule',
        'productManageMentWebsiteModifyViewsModule',
        'productManageMentWebsiteDistributeAddModule',
        'productWebsiteDistributeAddModule',
        "websiteBindTemplateModule",
        "inputPasswordModule",
        "manageConfigSingleChooseChnlModule"
    ])
    .factory("productMangageMentWebsiteService", ["$q", "$modal", "localStorageService", "manageConfigPermissionService", "trsHttpService", "globleParamsSet", "trsconfirm", function($q, $modal, localStorageService, manageConfigPermissionService, trsHttpService, globleParamsSet, trsconfirm) {
        return {
            //删除弹窗
            deleteViews: function(successFn) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/service/delete/website_delete_tpl.html",
                    windowClass: 'productManageMent-website-delete-view',
                    backdrop: false,
                    controller: "productManageMentWebsiteDeleteViewsCtrl",
                    resolve: {
                        successFn: function() {
                            return successFn;
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    //success(result);
                });
            },
            //修改弹窗
            modifyViews: function(title, successFn) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/service/modify/website_modify_tpl.html",
                    windowClass: 'productManageMent-website-modify-view',
                    backdrop: false,
                    controller: "productManageMentWebsiteChannelModifyViewsCtrl",
                    resolve: {
                        title: function() {
                            return title;
                        },
                        successFn: function() {
                            return successFn;
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    // success(result);
                });
            },
            //回收站删除弹窗
            recycleDeleteViews: function(params, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/service/template/recycle_bin_delete_view.html",
                    windowClass: 'productManageMent-website-recycle-delete',
                    backdrop: false,
                    controller: "productManageMentWebsiteRecycleDeleteCtrl",
                    resolve: {
                        params: function() {
                            return params;
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    success();
                });
            },
            //回收站还原弹窗
            recycleReductionViews: function(params, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/service/template/recycle_bin_reduction_view.html",
                    windowClass: 'productManageMent-website-recycle-reduction',
                    backdrop: false,
                    controller: "productManageMentWebsiteRecycleReductionCtrl",
                    resolve: {
                        params: function() {
                            return params;
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    success();
                });
            },
            //分发配置增加
            addClassifyManagement: function(item, successFn) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/distributeConfig/template/addView_tpl.html",
                    windowClass: 'distribute-add ',
                    backdrop: false,
                    controller: "distributeAddCtrl",
                    resolve: {
                        item: function() {
                            return item;
                        }
                    }
                });
                return modalInstance.result.then(function(result) {

                    successFn(result);
                });
            },
            bindTemplate: function(params, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/service/bindTemplate/channl_tpl.html",
                    windowClass: 'pmm-website-column-modify-channl-other',
                    backdrop: false,
                    resolve: {
                        params: function() {
                            return params;
                        }
                    },
                    controller: "columnChannelOtherViewsCtrl"
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            inputPassword: function(success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/service/inputPassword/inputPassword_tpl.html",
                    windowClass: 'productManageMent-website-channel-delete',
                    backdrop: false,
                    controller: "inputPasswordCtrl"
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            singleChooseChnl: function(modalTitle, siteid, channelid, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/service/singleChooseChnl/singleChooseChnl_tpl.html",
                    windowClass: 'website-move-window',
                    backdrop: false,
                    controller: "manageConfigsingleChooseChnlCtrl",
                    resolve: {
                        draftParams: function() {
                            return {
                                "siteid": siteid,
                                "channelid": channelid,
                                "modalTitle": modalTitle
                            };
                        }
                    }
                });
                modalInstance.result.then(function(result) {
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
            },
            /**
             * [getOperType description]获取可以看到或操作的底部标签 如：频道管理，碎片化管理，模板管理，分发配置
             * @return object [description]
             */
            getChannelAccessAuthority: function(siteId) {
                var deffer = $q.defer();
                this.getOperType(siteId, "").then(function(data) {
                    var router = "";
                    for (var key in data) {
                        switch (key) {
                            case "channel":
                                router += "channel";
                                break;
                            case "template":
                                router += "template";
                                break;
                            case "widget":
                                router += "fragment";
                                break;
                            case "publishdistribution":
                                router += "distributeconfig";
                                break;
                        }
                        break;
                    }
                    if (router === "") {
                        trsconfirm.alertType("您无权查看该站点下的频道", "您无权查看该站点下的频道", "error", false);
                    } else {
                        deffer.resolve({ data: data, router: router });
                    }
                });
                return deffer.promise;
            },
            /**
             * [getOperType description]获取可以看到或操作的底部标签 如：栏目管理，碎片化管理，模板管理
             * @return object [description]
             */
            getCloumnAccessAuthority: function(channelId) {
                var deffer = $q.defer();
                this.getOperType("", channelId).then(function(data) {
                    var router = "";
                    for (var key in data) {
                        switch (key) {
                            case "channel":
                                router += "column";
                                break;
                            case "template":
                                router += "template";
                                break;
                            case "widget":
                                router += "fragment";
                                break;
                            case "publishdistribution":
                                router += "distributeconfig";
                                break;
                        }
                        break;
                    }
                    if (router === "") {
                        trsconfirm.alertType("您无权查看该頻道下的栏目", "", "error", false);
                    } else {
                        deffer.resolve({"data":data,"router":router});
                    }
                });
                return deffer.promise;
            }
        };
    }]);
