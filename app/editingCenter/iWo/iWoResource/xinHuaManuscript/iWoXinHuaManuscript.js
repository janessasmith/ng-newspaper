"use strict";
angular.module('iWoXinHuaManuscriptModule', []).
controller('iWoXinHuaManuscriptCtrl', xinHuaManuscriptCtrl);
xinHuaManuscriptCtrl.$injector = ["$scope", "$timeout", "trsHttpService", "SweetAlert", 'initSingleSelecet', 'iWoListBtnService', 'iWoService', 'trsspliceString'];

function xinHuaManuscriptCtrl($scope, $timeout, trsHttpService, SweetAlert, initSingleSelecet, iWoListBtnService, iWoService, trsspliceString) {
    initStatus();
    initData();
    //下一页
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.copyCurrPage = $scope.page.CURRPAGE;
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
        $scope.preview = ['iWoNewsPreview', 'iWoAtlasPreview'];
    };
    //初始化状态
    function initStatus() {
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": 10
        };
        $scope.params = {
            "serviceid": "mlf_releasesource",
            "methodname": "queryPersonalRelease"
        };
        $scope.selectedArray = [];
        $scope.batchOperateBtn = {
            "hoverStatus": "",
            "clickStatus": ""
        };
        $scope.copyCurrPage = 1;
        iWoListBtnService.initListBtn('iwo.xinhuarelease').then(function(data) {
            $scope.btnRights = data;
        });
    }
    //初始化数据
    function initData() {
        requestData();
        //下拉框单选
        $scope.iWoEntireJsons = initSingleSelecet.iWoEntire();
        $scope.iWoEntire = angular.copy($scope.iWoEntireJsons[0]);

        $scope.docTypeJsons = initSingleSelecet.docType();
        $scope.docType = angular.copy($scope.docTypeJsons[0]);

        $scope.iWoSourceJsons = initSingleSelecet.iWoSource();
        $scope.iWoSource = angular.copy($scope.iWoSourceJsons[0]);

        $scope.timeTypeJsons = initSingleSelecet.timeType();
        $scope.timeType = angular.copy($scope.timeTypeJsons[0]);
    }

    //数据请求函数
    function requestData(callback) {
        $scope.loadingPromise = trsHttpService.httpServer('./editingCenter/iWo/data/xinHuaManuscript.json', $scope.params, 'get').then(function(data) {
            if (angular.isFunction(callback)) {
                callback(data);
            } else {
                $scope.items = data.DATA;
                $scope.page = data.PAGER;
                angular.isDefined($scope.page) ? $scope.page.PAGESIZE =
                    $scope.page.PAGESIZE.toString() : $scope.page = {
                        "PAGESIZE": 0,
                        "ITEMCOUNT": 0,
                        "PAGECOUNT": 0
                    };
            }
            $scope.selectedArray = [];
        }, function(data) {
            sweetAlert('数据请求错误', data, "error");
        });
    }

    //取稿
    $scope.getDraft = function() {
        $scope.batchOperateBtn.clickStatus = "getDraft";
    };
    //导出
    $scope.batchExport = function() {
        $scope.batchOperateBtn.clickStatus = "batchExport";
        iWoService.exportDraft(trsspliceString.spliceString($scope.selectedArray,
            "METADATAID", ','));
    };
    //外发
    $scope.batchOutgoing = function() {
        $scope.batchOperateBtn.clickStatus = "batchOutgoing";
    };

    //全选
    $scope.selectAll = function() {
        $scope.selectedArray = $scope.selectedArray.length == $scope.items.length ? [] : [].concat($scope.items);
        cancelBatchOperate();
    };
    //单选
    $scope.selectDoc = function(item) {
        if ($scope.selectedArray.indexOf(item) < 0) {
            $scope.selectedArray.push(item);
        } else {
            $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
        }
        cancelBatchOperate();
    };
    //取消批量操作的样式
    function cancelBatchOperate() {
        if ($scope.selectedArray.length === 0) {
            $scope.batchOperateBtn = {
                "hoverStatus": "",
                "clickStatus": ""
            };
        }
    }
    //提示框
    function sweetAlert(title, text, type) {
        SweetAlert.swal({
            title: title,
            text: text,
            type: type,
            closeOnConfirm: true,
            cancelButtonText: "取消",
        });
    }
    //选择单页显示个数
    $scope.selectPageNum = function() {
        $scope.params.PageSize = $scope.page.PAGESIZE;
        $scope.jumpToPageNum = 1;
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    //搜索
    $scope.fullTextSearch = function(ev) {
        var searchParams = {
            PAGESIZE: $scope.page.PAGESIZE + "",
            PAGEINDEX: '1',
            searchFields: [{
                keywords: $scope.keywords,
            }]
        };
        var params = {
            'serviceid': "mlf_essearch",
            'methodname': "queryForIwo",
            'searchParams': searchParams
        };
        if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                $scope.items = data.DATA;
                $scope.page = data.PAGER;
            });
        }
    };
}
