"use strict";
angular.module('newspaperArchiveDraftModule', []).
controller('newspaperArchiveDraftCtrl', ["$scope", "$timeout", "$q", "$stateParams", "$cacheFactory", "$modal", "trsHttpService", "initSingleSelecet", "editNewspaperService", 'trsspliceString', "trsconfirm", "editingCenterService", "$interval", "initVersionService", "trsPrintService", "storageListenerService", "globleParamsSet", "editcenterRightsService", "pagePreview", "$state", "$window", "localStorageService",
    function($scope, $timeout, $q, $stateParams, $cacheFactory, $modal, trsHttpService, initSingleSelecet, editNewspaperService, trsspliceString, trsconfirm, editingCenterService, $interval, initVersionService, trsPrintService, storageListenerService, globleParamsSet, editcenterRightsService, pagePreview, $state, $window, localStorageService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.page = {
                CURRPAGE: 1,
                PAGESIZE: globleParamsSet.getPageSize()
            };
            $scope.params = {
                serviceid: "mlf_paper",
                methodname: "queryGuiDangDocs",
                PaperId: $stateParams.paperid,
                OprTime: "1m"
            };
            $scope.status = {
                btnRights: "",
                selectdTimeDefault: "",
                selectdTime: "",
                docType: "",
                docTypeJsons: "",
                isOpenedPanelArray: { //默认打开第一个面板
                    0: true
                },
                yqgpreview: 3,
                cachedName: "newspaperArchiveDocuments", //缓存key
                cacheOpenedPanel: {},
                cacheOpenedPanelKey: "gdg",
                isEsSearch: false,
            };
            $scope.data = {
                paperMsg: "",
                selectedArray: [],
                panels: [],
                selectedArrayObj: [],
                msSpecialNeedArr:["广告提交库","编辑广告提交库","编辑新闻中心提交库","新闻中心"]
            };
        }

        function initData() {
            editingCenterService.getSiteInfo($stateParams.paperid).then(function(data) {
                $scope.data.paperMsg = data;
            });
            requestData();
            initDropDown();
            editcenterRightsService.initNewspaperListBtn("paper.guidang", $stateParams.paperid).then(function(data) {
                $scope.status.btnRights = data;
            });
            listenStorage();
        }

        function initDropDown() {
            $scope.status.selectdTime = initSingleSelecet.chooseTimeType();
            $scope.status.selectdTimeDefault = angular.copy($scope.status.selectdTime[3]);
            $scope.status.docTypeJsons = initSingleSelecet.newspaperDraftType();
            $scope.status.docType = angular.copy($scope.status.docTypeJsons[0]);
        }
        /**
         * [listenStorage description]监听缓存
         * @return {[type]} [description]null
         */
        function listenStorage() {
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

        function requestData() {
            var params = $scope.status.isEsSearch ? getEsSearchParams() : $scope.params;
            var deferred = $q.defer();
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "GET").then(function(data) {
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
            var copyedData = angular.copy(data);
            $scope.data.selectedArrayObj = [];
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
         * [setOpendPanel description]将打开的panel缓存起来
         * @param {[type]} index [description]
         */
        function setOpendPanel(index) {
            for (var i in $scope.status.isOpenedPanelArray) {
                $scope.status.cacheOpenedPanel[$scope.data.panels[i].BANMIANID] = $scope.status.isOpenedPanelArray[i];
            }
            $scope.status.cacheOpenedPanel[$scope.data.panels[index].BANMIANID] = !$scope.status.cacheOpenedPanel[$scope.data.panels[index].BANMIANID];
            editNewspaperService.cacheOpenedPanel($scope.status.cacheOpenedPanelKey, $scope.status.cacheOpenedPanel);
        }
        /**
         * [openDefaultPanels description]打开默认的panel
         * @return {[type]} [description]
         */
        function openDefaultPanels() {
            var tempOpenedPanels = editNewspaperService.getCacheOpenedPanel($scope.status.cacheOpenedPanelKey);
            if (angular.isUndefined(tempOpenedPanels)) {
                $scope.status.isOpenedPanelArray[0] = true;
                return;
            }
            $scope.status.isOpenedPanelArray[0] = false;
            for (var i in $scope.data.panels) {
                if (tempOpenedPanels[$scope.data.panels[i].BANMIANID] === true) {
                    $scope.status.isOpenedPanelArray[i] = true;
                    getCachedById(i);
                }
            }
        }
        /**
         * [getCachedById description]点击版面加载缓存的数据，以提高页面加载速度
         * @param  {[type]} index [description]  panel下标
         * @return {[type]}       [description]
         */
        $scope.getCachedById = function(index) {
            setOpendPanel(index);
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
            var deferred = $q.defer();
            var panel = $scope.data.panels[index];
            if (panel.DOCUMENTS.length === 0) {
                var cache = $cacheFactory.get($scope.status.cachedName);
                panel.DOCUMENTS = cache.get(panel.BANMIANID);
                deferred.resolve();
            } else {
                deferred.reject();
            }
            return deferred.promise;
        }
        $scope.queryByDropdown = function(param, value) {
            $scope.params[param] = value;
            if (param == 'OprTime') {
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
        $scope.selectDoc = function(item) {
            if ($scope.data.selectedArray.indexOf(item) < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
            }
            //缓存当前选中项
            pagePreview.selectedArrayCahe($scope.data.selectedArray);

        };
        //分类全选
        $scope.selectAllType = function(item) {
            $scope.status.judgement = determineItemsInSelectedArray(item);
            if ($scope.status.judgement) {
                deleteItemsInSelectedArray(item);
            } else {
                addDraftInSelectedArray(item);
            }
        };
        $scope.determineItemsInSelectedArray = function(item) {
            return determineItemsInSelectedArray(item);
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
        $scope.showVersionTime = function(item) {
            editingCenterService.getVersionTime(item, false);
        };
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
        /**
         * [reduction description]还原操作
         * @return {[type]} [description]
         */
        $scope.reduction = function() {
            trsconfirm.inputModel("还原", "还原意见（可选）", function(content) {
                var params = {
                    serviceid: "mlf_paper",
                    methodname: "doRestore",
                    SrcDocIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
                    // SrcBanMianIds: trsspliceString.spliceString($scope.data.selectedArray, "CHNLID", ","),
                    Option: content
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("还原成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
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
            // pagePreview.listItemCache($scope.data.allDOCUMENTS);
            listItemCache($scope.data.selectedArrayObj);
            $window.open(editUrl);
        };
        /**
         * [cacheDate description] 缓存存储
         * @return {[type]} [description]
         */
        function listItemCache(data) {
            var cachePreviewMetadataid = [];
            angular.forEach(data, function(data, index, array) {
                cachePreviewMetadataid.push(data.METADATAID);
            });
            localStorageService.set("newspaperPreviewCache", cachePreviewMetadataid);
        }
        /**
         * [fullTextSearch description]es检索
         * @param  {[obj]} ev [description]事件对象
         * @return {[type]}    [description]
         */
        $scope.fullTextSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                $scope.status.isEsSearch = true;
                $scope.status.openedPanel = {};
                requestData();
            }
        };
        /**
         * [getESSearchParams description]获得es的请求参数
         * @return {[type]} [description]
         */
        function getEsSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForPaperGuiDangDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: "",
                        keywords: $scope.data.keywords ? $scope.data.keywords : ""
                    }, {
                        searchField: "DocType",
                        keywords: $scope.status.docType.value
                    }, {
                        searchField: "OprTime",
                        keywords: $scope.status.selectdTimeDefault.value
                    }, {
                        searchField: "paperid",
                        keywords: $stateParams.paperid
                    }]
                }
            };
            esParams.searchParams = JSON.stringify(esParams.searchParams);
            return esParams;
        }
    }

]);
/**
 * Created by CC on 2015/03/08.
 */
