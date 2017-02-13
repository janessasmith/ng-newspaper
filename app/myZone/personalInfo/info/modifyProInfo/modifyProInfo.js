/**
 * Created by 马荣钦 on 2016/2/1.
 */
"use strict";
angular.module('myZoneProInfoModifyModule', []).
controller("myZoneProInfoModifyCtrl", ['$scope', '$rootScope', '$state', "$validation", "$q", "trsHttpService", "trsconfirm", 'initMyZoneSelectedService', 'Upload', function($scope, $rootScope, $state, $validation, $q, trsHttpService, trsconfirm, initMyZoneSelectedService, Upload) {
    initStatus();
    initData();

    function initData() {
        initDropDown();
        requestData();
        getheadPortrait();
        //getServiceTime().then(function(data){
        //    console.log(data)
        //})
    }

    function initStatus() {
        $scope.params = {
            serviceid: "mlf_extuser",
            methodname: "getCurrUserInfo"
        };
        $scope.headParams = {
            serviceid: 'mlf_extuser',
            methodname: 'getUserHeadPic',
        };
        $scope.headPic = '';
        $scope.status = {
            headPortrait: [],
            changeHeadImg: '',
        };
    }

    function requestData() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
            $scope.info = data;
            $scope.initialInfo = angular.copy(data);
            //默认的性别选项
            $scope.sex = angular.copy($scope.sexJsons[0]);
            angular.forEach($scope.sexJsons, function(data, index, arr) {
                if (data.name == $scope.info.SEX) {
                    $scope.sex = data;
                }
            });
            //默认的办公地点选项
            $scope.office = angular.copy($scope.officeJsons[0]);
            angular.forEach($scope.officeJsons, function(data, index, arr) {
                if (data.name == $scope.info.OFFICE) {
                    $scope.office = data;
                }
            });
            //展示办公室电话
            $scope.info.TEL = $scope.info.TELEPHONE;
            delete $scope.info.TELEPHONE;
        });
    }

    function initDropDown() {
        //初始化性別
        $scope.sexJsons = initMyZoneSelectedService.modifyInfoSex();

        //初始化办公地点
        $scope.officeJsons = initMyZoneSelectedService.modifyInfoOffice();
    }
    //选择性别
    $scope.chooseSex = function() {
        $scope.info.SEX = $scope.sex.name;
    };
    //选择办公地点
    $scope.chooseOffice = function() {
        $scope.info.OFFICE = $scope.office.name;
    };
    //关闭不修改
    $scope.close = function() {
        if ($scope.initialInfo != $scope.info) {
            trsconfirm.alertType("是否关闭", "修改未保存", "info", true, function() {
                $scope.saveInfo();
            });
        } else {
            $state.go("myzone.personalinfo.info");
        }
    };
    //保存修改
    $scope.saveInfo = function() {
        $validation.validate($scope.modifyProInfo).success(function() {
            $scope.info.serviceid = "mlf_extuser";
            $scope.info.methodname = "saveCurrUser";
            $scope.info.SEX = $scope.sex.name;
            $scope.info.USERIDCARD = angular.copy($scope.info.FGDSFZ);
            $scope.info.USERHEAD=null;
            delete $scope.info.FGDSFZ;
            delete $scope.info.ID;
            delete $scope.info.COMPANY;
            delete $scope.info.DEPT;
            delete $scope.info.TRUENAME;
            delete $scope.info.USERNUM;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.info, "post").then(function(result) {
                trsconfirm.alertType("修改个人信息成功", "", "success", false, function() {
                    $state.go('myzone.personalinfo.info');
                });
            });
        });
    };
    //获取服务器时间
    function getServiceTime() {
        //获取系统时间
        var params = {
            serviceid: "mlf_fusion",
            methodname: "getServiceTime"
        };
        var deferred = $q.defer();
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            var serviceTime = data.LASTOPERTIME;
            for (var i = 0; i < serviceTime.length; i++) {
                if (serviceTime.indexOf("-") < 0) {
                    break;
                }
                serviceTime = serviceTime.replace(/-/, "/");
            }
            deferred.resolve(serviceTime);
        });
        return deferred.promise;
    }
    //获取头像
    function getheadPortrait() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.headParams, "get").then(function(data) {
            $scope.headPic = data.USERHEAD[0].PERPICURL == '' ? './editngCenter/app/images/user_icon.jpg' : data.USERHEAD[0].PERPICURL;
        });
    }
    //更换头像
    $scope.changeHeadPortrait = function(files, file, newFiles) {
        var imgType = ['jpg', 'jpeg', 'png', 'bmp', 'gif'],
            fileType = newFiles[0].name.substr(newFiles[0].name.lastIndexOf('.') + 1).toLowerCase();
        if (imgType.indexOf(fileType) < 0) {
            trsconfirm.alertType('格式不支持', '', 'warning', false);
            return;
        }
        Upload.upload({
            url: "/wcm/openapi/uploadImage",
            data: {
                file: newFiles[0]
            },
        }).then(function(resp) {
            $scope.headPic = resp.data.imgSrc;
            var params = {
                serviceid: 'mlf_extuser',
                methodname: 'saveUserHead',
                UserHead: [{
                    "appFile": resp.data.imgName,
                    "appDesc": resp.data.imgName,
                    "PERPICURL": resp.data.imgSrc,
                }],
            };
            params.UserHead = JSON.stringify(params.UserHead);
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function() {
                $rootScope.$emit('updateHeadPortrait');
            });
        }, function(resp) {}, function(evt) {});
    };
}]);
