'use strict';
/**
 *  Module
 *  createBy   ly
 * Description
 */
angular.module('allocationManageMentModule', ['allocationManageMentRouterModule'])
    .controller('allocationManageMentCtrl', ['$scope', '$filter', '$modal', '$timeout', '$q', '$validation', '$stateParams', 'trsHttpService', 'jsonArrayToStringService', 'trsResponseHandle', 'trsconfirm', 'initAllocationDataService', 'initSingleSelecet', 'trsSelectItemByTreeService',
        function($scope, $filter, $modal, $timeout, $q, $validation, $stateParams, trsHttpService, jsonArrayToStringService, trsResponseHandle, trsconfirm, initAllocationDataService, initSingleSelecet, trsSelectItemByTreeService) {
            initdata();
            initStatus();
            //川报修改
            initAuthorizedBanmian();
            //初始化状态
            function initStatus() {
                $scope.selectedArray = [];
                $scope.isSelected = "";
                $scope.chooseImages = initAllocationDataService.chooseImages();
                $scope.ACTUALPICINFO = initAllocationDataService.chooseImages();
                $scope.ICONPICINFO = initAllocationDataService.chooseImages();
                $scope.list = initAllocationDataService.initAllocation();
                //川报修改
                $scope.cbList = initAllocationDataService.initCbData();
                $scope.list = {
                    "ISCREATEXIAOYANG": true,
                };
                $scope.selectedCheck = "";
                $scope.AllocationSelect = initAllocationDataService.initAllocationSelect();
            }


            //初始化数据 
            function initdata() {
                $scope.params = {
                    "serviceid": "mlf_paperset",
                    "methodname": "findPaperById",
                    "SiteId": $stateParams.paper
                };
                trsHttpService.httpServer("/wcm/mlfcenter.do",
                    $scope.params, "post").then(function(data) {
                    $scope.SITENAME = data.SITENAME;
                    $scope.SITEDESC = data.SITEDESC;
                    $scope.WEBHTTP = data.WEBHTTP;
                    $scope.DATAPATH = data.DATAPATH;
                    if (data.ZHUBANSET === "") {
                        $scope.list = initAllocationDataService.initAllocation();
                        $scope.selectdTimeDefault = angular.copy($scope.AllocationSelect[0]);
                    } else {
                        $scope.list = data.ZHUBANSET;
                        selectDropDown(data.ZHUBANSET.SPACENUMTYPE);
                    }
                });
            }
            //查询选择框
            function selectDropDown(typeid) {
                var json = initAllocationDataService.initAllocationSelect();
                var DefaultOBJ = {};
                for (var i in json) {
                    if (json[i].value == typeid) {
                        DefaultOBJ.name = json[i].name;
                    }
                }
                $scope.selectdTimeDefault = DefaultOBJ;
            }


            //单选
            $scope.selectDoc = function(params) {
                eval(params);
            };
            //小样单选缩进
            $scope.queryByTimeType = function() {
                $scope.list.SPACENUMTYPE = angular.copy($scope.selectdTimeDefault).value;
            };


            //图像质量选择
            $scope.selectGenre = function(chooseImage) {

                $scope.list.BRIEFPICINFO.QUALITY = chooseImage.value

            };
            //版面质量选择
            $scope.selectBM = function(genre) {

                $scope.list.ACTUALPICINFO.QUALITY = genre.value;
            };
            //版面小图标选择
            $scope.selectIcon = function(genre) {

                $scope.list.ICONPICINFO.QUALITY = genre.value;
            };


            $scope.checkbox = function(params) {
                var flag = false;
                angular.forEach($scope.selectedArray, function(data, index, array) {
                    if (params === 1) {
                        flag = true;
                    }
                });
                return flag;
            };
            //添加版面样式
            $scope.add_edit = function() {
                trsSelectItemByTreeService.getUser(function(data) {
                    $scope.list.EDITORS = [];
                    angular.forEach(data, function(data, index, array) {
                        $scope.list.EDITORS.push({
                            "ID": data.ID,
                            "NAME": data.USERNAME,
                        });
                    });
                });
            };
            //添加签样者
            $scope.add_sign = function() {
                trsSelectItemByTreeService.getUser(function(data) {
                    $scope.list.SIGNUSES = [];
                    angular.forEach(data, function(data, index, array) {
                        $scope.list.SIGNUSES.push({
                            "ID": data.ID,
                            "NAME": data.USERNAME,
                        });
                    });
                });
            };

            //保存
            //川报修改
            $scope.save = function() {
                saveAuthoriedBanmian().then(function(data) {
                    save();
                });
            };
            //删除
            $scope.remove_edit = function(item) {
                $scope.selected = item;
                $scope.list.EDITORS.splice($scope.list.EDITORS.indexOf($scope.selected), 1);
            };
            //删除
            $scope.remove_edits = function(item) {
                $scope.selected = item;
                $scope.list.SIGNUSES.splice($scope.list.SIGNUSES.indexOf($scope.selected), 1);
            };
            //刷新页面
            function freshParent(callback) {
                window.opener.location.reload();
                setTimeout(function() {
                    callback();
                }, 500);
            }

            //取消 退出页面
            $scope.cancel = function() {
                if ($scope.allocationForm.$dirty === true) {

                }
            };
            //保存
            function save() {
                var deferred = $q.defer();
                $validation.validate($scope.allocationForm).success(function() {
                    var vlist = angular.copy($scope.list);
                    //vlist = jsonArrayToStringService.jsonArrayToString(vlist);
                    vlist = JSON.stringify(vlist);
                    var params = {
                        "serviceid": "mlf_paperset",
                        "methodname": "saveZhuBanSet",
                        'ZhuBanSet': vlist,
                        'ObjectId': $stateParams.paper,
                        'SiteName': $scope.SITENAME,
                        'SiteDesc': $scope.SITEDESC,
                        'WebHttp ': $scope.WEBHTTP,
                        'DataPath': $scope.DATAPATH
                    };
                    trsHttpService.httpServer("/wcm/mlfcenter.do",
                        params, "post").then(function(data) {
                        data = trsResponseHandle.saveResponse(data, function() {
                            // $scope.list.METADATAID = data.METADATAID;
                            // $scope.list.CHNLDOCID = data.CHNLDOCID;
                            // $stateParams.chnldocid = $scope.list.CHNLDOCID;
                            // $stateParams.metadataid = $scope.list.METADATAID;
                            $stateParams.status = 0;
                            $scope.selectedArray = [{
                                'TITLE': $scope.list.TITLE,
                                'CHNLDOCID': $scope.list.CHNLDOCID,
                                'METADATAID': $scope.list.METADATAID
                            }];
                            deferred.resolve(data);
                        });
                        trsconfirm.alertType("保存成功", "", "success", false, function() {
                            initdata();
                            freshParent(function() {
                                window.location.reload();
                            });
                        });
                    });
                    return deferred.promise;
                }).error(function() {
                    trsconfirm.alertType("提交失败", "必填项未填写", "error", false, function() {});
                });
            }

            //川报修改
            function initAuthorizedBanmian() {
                var params = {
                    serviceid: "mlf_extpaperset",
                    methodname: "queryAuthorizedBanMian",
                    PaperId: $stateParams.paper
                };
                trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                    angular.forEach(data.DATA, function(value, key) {
                        if (value.ZHUBANSET == "[]") {
                            value.ZHUBANSET = [];
                        }
                        $scope.cbList.authorizedItems = data.DATA;
                    });
                });
            }

            //川报修改
            $scope.add_author = function(number) {
                trsSelectItemByTreeService.getUser(function(data) {
                    var zhubanset = $scope.cbList.authorizedItems[number].ZHUBANSET;
                    if (zhubanset === "") {
                        zhubanset = [];
                    }
                    angular.forEach(data, function(data, index, array) {
                        $scope.cbList.authorizedItems[number].ZHUBANSET.push({
                            "id": data.ID,
                            "name": data.USERNAME
                        });
                    });
                    $scope.cbList.authorizedItems[number].ZHUBANSET=$filter('unique')($scope.cbList.authorizedItems[number].ZHUBANSET,'id');
                });
            };

            //川报修改
            $scope.remove_author = function(item, number) {
                $scope.cbList.authorizedItems[number].ZHUBANSET.splice($scope.cbList.authorizedItems[number].ZHUBANSET.indexOf(item), 1);
            };

            //川报修改
            //保存授权版面
            function saveAuthoriedBanmian() {
                var arr = [];
                angular.forEach($scope.cbList.authorizedItems, function(value, key) {
                    arr.push({
                        "BANMIANID": parseInt(value.CHANNELID),
                        "ZHUBANSET": value.ZHUBANSET
                    });
                });
                var deferred = $q.defer();
                var params = {
                    serviceid: "mlf_extpaperset",
                    methodname: "saveBMZhuBanSet",
                    BMSet: JSON.stringify(arr)
                };
                trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                    deferred.resolve(data);
                }, function(data) {
                    trsconfirm.alertType("保存失败", data.message, "error", false, function() {});
                });
                return deferred.promise;
            }
        }
    ]);
