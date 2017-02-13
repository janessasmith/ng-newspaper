"use strict";
/**
 * Created by MRQ on 2016/1/11.
 */
angular.module("editNewspaperServiceModule", [
        'draftCorrelationModule',
        'cancelSignedModule',
        'newspaperRetractDraftModule',
        'editNewspaperRejectionModule',
        "initDataNewspaperServiceModule",
        "editCenNewspaperProcessRecordingModule",
        "editCenNewspaperTextDesignationModule",
        "newsPaperPagePreviewModule",
        "editNewspapaerSignedZPInfoModule"
    ])
    .factory("editNewspaperService", ["$modal", "$q", 'trsHttpService', function($modal, $q, trsHttpService) {
        var cacheOpenedPanel = {};
        return {
            draftCorrelationViews: function(id, paperid, position) {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/newspaper/alertViews/manuscriptCorrelation/manuscript_correlation_tpl.html",
                    windowClass: 'edit-newspaper-draft-correlation',
                    backdrop: false,
                    controller: "draftCorrelationCtrl",
                    resolve: {
                        params: function() {
                            return {
                                'SrcDocId': id,
                                'PaperId': paperid,
                                'position': position
                            };
                        }
                    }
                });
                return modalInstance.result.then(function(result) {

                });
            },
            //撤稿，取消签发，待用
            cancelSignedViews: function(transferData, successFn) {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/newspaper/alertViews/cancelSigned/cancelSigned_tpl.html",
                    windowClass: 'edit-newspaper-cancel-signed',
                    backdrop: false,
                    controller: "cancelSignedCtrl",
                    resolve: {
                        params: function() {
                            return transferData;
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    successFn(result);
                });
            },
            //大样审阅流程记录
            processRecording: function(item) {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/newspaper/alertViews/ProcessRecording/ProcessRecording_tpl.html",
                    windowClass: 'edit-newspaper-processRecording',
                    backdrop: false,
                    controller: "editCenNewspaperProcessRecordingCtrl",
                    resolve: {
                        params: function() {
                            return item;
                        }
                    }
                });
            },
            //撤稿
            retractDraft: function() {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/newspaper/alertViews/retractDraft/retractDraft_tpl.html",
                    windowClass: "newspaper-retractDraft-windows",
                    backdrop: false,
                    controller: "newspaperRetractCtrl",
                });
                modalInstance.result.then(function(result) {

                });
            },
            //上版or转版
            changeLayoutDraft: function(transferData, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/newspaper/alertViews/shangbanWindows/shangbanWindows_tpl.html",
                    windowClass: "newspaper-shangban-windows",
                    controller: "ediCtrNewspaperShangbanCtrl",
                    resolve: {
                        transferData: function() {
                            return transferData;
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            //退稿
            rejectionDraft: function(transferData, success, fail) {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/newspaper/alertViews/rejection/rejection.html",
                    windowClass: "newspaper_rejection",
                    controller: "editNewspaperRejectionCtrl",
                    resolve: {
                        params: function() {
                            return transferData;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    result === "success" ? success(result) : fail();
                });
            },
            //查询当前站点
            queryCurrSite: function(siteid) {
                var params = {
                    "serviceid": "mlf_paperset",
                    "methodname": "findPaperById",
                    "SiteId": siteid
                };
                var deferred = $q.defer();
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }, //导出稿件
            exportDraft: function(metaDataIds) {
                var params_1 = {
                    serviceid: "mlf_exportword",
                    methodname: "exportWordFile",
                    MetaDataIds: metaDataIds
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params_1, "post")
                    .then(function(data) {
                        window.open(data);
                    });
            },
            //签发照排方法(停用弹窗)
            stopSignZp: function(item, success, fail) {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/newspaper/alertViews/signedZP/signedZP_tpl.html",
                    windowClass: "newspaper_signedZP",
                    controller: "editNewspapersignedZPCtrl",
                    resolve: {
                        item: function() {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    result === "success" ? success(result) : fail(result);
                });
            },
            //签发照排方法(启用弹窗)
            useSignZP: function(item, success, fail) {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/newspaper/alertViews/useSignedZP/useSignedZP_tpl.html",
                    windowClass: "newspaper_useSignedZP",
                    controller: "editNewspaperUseSignedZPCtrl",
                    resolve: {
                        item: function() {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    result === "success" ? success(result) : fail(result);
                });
            },
            /**
             * [singZpInfo description]签发照排排重信息
             * @param  {[obj]} result        [description]排重返回信息
             * @param  {[obj]} newspaperInfo [description]当前报纸信息
             * @return {[null]}               [description]
             */
            singZpInfo: function(result,success) {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/newspaper/alertViews/signedZP/singZpInfo_tpl.html",
                    windowClass: "newspaper_signedZPInfo",
                    controller: "editNewspapersignedZPInfoCtrl",
                    resolve: {
                        result: function() {
                            return result;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            //大样审阅详情页评审意见
            textDesignation: function(success) {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/newspaper/alertViews/textDesignation/textDesignation_tpl.html",
                    windowClass: "edit-newspaper-textDesignation",
                    controller: "editCenNewspaperTextDesignationCtrl"
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            /**
             * /[initNewspaperEdit][description]初始化报纸编辑页面
             * @return {[type]} [description]
             */
            initNewspaperEdit: function() {
                var newspaperpath = {
                    1: "newspapertext",
                    2: "newspaperpic"
                };
                return newspaperpath;
            },
            /*
             *[initNewspaperPreview][description] 初始化预览页面 
             */
            initNewspaperPreview: function() {
                var preview = {
                    1: "newspaperNewsPreview",
                    2: "newspaperAtlasPreview"
                };
                return preview;
            },
            /**
             * /[initNewspaperRule][description]  初始化报纸按钮权限
             * @param {[type]} [jrg] [description] 今日稿件
             * @param {[type]} [sbg] [description] 上版稿件
             * @param {[type]} [dyg] [description] 待用稿件
             * @param {[type]} [yqg] [description] 以签稿件
             */
            initNewspaperRule: function() {
                var paperRule = {
                    jrg: "0",
                    sbg: "1",
                    dyg: "2",
                    yqg: "3",
                    gdg: "4"
                };
                return paperRule;
            },
            cacheOpenedPanel: function(key, value) {
                cacheOpenedPanel[key] = value;
            },
            getCacheOpenedPanel: function(key) {
                return cacheOpenedPanel[key];
            }
        };
    }]);
