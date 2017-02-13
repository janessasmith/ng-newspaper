"use strict";
/*
    created by CC 2015-11-13
 */
angular.module('editingCenterSignedFocusModule', []).
controller("editCompileSignedFocusController", ["SweetAlert", "$timeout", "$stateParams", "trsHttpService", "$scope", "trsconfirm", "trsResponseHandle", "trsspliceString", "initSingleSelecet", function(SweetAlert, $timeout, $stateParams, trsHttpService, $scope, trsconfirm, trsResponseHandle, trsspliceString, initSingleSelecet) {
    $scope.urlPath = ["news", "atlas", "subject", "website"];
    $scope.previewPath = ["newsPreview", "atlasPreview", "subjectPreview", "websitePreview"];
    //初始化开始
    initStatus();
    //初始化结束
    initData();
    $scope.upImg = function(DocFocusImgRelId, index) {
        var params = {
            "serviceid": "mlf_metafocusimage",
            "methodname": "upImg",
            "DocFocusImgRelId": DocFocusImgRelId
        };
        if (index > 0) {
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                var temp = angular.copy($scope.items[index]);
                $scope.items[index] = angular.copy($scope.items[index - 1]);
                $scope.items[index - 1] = temp;
            });
        }
    };
    $scope.downImg = function(DocFocusImgRelId, index) {
        var params = {
            "serviceid": "mlf_metafocusimage",
            "methodname": "downImg",
            "DocFocusImgRelId": DocFocusImgRelId
        };
        if (index < 4) {
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                var temp = angular.copy($scope.items[index]);
                $scope.items[index] = angular.copy($scope.items[index + 1]);
                $scope.items[index + 1] = temp;
            });
        }
    };
    $scope.grounding = function(item) {
        trsconfirm.confirmModel("上架", "是否上架？上架后，将在焦点图列表中展示该焦点图！", function() {
            $scope.params.methodname = "pushImg";
            $scope.params.DocFocusImgRelId = item.DOCFOCUSIMGRELID;
            delete $scope.params.PageSize;
            delete $scope.params.CurrPage;
            delete $scope.params.ChannelId;
            delete $scope.params.SiteId;
            trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
                trsResponseHandle.responseHandle(data);
                resetParams();
                requestData();
            }, function(data) {});
        });
    };
    $scope.undercarriage = function(item) {
        trsconfirm.confirmModel("下架", "是否下架?下架后，该新闻将会在栏目新闻列表中展示！", function() {
            $scope.params.methodname = "popImg";
            $scope.params.DocFocusImgRelId = item.DOCFOCUSIMGRELID;
            delete $scope.params.PageSize;
            delete $scope.params.CurrPage;
            delete $scope.params.ChannelId;
            delete $scope.params.SiteId;
            trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
                resetParams();
                requestData();
            }, function(data) {});
        });
    };
    //只看我的开始
    $scope.isOnlyMine = function() {
        $scope.params.methodname = "query";
        $scope.params.serviceid = "mlf_metafocusimage";
        $scope.params.isOnlyMine = true;
        $scope.onlyMine = !$scope.onlyMine;
        if (!$scope.onlyMine) {
            delete $scope.params.isOnlyMine;
        }
        requestData();

    };
    //只看我的结束
    //初始化函数
    function initStatus() {
        $scope.stateParams = {
            'ChannelId': $stateParams.channelid,
            "SiteId": $stateParams.siteid
        };
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": 10
        };
        $scope.copyCurrPage  = 1;
        resetParams();
        $scope.selectedArray = [];
        $scope.siteid = $stateParams.siteid;
        $scope.channelid = $stateParams.channelid;
    }
    //数据请求函数
    function requestData() {
        trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
            $scope.page = data.PAGER;
            $scope.items = data.DATA;
            angular.isDefined($scope.page) ? $scope.page.PAGESIZE = $scope.page.PAGESIZE.toString() : $scope.page = {
                "PAGESIZE": 0,
                "ITEMCOUNT": 0
            };
            $scope.selectedArray = [];
        }, function(data) {
            swertAlert('请求数据错误', data, "error");
        });
    }

    function initData() {
        requestData();
        $scope.docTypeJsons = initSingleSelecet.docType();
        $scope.docType = angular.copy($scope.docTypeJsons[0]);

        $scope.timeTypeJsons = initSingleSelecet.timeType();
        $scope.timeType = angular.copy($scope.timeTypeJsons[0]);
    }
    //列表请求参数初始化
    function resetParams() {
        $scope.params = {
            "serviceid": "mlf_metafocusimage",
            "methodname": "query",
            "PageSize": $scope.page.PAGESIZE,
            "ChannelId": $scope.stateParams.ChannelId,
            "CurrPage": $scope.page.CURRPAGE,
            "SiteId": $scope.stateParams.SiteId
        };
    }
    //下一页
    $scope.pageChanged = function() {
        resetParams();
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
    //提示框
    function swertAlert(title, text, type) {
        SweetAlert.swal({
            title: title,
            text: text,
            type: type,
            closeOnConfirm: true,
            cancelButtonText: "取消",
        });
    }
    //调用服务
    function request(callback) {
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
    //撤稿方法
    function retract(ObjectIds) {
        $scope.params.serviceid = "mlf_appoper";
        $scope.params.methodname = "withdraw";
        $scope.params.ObjectIds = ObjectIds;
        request(function() {
            $scope.params.serviceid = "mlf_metafocusimage";
            $scope.params.methodname = "query";
            request();
        });


    }
    $scope.retraction = function(ObjectIds) {
        trsconfirm.confirmModel("撤稿", "是否撤出改稿件", function() {
            retract(ObjectIds);
        });
    };
    //根据稿件类型查询
    $scope.queryByDocType = function(DocType) {
        $scope.params.serviceid = "mlf_metafocusimage";
        $scope.params.methodname = "query";
        $scope.params.DocType = angular.copy($scope.docType).value;
        request();
    };
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
    //批量收藏稿件
    $scope.collect = function() {
        trsconfirm.confirmModel('稿件收藏', '确认收藏稿件', function() {
            var ChnlDocIdsArray = trsspliceString.spliceString($scope.selectedArray, "RECID", ",");
            var MetaDataIdsArray = trsspliceString.spliceString($scope.selectedArray, "METADATAID", ",");
            collection(ChnlDocIdsArray, MetaDataIdsArray);
        });
    };
    //稿件收藏函数
    function collection(ChnlDocIdsArray, MetaDataIdsArray) {
        $scope.params.serviceid = "mlf_appoper";
        $scope.params.methodname = "collectionMetaDatas";
        $scope.params.ChnlDocIds = ChnlDocIdsArray;
        $scope.params.MetaDataIds = MetaDataIdsArray;
        $scope.params.ChannelId = $stateParams.channelid;
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
            sweetAlert('收藏成功', "", "success");
            $scope.selectedArray = [];
        }, function(data) {
            sweetAlert('稿件收藏失败', data, "error");
        });
    }
    //选择单页显示个数
    $scope.selectPageNum = function() {
        $timeout(function() {
            $scope.params.PageSize = $scope.page.PAGESIZE;
            requestData();
        });
    };
}]);
