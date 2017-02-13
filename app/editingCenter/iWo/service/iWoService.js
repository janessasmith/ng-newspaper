/**
 *  Module
 *
 * Description :iwo 公共服务
 ** Author:wang.jiang 2016-2-21
 */

"use strict";
angular.module('iWoServiceModule', []).
factory('iWoService', ["$q", "$modal", "trsHttpService", function($q, $modal, trsHttpService) {

    return {
        getPicsDoc: function(metadataid) {
            var params = {
                "serviceid": "mlf_myrelease",
                "methodname": "getPicsDoc",
                "MetaDataId": metadataid
            };
            return trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get");
        },
        initData: function() {
            return trsHttpService.httpServer("./editingCenter/properties/metadataEnum.json", {}, "get")
        },
        submit: function(list) {
            list.serviceid = "mlf_myrelease";
            list.methodname = "savePicsDoc";
            return trsHttpService.httpServer("/wcm/mlfcenter.do",
                list, "post");
        },
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
        /**
         * [copyBuildDraft description] 复制建新稿1
         * @param  {[type]} array      [description] 对象集合
         * @param  {[type]} methodname [description] 方法名
         * @param  {[type]} success    [description] 是否回调
         * @return {[type]}            [description]
         */
        copyBuildDraft: function(array, methodname, success) {
            var deferred = $q.defer();
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/iWo/service/copyBuildDraft/copyBuildDraft_tpl.html",
                windowClass: "copyBuildDraftMain",
                backdrop: false,
                controller: "copyBuildDraftCtrl",
                resolve: {
                    array: function() {
                        return array;
                    },
                    methodname: function() {
                        return methodname;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                if (result === "success") {
                    success();
                }
            });
        },
        /**
         * [initEditPath description] 初始化编辑页的路由
         * @return {[object]} [description] 1：新闻编辑页；2：图集编辑页
         */
        initEditPath: function() {
            var editPath = {
                1: "iwonews",
                2: "iwoatlas"
            };
            return editPath;
        },
        /**
         * [initPreviewPath description] 初始化预览页路由
         * @return {[object]} [description] 1：新闻预览页；2：图集预览页
         */
        initPreviewPath: function() {
            var previewPath = {
                1: 'iWoNewsPreview',
                2: 'iWoAtlasPreview'
            };
            return previewPath;
        }
    };
}]);
