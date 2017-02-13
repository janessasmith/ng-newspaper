"use strict";
angular.module("resourceCenterPictureModule", ["util.waterflow", "resCenterPictureRouterModule"]).
controller("resourceCenterPictureCtrl", function($scope, $window, $q, $timeout, $stateParams, $filter, initComDataService, trsHttpService, trsconfirm, trsspliceString, resCtrModalService, resourceCenterService, trsPrintService, initSingleSelecet) {
    initStatus();
    initData();


    function initStatus() {
        $scope.page = {
            CURRPAGE: 1,
            PAGESIZE: 20,
            PAGECOUNT: 0,
        };
        $scope.data = {
            selectedArray: [],
            printResult: [],
            operFlags: [],
            keywords: "",
        };

        $scope.params = {
            serviceid: "mlf_pictureLibrary",
            methodname: "queryPics",
            ShareTime: "",
            MetaCategoryId: $stateParams.cbpicid,
            currPage: $scope.page.CURRPAGE,
            pageSize: $scope.page.PAGESIZE
        };

        $scope.status = {
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
            isEsSearch: false,
        };
        $scope.dataJson = [];
    }

    function initData() {
        requestData();
        initDropDown();

    }

    //请求数据
    function requestData() {
        var params = $scope.status.isEsSearch ? getESSearchParams() : $scope.params;
        var deferred = $q.defer();
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.page = data.PAGER;
            $scope.dataJson = $scope.status.isEsSearch && parseInt($scope.page.CURRPAGE) < 2 ? data.DATA : $filter("unique")($scope.dataJson.concat(data.DATA), 'METADATAID');
            deferred.resolve(data.DATA);
            $scope.$broadcast("changeDatas", $scope.dataJson);
        });
        return deferred.promise;
    }
    //初始化下拉框
    function initDropDown() {
        $scope.time = {
            data: initComDataService.timeRange(),
            curValue: initComDataService.timeRange()[5],
        };
        $scope.data.esOptions = initSingleSelecet.iWoEntire();
        $scope.data.esSelected = angular.copy($scope.data.esOptions[0]);
    }

    //点击下拉框查询列表
    $scope.queryItemsByDropDown = function(key, value) {
        $scope.params[key] = value;
        $scope.params.currPage = 1;
        requestData().then(function(data) {
            $scope.$broadcast("changeDatas", data);
        });
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

    //取稿
    $scope.openTakeDraftModal = function() {
        if (!isDraftChecked()) return;
        var params = {
            serviceid: "mlf_releasesource",
            methodname: "fetch",
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
        };
        var isOnlyOne = $scope.data.selectedArray.length > 1 ? false : true;
        var modalInstance = resCtrModalService.fullTakeDraft(params, isOnlyOne);
        modalInstance.result.then(function() {
            $scope.$broadcast("requestDatas", $scope.dataJson);
            $scope.data.selectedArray = [];
        }, function() {
            $scope.$broadcast("requestDatas", $scope.dataJson);
            $scope.data.selectedArray = [];
        });
    };

    //预留
    $scope.openReserveDraftModal = function() {
        if (!isDraftChecked()) return;
        var resCtrModalServiceModal = resCtrModalService.reserveDraft($scope.data.selectedArray);
        resCtrModalServiceModal.result.then(function(result) {
            delete result.items;
            var params = {
                serviceid: "mlf_releasesource",
                methodname: "delayFetch",
                MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
            };
            params = angular.extend(params, result);
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("预留成功!", "", "success", false, function() {
                    $scope.$broadcast("requestDatas", $scope.dataJson);
                    $scope.data.selectedArray = [];
                });
            }, function() {
                $scope.$broadcast("requestDatas", $scope.dataJson);
                $scope.data.selectedArray = [];
            });
        });
    };

    //创作轴
    $scope.CreationAxis = function() {
        if (!isDraftChecked()) return;
        var params = {
            serviceid: "mlf_releasesource",
            methodname: "setBatchCreation",
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
        };
        resourceCenterService.setBigDataCreation(params).then(function(data) {
            trsconfirm.alertType("该稿件已成功加入创作轴!", "", "success", false, function() {
                $scope.data.selectedArray = [];
            });
        });
    };


    //收藏
    $scope.collect = function() {
        if (!isDraftChecked()) return;
        var params = {
            serviceid: "mlf_myrelease",
            methodname: "collect",
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("收藏成功!", "", "success", false, "");
            $scope.data.selectedArray = [];
        });
    };

    //打印
    $scope.printbtn = function() {
        if (!isDraftChecked()) return;
        angular.forEach($scope.data.selectedArray, function(value, key) {
            requestPrintData(value);
        });
    };

    /**
     * [requestPrintVersion description：打印请求详情]
     */
    function requestPrintData(item) {
        var params = {
            "serviceid": "mlf_myrelease",
            "methodname": "getPicsShareDoc",
            "MetaDataId": item.METADATAID
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            var result = data;
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
            serviceid: 'mlf_exportword',
            methodname: 'exportWordFile',
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
        });
    };

    //删除
    $scope.deleteDrafts = function() {
        if (!isDraftChecked()) return;
        trsconfirm.confirmModel("删除", "是否从图片库删除", function() {
            var ids = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
            resourceCenterService.deleteRelease(ids).then(function(data) {
                if (data && data.ISSUCCESS == "true") {
                    $scope.data.selectedArray = [];
                    trsconfirm.alertType("删除成功！", "", "success", false, "");
                    $scope.params.currPage = 1;
                    requestData().then(function(data) {
                        $scope.$broadcast("changeDatas", data);
                    });
                }
            });
        });
    };
    /**
     * [fullTextSearch description]图片库的es检索
     * @param  {[obj]} ev [description]事件对象
     * @return {[type]}    [description]
     */
    $scope.fullTextSearch = function(ev) {
        if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
            $scope.status.isEsSearch = true;
            $scope.page.CURRPAGE = 1;
            requestData();
        }
    };
    /**
     * [getESSearchParams description]获得ES检索的参数
     * @return {[type]} [description]
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForTongYiGongGaoDoc",
            searchParams: {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: $scope.page.CURRPAGE + "",
                searchFields: [{
                    searchField: $scope.data.esSelected.value,
                    keywords: $scope.data.keywords ? $scope.data.keywords : ""
                }, {
                    searchField: "docType",
                    keywords: 2
                }, {
                    searchField: "newsType",
                    keywords: $stateParams.cbpicid
                }, {
                    searchField: "timeType",
                    keywords: $scope.time.curValue.value
                }, {
                    searchField: "isOnlyMedia",
                    keywords: false
                }, {
                    searchField: "_sort",
                    keywords: "time"
                }],
            },
        };
        esParams.searchParams = JSON.stringify(esParams.searchParams);
        return esParams;
    }
    /**
     * [loadMore description]图片加载更多
     * @return {[type]} [description]
     */
    function loadMore() {
        var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
        if ($(document).height() <= totalheight + 10) {
            if ($scope.page.CURRPAGE < $scope.page.PAGECOUNT) {
                $scope.page.CURRPAGE = $scope.params.currPage = $scope.page.CURRPAGE + 1;
                requestData().then(function(data) {
                    $scope.$broadcast("changeDatas", $scope.dataJson);
                    //加载更多时需要请求标示
                    $scope.$broadcast("requestDatas", $scope.dataJson);
                });
            }
        }
    }
    $(document).bind('scroll', loadMore);
});
