/*
    Create by fanglijuan 2016-05-10
*/
'use strict';
angular.module("userMngGroupMngCreateGroupModule", [])
    .controller("userMngGroupMngCreateGroupCtrl", ["$scope", "$timeout", "$q", "$validation", "trsHttpService", '$modalInstance', "groupManageMentService", "trsspliceString", "trsconfirm", "group", "parentid",
        function($scope, $timeout, $q, $validation, trsHttpService, $modalInstance, groupManageMentService, trsspliceString, trsconfirm, group, parentid) {
            initStatus();
            initData();
            /**
             * [initStatus description]初始化参数
             */
            function initStatus() {
                $scope.data = {
                    currGroup: angular.copy(group),
                    parentGroup: {},
                };
                $scope.status = {
                    isCreate: group ? false : true,
                    modalTitle: group ? "编辑组织" : "新建组织",
                };
            }
            /**
             * [initData description]初始化数据
             */
            function initData() {
                requestData();
            }
            /**
             * [requestData description] 请求父组织信息
             * @return {[type]} [description] 
             */
            function requestData() {
                var params = {
                    "serviceid": "mlf_groupmanagement",
                    "methodname": "getGroupDetail",
                    "GroupId": parentid
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.data.parentGroup = data;
                });
            }
            //确定
            $scope.confirm = function() {
                $validation.validate($scope.createGroupSubmitForm).success(function() {
                    saveGroup($scope.data.currGroup).then(function(data) {
                        trsconfirm.alertType('保存成功', "", "success", false, function() {
                            $modalInstance.close(data);
                        });
                    });
                }).error(function() {
                    trsconfirm.alertType('保存失败', "请检查填写项", "warning", false);
                });
            };
            //取消
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };

            function saveGroup(newGroup) {
                var defer = $q.defer();
                var params = {
                    serviceid: "mlf_groupmanagement",
                    methodname: "saveGroup",
                    groupid: group ? group.GROUPID : 0,
                    parentid: parentid,
                    gname: newGroup.GNAME,
                    gdesc: newGroup.GDESC,
                    email: newGroup.EMAIL,
                };
                params.isUnit = angular.isDefined(newGroup.ISUNIT) ? newGroup.ISUNIT : 0;
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    data = data.replace(/\"/g, "")
                        //todo
                    defer.resolve(data);
                });
                return defer.promise;
            }
            /**
             * [isUnitGroup description]选择是否为独立媒体
             * @return {Boolean} [description]
             */
            $scope.isUnitGroup = function() {
                $scope.data.currGroup.ISUNIT = $scope.data.currGroup.ISUNIT == 1 ? 0 : 1;
            };

        }
    ]);
