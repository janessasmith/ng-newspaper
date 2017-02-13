"use strict";
/*
    createBy CC 2016-8-12
 */
angular.module('publishLiveMoudle', ["mgcrea.ngStrap.timepicker", "mgcrea.ngStrap.datepicker"]).controller('publishLiveController', ['$scope', '$state', '$q', '$modal', '$modalInstance', '$validation', '$filter', 'trsHttpService', 'globleParamsSet', "trsconfirm", "incomeData", "initComDataService", function($scope, $state, $q, $moadl, $modalInstance, $validation, $filter, trsHttpService, globleParamsSet, trsconfirm, incomeData, initComDataService) {
    initStatus();
    initData();

    function initData() {
        if (incomeData.isCreate === false) {
            initEditData();
        } else {
            getPublishChannel();
        }
    }

    function initEditData() {
        var params = {
            serviceid: "mlf_liveshow",
            methodname: "getLiveShowZhuTi",
            XWCMLiveShowZhuTiId: incomeData.item.XWCMLIVESHOWZHUTIID,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            $scope.live = data;
            $scope.live.CRTIME = null;
            $scope.live.CRUSER = null;
            $scope.live.CLICKNUMBER = null;
            $scope.live.HTMLCONTENT = null;
            $scope.live.ISCLOSE = null;
            $scope.live.SORT = null; //删除多余字段
            getPublishChannel();
        });
    }

    function initStatus() {
        $scope.data = incomeData;
        $scope.live = {
            TITLE: "",
            CHANNELID: $state.params.liveid,
            CONTENT: "",
            ISSHOW: 1,
            TYPE: "大事件",
            STARTTIME: new Date(),
            INSERTTIME: new Date(),
        };
        $scope.status = {
            channels: [],
            selectedChannel: "",
            index: 0
        };
    }
    $scope.close = function() {
        $modalInstance.dismiss();
    };
    $scope.confirm = function() {
        $validation.validate($scope.liveForm).success(function() {
            $scope.live.serviceid = "mlf_liveshow";
            $scope.live.methodname = "saveLiveShowZhuTi";
            $scope.live.CHANNELID = $scope.status.selectedChannel.value;
            $scope.live.STARTTIME = $filter('date')($scope.live.STARTTIME, "yyyy-MM-dd HH:mm:ss").toString();
            if (!$scope.data.isCreate) {
                $scope.live.CLOSETIME = $filter('date')($scope.live.CLOSETIME, "yyyy-MM-dd HH:mm:ss").toString();
            }
            $scope.live.INSERTTIME = $filter('date')($scope.live.INSERTTIME, "yyyy-MM-dd HH:mm:ss").toString();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.live, "get").then(function() {
                trsconfirm.saveModel("发布直播成功", "", "success");
                $modalInstance.close();
            }, function() {
                $modalInstance.dismiss();
            });
        }).error(function() {
            trsconfirm.saveModel("提交失败", "请检查填写项", "error");
        });
    };
    /**
     * [getPublishChannel description]获得推送频道
     * @return {[type]} [description]
     */
    function getPublishChannel() {
        angular.forEach(initComDataService.saveLiveChannel, function(data, index) {
            $scope.status.channels.push({ name: data.BIAOQIANNAME, value: data.XWCMLIVESHOWBIAOQIANID });
            if (data.XWCMLIVESHOWBIAOQIANID == $scope.live.CHANNELID) {
                $scope.status.index = index;
            }
        });
        $scope.status.selectedChannel = angular.copy($scope.status.channels[$scope.status.index]);
    }
}]);
