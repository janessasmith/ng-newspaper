/**
 * Description:今日稿 
 *
 * Author:ma.rongqin 2015-12-03
 *
 * Rebuild:xu.chunlong 2016-02-25
 */
"use strict";
angular.module('newspaperTodaysDraftModule', ["newspaperTodaysDraftRouterModule"])
    .controller('newspaperTodaysDraftCtrl', ["$scope", '$filter', '$state', "$stateParams", '$window', '$cacheFactory', '$q', "$modal", "trsHttpService", "SweetAlert", "initSingleSelecet", "editNewspaperService", "trsspliceString", "trsconfirm", "editingCenterService", "editcenterRightsService", "$interval", "initVersionService", "trsPrintService", "localStorageService", "storageListenerService", "globleParamsSet", "editIsLock",
        function($scope, $filter, $state, $stateParams, $window, $cacheFactory, $q, $modal, trsHttpService, SweetAlert, initSingleSelecet, editNewspaperService, trsspliceString, trsconfirm, editingCenterService, editcenterRightsService, $interval, initVersionService, trsPrintService, localStorageService, storageListenerService, globleParamsSet, editIsLock) {
            initStatus();
            init();

            function initStatus() {
                $scope.page = {
                    "CURRPAGE": 1,
                    "PAGESIZE": 20 || globleParamsSet.getPageSize()
                };

                $scope.params = {
                    "serviceid": "mlf_paper",
                    "methodname": "queryToDayDocs",
                    "PaperId": $stateParams.paperid,
                    "OprTime": "1m",
                };

                $scope.status = {
                    openedPanel: {
                        0: true,
                        /* 1: true,
                         2: true,*/
                    },
                    cacheOpenedPanel: {},
                    cacheOpenedPanelKey: "jrg",
                    batchOperateBtn: {
                        "hoverStatus": "",
                        "clickStatus": ""
                    },
                    message: {
                        currUnreadNum: 0, //当前未读信息数
                        systemTime: "", //缓存最近请求时间
                    },
                    btnRights: [],
                    currSite: {},
                    paperid: $stateParams.paperid,
                    isESSearch: false,
                    cachedName: "newspaperTodayDocuments",
                    cachedPage: {},
                    jrgpreview: 1,
                    jrgedit: 1,
                    //编辑页面
                    newspaperEdit: editNewspaperService.initNewspaperEdit(),
                };

                $scope.data = {
                    paperId: $stateParams.paperid,
                    panels: [],
                    selectedArray: [],
                    newspaperPreview: {
                        1: "newspaperNewsPreview",
                        2: "newspaperAtlasPreview"
                    },
                    msSpecialNeedArr:["广告提交库","编辑广告提交库","编辑新闻中心提交库","新闻中心"]
                };
            }

            function init() {
                requestData();
                initDropDown();
                initBtnRights();
                initCurrSite();
                listenStorage();
                $scope.promise = $interval(getTipInf, 60000);
                $scope.$on('$destroy', function() {
                    $interval.cancel($scope.promise);

                });
                // getSystemTime(); //获取上次刷新时间
                // 
            }

            /**
             * [getTipInf description]
             * @return {[type]} [description]
             */
            function getTipInf() {
                var params = {
                    "serviceid": "mlf_fusion",
                    "methodname": "queryDocCountOfMediaInDaiBian",
                    "OprTime": $scope.status.message.systemTime,
                    "SiteId": $scope.params.PaperId,
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    if (data.replace(/"/g, '') > 0) {
                        $scope.status.message.currUnreadNum = +data.replace(/"/g, '');
                    }

                });
                //$scope.status.message.currLoopIndex = $scope.status.message.currLoopIndex + 2 > $scope.data.panels.length ? 0 : $scope.status.message.currLoopIndex + 1;
            }
            //初始化数据
            function requestData() {
                var deferred = $q.defer();
                var params = $scope.status.isESSearch ? getESSearchParams() : angular.copy($scope.params);
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                    cacheDate(data);
                    if (data.length > 0) {
                        openDefaultPanels();
                    }
                    getSystemTime();
                    deferred.resolve();
                });
                $scope.data.selectedArray = [];
                return deferred.promise;
            }
            /**
             * [getObjLength description]获得权限长度
             * @param  {[type]} obj [description]
             * @return {[type]}     [description]
             */
            function getObjLength(obj) {
                var size = 0,
                    key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                $scope.status.btnLength = size;
            }
            /**
             * [openDefaultPanels description]  打开默认的PANEL
             * @return {[type]} [description]
             */
            function openDefaultPanels() {
                var tempOpenedPanels = editNewspaperService.getCacheOpenedPanel($scope.status.cacheOpenedPanelKey);

                if (angular.isUndefined(tempOpenedPanels)) {
                    loadItemsByPage(0);
                    return;
                }
                $scope.status.openedPanel = {};
                // $scope.status.openedPanel[0] = false;
                for (var i in $scope.data.panels) {
                    if (tempOpenedPanels[$scope.data.panels[i].BANMIANID] === true) {
                        $scope.status.openedPanel[i] = true;
                        loadItemsByPage(i);
                    }
                }
            }

            /**
             * [cacheDate description] 缓存数据已提高渲染速度
             * @return {[type]} [description]
             */
            function cacheDate(data) {
                if ($cacheFactory.get($scope.status.cachedName)) $cacheFactory.get($scope.status.cachedName).destroy();
                var copyedData = angular.copy(data);
                var cache = $cacheFactory($scope.status.cachedName);
                var documents = [];
                for (var i in copyedData) {
                    cache.put(copyedData[i].BANMIANID, copyedData[i].DOCUMENTS);
                    documents.push(copyedData[i].DOCUMENTS);
                    copyedData[i].DOCUMENTS = [];
                    $scope.status.cachedPage[copyedData[i].BANMIANID] = 0;
                }
                $scope.data.panels = copyedData;
                listItemCache(documents);

            }
            /**
             * [cacheDate description] 缓存存储
             * @return {[type]} [description]
             */
            function listItemCache(data) {
                var cachePreviewMetadataid = [];
                $scope.data.selectedArrayObj = [];
                angular.forEach(data, function(data, index, array) {
                    angular.forEach(data, function(_data, _index, _array) {
                        cachePreviewMetadataid.push(_data.METADATAID);
                        $scope.data.selectedArrayObj.push(_data);
                    });
                });
                localStorageService.set("newspaperPreviewCache", cachePreviewMetadataid);
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

            //监听预览页 按钮点击
            $window.addEventListener("storage", function(e) {
                $scope.data.selectedCurrents = angular.copy(localStorageService.get("newspaperPreviewSelectArray"));
                $scope.$apply(function() {
                    selectCurArray($scope.data.selectedCurrents);
                });
            });
            /**
             * [forArray description] 遍历出选择对象
             * @curSelectedArray {[type]} [description]  当前选中对象
             */
            function selectCurArray(curSelectedArray) {
                if (curSelectedArray === null) return;
                //var arrays=[];
                $scope.data.selectedArray = [];
                for (var i = 0; i < curSelectedArray.length; i++) {
                    for (var j = 0; j < $scope.data.selectedArrayObj.length; j++) {
                        if (curSelectedArray[i] === $scope.data.selectedArrayObj[j].METADATAID) {
                            $scope.data.selectedArray.push($scope.data.selectedArrayObj[j]);
                        }
                    }
                }
            }

            $scope.isChecked = function(item) {
                return getIndex(item) >= 0;
            };

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
             * [newspaperPreview description] 报纸预览
             * @param  {[type]} item [description] 当前对象
             */
            $scope.newspaperPreview = function(item) {
                var editPath = 'newspaperNewsPreview';
                var editParams = {
                    paperid: item.SITEID,
                    metadata: item.METADATAID,
                    newspapertype: $scope.status.jrgpreview,
                    doctype:item.DOCTYPEID
                };
                var editUrl = $state.href(editPath, editParams);
                // selectedArrayCahe($scope.data.selectedArray);
                $window.open(editUrl);
            };
            /**
             * [loadItemsByPage description]假分页
             * @param  {[type]} index    [description] PANEL 下标
             * @param  {[type]} currpage [description] 当前页
             * @return {[type]}          [description]
             */
            function loadItemsByPage(index) {
                var panel = $scope.data.panels[index];
                var currpage = $scope.status.cachedPage[panel.BANMIANID];
                if (panel.DOCUMENTS.length == panel.DOCCOUNT) return;
                var cache = $cacheFactory.get($scope.status.cachedName);
                var addedItems = cache.get(panel.BANMIANID).slice(currpage * $scope.page.PAGESIZE, (currpage + 1) * $scope.page.PAGESIZE > panel.DOCCOUNT ? panel.DOCCOUNT : ((currpage + 1) * $scope.page.PAGESIZE));
                panel.DOCUMENTS = panel.DOCUMENTS.concat(addedItems);
                $scope.status.cachedPage[panel.BANMIANID] += 1;
                // console.log('a');
            }

            function cacheOpenedPanel(index) {

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
            /**
             * [getCachedById description]点击版面加载缓存的数据，以提高页面加载速度
             * @param  {[type]} index [description]  panel下标
             * @return {[type]}       [description]
             */
            $scope.getCachedById = function(index) {
                setOpenedPanel(index);
                if ($scope.data.panels[index].DOCUMENTS.length > 0) return;
                else {
                    $scope.loadingPromise = loadItemsByPage(index);
                }
            };
            /**
             * [setOpenedPanel description]将panel的开启状态保存到service中
             * @param {[type]} index [description]
             */
            function setOpenedPanel(index) {
                for (var i in $scope.status.openedPanel) {
                    $scope.status.cacheOpenedPanel[$scope.data.panels[i].BANMIANID] = $scope.status.openedPanel[i];
                }
                $scope.status.cacheOpenedPanel[$scope.data.panels[index].BANMIANID] = !$scope.status.cacheOpenedPanel[$scope.data.panels[index].BANMIANID];
                editNewspaperService.cacheOpenedPanel($scope.status.cacheOpenedPanelKey, $scope.status.cacheOpenedPanel);
            }
            //初始化下拉框
            function initDropDown() {
                //初始化选择类型
                $scope.data.docTypeArray = initSingleSelecet.newspaperDraftType();
                $scope.data.selectedDocType = angular.copy($scope.data.docTypeArray[0]);
                //初始化选择日期
                $scope.data.timeTypeArray = initSingleSelecet.newspaperDraftTime();
                $scope.data.selectedTimeType = angular.copy($scope.data.timeTypeArray[3]);
                //初始化选择状态
                $scope.data.todayManuStatusArray = initSingleSelecet.todayManuStatus();
                $scope.data.SelectedTodayManuStatus = angular.copy($scope.data.todayManuStatusArray[0]);
                // 排序方式
                $scope.sortTypeJsons = initSingleSelecet.sortType();
                $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
            }

            //初始化操作权限
            function initBtnRights() {
                editcenterRightsService.initNewspaperListBtn("paper.jrg", $stateParams.paperid).then(function(data) {
                    $scope.status.btnRights = data;
                    getObjLength($scope.status.btnRights);
                });
            }

            /**
             * [initCurrSite description]获取当前站点详情
             * @return {[type]} [description]
             */
            function initCurrSite() {
                editNewspaperService.queryCurrSite($stateParams.paperid).then(function(data) {
                    $scope.status.currSite = data;
                });
            }

            /**
             * [listenStorage description]监听本地缓存
             * @return {[promise]} [description] promise
             */
            function listenStorage() {
                storageListenerService.listenNewspaper(function() {
                    requestData();
                    storageListenerService.removeListener("newspaper");
                });
                $scope.$on('$destroy', function() {
                    localStorageService.remove("newspaperPreviewSelectArray");
                    localStorageService.remove("newspaperPreviewCache");
                });
            }
            /**
             * [queryItemsByDropDown description]点击下拉框查询列表
             * @param  {[type]} param [description]类型
             * @param  {[type]} value [description]请求参数
             * @return {[type]}       [description]
             */
            $scope.queryItemsByDropDown = function(key, value) {
                $scope.params[key] = value;
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

            $scope.determineItemsInSelectedArray = function(items) {
                return determineItemsInSelectedArray(items);
            };

            /**
             * [newspaperMultiSelected description]报纸分类多选
             * @param  {[type]} items [description] 对象集合
             * @return {[type]}       [description]
             */
            $scope.newspaperMultiSelected = function(items) {
                if (angular.isUndefined(items) || items.length === 0) return;
                var judgement = determineItemsInSelectedArray(items);
                // judgement?:;
                if (judgement) removeItemsInSelectedArray(items);
                else {
                    addItemsToSelectedArray(items);
                }
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


            //批量上版
            $scope.shangban = function() {
                var transferData = {
                    "title": "上版",
                    "opinionTit": "上版意见",
                    "selectedArr": $scope.data.selectedArray,
                    "isShowDate": true,
                    "relatedManuMethod": "queryRelateDocsInJinRi",
                    "PaperId": $stateParams.paperid,
                    "queryMethod": $scope.params.methodname
                };
                editNewspaperService.changeLayoutDraft(transferData, function(result) {
                    var params = {
                        serviceid: "mlf_paper",
                        methodname: "doShangBanJinRi",
                        PaperId: $stateParams.paperid,
                        SrcDocIds: result.srcdocids,
                        BanMianID: result.banmianid,
                        Option: result.option,
                        PubDate: result.dateStr,
                        SrcBanMianIds: result.SrcBanMianIds,
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        trsconfirm.alertType("上版成功", "", "success", false, function() {
                            requestData();
                        });
                    }, function() {
                        requestData();
                    });
                });
            };
            /**
             * [filterChnlid description]过滤版面ID
             * @param  {[obj]} elm [description]每个选中项的版面ID
             * @return {[type]}     [description]
             */
            $scope.filterChnlid = function(elm) {
                if (angular.isDefined(elm.CHNLID)) {
                    return elm.CHNLID == $scope.data.selectedArray[0].CHNLID;
                }
            };
            //转版
            $scope.zhuanban = function() {
                var temp = $filter('omit')($scope.data.selectedArray, $scope.filterChnlid);
                if (temp.length > 0) {
                    trsconfirm.alertType("请在同一个版面下进行转版操作", "", "warning", false);
                    return;
                }
                var transferData = {
                    "title": "转版",
                    "opinionTit": "转版意见",
                    "selectedArr": $scope.data.selectedArray,
                    "isShowDate": false,
                    "relatedManuMethod": "queryRelateDocsInJinRi",
                    "PaperId": $stateParams.paperid,
                    "queryMethod": $scope.params.methodname
                };
                editNewspaperService.changeLayoutDraft(transferData, function(result) {
                    var params = {
                        serviceid: "mlf_paper",
                        methodname: "doZhuanBan",
                        PaperId: $stateParams.paperid,
                        SrcDocIds: result.srcdocids,
                        BanMianID: result.banmianid,
                        SrcBanMianIds: result.SrcBanMianIds,
                        Option: result.option
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        trsconfirm.alertType("转版成功", "", "success", false, function() {
                            requestData();
                        });
                    }, function() {
                        requestData();
                    });
                });
            };
            //待用弹窗
            $scope.standyByView = function() {
                var transferData = {
                    "title": "待用",
                    "opinionTit": "待用说明",
                    "items": $scope.data.selectedArray,
                    "PaperId": $stateParams.paperid,
                    "queryMethod": $scope.params.methodname
                };
                editNewspaperService.cancelSignedViews(transferData, function(result) {
                    var ids = trsspliceString.spliceString(result.items, "METADATAID", ",");
                    var params = {
                        'SrcDocIds': ids,
                        'Option': result.opinion ? result.opinion : "",
                        "serviceid": "mlf_paper",
                        "methodname": "doDaiYong",
                        "SrcBanMianIds": result.SrcBanMianIds,
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        trsconfirm.alertType("待用成功", "", "success", false, function() {
                            requestData();
                        });
                    }, function() {
                        requestData();
                    });
                });
            };

            //退稿
            $scope.rejection = function() {
                rejectionDraftofPage($scope.data.selectedArray);
            };
            //退稿函数
            function rejectionDraftofPage(item) {
                var transferData = {
                    "PaperId": $stateParams.paperid,
                    "queryMethod": $scope.params.methodname,
                    "item": item,
                    "rejecectionMethod": "rejectionJinRiViewDatas"
                };
                editNewspaperService.rejectionDraft(transferData, function(result) {
                    requestData();
                }, function(data) {
                    requestData();
                });
            }
            /**
             * [archive description]归档操作
             * @return {[type]} [description]
             */
            $scope.archive = function() {
                trsconfirm.inputModel("归档", "归档意见（可选）", function(content) {
                    trsconfirm.confirmModel("归档", "确认归档所选稿件", function() {
                        var params = {
                            serviceid: "mlf_paper",
                            methodname: "doGuiDang",
                            Option: content,
                            SrcDocIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
                            SrcBanMianIds: trsspliceString.spliceString($scope.data.selectedArray, "CHNLID", ","),
                        };
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                            trsconfirm.alertType("归档成功", "", "success", false, function() {
                                requestData();
                            });
                        });
                    });
                });
            };
            //发稿单
            $scope.draftlist = function() {
                editingCenterService.draftList($scope.data.selectedArray, {
                    "serviceid": "mlf_appfgd",
                    "methodname": "paperJinRibatchUpdateFgdUsers",
                }, function() {
                    $scope.data.selectedArray = [];
                });
            };

            //批量收藏稿件
            $scope.batchCollect = function() {
                trsconfirm.confirmModel("稿件收藏", "确认收藏稿件", function() {
                    var chnlDocIdsArray = trsspliceString.spliceString($scope.data.selectedArray,
                        'METADATAID', ',');
                    collectDraft(chnlDocIdsArray);
                });
            };

            //收藏稿件方法
            function collectDraft(array) {
                var params = {
                    serviceid: "mlf_paper",
                    methodname: "collectJinRi",
                    MetaDataIds: array
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        trsconfirm.alertType("收藏成功", "", "success", false);
                        $scope.data.selectedArray = [];
                    });
            }

            //外发
            $scope.outSending = function() {
                editingCenterService.outSending("", function(result) {
                    outSendingDraft(result.selectItems);
                });
            };

            //外发方法
            function outSendingDraft(items) {
                var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
                var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ",");
                var params = {
                    serviceid: "mlf_mailoutgoingOper",
                    methodname: "paperDaiYongGaoSendEmail",
                    Emails: userids,
                    MetaDataIds: draftids
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("邮件外发成功", "", "success", false);
                    $scope.data.selectedArray = [];
                });
            }

            //导出稿件
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

            //批量打印
            $scope.printBtn = function() {
                var chnlDocIdsArray = trsspliceString.spliceString($scope.data.selectedArray,
                    'METADATAID', ',');
                var params = {
                    serviceid: "mlf_paper",
                    methodname: "queryViewDatas",
                    MetaDataIds: chnlDocIdsArray
                };

                function requestVersion() {
                    var idsArray = trsspliceString.getArrayString($scope.data.selectedArray, "METADATAID", ",").split(",");
                    var versionResult = {};
                    var defer = $q.defer();
                    angular.forEach(idsArray, function(value, key) {
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), {
                            serviceid: "mlf_metadatalog",
                            methodname: "query",
                            MetaDataId: value
                        }, 'get').then(function(data) {
                            versionResult[value] = data.DATA;
                            if (key + 1 == idsArray.length) {
                                defer.resolve(versionResult);
                            };
                        });
                    });
                    return defer.promise;
                };
                $scope.loadingPromise = $q.all([trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get'), requestVersion()]).then(function(data) {
                    var detail = data[0];
                    var version = data[1];
                    for (var i = 0; i < detail.length; i++) {
                        detail[i].VERSION = version[detail[i].METADATAID];
                        if (i + 1 == detail.length) {
                            trsPrintService.trsPrintDocument(detail);
                        }
                    }
                });
            };

            //流程版本与操作日志
            $scope.showVersionTime = function(item) {
                editingCenterService.getVersionTime(item, false);
            };

            //稿件关联弹窗
            $scope.draftCorrelationView = function(id) {
                editNewspaperService.draftCorrelationViews(id, $stateParams.paperid, 1);
            };

            //展示预览图片
            $scope.showThisImg = function(item) {
                $scope.isThisImgShow = item;
            };

            //隐藏预览图片
            $scope.hideThisImg = function() {
                $scope.isThisImgShow = "";
            };

            function getESSearchParams() {
                var esParams = {
                    serviceid: "mlf_essearch",
                    methodname: "queryForPaperJinRiDoc",
                    searchParams: {
                        PAGESIZE: $scope.page.PAGESIZE + "",
                        PAGEINDEX: $scope.page.CURRPAGE + "",
                        searchFields: [{
                            searchField: "",
                            keywords: $scope.keywords ? $scope.keywords : ""
                        }, {
                            searchField: "DocType",
                            keywords: $scope.data.selectedDocType.value
                        }, {
                            searchField: "OprTime",
                            keywords: $scope.data.selectedTimeType.value
                        }, {
                            searchField: "pageStatus",
                            keywords: $scope.data.SelectedTodayManuStatus.value
                        }, {
                            searchField: "paperid",
                            keywords: $stateParams.paperid
                        }, {
                            searchField: "_sort",
                            keywords: $scope.sortType.value
                        }]
                    }
                };
                esParams.searchParams = JSON.stringify(esParams.searchParams);
                return esParams;
            }

            //搜索
            $scope.fullTextSearch = function(ev) {
                if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                    $scope.status.isESSearch = true;
                    $scope.status.openedPanel = {};
                    requestData();
                }
            };

            /**
             * [getSystemTime description]获取系统时间
             * @return {[promise]} [description]promise
             */
            function getSystemTime() {
                var params = {
                    serviceid: "mlf_fusion",
                    methodname: "getServiceTime"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                    .then(function(data) {
                        $scope.status.message.systemTime = data.LASTOPERTIME;
                    });
            }
            /**
             * [refreshUnreadMessage description] 点击新消息提醒，刷新列表
             * @return {[type]} [description]
             */
            $scope.refreshUnreadMessage = function() {
                requestData().then(function() {
                    $scope.status.openedPanel = {
                        0: true
                    };
                    loadItemsByPage(0);
                });
                $scope.status.message.currUnreadNum = 0;
            };
            /**
             * [isLockEdit description:编辑前请求解锁]
             * @param  {[type]} item [description:稿件对象]
             */
            $scope.isLockEdit = function(item) {
                editIsLock.isLock(item).then(function(data) {
                    var editPath = $scope.status.newspaperEdit[item.DOCTYPEID];
                    var editParams = {
                        chnldocid: item.CHNLDOCID,
                        metadata: item.METADATAID,
                        paperid: item.SITEID,
                        newspapertype: $scope.status.jrgedit
                    };
                    var editUrl = $state.href(editPath, editParams);
                    if (data.ISLOCK == "false") {
                        window.open(editUrl);
                    } else {
                        trsconfirm.alertType("稿件已经被【" + data.LOCKUSER + "】锁定,是否强制解锁", "", "warning", true, function() {
                            editIsLock.forceDeblocking(item).then(function(data) {
                                window.open(editUrl);
                            });
                        }, function() {});
                    }
                });
            };



            // function getSelectedItem(){
            //     angular.forEach($scope.data.selectedArray,function(value,key){
            //         console.log(value.CHNLID);
            //     });
            // }
        }

    ]);
