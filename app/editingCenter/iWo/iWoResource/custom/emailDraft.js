"use strict"
angular.module('editingCenterSharedMailModule', [])
    .controller('editingCenterSharedMailCtrl', ["$scope", "$q", "$filter", "$timeout", "$stateParams", "$cacheFactory", "$modal", "$window", "trsHttpService", "initSingleSelecet", "editNewspaperService", 'trsspliceString', "trsconfirm", "$interval", "initVersionService", "trsPrintService", "storageListenerService", "globleParamsSet", "initComDataService", "localStorageService", "resourceCenterService", "resCtrModalService", "editingCenterService",
        function($scope, $q, $filter, $timeout, $stateParams, $cacheFactory, $modal, $window, trsHttpService, initSingleSelecet, editNewspaperService, trsspliceString, trsconfirm,$interval, initVersionService, trsPrintService, storageListenerService, globleParamsSet, initComDataService, localStorageService, resourceCenterService, resCtrModalService, editingCenterService) {
            initStatus();
            initData();

            function initStatus() {
                $scope.page = {
                    "CURRPAGE": 1,
                    "PAGESIZE": globleParamsSet.setResourceCenterPageSize,
                    "ITEMCOUNT": 0,
                    "PAGECOUNT": 0
                };
                $scope.basicParams = {
                    channelName: 'gxgk',
                    nodeId: $stateParams.customid,
                    nodename: $stateParams.nodename
                };
                $scope.params = {
                    serviceid: "mlf_releasesource",
                    methodname: "queryMailDocDataCount",
                    TimeType: "15d",
                };
                $scope.data = {
                    selectedArray: [],
                    panels: [],
                    operFlags: [],
                    printResult: [],
                    currCustomRegion: "",
                    // path: $stateParams.path.indexOf("%") > -1 ? $stateParams.path.split("%2F") : $stateParams.path.split("/")
                };
                $scope.status = {
                    isESSearch: false,
                    btnRights: "",
                    isOpenedPanel: { //默认打开第一个面板
                        0: true
                    },
                    cacheOpenedPanelKey: "email",
                    cachedName: "sharedEmailDraft", //缓存key
                    cacheOpenedPanel: {},
                    cachedPage: {},
                    currModule: "gxgk",
                    position: {
                        iwo: '0',
                        newspaper: '1',
                        website: '2'
                    },
                    batchOperateBtn: {
                        "hoverStatus": "",
                        "clickStatus": ""
                    },
                    dropDown: {
                        timeTypeJson: "",
                        timeTypeSelected: "",
                        docTypeJson: "",
                        docTypeSelected: "",
                        allJson: "",
                        allSelected: ""
                    },
                    methodname: {
                        1: "getNewsShareDoc",
                        2: "getPicsShareDoc"
                    },
                };
                // $scope.status.path = angular.copy($scope.data.path);
                // $scope.status.path.shift();
                $scope.numberOfNewDocs = 0;
                // $timeout(loadNewItems, 1000 * 60);
            }

            function initData() {
                //请求自定义列表
                requestCustomList().then(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].CUSTOMID == $scope.basicParams.nodeId) {
                            $scope.data.currCustomRegion = data[i];
                            //处理路径
                            dealPath($scope.data.currCustomRegion.PATH);
                            break;
                        }
                    }
                });
                if ($scope.basicParams.nodeId) {
                    listenStorage();
                    requestData();
                    initDropDown();
                }
                $scope.$on('$destroy', function() {
                    localStorageService.remove("resCtrGxgkDetailMethodnameCache");
                    localStorageService.remove("resCtrGxgkDetailIdCache");
                    localStorageService.remove("newspaperPreviewCache");
                });
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
             * [dealPath description:处理自定义路径]
             */
            function dealPath(path) {
                $scope.data.path = path.indexOf("%") > -1 ? path.split("%2F") : path.split("/");
                $scope.status.path = angular.copy($scope.data.path);
                $scope.status.path.shift();
            }
            /** [initDropDown 初始化下拉列表数据] */
            function initDropDown() {
                //时间筛选
                $scope.status.timeTypeJson = initComDataService.timeRange();
                $scope.status.timeTypeSelected = $scope.status.timeTypeJson[4];
                //类型筛选
                $scope.status.docTypeJson = initComDataService.emailNewsdocTypes();
                $scope.status.docTypeSelected = $scope.status.docTypeJson[0];
                //搜索类型
                $scope.status.allJson = initComDataService.searchKeyType();
                $scope.status.allSelected = $scope.status.allJson[0];
                // 排序方式
                $scope.sortTypeJsons = initSingleSelecet.sortType();
                $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
            }
            /** [searchWithKeyword 下拉框筛选] */
            $scope.searchWithKeyword = function(keyWord, selectedItem) {
                $scope.params[keyWord] = selectedItem.value;
                requestData().then(function(data) {
                    // openSelectPanel();
                });

            };
            /**
             * [initSourceFilter description]来源你筛选
             * @return {[type]} [description]null
             */
            function initSourceFilter(data) {
                $scope.status.selectedSource = {
                    name: "来源筛选",
                    value: ""
                };
                var sourceArray = [];
                sourceArray.push($scope.status.selectedSource);
                angular.forEach(data, function(_data, index, array) {
                    sourceArray[index + 1] = {
                        name: data[index].TYPENAME,
                        value: data[index].TYPE
                    };
                });
                $scope.status.sourceArray = $filter('unique')(sourceArray, 'value');
            }

            /**
             * [openDefaultPanels description]  打开默认的PANEL
             * @return {[type]} [description]
             */
            function openDefaultPanels() {
                var tempOpenedPanels = editNewspaperService.getCacheOpenedPanel($scope.status.cacheOpenedPanelKey);
                if (angular.isUndefined(tempOpenedPanels)) {
                    queryItemsBySource(0, false);
                    return;
                }
                $scope.status.isOpenedPanel[0] = false;
                for (var i in $scope.data.panels) {
                    if ((tempOpenedPanels[$scope.data.panels[i].MDATE + $scope.data.panels[i].TYPE]) === true) {
                        $scope.status.isOpenedPanel[i] = true;
                        queryItemsBySource(i, false);
                    }
                }
            }
            /** [requestData 请求数据] */
            function requestData() {
                if (angular.isDefined($scope.status.docTypeSelected) && $scope.status.docTypeSelected.value === "0") {
                    delete $scope.params.DocType;
                }
                var deferred = $q.defer();
                //判断是否启用ES检索
                //var params = $scope.status.isESSearch ? getESSearchParams() : angular.copy($scope.params);
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'get').then(function(data) {
                    initSourceFilter(data);
                    $scope.data.panels = data;
                    openDefaultPanels();
                    /* var panels = $scope.status.isOpenedPanel;
                     for (var i in panels) {
                         var item = panels[i];
                         if (item === true && data[i].COUNT > 0) {
                             //queryItemsBySource(i, false);
                             openDefaultPanels();
                             return false;
                         }
                     }*/
                });
                return deferred.promise;
            }
            /**
             * [queryItemsBySource description] 根据来源请求数据
             * @param  {[type]}  index      [description] panel 下标
             * @param  {Boolean} isGetMore [description] 是否是获取更多
             * @return {[type]}            [description] null
             */
            function queryItemsBySource(index, isGetMore) {
                var params = {
                    serviceid: "mlf_releasesource",
                    methodname: "queryMailDocs",
                    TimeType: $scope.data.panels[index].MDATE,
                    ExternalType: $scope.data.panels[index].TYPE,
                };
                $scope.status.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    initOperFlag(data);
                    cacheDate(index, data);
                });
                $scope.data.selectedArray = [];
            }

            /**
             * [addItemsToPanel description] 将请求到的数据加入到对应的PANEL
             * @param {Boolean} isGetMore [description] 是否获取是获取更多
             * @param {[type]}  index     [description] panel下标
             * @param {[type]}  data      [description] docs
             */
            function addItemsToPanel(isGetMore, index, data) {
                //判断是否记载更多
                if (isGetMore) {
                    $scope.data.panels[index].DOCUMENTS = $scope.data.panels[index].DOCUMENTS.DATA.concat(data.DATA);
                    $scope.data.panels[index].PAGER = data.PAGER;
                } else {
                    $scope.data.panels[index].DOCUMENTS = data;
                }

            }

            /**
             * [loadMore description]加载更多
             * @param  {[type]} index [description] panel 下标
             * @return {[type]}       [description]
             */
            $scope.loadMore = function(index) {
                loadItemsByPage(index);
            };
            /**
             * [cacheDate description] 缓存数据已提高渲染速度
             * @return {[type]} [description]
             */
            function cacheDate(index, data) {
                if ($cacheFactory.get($scope.status.cachedName)) $cacheFactory.get($scope.status.cachedName).destroy();

                var cache = $cacheFactory($scope.status.cachedName),
                    key = $scope.data.panels[index].MDATE + $scope.data.panels[index].TYPE;
                cache.put(key, data);
                $scope.status.cachedPage[key] = 0;
                loadItemsByPage(index);
            }
            /**
             * [loadItemsByPage description]假分页
             * @param  {[type]} index    [description] PANEL 下标
             * @param  {[type]} currpage [description] 当前页
             * @return {[type]}          [description]
             */
            function loadItemsByPage(index) {
                var panel = $scope.data.panels[index],
                    cacheKey = $scope.data.panels[index].MDATE + $scope.data.panels[index].TYPE;
                var currpage = $scope.status.cachedPage[cacheKey];
                panel.DOCUMENTS = panel.DOCUMENTS || [];
                if (panel.DOCUMENTS.length == panel.COUNT) return;
                var cache = $cacheFactory.get($scope.status.cachedName);
                var addedItems = cache.get(cacheKey).slice(currpage * $scope.page.PAGESIZE, (currpage + 1) * $scope.page.PAGESIZE > panel.DOCCOUNT ? panel.DOCCOUNT : ((currpage + 1) * $scope.page.PAGESIZE));
                panel.DOCUMENTS = panel.DOCUMENTS.concat(addedItems);
                $scope.status.cachedPage[cacheKey] += 1;
            }



            /**
             * [cacheDate description] 缓存数据以供细览的上下翻页
             * @return {[type]} [description]
             */
            function cacheCurPageIds(data) {
                var copyData = [];
                angular.forEach(data, function(value, key) {
                    copyData = copyData.concat(value.DOCUMENTS);
                });
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
                    curSelectedArray.push(data[i].DOCUMENTS);
                }
                angular.forEach(curSelectedArray, function(data, index) {
                    angular.forEach(data, function(_data, _index) {
                        $scope.data.selectedArrat.push(_data);
                    });
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
             * [getCachedById description]点击版面加载缓存的数据，以提高页面加载速度
             * @param  {[type]} index [description]  panel下标
             * @return {[type]}       [description]
             */
            $scope.getCachedById = function(index) {
                setOpenedPanel(index);
                if (angular.isDefined($scope.data.panels[index].DOCUMENTS) && $scope.data.panels[index].DOCUMENTS.length > 0) return;
                else {
                    queryItemsBySource(index, false);
                }
            };
            /**
             * [setOpenedPanel description]将panel的开启状态保存到service中
             * @param {[type]} index [description]
             */
            function setOpenedPanel(index) {
                var key = $scope.data.panels[index].MDATE + $scope.data.panels[index].TYPE;
                for (var i in $scope.status.isOpenedPanel) {
                    $scope.status.cacheOpenedPanel[$scope.data.panels[i].MDATE + $scope.data.panels[i].TYPE] = $scope.status.isOpenedPanel[i];
                }
                $scope.status.cacheOpenedPanel[key] = !$scope.status.cacheOpenedPanel[key];
                editNewspaperService.cacheOpenedPanel($scope.status.cacheOpenedPanelKey, $scope.status.cacheOpenedPanel);
            }
            /**
             * [getIndexByBanMianId description] 按照版面ID查询所在下标
             * @param  {[type]} item  [description]
             * @param  {[type]} items [description]
             */
            function getIndexByBanMianId(item, items) {
                for (var i = 0; i < items.length; i++) {
                    if (item.TYPE === items[i].TYPE)
                        return i;
                }
            }

            /**
             * [newspaperMultiSelected description]报纸分类多选
             * @param  {[type]} items [description] 对象集合
             * @return {[type]}       [description]
             */
            $scope.newspaperMultiSelected = function(items) {
                if (angular.isUndefined(items) || items.length === 0) return;

                var judgement = determineItemsInSelectedArray(items);
                judgement ? removeItemsInSelectedArray(items) : addItemsToSelectedArray(items);

            };
            /**
             * [removeItemsInSelectedArray description] 将对象数组从已选中移除
             * @param  {[array]} items [description] array
             * @return {[type]}       [description]
             */
            function removeItemsInSelectedArray(items) {
                for (var i = 0; i < items.length; i++) {
                    if ($scope.data.selectedArray.indexOf(items[i]) > -1)
                        $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(items[i]), 1);
                }
            }
            /**
             * [addItemsToSelectedArray description]；将对象数组加入到已选数组中
             * @param {[type]} items [description] 传入的对象数组
             */
            function addItemsToSelectedArray(items) {
                for (var i = 0; i < items.length; i++) {
                    if ($scope.data.selectedArray.indexOf(items[i]) < 0)
                        $scope.data.selectedArray.push(items[i]);
                }
            }
            $scope.determineItemsInSelectedArray = function(items) {
                return determineItemsInSelectedArray(items);
            };
            /**
             * [determineItemsInSelectedArray description] 判断对象全部在已选列表中
             * @param  {[type]} items [description]
             * @return {[object]}       [description]  isAllIn :true 全在；
             */
            function determineItemsInSelectedArray(items) {
                var isAllIn = true;
                if (items.length === 0) return false;
                for (var i = 0; i < items.length; i++) {
                    if ($scope.data.selectedArray.indexOf(items[i]) < 0)
                        isAllIn = false;
                }
                return isAllIn;
            };
            /** [initOperFlag 邮件稿的取签见撤重] */
            function initOperFlag(data) {
                var documents = data;
                var docIds = trsspliceString.spliceString(documents, "METADATAID", ",");
                if (docIds) {
                    var params = angular.extend($scope.basicParams, {
                        MetaDataIds: docIds
                    });
                    resourceCenterService.getWcmTags(params).then(function(data) {
                        var temp = data;
                        for (var i in temp) {
                            if (angular.isDefined(data[i]) && data[i].OPERFLAG.indexOf("1") > -1) {
                                $scope.data.operFlags = $scope.data.operFlags.concat(data[i]);
                            }
                        }
                    });
                }
            };
            /**
             * [showOperFlag description] 显示取签见撤重标志
             * @param  {[type]} guid      [description]
             * @param  {[type]} flagIndex [description]
             * @return {[type]}           [description]
             */
            $scope.showOperFlag = function(guid, flagIndex) {
                var temp = queryItemBYGUID(guid);
                if (!!temp) {
                    return queryItemBYGUID(guid).OPERFLAG.substr(flagIndex, 1) == "1" ? true : false;
                } else {
                    return false;
                }
            };
            //打开取签见撤重窗口
            $scope.viewInfo = function(ChnlDocId, showRepeat) {
                var infoModal = resCtrModalService.infoModal(ChnlDocId, showRepeat);
            };
            /**
             * [queryItemBYGUID description] 根据guid获取在WCM内的取签见撤重的二进制数
             * @param  {[type]} guid [description]
             * @return {[type]}      [description]
             */
            function queryItemBYGUID(guid) {
                for (var i in $scope.data.operFlags) {
                    if (guid == $scope.data.operFlags[i].METADATAID) {
                        return $scope.data.operFlags[i];
                    }
                }
            };
            /**
             * [getESSearchParams description]设置ES检索参数
             * @return {[json]} [description] 参数对象
             */
            function getESSearchParams() {
                var esParams = {
                    searchParams: {
                        PAGESIZE: $scope.page.PAGESIZE + "",
                        PAGEINDEX: $scope.page.CURRPAGE + "",
                        searchFields: [{
                            searchField: "docType",
                            keywords: $scope.status.docTypeSelected.value == "0" ? "" : $scope.status.docTypeSelected.value
                        }, {
                            searchField: "newsType",
                            keywords: $scope.basicParams.nodeId
                        }, {
                            searchField: "timeType",
                            keywords: $scope.status.timeTypeSelected.value
                        }, {
                            searchField: $scope.status.allSelected.value,
                            keywords: $scope.keywords || ""
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
             * [fullTextSearch description;全文检索]
             * @param  {[type]} ev [description:按下空格也能提交]
             */
            $scope.fullTextSearch = function(ev) {
                if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                    $scope.status.isESSearch = true;
                    requestData().then(function() {
                        openSelectPanel();
                    });
                }
            };
            /**
             * [listenStorage description]监听本地缓存
             * @return {[promise]} [description] promise
             */
            function listenStorage() {
                localStorageService.set('newspaperPreviewSelectArray', []);
                storageListenerService.listenResource(function() {
                    requestData().then(function() {
                        openSelectPanel();
                    });
                    storageListenerService.removeListener("resource");
                });
            }
            /*******************************操作开始**********************************/
            /**
             * [printBtn description：打印]
             */
            $scope.printBtn = function() {
                angular.forEach($scope.data.selectedArray, function(value, key) {
                    requestPrintVersion(value).then(function(data) {
                        requestPrintData(value, data);
                    })
                });
            };
            /**
             * [requestPrintVersion description：打印请求流程]
             */
            function requestPrintVersion(item) {
                var deferred = $q.defer();
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), { serviceid: "mlf_metadatalog", methodname: "query", MetaDataId: item.METADATAID }, 'get').then(function(data) {
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
                    "methodname": $scope.status.methodname[item.DOCTYPEID],
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
            }

            /**
             * [export description;导出]
             */
            $scope.export = function() {
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
             * [openReserveDraftModal description;预留]
             */
            $scope.openReserveDraftModal = function() {
                var resCtrModalServiceModal = resCtrModalService.reserveDraft($scope.data.selectedArray);
                resCtrModalServiceModal.result.then(function(result) {
                    var metadataids = "";
                    angular.forEach(result.items, function(n, i) {
                        metadataids += "," + n.METADATAID;
                    });
                    result.MetaDataIds = metadataids.substr(1);
                    delete result.items;
                    result.SourceName = "资源中心-共享稿库-" + $scope.basicParams.nodename;
                    resourceCenterService.delayFetch(result).then(function(data) {
                        trsconfirm.alertType("预留成功!", "", "success", false, "");
                        requestData().then(function(data) {
                            openSelectPanel();
                        });
                    }, function() {
                        requestData().then(function(data) {
                            openSelectPanel();
                        });
                    });
                });
            };
            /**
             * [openTakeDraftModal description]取稿(by wang.jiang)
             * @return {[type]} [description]
             */
            $scope.openTakeDraftModal = function() {
                var ids = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
                var params = {
                    serviceid: "mlf_releasesource",
                    methodname: "fetch",
                    MetaDataIds: ids,
                    SourceName: "资源中心-共享稿库-" + $scope.basicParams.nodename
                }
                var isOnlyOne = ids.split(",").length > 1 ? false : true;
                var modalInstance = resCtrModalService.fullTakeDraft(params, isOnlyOne);
                modalInstance.result.then(function() {
                    requestData().then(function(data) {
                        openSelectPanel();
                    });
                }, function() {
                    requestData().then(function(data) {
                        openSelectPanel();
                    });
                });
            };
            /**
             * [collect description]收藏
             * @return {[type]} [description]
             */
            $scope.collect = function() {
                var ids = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
                var params = {
                    channelName: $scope.basicParams.channelName,
                    MetaDataIds: ids
                }
                resourceCenterService.collectDocs(params).then(function(data) {
                    trsconfirm.alertType("收藏成功!", "", "success", false, "");
                });
            };
            /**
             * [CreationAxis description]创作轴
             * @return {[type]} [description]
             */
            $scope.CreationAxis = function() {
                var ids = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
                var param = {
                    "MetaDataIds": ids,
                    "channelName": $scope.basicParams.channelName
                }
                resourceCenterService.setCreation(param).then(function(data) {
                    if (data.message) {
                        trsconfirm.alertType("", data.message, "error", false);
                    } else {
                        trsconfirm.alertType("该稿件已成功加入创作轴!", "", "success", false);
                    }
                });
            };
        }
    ])
