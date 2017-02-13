"use strict";
/*
    createBy CC 2016-8-15
 */
angular.module('addHosterModule', ["mgcrea.ngStrap.timepicker", "mgcrea.ngStrap.datepicker"]).controller('addHosterController', ['$scope', '$state', '$q', '$modal', '$modalInstance', '$validation', '$filter', '$timeout', 'trsHttpService', 'globleParamsSet', "trsconfirm", "incomeData", "Upload", function($scope, $state, $q, $moadl, $modalInstance, $validation, $filter, $timeout, trsHttpService, globleParamsSet, trsconfirm, incomeData, Upload) {
    initStatus();
    if ($scope.data.isCreate === false) {
        initEditData();
    }

    function initStatus() {
        $scope.data = incomeData;
        $scope.hoster = {
            COMPERENAME: "",
            COMPERETYPE: 1,
            CONTENT: "",
            INSERTTIME: new Date(),
            HEADPICNAME: "",
            HEADPICURL: "",
        };
        $scope.data = incomeData;
    }

    function initEditData() {
        var params = {
            serviceid: "mlf_liveshowcompere",
            methodname: "getLiveShowCompere",
            XWCMLiveShowCompereId: incomeData.item.XWCMLIVESHOWCOMPEREID,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            $scope.hoster = data;
            if (angular.isUndefined($scope.hoster.HEADPICURL)) {
                $scope.hoster.HEADPICURL = "";
            }
            if (angular.isUndefined($scope.hoster.HEADPICNAME)) {
                $scope.hoster.HEADPICNAME = "";
            }
            $scope.hoster.CRTIME = null;
            $scope.hoster.CRUSER = null;
            $scope.hoster.HTMLCONTENT = null; //删除多余字段
        });
    }
    /**
     * [choosePortrait description]选择头像上传
     * @param  {[obj]} file  [description]当前文件对象
     * @param  {[array]} files [description]文件集合
     * @return {[type]}       [description]
     */
    $scope.choosePortrait = function(file, files) {
        if (files != null) {
            if (angular.isUndefined(files[0].$error)) {
                Upload.upload({
                    url: '/wcm/openapi/uploadImage',
                    data: {
                        file: file,
                    }
                }).then(function(resp) {
                    if (angular.isDefined(resp.data.imgSrc)) {
                        $scope.hoster.HEADPICURL = resp.data.imgSrc;
                        $scope.hoster.HEADPICNAME = resp.data.imgName;
                    } else {
                        trsconfirm.alertType("图片上传失败", resp.data.error, "warning", false);
                    }
                }, function(resp) {
                    trsconfirm.alertType("图片上传失败","", "warning", false);
                }, function(evt) {});
            } else {
                trsconfirm.alertType("请选择图片文件", "", "warning", false);
            }
        }
    };
    /**
     * [deleteImg description]删除头像
     * @return {[type]} [description]
     */
    $scope.deleteImg = function() {
        $scope.hoster.HEADPICURL = "";
        $scope.hoster.HEADPICNAME = "";
    };
    $scope.close = function() {
        $modalInstance.dismiss();
    };
    $scope.confirm = function() {
        $validation.validate($scope.hosterForm).success(function() {
            $scope.hoster.serviceid = "mlf_liveshowcompere";
            $scope.hoster.methodname = "saveLiveShowCompere";
            $scope.hoster.INSERTTIME = $filter('date')($scope.hoster.INSERTTIME, "yyyy-MM-dd HH:mm:ss").toString();
            $scope.hoster.HEADPICURL = null;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.hoster, "get").then(function() {
                trsconfirm.saveModel("主持人操作成功", "", "success");
                $modalInstance.close();
            }, function() {
                $modalInstance.dismiss();
            });
        }).error(function() {
            trsconfirm.saveModel("提交失败", "请检查填写项", "error");
        });
    };
}]);
