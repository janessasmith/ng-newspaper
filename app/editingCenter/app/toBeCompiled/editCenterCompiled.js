'use strict';
angular.module('editingCenterCompiledModule', [
    'editingCenterCompiledRouterModule',
    'editingCenterCompiledRecycleModule',
    'editCenterNewsModule',
    'editCenterAtlas',
    'editingCenterSubjectModule',
    'editingCenterAddWebsiteModule',
    'toBeCompiledTimingSignModule',
    'editingCenterCompiledMoveModule',
    'editingCenterCompiledTimingSignModule',
]).controller("editCompileController", ["$scope", "$stateParams", "$q", "$window", "$filter", "trsHttpService", "$modal", "$timeout", "trsconfirm", 'initVersionService',
    'trsspliceString', 'trsResponseHandle', 'initSingleSelecet', 'localStorageService', 'editingCenterService', 'globleParamsSet', "editingCenterAppService", 'storageListenerService', 'trsPrintService', 'editcenterRightsService',
    function($scope, $stateParams, $q, $window, $filter, trsHttpService, $modal, $timeout, trsconfirm,
        initVersionService, trsspliceString, trsResponseHandle, initSingleSelecet,
        localStorageService, editingCenterService, globleParamsSet, editingCenterAppService, storageListenerService, trsPrintService, editcenterRightsService) {
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
                "methodname": "queryToBeCompiledDoc",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "ChannelId": $stateParams.channelid,
                "SiteId": $stateParams.siteid
            };
            $scope.status = {
                copyCurrPage: 1,
                channelId: $stateParams.channelid,
                siteId: $stateParams.siteid,
                onlyMine: false,
                isESSearch: false,
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                detailMethodname: {
                    1: 'getNewsDoc',
                    2: 'getPicsDoc',
                    3: 'getSpecialDoc',
                    4: 'getLinkDoc'
                },
            };
            $scope.data = {
                selectedArray: [],
                items: [],
                editPath: editingCenterAppService.initEditPath(),
                printResult: [],
            };
        }
        /**
         * [initData description]初始化数据
         * @return {[type]} [description]
         */
        function initData() {
            requestData();
            initDropDown();
            listenStorage();
            editcenterRightsService.initAppListBtn('app.daibian', $stateParams.channelid).then(function(rights) {
                $scope.status.btnRights = rights;
            });
        }
        /**
         * [initDropDown description]初始化下拉框
         * @return {[type]} [description]
         */
        function initDropDown() {
            // $scope.data.singleJsons = initSingleSelecet.docStatus();
            // $scope.data.docStatus = angular.copy($scope.data.singleJsons[0]);
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
         * [listenStorage description]监听本地缓存
         * @return {[promise]} [description] promise
         */
        function listenStorage() {
            storageListenerService.listenApp(function() {
                $scope.status.isESSearch = false;
                requestData();
                storageListenerService.removeListener("app");
            });
        }
        /**
         * [requestData description]数据请求函数
         * @return {[type]} [description]
         */
        function requestData() {
            var params = $scope.status.isESSearch ? getESSearchParams() : $scope.params;
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                .then(function(data) {
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
         * [getESSearchParams description]设置ES检索参数
         * @return {[json]} [description] 参数对象
         */
        function getESSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForAppToBeCompiledDoc",
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
                        searchField: "channelid",
                        keywords: $stateParams.channelid
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
         * [pageChanged description]跳转到下一页
         * @return {[type]} [description]
         */
        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.status.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        /**
         * [jumpToPage description]跳转到指定页
         * @return {[type]} [description]
         */
        $scope.jumpToPage = function() {
            if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.params.CurrPage = $scope.status.copyCurrPage;
            requestData();
        };
        /**
         * [selectPageNum description]选择分页条数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.params.PageSize = $scope.page.PAGESIZE;
            $scope.status.copyCurrPage = 1;
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
         * [queryDropDown description]根据下拉条件查询列表
         * @param  {[string]} type [description]下拉条件
         * @param {[string]} [varname] [description]下拉值
         * @return {[type]}      [description]
         */
        $scope.queryDropDown = function(type, value) {
            $scope.params[type] = value;
            $scope.params.CurrPage = $scope.page.CURRPAGE = $scope.status.copyCurrPage = 1;
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
         * [showVersionTime description:流程版本时间与操作日志]
         * @param  {[type]} item [description:稿件对象]
         */
        $scope.showVersionTime = function(item) {
            editingCenterService.getVersionTime(item, false);
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
         * [fullTextSearch description;全文检索]
         * @param  {[type]} ev [description:按下回车也能提交]
         */
        $scope.fullTextSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                if ($scope.data.selectedClassify.value == "DocID") {
                    $scope.status.isESSearch = false;
                    $scope.params.DocId = $scope.keywords;
                } else {
                    $scope.status.isESSearch = true;
                }
                $scope.page.CURRPAGE = 1;
                requestData();
            }
        };
        /**
         * [trial description]稿件送审
         * @param  {[obj]} item [description]稿件信息
         * @return {[type]}      [description]
         */
        $scope.trial = function(item) {
            $scope.status.isESSearch = false;
            trial(item);
        };
        /**
         * [trial description]稿件送审函数
         * @param  {[obj]} item [description]稿件信息
         * @return {[type]}      [description]
         */
        function trial(item) {
            var array = angular.isDefined(item) ? [item] : $scope.data.selectedArray;
            trsconfirm.inputModel("送审", "请输入送审意见", function(content) {
                var params = {
                    "serviceid": "mlf_appoper",
                    "methodname": "trialMetaDatas",
                    "MetaDataIds": trsspliceString.spliceString(array, "METADATAID", ","),
                    "ChnlDocIds": trsspliceString.spliceString(array, 'CHNLDOCID', ","),
                    "ChannelId": $stateParams.channelid,
                    "Opinion": content
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("送审成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        }
        /**
         * [directSigned description]直接签发
         * @return {[type]} [description]
         */
        $scope.directSigned = function(item) {
            $scope.status.isESSearch = false;
            trsconfirm.confirmModel('签发', '确认发布稿件', function() {
                signed(item);
            });
        };
        /**
         * [signed description]直接签发函数
         * @param  {[obj]} item [description]稿件信息
         * @return {[type]}      [description]
         */
        function signed(item) {
            var array = angular.isDefined(item) ? [item] : $scope.data.selectedArray;
            var params = {
                serviceid: "mlf_appoper",
                methodname: "appDaiBianPublish",
                ObjectIds: trsspliceString.spliceString(array, "CHNLDOCID", ","),
                ChnlDocIds: trsspliceString.spliceString(array, "CHNLDOCID", ","),
                MetaDataIds: trsspliceString.spliceString(array, "METADATAID", ","),
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("直接签发成功", "", "success", false, function() {
                    requestData();
                });
            });
        }
        /**
         * [timingSigned description]定时签发函数
         * @param  {[obj]} item [description]稿件具体信息
         * @return {[type]}      [description]
         */
        $scope.timingSigned = function(item) {
            $scope.status.isESSearch = false;
            timeSign(item);
        };
        /**
         * [timeSign description]定时签发函数
         * @param  {[obj]} item [description]稿件具体信息
         * @return {[type]}      [description]
         */
        function timeSign(item) {
            var array = angular.isDefined(item) ? [item] : $scope.data.selectedArray;
            var params = {
                selectedArray: array,
                isNewDraft: false,
                serviceid: "mlf_appoper",
                methodname: "appDaiBianTimingPublish"
            };
            editingCenterService.draftTimeSinged(params).then(function(data) {
                trsconfirm.alertType("定时签发成功", "", "success", false, function() {
                    requestData();
                });
            }, function() {
                requestData();
            });
        }
        /**
         * [draftlist description]发稿单
         * @return {[type]} [description] null
         */
        $scope.draftlist = function() {
            $scope.status.isESSearch = false;
            editingCenterService.draftList($scope.data.selectedArray, {
                "serviceid": "mlf_appfgd",
                "methodname": "appDaiBianbatchUpdateFgdUsers"
            }, function() {
                trsconfirm.alertType("发稿单修改成功", "", "success", false, function() {
                    $scope.data.selectedArray = [];
                });
            });
        };
        /**
         * [batchDelete description]废稿
         * @return {[type]} [description]
         */
        $scope.batchDelete = function(item) {
            $scope.status.isESSearch = false;
            abandonDraft(item);
        };
        /**
         * [abandonDraft description]废稿函数
         * @param  {[obj]} item [description]稿件信息
         * @return {[type]}      [description]
         */
        function abandonDraft(item) {
            trsconfirm.inputModel('是否确认废稿', "删除稿件原因（可选）", function(content) {
                var array = angular.isDefined(item) ? [item] : $scope.data.selectedArray;
                var params = {
                    serviceid: "mlf_appoper",
                    methodname: "trashMetaDatas",
                    ChnlDocIds: trsspliceString.spliceString(array, "CHNLDOCID", ","),
                    MetaDataIds: trsspliceString.spliceString(array, "METADATAID", ","),
                    ChannelId: $stateParams.channelid,
                    Opinion: content,
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("废稿成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        }
        /**
         * [collect description]稿件收藏
         * @param  {[obj]} item [description]稿件具体信息
         * @return {[type]}      [description]
         */
        $scope.collect = function(item) {
            $scope.status.isESSearch = false;
            var temp = $filter('pick')($scope.data.selectedArray, $scope.examDraftType);
            if (temp.length < 1) {
                trsconfirm.confirmModel("稿件收藏", "确认收藏稿件", function() {
                    collectDraft(item);
                });
            } else {
                trsconfirm.alertType("只能收藏新闻稿或图集稿", '', "error", false);
            }
        };
        /**
         * [collectDraft description]收藏稿件函数
         * @param  {[obj]} item [description]稿件具体信息
         * @return {[type]}      [description]
         */
        function collectDraft(item) {
            var array = !!item ? item : $scope.data.selectedArray;
            var params = {
                serviceid: "mlf_appoper",
                methodname: "collectionMetaDatas",
                MetaDataIds: trsspliceString.spliceString(array, "METADATAID", ","),
                ChnlDocIds: trsspliceString.spliceString(array, "CHNLDOCID", ","),
                ChannelId: $stateParams.channelid,
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
                trsconfirm.alertType('收藏成功', "", "success", false);
                $scope.data.selectedArray = [];
            });

        }
        /**
         * [move description]移动稿件
         * @return {[type]} [description]
         */
        $scope.move = function() {
            $scope.status.isESSearch = false;
            editingCenterAppService.moveDraft('移动稿件', $stateParams.siteid, $stateParams.channelid, 4, function(result) {
                var params = {
                    serviceid: "mlf_appoper",
                    methodname: "moveDaiBianMetaDatas",
                    ChnlDocIds: trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ","),
                    MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
                    ToChannelId: result.channelid,
                    SrcChannelId: $stateParams.channelid
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType('稿件移动成功', "", "success", false);
                    requestData();
                });
            });
        };
        /**
         * [outSending description]外发功能
         * @return {[type]} [description]
         */
        $scope.outSending = function() {
            $scope.status.isESSearch = false;
            var temp = $filter('pick')($scope.data.selectedArray, $scope.examDraftType);
            if (temp.length < 1) {
                editingCenterService.outSending("", function(result) {
                    outSendingDraft(result.selectItems);
                });
            } else {
                trsconfirm.alertType("只能外发新闻稿或图集稿", '', "error", false);
            }
        };
        /**
         * [outSendingDraft description]外发函数
         * @param  {[array]} items [description]外发服务的返回值
         * @return {[type]}       [description]
         */
        function outSendingDraft(items) {
            var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
            var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ",");
            var params = {
                serviceid: "mlf_mailoutgoingOper",
                methodname: "appDaiBianSendEmail",
                Emails: userids,
                MetaDataIds: draftids
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("邮件外发成功", "", "success", false, function() {
                    requestData();
                });
            }, function() {
                $scope.data.selectedArray = [];
            });
        }
        /**
         * [print description]
         * @return {[type]} [description]
         */
        $scope.print = function() {
            $scope.status.isESSearch = false;
            var temp = $filter('pick')($scope.data.selectedArray, $scope.examSubjectDraft);
            if (temp.length < 1) {
                angular.forEach($scope.data.selectedArray, function(value, key) {
                    requestPrintVersion(value).then(function(data) {
                        requestPrintData(value, data);
                    });
                });
            } else {
                trsconfirm.alertType("所选稿件中有专题稿，无法打印", '', "error", false);
            }
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
                "serviceid": "mlf_website",
                "methodname": $scope.status.detailMethodname[item.DOCTYPEID],
                "MetaDataId": item.METADATAID
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                var result = data;
                data.VERSION = version;
                data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
                $scope.data.printResult.push(result);
                if ($scope.data.printResult.length == $scope.data.selectedArray.length) {
                    trsPrintService.trsWebPrintDocument($scope.data.printResult, true);
                    $scope.data.printResult = [];
                }
            });
        }
        /**
         * [exportDraft description]导出功能
         * @return {[type]} [description]
         */
        $scope.exportDraft = function() {
            $scope.status.isESSearch = false;
            var temp = $filter('pick')($scope.data.selectedArray, $scope.examDraftType);
            if (temp.length < 1) {
                var params = {
                    serviceid: 'mlf_exportword',
                    methodname: 'exportWordFile',
                    MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ','),
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    $window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
                    $scope.data.selectedArray = [];
                });
            } else {
                trsconfirm.alertType("只能导出新闻稿或图集稿", '', "error", false);
            }
        };
        /**
         * [examDraftType description]检验稿件类型
         * @param  {[obj]} elm [description]稿件的具体信息
         * @return {[type]}     [description]
         */
        $scope.examDraftType = function(elm) {
            if (angular.isDefined(elm)) {
                return elm.DOCTYPEID == 3 || elm.DOCTYPEID == 4;
            }
        };
        /**
         * [examSubjectDraft description]专门用来检验专题稿
         * @param  {[obj]} elm [description]稿件信息
         * @return {[type]}     [description]
         */
        $scope.examSubjectDraft = function(elm) {
            if (angular.isDefined(elm)) {
                return elm.DOCTYPEID == 3;
            }
        };
    }
]);
