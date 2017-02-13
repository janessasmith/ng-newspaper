'use strict';
/**
    created by cc 2016-07-16
 */
angular.module('editingCenterCompiledTimingSignModule', [])
    .controller('editCompileTimingSignController', ['$scope', "$q", "trsHttpService", "$stateParams", '$modal', 'trsconfirm', 'trsspliceString', '$timeout', 'initSingleSelecet', 'editingCenterService', "globleParamsSet","editcenterRightsService",function($scope, $q, trsHttpService, $stateParams, $modal, trsconfirm, trsspliceString, $timeout, initSingleSelecet, editingCenterService, globleParamsSet,editcenterRightsService) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化状态
         * @return {[type]} [description]
         */
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": globleParamsSet.getPageSize(),
            };
            $scope.params = {
                "serviceid": "mlf_appmetadata",
                "methodname": "queryTimingPubDoc",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "SiteId": $stateParams.siteid
            };
            $scope.data = {
                selectedArray: [],
                items: [],
                copyCurrPage: 1,
            };
            $scope.status = {
                onlyMine: false,
                isESSearch: false,
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                siteId: $stateParams.siteid,
            };
        }
        /**
         * [initData description]初始化数据
         * @return {[type]} [description]
         */
        function initData() {
            requestData();
            initDropDown();
            editcenterRightsService.initAppListBtnWithoutChn("appsite.signtime", $stateParams.siteid).then(function(data) {
                $scope.status.btnRights = data;
            });
        }
        /**
         * [requestData description]请求数据
         * @return {[type]} [description]
         */
        function requestData() {
            var deffered = $q.defer();
            var params = $scope.status.isESSearch ? getESSearchParams() : $scope.params;
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
                $scope.data.items = data.DATA;
                $scope.data.selectedArray = [];
                deffered.resolve(data);
            });
            return deffered.promise;
        }
        /**
         * [getESSearchParams description]设置ES检索参数
         * @return {[json]} [description] 参数对象
         */
        function getESSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForAppTimingPublishDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: $scope.data.selectedClassify.value,
                        keywords: $scope.keywords ? $scope.keywords : ""
                    }, {
                        searchField: "docType",
                        keywords: $scope.data.selectedDocType.value
                    }, {
                        searchField: "timeType",
                        keywords: $scope.data.selectedTimeType.value
                    }, {
                        searchField: "isOnlyMine",
                        keywords: $scope.status.onlyMine
                    }, {
                        searchField: "siteid",
                        keywords: $stateParams.siteid
                    }, {
                        searchField: "_sort",
                        keywords: $scope.data.sortType.value
                    }]
                }
            };
            esParams.searchParams = JSON.stringify(esParams.searchParams);
            return esParams;
        }
        /**
         * [initDropDown description]初始化下拉框
         * @return {[type]} [description]
         */
        function initDropDown() {
            $scope.data.docTypeJsons = initSingleSelecet.websiteDocType();
            $scope.data.selectedDocType = angular.copy($scope.data.docTypeJsons[0]);
            $scope.data.timeTypeJsons = initSingleSelecet.timeType();
            $scope.data.selectedTimeType = angular.copy($scope.data.timeTypeJsons[0]);
            $scope.data.sortTypeJsons = initSingleSelecet.sortType();
            $scope.data.sortType = angular.copy($scope.data.sortTypeJsons[1]);
            $scope.data.classifyJsons = initSingleSelecet.iWoEntire();
            $scope.data.selectedClassify = angular.copy($scope.data.classifyJsons[0]);
        }
        /**
         * [queryDropDown description]根据下拉条件查询列表
         * @param  {[string]} type [description]下拉条件
         * @param {[string]} [varname] [description]下拉值
         * @return {[type]}      [description]
         */
        $scope.queryDropDown = function(type, value) {
            $scope.params[type] = value;
            $scope.params.CurrPage = $scope.page.CURRPAGE = $scope.data.copyCurrPag = 1;
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
         * [isOnlyMine description]只看我的
         * @return {Boolean} [description] null
         */
        $scope.isOnlyMine = function() {
            $scope.status.copyCurrPage = $scope.params.CurrPage = $scope.page.CURRPAGE = "1";
            $scope.status.onlyMine = !$scope.status.onlyMine;
            $scope.params.isOnlyMine = $scope.status.onlyMine;
            requestData();
        };
        /**
         * [pageChanged description]跳转到下一页
         * @return {[type]} [description]
         */
        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.data.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        /**
         * [jumpToPage description]跳转到指定页
         * @return {[type]} [description]
         */
        $scope.jumpToPage = function() {
            if ($scope.data.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.data.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.params.CurrPage = $scope.data.copyCurrPage;
            requestData();
        };
        /**
         * [selectPageNum description]选择分页条数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.params.PageSize = $scope.page.PAGESIZE;
            $scope.data.copyCurrPage = 1;
            requestData();
        };
        /**
         * [selectAll description]稿件全选
         * @return {[type]} [description]
         */
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : []
                .concat($scope.data.items);
        };
        /**
         * [selectDoc description]稿件单选
         * @param  {[obj]} item [description]稿件具体信息
         * @return {[type]}      [description]
         */
        $scope.selectDoc = function(item) {
            if ($scope.data.selectedArray.indexOf(item) < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
            }
        };
        /**
         * [showVersionTime description:流程版本时间与操作日志]
         * @param  {[type]} item [description:稿件对象]
         */
        $scope.showVersionTime = function(item) {
            editingCenterService.getVersionTime(item, false);
        };
        /**
         * [fullTextSearch description;全文检索]
         * @param  {[type]} ev [description:按下回车也能提交]
         */
        $scope.fullTextSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                if ($scope.data.selectedClassify.value == "DocID") {
                    $scope.status.isESSearch = true;
                    $scope.params.DocId = $scope.keywords;
                } else {
                    $scope.status.isESSearch = true;
                }
                $scope.page.CURRPAGE = 1;
                requestData();
            }
        };
        /**
         * [restoreTime description]撤销定时签发
         * @param  {[obj]} item [description]稿件信息
         * @return {[type]}      [description]
         */
        $scope.restoreTime = function(item) {
            $scope.status.isESSearch = false;
            trsconfirm.confirmModel('定时签发', '确认取消定时签发', function() {
                cancelTimeSign(item);
            });
        };
        /**
         * [cancelTimeSign description]取消定时签发函数
         * @param  {[obj]} item [description]稿件信息
         * @return {[type]}      [description]
         */
        function cancelTimeSign(item) {
            var array = !!item ? [item] : $scope.data.selectedArray;
            var params = {
                serviceid: "mlf_appoper",
                methodname: "appRepealTimingPublish",
                ChnlDocIds: trsspliceString.spliceString(array, "CHNLDOCID", ","),
                ObjectIds: trsspliceString.spliceString(array, "CHNLDOCID", ","),
                MetaDataIds: trsspliceString.spliceString(array, "METADATAID", ","),
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("撤销成功", "", "success", false, function() {
                    requestData();
                });
            });
        }
        /**
         * [changeTimeSinged description]修改定时签发
         * @param  {[obj]} item [description]稿件信息
         * @return {[type]}      [description]
         */
        $scope.changeTimeSinged = function(item) {
            $scope.status.isESSearch = false;
            timeSinged(item);
        };

        function timeSinged(item) {
            var array = !!item ? [item] : $scope.data.selectedArray;
            var params = {
                selectedArray: array,
                isNewDraft: false,
                serviceid: "mlf_appoper",
                methodname: "appChangeTimingPublish"
            };
            editingCenterService.draftTimeSinged(params).then(function(result) {
                trsconfirm.alertType("修改定时签发成功", "稿件将在" + result + "签发", "success", false, function() {
                    requestData();
                });
            });
        }
    }]);
