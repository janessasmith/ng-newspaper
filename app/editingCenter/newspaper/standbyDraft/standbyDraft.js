"use strict";
angular.module('newspaperStandbyDraftModule', [
    'newspaperStandbyDraftRouterModule',
    'trsNavLocationModule',
    'trsPrintModule',
    'newspaperTodaysDraftRouterModule'
]).
controller('newspaperStandbyDraftCtrl', ["$scope", "$filter", "$q", "$state", "$cacheFactory", '$window', "$stateParams", "$modal", "trsHttpService", "trsconfirm", "initSingleSelecet", "editNewspaperService", "editingCenterService", "trsspliceString", "editcenterRightsService", "$interval", "initVersionService", "trsPrintService", "storageListenerService", "globleParamsSet", "localStorageService", "editIsLock", "pagePreview",
    function($scope, $filter, $q, $state, $cacheFactory, $window, $stateParams, $modal, trsHttpService, trsconfirm, initSingleSelecet, editNewspaperService, editingCenterService, trsspliceString, editcenterRightsService, $interval, initVersionService, trsPrintService, storageListenerService, globleParamsSet, localStorageService, editIsLock, pagePreview) {
        initStatus();
        initData();

        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": globleParamsSet.getPageSize()
            };

            $scope.params = {
                serviceid: "mlf_paper",
                methodname: "queryDaiYongDocs",
                paperid: $stateParams.paperid,
                oprtime: "1m",
            };
            $scope.status = {
                //面板是否打开,默认打开第一个
                isPanelOpenArray: {
                    0: true
                },
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                cacheOpenedPanelKey: "dyg",
                dygpreview: 0,
                dygedit: 0,
                //初始化参数
                quantitys: "0",
                //编辑页面
                newspaperEdit: editNewspaperService.initNewspaperEdit(),
                //所有版面
                allBanmian: [],
                isESSearch: false,
                cachedName: "newspaperStandbyDocuments", //缓存key
                selectArrayIdCache: [],
                cacheOpenedPanel: {}, //记忆打开的面板
            };
            $scope.data = {
                //当前站点id
                paperId: $stateParams.paperId,
                panels: [],
                selectedArray: [],
                dropdown: {
                    BanMian: {
                        selectedBanMian: {},
                        BanMianArray: [],
                    }
                },
                currSite: '',
                cacheData: [],
                selectedCurrents: [],
                curSelectedArray: [],
                allDocuments: [],
                selectedArrayObj: [],
                msSpecialNeedArr:["广告提交库","编辑广告提交库","编辑新闻中心提交库","新闻中心"]
            };
        }

        //初始化数据
        function initData() {
            requestData();
            initDropDown();
            listenStorage();
            // //按钮权限
            editcenterRightsService.initNewspaperListBtn("paper.dyg", $stateParams.paperid).then(function(data) {
                $scope.status.btnRights = data;
                getObjLength($scope.status.btnRights);
            });
            //获取报纸的信息
            editNewspaperService.queryCurrSite($stateParams.paperid).then(function(data) {
                $scope.data.currSite = data;
            });
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
        //收起全部面板
        $scope.closeAllPanel = function() {
            $scope.status.isOpen = {};
        };
        /**
         * [openDefaultPanels description]  打开默认的PANEL
         * @return {[type]} [description]
         */
        function openDefaultPanels() {
            var tempOpenedPanels = editNewspaperService.getCacheOpenedPanel($scope.status.cacheOpenedPanelKey);
            // console.log(tempOpenedPanels);
            if (angular.isUndefined(tempOpenedPanels)) {
                $scope.status.isPanelOpenArray[0] = true;
                return;
            }
            $scope.status.isPanelOpenArray[0] = false;
            for (var i in $scope.data.panels) {
                if (tempOpenedPanels[$scope.data.panels[i].BANMIANID] === true) {
                    $scope.status.isPanelOpenArray[i] = true;
                    getCachedById(i);
                }
            }
        }
        /**
         * [setOpenedPanel description]将panel的开启状态保存到service中
         * @param {[type]} index [description]
         */
        function setOpenedPanel(index) {
            for (var i in $scope.status.isPanelOpenArray) {
                $scope.status.cacheOpenedPanel[$scope.data.panels[i].BANMIANID] = $scope.status.isPanelOpenArray[i];
            }
            // console.log($scope.data.panels[index].BANMIANID);
            $scope.status.cacheOpenedPanel[$scope.data.panels[index].BANMIANID] = !$scope.status.cacheOpenedPanel[$scope.data.panels[index].BANMIANID];
            editNewspaperService.cacheOpenedPanel($scope.status.cacheOpenedPanelKey, $scope.status.cacheOpenedPanel);
        }
        /**
         * [listenStorage description]监听缓存
         * @return {[type]} [description]null
         */
        function listenStorage() {
            storageListenerService.listenNewspaper(function() {
                requestData();
                storageListenerService.removeListener("newspaper");
            });
            $scope.$on('$destroy', function() {
                pagePreview.cleanCache();
            });
            storageListenerService.listenSelectArray(function() {
                $scope.data.selectedCurrents = angular.copy(localStorageService.get("newspaperPreviewSelectArray"));
                $scope.$apply(function() {
                    $scope.data.selectedArray = pagePreview.selectCurArray($scope.data.selectedCurrents, $scope.data.selectedArrayObj);
                });
            });
        }
        /**
         * [requestData description]数据请求函数
         * @return {[type]} [description]
         */
        function requestData() {
            var deferred = $q.defer();
            //判断是否启用ES检索
            var params = $scope.status.isESSearch ? getESSearchParams() : angular.copy($scope.params);
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                cacheDate(data);
                openDefaultPanels();
                $scope.data.selectedArray = [];
                deferred.resolve(data);

            });
            return deferred.promise;
        }
        /**
         * [cacheDate description] 缓存数据已提高渲染速度
         * @return {[type]} [description]
         */
        function cacheDate(data) {
            if ($cacheFactory.get($scope.status.cachedName)) $cacheFactory.get($scope.status.cachedName).destroy();
            $scope.data.selectedArrayObj = [];
            var copyedData = angular.copy(data);
            var cache = $cacheFactory($scope.status.cachedName);
            for (var i in copyedData) {
                cache.put(copyedData[i].BANMIANID, copyedData[i].DOCUMENTS);
                $scope.data.selectedArrayObj = $scope.data.selectedArrayObj.concat(copyedData[i].DOCUMENTS);
                if (i > 0)
                    copyedData[i].DOCUMENTS = [];
            }
            $scope.data.panels = copyedData;
        }
        /**
         * [isChecked description] 单选
         * @param  {[type]}  item [description]
         * @return {Boolean}      [description]
         */
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
            //获取当前选中项
            pagePreview.selectedArrayCahe($scope.data.selectedArray);
        };
        /**
         * [getCachedById description]点击版面加载缓存的数据，以提高页面加载速度
         * @param  {[type]} index [description]  panel下标
         * @return {[type]}       [description]
         */
        $scope.getCachedById = function(index) {
            setOpenedPanel(index);
            if ($scope.data.panels[index].DOCUMENTS.length > 0) return;
            else {
                $scope.loadingPromise = getCachedById(index);
            }
        };
        /**
         * [getCachedById description] 获取对应panel下缓存的DOCUMENTS 为了展示loadingPromise
         * @param  {[type]} index [description] panel下标
         * @return {[type]}       [description] promise
         */
        function getCachedById(index) {
            var panel = $scope.data.panels[index];
            if (panel.DOCUMENTS.length === 0) {
                var cache = $cacheFactory.get($scope.status.cachedName);
                panel.DOCUMENTS = cache.get(panel.BANMIANID);
            }
        }
        //搜索
        $scope.fullTextSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                $scope.status.isESSearch = true;
                requestData();
            }
        };
        /**
         * [getESSearchParams description]设置ES检索参数
         * @return {[json]} [description] 参数对象
         */
        function getESSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForPaperDaiYongDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: "",
                        keywords: $scope.keywords ? $scope.keywords : ""
                    }, {
                        searchField: "docType",
                        keywords: $scope.docType.value
                    }, {
                        searchField: "oprtime",
                        keywords: $scope.selectdTimeDefault.value
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


        /**
         * [initBanMianFilter description] 初始化版面选择下拉框 默认选中全部版面
         * @return {[type]} [description] null
         */
        function initBanMianFilter() {
            var allBanMian = {
                name: "全部版面",
                value: 0
            };
            $scope.data.dropdown.BanMian.selectedBanMian = allBanMian;
            $scope.data.dropdown.BanMian.BanMianArray.push(allBanMian);
            for (var i = 0; i < $scope.data.panels.length; i++) {
                var tempBanMian = {};
                tempBanMian.name = $scope.data.panels[i].DATE.substring(5) + " " + $scope.data.panels[i].BANMIAN;
                tempBanMian.value = $scope.data.panels[i].DATE + $scope.data.panels[i].BANMIANID;
                $scope.data.dropdown.BanMian.BanMianArray.push(tempBanMian);
            }
        }

        //请求单个版面的数据
        $scope.refreshSingleBanmian = function(panel) {
            $scope.status.currPanel = panel;
            queryItemsByBanmianId(panel);

        };
        /**
         * [queryItemsByBanmianId description] 按照版面ID刷新对应PANEL的数据
         * @param  {[json]} panel [description] json
         * @return {[type]}       [description] null
         */
        function queryItemsByBanmianId(panel) {
            var params = angular.copy($scope.params);
            params.BanMianId = panel.BANMIANID;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $scope.data.panels[getIndexByBanMianId(panel, $scope.data.panels)].DOCUMENTS = data;
                $scope.data.selectedArray = [];
            });
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
        }

        /**
         * [getIndexByBanMianId description] 按照版面ID查询所在下标
         * @param  {[type]} item  [description]
         * @param  {[type]} items [description]
         * @return {[type]}       [description]
         */
        function getIndexByBanMianId(item, items) {
            for (var i = 0; i < items.length; i++) {
                if (item.BANMIANID === items[i].BANMIANID)
                    return i;
            }
        }

        //初始化下拉框
        function initDropDown() {
            //初始化选择日期
            $scope.selectdTime = initSingleSelecet.newspaperDraftTime();
            $scope.selectdTimeDefault = angular.copy($scope.selectdTime[3]);
            //初始化选择类型
            $scope.docTypeJsons = initSingleSelecet.newspaperDraftType();
            $scope.docType = angular.copy($scope.docTypeJsons[0]);
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
            $scope.params[key] = value;
            if (key == 'oprtime') {
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

        // var promise = $interval(getTipInf, 60000);
        // $scope.$on('$destroy', function() {
        //     $interval.cancel(promise);
        // });

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
         * [getTipInf description]
         * @return {[type]} [description]
         */
        function getTipInf() {
            var params = {
                "serviceid": "mlf_fusion",
                "methodname": "queryDocCountOfMediaInShengQian",
                "OprTime": $scope.status.message.systemTime,
                "SiteId": $scope.params.paperid,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                if (data.replace(/"/g, '') > 0) {
                    $scope.status.message.currUnreadNum = +data.replace(/"/g, '');
                }

            });
            $scope.status.message.currLoopIndex = $scope.status.message.currLoopIndex + 2 > $scope.data.panels.length ? 0 : $scope.status.message.currLoopIndex + 1;
        }

        //批量退稿功能
        $scope.rejection = function() {
            rejectionDraftofPage($scope.data.selectedArray);
        };

        function rejectionDraftofPage(item) {
            var transferData = {
                "PaperId": $stateParams.paperid,
                "queryMethod": $scope.params.methodname,
                "item": item,
                "rejecectionMethod": "rejectionDaiYongViewDatas"
            };
            editNewspaperService.rejectionDraft(transferData, function(result) {
                requestData();
            }, function() {
                requestData();
            });
        }
        /**
         * [promptRequest description]具体操作数据请求成功后刷新列表
         * @param  {[obj]} params [description]请求参数
         * @param  {[string]} info   [description]提示语
         * @return {[type]}        [description]
         */
        function promptRequest(params, info) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType(info, "", "success", false, function() {
                    requestData();
                });
            }, function() {
                requestData();
            });
        }
        /**
         * [exportDraft description]批量导出
         * @return {[type]} [description] null
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
         * [draftlist description]发稿单（array, params, success）
         * @param {[array]} [description] 全选集合
         * @param {[params]} [description] 请求参数
         * @param {success}  [description] 回调方法
         */
        $scope.draftlist = function() {
            editingCenterService.draftList($scope.data.selectedArray, {
                "serviceid": "mlf_appfgd",
                "methodname": "paperDaiYongbatchUpdateFgdUsers",
            }, function() {
                $scope.status.selectedTypeArrary = [];
                $scope.status.allBanmian = [];
            });
        };

        /**
         * [batchCollect description]批量稿件收藏
         * @return {[type]} [description] null
         */
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
                methodname: "collectDaiYong",
                MetaDataIds: array
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    trsconfirm.alertType("收藏成功", "", "success", false, function() {
                        requestData($scope.params);
                    });
                });
        }
        //批量上版
        $scope.shangban = function() {
            draftShangBan($scope.data.selectedArray);
        };

        function draftShangBan(item) {
            var transferData = {
                "title": "上版",
                "opinionTit": "上版意见",
                "selectedArr": item,
                "isShowDate": true,
                "PaperId": $stateParams.paperid,
                "queryMethod": $scope.params.methodname
            };
            editNewspaperService.changeLayoutDraft(transferData, function(result) {
                var params = {
                    paperId: $stateParams.paperid,
                    methodname: "doShangBanDaiYong",
                    SrcDocIds: result.srcdocids,
                    BanMianID: result.banmianid,
                    PubDate: result.dateStr,
                    Option: result.option,
                    serviceid: "mlf_paper",
                    SrcBanMianIds: result.SrcBanMianIds,
                };
                promptRequest(params, '上版成功');
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
                    promptRequest(params, '归档成功');
                });
            });
        };
        /**
         * 批量打印功能
         */
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
                    });
                    if (key + 1 == idsArray.length) {
                        defer.resolve(versionResult);
                    };
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
                "PaperId": $stateParams.paperid,
                "queryMethod": $scope.params.methodname
            };
            editNewspaperService.changeLayoutDraft(transferData, function(result) {
                var params = {
                    serviceid: "mlf_paper",
                    methodname: "doZhuanBan",
                    SrcDocIds: result.srcdocids,
                    BanMianID: result.banmianid,
                    SrcBanMianIds: result.SrcBanMianIds,
                    PubDate: result.dateStr,
                    Option: result.option
                };
                promptRequest(params, '转版成功');
            });

        };
        /**
         * [checkDraftSource description]查询所选稿件是否来自不同版面
         * @return flag {[string]} [description] 是否来自不同版面
         */
        function checkDraftSource(info) {
            var flag = false,
                arr = [],
                selected = angular.copy($scope.data.selectedArray);
            for (var i = 0; i < selected.length; i++) {
                if (arr.indexOf(selected[i].CHNLID) < 0) arr.push(selected[i].CHNLID);
            }
            if (arr.length > 1) {
                trsconfirm.alertType(info, "", "warning", false);
                flag = true;
            }
            return flag;
        }
        //流程版本与操作日志
        $scope.showVersionTime = function(item) {
            editingCenterService.getVersionTime(item, false);
        };
        //稿件关联弹窗
        $scope.draftCorrelationView = function(id) {
            editNewspaperService.draftCorrelationViews(id, $stateParams.paperid, 0);
        };
        //搜索
        $scope.fullTextSearch = function(ev) {
            $scope.status.isESSearch = true;
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                requestData();
            }
        };
        //外发
        $scope.outSending = function() {
            editingCenterService.outSending("", function(result) {
                outSendingDraft(result.selectItems);
            });
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
                    newspapertype: $scope.status.dygedit
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


        function outSendingDraft(items) {
            var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
            var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ",");
            var params = {
                serviceid: "mlf_mailoutgoingOper",
                methodname: "paperDaiYongGaoSendEmail",
                Emails: userids,
                MetaDataIds: draftids
            };
            promptRequest(params, "邮件外发成功");
        }
        /**
         * [newspaperPreview description] 报纸预览
         * @param  {[type]} item [description] 当前对象
         */
        $scope.newspaperPreview = function(item) {
            var editPath = 'newspaperNewsPreview';
            var editParams = {
                paperid: item.SITEID,
                metadata: item.METADATAID,
                newspapertype: $scope.status.dygpreview,
                doctype:item.DOCTYPEID
            };
            var editUrl = $state.href(editPath, editParams);
            // //获取当前选中项
            // pagePreview.selectedArrayCahe($scope.data.selectedArray);
            //获取当前稿件列表METADATAID
            pagePreview.listItemCache($scope.data.selectedArrayObj);
            $window.open(editUrl);
        };
    }

]);
