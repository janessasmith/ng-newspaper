/*
    Create by BaiZhiming 2015-12-15
*/
'use strict';
angular.module("websiteServiceModule", ["batChooseChnlModule", "singleChooseChnlModule", "stickModule", "contentExpansionModule", 'editCenWebsiteSigedPushBarModule', 'editWebsteSubjectViewModule', 'editWebsteAscriptionViewModule']).
factory("websiteService", ["$modal", "trsHttpService", "trsconfirm", function($modal, trsHttpService, trsconfirm) {
    return {
        storgeTimeOrder: "OPERTIME", //存储排序时间字段
        /**
         * [batChooseChnl description]批量选择站点
         * @param  {[string]} modalTitle [description]弹框标题
         * @param  {[string]} siteid [description]站点ID
         * @param  {[fn]} success [description]回调函数
         * @param  {[radio]} radio [description]附件单选框组  非必传
         * @return {[null]}     [description]
         */
        batChooseChnl: function(modalTitle, siteid, success, radio) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/website/service/batChooseChnl/batChooseChnl_tpl.html",
                windowClass: 'website-batChooseChnl-window',
                backdrop: false,
                controller: "batChooseChnlCtrl",
                resolve: {
                    chnlParams: function() {
                        return {
                            "siteid": siteid,
                            "modalTitle": modalTitle,
                            "radio": radio
                                /*"channelid": channelid,
                                "METADATAIDS": METADATAIDS,
                                "methodname": methodname*/
                        };
                    }
                }
            });
            modalInstance.result.then(function(result) {
                success(result);
            });
        },
        singleChooseChnl: function(modalTitle, siteid, channelid, success) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/website/service/singleChooseChnl/singleChooseChnl_tpl.html",
                windowClass: 'website-move-window',
                backdrop: false,
                controller: "singleChooseChnlCtrl",
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
        contentExpansion: function(items, success) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/website/service/contentExpansion/contentExpansion_tpl.html",
                windowClass: 'website-contentExpansion-window',
                backdrop: false,
                controller: "contentExpansionCtrl",
                resolve: {
                    draftParams: function() {
                        return {
                            "items": items
                        };
                    }
                }
            });
            modalInstance.result.then(function(result) {
                success(result);
            });
        },
        stick: function(item, channelid, params, pagesize, success) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/website/service/stick/stick_tpl.html",
                windowClass: 'stick-window',
                backdrop: false,
                controller: "stickCtrl",
                resolve: {
                    stickParams: function() {
                        return {
                            item: item,
                            channelid: channelid,
                            params: params,
                            pagesize: pagesize
                        };
                    }
                }
            });
            modalInstance.result.then(function(result) {
                if (result === "success") {
                    success();
                }
            });
        },
        pushBar: function(success) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/website/service/pushBar/pushBar_tpl.html",
                windowClass: 'editCen-website-signed-pushBar',
                backdrop: false,
                controller: "editCenWebsiteSigedPushBarCtrl",
            });
            modalInstance.result.then(function(result) {
                success(result);
            });
        },
        getEditandPreviewPath: function() {
            var path = {
                edit: {
                    1: "websitenews",
                    2: "websiteatlas",
                    3: "websitesubject",
                    4: "websitelinkdoc"
                },
                preview: {
                    1: "websiteNewsPreview",
                    2: "websiteAtlasPreview",
                    3: 'websitesubject',
                    4: "websiteLinkPreview"
                }

            };
            return path;
        },
        /**
         * [websitePublish description]网站下的站点或栏目发布
         * @param  {[str]} ObjectId   [description]站点或栏目ID
         * @param  {[str]} ObjectType [description]站点或栏目类型
         * @return {[type]}            [description]
         */
        websitePublish: function(ObjectId, ObjectType) {
            var publishParams = {
                serviceid: "mlf_publish",
                methodname: "soloPublish",
                ObjectIds: ObjectId,
                ObjectType: ObjectType,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), publishParams, "post").then(
                function(data) {
                    trsconfirm.alertType("发布成功", "", "success", false);
                });
        },
        /**
         * [websiteChannelPreview description]网站栏目预览（管理配置与策划中心网站都有）
         * @param  {[type]} chl [description]栏目信息
         * @return {[type]}     [description]
         */
        websiteChannelPreview: function(chl) {
            var preParams = {
                serviceid: "mlf_publish",
                methodname: "preview",
                ObjectIds: chl.CHANNELID,
                ObjectType: "101",
                TopChannelId: '0',
            };
            if (chl.TOPCHNLID) {
                preParams.TopChannelId = chl.TOPCHNLID == chl.CHANNELID ? 0 : chl.TOPCHNLID;
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), preParams, "post")
                .then(function(data) {
                    window.open(data.DATA[0].URLS[0]);
                });
        },
        subjectModel: function(metadataId, channelid, successFn) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/website/service/subject/subject_tpl.html",
                windowClass: 'website-subject-view-window',
                backdrop: false,
                controller: "editWebsteSubjectViewCtrl",
                resolve: {
                    params: function() {
                        return {
                            metadataId: metadataId,
                            channelid: channelid,
                        };
                    }
                }
            });
            modalInstance.result.then(function(result) {
                successFn(result);
            });
        },
        ascriptionModel: function(metadataId, successFn) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/website/service/ascription/ascription_tpl.html",
                windowClass: 'website-ascription-view-window',
                backdrop: false,
                controller: "editWebsteAscriptionViewCtrl",
                resolve: {
                    params: function() {
                        return {
                            metadataId: metadataId,
                        };
                    }
                }
            });
            modalInstance.result.then(function(result) {
                successFn(result);
            });
        },
    };
}]);
