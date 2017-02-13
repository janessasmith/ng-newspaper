"use strict";
angular.module('iWoPrivilegeDraftModule', []).
controller('iWoPrivilegeDraftCtrl', privilegeDraftCtrl);
privilegeDraftCtrl.$injector = ["$scope", "$timeout", "$modal", "trsHttpService", "trsconfirm", "initSingleSelecet", "trsspliceString", "editcenterRightsService", "iWoService", "editingCenterService", "initVersionService", "$q", "storageListenerService", "globleParamsSet"];

function privilegeDraftCtrl($scope, $timeout, $modal, trsHttpService, trsconfirm, initSingleSelecet, trsspliceString, editcenterRightsService, iWoService, editingCenterService, initVersionService, $q, storageListenerService, globleParamsSet) {
    initStatus();
    initData();
    /**
     * [pageChanged description:下一页]
     */
    $scope.pageChanged = function() {
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    /**
     * [jumpToPage description:跳转指定页面]
     */
    $scope.jumpToPage = function() {
        if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.status.params.CurrPage = $scope.status.copyCurrPage;
        $scope.page.CURRPAGE = $scope.status.copyCurrPage;
        requestData();
    };
    /**
     * [exportDraft description:导出稿件]
     */
    $scope.exportDraft = function() {
        var params = {
            serviceid: 'mlf_exportword',
            methodname: 'exportWordFile',
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
        });
    };
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
     * [initStatus description:初始化状态]
     */
    function initStatus() {
        $scope.data = {
            items: [],
            selectedArray: [] //已选
        };
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.getPageSize(),
            "ITEMCOUNT": 0,
            "PAGECOUNT": 1
        };
        $scope.status = {
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
            copyCurrPage: 1,
            icon: {
                noVideo: '0',
                noAudio: '0',
                noPic: '0'
            },
            btnRights: [], //权限按钮
            params: {
                "serviceid": "mlf_releasesource",
                "methodname": "querySpecialRightDoc",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "OperTime": ""
            },
            isESSearch: false //是否通过ES检索列表
        };
    }
    /**
     * [initData description:初始化数据]
     */
    function initData() {
        editcenterRightsService.initIwoListBtn("iwo.specialrightfordoc").then(function(rights) {
            $scope.status.btnRights = rights;
        });
        listenStorage();
        requestData();
        initDropDown();
    }
    /**
     * [requestData description:数据请求函数]
     */
    function requestData() {
        var params = $scope.status.isESSearch ? getESSearchParams() : $scope.status.params;
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
            var ListItems = data.DATA;
            $scope.data.items = ListItems;
            !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
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
     * [selectAll description:全选]
     */
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
        cancelBatchOperate();
    };
    /**
     * [selectDoc 单选]
     * @param  {[type]} item [description：单个对象] 
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
     * [cancelBatchOperate description：取消批量操作的样式]
     */
    function cancelBatchOperate() {
        if ($scope.data.selectedArray.length === 0) {
            $scope.status.batchOperateBtn = {
                "hoverStatus": "",
                "clickStatus": ""
            };
        }
    }
    //批量调用
    /**
     * [invoke description：批量调用]
     */
    $scope.invoke = function() {
        $scope.status.batchOperateBtn.clickStatus = "invoke";
        var ChnlDocIdsArray = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
        var MetaDataIdsArray = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
        goInvoke(ChnlDocIdsArray, ChnlDocIdsArray);
    };
    /**
     * [singleInvoke description：单个调用]
     */
    $scope.singleInvoke = function(item) {
        $scope.data.selectedArray = [];
        $scope.data.selectedArray.push(item);
        goInvoke(item.CHNLDOCID, item.METADATAID);
    };
    /**
     * [goInvoke description：调用函数]
     */
    function goInvoke(ChnlDocIdsArray, MetaDataIdsArray) {
        trsconfirm.confirmModel('调用', "是否取" + "<span style='color:red'>" + $scope.data.selectedArray.length + "</span>" + '篇稿件到已收稿库', function() {
            /*$scope.status.params.serviceid = "mlf_myrelease";
            $scope.status.params.methodname = "specialCallDocs";
            $scope.status.params.ChnlDocIds = ChnlDocIdsArray;
            $scope.status.params.MetaDataIds = MetaDataIdsArray;*/
            var params = {
                serviceid: "mlf_myrelease",
                methodname: "specialCallDocs",
                ChnlDocIds: ChnlDocIdsArray,
                MetaDataIds: MetaDataIdsArray
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    trsconfirm.alertType("调用成功", "", "success", false, function() {
                        requestData();
                    });
                });
        });
    }

    /**
     * [more description:更多]
     */
    $scope.more = function() {
        $scope.status.batchOperateBtn.clickStatus = "more";
    };
    /**
     * [initDropDown description:初始化下拉框]
     */
    function initDropDown() {
        //初始化选择日期
        $scope.timeTypeJsons = initSingleSelecet.iWoOperTime();
        $scope.timeType = angular.copy($scope.timeTypeJsons[0]);

        $scope.iWoDocStatusName = initSingleSelecet.iWoDocType();
        $scope.iWoDocStatusSelected = angular.copy($scope.iWoDocStatusName[0]);

        $scope.iWoAll = initSingleSelecet.iWoEntire();
        $scope.iWoAllSelected = angular.copy($scope.iWoAll[0]);
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
    /**
     * [selectPageNum description:选择单页显示个数]
     */
    $scope.selectPageNum = function() {
        $scope.status.copyCurrPage = 1;
        $scope.status.params.PageSize = $scope.page.PAGESIZE;
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        requestData();
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
     * [getESSearchParams description]设置ES检索参数
     * @return {[json]} [description] 参数对象
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForIwoSpecialDoc",
            searchParams: {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: $scope.page.CURRPAGE + "",
                searchFields: [{
                    searchField: $scope.iWoAllSelected.value,
                    keywords: $scope.keywords ? $scope.keywords : ""
                }, {
                    searchField: "docType",
                    keywords: $scope.iWoDocStatusSelected.value
                }, {
                    searchField: "lastTimeType",
                    keywords: $scope.timeType.value
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
     * [showVersionTime description:流程版本时间与操作日志]
     * @param  {[type]} item [description:稿件对象]
     */
    $scope.showVersionTime = function(item) {
        editingCenterService.getVersionTime(item, true);
    };
    /**
     * [outSending description：外发]
     */
    $scope.outSending = function() {
        editingCenterService.outSending("", function(result) {
            outSendingDraft(result.selectItems);
        });
    };
    /**
     * [outSendingDraft description：外发]
     */
    function outSendingDraft(items) {
        var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
        var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ",");
        var params = {
            serviceid: "mlf_mailoutgoingOper",
            methodname: "iPrivilegeSendEmail",
            Emails: userids,
            MetaDataIds: draftids
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType("邮件外发成功", "", "success", false, function() {
                requestData();
            });
        });
    }
}
