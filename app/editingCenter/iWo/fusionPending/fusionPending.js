/**
 *
 * Description 融合待编
 * Author: xu.chunlong 2015-12-07
 * Rebuild:wang.jiang 2016-2-23
 */
"use strict";
angular.module('fusionPendingModule', ["trsngsweetalert", 'trsNavLocationModule'])
    .controller('fusionPendingCtrl', ["$stateParams", "$filter", '$q', '$state', '$window', '$cacheFactory', '$scope', '$location', 'localStorageService', '$anchorScroll', 'trsHttpService', "trsconfirm", "$document", "$popover", "initVersionService", "$modal", "trsspliceString", "$timeout", "trsResponseHandle", 'initSingleSelecet', '$interval', 'editcenterRightsService', 'iWoService', 'editingCenterService', 'editNewspaperService', "trsPrintService", "storageListenerService", "pagePreview", "editIsLock",
        function($stateParams, $filter, $q, $state, $window, $cacheFactory, $scope, $location, localStorageService, $anchorScroll, trsHttpService, trsconfirm, $document, $popover, initVersionService, $modal, trsspliceString, $timeout, trsResponseHandle, initSingleSelecet, $interval, editcenterRightsService, iWoService, editingCenterService, editNewspaperService, trsPrintService, storageListenerService, pagePreview, editIsLock) {
            initStatus();
            init();

            function init() {
                requestData();
                initDropDown();
                listenStorage();
                $scope.promise = $interval(getTipInf, 2000);
                $scope.$on('$destroy', function() {
                    $interval.cancel($scope.promise);
                });
            }
            /**
             * [initStatus description]初始化
             * @return {[type]} [description]
             */
            function initStatus() {
                $scope.page = {
                    CURRPAGE: 1,
                    PAGESIZE: 10
                };
                $scope.params = {
                    "serviceid": "mlf_fusion",
                    "methodname": "queryDocumentsOfMediaInDaiBian",
                    "PAGESIZE": $scope.page.PAGESIZE,
                    "CURRPAGE": $scope.page.CURRPAGE,
                    "SiteId": "",
                    "OprTime": "1m",
                };
                $scope.status = {
                    currPanel: {},
                    openedPanel: {
                        0: true
                    },
                    jrgpreview: 1,
                    jrgedit: 1,
                    message: {
                        currUnreadNum: 0, //当前未读信息数
                        currLoopIndex: 0, //当前站点下标
                        messageSite: [], //缓存有数据站点
                        systemTime: "", //缓存最近请求时间
                        currSite: "",
                    },
                    icon: {
                        noVideo: '0',
                        noAudio: '0',
                        noPic: '0'
                    },
                    btnRights: [],
                    batchOperateBtn: {
                        "hoverStatus": "",
                        "clickStatus": ""
                    },
                    cachedName: "funsionPendingNewspaper", //缓存key
                    cachedPage: {}, //按照站点缓存非报纸的分页信息
                    cachedNewspaperPage: {}, //缓存报纸数据，按照paperid和banmianid
                    isNewsPanelOpenArray: {
                        0: true
                    },
                    draftType: {
                        news: "1",
                        atlas: "2",
                        subject: "3",
                        linkDoc: "4"
                    }
                };
                $scope.data = {
                    selectedArray: [],
                    panels: [],
                    newspaperChildPanels: [],
                    websitePreview: {
                        1: 'websiteNewsPreview',
                        2: 'websiteAtlasPreview',
                        3: 'websiteSubjectPreview',
                        4: 'websiteLinkPreview'
                    },
                    newspaperEdit: {
                        1: 'newspapertext',
                        2: 'newspaperpic',
                    },
                    websiteEdit: {
                        1: 'websitenews',
                        2: 'websiteatlas',
                        3: 'websitesubject',
                        4: 'websitelinkdoc'
                    },
                    newspaperPreview: {
                        1: "newspaperNewsPreview",
                        2: "newspaperAtlasPreview"
                    },
                    mediaType: {
                        app: '1',
                        website: '2',
                        newspaper: '3',
                    },

                };
            }
            /**
             * [listenStorage description]监听本地缓存
             * @return {[promise]} [description] promise
             */
            function listenStorage() {
                storageListenerService.listenWebsite(function() {
                    queryItemsBySiteId(false);
                    storageListenerService.removeListener("website");
                });
                storageListenerService.listenNewspaper(function() {
                    queryItemsBySiteId(false);
                    storageListenerService.removeListener("newspaper");
                });
                pagePreview.cleanCache();
                storageListenerService.listenSelectArray(function() {
                    $scope.data.selectedCurrents = angular.copy(localStorageService.get("newspaperPreviewSelectArray"));
                    $scope.$apply(function() {
                        $scope.data.selectedArray = pagePreview.selectCurArray($scope.data.selectedCurrents, $scope.data.selectedArrayObj);
                    });
                });
            }
            /**
             * [togglePanel description]切换panel展开关闭
             * @param  {[type]} panel [description] 被点击的panel
             * @return {[type]}       [description] null
             */
            $scope.togglePanel = function(panel) {
                if (panel.SITEID != $scope.status.currPanel.SITEID) {
                    $scope.status.currPanel = panel;
                    $scope.status.openedPanel = {};
                }
                if (!panel.DOCUMENTS) {
                    $scope.status.isESSearch = false;
                    queryItemsBySiteId(false);
                }
                getBtnRights(panel);
            };
            /**
             * [queryItemsBySiteId description] 根据站点请求数据
             * @param  {[type]}  site      [description] 传入站点
             * @param  {Boolean} isGetMore [description] 是否是获取更多
             * @return {[type]}            [description] nullu
             */
            function queryItemsBySiteId(isGetMore) {
                $scope.params.SiteId = $scope.status.currPanel.SITEID;
                var index = getIndexBySite($scope.status.currPanel, $scope.data.panels),
                    params = setCurrpage(isGetMore);
                var loopedSite = $scope.data.panels[index]; //被循环到的站点ID
                $scope.status.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    addItemsToPanel(isGetMore, index, data);
                    getBtnRights($scope.status.currPanel);
                    //刷新该站点最近请求的系统时间
                    getSystemTime().then(function(data) {
                        $scope.status.message[$scope.status.currPanel.SITEID] = data.LASTOPERTIME;
                        loopedSite.isInterval = true;
                        loopedSite.LASTOPRTIME = $scope.status.message.systemTime;
                        $scope.status.message.messageSite.shift();
                    });
                });
                $scope.data.selectedArray = [];
            }

            function addItemsToPanel(isGetMore, index, data) {
                //报纸
                if ($scope.status.currPanel.MEDIATYPE === $scope.data.mediaType.newspaper) {
                    if (data.length > 0) {
                        cacheNewspaperDate(data, index);
                        loadItemsByPage(0);
                    }
                }
                //$scope.data.panels[index].DOCUMENTS = data;
                //非报纸类简单数据类型
                if ($scope.status.currPanel.MEDIATYPE === $scope.data.mediaType.website) {
                    //判断是否记载更多
                    if (isGetMore) {
                        $scope.data.panels[index].DOCUMENTS.DATA = $scope.data.panels[index].DOCUMENTS.DATA.concat(data.DATA);
                        $scope.data.panels[index].DOCUMENTS.PAGER = data.PAGER;
                    } else {
                        handleData(data, index);
                    }

                }
            }
            /**
             * [handleData description:查询列表图示]
             */
            function handleData(items, index) {
                $scope.data.panels[index].DOCUMENTS = items;
                if (!items || items.length < 1 || items.DATA.length < 1) return;
                var params = {
                    serviceid: "mlf_myrelease",
                    methodname: "queryAllImgLogo",
                    metadataids: trsspliceString.spliceString(items.DATA, "METADATAID", ",")
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    angular.forEach(items.DATA, function(value, key) {
                        value.ALLIMG = data[value.METADATAID];
                    });
                });
            }
            /**
             * [loadItemsByPage description]报纸假分页
             * @param  {[type]} index    [description] 当前报纸产品版面下标
             * @return {[type]}          [description]
             */
            function loadItemsByPage(index) {
                var panel = $scope.status.currPanel.DOCUMENTS[index]; //获取报纸下的对应版面
                if (panel.DOCUMENTS.length == panel.DOCCOUNT) return;
                var key = panel.BANMIANID + panel.DATE;
                var currpage = $scope.status.cachedNewspaperPage[key];
                var cache = $cacheFactory.get($scope.status.cachedName);
                var addedItems = cache.get(key).slice(currpage * $scope.page.PAGESIZE, (currpage + 1) * $scope.page.PAGESIZE > panel.DOCCOUNT ? panel.DOCCOUNT : ((currpage + 1) * $scope.page.PAGESIZE));
                panel.DOCUMENTS = panel.DOCUMENTS.concat(addedItems);
                $scope.status.cachedNewspaperPage[key] += 1;
            }
            /**
             * [loadMore description]加载网站等非报纸更多数据
             * @return {[type]} [description] null
             */
            $scope.loadMore = function() {
                $scope.status.cachedPage[$scope.status.currPanel.SITEID] = angular.isUndefined($scope.status.cachedPage[$scope.status.currPanel.SITEID]) ? 2 : $scope.status.cachedPage[$scope.status.currPanel.SITEID] + 1;
                queryItemsBySiteId(true);
            };
            /**
             * [cacheNewspaperDate description：检查是否选中了某种类型的稿件on]缓存报纸数据已提高渲染速度
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            function cacheNewspaperDate(data, index) {
                if ($cacheFactory.get($scope.status.cachedName)) $cacheFactory.get($scope.status.cachedName).destroy();
                var copyedData = angular.copy(data);
                var cache = $cacheFactory($scope.status.cachedName);
                for (var i in copyedData) {
                    cache.put(copyedData[i].BANMIANID + copyedData[i].DATE, copyedData[i].DOCUMENTS);
                    copyedData[i].DOCUMENTS = [];
                    $scope.status.cachedNewspaperPage[copyedData[i].BANMIANID + copyedData[i].DATE] = 0;
                }
                $scope.status.currPanel.DOCUMENTS = copyedData;
                $scope.data.panels[index].DOCUMENTS = copyedData;
                //加载打开的报纸缓存数据
                var isNewsPanelOpen = $scope.status.isNewsPanelOpenArray;
                for (var isNewSpaper in isNewsPanelOpen) {
                    var newSpaper = isNewsPanelOpen[isNewSpaper];
                    if (newSpaper) {
                        $scope.getCachedById(isNewSpaper);
                    }
                }

            }
            /**
             * [getCachedById description]点击报纸的版面加载缓存的数据，以提高页面加载速度
             * @param  {[type]} index [description]  版面下标
             * @return {[type]}       [description]
             */
            $scope.getCachedById = function(index) {
                if ($scope.status.currPanel.DOCUMENTS[index].DOCUMENTS.length > 0) return;
                $scope.loadingPromise = loadItemsByPage(index);
            };
            /**
             * [loadMoreNewspaper description] 报纸加载更多
             * @param  {[type]} index [description] 版面下标
             * @return {[type]}       [description]
             */
            $scope.loadMoreNewspaper = function(index) {
                $scope.loadingPromise = loadItemsByPage(index);
            };
            /**
             * [setCurrpage description] 设置当前页
             * @param {Boolean} isGetMore [description] 
             */
            function setCurrpage(isGetMore) {
                //判断是否启用ES检索
                var params = $scope.status.isESSearch ? getESSearchParams(isGetMore) : angular.copy($scope.params);
                //判断是从WCM加载更多
                if (isGetMore && !$scope.status.isESSearch) params.CURRPAGE = $scope.status.cachedPage[$scope.status.currPanel.SITEID.toString()];
                return params;
            }
            /**
             * [getIndexBySite description]获取所选站点在站点中的下标
             * @param  {[type]} item  [description] 站点
             * @param  {[type]} items [description] 站点结合
             * @return {[type]}       [description]
             */
            function getIndexBySite(item, items) {
                for (var i = 0; i < items.length; i++) {
                    if (item.SITEID === items[i].SITEID)
                        return i;
                }
            }
            /**
             * [canncelSelectAll description]取消全选
             * @return {[type]} [description] null
             */
            $scope.canncelSelectAll = function() {
                $scope.data.selectedArray = [];
            };
            /**
             * [draftCorrelationView description]关联高
             * @return {[type]} [description] null
             */
            $scope.draftCorrelationView = function(item) {
                editNewspaperService.draftCorrelationViews(item.METADATAID, item.SITEID, 1);
            };
            /**
             * [batchExport description]导出
             * @return {[type]} [description] null
             */
            $scope.batchExport = function() {
                if (checkDraftType($scope.status.draftType.subject) || checkDraftType($scope.status.draftType.linkDoc)) {
                    trsconfirm.alertType("只能导出新闻稿或图集稿", '', "error", false);
                    return;
                };
                var params = {
                    serviceid: 'mlf_exportword',
                    methodname: 'exportWordFile',
                    MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
                };
                $scope.status.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
                });
            };
            /**
             * [checkDraftType description：检查是否选中了某种类型的稿件]
             * @params typeId 稿件ID
             * return 若有该类型则返回true
             */
            function checkDraftType(typeId) {
                var flag = false;
                for (var i = 0; i < $scope.data.selectedArray.length; i++) {
                    if ($scope.data.selectedArray[i].DOCTYPEID == typeId) {
                        flag = true;
                        break;
                    }
                }
                return flag;
            }
            /**
             * [paperDraftCount description]获取报纸稿件总数
             * @return {[type]} [description] int
             */
            $scope.paperDraftCount = function(items) {
                if (angular.isDefined(items.DOCUMENTS)) {
                    var count = 0;
                    for (var i = 0; i < items.DOCUMENTS.length; i++) {
                        count += parseInt(items.DOCUMENTS[i].DOCCOUNT);
                    }
                    return count;
                }
            };
            /**
             * [directSigned description]直接签发
             * @return {[type]} [description] null
             */
            $scope.directSigned = function() {
                trsconfirm.confirmModel('签发', '确认发布稿件', function() {
                    var arrayChnldocIDs = trsspliceString.spliceString($scope.data.selectedArray,
                        "CHNLDOCID", ',');
                    signed(arrayChnldocIDs, $scope.status.currPanel);
                });
            };
            /**
             * [timingSigned description]多项定时签发
             * @return {[type]} [description] null
             */
            $scope.timingSigned = function() {
                timeSigned();
            };
            /**
             * [batchTrail description]批量送审
             * @return {[type]} [description] null
             */
            $scope.batchTrail = function() {
                trial(trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","), trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ","), $scope.status.currPanel);
            };
            /**
             * [goto description]锚点定位
             * @param  {[type]} id [description] 锚点ID
             * @return {[type]}    [description]
             */
            $scope.goto = function(id) {
                $location.hash(id);
                $anchorScroll();
            };

            /**
             * [singleTrial description]单个送审
             * @param  {[type]} item  [description]
             * @param  {[type]} items [description]
             * @return {[type]}       [description]
             */
            $scope.singleTrial = function(item, items) {
                trial(item.METADATAID, item.CHNLDOCID, items);
            };
            /**
             * [immediateSinged description]单项直接签发
             * @param  {[type]} item  [description]
             * @param  {[type]} items [description]
             * @return {[type]}       [description]
             */
            $scope.immediateSinged = function(item, items) {
                trsconfirm.confirmModel('签发', '确认发布稿件', function() {
                    signed(item.CHNLDOCID, items);
                });
            };
            $scope.refreshPanel = function() {
                queryItemsBySiteId(false);
            };
            //加载更多
            $scope.loadMore = function() {
                $scope.status.cachedPage[$scope.status.currPanel.SITEID] = angular.isUndefined($scope.status.cachedPage[$scope.status.currPanel.SITEID]) ? 2 : $scope.status.cachedPage[$scope.status.currPanel.SITEID] + 1;
                queryItemsBySiteId(true);
            };


            //根据选择日期查询
            // $scope.queryByTimeType = function() {
            //     $scope.params.OprTime = angular.copy($scope.timeType).value;
            //     requestData();
            //     //queryItemsBySiteId(false);
            // };

            /**
             * [queryByDropdown description] 筛选条件触发后请求数据
             * @param  {[type]} key   [description] 请求对象参数key
             * @param  {[type]} value [description] 请求对象值
             * @return {[type]}       [description] null
             */
            $scope.queryByDropdown = function(key, value) {
                $scope.params[key] = value;
                $scope.params.CurrPage = $scope.status.copyCurrPage = $scope.page.CURRPAGE = "1";
                if (key == 'OprTime') {
                    if (value.length < 10) {
                        $scope.params.OprTimeStart = null;
                        $scope.params.OprTimeEnd = null;
                    } else {
                        $scope.params.OprTimeStart = $scope.data.fromdate;
                        $scope.params.OprTimeEnd = $scope.data.untildate;
                        $scope.params[key] = null;
                    }
                }
                requestData();
            };

            /**
             * [restoreItem description:ES排序方式下拉]
             */
            $scope.queryByESSearch = function() {
                queryItemsBySiteId(false);
            };

            function initDropDown() {
                //初始化选择日期
                $scope.timeTypeJsons = initSingleSelecet.chooseTimeType();
                $scope.timeType = angular.copy($scope.timeTypeJsons[3]);
                //初始化全部
                $scope.iWoAll = initSingleSelecet.iWoEntire();
                $scope.iWoAllSelected = angular.copy($scope.iWoAll[0]);
                // 排序方式
                $scope.sortTypeJsons = initSingleSelecet.sortType();
                $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
            }

            function requestData() {
                var params = {
                    serviceid: "mlf_fusion",
                    methodname: 'queryDocumentsInDaiBian',
                    OprTime: $scope.params.OprTime,
                };
                $scope.status.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                    $scope.data.panels = data;
                    var panels = $scope.status.openedPanel;
                    for (var i in panels) {
                        var item = panels[i];
                        if (item == true && data[i].DOCCOUNT > 0) {
                            $scope.status.openedPanel[i] = true;
                            //获取打开panel产品数据
                            $scope.status.currPanel = data[i];
                            queryItemsBySiteId(false);
                            return false;
                        }
                    }


                });
            }

            /**
             * [singleSelect description]单选
             * @param  {[type]} item [description] 单个对象
             * @return {[type]}      [description] null
             */
            $scope.singleSelect = function(item) {
                if ($scope.data.selectedArray.length > 0 && $scope.data.selectedArray[0].SITEID !== item.SITEID) {
                    trsconfirm.alertType('无效操作', "不可跨产品选择稿件", "error", false);
                    return;
                }
                // var index = $scope.data.selectedArray.indexOf(item);
                // index > -1 ? $scope.data.selectedArray.splice(index, 1) : $scope.data.selectedArray.push(item);
                var index = getIndex(item);
                index > -1 ? $scope.data.selectedArray.splice(index, 1) : $scope.data.selectedArray.push(item);
            };
            /**
             * [multiSelect description]非报纸类全选
             * @param  {[type]} items [description] 多个对象
             * @return {[type]}       [description] null
             */
            $scope.multiSelect = function(items) {
                if (angular.isUndefined(items) || items.length === 0) return;
                if ($scope.data.selectedArray.length > 0 && $scope.data.selectedArray[0].SITEID !== items[0].SITEID) {
                    trsconfirm.alertType('无效操作', "不可跨产品选择稿件", "error", false);
                    return;
                }
                $scope.data.selectedArray = $scope.data.selectedArray.length == items.length ? [] : [].concat(items);
            };
            /**
             * [newspaperMultiSelected description]报纸分类多选
             * @param  {[type]} items [description] 对象集合
             * @return {[type]}       [description]
             */
            $scope.newspaperMultiSelected = function(items) {
                if (angular.isUndefined(items) || items.length === 0) return;
                if ($scope.data.selectedArray.length > 0 && $scope.data.selectedArray[0].SITEID !== items[0].SITEID) {
                    trsconfirm.alertType('无效操作', "不可跨产品选择稿件", "error", false);
                    return;
                }
                var judgement = determineItemsInSelectedArray(items);
                if (judgement) removeItemsInSelectedArray(items);
                else {
                    addItemsToSelectedArray(items);
                }
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
            }

            /**
             * [getTipInf description]
             * @return {[type]} [description]
             */
            function getTipInf() {
                var loopedSite = $scope.data.panels[$scope.status.message.currLoopIndex]; //被循环到的站点ID
                var params = {
                    "serviceid": "mlf_fusion",
                    "methodname": "queryDocCountOfMediaInDaiBian",
                    "OprTime": loopedSite.LASTOPRTIME,
                    "SiteId": loopedSite.SITEID,
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    if (data.replace(/"/g, '') > 0) {
                        $scope.status.message.currUnreadNum = data.replace(/"/g, '');
                        $scope.status.message.currSite = loopedSite;
                        loopedSite["isInterval"] = false;
                        loopedSite['currUnreadNum'] = data.replace(/"/g, '');
                        $scope.status.message.messageSite.push(loopedSite);
                    }
                });
                $scope.status.message.currLoopIndex = $scope.status.message.currLoopIndex + 2 > $scope.data.panels.length ? 0 : $scope.status.message.currLoopIndex + 1;
            }
            /**
             * [getSystemTime description]获取系统时间
             * @return {[promise]} [description]promise
             */
            function getSystemTime() {
                var deferred = $q.defer();
                var params = {
                    serviceid: "mlf_fusion",
                    methodname: "getServiceTime"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        $scope.status.message.systemTime = data.LASTOPERTIME;
                        $scope.status.message[$scope.data.panels[$scope.status.message.currLoopIndex].SITEID] = data.LASTOPERTIME;
                        deferred.resolve(data);
                    });
                return deferred.promise;
            }
            /**
             * [refreshPanelByLoopIndex description]
             * @return {[type]} [description]
             */
            $scope.refreshPanelByLoopIndex = function() {
                // $scope.goto($scope.status.message.currSite.SITEID);
                $scope.status.openedPanel = {};
                $scope.status.message.currUnreadNum = 0;
                // $scope.status.openedPanel[5] = true;
                $scope.status.openedPanel[getIndexBySite($scope.status.message.currSite, $scope.data.panels)] = true;
                // console.log(getIndexBySite($scope.status.message.currSite, $scope.data.panels)); 
                // 这里没问题
                $scope.status.currPanel = angular.copy($scope.status.message.currSite);
                queryItemsBySiteId(false);
            };
            /**
             * [showVersionTime description]获取流程版本与操作日志
             * @param  {[obj]} item [description]列表数据
             * @return {[type]}      [description]
             */
            $scope.showVersionTime = function(item) {
                editingCenterService.getVersionTime(item, false);
            };
            /**
             * [selectedChannelId description]过滤器过滤移动稿件CHANNELID不相同的情况
             * @param  {[type]} elm [description]传入的值
             * @return {[type]}     [description]
             */
            $scope.filterChannelId = function(elm) {
                if (angular.isDefined(elm.CHANNELID)) {
                    return elm.CHANNELID == $scope.data.selectedArray[0].CHANNELID;
                }
            };
            /**
             * [trial description]稿件送审
             * @param  {[type]} MetaDataIds [description]稿件ID
             * @param  {[type]} ChnlDocIds  [description]稿件ID
             * @param  {[type]} items       [description]选中集合
             * @return {[type]}             [description]
             */
            function trial(MetaDataIds, ChnlDocIds, items) {
                var temp = $filter('pick')($scope.data.selectedArray, $scope.filterChannelId);
                if (temp.length === $scope.data.selectedArray.length) {
                    trsconfirm.inputModel("送审", "送审意见（可选）", function(content) {
                        var params = {
                            "serviceid": "mlf_websiteoper",
                            "methodname": "trialMetaDatas",
                            "MetaDataIds": MetaDataIds,
                            "ChnlDocIds": ChnlDocIds,
                            "CurrChnlId": $scope.data.selectedArray[0].CHANNELID,
                            "Opinion": content
                        };
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                            .then(function(data) {
                                trsconfirm.alertType("送审成功", "", "success", false);
                                requestData();
                                $scope.status.cachedPage[$scope.status.currPanel.SITEID] = 1;
                            });
                    });
                } else {
                    trsconfirm.alertType("稿件送审失败", "所选稿件不属于同一栏目", "error", false);
                }
            }
            //签发函数
            function signed(arrayChnldocIDs, items) {
                var params = {
                    serviceid: "mlf_websiteoper",
                    methodname: "webDaiBianPublish",
                    ObjectIds: arrayChnldocIDs,
                    ChnlDocIds: arrayChnldocIDs
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(
                    function(data) {
                        trsconfirm.alertType("签发成功", "", "success", false);
                        requestData();
                        $scope.status.cachedPage[$scope.status.currPanel.SITEID] = 1;
                    },
                    function() {
                        requestData();
                        $scope.status.cachedPage[$scope.status.currPanel.SITEID] = 1;
                    });
            }
            //定时签发函数
            function timeSigned() {
                var params = {
                    selectedArray: $scope.data.selectedArray,
                    isNewDraft: false,
                    methodname: "webDaiBianTimingPublish"
                };
                editingCenterService.draftTimeSinged(params).then(function(data) {
                    trsconfirm.alertType("定时签发成功", "", "success", false);
                    requestData();
                    $scope.status.cachedPage[$scope.status.currPanel.SITEID] = 1;
                }, function() {
                    requestData();
                    $scope.status.cachedPage[$scope.status.currPanel.SITEID] = 1;
                });
            }
            //搜索
            //批量上版操作
            $scope.banchShangban = function() {
                shanban($scope.data.selectedArray);
            };
            $scope.singleShangBan = function(item) {
                shanban([item]);
            };
            //上版函数
            function shanban(item) {
                var transferData = {
                    "title": "上版",
                    "opinionTit": "上版意见",
                    "selectedArr": item,
                    "isShowDate": true,
                    "relatedManuMethod": "queryRelateDocsInJinRi",
                    "PaperId": item[0].SITEID,
                    "queryMethod": "queryToDayDocs"
                };
                editNewspaperService.changeLayoutDraft(transferData, function(result) {
                    var params = {
                        serviceid: "mlf_paper",
                        methodname: "doShangBanJinRi",
                        SrcDocIds: result.srcdocids,
                        BanMianID: result.banmianid,
                        PubDate: result.dateStr,
                        Option: result.option,
                        SrcBanMianIds: result.SrcBanMianIds,
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
                        trsconfirm.alertType("上版成功", "", "success", false);
                        queryItemsBySiteId(false);
                    });
                });
            }
            //批量退稿操作
            $scope.banchRejection = function() {
                rejectionDraftofPage($scope.data.selectedArray);
            };
            //单个退稿操作
            $scope.singleRejection = function(item) {
                rejectionDraftofPage([item]);
            };
            //退稿函数
            function rejectionDraftofPage(item) {
                var transferData = {
                    "PaperId": $scope.status.currPanel.SITEID,
                    "queryMethod": "queryToDayDocs",
                    "item": item,
                    "rejecectionMethod": "rejectionJinRiViewDatas",
                };
                editNewspaperService.rejectionDraft(transferData, function(result) {
                    queryItemsBySiteId(false);
                }, function(result) {
                    queryItemsBySiteId(false);
                });
            }
            //外发
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
                    methodname: "iFusionDaiBianSendEmail",
                    Emails: userids,
                    MetaDataIds: draftids
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("邮件外发成功", "", "success", false, function() {
                        queryItemsBySiteId(false);
                    });
                });
            }
            /**
             * [fullTextSearch description;全文检索]
             * @param  {[type]} ev [description:按下空格也能提交]
             */
            $scope.fullTextSearch = function(ev) {
                $scope.status.cachedPage[$scope.status.currPanel.SITEID] = 1;
                if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                    $scope.status.isESSearch = true;
                    queryItemsBySiteId(false);
                    /*trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), getESSearchParams(), "post").then(function(data) {
                        $scope.data.panels[index].DOCUMENTS.DATA = data.DATA;
                        //$scope.page = $scope.status.currPanel.MEDIATYPE !== $scope.data.mediaType.newspaper ? data.PAGER : "";
                    });*/
                }
            };
            /**
             * [isLockEdit description:编辑前请求解锁]
             * @param  {[type]} item [description:稿件对象]
             */
            $scope.isWebistLockEdit = function(item) {
                editIsLock.isLock(item).then(function(data) {
                    var editPath = $scope.data.websiteEdit[item.DOCTYPEID];
                    var editParams = {
                        channelid: item.CHANNELID,
                        chnldocid: item.CHNLDOCID,
                        metadataid: item.METADATAID,
                        siteid: item.SITEID,
                        status: 0
                    };
                    var editUrl = $state.href(editPath, editParams);
                    if (data.ISLOCK == "false") {
                        $window.open(editUrl);
                    } else {
                        trsconfirm.alertType("稿件已经被【" + data.LOCKUSER + "】锁定,是否强制解锁", "", "warning", true, function() {
                            editIsLock.forceDeblocking(item).then(function(data) {
                                $window.open(editUrl);
                            });
                        }, function() {});
                    }
                });
            };
            /**
             * [getESSearchParams description]设置ES检索参数
             * @return {[json]} [description] 参数对象
             */
            function getESSearchParams(isGetMore) {
                var esParams = {
                    serviceid: "mlf_essearch",
                    methodname: "queryForIwoFusionDaiBianDoc",
                    searchParams: {
                        PAGESIZE: $scope.page.PAGESIZE + "",
                        PAGEINDEX: isGetMore ? $scope.status.cachedPage[$scope.status.currPanel.SITEID] + "" : "1",
                        searchFields: [{
                            searchField: $scope.iWoAllSelected.value,
                            keywords: $scope.keywords ? $scope.keywords : ""
                        }, {
                            searchField: 'timeType',
                            keywords: $scope.timeType.value
                        }, {
                            searchField: 'siteid',
                            keywords: $scope.status.currPanel.SITEID
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
             * [print description]批量打印功能
             * @return {[type]} [description]
             */
            $scope.print = function() {
                var metaDataIds = [];
                for (var i = 0; i < $scope.data.selectedArray.length; i++) {
                    var selectType = [$scope.data.selectedArray[i]];
                    if (selectType.length) {
                        metaDataIds.push(trsspliceString.spliceString(selectType,
                            'METADATAID', ','));
                    }
                }
                var params = {
                    serviceid: "mlf_paper",
                    methodname: "queryViewDatas",
                    MetaDataIds: metaDataIds.join(",")
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsPrintService.trsPrintDocument(data);
                });
            };
            /**
             * [getBtnRights description]获得按钮权限
             * @return {[type]} [description]
             */
            function getBtnRights(panel) {
                if (panel.DOCCOUNT < 1) return;
                if (panel.MEDIATYPE == $scope.data.mediaType.website) {
                    $scope.status.btnRights = "";
                } else if (panel.MEDIATYPE == $scope.data.mediaType.newspaper) {
                    editcenterRightsService.initNewspaperListBtn("paper.jrg", panel.SITEID).then(function(data) {
                        $scope.status.btnRights = data;
                    });
                }
            }
            /**
             * [newspaperPerview description]获得当前报纸预览页
             * @param {[param]} [item] [description]   当前报纸列表集合
             * @param {[param]} [paperItem] [description]   当前报纸item
             */

            $scope.newspaperPerview = function(item, paperItem) {

                var editPath = 'newspaperNewsPreview';
                var editParams = {
                    paperid: paperItem.SITEID,
                    metadata: paperItem.METADATAID,
                    newspapertype: $scope.status.jrgpreview
                };
                var editUrl = $state.href(editPath, editParams);
                pagePreview.selectedArrayCahe($scope.data.selectedArray);
                listItemCache(item);
                $window.open(editUrl);
            };
            /**
             * [cacheDate description] 缓存存储
             * @return {[type]} [description]
             */
            function listItemCache(data) {
                $scope.data.selectedArrayObj = [];
                for (var i = 0; i < data.DOCUMENTS.length; i++) {
                    $scope.data.selectedArrayObj.push(data.DOCUMENTS[i]);
                }
                pagePreview.listItemCache(data.DOCUMENTS);
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
             * [isLockEdit description:编辑前请求解锁]
             * @param  {[type]} item [description:稿件对象]
             */
            $scope.isLockEdit = function(item) {
                editIsLock.isLock(item).then(function(data) {
                    var editPath = $scope.data.newspaperEdit[(item.DOCTYPEID)];
                    var editParams = {
                        chnldocid: item.CHNLDOCID,
                        metadata: item.METADATAID,
                        paperid: item.SITEID,
                        newspapertype: $scope.status.jrgedit
                    };
                    var editUrl = $state.href(editPath, editParams);
                    if (data.ISLOCK == "false") {
                        $window.open(editUrl);
                    } else {
                        trsconfirm.alertType("稿件已经被【" + data.LOCKUSER + "】锁定,是否强制解锁", "", "warning", true, function() {
                            editIsLock.forceDeblocking(item).then(function(data) {
                                $window.open(editUrl);
                            });
                        }, function() {});
                    }
                });
            };
        }
    ]);
