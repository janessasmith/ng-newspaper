/*
 Create by smg  2015-12-25
 */
"use strict";
angular.module('editLayoutManageModule', [])
    .controller('editLayoutManageCtrl', editLayoutManage);
editLayoutManage.$injector = ["$scope", "$q", "$filter", "$timeout", "$modal", "$stateParams", "trsHttpService", "SweetAlert", "trsconfirm", "myManuscriptService", 'initSingleSelecet', 'editingCenterService', 'trsResponseHandle', 'trsspliceString', "initVersionService", "getNewsNameService", "productMangageMentNewspaperService"];

function editLayoutManage($scope, $q, $filter, $timeout, $modal, $stateParams, trsHttpService, SweetAlert, trsconfirm, myManuscriptService, initSingleSelecet, editingCenterService, trsResponseHandle, trsspliceString, initVersionService, getNewsNameService, productMangageMentNewspaperService) {
    initStatus();
    initData();
    /**
     * [getSiteRights description]获取每个站点的操作权限
     * @return null [description]
     */
    function getSiteRights() {
        productMangageMentNewspaperService.getRight($stateParams.paper, "", "papersetpaper.caibianbanmian").then(function(data) {
            $scope.status.right = data;
        });
    }
    //下一页
    //类型筛选
    $scope.queryByPaperType = function() {
        $scope.params.Status = angular.copy($scope.newspaperManageStateSelected).value;
        requestData();
    };
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    //搜索采编
    $scope.searchCaiBian = function() {
        $scope.params.ChnlDesc = $scope.keywords;
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
        //停用启用
        $scope.newspaperManageState = initSingleSelecet.newspaperManageState();
        $scope.newspaperManageStateSelected = angular.copy($scope.newspaperManageState[0]);
    }

    //初始化状态
    function initStatus() {
        $scope.params = {
            "serviceid": "mlf_paperset",
            "methodname": "queryCaiBianBanMians",
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
        $scope.copyCurrPage = 1;
    }

    //初始化数据
    function initData() {
        requestData();
        getDropDown();
        dieciDroplist();
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
        });
    }


    //新建采编版面
    $scope.newpageediting = function() {
        draftSaveCreate();
    };
    //编辑采编版面
    $scope.editName = function(item) {
        if (angular.isDefined($scope.status.right.caibianbanmian.bianji)) {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/editName/editName_tpl.html",
                scope: $scope,
                windowClass: 'man_produ_NewOrder',
                backdrop: false,
                controller: "productManageMentEditNameCtrl",
                resolve: {
                    selectedItem: function() {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function() {
                requestData();
            });
        } else {
            trsconfirm.alertType("您没有权限编辑该版面", "您没有权限编辑该版面", "error", false);
        }
    };

    function draftSaveCreate(returnData) {
        var modalInstance = $modal.open({
            templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/editName/editName_tpl.html",
            scope: $scope,
            windowClass: 'zp-layout-rank-window',
            backdrop: false,
            controller: "productManageMentNewPageEditingCtrl",
            resolve: {
                params: function() {
                    return {
                        dieci: returnData ? returnData.dieci : "",
                        banmian: returnData ? returnData.banmian : "",
                        jianchen: returnData ? returnData.jianchen : ""
                    };
                }
            }
        });
        modalInstance.result.then(function(result) {
            requestData();
            if (result != "save") {
                draftSaveCreate(result);
            }
        });
    }
    //版面排序
    $scope.layoutRank = function() {
        var modalInstance = $modal.open({
            templateUrl: "./manageConfig/productManageMent/newspaper/alertViews/ZPLayoutRank/ZPLayoutRank_tpl.html",
            scope: $scope,
            windowClass: 'zp-layout-rank-window',
            backdrop: false,
            resolve: {
                rankItems: function() {
                    return $scope.selectedArray;
                },
                title: function() {
                    return "采编版面管理-排序";
                }

            },
            controller: "productManageMentCBLayoutRankCtrl"
        });
        modalInstance.result.then(function(result) {
            $scope.params.serviceid = "mlf_paperset";
            $scope.params.methodname = "queryCaiBianBanMians";
            $scope.params.PaperId = $stateParams.paper;
            $scope.params.DieCiId = result.value;
            $scope.dieciDroplistSelected = result;
            requestData();
        });
    };




    //删除方法
    function deleteFun(item) {
        // $scope.params.serviceid = "mlf_paperset";
        // $scope.params.methodname = "deleteDieCiOrBanMians";
        // $scope.params.ObjectIds = item;
        // requestData(function() {
        //     $scope.params.serviceid = "mlf_paperset";
        //     $scope.params.methodname = "queryCaiBianBanMians";
        //     requestData();
        // });
        var params = {
            serviceid: 'mlf_paperset',
            methodname: 'deleteDieCiOrBanMians',
            ObjectIds: item,
        }
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function() {
            requestData();
        }, function() {
            requestData();
        })
    }

    //单个删除
    $scope.singleDelete = function(item) {
        trsconfirm.confirmModel('提示信息', "您确定要彻底删除此采编版面:" + "<span style='color:red'>" + item.CHNLDESC + "</span>", function() {
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
            resolve: {
                delItems: function() {
                    return $scope.selectedArray;
                },
                title: function() {
                    return "您确认批量删除以下版面："
                }
            }
        });
        modalInstance.result.then(function() {
            var delArray = trsspliceString.spliceString($scope.selectedArray,
                'CHANNELID', ',');
            deleteFun(delArray);
        });
    };

    //停用启用
    $scope.stopOrStart = function(item) {
        //停用
        if (item.STATUS === "-1") {
            trsconfirm.confirmModel('提示信息', "您确定启用:" + "<span style='color:red'>" + item.CHNLDESC + "</span>", function() {
                $scope.params.serviceid = "mlf_paperset";
                $scope.params.methodname = "startDieCiOrBanMian";
                $scope.params.ObjectId = item.CHANNELID;
                requestData(function() {
                    $scope.params.serviceid = "mlf_paperset";
                    $scope.params.methodname = "queryCaiBianBanMians";
                    requestData();
                });
            });
        }
        //启用
        if (item.STATUS == "0") {
            trsconfirm.confirmModel('提示信息', "您确定停用:" + "<span style='color:red'>" + item.CHNLDESC + "</span>", function() {
                $scope.params.serviceid = "mlf_paperset";
                $scope.params.methodname = "stopDeiCiOrBanMian";
                $scope.params.ObjectId = item.CHANNELID;
                requestData(function() {
                    $scope.params.serviceid = "mlf_paperset";
                    $scope.params.methodname = "queryCaiBianBanMians";
                    requestData();
                });
            });
        }

    };



    //初始化叠次下拉框
    function dieciDroplist() {
        var deffered = $q.defer();
        var params = {
            "serviceid": "mlf_paperset",
            "methodname": "queryDieCis",
            "PaperId": $stateParams.paper
        };
        trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
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
        $scope.params.methodname = "queryCaiBianBanMians";
        $scope.params.PaperId = $stateParams.paper;
        $scope.params.DieCiId = $scope.dieciDroplistSelected.value;
        requestData();
    };
}
