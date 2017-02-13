"use strict";
/**
 * resourceCenterXinhuaModule
 *Author:zhang.yuping
 *Rebuild:wang.jiang 2016-3-15
 * Description
 */
angular.module("resourceCenterXinhuaModule", ['resCenterXHRouterModule']).
controller('resCenterXHRelCtrl', ['$scope', '$filter', '$q', '$state', '$stateParams', '$timeout', '$interval', "trsHttpService", 'initComDataService', 'resourceCenterService', 'leftService', 'resCtrModalService', 'trsconfirm', 'trsspliceString', 'dateFilter', 'globleParamsSet', 'trsPrintService', '$window', 'storageListenerService',
    function($scope, $filter, $q, $state, $stateParams, $timeout, $interval, trsHttpService, initComDataService, resourceCenterService, leftService, resCtrModalService, trsconfirm, trsspliceString, dateFilter, globleParamsSet, trsPrintService, $window, storageListenerService) {
        initStatus();
        initData();
        /**
         * [initStatus description] 状态初始化
         */
        function initStatus() {
            $scope.page = {
                CURRPAGE: 1,
                PAGESIZE: globleParamsSet.setResourceCenterPageSize,
            };
            $scope.data = {
                items: [],
                headers: [],
                groups: [],
                selectedArray: [],
                directiveEditParams: {
                    metadataid: "",
                    chnldocid: "",
                    status: 0,
                    siteid: "",
                    channelid: "",
                },
                operFlags: [],
                suggestResult: "",
                suggestContentList: [],
                flagTotalItems: [],
            };

            $scope.status = {
                currModule: "xhsg",
                iwoEdit: {
                    1: "iwonews",
                    2: "iwoatlas"
                },
                newspaperEdit: {
                    1: "newspapertext",
                    2: "newspaperpic",

                },
                websiteEdit: {
                    1: "websitenews",
                    2: "websiteatlas",

                },
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                showbutton: false,
                hasphoto: false,
                unloadover: true,
                isFirstLoad: true,
                isPanelOpenArray: {
                    0: true
                }
            };
            $scope.basicParams = {
                channelName: $scope.status.currModule,
                typeName: $stateParams.typename,
                nodeId: $stateParams.nodeid
            };
            $scope.params = {
                typeid: "zyzx",
                serviceid: $scope.status.currModule,
                typeName: $stateParams.typename,
                nodeId: $stateParams.nodeid,
                nodename: $stateParams.nodename,
                modelId: "findFromNavigation",
                pageSize: $scope.page.PAGESIZE,
                pageNum: $scope.page.CURRPAGE,
                keyword: {
                    area: "",
                    zyzxfield: "",
                    account: ""
                },
                channelName: $scope.basicParams.channelName
            };
        }
        /** [clearPageData 清楚列表数据] */
        function clearPageData() {
            $scope.params.pageNum = 1;
            $scope.params.pageSize = globleParamsSet.setResourceCenterPageSize;
            $scope.data.items = [];
            $scope.data.selectedArray = [];
            $scope.status.unloadover = true;
        }
        /**
         * [initData description] 初始化数据
         */
        function initData() {
            if ($scope.basicParams.nodeId) {
                listenStorage();
                initDropDown();
                if ($scope.basicParams.nodeId == "navigation_001014" || $scope.basicParams.nodeId == "navigation_001015" || $scope.basicParams.typeName == "area" || $scope.basicParams.typeName == "zyzxfield") {
                    $scope.status.isFirstLoad = false;
                    requestData();
                } else {
                    requestListGroup();
                }
                // 定时刷新未读消息
                var timer = $interval(getPageInfobyItem, 30000);
                $scope.$on("$destroy", function() {
                    $interval.cancel(timer);
                });
            }
        }

        /**
         * [listenStorage description]监听本地缓存
         * @return {[promise]} [description] promise
         */
        function listenStorage() {
            storageListenerService.listenResource(function() {
                requestData();
                storageListenerService.removeListener("resource");
            });
        }
        /**
         * [getDraftRecord description]添加取稿件人字段
         * @param  {[str]} guids [description]
         * @return {[type]}       [description]
         */
        function getDraftRecord(guids) {
            var deferred = $q.defer();
            if (guids) {
                var params = {
                    serviceid: "mlf_bigdataexchange",
                    methodname: "queryQuOpersList",
                    guids: guids
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "POST").then(function(data) {
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
        }
        /**
         * [requestData description]数据请求
         * @return {[type]} [description]
         */
        function requestData(item) {
            var params = angular.copy($scope.params);
            params.keyword = JSON.stringify(params.keyword);
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                $scope.page = data.summary_info;
                $scope.basicParams.indexName = data.summary_info.indexName;
                $scope.data.selectedArray = [];
                $scope.numberOfNewDocs = 0;
                //渲染表头
                renderTableHeader(data.summary_info.hybaseField);
                if ($scope.status.hasphoto) {
                    renderImgList(data.content);
                } else {
                    if ($scope.status.isFirstLoad) {
                        if (angular.isDefined(item)) {
                            item.totalItems = angular.copy(data.content);
                        }
                        renderGroupList(item);
                    } else {
                        $scope.data.items = data.content;
                        renderList(data.content);
                    }
                }
            });
        }
        /** [requestListGroup 请求分组列表] */
        function requestListGroup() {
            var params = {
                typeid: "zyzx",
                modelid: "dateStatistic",
                serviceid: $scope.basicParams.channelName,
                nodeId: $scope.basicParams.nodeId
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                $scope.data.groups = data;
                if (data.length) {
                    $scope.params.keyword.time = data[0].strValue + "," + data[0].strValue;
                    $scope.params.pageSize = data[0].iRecordNum;
                    requestData($scope.data.groups[0]);
                }
            });
        }
        /** [renderTableHeader description 渲染标头] */
        function renderTableHeader(header) {
            if (!$scope.data.headers.length) {
                $scope.data.headers = header;
                var draftRecord = {
                    FIELDCNNAME: "取稿人",
                    FIELDENNAME: "DRAFTRECORD"
                };
                $scope.data.headers.splice(1, 0, draftRecord); //添加取稿记录
            }
            if ($scope.data.headers) {
                $scope.IsHeadersShow = true;
            }
        }
        /** [renderImgList description 渲染图片列表] */
        function renderImgList(list) {
            $scope.data.items = $scope.data.items.concat(list);
            if ($scope.page.total < $scope.page.PAGESIZE) {
                $scope.status.unloadover = false;
            }
            getImgList($scope.data.items);
        }
        /** [renderGroupList description 渲染分组列表] */
        function renderGroupList(item) {
            if (angular.isDefined(item)) {
                var index = item.items && item.items.length || 0;
                if (index >= item.totalItems.length) return;
                // item.items = angular.copy(item.totalItems).splice(0, 20);
                var list = angular.copy(item.totalItems).splice(index, 20);
                //获得已经显示的所有item值
                $scope.data.flagTotalItems = $scope.data.flagTotalItems.concat(angular.copy(item.totalItems).splice(index, 20));
            }
            $scope.data.guids = trsspliceString.spliceString(list, "ZB_GUID", ',');
            getDraftRecord($scope.data.guids).then(function(data) {
                if (angular.isObject(data)) {
                    $scope.data.draftRecords = data;
                    traverseDraftrecord(list);
                }
            });
            initOperFlag(null, list);
            getImgList(list, item);
        }
        $scope.renderGroupList = function(item) {
            renderGroupList(item);
        };
        /** [renderList description 渲染列表] */
        function renderList(list) {
            $scope.data.flagTotalItems = list;
            // $scope.data.items = list;
            initOperFlag();
            $scope.data.guids = trsspliceString.spliceString(list, "ZB_GUID", ',');
            getDraftRecord($scope.data.guids).then(function(data) {
                if (angular.isObject(data)) {
                    traverseDraftrecord(list);
                }
            });
            getImgList(list);
        }
        /**
         * [pageChanged description]分页
         * @return {[type]} [description]
         */
        $scope.pageChanged = function() {
            $scope.params.pageNum = $scope.page.CURRPAGE;
            requestData();
        };
        /**
         * [selectPageNum description]单页选择条数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            $scope.params.pageNum = $scope.page.CURRPAGE;
            $scope.params.pageSize = $scope.page.PAGESIZE;
            requestData();
        };
        /**
         * [selectAll description:全选]
         */
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
        };
        /**
         * [selectDoc 单选]
         * @param  {[type]} item [description：单个对象]
         */
        $scope.selectDoc = function(item) {
            var index = $scope.data.selectedArray.indexOf(item);
            if (index < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice(index, 1);
            }
        };
        /**
         * [switchImg description]显示类型的图片
         * @param  {[type]} item  [description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        $scope.switchImg = function(item, index) {
            item.pos = index > 5 ? true : false;
            $scope.curImg = item.ZB_GUID;
        };
        /**
         * [initDropDown description]下拉框初始化
         */
        function initDropDown() {
            var params = {
                menuName: "time",
                modelid: "getSearchMenu",
                serviceid: $scope.status.currModule,
            };
            params = angular.extend(params, $scope.basicParams);
            resourceCenterService.getListDownData(params, "time", function(data) {
                $scope.data.timeArray = data;
                $scope.data.selectedTime = data[0];
            });
            resourceCenterService.getListDownData(params, "menuscriptType", function(data) {
                $scope.data.doctypeArray = data;
                $scope.data.selectedDoctype = data[0];
            });
        }
        /**
         * [initOperFlag description] 初始化取签见撤重
         */
        function initOperFlag(item, list) {
            var docIds = trsspliceString.spliceString($scope.data.flagTotalItems || item && item.items, "ZB_GUID", ",");
            if (list) {
                docIds = trsspliceString.spliceString(list, "ZB_GUID", ",");
            }
            if (docIds) {
                var params = {
                    methodname: "queryFlag",
                    serviceid: "mlf_bigdataexchange",
                    guids: docIds
                };
                params = angular.extend(params, $scope.basicParams);
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    var temp = data;
                    for (var i in temp) {
                        if (angular.isDefined(data[i]) && data[i].OPERFLAG && data[i].OPERFLAG.indexOf("1") > -1) {
                            $scope.data.operFlags = $filter('unique')($scope.data.operFlags.concat(data[i]), 'GUID');
                        }
                    }
                });

            }
            //查询取稿人无奈之举
            if (angular.isUndefined(item)) {
                var draftRecords = $scope.data.flagTotalItems.length > 20 ? trsspliceString.spliceString($scope.data.flagTotalItems, "ZB_GUID", ",") : $scope.data.guids;
                getDraftRecord(draftRecords).then(function(data) {
                    if (data) {
                        $scope.data.draftRecords = data;
                        if ($scope.data.groups.length > 0) {
                            for (var i = 0; i < $scope.data.groups.length; i++) {
                                if ($scope.data.groups[i].items) {
                                    traverseDraftrecord($scope.data.groups[i].items);
                                }
                            }
                        } else {
                            traverseDraftrecord($scope.data.items);
                        }
                    }
                });
            }
        }
        /**
         * [traverseDraftrecord description]遍历获取取稿人信息
         * @param  {[array]} draft [description]稿件数组
         * @return {[type]}       [description]
         */
        function traverseDraftrecord(draft) {
            angular.forEach(draft, function(value, key) {
                value.DRAFTRECORD = $scope.data.draftRecords[value.ZB_GUID];
                if (angular.isDefined(value.DRAFTRECORD)) {
                    for (var i = 0; i < value.DRAFTRECORD.length; i++) {
                        var temp = value.DRAFTRECORD[i].OPERUSER;
                        temp = temp.split('-');
                        value.DRAFTRECORD[i].OPERUSER = temp.length > 1 ? temp[0] + '-' + temp.pop() : temp[0];
                    }
                }
            });
        }
        /** [getImgList 单独请求图片] */
        function getImgList(list, item) {

            var docIds = trsspliceString.spliceString(list, "ZB_GUID", ",");
            if (docIds) {
                var params = {
                    typeid: "zyzx",
                    modelid: "getImgList",
                    serviceid: $scope.basicParams.channelName,
                    channelName: $scope.basicParams.channelName,
                    guids: docIds
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                    if (data.result == "success") {
                        var temp = data.content[0];
                        var arr = list || angular.copy($scope.data.items);

                        var index = $scope.hasphoto ? ($scope.params.pageNum - 1) * $scope.params.pageSize : 0;

                        /*for (var i = index; i < arr.length; i++) {
                             var value = arr[i];
                             if (!value.imgurl) {
                                 value.imgurl = temp[value.ZB_GUID] && temp[value.ZB_GUID].IMAGEURLS;

                             }
                         }*/
                        angular.forEach(arr, function(value, key) {
                            value.imgurl = temp[value.ZB_GUID] && temp[value.ZB_GUID].IMAGEURLS;
                        });
                        $timeout(function() {
                            $scope.data.items = arr;

                        }, 0);

                        item && (item.items = item.items ? item.items.concat(arr) : [].concat(arr));

                    }
                });
            }
        }
        /**
         * [openTakeDraftModal description]取稿
         * @return {[type]} [description]
         */
        $scope.openTakeDraftModal = function() {
            if (!determineSelected()) return;
            var params = {
                serviceid: "mlf_bigdataexchange",
                methodname: "fetch",
                guid: trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
            };
            params = angular.extend(params, $scope.basicParams);
            var isOnlyOne = $scope.data.selectedArray.length > 1 ? false : true;
            var modalInstance = resCtrModalService.fullTakeDraft(params, isOnlyOne);
            modalInstance.result.then(function() {
                initOperFlag();
                $scope.data.selectedArray = [];
            }, function() {
                initOperFlag();
                $scope.data.selectedArray = [];
            });
            /* modalInstance.result.then(function(result) {
                 params = angular.extend(params, result);
                 trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                     initOperFlag();
                     if (!!result.APP || result.items.length > 1) {
                         trsconfirm.alertType("取稿成功！", "", "success", false, "");
                         return;
                     }
                     getDirectEditParams(data, result).then(function() {
                         var state = getDirectEditRouter(result);
                         (result.btnOp == 1) && $window.open($state.href(state, $scope.data.directiveEditParams), '_blank');
                     });

                 });
             });*/

        };

        /**
         * [getDirectEditParams description] 组装直接编辑参数
         * @param  {[type]} data   [description]    保存成功稿件后返回的数据
         * @param  {[type]} result [description]    由弹窗返回的数据
         * @return {[type]}        [description]
         */
        function getDirectEditParams(data, result) {
            $scope.data.directiveEditParams.chnldocid = data.REPORTS[0].CHNLDOCID;
            $scope.data.directiveEditParams.metadataid = data.REPORTS[0].METADATAID;
            var params = {
                serviceid: "mlf_paperset",
                methodname: "findPaperById",
                SiteId: result.siteid
            };
            var deferred = $q.defer();
            if (!!result.siteid) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function() {
                    $scope.data.directiveEditParams.siteid = result.siteid;
                    $scope.data.directiveEditParams.paperid = result.siteid;
                    $scope.data.directiveEditParams.channelid = result.Web;
                    $scope.data.directiveEditParams.metadata = data.REPORTS[0].METADATAID;
                    $scope.data.directiveEditParams.newspapertype = data.ISDUOJISHEN == '0' ? 2 : 1;
                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        }
        /**
         * [getDirectEditRouter description]组装取稿时直接编辑的路由
         * @param  {[type]} result [description] 弹窗返回数据
         */
        function getDirectEditRouter(result) {
            if (Boolean(result.ToMy)) {
                $scope.data.directiveEditParams.belongedType = "iwoEdit";
                return $scope.status.iwoEdit[result.items[0].doctype];
            } else if (Boolean(result.Paper)) {
                $scope.data.directiveEditParams.belongedType = "newspaperEdit";
                return $scope.status.newspaperEdit[result.items[0].doctype];
            } else if (Boolean(result.Web)) {
                $scope.data.directiveEditParams.belongedType = "websiteEdit";
                return $scope.status.websiteEdit[result.items[0].doctype];
            }
        }

        /**
         * [determineSelected description] 判断是否有选中稿件
         */
        function determineSelected() {
            if (!$scope.data.selectedArray.length) {
                trsconfirm.alertType("请先选择稿件！", "", "error", false, "");
                return false;

            } else {
                return true;
            }
        }
        /** ---------------搜索建议开始-------------- */
        /**
         * [showOperFlag isArrayContain] 判断数组重复性
         * @param  {[type]} list      [数组]
         * @param  {[type]} item      [匹配对象]
         * @return {[type]}           [description]
         */
        function isContain(list, item) {
            var temp = false;
            angular.forEach(list, function(value, key) {
                if (value.dictid == item.dictid) {
                    temp = true;
                    return;
                }
            });
            return temp;
        }
        /** [getSuggestResult 获取搜索建议结果] */
        function getSuggestResult(item) {
            if (!isContain($scope.data.suggestContentList, item) && item) {
                $scope.status.isFirstLoad = false;
                item.type = item.dicttype == "area" ? "area" : (item.dicttype == "zyzxfield" ? "zyzxfield" : "account");
                $scope.data.suggestContentList.push(item);
                FormatSuggestParams();
                clearPageData();
                requestData();
            }
        }
        /** [FormatSuggestParams 格式化搜索推荐参数] */
        function FormatSuggestParams() {
            var paramObj = {},
                list = $scope.data.suggestContentList;
            if (list.length) {
                angular.forEach(list, function(value, key) {
                    if (!paramObj[value.type]) {
                        paramObj[value.type] = [];
                    }
                    paramObj[value.type].push(value.dictid);
                });
            }
            $scope.params.keyword = angular.extend($scope.params.keyword, {
                area: paramObj.area && paramObj.area.join(",") || "",
                zyzxfield: paramObj.zyzxfield && paramObj.zyzxfield.join(",") || "",
                account: paramObj.account && paramObj.account.join(",") || ""
            });
        }
        $scope.getSuggestResult = function(item) {
            $scope.params.keyword.keywords = "";
            $scope.filterKeyWord = "";
            getSuggestResult(item);
        };
        /** [removeItem 移除选中的检索词] */
        $scope.removeItem = function(index, list) {
            list.splice(index, 1);
            FormatSuggestParams();
            clearPageData();
            requestData();
        };
        /** ---------------搜索建议结束-------------- */
        /**
         * [searchWithKeyword description]条件过滤
         */
        $scope.searchWithKeyword = function(key, value) {
            $scope.status.isFirstLoad && ($scope.params.keyword.time = "-1");
            $scope.status.isFirstLoad = false;
            (key == "time") && (value = value.value == "custom" ? [dateFilter(value.startdate, 'yyyy-MM-dd'), dateFilter(value.enddate, 'yyyy-MM-dd')].join(',') : value.CNNAME);
            $scope.params.keyword[key] = value;
            if ($scope.params.keyword.menuscriptType == 2) {
                $scope.status.showbutton = true;
            } else {
                $scope.status.showbutton = false;
                $scope.status.hasphoto = false;
            }
            clearPageData();
            requestData();
        };
        /** [loadNewItems 刷新未读消息] */
        $scope.loadNewItems = function() {
            if ($scope.basicParams.typeName == "xlfl") {
                $scope.status.isFirstLoad = true;
                $scope.params.keyword = {
                    area: "",
                    zyzxfield: "",
                    account: ""
                };
                requestListGroup();
            } else {
                requestData();
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
        /**
         * [queryItemBYGUID description] 根据guid获取在WCM内的取签见撤重的二进制数
         * @param  {[type]} guid [description]
         * @return {[type]}      [description]
         */
        function queryItemBYGUID(guid) {
            for (var i in $scope.data.operFlags) {
                if (guid == $scope.data.operFlags[i].GUID) {
                    return $scope.data.operFlags[i];
                }
            }
        }
        /**
         * [getPageInfobyItem description]加载未读消息
         * @return {[type]} [description]
         */
        function getPageInfobyItem() {
            if ($scope.page && $scope.page.maxId) {
                var params = {
                    modelid: "getNumberOfNewRecords",
                    typeid: "zyzx",
                    serviceid: $scope.basicParams.channelName,
                    maxId: $scope.page.maxId,
                    keyword: JSON.stringify($scope.params.keyword)
                };
                params = angular.extend(params, $scope.basicParams);
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                    $scope.numberOfNewDocs = data.number;
                });
            }
        }
        // 取签见撤重 点击弹出
        $scope.viewBigDataInfo = function(ChnlDocId, showRepeat) {
            var infoModal = resCtrModalService.bigDataInfoModal(ChnlDocId, showRepeat);
        };
        /**
         * [printbtn description]打印
         */
        $scope.printbtn = function() {
            var params = {
                "serviceid": 'xhsg',
                "modelid": "detailData",
                "guid": trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                "channelName": $scope.basicParams.channelName,
                "typeid": "zyzx",
                "indexName": $scope.page.indexName,
            }
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                var img = "",
                    content = "";
                angular.forEach(data.content, function(value, key) {
                    content = angular.copy(value.CONTENT);
                    value.CONTENT = value.CONTENT.substring(0, value.CONTENT.indexOf('<div align="center"><img'));
                    img = content.substring(content.indexOf('<div align="center"><img'));
                    value.CONTENT = img + value.CONTENT;
                });
                trsPrintService.trsPrintBigData(data);
            });
        };
        /** 批量打印 */
        $scope.batchPrintbtn = function() {
            var params = {
                sourceName: "新华社稿",
                channelName: $scope.basicParams.channelName,
                typeName: $scope.basicParams.typeName
            };
            resCtrModalService.printModal(params);
        };
        //创作轴
        $scope.CreationAxis = function() {
            if (!determineSelected()) return;
            var params = angular.copy($scope.basicParams);
            params.guid = trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ",");
            resourceCenterService.setBigDataCreation(params).then(function(data) {
                trsconfirm.alertType("该稿件已成功加入创作轴!", "", "success", false, function() {
                    $scope.data.selectedArray = [];
                });
            });
        };
        // 预留
        $scope.openReserveDraftModal = function() {
            if (!determineSelected()) return;
            var resCtrModalServiceModal = resCtrModalService.reserveDraft($scope.data.selectedArray);
            resCtrModalServiceModal.result.then(function(result) {
                delete result.items;
                var params = {
                    serviceid: "mlf_bigdataexchange",
                    methodname: "delay",
                    guid: trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                };
                params = angular.extend(params, $scope.basicParams);
                params = angular.extend(params, result);
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("预留成功!", "", "success", false, function() {
                        initOperFlag();
                        $scope.data.selectedArray = [];
                    });
                }, function() {
                    initOperFlag();
                    $scope.data.selectedArray = [];
                });
            });
        };

        // 收藏
        $scope.collect = function() {
            if (!determineSelected()) return;
            var params = {
                serviceid: "mlf_bigdataexchange",
                methodname: "collect",
                guid: trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
            };
            params = angular.extend(params, $scope.basicParams);
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("收藏成功!", "", "success", false, "");
            });
        };
        /** 导出 */
        $scope.export = function() {
            if (!determineSelected()) return;
            var params = {
                serviceid: 'mlf_exportword',
                methodname: 'exportBigDataDocs',
                GUIDS: trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                CHANNELNAMES: $scope.basicParams.channelName,
                indexName: $scope.page.indexName
            }
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
            })
        };
        /** 切换文字图片列表 */
        $scope.togglehasphoto = function(temp) {
            $scope.status.hasphoto = temp;
            clearPageData();
            requestData();
        };
        /** [loadMore 加载图片分页] */
        $scope.loadMore = function() {
            $scope.params.pageNum++;
            if ($scope.params.pageNum >= $scope.page.PAGECOUNT) {
                $scope.status.unloadover = false;
                return;
            }
            requestData();
        };
        /**
         * [getCachedById description]点击报纸的版面加载缓存的数据，以提高页面加载速度
         * @param  {[type]} index [description]  版面下标
         * @return {[type]}       [description]
         */
        $scope.getCachedById = function(group) {
            if (!group.items) {
                $scope.params.keyword.time = group.strValue + "," + group.strValue;
                $scope.params.pageSize = group.iRecordNum;
                requestData(group);
            }
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
            if (item) {
                var isAllIn = true;
                if (item.length === 0) return false;
                for (var i = 0; i < item.length; i++) {
                    if ($scope.data.selectedArray.indexOf(item[i]) < 0) {
                        isAllIn = false;
                    }
                }
                return isAllIn;
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
    }
]);
