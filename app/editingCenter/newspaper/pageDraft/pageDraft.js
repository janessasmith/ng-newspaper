"use strict";
angular.module('newspaperPageDraftModule', ["newspaperPageDraftRouterModule", ]).
controller('newspaperPageDraftCtrl', ["$scope", "$state", "$q", '$filter', '$window', "$cacheFactory", "$stateParams", "trsHttpService", "initSingleSelecet", "editNewspaperService", 'trsspliceString', "trsconfirm", "editingCenterService", "editcenterRightsService", "$interval", "initVersionService", "trsPrintService", "storageListenerService", "globleParamsSet", "localStorageService", "editIsLock", "pagePreview",
    function($scope, $state, $q, $filter, $window, $cacheFactory, $stateParams, trsHttpService, initSingleSelecet, editNewspaperService, trsspliceString, trsconfirm, editingCenterService, editcenterRightsService, $interval, initVersionService, trsPrintService, storageListenerService, globleParamsSet, localStorageService, editIsLock, pagePreview) {
        initStatus();
        initData();
        //初始化状态
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": globleParamsSet.getPageSize()
            };
            $scope.params = {
                "serviceid": "mlf_paper",
                "methodname": "queryShangBanDocs",
                "PaperId": $stateParams.paperid,
                "DocPubTime": "1m"
            };
            $scope.status = {
                btnRights: {},
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                //编辑页面
                newspaperEdit: editNewspaperService.initNewspaperEdit(),
                newspaperPreview: { //预览页
                    1: "newspaperNewsPreview",
                    2: "newspaperAtlasPreview"
                },
                paperId: $stateParams.paperid,
                quantitys: 0, //未读信息数量
                // isOpen: [],
                isPanelOpenArray: {
                    0: true
                },
                sbgpreview: 2,
                sbgedit: 2,
                message: {
                    currUnreadNum: 0, //当前未读信息数
                    systemTime: "", //缓存最近请求时间
                },
                isESSearch: false,
                cachedName: "newspaperPageDraftDocuments",
                cacheOpenedPanel: {}, //存储打开的panel
            };
            $scope.data = {
                panels: [],
                selectedArray: [],
                BanMian: {
                    selectedBanMian: {},
                    BanMianArray: [],
                },
                selectedArrayObj: [],
                msSpecialNeedArr:["广告提交库","编辑广告提交库","编辑新闻中心提交库","新闻中心"]
            };
        }

        function initData() {
            requestData();
            initDropDown();
            //按钮权限
            editcenterRightsService.initNewspaperListBtn("paper.sbg", $stateParams.paperid).then(function(data) {
                $scope.status.btnRights = data;
                getObjLength($scope.status.btnRights);
            });
            //当前报纸信息
            editingCenterService.getSiteInfo($stateParams.paperid).then(function(data) {
                $scope.data.paperMsg = data;
            });
            listenStorage();
            $scope.promise = $interval(getTipInf, 60000);
            //缓存
            listenerCacheDate();
        }

        function getObjLength(obj) {
            var size = 0,
                key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            $scope.status.btnLength = size;
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
                "SiteId": $scope.params.PaperId,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                if (data.replace(/"/g, '') > 0) {
                    $scope.status.message.currUnreadNum = +data.replace(/"/g, '');
                }

            });
            //$scope.status.message.currLoopIndex = $scope.status.message.currLoopIndex + 2 > $scope.data.panels.length ? 0 : $scope.status.message.currLoopIndex + 1;
        }
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

        function requestData() {
            var deferred = $q.defer();
            var params = $scope.status.isESSearch ? getESSearchParams() : angular.copy($scope.params);
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.selectedArray = [];
                cacheDate(data);
                //刷新版面列表
                initBanMianFilter();
                if (data.length > 0) {
                    openDefaultPanels();
                }
                deferred.resolve(data);
                getSystemTime(); //获取上次刷新时间

            });
            return deferred.promise;
        }
        /**
         * [openDefaultPanels description]打开默认PANEL
         * @return {[type]} [description]
         */
        function openDefaultPanels() {
            var tempOpenedPanels = editNewspaperService.getCacheOpenedPanel("sbg");

            if (angular.isUndefined(tempOpenedPanels)) {
                $scope.status.isPanelOpenArray[0] = true;
                return;
            }
            $scope.status.isPanelOpenArray[0] = false;
            for (var i in $scope.data.panels) {
                if (tempOpenedPanels[$scope.data.panels[i].DATE + $scope.data.panels[i].BANMIANID] === true) {
                    $scope.status.isPanelOpenArray[i] = true;
                    getCachedById(i);
                }
            }
        }
        /**
         * [listeningcacheDate description] 监听缓存  
         * @return {[type]} [description]
         */
        function listenerCacheDate() {
            $scope.$on('$destroy', function() {
                $interval.cancel($scope.promise);
                pagePreview.cleanCache();
            });
        }
        /**
         * [cacheDate description] 缓存数据以提高渲染速度  
         * @return {[type]} [description]
         */
        function cacheDate(data) {
            if ($cacheFactory.get($scope.status.cachedName)) $cacheFactory.get($scope.status.cachedName).destroy();
            var copyedData = angular.copy(data);
            var cache = $cacheFactory($scope.status.cachedName);
            var documents = [];
            for (var i in copyedData) {
                cache.put(copyedData[i].BANMIANID + copyedData[i].DATE, copyedData[i].DOCUMENTS);
                documents.push(copyedData[i].DOCUMENTS);
                if (i > 0)
                    copyedData[i].DOCUMENTS = [];
                // copyedData[i].INDEXID=i;
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
         * [selectCurArray description] 遍历出选择对象
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
         * [newspaperPreview description] 报纸预览
         * @param  {[type]} item [description] 当前对象
         */
        $scope.newspaperPreview = function(item) {
            var editPath = 'newspaperNewsPreview';
            var editParams = {
                paperid: item.SITEID,
                metadata: item.METADATAID,
                newspapertype: $scope.status.sbgpreview,
                doctype:item.DOCTYPEID
            };
            var editUrl = $state.href(editPath, editParams);
            // selectedArrayCahe($scope.data.selectedArray);
            $window.open(editUrl);
        };


        /**
         * [getCachedById description]点击版面加载缓存的数据，以提高页面加载速度
         * @param  {[type]} index [description]  panel下标
         * @return {[type]}       [description]
         */
        $scope.getCachedById = function(index, date) {
            setOpenedPanel(index, date);
            if ($scope.data.panels[index].DOCUMENTS.length > 0) return;
            else {
                $scope.loadingPromise = getCachedById(index);
            }
        };

        function setOpenedPanel(index) {
            for (var i in $scope.status.isPanelOpenArray) {
                if ($scope.data.panels[i]) {
                    $scope.status.cacheOpenedPanel[$scope.data.panels[i].DATE + $scope.data.panels[i].BANMIANID] = $scope.status.isPanelOpenArray[i];
                }
            }
            $scope.status.cacheOpenedPanel[$scope.data.panels[index].DATE + $scope.data.panels[index].BANMIANID] = !$scope.status.cacheOpenedPanel[$scope.data.panels[index].DATE + $scope.data.panels[index].BANMIANID];
            editNewspaperService.cacheOpenedPanel("sbg", $scope.status.cacheOpenedPanel);
        }
        /**
         * [getCachedById description] 获取对应panel下缓存的DOCUMENTS 为了展示loadingPromise
         * @param  {[type]} index [description] panel下标
         * @return {[type]}       [description] promise
         */
        function getCachedById(index) {
            var deferred = $q.defer();
            var panel = $scope.data.panels[index];
            if (angular.isDefined(panel)) {
                if (panel.DOCUMENTS.length === 0) {
                    var cache = $cacheFactory.get($scope.status.cachedName);
                    panel.DOCUMENTS = cache.get(panel.BANMIANID + panel.DATE);
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }
            return deferred.promise;
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
        }
        $scope.determineItemsInSelectedArray = function(item) {
            return determineItemsInSelectedArray(item);
        };


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
        //分类全选
        $scope.selectAllType = function(item) {
            $scope.status.judgement = determineItemsInSelectedArray(item);
            if ($scope.status.judgement) {
                deleteItemsInSelectedArray(item);
            } else {
                addDraftInSelectedArray(item);
            }
        };
        /**
         * [determineItemsInSelectedArray description]判断某个版面的元素是否全在选中的数组中
         * @param  {[array]} item [description]版面的所有稿件
         * @return {[bollean]}      [description]是否都在
         */
        function determineItemsInSelectedArray(item) {
            var isAllIn = true;
            if (item.length === 0) return false;
            for (var i = 0; i < item.length; i++) {
                if ($scope.data.selectedArray.indexOf(item[i]) < 0) {
                    isAllIn = false;
                }
            }
            return isAllIn;
        }
        /**
         * [deleteItemsInSelectedArray description]删除指点版面下所有在selectArray中的稿件
         * @param  {[array]} item [description]
         * @return {[type]}      [description]
         */
        function deleteItemsInSelectedArray(item) {
            for (var i = 0; i < item.length; i++) {
                if ($scope.data.selectedArray.indexOf(item[i]) > -1) {
                    $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item[i]), 1);
                }
            }
        }
        /**
         * [addDraftInSelectedArray description]向selectArray中添加元素
         * @param {[array]} item [description]版面的所有稿件
         */
        function addDraftInSelectedArray(item) {
            for (var i = 0; i < item.length; i++) {
                if ($scope.data.selectedArray.indexOf(item[i]) < 0) {
                    $scope.data.selectedArray.push(item[i]);
                }
            }
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
        /**
         * [initDropDown description]初始化日期，稿件类型下拉框
         * @return {[type]} [description]
         */
        function initDropDown() {
            $scope.data.selectdTime = initSingleSelecet.chooseTimeType();
            $scope.data.selectdTimeDefault = angular.copy($scope.data.selectdTime[3]);
            $scope.data.docTypeJsons = initSingleSelecet.newspaperDraftType();
            $scope.data.docType = angular.copy($scope.data.docTypeJsons[0]);
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
                value: 0,
                key: ""
            };
            $scope.data.BanMian.selectedBanMian = angular.isDefined($scope.data.BanMian.selectedBanMian.value) ? $scope.data.BanMian.selectedBanMian : allBanMian;
            var BanMianArray = [];
            BanMianArray.push(allBanMian);
            for (var i = 0; i < $scope.data.panels.length; i++) {
                var tempBanMian = {};
                tempBanMian.name = $scope.data.panels[i].BANMIAN;
                tempBanMian.value = $scope.data.panels[i].BANMIANID;
                BanMianArray.push(tempBanMian);
            }
            $scope.data.BanMian.BanMianArray = $filter('unique')(BanMianArray, 'value');
        }
        /**
         * [queryByDropdown description]点击下拉框查询列表
         * @param  {[type]} param [description]类型
         * @param  {[type]} value [description]请求参数
         * @return {[type]}       [description]
         */
        $scope.queryByDropdown = function(param, value) {
            $scope.params[param] = value;
            if (param == 'DocPubTime') {
                if (value.length < 10) {
                    $scope.params.OprTimeStart = null;
                    $scope.params.OprTimeEnd = null;
                } else {
                    $scope.params.OprTimeStart = $scope.data.fromdate;
                    $scope.params.OprTimeEnd = $scope.data.untildate;
                    $scope.params[param] = null;
                }
            }
            requestData();
        };
        //收起全部面板
        $scope.closeAllPanel = function() {
            angular.forEach($scope.data.panels, function(item, index) {
                $scope.status.isOpen[index] = false;
            });
        };
        /**
         * [singleSignZp description]签发照排
         * @param  {[obj]} item [description]传入的列表项或者选中的数组
         * @return {[type]}      [description]null
         */
        $scope.signedDraft = function(item) {
            if (!!item) {
                signZp([item]);
            } else {
                signZp($scope.data.selectedArray);
            }
        };
        /**
         * [signZp description]稿件签发照排操作
         * @param  {[array]} item [description]被选中的稿件
         * @return {[type]}      [description]
         */
        function signZp(item) {
            if ($scope.data.paperMsg.ISZHAOPAI === '0') {
                editNewspaperService.stopSignZp(item, function(result) {
                    requestData();
                }, function(result) {
                    requestData().then(function() {
                        if (result.reports[0].RESULT) {
                            result.paperid = $stateParams.paperid;
                            editNewspaperService.singZpInfo(result, function() {
                                requestData();
                            });
                        }
                    });
                });
            } else {
                editNewspaperService.useSignZP(item, function(result) {
                    requestData();
                }, function(result) {
                    requestData().then(function() {
                        if (result.reports[0].RESULT) {
                            result.paperid = $stateParams.paperid;
                            editNewspaperService.singZpInfo(result, function() {
                                requestData();
                            });
                        }
                    });
                });
            }
        }
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
            draftZhuanBan();
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

        /**
         * [draftZhuanBan description]报纸转版
         * @return {[type]} [description]null
         */
        function draftZhuanBan() {
            var transferData = {
                "title": "转版",
                "opinionTit": "转版意见",
                "isShowDate": true,
                "selectedArr": $scope.data.selectedArray
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
                promptRequest(params, '转版成功');
            });
        }
        //批量撤稿弹窗
        $scope.retractView = function() {
            retractView($scope.data.selectedArray);
        };
        /**
         * [retractView description]撤稿函数
         * @param  {[array]} item [description]选中的稿件
         * @return {[type]}      [description]
         */
        function retractView(item) {
            var transferData = {
                "title": "撤稿",
                "opinionTit": "撤稿原因",
                "items": item,
                "PaperId": $stateParams.paperid,
                "queryMethod": $scope.params.methodname
            };
            editNewspaperService.cancelSignedViews(transferData, function(result) {
                var params = {
                    'SrcDocIds': result.SrcDocIds,
                    'Option': result.opinion ? result.opinion : "",
                    "serviceid": "mlf_paper",
                    "methodname": "doCheGao"
                };
                promptRequest(params, '撤稿成功');
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
        //发稿单
        $scope.draftlist = function() {
            editingCenterService.draftList($scope.data.selectedArray, {
                "serviceid": "mlf_appfgd",
                "methodname": "paperShangBanbatchUpdateFgdUsers",
            }, function() {
                trsconfirm.alertType("发稿单操作成功", "", "success", false, function() {
                    requestData();
                });
            });
        };
        //收藏稿件方法
        function collectDraft(array) {
            var params = {
                serviceid: "mlf_myrelease",
                methodname: "collect",
                MetaDataIds: array
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("收藏成功", "", "success", false, function() {
                    requestData();
                });
            });
        }
        //批量退稿功能
        $scope.rejection = function() {
            rejectionDraftofPage($scope.data.selectedArray);
        };
        $scope.singleRejection = function(item) {
            rejectionDraftofPage([item]);
        };
        //退稿功能
        function rejectionDraftofPage(item) {
            var transferData = {
                "PaperId": $stateParams.paperid,
                "queryMethod": $scope.params.methodname,
                "item": item,
                "rejecectionMethod": "rejectionShangBanViewDatas"
            };
            editNewspaperService.rejectionDraft(transferData, function(result) {
                requestData();
            }, function(result) {
                requestData();
            });
        }
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
        //流程版本与操作日志
        $scope.showVersionTime = function(item) {
            editingCenterService.getVersionTime(item, false);
        };
        //稿件关联弹窗
        $scope.draftCorrelationView = function(id) {
            editNewspaperService.draftCorrelationViews(id, $stateParams.paperid, 2);
        };
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
        //搜索
        $scope.fullTextSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                $scope.status.isESSearch = true;
                $scope.status.isPanelOpenArray = {};
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
         * [refreshUnreadMessage description] 点击新消息提醒，刷新列表
         * @return {[type]} [description]
         */
        $scope.refreshUnreadMessage = function() {
            requestData().then(function() {
                $scope.status.isPanelOpenArray = {
                    0: true
                };
            });
            $scope.status.message.currUnreadNum = 0;
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
            promptRequest(params, '邮件外发成功');
        }
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
                    newspapertype: $scope.status.sbgedit
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


        function getESSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForPaperShangBanDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: "",
                        keywords: $scope.keywords ? $scope.keywords : ""
                    }, {
                        searchField: "docType",
                        keywords: $scope.data.docType.value
                    }, {
                        searchField: "docPubTime",
                        keywords: $scope.data.selectdTimeDefault.value
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
    }

]);
/**
 * Created by CC on 2015/02/25.
 */
