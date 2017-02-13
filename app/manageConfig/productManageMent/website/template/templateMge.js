/*
    Create by you  2015-12-28
*/
"use strict";
angular.module("productManageMentWebsiteTemplateModule", ['websiteTemplateServiceCtrlModule'])
    .controller("productManageMentWebsiteTemplateCtrl", ['$scope', "$q", "trsHttpService", "$stateParams", '$modal', 'trsconfirm', 'trsspliceString', 'SweetAlert', '$timeout', 'initSingleSelecet', 'initVersionService', 'initManageConSelectedService', 'trsResponseHandle', 'productMangageMentWebsiteService', function($scope, $q, trsHttpService, $stateParams, $modal, trsconfirm, trsspliceString, SweetAlert, $timeout, initSingleSelecet, initVersionService, initManageConSelectedService, trsResponseHandle, productMangageMentWebsiteService) {
        initStatus();
        initData();
        /**
         * [getChnlRights description]获取模板权限
         * @return {[type]} [description] null
         */
        function getTemplateRights() {
            if ($scope.status.isSite) {
                productMangageMentWebsiteService.getRight($stateParams.site, "", "websetsite.template").then(function(data) {
                    $scope.status.right = data;
                });
            } else {
                productMangageMentWebsiteService.getRight("", $stateParams.parentchnl, "websetchannel.template").then(function(data) {
                    $scope.status.right = data;
                });
            }
        }
        /**
         * [selectAll description]全选
         * @return {[type]} [description] null
         */
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : []
                .concat($scope.data.items);
        };
        /**
         * [selectDoc description]单选
         * @return {[type]} [description] null
         */
        $scope.selectDoc = function(item) {
            var index = $scope.data.selectedArray.indexOf(item);
            if (index < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice(index, 1);
            }
        };
        /**
         * [pageChanged description]翻页
         * @return {[type]} [description] null
         */
        $scope.pageChanged = function() {
            $scope.status.params.CurrPage = $scope.page.CURRPAGE;
            $scope.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        /**
         * [jumpToPage description]到指定页
         * @return {[type]} [description] null
         */
        $scope.jumpToPage = function() {
            if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.status.params.CurrPage = $scope.copyCurrPage;
            $scope.page.CURRPAGE = $scope.copyCurrPage;
            requestData();
        };
        /**
         * [selectPageNum description]单页选择页数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            $scope.status.params.CurrPage = $scope.page.CURRPAGE;
            $scope.status.params.PageSize = $scope.page.PAGESIZE;
            $scope.copyCurrPage = 1;
            requestData();
        };

        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 20
            };
            $scope.status = {
                isSite: angular.isDefined($stateParams.channel) ? false : true,
                btnRights: {},
                params: {
                    "serviceid": "mlf_websiteconfig",
                    "methodname": "queryTemplates",
                    "CurrPage": $scope.page.CURRPAGE,
                    "PageSize": $scope.page.PAGESIZE,
                    "isRecycle": "0"
                },
                visualiTemp: 1
            };
            var hostId, hostType;
            if ($scope.status.isSite) {
                hostId = $stateParams.site;
                hostType = "103";
            } else {
                hostId = $stateParams.channel;
                hostType = "101";
            }
            $scope.status.params.HOSTID = hostId;
            $scope.status.params.HOSTTYPE = hostType;
            $scope.data = {
                items: []
            };
            getTemplateRights();
            $scope.copyCurrPage = 1;
        }
        // $scope.jumpToPage = function() {
        //     if ($scope.jumpToPageNum > $scope.page.PAGECOUNT) {
        //         $scope.page.CURRPAGE = $scope.page.PAGECOUNT;
        //         $scope.jumpToPageNum = $scope.page.CURRPAGE;
        //     }
        //     $scope.status.params.CurrPage = $scope.jumpToPageNum;
        //     requestData();
        // };
        /**
         * [fullTextSearch description]检索
         * @return {[type]} [description] null
         */
        $scope.fullTextSearch = function(ev) {
            $scope.status.params.CurrPage = "1";
            requestData();
        };
        /**
         * [queryByDropdown description]根据模板类型查询
         * @return {[type]} [description] null
         */
        $scope.queryByDropdown = function(key, value) {
            $scope.status.params[key] = value;
            $scope.status.params.CurrPage = "1";
            requestData();
        };
        /**
         * [newTemplate description]新建模板
         * @return {[type]} [description] null
         */
        $scope.newTemplate = function() {
            createOrEditTemplate();
        };
        /**
         * [editTemplate description]编辑模板
         * @return {[type]} [description] null
         */
        $scope.editTemplate = function(item) {
            if ($scope.status.params.isRecycle == '-1') return;
            if (item.VISUAL != 1) {
                createOrEditTemplate(item);
            } else {
                window.open('/wcm/app/special/design.jsp?templateId=' + item.TEMPID + '&HostType=101&HostId=' + $stateParams.channel + '&AdvanceManageStyle=1&hide=true')
            }

        };
        /**
         * [exportSelectedTemplate description]导出选中模板
         * @return {[type]} [description] null
         */
        $scope.exportSelectedTemplate = function() {
            if (!isSelected()) {
                return;
            }
            var ObjectIds = trsspliceString.spliceString($scope.data.selectedArray, 'TEMPID', ',');
            //window.open(trsHttpService.getWCMRootUrl() + "?serviceid=mlf_websiteconfig&methodname=export&HostType=" + ($scope.status.isSite ? "103" : "101") + "&HostId=" + ($scope.status.isSite ? $scope.status.params.SiteId : $scope.status.params.ChannelId) + "&ObjectIds=" + ObjectIds + "&ExportAll=false");
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: "export",
                HostType: $scope.status.isSite ? "103" : "101",
                HostId: $scope.status.isSite ? $stateParams.site : $stateParams.channel,
                ObjectIds: ObjectIds,
                ExportAll: false
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    window.open("/wcm/file/read_file.jsp?&FileName=" + data);
                    $scope.data.selectedArray = [];
                });
            //window.open(trsHttpService.getWCMRootUrl() + "?serviceid=mlf_websiteconfig&methodname=export&HostType=" + ($scope.status.isSite ? "103" : "101") + "&HostId=" + ($scope.status.isSite ? $scope.status.params.SiteId : $scope.status.params.ChannelId) + "&ExportAll=true");
        };
        /**
         * [exportSelectedTemplate description]导出选中模板
         * @return {[type]} [description] null
         */
        $scope.exportAllTemplate = function() {
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: "export",
                HostType: $scope.status.isSite ? "103" : "101",
                HostId: $scope.status.isSite ? $stateParams.site : $stateParams.channel,
                ExportAll: true
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    window.open("/wcm/file/read_file.jsp?DownName=" + data + "&FileName=" + data);
                });
            //window.open(trsHttpService.getWCMRootUrl() + "?serviceid=mlf_websiteconfig&methodname=export&HostType=" + ($scope.status.isSite ? "103" : "101") + "&HostId=" + ($scope.status.isSite ? $scope.status.params.SiteId : $scope.status.params.ChannelId) + "&ExportAll=true");
        };
        /**
         * [syncTemplate description]同步模板
         * @return {[type]} [description] null
         */
        $scope.syncTemplate = function() {
            if (!isSelected()) {
                return;
            }
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: "redistributeAppendixes",
                HostType: $scope.status.isSite ? "103" : "101",
                HostId: $scope.status.isSite ? $stateParams.site : $stateParams.channel,
                ObjectIds: trsspliceString.spliceString($scope.data.selectedArray,
                    "TEMPID", ',')
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/template/template/syncTemplate_tpl.html",
                    scope: $scope,
                    windowClass: 'man_produ_importTemplate',
                    backdrop: false,
                    resolve: {
                        data: function() {
                            return data;
                        }
                    },
                    controller: "websiteTemplateSyncTemplateCtrl",
                });
                modalInstance.result.then(function(result) {
                    $scope.data.selectedArray = [];
                });
            });
        };
        /**
         * [visualizeNew description]可视化新建
         * @return {[type]} [description] null
         */
        $scope.visualizeNew = function() {
            var hostid = $stateParams.channel;
            window.open('/wcm/app/special/add_special.jsp?hosttype=101&hostid=' + $stateParams.channel + '&objectid=0&_FROMCB_=1');
        };
        /**
         * [checkTemplate description]查看模板
         * @return {[type]} [description] null
         */
        $scope.checkTemplate = function(item) {
            window.open('/wcm/app/template/template_preview.jsp?TempId=' + item.TEMPID);
        };
        /**
         * [importTemplate description]同步模板
         * @return {[type]} [description] null
         */
        $scope.importTemplate = function() {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/website/template/template/importTemplate_tpl.html",
                scope: $scope,
                windowClass: 'man_produ_importTemplate',
                backdrop: false,
                resolve: {
                    host: function() {
                        return { hostType: $scope.status.isSite ? "103" : "101", hostId: $scope.status.isSite ? $stateParams.site : $stateParams.channel };
                    }
                },
                controller: "websiteTemplateImportTemplateCtrl",
            });
            modalInstance.result.then(function(result) {
                initData();
            });
        };
        /**
         * [deleteTemplate description]删除模板
         * @return {[type]} [description] null
         */
        $scope.deleteTemplate = function() {
            if (!isSelected()) {
                return;
            }
            trsconfirm.confirmModel("删除", "您是否确认删除！", function() {
                var storeArray = trsspliceString.spliceString($scope.selectedArray, 'TEMPID', ',');
                var params = {
                    serviceid: "mlf_websiteconfig",
                    methodname: "removeTemplate",
                    TempIds: trsspliceString.spliceString($scope.data.selectedArray,
                        "TEMPID", ',')
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        initData();
                    });
            });
        };
        /**
         * [switchList description]切换回收站和普通列表
         * @return {[type]} [description] null
         */
        $scope.switchList = function() {
            $scope.status.params.isRecycle = $scope.status.params.isRecycle === "0" ? "-1" : "0";
            $scope.status.params.FILTERTYPE = null;
            $scope.status.params.CurrPage = 1;
            initData();
        };
        /**
         * [restoreTemplate description]还原模板
         * @return {[type]} [description] null
         */
        $scope.restoreTemplate = function() {
            if (!isSelected()) {
                return;
            }
            trsconfirm.confirmModel("还原", "您是否确认还原选中模板？", function() {
                var storeArray = trsspliceString.spliceString($scope.selectedArray, 'TEMPID', ',');
                var params = {
                    serviceid: "mlf_websiteconfig",
                    methodname: "restoreTemplateRecycle",
                    TempIds: trsspliceString.spliceString($scope.data.selectedArray,
                        "TEMPID", ',')
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        initData();
                    });
            });
        };
        $scope.thoroughDeleteTemplate = function() {
            if (!isSelected()) {
                return;
            }
            trsconfirm.confirmModel("删除", "您是否确认彻底删除选中模板?", function() {
                var params = {
                    serviceid: "mlf_websiteconfig",
                    methodname: "deleteTemplateRecycle",
                    TempIds: trsspliceString.spliceString($scope.data.selectedArray, 'TEMPID', ',')
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function() {
                        initData();
                    });
            });
        };

        function initData() {
            dropList();
            requestData();
        }

        function requestData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.params, 'post').then(function(data) {
                $scope.data.items = data.DATA;
                if (!!data.PAGER) $scope.page = data.PAGER;
                $scope.data.selectedArray = [];
            });
        }

        function dropList() {
            //初始化模板类型
            $scope.data.tempTypeArray = initManageConSelectedService.websiteTempType();
            $scope.data.selectedTempType = angular.copy($scope.data.tempTypeArray[0]);
        }

        function createOrEditTemplate(item) {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/website/template/template/createOrEditTemplate_tpl.html",
                // scope: $scope,
                windowClass: 'man_produ_createNewTemplate',
                backdrop: false,
                resolve: {
                    item: function() {
                        return item;
                    },
                    host: function() {
                        return {
                            hostId: $scope.status.isSite ? $stateParams.site : $stateParams.channel,
                            hostType: $scope.status.isSite ? "103" : "101"
                        };
                    }
                },
                controller: "websiteTemplatecreateOrEditTemplateCtrl"
            });
            modalInstance.result.then(function(data) {
                if (data === "success") {
                    initData();
                }
            });
        }
        /**
         * [isSelected description]是否选择了模板
         * @return {[type]} [description] boolean
         */
        function isSelected() {
            var flag = false;
            $scope.data.selectedArray.length === 0 ? trsconfirm.alertType("请先选择模板", "请先选择模板", "info", false) : flag = true;
            return flag;
        }
    }]);
