"use strict";
angular.module('cbCustomModule', ['cbCustomRouter', 'cbCustomLeftModule'])
    .controller('cbCustomCtrl', ['$scope', '$q', '$stateParams', 'trsHttpService', 'trsspliceString', 'initComDataService', 'resCtrModalService', 'resourceCenterService', 'trsconfirm', 'trsPrintService', function($scope, $q, $stateParams, trsHttpService, trsspliceString, initComDataService, resCtrModalService, resourceCenterService, trsconfirm, trsPrintService) {
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
                    1: "getNewsCusModalDoc",
                    2: "getPicCusModalDoc"
                },
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
            };

            $scope.params = {
                serviceid: "mlf_cusmodaldoc",
                methodname: "queryCusModalDocs",
                ModalId: $stateParams.customid,
                ModalName: $stateParams.desc,
                DocType: $stateParams.type,
                OperTime: "",
                pageSize: $scope.page.PAGESIZE,
                currPage: $scope.page.CURRPAGE
            };

        }

        function initData() {
            requestData();
            initOperFlag();
            initDropDown();
        }

        //初始化列表内容
        function requestData() {
            var deferred = $q.defer();
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.data.items = data.DATA;
                $scope.page = data.PAGER;
                renderImgList($scope.data.items).then(function(data) {
                    angular.forEach($scope.data.items, function(value, key) {
                        value.ALLIMG = data[value.CUSMODALDOCID];
                    });
                });
                deferred.resolve(data.DATA);
            });
            return deferred.promise;
        }

        //初始化列表图片
        function renderImgList(items) {
            var deferred = $q.defer();
            var ids = trsspliceString.spliceString(items, "CUSMODALDOCID", ",");
            var params = {
                serviceid: "mlf_cusmodaldoc",
                methodname: "queryCusModalDocImgLogos",
                CusModalDocIds: ids
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

        //初始化取签见撤重
        function initOperFlag() {
            requestData()
                .then(function(data) {
                    var ids = trsspliceString.spliceString(data, "CUSMODALDOCID", ",");
                    var params = {
                        serviceid: "mlf_cusmodaldoc",
                        methodname: "queryFlagOfCusModalDoc",
                        CusModalDocIds: ids
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
                if (id == $scope.data.operFlags[i].CUSMODALDOCID) {
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
            // if (!isDraftChecked()) return;
            var params = {
                serviceid: "mlf_cusmodaldocoper",
                methodname: "fetchCusModalDoc",
                CUSMODALDOCIDs: trsspliceString.spliceString($scope.data.selectedArray, "CUSMODALDOCID", ","),
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
            // if (!isDraftChecked()) return;
            var params = {
                serviceid: "mlf_cusmodaldocoper",
                methodname: "creations",
                CusModalDocIds: trsspliceString.spliceString($scope.data.selectedArray, "CUSMODALDOCID", ","),
            };
            resourceCenterService.setBigDataCreation(params).then(function(data) {
                trsconfirm.alertType("该稿件已成功加入创作轴!", "", "success", false, function() {
                    $scope.data.selectedArray = [];
                });
            });
        };

        //预留
        $scope.openReserveDraftModal = function() {
            // if (!isDraftChecked()) return;
            var resCtrModalServiceModal = resCtrModalService.reserveDraft($scope.data.selectedArray);
            resCtrModalServiceModal.result.then(function(result) {
                delete result.items;
                var params = {
                    serviceid: "mlf_cusmodaldocoper",
                    methodname: "delayCusModalDoc",
                    CusModalDocIds: trsspliceString.spliceString($scope.data.selectedArray, "CUSMODALDOCID", ","),
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
            // if (!isDraftChecked()) return;
            var params = {
                serviceid: "mlf_cusmodaldocoper",
                methodname: "collects",
                CusModalDocIds: trsspliceString.spliceString($scope.data.selectedArray, "CUSMODALDOCID", ","),
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("收藏成功!", "", "success", false, "");
            });
        };

        //打印
        $scope.printbtn = function() {
            // if (!isDraftChecked()) return;
            angular.forEach($scope.data.selectedArray, function(value, key) {
                requestPrintData(value);
            });
        };

        function requestPrintData(item) {
            var params = {
                "serviceid": "mlf_cusmodaldoc",
                "methodname": $scope.status.methodname[item.DOCTYPEID],
                "CusModalDocId": item.CUSMODALDOCID
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
            // if (!isDraftChecked()) return;
            var params = {
                serviceid: 'mlf_cusmodaldocoper',
                methodname: 'exportWordFile',
                CusModalDocIds: trsspliceString.spliceString($scope.data.selectedArray, "CUSMODALDOCID", ",")
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
            });
        };

        //删除
        $scope.delete = function() {
            var params = {
                serviceid: "mlf_cusmodaldocoper",
                methodname: "deleteCusModalDocs",
                CusModalDocIds: trsspliceString.spliceString($scope.data.selectedArray, "CUSMODALDOCID", ",")
            };
            trsconfirm.confirmModel("删除", "是否从新华社稿删除", function() {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.data.selectedArray = [];
                    trsconfirm.alertType("删除成功！", "", "success", false, "");
                    requestData();
                });
            });
        };

        // 取签见撤重 点击弹出
        $scope.viewBigDataInfo = function(ChnlDocId, showRepeat) {
            var infoModal = resCtrModalService.cbCustomInfoModal(ChnlDocId, showRepeat);
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
                    DocIds: trsspliceString.spliceString($scope.data.selectedArray, "CUSMODALDOCID", ","),
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
                    DocIds: trsspliceString.spliceString($scope.data.selectedArray, "CUSMODALDOCID", ","),
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
    }]);
