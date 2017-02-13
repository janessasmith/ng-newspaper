"use strict";
angular.module('newspaperOrderModule', [
    'productManageMentOrderRankModule',
    'productManageMentOrderDeleteModule'
]).
controller('newspaperOrderCtrl', newspaperOrderCtrl);
newspaperOrderCtrl.$injector = ["$scope", "$filter", "$timeout", "$modal", "$stateParams", "trsHttpService", "SweetAlert", "trsconfirm", "myManuscriptService", 'initSingleSelecet', 'editingCenterService', 'trsResponseHandle', 'trsspliceString', "initVersionService", "productMangageMentNewspaperService", "getNewsNameService"];

function newspaperOrderCtrl($scope, $filter, $timeout, $modal, $stateParams, trsHttpService, SweetAlert, trsconfirm, myManuscriptService, initSingleSelecet, editingCenterService, trsResponseHandle, trsspliceString, initVersionService, productMangageMentNewspaperService, getNewsNameService) {
    initStatus();
    initData();
    /**
     * [getSiteRights description]获取每个站点的操作权限
     * @return null [description]
     */
    function getSiteRights() {
        productMangageMentNewspaperService.getRight($stateParams.paper, "", "papersetpaper.dieci").then(function(data) {
            $scope.status.right = data;
        });
    }
    //根据类型筛选叠次
    $scope.queryByDieCiType = function() {
        initStatus();
        $scope.params.Status = angular.copy($scope.newspaperManageStateSelected).value;
        requestData();
    };
    //搜索叠次
    $scope.searchDieCi = function() {
        initStatus();
        $scope.params.CHNLNAME = $scope.keywords;
        requestData();
    };

    //初始化状态
    function initStatus() {
        $scope.params = {
            "serviceid": "mlf_paperset",
            "methodname": "queryDieCis",
            "PaperId": $stateParams.paper
        };
        $scope.status = {
            right: {},
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
        };
        $scope.selectedArray = [];
        getNewsNameService.getNewsName($stateParams.paper).then(function(data) {
            $scope.channelName = data.SITEDESC;
        });
        getSiteRights();
    }

    //初始化数据
    function initData() {
        requestData();
        getDropDown();

    }

    function requestData(callback) {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
            if (angular.isFunction(callback)) {
                callback(data);
            } else {
                $scope.items = data;
                $scope.page = data.PAGER;
                angular.isDefined($scope.page) ? $scope.page.PAGESIZE =
                    $scope.page.PAGESIZE.toString() : $scope.page = {
                        "PAGESIZE": 0,
                        "ITEMCOUNT": 0
                    };
            }
            $scope.selectedArray = [];
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
        //全部
        $scope.newspaperManageState = initSingleSelecet.newspaperManageState();
        $scope.newspaperManageStateSelected = angular.copy($scope.newspaperManageState[0]);

        //状态
        $scope.iWoDocStatus = initSingleSelecet.iWoReceiveDocStatus();
        $scope.iWoDocStatuSelected = angular.copy($scope.iWoDocStatus[0]);
        //下拉框单选结束
    }

    function share() {
        $scope.shareSelectedArray = angular.copy($scope.selectedArray);
        editingCenterService.share($scope, "mlf_myrelease", "receivedMyShare", function() {
            $scope.selectedArray = [];
            requestData();
        });
    }


    //编辑叠次信息
    $scope.modifyOrderInformation = function(item) {
        if ($scope.status.right.dieci.bianji) {
            $modal.open({
                templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/modifyOrderInformation/modifyOrderInformation_tpl.html",
                scope: $scope,
                windowClass: 'man_produ_NewOrder',
                backdrop: false,
                controller: "productManageMentModifyOrderInfoCtrl",
                resolve: {
                    modifyOrderItem: function() {
                        return item;
                    }
                }
            }).result.then(function() {
                requestData();
            });
        } else {
            trsconfirm.alertType("您没有权限编辑该叠次","您没有权限编辑该叠次","error",false);
        }
    };
    //新建叠次
    $scope.newOrder = function() {
        $modal.open({
            templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/newOrder/newOrder_tpl.html",
            scope: $scope,
            windowClass: 'man_produ_NewOrder',
            backdrop: false,
            controller: "productManageMentNewOrderCtrl",
            resolve: {
                callback: function() {
                    return function(content) {
                        newOrderFun(0, content, $scope.params.PaperId);
                    };
                }
            }
        });
    };
    //新建叠次方法
    function newOrderFun(ObjectId, ChnlName, SiteId) {
        $scope.params = {
            "serviceid": "mlf_paperset",
            "methodname": "saveDieCi",
            "ObjectId": ObjectId,
            "ChnlName": ChnlName,
            "SiteId": SiteId,
            "PaperId": $stateParams.paper
        };

        requestData(function() {
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "queryDieCis",
                "PaperId": $stateParams.paper
            };
            requestData();
        });
    };
    //叠次排序
    $scope.orderRank = function() {

        $modal.open({
            templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/orderRank/orderRank_tpl.html",
            scope: $scope,
            windowClass: 'zp-layout-rank-window',
            backdrop: false,
            controller: "productManageMentOrderRankCtrl",
            resolve: {
                rankItems: function() {
                    return $scope.items;
                },
                callback: function() {
                    return function(Rankingitems) {
                        freshOrderRanking(Rankingitems);
                    }
                }
            }
        });

    };
    //提交叠次排序数据并刷新叠次页面
    function freshOrderRanking(Rankingitems) {
        $scope.params = {
            'serviceid': "mlf_paperset",
            'methodname': "reorderDieCiOrBanMians",
            "ObjectIds": Rankingitems,
            "flag":1
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "post").then(function(data) {
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "queryDieCis",
                "PaperId": $stateParams.paper
            };
            requestData();
        });

    }
    //批量删除
    $scope.orderDelete = function() {

        $modal.open({
            templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/orderDelete/orderDelete_tpl.html",
            scope: $scope,
            windowClass: 'zp-layout-rank-window',
            backdrop: false,
            controller: "productManageMentOrderDeleteCtrl",
            resolve: {
                deleteItems: function() {
                    return $scope.selectedArray;
                },
                callback: function() {
                    return function(arrayDeleteitems) {
                        freshPager(arrayDeleteitems);
                    }
                }

            }
        });

    };
    //提交数据并刷新叠次页面
    function freshPager(arrayDeleteitems) {
        $scope.params = {
            'serviceid': "mlf_paperset",
            'methodname': "deleteDieCiOrBanMians",
            "ObjectIds": arrayDeleteitems
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "post").then(function(data) {
            $scope.params = {
                "serviceid": "mlf_paperset",
                "methodname": "queryDieCis",
                "PaperId": $stateParams.paper
            };
            requestData();
        });

    }
    //启用弹窗
    $scope.enableViews = function(CHANNELID, CHNLDESC) {
        trsconfirm.confirmModel('提示信息', '您确认启用：' + CHNLDESC, function() {
            enableItem(CHANNELID);
        });
    };
    //启用方法
    function enableItem(CHANNELID) {
        $scope.params = {
            "serviceid": "mlf_paperset",
            "methodname": "startDieCiOrBanMian",
            "ObjectId": CHANNELID,
            "PaperId": $stateParams.paper
        };
        requestData(function() {
            $scope.params.serviceid = "mlf_paperset";
            $scope.params.methodname = "queryDieCis";
            requestData();
        });
    };
    //停用弹窗
    $scope.disableViews = function(CHANNELID, CHNLDESC) {
        trsconfirm.confirmModel('提示信息', '您确认停用：' + CHNLDESC, function() {
            disableItem(CHANNELID);
        });
    };
    //停用方法
    function disableItem(CHANNELID) {
        $scope.params = {
            "serviceid": "mlf_paperset",
            "methodname": "stopDeiCiOrBanMian",
            "ObjectId": CHANNELID,
            "PaperId": $stateParams.paper
        };
        requestData(function() {
            $scope.params.serviceid = "mlf_paperset";
            $scope.params.methodname = "queryDieCis";
            requestData();
        });
    };
    //删除弹窗
    $scope.deleteViews = function(SITEID, CHNLDESC) {
        // console.log(SITEID);
        trsconfirm.confirmModel('提示信息', '您确认要彻底删除此叠次：' + CHNLDESC, function() {
            deleteItem(SITEID);
        });
    };
    //删除方法
    function deleteItem(CHANNELID) {
        $scope.params = {
            "serviceid": "mlf_paperset",
            "methodname": "deleteDieCiOrBanMians",
            "ObjectIds": CHANNELID,
            "PaperId": $stateParams.paper
        };
        requestData(function() {
            $scope.params.serviceid = "mlf_paperset";
            $scope.params.methodname = "queryDieCis";
            requestData();
        });
    }
}
