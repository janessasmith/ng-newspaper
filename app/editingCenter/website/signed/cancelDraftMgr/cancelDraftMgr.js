"use strict";
angular.module('editWebsiteCancelDraftMgrModule', []).
controller('editWebsitecancelDraftMgrCtrl', draftBoxCtrl);
draftBoxCtrl.$injector = ["$scope", "$modal", "$stateParams", "$timeout", "trsHttpService", "SweetAlert", "initSingleSelecet", "trsspliceString", "trsconfirm", "initVersionService", "editcenterRightsService", "getWebsiteNameService", "editingCenterService","globleParamsSet"];

function draftBoxCtrl($scope, $modal, $stateParams, $timeout, trsHttpService, SweetAlert, initSingleSelecet, trsspliceString, trsconfirm, initVersionService, editcenterRightsService, getWebsiteNameService, editingCenterService,globleParamsSet) {
    initStatus();
    initData();
    //下一页
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    /*跳转指定页面*/
    $scope.jumpToPage = function() {
        if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.params.CurrPage = $scope.copyCurrPage;
        requestData();
    };

    //初始化状态
    function initStatus() {
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.getPageSize()
        };
        $scope.params = {
            "serviceid": "mlf_website",
            "methodname": "queryWithdrawDoc",
            "SiteId": $stateParams.siteid,
            "ChannelId": $stateParams.channelid,
            "PageSize": $scope.page.PAGESIZE,
            "CurrPage": $scope.page.CURRPAGE
        };
        $scope.copyCurrPage  = 1;
        $scope.status = {
            btnRights: {}
        };
        $scope.selectedArray = [];
        getWebsiteNameService.getWebsiteName($stateParams.siteid).then(function(data) {
            $scope.channelName = data.SITEDESC;
        });
        $scope.siteid = $stateParams.siteid;
        $scope.websitePreviewPath = ["websiteNewsPreview", "websiteAtlasPreview"];
    }
    //初始化数据
    function initData() {
        requestData();
        initDropDown();
        editcenterRightsService.initWebsiteListBtnWithoutChn('website.draft', $stateParams.siteid).then(function(rights) {
            $scope.status.btnRights = rights;
        });
    }

    //数据请求函数
    function requestData(callback) {
        $scope.loadingPromise = trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, 'get').then(function(data) {
            if (angular.isFunction(callback)) {
                callback(data);
            } else {
                $scope.items = data.DATA;
                $scope.page = data.PAGER;
                angular.isDefined($scope.page) ? $scope.page.PAGESIZE =
                    $scope.page.PAGESIZE.toString() : $scope.page = {
                        "PAGESIZE": 0,
                        "ITEMCOUNT": 0
                    };
            }
            $scope.selectedArray = [];
        }, function(data) {
            sweetAlert('数据请求错误', data, "error");
        });
    }
    //全选
    $scope.selectAll = function() {
        $scope.selectedArray = $scope.selectedArray.length == $scope.items.length ? [] : [].concat($scope.items);
    };
    //单选
    $scope.selectDoc = function(item) {
        if ($scope.selectedArray.indexOf(item) < 0) {
            $scope.selectedArray.push(item);
        } else {
            $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
        }
    };
    //批量送审
    $scope.batchTrail = function() {
        trial(trsspliceString.spliceString($scope.selectedArray, "METADATAID", ","), trsspliceString.spliceString($scope.selectedArray, "CHNLDOCID", ","));
    };
    //单个送审
    $scope.trial = function(item) {
        trial(item.METADATAID, item.CHNLDOCID);
    };
    //送审方法
    function trial(MetaDataIds, ChannelIds) {
        trsconfirm.inputModel("送审", "送审意见（可选）", function(content) {
            var params = {
                "serviceid": "mlf_websiteoper",
                "methodname": "trialMetaDatas",
                "MetaDataIds": MetaDataIds,
                "ChnlDocIds": ChannelIds,
                "ChannelId": $stateParams.channelid,
                "Opinion": content
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get")
                .then(function(data) {
                    trsconfirm.alertType("操作成功", "", "success", false);
                    $scope.selectedArray = [];
                    requestData();
                }, function(data) {});
        });
    }
    //单个送审
    $scope.singleTrial = function(recid) {
        trsconfirm.inputModel("送审", "送审意见（可选）", function(content) {
            trialFun(recid, content);
        });
    };
    //送审方法
    function trialFun(recids, content) {
        $scope.params.serviceid = "mlf_myrelease";
        $scope.params.methodname = "trialMetaDatas";
        $scope.params.ChnlDocIds = recids;
        $scope.params.Opinion = content;
        requestData(function() {
            $scope.params.serviceid = "mlf_website";
            $scope.params.methodname = "queryWithdrawDoc";
            requestData();
        });
    }
    //单项直接签发
    $scope.immediateSinged = function(item) {
        trsconfirm.confirmModel('签发', '确认发布稿件', function() {
            directSignedFun(item.CHNLDOCID);
        });
    };
    //批量签发
    $scope.directSigned = function() {
        trsconfirm.confirmModel("签发", "确认发布稿件", function() {
            var arrayChnldocIDs = trsspliceString.spliceString($scope.selectedArray,
                "CHNLDOCID", ',');
            directSignedFun(arrayChnldocIDs);
        });
    };

    //直接签发方法
    function directSignedFun(ChnlDocIds) {
        $scope.params.serviceid = "mlf_websiteoper";
        $scope.params.methodname = "webWithdrawPublish";
        $scope.params.ObjectIds = ChnlDocIds;
        $scope.params.ChnlDocIds = ChnlDocIds;
        requestData(function() {
            $scope.params.serviceid = "mlf_website";
            $scope.params.methodname = "queryWithdrawDoc";
            trsconfirm.alertType("签发成功", "", "success", false);
            requestData();
        });
    }




    //只看我的开始
    $scope.isOnlyMine = function() {
        $scope.params.serviceid = "mlf_website";
        $scope.params.methodname = "queryWithdrawDoc";
        $scope.params.isOnlyMine = true;
        $scope.onlyMine = !$scope.onlyMine;
        if (!$scope.onlyMine) {
            delete $scope.params.isOnlyMine;
        }
        requestData();
    };
    //初始化下拉框
    function initDropDown() {
        //初始化选择日期
        $scope.timeTypeJsons = initSingleSelecet.timeType();
        $scope.timeType = angular.copy($scope.timeTypeJsons[0]);
        //初始化选择类型
        $scope.docTypeJsons = initSingleSelecet.websiteDocType();
        $scope.docType = angular.copy($scope.docTypeJsons[0]);
        //初始化搜索框边的下拉框
        $scope.iWoAll = initSingleSelecet.iWoEntire();
        $scope.iWoAllSelected = angular.copy($scope.iWoAll[0]);
    }
    //根据选择日期查询
    $scope.queryByTimeType = function() {
        $scope.params.timeType = angular.copy($scope.timeType).value;
        requestData();
    };
    //根据稿件类型查询
    $scope.queryByDocType = function() {
        $scope.params.DocType = angular.copy($scope.docType).value;
        requestData();
    };

    //提示框
    function sweetAlert(title, text, type) {
        SweetAlert.swal({
            title: title,
            text: text,
            type: type,
            closeOnConfirm: true,
            cancelButtonText: "取消"
        });
    }
    //搜索
    $scope.fullTextSearch = function() {
        var searchParams = {
            PAGESIZE: $scope.page.PAGESIZE,
            PAGEINDEX: 1,
            searchFields: [{
                searchField: $scope.iWoAllSelected.value,
                keywords: $scope.keywords
            }]
        };
        var params = {
            'serviceid': "mlf_essearch",
            'methodname': "query",
            'searchParams': searchParams
        };
        trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {});

    };
    /**
     * [showVersionTime description]展示流程版本与操作日志
     * @param  {[str]} MetaDataId [description]
     * @return {[type]}            [description]
     */
    $scope.showVersionTime = function(item) {
        editingCenterService.getVersionTime(item,false);
    };
}
