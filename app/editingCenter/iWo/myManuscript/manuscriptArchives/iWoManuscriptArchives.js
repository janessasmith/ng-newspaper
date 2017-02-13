"use strict";
/*
 created by cc 2015-11-30
 */
angular.module('iWoManuscriptArchivesModule', []).
controller('iWoManuscriptArchivesCtrl', ['$scope', '$q', '$modal', '$timeout', 'trsHttpService', 'initSingleSelecet', 'myManuscriptService', 'trsconfirm', 'initVersionService', 'iWoService', "editcenterRightsService", "trsspliceString", "editingCenterService", "storageListenerService", "globleParamsSet", "trsPrintService", function($scope, $q, $modal, $timeout, trsHttpService, initSingleSelecet, myManuscriptService, trsconfirm, initVersionService, iWoService, editcenterRightsService, trsspliceString, editingCenterService, storageListenerService, globleParamsSet, trsPrintService) {
    initStatus();
    initData();
    /**
     * [initStatus description]初始化状态函数开始
     * @return {[type]} [description] null
     */
    function initStatus() {
        $scope.page = {
            CURRPAGE: '1',
            PAGESIZE: globleParamsSet.getPageSize(),
            ITEMCOUNT: 0,
            PAGECOUNT: 1,
        };
        $scope.status = {
            params: {
                serviceid: "mlf_releaseSource",
                methodname: "queryDocRecords",
                CurrPage: $scope.page.CURRPAGE,
                PageSize: $scope.page.PAGESIZE
            },
            copyCurrPage: 1,
            isHandle: false, //是否经手稿
            isOnlyMine: false, //是否本人创建稿
            isESSearch: false, //是否通过ES检索列表
            btnRights: [],
            methodname: {
                1: "getNewsDoc",
                2: "getPicsDoc"
            },
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
        };
        $scope.data = {
            items: [],
            selectedArray: [],
            preview: iWoService.initPreviewPath(),
            printResult: []
        };
    }
    /**
     * [initData description]初始化数据开始
     * @return {[type]} [description] null
     */
    function initData() {
        requestData();
        getDropDown();
        listenStorage();
        editcenterRightsService.initIwoListBtn("iwo.docrecord").then(function(rights) {
            $scope.status.btnRights = rights;
        });
    }
    /**
     * [listenStorage description]监听本地缓存
     * @return {[promise]} [description] promise
     */
    function listenStorage() {
        storageListenerService.listenIwo(function() {
            requestData();
            storageListenerService.removeListener("iwo");
        });
    }
    /**
     * [requestData description]数据请求函数
     * @return {[type]}            [description]
     */
    function requestData() {
        var params = $scope.status.isESSearch ? getESSearchParams() : $scope.status.params;
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
            var ListItems = data.DATA;
            $scope.data.items = ListItems;
            !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = 0;
            $scope.data.selectedArray = [];
            requestListImg(ListItems).then(function(data) {
                angular.forEach(ListItems, function(value, key) {
                    value.ALLIMG = data[value.METADATAID];
                });
            });
        });
    }
    /**
     * [requestListImg description:查询列表图示]
     */
    function requestListImg(items) {
        var defer = $q.defer();
        if (!items || items.length < 1) defer.resolve([]);
        else {
            var params = {
                serviceid: "mlf_myrelease",
                methodname: "queryAllImgLogo",
                metadataids: trsspliceString.spliceString(items, "METADATAID", ",")
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                defer.resolve(data);
            });
        }
        return defer.promise;
    }
    /**
     * [getESSearchParams description]设置ES检索参数
     * @return {[json]} [description] 参数对象
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForIwoRecordDoc",
            searchParams: {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: $scope.page.CURRPAGE + "",
                searchFields: [{
                    searchField: $scope.iWoEntireSelected.value,
                    keywords: $scope.keywords ? $scope.keywords : ""
                }, {
                    searchField: "docType",
                    keywords: $scope.docTypeSelected.value
                }, {
                    searchField: "lastTimeType",
                    keywords: $scope.endTimeTypeSelected.value
                }, {
                    searchField: "isHandle",
                    keywords: $scope.status.isHandle
                }, {
                    searchField: "isOnlyMine",
                    keywords: $scope.status.isOnlyMine
                }, {
                    searchField: "_sort",
                    keywords: $scope.sortType.value
                }]
            }
        };
        esParams.searchParams = JSON.stringify(esParams.searchParams);
        return esParams;
    }

    /**
     * [selectDoc description]单选列表
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.selectDoc = function(item) {
        if ($scope.data.selectedArray.indexOf(item) < 0) {
            $scope.data.selectedArray.push(item);
        } else {
            $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
        }
        cancelBatchOperate();
    };

    /**
     * [cancelBatchOperate description]取消批量操作的样式
     * @return {[type]} [description] null
     */
    function cancelBatchOperate() {
        if ($scope.data.selectedArray.length === 0) {
            $scope.status.batchOperateBtn = {
                "hoverStatus": "",
                "clickStatus": ""
            };
        }
    }

    /**
     * [copyBuildDraft description]复制建新稿
     * @param  {[object]} item [description] 页面传入对象 
     * @return {[type]}      [description]
     */
    $scope.copyBuildDraft = function(item) {
        iWoService.copyBuildDraft([item], "docrecordCopyBuildDraft", function() {
            trsconfirm.alertType("复制建新稿成功", "", "success", false, function() {
                requestData();
            });

        });
    };
    /**
     * [batchCopyBuildDraft description]批量复制建新稿
     * @return {[type]} [description]
     */
    $scope.batchCopyBuildDraft = function() {
        $scope.status.batchOperateBtn.clickStatus = "batchCopyBuildDraft";
        iWoService.copyBuildDraft($scope.data.selectedArray, "docrecordCopyBuildDraft", function() {
            trsconfirm.alertType("复制建新稿成功", "", "success", false, function() {
                requestData();
            });
        });
    };
    /**
     * [exportDraft description]批量导出
     * @return {[type]} [description] null
     */
    $scope.exportDraft = function() {
        var params = {
            serviceid: 'mlf_exportword',
            methodname: 'exportWordFile',
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ','),
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            window.open("/wcm/app/file/read_file.jsp?FileName=" + data)
        });
    };
    /**
     * [batchOutgoing description]批量外发
     * @return {[type]} [description] null
     */
    $scope.batchOutgoing = function() {
        $scope.status.batchOperateBtn.clickStatus = "batchOutgoing";
    };

    /**
     * [selectAll description]全选列表
     * @return {[type]} [description] null
     */
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
        cancelBatchOperate();
    };

    /**
     * [pageChanged description]下一页
     * @return {[type]} [description] null
     */
    $scope.pageChanged = function() {
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    //跳转到开始
    $scope.jumpToPage = function() {
        if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.status.params.CurrPage = $scope.status.copyCurrPage;
        $scope.page.CURRPAGE = $scope.status.copyCurrPage;
        requestData();
    };
    //跳转到结束
    function getDropDown() {
        //初始化类型
        $scope.docTypeJsons = initSingleSelecet.iWoDocType();
        $scope.docTypeSelected = angular.copy($scope.docTypeJsons[0]);
        //初始化最后版本时间
        $scope.endTimeTypeJsons = initSingleSelecet.iWoOperTime();
        $scope.endTimeTypeSelected = angular.copy($scope.endTimeTypeJsons[0]);
        //初始化全部
        $scope.iWoEntireJsons = initSingleSelecet.iWoEntire();
        $scope.iWoEntireSelected = angular.copy($scope.iWoEntireJsons[0]);
        // 排序方式
        $scope.sortTypeJsons = initSingleSelecet.sortType();
        $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
    }
    /**
     * [queryByDropdown description] 筛选条件触发后请求数据
     * @param  {[type]} key   [description] 请求对象参数key
     * @param  {[type]} value [description] 请求对象值
     * @return {[type]}       [description] null
     */
    $scope.queryByDropdown = function(key, value) {
        $scope.status.params[key] = value;
        $scope.status.params.CurrPage = $scope.status.copyCurrPage = $scope.page.CURRPAGE = "1";
        if (key == 'OperTime') {
            if (value.length < 10) {
                $scope.status.params.OperTimeStart = null;
                $scope.status.params.OperTimeEnd = null;
            } else {
                $scope.status.params.OperTimeStart = $scope.data.fromdate;
                $scope.status.params.OperTimeEnd = $scope.data.untildate;
                $scope.status.params[key] = null;
            }
        }
        requestData();
    };

    //查询只看本人
    $scope.onlyMine = function() {
        $scope.status.isOnlyMine = !$scope.status.isOnlyMine;
        $scope.status.params.isOnlyMine = $scope.status.isOnlyMine;
        requestData();
    };
    //查询经手稿
    $scope.handle = function() {
        $scope.status.isHandle = !$scope.status.isHandle;
        $scope.status.params.isHandle = $scope.status.isHandle;
        requestData();
    };
    /**
     * [outSending description]外发
     * @return {[type]} [description] null
     */
    $scope.outSending = function() {
        editingCenterService.outSending("", function(result) {
            outSendingDraft(result.selectItems);
        });
    };

    function outSendingDraft(items) {
        var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
        var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ",");
        var params = {
            serviceid: "mlf_mailoutgoingOper",
            methodname: "iRecordSendEmail",
            Emails: userids,
            MetaDataIds: draftids
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType("邮件外发成功", "", "success", false, function() {
                requestData();
            });
        });
    }
    //选择单页显示个数
    $scope.selectPageNum = function() {
        $scope.status.params.PageSize = $scope.page.PAGESIZE;
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = 1;
        requestData();
    };
    /**
     * [showVersionTime description:流程版本时间与操作日志]
     * @param  {[type]} item [description:稿件对象]
     */
    $scope.showVersionTime = function(item) {
        editingCenterService.getVersionTime(item, true);
    };
    /**
     * [fullTextSearch description;全文检索]
     * @param  {[type]} ev [description:按下空格也能提交]
     */
    $scope.fullTextSearch = function(ev) {
        if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
            $scope.status.isESSearch = true;
            $scope.page.CURRPAGE = 1;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), getESSearchParams(), "post").then(function(data) {
                $scope.data.items = data.DATA;
                $scope.page = data.PAGER;
            });
        }
    };
    /**
     * [printBtn description：打印]
     */
    $scope.printBtn = function() {
        angular.forEach($scope.data.selectedArray, function(value, key) {
            requestPrintVersion(value).then(function(data) {
                requestPrintData(value, data);
            });
        });
    };
    /**
     * [requestPrintVersion description：打印请求流程]
     */
    function requestPrintVersion(item) {
        var deferred = $q.defer();
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), {
            serviceid: "mlf_metadatalog",
            methodname: "query",
            MetaDataId: item.METADATAID
        }, 'get').then(function(data) {
            deferred.resolve(data.DATA);
        });
        return deferred.promise;
    }
    /**
     * [requestPrintVersion description：打印请求详情]
     */
    function requestPrintData(item, version) {
        var params = {
            "serviceid": "mlf_myrelease",
            "methodname": $scope.status.methodname[item.DOCTYPEID],
            "MetaDataId": item.METADATAID
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            var result = data;
            data.VERSION = version;
            data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
            $scope.data.printResult.push(result);
            if ($scope.data.printResult.length == $scope.data.selectedArray.length) {
                trsPrintService.trsIwoPrintDocument($scope.data.printResult);
                $scope.data.printResult = [];
            }
        });
    }
}]);
