"use strict";
angular.module('resourceCenterCbXinhuaModule', ['resCenterCbXinhuaRouter'])
    .controller('resCenterCbXinhuaNewsCtrl', ['$scope', '$stateParams', '$q', 'trsPrintService', 'trsHttpService', 'trsconfirm', 'trsspliceString', 'resCtrModalService', 'resourceCenterService', 'initComDataService', 'globleParamsSet', 'initSingleSelecet', function($scope, $stateParams, $q, trsPrintService, trsHttpService, trsconfirm, trsspliceString, resCtrModalService, resourceCenterService, initComDataService, globleParamsSet, initSingleSelecet) {
        initStatus();
        initData();

        function initStatus() {
            $scope.page = {
                CURRPAGE: 1,
                PAGESIZE: 20
            };
            $scope.data = {
                items: [],
                selectedArray: [],
                printResult: [],
                operFlags: []
            };
            $scope.status = {
                methodname: {
                    1: "getNewsXHSG",
                    2: "getPicXHSG"
                },
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                isEsSearch: false
            };
            $scope.params = {
                serviceid: "mlf_xhsgsource",
                methodname: "queryXHSGDocs",
                DocType: "",
                LineClassfyId: $stateParams.id,
                DocClassifyId: "",
                OperTime: "",
                pageSize: $scope.page.PAGESIZE,
                currPage: $scope.page.CURRPAGE
            };
        }

        function initData() {
            initDropDown();
            requestData();
            initOperFlag();
        }

        //初始化列表内容
        function requestData() {
            var params = $scope.status.isEsSearch ? getESSearchParams() : $scope.params;
            var deferred = $q.defer();
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.items = data.DATA;
                $scope.page = data.PAGER;
                renderImgList($scope.data.items).then(function(data) {
                    angular.forEach($scope.data.items, function(value, key) {
                        value.ALLIMG = data[value.XHSGSOURCEID];
                    });
                });
                deferred.resolve(data.DATA);
            });
            return deferred.promise;
        }

        //初始化列表图片
        function renderImgList(items) {
            var deferred = $q.defer();
            var ids = trsspliceString.spliceString(items, "XHSGSOURCEID", ",");
            var params = {
                serviceid: "mlf_xhsgsource",
                methodname: "queryXHSGImgLogos",
                XHSGSourceIds: ids
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        //初始化下拉框内容
        function initDropDown() {
            $scope.time = {
                data: initComDataService.timeRange(),
                curValue: initComDataService.timeRange()[5]
            };
            $scope.docType = {
                data: initComDataService.newsType(),
                curValue: initComDataService.newsType()[0]
            };
            initComDataService.cbDocClassify().then(function(data) {
                $scope.cbDocClaJsons = data;
                $scope.cbDocClaSelected = data[0];
            });
            $scope.data.esOptions = initSingleSelecet.iWoEntire();
            $scope.data.esSelected = angular.copy($scope.data.esOptions[0]);
        }

        //分页
        $scope.pageChanged = function() {
            $scope.params.currPage = $scope.page.CURRPAGE;
            requestData();
            initOperFlag();
        };

        //单页选择条数
        $scope.selectPageNum = function() {
            $scope.params.currPage = $scope.page.CURRPAGE;
            $scope.params.pageSize = $scope.page.PAGESIZE;
            requestData();
            initOperFlag();
        };

        //单选
        $scope.selectDoc = function(item) {
            var index = $scope.data.selectedArray.indexOf(item);
            index < 0 ? $scope.data.selectedArray.push(item) : $scope.data.selectedArray.splice(index, 1);
        };

        //全选
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
        };

        //判断是否有稿件选中
        function isDraftChecked() {
            if ($scope.data.selectedArray.length < 0) {
                trsconfirm.alertType("请先选择稿件！", "", "error", false, "");
                return false;
            } else {
                return true;
            }
        }

        //初始化取签见撤重
        function initOperFlag() {
            requestData()
                .then(function(data) {
                    var ids = trsspliceString.spliceString(data, "XHSGSOURCEID", ",");
                    var params = {
                        serviceid: "mlf_xhsgsource",
                        methodname: "queryFlagOfXHSG",
                        XHSGSourceIds: ids
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        $scope.data.operFlags = data;
                    });
                });
        }

        //获取取签见撤重标志
        $scope.showOperFlag = function(id, flagIndex) {
            var temp = queryItemBYID(id);
            if (!!temp) {
                return queryItemBYID(id).OPERFLAG.substr(flagIndex, 1) == "1" ? true : false;
            } else {
                return false;
            }
        };

        function queryItemBYID(id) {
            for (var i in $scope.data.operFlags) {
                if (id == $scope.data.operFlags[i].XHSGID) {
                    return $scope.data.operFlags[i];
                }
            }
        }

        //点击下拉框查询列表
        $scope.queryItemsByDropDown = function(key, value) {
            $scope.params[key] = value;
            requestData();
        };

        //取稿
        $scope.openTakeDraftModal = function() {
            if (!isDraftChecked()) return;
            var params = {
                serviceid: "mlf_xhsgoper",
                methodname: "fetchXHSG",
                XHSGSourceIds: trsspliceString.spliceString($scope.data.selectedArray, "XHSGSOURCEID", ","),
            };
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

        //创作轴
        $scope.CreationAxis = function() {
            if (!isDraftChecked()) return;
            var params = {
                serviceid: "mlf_xhsgoper",
                methodname: "creations",
                XHSGIds: trsspliceString.spliceString($scope.data.selectedArray, "XHSGSOURCEID", ","),
            };
            resourceCenterService.setBigDataCreation(params).then(function(data) {
                trsconfirm.alertType("该稿件已成功加入创作轴!", "", "success", false, function() {
                    $scope.data.selectedArray = [];
                });
            });
        };

        //预留
        $scope.openReserveDraftModal = function() {
            if (!isDraftChecked()) return;
            var resCtrModalServiceModal = resCtrModalService.reserveDraft($scope.data.selectedArray);
            resCtrModalServiceModal.result.then(function(result) {
                delete result.items;
                var params = {
                    serviceid: "mlf_xhsgoper",
                    methodname: "delayXHSG",
                    XHSGSourceIds: trsspliceString.spliceString($scope.data.selectedArray, "XHSGSOURCEID", ","),
                };
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

        //收藏
        $scope.collect = function() {
            if (!isDraftChecked()) return;
            var params = {
                serviceid: "mlf_xhsgoper",
                methodname: "collects",
                XHSGIds: trsspliceString.spliceString($scope.data.selectedArray, "XHSGSOURCEID", ","),
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("收藏成功!", "", "success", false, "");
            });
        };

        //打印
        $scope.printbtn = function() {
            if (!isDraftChecked()) return;
            angular.forEach($scope.data.selectedArray, function(value, key) {
                requestPrintData(value);
                // requestPrintVersion(value).then(function(data) {
                //     requestPrintData(value, data);
                // });
            });
        };
        /**
         * [requestPrintVersion description：打印请求流程]
         */
        // function requestPrintVersion(item) {
        //     var deferred = $q.defer();
        //     $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), {
        //         serviceid: "mlf_metadatalog",
        //         methodname: "query",
        //         MetaDataId: item.METADATAID
        //     }, 'get').then(function(data) {
        //         deferred.resolve(data.DATA);
        //     });
        //     return deferred.promise;
        // }
        /**
         * [requestPrintVersion description：打印请求详情]
         */
        function requestPrintData(item) {
            var params = {
                "serviceid": "mlf_xhsgsource",
                "methodname": $scope.status.methodname[item.DOCTYPEID],
                "XHSGSourceId": item.XHSGSOURCEID
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                var result = data;
                //data.VERSION = version;
                data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
                $scope.data.printResult.push(result);
                if ($scope.data.printResult.length == $scope.data.selectedArray.length) {
                    trsPrintService.trsPrintShare($scope.data.printResult);
                    $scope.data.printResult = [];
                }
            });
        }

        //导出
        $scope.export = function() {
            if (!isDraftChecked()) return;
            var params = {
                serviceid: 'mlf_xhsgoper',
                methodname: 'exportWordFile',
                XHSGIds: trsspliceString.spliceString($scope.data.selectedArray, "XHSGSOURCEID", ",")
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
            });
        };

        //删除
        $scope.delete = function() {
            var params = {
                serviceid: "mlf_xhsgoper",
                methodname: "deleteXHSGSources",
                XHSGSourceIds: trsspliceString.spliceString($scope.data.selectedArray, "XHSGSOURCEID", ",")
            };
            trsconfirm.confirmModel("删除", "是否从新华社稿删除", function() {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.data.selectedArray = [];
                    trsconfirm.alertType("删除成功！", "", "success", false, "");
                    requestData();
                });
            });
        };

        //刷新
        $scope.update = function() {
            requestData();
        };

        // 取签见撤重 点击弹出
        $scope.viewBigDataInfo = function(ChnlDocId, showRepeat) {
            var infoModal = resCtrModalService.cbInfoModal(ChnlDocId, showRepeat);
        };
        /**
         * [observe description]川报观察
         * @return {[type]} [description]
         */
        $scope.observe = function() {
            resCtrModalService.observeModal(function(result) {
                var params = {
                    serviceid: "mlf_extappexchange",
                    methodname: "postDataToCG",
                    ModalId: resourceCenterService.getModal,
                    DocIds: trsspliceString.spliceString($scope.data.selectedArray, "XHSGSOURCEID", ","),
                    ChannelId: result.CHANNELID,
                    ChannelName: result.CHNLDESC
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("数据推送成功", "", "success", false);
                    initOperFlag();
                    $scope.data.selectedArray = [];
                }, function() {
                    $scope.data.selectedArray = [];
                });
            });
        };
        /**
         * [sichuanNews description]数据推送到四川新闻客户端
         * @return {[type]} [description]
         */
        $scope.sichuanNews = function() {
            trsconfirm.confirmModel("四川新闻客户端", "确认推送稿件", function() {
                var params = {
                    serviceid: "mlf_extappexchange",
                    methodname: "postDataToSCXW",
                    ModalId: resourceCenterService.getModal,
                    DocIds: trsspliceString.spliceString($scope.data.selectedArray, "XHSGSOURCEID", ","),
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("数据推送成功", "", "success", false);
                    initOperFlag();
                    $scope.data.selectedArray = [];
                }, function() {
                    $scope.data.selectedArray = [];
                });
            });
        };
        /**
         * [getESSearchParams description]设置ES检索参数
         * @return {[json]} [description] 参数对象
         */
        function getESSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForXHSGDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: "DOCTYPE",
                        keywords: $scope.docType.curValue.value
                    }, {
                        searchField: "timeType",
                        keywords: $scope.time.curValue.value
                    }, {
                        searchField: $scope.data.esSelected.value,
                        keywords: $scope.data.keywords || ""
                    }, {
                        searchField: "DOCCLASSIFYID",
                        keywords: $scope.cbDocClaSelected.value
                    }, {
                        searchField: "LINECLASSFYID",
                        keywords: $stateParams.id || ""
                    }, {
                        searchField: "_sort",
                        keywords: "time"
                    }]
                }
            };

            esParams.searchParams = JSON.stringify(esParams.searchParams);
            return esParams;
        }
        /**
         * [fullTextSearch description]es检索
         * @param  {[obj]} ev [description]事件对象
         * @return {[type]}    [description]
         */
        $scope.fullTextSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                $scope.status.isEsSearch = true;
                requestData();
            }
        };
    }]);
