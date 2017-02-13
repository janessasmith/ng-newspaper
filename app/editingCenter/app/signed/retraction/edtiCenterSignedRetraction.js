"use strict";
/*
    created by CC 2015-11-13
 */
angular.module('editingCenterSignedRetractionModule', []).
controller("editCompileSignedRetractionCtroller", ["SweetAlert", "$stateParams", "trsHttpService", "$scope", "trsconfirm", "trsResponseHandle", "initSingleSelecet", "$timeout", function(SweetAlert, $stateParams, trsHttpService, $scope, trsconfirm, trsResponseHandle, initSingleSelecet, $timeout) {
    // $scope.previewPath = ["newsPreview", "atlasPreview", "subjectPreview", "websitePreview"];
    initStatus();
    initData();
    //下一页
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    /*跳转指定页面*/
    $scope.jumpToPage = function() {
        if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.params.CurrPage = $scope.copyCurrPage;
        requestData();
    };

    function initStatus() {
        $scope.stateParams = {
            'ChannelId': $stateParams.channelId,
            "SiteId": $stateParams.siteid
        };
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": 10
        };
        $scope.params = {
            "serviceid": "mlf_appdoc",
            "methodname": "queryWithdrawDoc",
            "PageSize": $scope.page.PAGESIZE,
            "CurrPage": $scope.page.CURRPAGE,
            "ChannelId": $scope.stateParams.ChannelId,
            "SiteId": $scope.stateParams.SiteId
        };
        $scope.selectedArray = [];
        $scope.channelid = $stateParams.channelid;
        $scope.copyCurrPage  = 1;
    }
    //请求函数
    function requestData(callback) {
        trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, "get").then(function(data) {
            if (angular.isFunction(callback)) {
                callback(data);
            } else {
                $scope.items = data.DATA;
                $scope.page = data.PAGER;
                angular.isDefined($scope.page) ? $scope.page.PAGESIZE = $scope.page.PAGESIZE.toString() : $scope.page = {
                    "PAGESIZE": 0,
                    "ITEMCOUNT": 0
                };
            }
            $scope.selectedArray = [];
        }, function(data) {
            sweetAlert('数据请求错误', data, "error");
        });
    }
    //数据初始化
    function initData() {
        requestData();
        //单选开始
        $scope.singleJsons = initSingleSelecet.docStatus();
        $scope.docStatus = angular.copy($scope.singleJsons[0]);

        $scope.docTypeJsons = initSingleSelecet.docType();
        $scope.docType = angular.copy($scope.docTypeJsons[0]);

        $scope.timeTypeJsons = initSingleSelecet.timeType();
        $scope.timeType = angular.copy($scope.timeTypeJsons[0]);

        $scope.iWoEntireJsons = initSingleSelecet.iWoEntire();
        $scope.iWoEntire = angular.copy($scope.iWoEntireJsons[0]);
        //单选结束
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
    //全选
    $scope.selectAll = function() {
        $scope.selectedArray = $scope.selectedArray.length == $scope.items.length ? [] : [].concat($scope.items);
    };
    //单选
    $scope.selectDoc = function(item) {
        if ($scope.selectedArray.indexOf(item) < 0) {
            $scope.selectedArray.push(item);
        } else {
            $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
        }
    };
    //单项签发
    $scope.singleSigned = function(recId) {
        trsconfirm.confirmModel("签发", '是否签发', function() {
            sign(recId);
        });
    };

    //签发函数
    function sign(signArray) {
        $scope.params.serviceid = "mlf_appoper";
        $scope.params.methodname = "appDaiShenPublish";
        $scope.params.ObjectIds = signArray;
        requestData(function() {
            $scope.params.serviceid = "mlf_appdoc";
            $scope.params.methodname = "queryReviewDoc";
            requestData();
        });
        $scope.selectedArray = [];
    }
    //分页请求数据
    function request(param) {
        trsHttpService.httpServer("/wcm/mlfcenter.do", param, "get").then(function(data) {
            $scope.items = data.DATA;
            $scope.page = data.PAGER;
            $scope.page.PAGESIZE = $scope.page.PAGESIZE.toString();
        }, function(data) {
            //分页请求错误；
        });
    }

    function trial(toTrial) {
        trsconfirm.inputModel("送审", "确定送审吗？", function(content) {
            var params = {
                "serviceid": "mlf_appoper",
                "methodname": "trialMetaDatas",
                "MetaDataIds": toTrial,
                "ChannelId": $scope.channelid,
                "Opinion": content
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                trsResponseHandle.responseHandle(data, false).then(function() {
                    $scope.selectedArray = [];
                    request($scope.params);
                }, function() {});
            }, function(data) {
                SweetAlert.swal({
                    title: "提示",
                    text: "请求送审失败，请检查网络",
                    type: "warning",
                    closeOnConfirm: true,
                    cancelButtonText: "确定",
                });
            });

        });
    }
    $scope.trial = function(item) {
        var toTrial = item.METADATAID;
        trial(toTrial);
    };
    //根据稿件状态查询
    $scope.queryByDocStatus = function() {

        $timeout(function() {
            $scope.params.serviceid = "mlf_appdoc";
            $scope.params.methodname = "queryToBeCompiledDoc";
            $scope.params.DocStatus = angular.copy($scope.docStatus).value;
            requestData();
        });
    };
    //根据稿件类型查询
    $scope.queryByDocType = function() {
        $timeout(function() {
            $scope.params.serviceid = "mlf_appdoc";
            $scope.params.methodname = "queryToBeCompiledDoc";
            $scope.params.DocType = angular.copy($scope.docType).value;
            requestData();
        });
    };
    //根据稿件类型查询
    $scope.queryByTimeType = function() {
        $timeout(function() {
            $scope.params.serviceid = "mlf_appmetadata";
            $scope.params.methodname = "queryToBeCompiledDoc";
            $scope.params.timeType = angular.copy($scope.timeType).value;
            requestData();
        });
    };
    //选择单页显示个数
    $scope.selectPageNum = function() {
        $timeout(function() {
            $scope.params.PageSize = $scope.page.PAGESIZE;
            requestData();
        });
    };
}]);
