"use strict";
angular.module('newspaperManageModule', [
    'allocationManageMentModule',
    'productManageMentNewOrderModule',
    'newspaperOrderModule',
    'newspaperManageRouterModule',
    'editLayoutManageModule',
    'productMangageMentNewspaperServiceModule',
    'typesettingpagePageManageModule',
    'productManageMentNewZPLayoutModule',
    'manageconfigManageNewsModule',
    "productManageMentModifyZPLayoutModule",
    "productManageMentEditNameModule",
    "productManageMentBatchDelModule",
    "productManageMentZPLayoutRankModule",
    "productManageMentModifyOrderInfoModule",
    "productManageMentPressRankModule",
    "productManageMentCBLayoutRankModule",
    "getNewsNameModule"
]).
controller('newspaperManageCtrl', newspaperManageCtrl);
newspaperManageCtrl.$injector = ["$scope", "$state", "$filter", "$timeout", "$modal", "trsHttpService", "SweetAlert", "trsconfirm", "myManuscriptService", 'initSingleSelecet', 'editingCenterService', 'trsResponseHandle', 'trsspliceString', "initVersionService", "productMangageMentNewspaperService", "manageConfigPermissionService"];

function newspaperManageCtrl($scope, $state, $filter, $timeout, $modal, trsHttpService, SweetAlert, trsconfirm, myManuscriptService, initSingleSelecet, editingCenterService, trsResponseHandle, trsspliceString, initVersionService, productMangageMentNewspaperService, manageConfigPermissionService) {
    initStatus();
    initData();
    //下一页
    /**
     * [getSiteRights description]获取每个站点的操作权限
     * @return null [description]
     */
    $scope.getSiteRights = function(item) {
        productMangageMentNewspaperService.getRight(item.SITEID, "", "papersetpaper").then(function(data) {
            $scope.status.rights[item.SITEID] = data;
        });
    };
    //类型筛选
    $scope.queryByDocType = function() {
        $scope.params.DocType = $scope.iWoDocTypeSelected.value;
        requestData();
    };
    $scope.queryByFilterTime = function() {
        $scope.params.timeType = $scope.iWoFilterTimeSelected.value;
        requestData();
    };
    $scope.queryByDocStatus = function() {
        $scope.params.DocStatus = $scope.iWoDocStatuSelected.value;
        requestData();
    };
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    //根据类型搜索报刊
    $scope.queryByPaperType = function() {
        $scope.params.Status = angular.copy($scope.newspaperManageStateSelected).value;
        requestData();
    };
    //跳转指定页面
    $scope.jumpToPage = function() {
        if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.params.CurrPage = $scope.copyCurrPage;
        requestData();
        $scope.selectedArray = [];
    };
    //搜索报刊
    $scope.searchPaper = function() {
        $scope.params.SiteName = $scope.keywords;
        requestData();
    };
    //初始化状态
    function initStatus() {
        //   $scope.page = {
        //       "CURRPAGE": 1,
        //       "PAGESIZE": 10
        //   };
        $scope.params = {
            "serviceid": "mlf_paperset",
            "methodname": "queryPagers",
            //      "PageSize": $scope.page.PAGESIZE,
            //      "CurrPage": $scope.page.CURRPAGE
        };
        $scope.copyCurrPage = 1;
        $scope.selectedArray = [];
        $scope.status = {
            rights: {},
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
        };
        manageConfigPermissionService.isAdministrator().then(function(data) {
            $scope.status.isAdministrator = data; //是否是系统管理员
        });
    }

    //初始化数据
    function initData() {
        requestData();
        getDropDown();

    }

    function requestData(callback) {
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'get').then(function(data) {
            if (angular.isFunction(callback)) {
                callback(data);
            } else {
                $scope.items = data.DATA;
                $scope.page = data.PAGER;
                angular.isDefined($scope.page) ? $scope.page.PAGESIZE =
                    $scope.page.PAGESIZE.toString() : $scope.page = {
                        "PAGESIZE": 0,
                        "ITEMCOUNT": 0
                    };
            }
            $scope.selectedArray = [];
        }, function(data) {
            // sweetAlert('数据请求错误', data, "error");
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
    //新建报刊
    $scope.newPress = function() {
        productMangageMentNewspaperService.manageNews("", function() {
            requestData();
        });
    };
    //报刊排序
    $scope.pressRank = function() {
        var modalInstance = $modal.open({
            templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/pressRank/pressRank_tpl.html",
            scope: $scope,
            windowClass: 'man_produ_NewOrder',
            backdrop: false,
            resolve: {
                rankItems: function() {
                    return $scope.items;
                },
                title: function() {
                    return "报纸管理-报纸排序";
                }
            },
            controller: "productManageMentPressRankCtrl"
        });
        modalInstance.result.then(function() {
            requestData();
        });
    };
    //批量删除
    $scope.batchDelete = function() {
        var modalInstance = $modal.open({
            templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/batchDel/batchDel_tpl.html",
            windowClass: "batchDelClass",
            backdrop: false,
            controller: "productManageMentBatchDelCtrl",
            resolve: {
                delItems: function() {
                    return $scope.selectedArray;
                },
                title: function() {
                    return "您确认批量删除以下报纸?";
                }
            }
        });

        modalInstance.result.then(function(result) {
            delectItems($scope.selectedArray);
        });
    };

    //删除单个报刊
    $scope.deleteViews = function(item) {
        trsconfirm.confirmModel('提示信息', "您确定要彻底删除此报纸:" + "<span style='color:red'>" + item.SITEDESC + "</span>", function() {
            delectItems(item);
        });

    };

    function delectItems(items) {
        var ids = angular.isArray(items) ? trsspliceString.spliceString(items, 'SITEID', ',') : items.SITEID;
        var params = {
            serviceid: "mlf_paperset",
            methodname: "deletePapers",
            ObjectIds: ids
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            requestData();
        });
    }
    //停用弹窗
    $scope.disableViews = function() {
        productMangageMentNewspaperService.disableViews("", "哈哈", $scope, function(data) {});
    };
    //启用弹窗
    /* $scope.enableViews = function() {
         productMangageMentNewspaperService.enableViews("", "哈哈", $scope, function(data) {});
     };*/
    //报刊管理
    $scope.manageNewspaper = function(item) {
        if ($scope.status.rights[item.SITEID].paper.bianji) {
            productMangageMentNewspaperService.manageNews(item, function() {
                requestData();
            });
        } else {
            trsconfirm.alertType("您没有编辑该报纸的权限", "您没有编辑该报纸的权限", "error", false);
        }
    };
    //停用或启用报纸
    //$scope.enableOrDisableViews = function(item, flag) {
    //    var modalInstance = $modal.open({
    //        templateUrl: flag > -1 ? "./manageConfig/productManageMent/newspaper/service/enable/newspaper_enable_tpl.html" : "./manageConfig/productManageMent/newspaper/service/disable/newspaper_disable_tpl.html",
    //        scope: $scope,
    //        windowClass: 'productManageMent-newspaper-enableViews',
    //        backdrop: false,
    //        controller: "productManageMentNewspaperEnableViewsCtrl",
    //        resolve: {
    //            widgetParams: function() {
    //                return {
    //                    SITEDESC: item.SITEDESC
    //                };
    //            }
    //        }
    //    });
    //    modalInstance.result.then(function(result) {
    //        enableOrDisable(item, flag);
    //    });
    //};
    //启用或停用报纸服务
    //function enableOrDisable(item, flag) {
    //    var params = {
    //        serviceid: "mlf_paperset",
    //        methodname: flag > -1 ? "startPaperById" : "stopPaperById",
    //        ObjectId: item.SITEID
    //    };
    //    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
    //        requestData();
    //    });
    //}
    //停用启用
    $scope.stopOrStart = function(item) {
        //启用
        if (item.STATUS == "-1") {
            trsconfirm.confirmModel('提示信息', "您确定启用:" + "<span style='color:red'>" + item.SITEDESC + "</span>", function() {
                $scope.params.serviceid = "mlf_paperset";
                $scope.params.methodname = "startPaperById";
                $scope.params.ObjectId = item.SITEID;
                requestData(function() {
                    $scope.params.serviceid = "mlf_paperset";
                    $scope.params.methodname = "queryPagers";
                    requestData();
                });
            });
        }
        //停用
        if (item.STATUS === "0") {
            trsconfirm.confirmModel('提示信息', "您确定停用:" + "<span style='color:red'>" + item.SITEDESC + "</span>", function() {
                $scope.params.serviceid = "mlf_paperset";
                $scope.params.methodname = "stopPaperById";
                $scope.params.ObjectId = item.SITEID;
                requestData(function() {
                    $scope.params.serviceid = "mlf_paperset";
                    $scope.params.methodname = "queryPagers";
                    requestData();
                });
            });
        }
    };

    //点击采编版面,判断该报纸下是否存在叠次
    $scope.goEditLayout = function(item) {
        var params = {
            "serviceid": "mlf_paperset",
            "methodname": "queryDieCis",
            "PaperId": item.SITEID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
            if (data.length < 1) {
                trsconfirm.alertType("请先在该报纸下启用或添加叠次", "", "warning", false);
            } else {
                $state.go("manageconfig.productmanage.newspaper.editlayout", {
                    "paper": item.SITEID
                });
            }
        });
    };

    //点击照排版面,判断该报纸下是否存在叠次
    $scope.goZPLayout = function(item) {
        if (item.ISZHAOPAI == 0) return;
        var params = {
            "serviceid": "mlf_paperset",
            "methodname": "queryDieCis",
            "PaperId": item.SITEID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
            if (data.length < 1) {
                trsconfirm.alertType("请先在该报纸下启用或添加叠次", "", "warning", false);
            } else {
                $state.go("manageconfig.productmanage.newspaper.typesettingpage", {
                    "paper": item.SITEID
                });
            }
        });
    };
}
