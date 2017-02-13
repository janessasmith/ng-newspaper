"use strict";
angular.module("resourceCenterIwoModule", []).
controller("resourceCenterIwoCtrl", [
    '$scope',
    '$q',
    'initComDataService',
    'resCtrModalService',
    'trsconfirm',
    'trsHttpService',
    'trsspliceString',
    '$stateParams',
    'resourceCenterService',
    'dateFilter',
    '$timeout',
    '$state',
    'globleParamsSet',
    '$window',
    '$interval',
    'storageListenerService',
    'trsPrintService',
    function($scope, $q, initComDataService, resCtrModalService, trsconfirm, trsHttpService, trsspliceString, $stateParams, resourceCenterService, dateFilter, $timeout, $state, globleParamsSet, $window, $interval, storageListenerService, trsPrintService) {
        initStatus();
        loadData();
        /** [initStatus 初始化状态] */
        function initStatus() {
            $scope.page = {
                PAGESIZE: globleParamsSet.setResourceCenterPageSize,
                CURRPAGE: 1
            };
            $scope.data = {
                items: [],
                selectedArray: [],
                directiveEditParams: {
                    metadataid: "",
                    chnldocid: "",
                    status: 0,
                    siteid: "",
                    channelid: "",
                },
                operFlags: [],
            };
            $scope.status = {
                currModule: "iwo",
                iwoEdit: {
                    1: "iwonews",
                    2: "iwoatlas",

                },
                newspaperEdit: {
                    1: "newspapertext",
                    2: "newspaperpic",

                },
                websiteEdit: {
                    1: "websitenews",
                    2: "websiteatlas",

                },
                position: {
                    iwo: '0',
                    newspaper: '1',
                    website: '2'
                },
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                }
            };
            $scope.basicParams = {
                channelName: $scope.status.currModule,
                typeName: $stateParams.typename,
                nodeId: $stateParams.nodeid,
                preKeyWord: ""
            };
            $scope.params = {
                content_keyword: "",
                time: ""
            }
        }
        /** [loadData 初始化数据] */
        function loadData() {
            if ($scope.basicParams.nodeId) {
                listenStorage();
                initDropDown();
                requestData();
                // 定时刷新未读消息
                var timer = $interval(getPageInfobyItem, 30000);
                $scope.$on("$destroy", function() {
                    $interval.cancel(timer);
                });
            }
        }
        /** [clearPageData 清楚列表数据] */
        function clearPageData() {
            $scope.page.CURRPAGE = 1;
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
         * [initDropDown description]下拉框初始化
         */
        function initDropDown() {
            var params = {
                serviceid: "xhsg",
                channelName: "xhsg",
                typeName: "area"
            };
            resourceCenterService.getListDownData(params, "time", function(data) {
                $scope.data.timeArray = data;
                $scope.data.selectedTime = data[0];
            });
        }
        /** [requestParams 加载请求参数] */
        // function requestParams() {
        //     $scope.loadingPromise = resourceCenterService.subscibeSearch({
        //         id: $scope.basicParams.nodeId,
        //         pageNum: $scope.page.CURRPAGE,
        //         pageSize: $scope.page.PAGESIZE
        //     }).then(function(data) {
        //         if (data && data.result == "success") {
        //             $scope.params = data.condition;
        //             $scope.data.items = data.content;
        //             $scope.page = data.summary_info;
        //             $scope.basicParams.indexName = data.summary_info.indexName;
        //             $scope.basicParams.preKeyWord = angular.copy($scope.params.content_keyword);
        //             $scope.paramsChannel = data.channelName;
        //             $scope.data.selectedArray = [];
        //             getImgList();
        //             initOperFlag();
        //         }
        //     });
        // }
        /** [requestData 请求数据] */
        function requestData() {
            var params = {
                serviceid: "subscript",
                modelid: "subSearch",
                typeid: "zyzx",
                pageNum: $scope.page.CURRPAGE,
                pageSize: $scope.page.PAGESIZE,
                content_keyword: $scope.params.content_keyword,
                time: $scope.params.time,
                id: $scope.basicParams.nodeId
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                if (data.result == "success") {
                    $scope.data.items = data.content;
                    $scope.page = data.summary_info;
                    $scope.basicParams.indexName = data.summary_info.indexName;
                    $scope.numberOfNewDocs = 0;
                    getImgList();
                    initOperFlag();
                }
            });
        }
        /** －－－－－－－分页开始－－－－－－ */
        /**
         * [pageChanged description]分页
         * @return {[type]} [description]
         */
        $scope.pageChanged = function() {
            $scope.params.pageNum = $scope.page.CURRPAGE;
            requestData();
        };
        /*跳转指定页面*/
        $scope.jumpToPage = function() {
            if ($scope.jumpToPageNum > $scope.page.PAGECOUNT) {
                $scope.page.CURRPAGE = $scope.page.PAGECOUNT;
                $scope.jumpToPageNum = $scope.page.CURRPAGE;
            }
            $scope.status.CurrPage = $scope.jumpToPageNum;
            $scope.page.CURRPAGE = angular.copy($scope.jumpToPageNum);
            requestData();
        };
        /**
         * [selectPageNum description]单页选择分页数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            requestData();
        };
        /** －－－－－－－分页结束－－－－－－ */
        /**
         * [initOperFlag description] 初始化取签见撤重
         */
        function initOperFlag() {
            var docIds = trsspliceString.spliceString($scope.data.items, "ZB_GUID", ",");
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
                        if (angular.isDefined(data[i]) && data[i].OPERFLAG.indexOf("1") > -1) {
                            $scope.data.operFlags = $scope.data.operFlags.concat(data[i]);
                        }
                    }
                });
            }
        }
        /** [getImgList 单独请求图片] */
        function getImgList() {
            var docIds = trsspliceString.spliceString($scope.data.items, "ZB_GUID", ",");
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
        }
        /** --------- 稿件操作开始 --------- */
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
        };
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
        /**
         * [printbtn description]打印
         */
        $scope.printbtn = function() {
            var params = {
                "serviceid": 'iwo',
                "modelid": "detailData",
                "guid": trsspliceString.spliceString($scope.data.selectedArray, "ZB_GUID", ","),
                "channelName": $scope.basicParams.channelName,
                "typeid": "zyzx",
                "indexName": $scope.page.indexName,
            }
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                trsPrintService.trsPrintBigData(data);
            });
        };
        /** --------- 稿件操作结束 --------- */
        /** [过滤操作] */
        /**
         * [searchWithKeyword description]条件过滤
         */
        $scope.searchWithKeyword = function(key, value) {
            (key == "time") && (value = value.value == "custom" ? [dateFilter(value.startdate, 'yyyy-MM-dd'), dateFilter(value.enddate, 'yyyy-MM-dd')].join(',') : value.CNNAME);
            $scope.params[key] = value;
            clearPageData();
            requestData();
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
                    keyword: $scope.params.content_keyword || ""
                };
                params = angular.extend(params, $scope.basicParams);
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                    $scope.numberOfNewDocs = data.number;
                });
            }
        }
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
        // 取签见撤重 点击弹出
        $scope.viewBigDataInfo = function(ChnlDocId, showRepeat) {
            var infoModal = resCtrModalService.bigDataInfoModal(ChnlDocId, showRepeat);
        };
    }
]);
