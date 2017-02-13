/*
 Create by you  2015-12-28
 */
"use strict";
angular.module('typesettingpagePageManageModule', [])
    .controller('typesettingpagePageManageCtrl', editLayoutManageCtrl);
editLayoutManageCtrl.$injector = ["$scope", "$q", "$filter", "$timeout", "$modal", "$stateParams", "trsHttpService", "SweetAlert", "trsconfirm", "myManuscriptService", 'initSingleSelecet', 'editingCenterService', 'trsResponseHandle', 'trsspliceString', "initVersionService", "getNewsNameService", "productMangageMentNewspaperService"];

function editLayoutManageCtrl($scope, $q, $filter, $timeout, $modal, $stateParams, trsHttpService, SweetAlert, trsconfirm, myManuscriptService, initSingleSelecet, editingCenterService, trsResponseHandle, trsspliceString, initVersionService, getNewsNameService, productMangageMentNewspaperService) {
    initStatus();
    initData();
    /**
     * [getSiteRights description]获取每个站点的操作权限
     * @return null [description]
     */
    function getSiteRights() {
        productMangageMentNewspaperService.getRight($stateParams.paper, "", "papersetpaper.zhaopaibanmian").then(function(data) {
            $scope.status.right = data;
        });
    }
    //初始化状态
    function initStatus() {
        $scope.params = {
            "serviceid": "mlf_paperset",
            "methodname": "queryZhaoPaiBanMians",
            "PaperId": $stateParams.paper
        };
        $scope.selectedArray = [];
        getNewsNameService.getNewsName($stateParams.paper).then(function(data) {
            $scope.channelName = data.SITEDESC;
        });
        $scope.status = {
            right: {},
            previousDieCi: "",
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
        };
        getSiteRights();
    }

    //初始化数据
    function initData() {
        dieciDroplist().then(function(data) {
            requestData();
        });
        getDropDown();
    }

    function requestData(callback) {
        //$scope.loadingPromise = 
        trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, 'get').then(function(data) {
            if (angular.isFunction(callback)) {
                callback(data);
                $scope.selectedArray = [];
            } else {
                $scope.items = data.DATA;
                $scope.page = data.PAGER;
                angular.isDefined($scope.page) ? $scope.page.PAGESIZE =
                    $scope.page.PAGESIZE.toString() : $scope.page = {
                        "PAGESIZE": 0,
                        "ITEMCOUNT": 0
                    };
                $scope.selectedArray = [];
            }

        });
    }

    //全选
    $scope.selectAll = function() {
        $scope.selectedArray = $scope.selectedArray.length == $scope.items.length ? [] : [].concat($scope.items);
    };

    //单选
    $scope.selectDoc = function(item) {
        //item.selected ? $scope.selectedArray.push(item) : $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
        if ($scope.selectedArray.indexOf(item) < 0) {
            $scope.selectedArray.push(item);
        } else {
            $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
        }
    };

    function getDropDown() {
        //照排版面状态
        $scope.ZPLayoutStatus = initSingleSelecet.ZPLayoutStatus();
        $scope.ZPLayoutStatusSelected = angular.copy($scope.ZPLayoutStatus[0]);
    }

    //类型筛选
    $scope.queryZPLayoutStatus = function() {
        $scope.params.Status = $scope.ZPLayoutStatusSelected.value;
        requestData();
    };

    //搜索
    $scope.fullTextSearch = function() {
        var searchParams = {
            PAGESIZE: $scope.page.PAGESIZE,
            PAGEINDEX: 1,
            searchFields: [{
                searchField: $scope.iWoAllSelected.value,
                keywords: $scope.keywords
            }]
        };
        var params = {
            'serviceid': "mlf_essearch",
            'methodname': "query",
            'searchParams': searchParams
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {});

    };

    //新建照排版面
    $scope.newZPLayout = function() {
        $scope.status.previousDieCi = "";
        $scope.status.prviousBanMian = "";
        $scope.status.prviousJianChen = "";
        newZPLayoutFn();
    };

    function newZPLayoutFn() {
        var modalInstance = $modal.open({
            templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/newZPLayout/newZPLayout_tpl.html",
            resolve: {
                params: function() {
                    var params = {
                        selectedDieCi: $scope.status.previousDieCi,
                        selctedBanMian: $scope.status.prviousBanMian,
                        selectedJianChen: $scope.status.prviousJianChen,
                    };
                    return params;
                },
            },
            //scope: $scope,
            windowClass: 'new-zp-layout-window',
            backdrop: false,
            controller: "productManageMentNewZPLayoutCtrl"
        });
        modalInstance.result.then(function(result) {
            requestData();
            if (result != "save") {
                $scope.status.previousDieCi = result.previousDieCi;
                $scope.status.prviousBanMian = result.prviousBanMian;
                $scope.status.prviousJianChen = result.prviousJianChen;
                newZPLayoutFn(result);
            }
        });
    }

    //单个删除
    $scope.singleDelete = function(item) {
        trsconfirm.confirmModel('提示信息', "您确定要彻底删除此照排版面:" + "<span style='color:red'>" + item.CHNLDESC + "</span>", function() {
            deleteFun(item.CHANNELID);
        });

    };

    //批量删除
    $scope.batchDelete = function() {
        var modalInstance = $modal.open({
            templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/batchDel/batchDel_tpl.html",
            windowClass: "batchDelClass",
            backdrop: false,
            controller: "productManageMentBatchDelCtrl",
            scope: $scope,
            resolve: {
                delItems: function() {
                    return $scope.selectedArray;
                },
                title: function() {
                    return "您确认批量删除以下照排版面：";
                }
            }
        });
        modalInstance.result.then(function() {
            var delArray = trsspliceString.spliceString($scope.selectedArray,
                'CHANNELID', ',');
            deleteFun(delArray);
        });
    };


    //删除方法
    function deleteFun(item) {
        $scope.params.serviceid = "mlf_paperset";
        $scope.params.methodname = "deleteDieCiOrBanMians";
        $scope.params.ObjectIds = item;
        requestData(function() {
            $scope.params.serviceid = "mlf_paperset";
            $scope.params.methodname = "queryZhaoPaiBanMians";
            requestData();
        });

    }

    //停用启用
    $scope.stopOrStart = function(item) {
        //启用
        if (item.STATUS == "-1") {
            trsconfirm.confirmModel('提示信息', "您确定启用:" + "<span style='color:red'>" + item.CHNLNAME + "</span>", function() {
                $scope.params.serviceid = "mlf_paperset";
                $scope.params.methodname = "startDieCiOrBanMian";
                $scope.params.ObjectId = item.CHANNELID;
                requestData(function() {
                    $scope.params.serviceid = "mlf_paperset";
                    $scope.params.methodname = "queryZhaoPaiBanMians";
                    requestData();
                });
            });
        }
        //停用
        if (item.STATUS === "0") {
            trsconfirm.confirmModel('提示信息', "您确定停用:" + "<span style='color:red'>" + item.CHNLNAME + "</span>", function() {
                $scope.params.serviceid = "mlf_paperset";
                $scope.params.methodname = "stopDeiCiOrBanMian";
                $scope.params.ObjectId = item.CHANNELID;
                requestData(function() {
                    $scope.params.serviceid = "mlf_paperset";
                    $scope.params.methodname = "queryZhaoPaiBanMians";
                    requestData();
                });
            });
        }
    };

    //编辑照排版面
    $scope.modifyZPLayout = function(item) {
        if (angular.isDefined($scope.status.right.zhaopaibanmian.bianji)) {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/modifyZPLayout/modifyZPLayout_tpl.html",
                //scope: $scope,
                windowClass: 'man_produ_NewOrder',
                backdrop: false,
                resolve: {
                    selectedItem: function() {
                        return item;
                    }
                },
                controller: "productManageMentModifyZPLayoutCtrl"
            });
            modalInstance.result.then(function() {
                requestData();
            });
        } else {
            trsconfirm.alertType("您没有权限编辑该版面", "您没有权限编辑该版面", "error", false);
        }
    };

    //版面排序
    $scope.layoutRank = function() {
        var modalInstance = $modal.open({
            templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/ZPLayoutRank/ZPLayoutRank_tpl.html",
            scope: $scope,
            windowClass: 'zp-layout-rank-window',
            backdrop: false,
            resolve: {
                title: function() {
                    return "照排版面管理-排序";
                }
            },
            controller: "productManageMentZPLayoutRankCtrl"
        });
        modalInstance.result.then(function(result) {
            $scope.params.serviceid = "mlf_paperset";
            $scope.params.methodname = "queryZhaoPaiBanMians";
            $scope.params.PaperId = $stateParams.paper;
            $scope.params.DieCiId = result.value;
            $scope.dieciDroplistSelected = result;
            requestData();
        });
    };

    //初始化叠次下拉框
    function dieciDroplist() {
        var deffered = $q.defer();
        var params = {
            "serviceid": "mlf_paperset",
            "methodname": "queryDieCis",
            "PaperId": $stateParams.paper,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            var dieciDroplistJson = data;
            var options = [];
            options.push({
                "name": "全部叠次",
                "value": ""
            });
            for (var key in dieciDroplistJson) {
                options.push({
                    name: dieciDroplistJson[key].CHNLDESC,
                    value: dieciDroplistJson[key].CHANNELID
                });
            }
            $scope.dieciDroplistJson = options;
            $scope.dieciDroplistSelected = angular.copy($scope.dieciDroplistJson[0]);
            $scope.params.DieCiId = $scope.dieciDroplistSelected.value;
            deffered.resolve();
        });
        return deffered.promise;
    }
    $scope.getDieciData = function() {
        $scope.params.serviceid = "mlf_paperset";
        $scope.params.methodname = "queryZhaoPaiBanMians";
        $scope.params.PaperId = $stateParams.paper;
        $scope.params.DieCiId = $scope.dieciDroplistSelected.value;
        requestData();
    };
}
