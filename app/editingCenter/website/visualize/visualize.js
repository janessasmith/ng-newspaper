/*create by ma.rongqin 2016-4-11*/
"use strict";
angular.module("websiteSignedVisualizeModule", [])
    .controller("websiteSignedVisualizeCtrl", ["$scope", "$q", "$modal", "$stateParams", "$state", "$window", "editIsLock", "localStorageService", "trsHttpService", "SweetAlert", "initSingleSelecet", "editingCenterService", "trsspliceString", "trsconfirm", "websiteService", "initVersionService", "editcenterRightsService", "storageListenerService", "globleParamsSet", "trsPrintService", "getWebsiteNameService", function($scope, $q, $modal, $stateParams, $state, $window, editIsLock, localStorageService, trsHttpService, SweetAlert, initSingleSelecet, editingCenterService, trsspliceString, trsconfirm, websiteService, initVersionService, editcenterRightsService, storageListenerService, globleParamsSet, trsPrintService, getWebsiteNameService) {
        initStatus();
        initData();
        //初始化状态
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": globleParamsSet.getPageSize(),
                "ITEMCOUNT": 0,
                "PAGECOUNT": 0
            };
            $scope.params = {
                "serviceid": "mlf_websiteconfig",
                "methodname": "queryZTTemplates",
                "HostId": $stateParams.channelid,
                "HostType": "101"
            };
            $scope.status = {
                'copyCurrPage': 1,
                'batchOperateBtn': {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
            };
            $scope.data = {
                'id': {
                    channelid: $stateParams.channelid,
                    siteid: $stateParams.siteid
                },
                selectDoc: ""
            };
        }
        //初始化数据
        function initData() {
            requestData();
            requestSiteInfo();
        }
        //请求数据
        function requestData() {
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
                $scope.data.items = data.DATA;
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
                requestCurrTemp();
            });
        }
        //请求站点信息
        function requestSiteInfo() {
            getWebsiteNameService.getWebsiteName($stateParams.siteid).then(function(data) {
                $scope.status.channelName = data.SITEDESC;
            });
        }
        //请求当前绑定的可视化模板
        function requestCurrTemp() {
            var params = {
                serviceid: "mlf_website",
                methodname: "getZTTemplateByObj",
                ObjectType: "101",
                ObjectId: $scope.data.id.channelid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.selectDoc = data;
            });
        }
        /**
         * [pageChanged description] 下一页
         */
        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.status.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        /**
         * [jumpToPage description] 跳转到指定页面
         */
        $scope.jumpToPage = function() {
            if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.params.CurrPage = $scope.status.copyCurrPage;
            requestData();
        };
        /**
         * [selectDoc description] 单选
         */
        $scope.selectDoc = function(item) {
            $scope.data.selectDoc = item
        };
        /**
         * [visualizeNew description] 可视化新建
         */
        $scope.visualizeNew = function() {
            var hostid = $scope.data.id.channelid;
            window.open('/wcm/app/special/add_special.jsp?hosttype=101&hostid=' + hostid + '&objectid=0&_FROMCB_=1');
        };
        /**
         * [visualizeEdit description] 可视化编辑
         */
        $scope.visualizeEdit = function(item) {
            var hostid = $scope.data.id.channelid;
            window.open('/wcm/app/special/design.jsp?templateId=' + item.TEMPID + '&HostType=101&HostId=' + hostid + '&AdvanceManageStyle=1&hide=true');
        };
        /**
         * [configTemp description] 配置绑定可视化模板
         * @params item [object] 模板条目
         */
        $scope.configBinding = function(item) {
            if (item.TEMPID == $scope.data.selectDoc.TEMPID) {
                $scope.data.selectDoc = "";
                configTemp();
            } else {
                $scope.data.selectDoc = item;
                configTemp(item.TEMPID);
            }
        };
        /**
         * [configTemp description] 配置可视化模板
         * @params id [string] 模板ID
         */
        function configTemp(id) {
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: "boundZTTemplates",
                ObjectId: $scope.data.id.channelid,
                TempId: {
                    'CHNLTEMPID': angular.isDefined(id) ? id : "0",
                    'OTHERTEMPID': '0',
                    'DOCTEMPID': '0'
                }
            }
            params.TempId = JSON.stringify(params.TempId);
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function() {
                trsconfirm.alertType(angular.isDefined(id) ? "绑定可视化模板成功" : "解除绑定可视化模板成功", "", "success", false, function() {
                    requestData();
                })
            })
        }
    }]);
