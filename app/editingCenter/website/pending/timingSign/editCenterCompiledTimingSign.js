'use strict';
angular.module('editingCenterCompiledPendingTimingSignModule', [])
    .controller('editCompilePendingTimingSignController', ['$scope', '$q', "trsHttpService", "$stateParams", '$modal', 'trsconfirm', 'trsspliceString', 'SweetAlert', '$timeout', 'initSingleSelecet', 'initVersionService', 'editcenterRightsService', 'getWebsiteNameService', 'editingCenterService', 'globleParamsSet', function($scope, $q, trsHttpService, $stateParams, $modal, trsconfirm, trsspliceString, SweetAlert, $timeout, initSingleSelecet, initVersionService, editcenterRightsService, getWebsiteNameService, editingCenterService, globleParamsSet) {
        initStatus();
        initData();
        //初始化状态
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": globleParamsSet.getPageSize(),
            };
            $scope.params = {
                "serviceid": "mlf_website",
                "methodname": "queryTimingPublishDoc",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "SiteId": $stateParams.siteid,
                "timeType": "",
                "DocId": ""
            };
            $scope.status = {
                preview: {
                    1: "websiteNewsPreview",
                    2: "websiteAtlasPreview"
                },
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                siteid: $stateParams.siteid,
                channelid: $stateParams.channelid,
                copyCurrPage: 1,
                isESSearch: false,
            };
            $scope.data = {
                selectedArray: []
            };
        }
        //初始化数据
        function initData() {
            requestData();
            initDropDown();
            editcenterRightsService.initWebsiteListBtnWithoutChn('website.signtime', $stateParams.siteid).then(function(rights) {
                $scope.status.btnRights = rights;
            });
            getWebsiteNameService.getWebsiteName($stateParams.siteid).then(function(data) {
                $scope.data.channelName = data.SITEDESC;
            });
        }
        /**
         * [initDropDown description]初始化各类下拉框
         * @return {[type]} [description]
         */
        function initDropDown() {
            //初始化选择日期
            $scope.data.timeTypeJsons = initSingleSelecet.timeType();
            $scope.data.timeType = angular.copy($scope.data.timeTypeJsons[0]);
            //初始化选择类型
            $scope.data.docTypeJsons = initSingleSelecet.websiteDocType();
            $scope.data.docType = angular.copy($scope.data.docTypeJsons[0]);
            //初始化搜索框边的下拉框
            $scope.data.iWoEntireJsons = initSingleSelecet.iWoEntire();
            $scope.data.iWoEntire = angular.copy($scope.data.iWoEntireJsons[0]);
            // 排序方式
            $scope.sortTypeJsons = initSingleSelecet.sortType();
            $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
        }
        /**
         * [requestData description]数据请求方法
         * @return {[type]} [description]null
         */
        function requestData() {
            var deferred = $q.defer();
            var params = $scope.status.isESSearch ? getESSearchParams() : $scope.params;
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.items = data.DATA;
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
                $scope.data.selectedArray = [];
                deferred.resolve(data);
            });
            return deferred.promise;
        }
        //全选
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length === $scope.items.length ? [] : [].concat($scope.items);
        };
        //单选
        $scope.selectDoc = function(item) {
            if ($scope.data.selectedArray.indexOf(item) < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
            }
        };
        //下一页
        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.status.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        //跳转到
        $scope.jumpToPage = function() {
            if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.params.CurrPage = $scope.status.copyCurrPage;
            $scope.page.CURRPAGE = $scope.status.copyCurrPage;
            requestData();
        };
        /**
         * [selectPageNum description]选择单页分页条数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            $scope.params.CurrPage = $scope.page.PAGESIZE;
            $scope.params.PageSize = $scope.page.PAGESIZE;
            $scope.status.copyCurrPage = 1;
            requestData();
        };
        //多项取消定时签发
        $scope.restoreTime = function() {
            trsconfirm.confirmModel('撤销定时签发', '确认取消定时签发', function() {
                var arrayMetaIds = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ',');
                var arrayChnldocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ',');
                cancelTimeSign(arrayChnldocIds, arrayMetaIds);
            });
        };
        //单项取消定时签发
        $scope.singleCancelTimeSign = function(item) {
            trsconfirm.confirmModel('撤销定时签发', '确认取消定时签发', function() {
                cancelTimeSign(item.CHNLDOCID, item.METADATAID);
            });
        };
        //多项改变定时签发
        $scope.changeTimeSinged = function() {
            timeSinged($scope.data.selectedArray);
        };
        //单项修改定时签发
        $scope.singleChangeTimeSinged = function(item) {
            timeSinged([item]);
        };
        //只看我的开始
        $scope.isOnlyMine = function() {
            $scope.params.methodname = "queryTimingPublishDoc";
            $scope.params.serviceid = "mlf_website";
            $scope.params.isOnlyMine = true;
            $scope.onlyMine = !$scope.onlyMine;
            if (!$scope.onlyMine) {
                delete $scope.params.isOnlyMine;
            }
            requestData();
        };
        //只看我的结束
        //取消定时签发函数
        function cancelTimeSign(ChnlDocIds, MetaDataIds) {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "webRepealTimingPublish",
                ObjectIds: ChnlDocIds,
                ChnlDocIds: ChnlDocIds,
                MetaDataIds: MetaDataIds,
                ScheduleTime: ""
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                requestData();
            });
        }
        /**
         * [timeSinged description]修改定时签发
         * @return {[type]} [description]null
         */
        function timeSinged(item) {
            var params = {
                selectedArray: item,
                isNewDraft: false,
                methodname: "webChangeTimingPublish"
            };
            editingCenterService.draftTimeSinged(params).then(function(result) {
                requestData().then(function(data) {
                    trsconfirm.alertType("修改定时签发成功", "稿件将在" + result + "签发", "success", false, function() {
                        requestData();
                    });
                });
            });
        }
        /**
         * [queryByDropdown description]根据类型查询稿件
         * @param  {[str]} type  [description]查询类型
         * @param  {[str]} value [description]查询参数
         * @return {[type]}       [description]null
         */
        $scope.queryByDropdown = function(type, value) {
            $scope.params[type] = value;
            $scope.status.copyCurrPage = $scope.params.CurrPage = $scope.page.CURRPAGE = 1;
            if (type == 'timeType') {
                if (value.length < 10) {
                    $scope.params.OperTimeStart = null;
                    $scope.params.OperTimeEnd = null;
                } else {
                    $scope.params.OperTimeStart = $scope.data.fromdate;
                    $scope.params.OperTimeEnd = $scope.data.untildate;
                    $scope.params[type] = null;
                }
            }
            requestData();
        };
        /**
         * [showVersionTime description]展示流程版本与操作日志
         * @param  {[str]} MetaDataId [description]
         * @return {[type]}            [description]
         */
        $scope.showVersionTime = function(item) {
            editingCenterService.getVersionTime(item, false);
        };

        function getESSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForWebSiteTimingPublishDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: $scope.data.iWoEntire.value,
                        keywords: $scope.keywords ? $scope.keywords : ""
                    }, {
                        searchField: "docType",
                        keywords: $scope.data.docType.value
                    }, {
                        searchField: "CrTime",
                        keywords: $scope.data.timeType.value
                    }, {
                        searchField: "isOnlyMine",
                        keywords: $scope.onlyMine
                    }, {
                        searchField: "siteid",
                        keywords: $stateParams.siteid
                    }, {
                        searchField: "_sort",
                        keywords: $scope.sortType.value
                    }]
                }
            };
            return esParams;
        }
        //搜索
        $scope.fullTextSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                if ($scope.data.iWoEntire.value == "DocID") {
                    $scope.status.isESSearch = false;
                    $scope.params.DocId = $scope.keywords;
                } else {
                    $scope.status.isESSearch = true;
                }
                $scope.page.CURRPAGE = 1;
                requestData();
            }
        };
    }]);
