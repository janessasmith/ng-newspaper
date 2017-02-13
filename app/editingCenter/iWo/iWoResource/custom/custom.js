/*create by ma.rongqin 2016.3.1*/
"use strict";
angular.module('editIWoResourceCustomModule', [
        "editCenIwoCustomServiceModule"
    ])
    .controller('editIWoResourceCustomCtrl', ['$scope', '$q', '$stateParams', '$window', '$timeout', 'trsHttpService', "trsconfirm", "trsspliceString", 'initSingleSelecet', 'editCenIwoCustomService', 'resCtrModalService', 'editingCenterService', 'globleParamsSet', 'localStorageService', 'storageListenerService', "trsPrintService", function($scope, $q, $stateParams, $window, $timeout, trsHttpService, trsconfirm, trsspliceString, initSingleSelecet, editCenIwoCustomService, resCtrModalService, editingCenterService, globleParamsSet, localStorageService, storageListenerService, trsPrintService) {
        initStatus();
        initData();
        /**
         * [initStatus description:初始化状态]
         */
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": globleParamsSet.setResourceCenterPageSize,
                "ITEMCOUNT": 0,
                "PAGECOUNT": 1,
            };
            $scope.params = {};
            $scope.data = {
                selectedArray: [],
                dropDown: {
                    iWoEntireJsons: '',
                    iWoSelectedAll: '',
                    docTypeJsons: '',
                    iWoDocSelected: '',
                    shareTimeJsons: '',
                    shareTimeSelected: '',
                    newsTypeJsons: '',
                    newsTypeSelected: "",
                    iWoSubscribeTimeJsons: "",
                    iWoSubscribeTimeSelected: ""
                },
                custom: {
                    customid: $stateParams.customid,
                    customtype: $stateParams.customtype,
                    // path: $stateParams.path.indexOf("%") > -1 ? $stateParams.path.split("%2F") : $stateParams.path.split("/"),
                    mycustomid: $stateParams.mycustomid
                },
                channelName: "iwo",
                url: {
                    bigData: trsHttpService.getBigDataRootUrl(),
                    wcm: trsHttpService.getWCMRootUrl()
                },
                currUserInfo: {},
                operFlags: [],
                content_like: "",
                printResult: [],
                currCustomRegion: '',
            };
            // $scope.data.custom.path.shift();
            $scope.status = {
                isESSearch: false,
                customType: {
                    iWoSubscribe: $scope.data.custom.customtype == 1,
                    sharedSource: $scope.data.custom.customtype == 2,
                    sharedTheme: $scope.data.custom.customtype == 3,
                    sharedRegion: $scope.data.custom.customtype == 4
                },
                batchOperateBtn: {
                    clickStatus: "",
                    hoverStatus: ""
                },
                copyCurpage: 1,
                printMethodname: {
                    1: "getNewsShareDoc",
                    2: "getPicsShareDoc"
                },
            };
            //iwo下会使用
            $scope.basicParams = {
                channelName: "iwo",
                indexName: "",
            };
        }
        /**
         * [initData description:初始化数据]
         */
        function initData() {
            //请求自定义列表
            requestCustomList().then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].CUSTOMID == $scope.data.custom.customid) {
                        $scope.data.currCustomRegion = data[i];
                        //处理路径
                        dealPath($scope.data.currCustomRegion.PATH);
                        break;
                    }
                }
            });
            //首先初始化下拉框
            initDropDown();
            //监听缓存
            listenStorage();
            if ($scope.status.customType.iWoSubscribe) {
                initIWoData();
                getCurrUserInfo();
            } else {
                setRequestParams();
                requestData();
            }
        }
        /**
         * [dealPath description:处理自定义路径]
         */
        function dealPath(path) {
            $scope.data.custom.path = path.indexOf("%") > -1 ? path.split("%2F") : path.split("/");
            $scope.status.path = angular.copy($scope.data.custom.path);
            $scope.status.path.shift();
        }
        /**
         * [setRequestParams description:设置请求数据的参数]
         */
        function setRequestParams() {
            if ($scope.status.customType.sharedSource) {
                $scope.params = {
                    serviceid: 'mlf_releaseSource',
                    methodname: 'queryTongYiGongGao',
                    CurrPage: $scope.page.CURRPAGE,
                    PageSize: $scope.page.PAGESIZE,
                    MetaCategoryId: $scope.data.custom.customid,
                    DocType: '',
                    ShareTime: ''
                };
            }
        }
        /**
         * [requestCustomList description:初始化自定义列表]
         */
        function requestCustomList() {
            var deferred = $q.defer();
            var params = {
                serviceid: 'mlf_releasesource',
                methodname: 'queryMyCustoms'
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                deferred.resolve(data.DATA);
            });
            return deferred.promise;
        };
        /**
         * [requestData description:数据请求方法]
         */
        function requestData() {
            var params = {};
            //判断是否为大数据url
            var url = $scope.status.customType.iWoSubscribe ? trsHttpService.getBigDataRootUrl() : trsHttpService.getWCMRootUrl();
            //判断是否启用ES检索
            if ($scope.status.customType.sharedSource) {
                params = $scope.status.isESSearch ? getSourceESParams() : angular.copy($scope.params);
            } else {
                params = getESThemeRegionParams();
            }
            $scope.loadingPromise = trsHttpService.httpServer(url, params, 'post').then(function(data) {
                var ListItems = data.DATA;
                $scope.data.items = ListItems;
                cacheCurPageIds(data.DATA);
                initOperFlag();
                selectedCurrentsArray(data.DATA);
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = 0;
                $scope.data.selectedArray = [];
                requestListImg(ListItems).then(function(data) {
                    angular.forEach(ListItems, function(value, key) {
                        value.ALLIMG = data[value.METADATAID];
                    });
                });
                //获得取稿人
                getDraftRecord(data.DATA).then(function(data) {
                    angular.forEach(ListItems, function(value, key) {
                        value.OPERUSER = data[value.METADATAID];
                        if (angular.isDefined(value.OPERUSER)) {
                            for (var i = 0; i < value.OPERUSER.length; i++) {
                                var temp = value.OPERUSER[i].OPERUSER;
                                temp = temp.split('-');
                                value.OPERUSER[i].OPERUSER = temp.length > 1 ? temp[0] + '-' + temp.pop() : temp[0];
                            }
                        }
                        // value.OPERUSER = data[value.METADATAID] || [];
                    });
                });
            });
        }
        /**
         * [getDraftRecord description]获得取稿件人
         * @return {[type]} [description]
         */
        function getDraftRecord(itemList) {
            var deferred = $q.defer();
            var params = {
                serviceid: "mlf_releasesource",
                methodname: "queryQuOpers",
                MetaDataIds: trsspliceString.spliceString(itemList, "METADATAID", ",")
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }
        /**
         * [requestListImg description:查询列表图示]
         */
        function requestListImg(items) {
            var defer = $q.defer();
            if (!items || items.length < 1) defer.reject();
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
        };
        /**
         * [initDropDown description:初始化下拉框]
         */
        function initDropDown() {
            //在iwo资源下请求时间列表
            if ($scope.status.customType.iWoSubscribe) {
                initIWoSubscribeTimeList().then(function(jsons) {
                    $scope.data.dropDown.iWoSubscribeTimeJsons = jsons;
                    $scope.data.dropDown.iWoSubscribeTimeSelected = angular.copy($scope.data.dropDown.iWoSubscribeTimeJsons[0])
                });
            }
            //ES类型选择
            $scope.data.dropDown.iWoEntireJsons = initSingleSelecet.iWoEntire();
            $scope.data.dropDown.iWoSelectedAll = angular.copy($scope.data.dropDown.iWoEntireJsons[0]);
            //选择类型
            $scope.data.dropDown.docTypeJsons = initSingleSelecet.iWoCustomQueryType();
            $scope.data.dropDown.iWoDocSelected = angular.copy($scope.data.dropDown.docTypeJsons[0]);
            //选择新闻类型
            $scope.data.dropDown.newsTypeJsons = initSingleSelecet.iWoCustomQueryNewsType();
            $scope.data.dropDown.newsTypeSelected = angular.copy($scope.data.dropDown.newsTypeJsons[0]);
            //选择共享时间
            $scope.data.dropDown.shareTimeJsons = initSingleSelecet.iWoCustomQueryTime();
            $scope.data.dropDown.shareTimeSelected = angular.copy($scope.data.dropDown.shareTimeJsons[0])
                // 排序方式
            $scope.sortTypeJsons = initSingleSelecet.sortType();
            $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
        }

        function initIWoSubscribeTimeList() {
            var deferred = $q.defer();
            var params = {
                'typeid': 'zyzx',
                'modelid': 'getSearchMenu',
                'channelName': 'iwo',
                'typeName': 'area',
                'serviceid': 'xhsg',
                'menuName': 'time'
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                if (typeof data != "object") return;
                var listJsons = angular.copy(data.content[0]);
                angular.forEach(listJsons, function(data, key) {
                    data.name = angular.copy(data.ENNAME);
                    data.value = angular.copy(data.CNNAME);
                });
                deferred.resolve(listJsons);
            });
            return deferred.promise;
        }
        /**
         * [queryByDropdown description:下拉框筛选]
         * @param  {[string]} key [description:单条数据]
         * @param  {[object]} selected [description:所选的下拉条目]
         */
        $scope.queryByDropdown = function(key, selected) {
            if ($scope.status.customType.sharedSource) {
                $scope.params[key] = selected.value;
                $scope.page.CURRPAGE = "1";
                requestData();
            } else {
                requestData();
            }
        };
        /**
         * [selectPageNum description]选择一页显示条数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            $scope.status.copyCurpage = 1;
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.params.PageSize = $scope.page.PAGESIZE;
            requestData();
        };
        /**
         * [listenStorage description]监听本地缓存
         * @return {[promise]} [description] promise
         */
        function listenStorage() {
            storageListenerService.listenResource(function() {
                unifyRefresh();
                storageListenerService.removeListener("resource");
            });
        }
        /**
         * [promptRequest description]具体操作数据请求成功后刷新列表
         * @param  {[string]} url [description]发送路径
         * @param  {[obj]} params [description]请求参数
         * @param  {[string]} info   [description]提示语
         * @return {[type]}        [description]
         */
        function promptRequest(url, params, info) {
            $scope.loadingPromise = trsHttpService.httpServer(url, params, "post").then(function(data) {
                trsconfirm.alertType(info, "", "success", false, function() {
                    if ($scope.status.customType.iWoSubscribe) {
                        requestIWoData();
                    } else {
                        requestData();
                    }
                });
            });
        }
        /**
         * [pageChanged description:下一页]
         */
        $scope.pageChanged = function() {
            $scope.status.copyCurpage = $scope.page.CURRPAGE;
            requestIWoData();
            if ($scope.status.customType.iWoSubscribe) {
                requestIWoData();
            } else {
                $scope.params.CurrPage = $scope.page.CURRPAGE;
                requestData();
            }
        };

        /**
         * [jumpToPage description:跳转至指定页面]
         */
        $scope.jumpToPage = function() {
            if ($scope.status.copyCurpage > $scope.page.PAGECOUNT) {
                $scope.status.copyCurpage = $scope.page.PAGECOUNT;
            }
            if ($scope.status.customType.iWoSubscribe) {
                $scope.page.CURRPAGE = $scope.status.copyCurpage;
                requestIWoData();
            } else {
                $scope.params.CurrPage = $scope.status.copyCurpage;
                requestData();
            }
        };
        /**
         * [selectAll description] 全选
         */
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
        };
        /**
         * [selectDoc description] 单选
         * * @param  {[object]} item [description:单条数据]
         */
        $scope.selectDoc = function(item) {
            if ($scope.data.selectedArray.indexOf(item) < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
            }
        };
        /**
         * [fullTextSearch description;全文检索]
         * @param  {[type]} ev [description:按下空格也能提交]
         */
        $scope.fullTextSearch = function(ev) {
            if (!$scope.status.customType.iWoSubscribe) {
                if (angular.isDefined(ev) && ev.keyCode == 13 || angular.isUndefined(ev)) {
                    $scope.status.isESSearch = true;
                    requestData();
                }
            } else {
                if (angular.isDefined(ev) && ev.keyCode == 13 || angular.isUndefined(ev)) {
                    $scope.status.isESSearch = true;
                    requestIWoData();
                }
            }
        };
        /**
         * [getESSearchParams description]设置共享稿库目标来源ES检索参数
         * @return {[json]} [description] 参数对象
         */
        function getSourceESParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForTongYiGongGaoDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: $scope.data.dropDown.iWoSelectedAll.value,
                        keywords: $scope.keywords ? $scope.keywords : ""
                    }, {
                        searchField: "newsType",
                        keywords: $scope.data.custom.customid
                    }, {
                        searchField: "docType",
                        keywords: $scope.data.dropDown.iWoDocSelected.value
                    }, {
                        searchField: "timeType",
                        keywords: $scope.data.dropDown.shareTimeSelected.value
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
         * [getESThemeRegionParams description]设置共享稿库主题分类地域分类ES库检索参数
         * @return {[json]} [description] 参数对象
         */
        function getESThemeRegionParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForShareTopicAndArea",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: "contentType",
                        keywords: $scope.status.customType.sharedTheme ? 'topic' : 'area'
                    }, {
                        searchField: "typeValue",
                        keywords: $scope.data.custom.customid.slice($scope.data.custom.customid.indexOf("_") + 1)
                    }, {
                        searchField: "newsType",
                        keywords: $scope.data.dropDown.newsTypeSelected.value
                    }, {
                        searchField: "timeType",
                        keywords: $scope.data.dropDown.shareTimeSelected.value
                    }, {
                        searchField: "docType",
                        keywords: $scope.data.dropDown.iWoDocSelected.value
                    }, {
                        searchField: $scope.data.dropDown.iWoSelectedAll.value,
                        keywords: $scope.keywords || ""
                    }]
                }
            };

            esParams.searchParams = JSON.stringify(esParams.searchParams);
            return esParams;
        }
        /** [initIWoData  description] 初始化iWo我的订阅的数据 */
        function initIWoData() {
            $scope.params = {
                typeid: 'zyzx',
                modelid: 'subSearch',
                serviceid: 'subscript',
                id: $scope.data.custom.customid,
                pageNum: $scope.page.CURRPAGE,
                pageSize: $scope.page.PAGESIZE,
                time: "",
                content_keyword: ""
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                // $scope.params = data.condition;
                $scope.data.items = data.content;
                // getTags(data.content);
                !!data.summary_info ? $scope.page = data.summary_info : $scope.page.ITEMCOUNT = 0;
                $scope.data.channelName = data.channelName;
                initOperFlag();
                getImgList();
            });
        }
        /** [getCurrUserInfo  description] 请求IWO我的订阅的数据 */
        function getCurrUserInfo() {
            var params = {
                'serviceid': 'mlf_extuser',
                'methodname': 'getCurrUserInfo'
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                $scope.data.currUserInfo = data;
            });
        }
        /** [requestIWoData  description] 请求IWO我的订阅的数据 */
        function requestIWoData() {
            // var time = $scope.time && ($scope.time.curValue.value == "custom" ? [dateFilter($scope.time.curValue.startdate, 'yyyy-MM-dd'), dateFilter($scope.time.curValue.enddate, 'yyyy-MM-dd')].join(',') : $scope.time.curValue.CNNAME);

            $scope.params.content_keyword = !!$scope.keywords ? $scope.keywords : "";
            $scope.params.time = $scope.data.dropDown.iWoSubscribeTimeSelected.value || "";
            $scope.params.pageNum = $scope.page.CURRPAGE;
            // var params = {
            //     serviceid: "iwo",
            //     channelName: $scope.data.channelName,
            //     modelid: "expertSearch",
            //     typeid: "zyzx",
            //     pageNum: $scope.page.CURRPAGE,
            //     pageSize: $scope.page.PAGESIZE,
            //     searchAttributes: JSON.stringify($scope.params)
            // };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                if (data.result == "success") {
                    var pageInfo = data.summary_info;
                    $scope.data.items = data.content;
                    // getTags(data.content);
                    !!data.summary_info ? $scope.page = data.summary_info : $scope.page.ITEMCOUNT = 0;
                    $scope.data.selectedArray = [];
                    initOperFlag();
                    getImgList();
                }
            });
        }
        /** [summaryContentLike description] 总结content_like */
        function summaryContentLike() {
            // if ($scope.data.content_like && $scope.data.content_like.length > 0) {
            //     return $scope.keywords ? $scope.data.content_like + "," + $scope.keywords : $scope.data.content_like;
            // } else {
            //     return $scope.keywords || "";
            // }
            return !!$scope.keywords ? $scope.keywords + "," : "";
        }
        /** [unifyRefresh description] 进行判断，统一刷新的方法 */
        function unifyRefresh() {
            if ($scope.status.customType.iWoSubscribe) {
                requestIWoData();
            } else {
                requestData();
            }
        }
        /** [iWoQueryByTime description] iwo根据时间范围搜索 */
        $scope.iWoQueryByTime = function() {
            $scope.page.CURRPAGE = "1";
            requestIWoData();
        };
        /**
         * [initOperFlag description] 初始化取签见撤重
         */
        function initOperFlag() {
            var params = {};
            var id = $scope.status.customType.iWoSubscribe ? "ZB_GUID" : "METADATAID";
            var docIds = trsspliceString.spliceString($scope.data.items, id, ",");
            if (docIds) {
                if ($scope.status.customType.iWoSubscribe) {
                    //大数据请求取签见撤重参数
                    params = {
                        'methodname': "queryFlag",
                        'serviceid': "mlf_bigdataexchange",
                        'guids': docIds
                    };
                } else {
                    //共享稿库请求取签见撤重参数
                    params = {
                        'methodname': "queryFlag",
                        'serviceid': "mlf_releasesource",
                        'metadataids': docIds
                    };
                }
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    var temp = data;
                    for (var i in temp) {
                        if (angular.isDefined(data[i]) && data[i].OPERFLAG.indexOf("1") > -1) {
                            $scope.data.operFlags = $scope.data.operFlags.concat(data[i]);
                        }
                    }
                });
            }
        }
        /**
         * [showOperFlag description] 显示取签见撤重标志
         * @param  {[type]} guid      [description]
         * @param  {[type]} flagIndex [description]
         * @return {[type]}           [description]
         */
        $scope.showOperFlag = function(id, flagIndex) {
            var temp = queryItemById(id);
            if (!!temp) {
                return queryItemById(id).OPERFLAG.substr(flagIndex, 1) == "1" ? true : false;
            } else {
                return false;
            }
        };
        /**
         * [queryItemBYGUID description] 根据guid获取在WCM内的取签见撤重的二进制数
         * @param  {[type]} guid [description]
         * @return {[type]}      [description]
         */
        function queryItemById(id) {
            var queryId = $scope.status.customType.iWoSubscribe ? "GUID" : "METADATAID";
            for (var i in $scope.data.operFlags) {
                if (id == $scope.data.operFlags[i][queryId]) {
                    return $scope.data.operFlags[i];
                }
            }
        }
        /**
         * [viewBigDataInfo description] 取签见撤重点击弹出
         */
        $scope.viewInfo = function(ChnlDocId, showRepeat) {
            var infoModal = "";
            if ($scope.status.customType.iWoSubscribe) {
                infoModal = resCtrModalService.bigDataInfoModal(ChnlDocId, showRepeat);
            } else {
                infoModal = resCtrModalService.infoModal(ChnlDocId, showRepeat);
            }
        };
        /** --------- 稿件操作开始 --------- */
        /**
         * [exportDraft description:导出操作]
         */
        $scope.exportDraft = function() {
            if ($scope.status.customType.iWoSubscribe) {
                // 大数据导出
                var params = {
                    serviceid: 'mlf_exportword',
                    methodname: 'exportBigDataDocs',
                    GUIDS: trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                    CHANNELNAMES: "iwo",
                    indexName: $scope.page.indexName
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
                })
            } else {
                // 共享稿库导出
                var params = {
                    serviceid: 'mlf_exportword',
                    methodname: 'exportWordFile',
                    MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
                });
            }
        };
        /**
         * [collectDraft description:收藏操作]
         */
        $scope.collectDraft = function() {
            var params = {};
            if ($scope.status.customType.iWoSubscribe) {
                //大数据收藏
                var guids = trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ",");
                params = {
                    'serviceid': "mlf_bigdataexchange",
                    'methodname': "collect",
                    'indexName': $scope.page.indexName,
                    'guid': guids,
                    'userId': $scope.data.currUserInfo.USERNAME,
                    'channelName': 'iwo'
                };
                promptRequest($scope.data.url.wcm, params, "稿件收藏成功");
            } else {
                //共享稿库收藏
                var metadataids = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
                params = {
                    'serviceid': "mlf_myrelease",
                    'methodname': "collect",
                    'MetaDataIds': metadataids
                };
                promptRequest($scope.data.url.wcm, params, "稿件收藏成功");
            }
        };
        /**
         * [creationAxis description:加入创作轴]
         */
        $scope.creationAxis = function() {
            var params = {};
            if ($scope.status.customType.iWoSubscribe) {
                //大数据加入创作轴
                var guids = trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ",");
                params = {
                    'serviceid': "mlf_bigdataexchange",
                    // 'methodname': "creation",
                    'indexName': $scope.page.indexName,
                    'guid': guids,
                    'userId': $scope.data.currUserInfo.USERNAME,
                    'channelName': 'iwo'
                };
                params.methodname = $scope.data.selectedArray.length > 1 ? "batchcreation" : "creation";
                promptRequest($scope.data.url.wcm, params, "加入创作轴成功");
            } else {
                //共享稿库加入创作轴
                var metadataids = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
                params = {
                    'serviceid': "mlf_releasesource",
                    'methodname': "setBatchCreation",
                    'MetaDataIds': metadataids
                };
                promptRequest($scope.data.url.wcm, params, "加入创作轴成功");
            }
        };
        /**
         * [openTakeDraftModal description]取稿
         * @return {[type]} [description]
         */
        $scope.openTakeDraftModal = function() {
            var params = {};
            if ($scope.status.customType.iWoSubscribe) {
                //大数据取稿服务请求参数
                params = {
                    serviceid: "mlf_bigdataexchange",
                    methodname: "fetch",
                    guid: trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                    channelName: "iwo",
                    indexName: $scope.page.indexName,
                    nodeId: $scope.data.custom.customid
                };
            } else {
                //共享稿库取稿服务请求参数
                params = {
                    serviceid: "mlf_releasesource",
                    methodname: "fetch",
                    MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
                    SourceName: $scope.data.custom.path.join("-")
                };
            }
            var isOnlyOne = $scope.data.selectedArray.length > 1 ? false : true;
            var modalInstance = resCtrModalService.fullTakeDraft(params, isOnlyOne);
            modalInstance.result.then(function() {
                unifyRefresh();
            }, function() {
                unifyRefresh();
            });
        };
        /**
         * [openReserveDraftModal description]预留
         * @return {[type]} [description]
         */
        $scope.openReserveDraftModal = function() {
            var resCtrModalServiceModal = resCtrModalService.reserveDraft($scope.data.selectedArray);
            resCtrModalServiceModal.result.then(function(result) {
                delete result.items;
                var params = {};
                if ($scope.status.customType.iWoSubscribe) {
                    //大数据预留服务请求参数
                    params = {
                        serviceid: "mlf_bigdataexchange",
                        methodname: "delay",
                        guid: trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                        channelName: "iwo",
                        indexName: $scope.page.indexName,
                        nodeId: $scope.data.custom.customid
                    };
                } else {
                    //共享稿库预留服务请求参数
                    params = {
                        serviceid: "mlf_releasesource",
                        methodname: "delayFetch",
                        MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
                        SourceName: $scope.data.custom.path.join("-")
                    };
                }
                params = angular.extend(params, result);
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("预留成功!", "", "success", false, function() {
                        unifyRefresh();
                    });
                }, function() {
                    unifyRefresh();
                });
            });
        };
        /**
         * [deleteDrafts description]共享稿库删除
         */
        $scope.deleteDrafts = function() {
            trsconfirm.confirmModel("删除", "是否从共享稿库删除", function() {
                var params = {
                    serviceid: "mlf_releasesource",
                    methodname: "deleteRelease",
                    MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    requestData();
                }, function() {
                    requestData();
                });
            });
        };

        /**
         * [selectedArrayCahe description] 缓存当前选中项
         * @array {[type]} [description]  选中对象
         */
        function selectedArrayCahe(array) {
            var selectedArray = angular.copy(array);
            var selectedArrayMetadaid = [];
            angular.forEach(selectedArray, function(data, index) {
                selectedArrayMetadaid.push(data.METADATAID);
            });
            localStorageService.set("newspaperPreviewSelectArray", selectedArrayMetadaid);
        }
        /**
         * [selectedArrayCahe description] 缓存中item请求选中项
         * @array {[type]} [description]  选中对象
         */
        function selectedCurrentsArray(data) {
            $scope.data.selectedArrat = [];
            var curSelectedArray = [];
            for (var i in data) {
                curSelectedArray.push(data[i]);
            }
            angular.forEach(curSelectedArray, function(data, index) {
                $scope.data.selectedArrat.push(data);
            });
            //监听预览页 按钮点击
            $window.addEventListener("storage", function(e) {
                $scope.data.selectedCurrents = angular.copy(localStorageService.get("newspaperPreviewSelectArray"));
                $scope.$apply(function() {
                    forArray($scope.data.selectedCurrents);

                });

            });
        }
        /**
         * [forArray description] 遍历出选择对象
         * @selectedArrat {[type]} [description]  选中 对象
         */
        function forArray(selectedArrat) {
            if (selectedArrat === null) return;
            //var arrays=[];
            $scope.data.selectedArray = [];
            for (var i = 0; i < selectedArrat.length; i++) {
                for (var j = 0; j < $scope.data.selectedArrat.length; j++) {
                    if (selectedArrat[i] === $scope.data.selectedArrat[j].METADATAID) {
                        $scope.data.selectedArray.push($scope.data.selectedArrat[j]);
                    }
                }
            }
        }
        /*
         * [isChecked description] 点击单选
         * @item {[type]} [description]  当前选择值
         */
        $scope.isChecked = function(item) {
            return getIndex(item) >= 0;
        };
        /*
         * [getIndex description] 单选方法
         * @item {[type]} [description]  当前选择值
         */
        function getIndex(item) {
            var selectedArray = $scope.data.selectedArray;
            for (var index = 0; index < selectedArray.length; index++) {
                if (selectedArray[index].METADATAID == item.METADATAID) {
                    return index;
                }
            }
            return -1;
        }
        /**
         * [singleSelect description]单选
         * @param  {[type]} item [description] 单个对象
         * @return {[type]}      [description] null
         */
        $scope.singleSelect = function(item) {
            var index = getIndex(item);
            //var index = $scope.data.selectedArray.indexOf(item);
            index > -1 ? $scope.data.selectedArray.splice(index, 1) : $scope.data.selectedArray.push(item);
            selectedArrayCahe($scope.data.selectedArray);
        };

        /**
         * [cacheDate description] 缓存数据以供细览的上下翻页
         * @return {[type]} [description]
         */
        function cacheCurPageIds(data) {
            var copyData = angular.copy(data);
            var methodname = {
                "1": "getNewsShareDoc",
                "2": "getPicsShareDoc"
            };
            var cacheId = [];
            var cacheMethodname = [];
            for (var i in copyData) {
                copyData[i].methodname = methodname[copyData[i].DOCTYPEID];
                cacheId.push(copyData[i].METADATAID);
                cacheMethodname.push(copyData[i].methodname);
            }
            localStorageService.set("resCtrGxgkDetailIdCache", cacheId);
            localStorageService.set("resCtrGxgkDetailMethodnameCache", cacheMethodname);
        }
        /** [getImgList 单独请求图片] */
        function getImgList() {
            var docIds = trsspliceString.spliceString($scope.data.items, "ZB_GUID", ",");
            if (docIds) {
                var params = {
                    typeid: "zyzx",
                    modelid: "getImgList",
                    serviceid: "iwo",
                    channelName: "iwo",
                    guids: docIds
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                    if (data.result == "success") {
                        var temp = data.content[0];
                        var arr = angular.copy($scope.data.items);
                        angular.forEach(arr, function(value, key) {
                            value.imgurl = temp[value.ZB_GUID] && temp[value.ZB_GUID].IMAGEURLS;
                        });
                        $timeout(function() {
                            $scope.data.items = arr;
                        }, 0);
                    }
                });
            }
        };
        /**
         * [printbtn description] 打印
         * @return {[type]} [description]
         */
        $scope.printbtn = function() {
            if ($scope.status.customType.iWoSubscribe) {
                //大数据的打印
                var params = {
                    "serviceid": 'iwo',
                    "modelid": "detailData",
                    "guid": trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                    "channelName": $scope.data.channelName,
                    "typeid": "zyzx",
                    "indexName": $scope.page.indexName,
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                    trsPrintService.trsPrintBigData(data);
                });
            } else {
                //共享稿库的打印
                angular.forEach($scope.data.selectedArray, function(value, key) {
                    requestPrintVersion(value).then(function(data) {
                        requestPrintData(value, data);
                    })
                });
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
        };
        /**
         * [requestPrintVersion description：打印请求详情]
         */
        function requestPrintData(item, version) {
            var params = {
                "serviceid": "mlf_myrelease",
                "methodname": $scope.status.printMethodname[item.DOCTYPEID],
                "MetaDataId": item.METADATAID
            }
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                var result = data;
                data.VERSION = version;
                data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
                $scope.data.printResult.push(result);
                if ($scope.data.printResult.length == $scope.data.selectedArray.length) {
                    trsPrintService.trsPrintShare($scope.data.printResult);
                    $scope.data.printResult = [];
                }
            });
        };

    }]);
