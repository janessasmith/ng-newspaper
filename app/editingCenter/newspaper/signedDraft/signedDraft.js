"use strict";
angular.module('newspaperSignedDraftModule', [
    'newspaperSignedDraftRouterModule',
    'trsNavLocationModule'
]).
controller('newspaperSignedDraftCtrl', ["$scope", "$stateParams", "$state", '$window', "$cacheFactory", "$q", "$filter", "$modal", "trsHttpService", "SweetAlert", "initSingleSelecet", 'editNewspaperService', 'trsspliceString', 'editingCenterService', 'trsconfirm', "editcenterRightsService", "$interval", "initVersionService", "trsPrintService", "globleParamsSet", 'localStorageService', "pagePreview",
    function($scope, $stateParams, $state, $window, $cacheFactory, $q, $filter, $modal, trsHttpService, SweetAlert, initSingleSelecet, editNewspaperService, trsspliceString, editingCenterService, trsconfirm, editcenterRightsService, $interval, initVersionService, trsPrintService, globleParamsSet, localStorageService, pagePreview) {
        initStatus();
        initData();
        //初始化状态
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": globleParamsSet.getPageSize()
            };
            $scope.params = {
                serviceid: "mlf_paper",
                methodname: "queryYiQianDocs",
                paperid: $stateParams.paperid,
                DocPubTime: "1m",
                DocType: "",
                DocStatus: "",
                PAGESIZE: 1000,
                PAGEINDEX: $scope.page.CURRPAGE,

            };
            $scope.status = {
                isESSearch: false,
                isMorePanelShow: false,
                message: {
                    currUnreadNum: 0, //当前未读信息数
                    systemTime: "", //缓存最近请求时间
                },
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                btnRights: "",
                isOpenedPanel: {
                    0: true
                }, //第一个版面打开
                cachedName: "newspaperSignedDocuments",
                cachedPage: {},
                cacheOpenedPanel: {},
                cacheOpenedPanelKey: "yqg",
                selectAllBtn: [{
                    hasBtn: true,
                }],
                yqgpreview: 3,
            };
            $scope.data = {
                panels: [],
                selectedArray: [],
                newspaperUrl: {
                    1: "newspaperpic",
                    2: "newspapertext"
                },
                newspaperPreview: {
                    1: "newspaperNewsPreview",
                    2: "newspaperAtlasPreview"
                },
                dropdown: {
                    BanMian: {
                        selectedBanMian: {},
                        BanMianArray: [],
                    }
                },
                allDOCUMENTS: [],
                docNums: 0,  //记录当前总共稿件数目
                msSpecialNeedArr:["广告提交库","编辑广告提交库","编辑新闻中心提交库","新闻中心"]
            };

        }

        //初始化数
        function initData() {
            requestData();
            initDropDown();
            editcenterRightsService.initNewspaperListBtn("paper.yqg", $stateParams.paperid).then(function(data) {
                $scope.status.btnRights = data;
            });
            editingCenterService.getSiteInfo($stateParams.paperid).then(function(data) {
                $scope.data.paperMsg = data;
            });
            listenStorage();
        }
        /**
         * [listenStorage description]监听缓存
         * @return {[type]} [description]null
         */
        function listenStorage() {
            $scope.$on('$destroy', function() {
                pagePreview.cleanCache();
            });
        }
        /**
         * [requestData description]数据请求函数
         * @param  {Boolean} isGetMorePanel [description] 是否加载更多panel，用于点击筛选全部日期的稿件时
         * @return {[type]}                 [description]
         */
        function requestData(isGetMorePanel) {
            var deferred = $q.defer();
            //判断是否启用ES检索
            var params = $scope.status.isESSearch ? getESSearchParams() : angular.copy($scope.params);
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $scope.data.panels = isGetMorePanel ? concatPanels(data) : cacheDate(data);
                if (data.length > 0) {
                    openDefaultPanels();
                    angular.forEach(data, function(dataC, index) {
                        $scope.data.docNums += parseInt(dataC.DOCCOUNT);
                    });
                    $scope.status.isMorePanelShow = $scope.data.docNums >= ($scope.params.PAGESIZE*$scope.params.PAGEINDEX) ? true : false;
                }
                initBanMianFilter(); //刷新全部版面下拉框
                deferred.resolve(data);
            });
            $scope.data.selectedArray = [];
            return deferred.promise;
        }
        /**
         * [concatPanels description]合并panels,当点击更多PANEL时，由于分页，导致出现重复PANEL,并合并数据
         * @return {[type]} [description]
         */
        function concatPanels(data) {
            var currPanels = angular.copy($scope.data.panels);
            var tempData = data;
            for (var i = 0; i < currPanels.length; i++) {
                for (var j = 0; j < tempData.length; j++) {
                    if ((currPanels[i].BANMIANID + currPanels[i].DATE) == (tempData[j].BANMIANID + tempData[j].DATE)) {
                        currPanels[i].DOCUMENTS = $filter('unique')(currPanels[i].DOCUMENTS.concat(tempData[j].DOCUMENTS), 'METADATAID');
                        currPanels[i].DOCCOUNT = Number(currPanels[i].DOCCOUNT);
                        data.splice(data.indexOf(tempData[j]), 1);
                    }
                }
            }
            data = currPanels.concat(data);
            return data;
        }
        /**
         * [openDefaultPanels description]  打开默认的PANEL
         * @return {[type]} [description]
         */
        function openDefaultPanels() {
            // var flag = true;
            var tempOpenedPanels = editNewspaperService.getCacheOpenedPanel($scope.status.cacheOpenedPanelKey);
            if (angular.isUndefined(tempOpenedPanels)) {
                loadItemsByPage(0);
                return;
            }
            $scope.status.isOpenedPanel = {};
            for (var i in $scope.data.panels) {
                if (tempOpenedPanels[$scope.data.panels[i].DATE + $scope.data.panels[i].BANMIANID] === true) {
                    $scope.status.isOpenedPanel[i] = true;
                    loadItemsByPage(i);
                }
            }
        }
        /**
         * [loadItemsByPage description]假分页
         * @param  {[type]} index    [description] PANEL 下标
         * @param  {[type]} currpage [description] 当前页
         * @return {[type]}          [description]
         */
        function loadItemsByPage(index) {
            var panel = $scope.data.panels[index];
            if (angular.isUndefined(panel)) return;
            if (panel.DOCUMENTS.length == panel.DOCCOUNT) return;
            var key = panel.BANMIANID + panel.DATE;
            var currpage = $scope.status.cachedPage[key];
            var cache = $cacheFactory.get($scope.status.cachedName);
            var addedItems = cache.get(key).slice(currpage * $scope.page.PAGESIZE, (currpage + 1) * $scope.page.PAGESIZE > panel.DOCCOUNT ? panel.DOCCOUNT : ((currpage + 1) * $scope.page.PAGESIZE));
            panel.DOCUMENTS = $filter('unique')(panel.DOCUMENTS.concat(addedItems), 'METADATAID');
            $scope.status.cachedPage[key] += 1;
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
        function cacheDate(data) {

            if ($cacheFactory.get($scope.status.cachedName)) $cacheFactory.get($scope.status.cachedName).destroy();
            var copyedData = angular.copy(data);
            var cache = $cacheFactory($scope.status.cachedName);
            for (var i in copyedData) {
                cache.put(copyedData[i].BANMIANID + copyedData[i].DATE, copyedData[i].DOCUMENTS);
                $scope.data.allDOCUMENTS = $scope.data.allDOCUMENTS.concat(copyedData[i].DOCUMENTS);
                copyedData[i].DOCUMENTS = [];
                $scope.status.cachedPage[copyedData[i].BANMIANID + copyedData[i].DATE] = 0;
            }
            return copyedData;
            // $scope.data.panels = copyedData;
        }

        //监听预览页 按钮点击
        $window.addEventListener("storage", function(e) {
            $scope.data.selectedCurrents = angular.copy(localStorageService.get("newspaperPreviewSelectArray"));
            $scope.$apply(function() {
                $scope.data.selectedArray = [];
                $scope.data.selectedArray = pagePreview.selectCurArray($scope.data.selectedCurrents, $scope.data.allDOCUMENTS);
            });
        });

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
            if (selectedArray.length > 0) {
                for (var index = 0; index < selectedArray.length; index++) {
                    if (selectedArray[index].METADATAID == item.METADATAID) {
                        return index;
                    }
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
            pagePreview.selectedArrayCahe($scope.data.selectedArray);
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
                newspapertype: $scope.status.yqgpreview,
                doctype:item.DOCTYPEID
            };
            var editUrl = $state.href(editPath, editParams);
            //缓存当前选中项
            // pagePreview.selectedArrayCahe($scope.data.selectedArray);
            //缓存所有列表METADATAID
            pagePreview.listItemCache($scope.data.allDOCUMENTS);
            $window.open(editUrl);
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
                $scope.loadingPromise = loadItemsByPage(index);
            }
        };
        /**
         * [setOpenedPanel description]将panel的开启状态保存到service中
         * @param {[type]} index [description]
         */
        function setOpenedPanel(index) {
            for (var i in $scope.status.isOpenedPanel) {
                if (angular.isDefined($scope.data.panels[i])) {
                    $scope.status.cacheOpenedPanel[$scope.data.panels[i].DATE + $scope.data.panels[i].BANMIANID] = $scope.status.isOpenedPanel[i];
                }
            }
            $scope.status.cacheOpenedPanel[$scope.data.panels[index].DATE + $scope.data.panels[index].BANMIANID] = !$scope.status.cacheOpenedPanel[$scope.data.panels[index].DATE + $scope.data.panels[index].BANMIANID];
            editNewspaperService.cacheOpenedPanel($scope.status.cacheOpenedPanelKey, $scope.status.cacheOpenedPanel);
        }
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

        $scope.refreshUnreadMessage = function() {
            requestData();
        };



        function initDropDown() {

            //初始化选择日期
            $scope.pubTimeArray = initSingleSelecet.newspaperDraftTime();
            $scope.selectdPubTime = angular.copy($scope.pubTimeArray[3]);
            //初始化选择类型
            $scope.doctypeArray = initSingleSelecet.newspaperDraftType();
            $scope.selectedDoctype = angular.copy($scope.doctypeArray[0]);
            //状态
            $scope.docStatusArray = initSingleSelecet.newspaperSignedStatus();
            $scope.selectedDocStatus = angular.copy($scope.docStatusArray[0]);
            //版面
            // 排序方式
            $scope.sortTypeJsons = initSingleSelecet.sortType();
            $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
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
            $scope.data.dropdown.BanMian.selectedBanMian = angular.isDefined($scope.data.dropdown.BanMian.selectedBanMian.value) ? $scope.data.dropdown.BanMian.selectedBanMian : allBanMian;
            $scope.data.dropdown.BanMian.BanMianArray = [];
            $scope.data.dropdown.BanMian.BanMianArray.push(allBanMian);
            for (var i = 0; i < $scope.data.panels.length; i++) {
                var tempBanMian = {};
                tempBanMian.name = $scope.data.panels[i].BANMIAN;
                tempBanMian.value = $scope.data.panels[i].BANMIANID;
                $scope.data.dropdown.BanMian.BanMianArray.push(tempBanMian);
            }
            $scope.data.dropdown.BanMian.BanMianArray = $filter('unique')($scope.data.dropdown.BanMian.BanMianArray, 'value');
        }

        /**
         * [queryByDropdown description] 筛选条件触发后请求数据
         * @param  {[type]} key   [description] 请求对象参数key
         * @param  {[type]} value [description] 请求对象值
         * @return {[type]}       [description] null
         */
        $scope.queryByDropdown = function(key, value) {
            $scope.params[key] = value;
            $scope.data.docNums = 0;
            $scope.params.PAGEINDEX=$scope.page.CURRPAGE=1;
            if (key == 'DocPubTime') {
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
         * [loadMorePanel description]加载更多PANEL,针对时间筛选的全部时间
         * @return {[type]} [description]
         */
        $scope.loadMorePanel = function() {
            $scope.page.CURRPAGE += 1;
            $scope.params.PAGEINDEX = $scope.page.CURRPAGE;
            requestData(true);
        };
        //稿件关联弹窗
        $scope.draftCorrelationView = function(item) {
            editNewspaperService.draftCorrelationViews(item.METADATAID, $stateParams.paperid, 3);
        };

        //批量取消签发
        $scope.cancelSignedView = function() {
            cancelSignedDraft($scope.data.selectedArray);
        };
        //单个取消签发
        $scope.cancelSignedQF = function(item) {
            cancelSignedDraft([item]);
        };
        //取消签发方法
        function cancelSignedDraft(item) {
            var transferData = {
                "title": "取消签发",
                "opinionTit": "取消签发意见",
                "items": item,
                "PaperId": $stateParams.paperid,
                "queryMethod": $scope.params.methodname
            };
            editNewspaperService.cancelSignedViews(transferData, function(result) {
                var params = {
                    'SrcDocIds': result.SrcDocIds,
                    'Option': result.opinion ? result.opinion : "",
                    "serviceid": "mlf_paper",
                    "methodname": "doQuXiaoQF"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    $scope.params.PAGEINDEX = 1;
                    trsconfirm.alertType("取消签发成功", "", "success", false, function() {
                        requestData();
                    });
                }, function(data) {
                    requestData();
                });
            });
        }

        //稿件收藏
        $scope.batchCollect = function() {
            trsconfirm.confirmModel("稿件收藏", "确认收藏稿件", function() {
                var chnlDocIdsArray = trsspliceString.spliceString($scope.data.selectedArray,
                    'METADATAID', ',');
                collectDraft(chnlDocIdsArray);
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
                    }
                });
                return defer.promise;
            }
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

        //发稿单
        $scope.draftlist = function() {
            editingCenterService.draftList($scope.data.selectedArray, {
                "serviceid": "mlf_appfgd",
                "methodname": "batchUpdateFgdUsers",
            }, function() {
                $scope.data.selectedArray = [];
            });
        };
        //收藏稿件方法
        function collectDraft(array) {
            var params = {
                serviceid: "mlf_myrelease",
                methodname: "collect",
                MetaDataIds: array
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    trsconfirm.alertType("收藏成功", "", "success", false);
                    $scope.data.selectedArray = [];
                });
        }


        //流程版本与操作日志
        $scope.showVersionTime = function(item) {
            editingCenterService.getVersionTime(item, false);
        };
        /**
         * [fullTextSearch description;全文检索]
         * @param  {[type]} ev [description:按下空格也能提交]
         */
        $scope.fullTextSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                $scope.status.isESSearch = true;
                $scope.status.isOpenedPanel = {};
                requestData();
            }
        };
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
                methodname: "paperYiQianGaoSendEmail",
                Emails: userids,
                MetaDataIds: draftids
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("邮件外发成功", "", "success", false);
                $scope.data.selectedArray = [];
            });
        }
        /**
         * [getESSearchParams description]设置ES检索参数
         * @return {[json]} [description] 参数对象
         */
        function getESSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForPaperYiQianDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: "",
                        keywords: $scope.keywords ? $scope.keywords : ""
                    }, {
                        searchField: "docType",
                        keywords: $scope.selectedDoctype.value
                    }, {
                        searchField: "docPubTime",
                        keywords: $scope.selectdPubTime.value
                    }, {
                        searchField: "signedStatus",
                        keywords: $scope.selectedDocStatus.value
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
        $scope.closeAllPanel = function() {
            angular.forEach($scope.data.panels, function(value, index) {
                $scope.status.isOpen[index] = false;
            });
        };
    }
]);
