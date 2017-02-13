/**
 * Created by 马荣钦 on 2016/2/2.
 */
"use strict";
angular.module('editOutSendingModule', ['editOutSendingAddModule'])
    .controller("editOutSendingCtrl", ["$scope", "$modalInstance", "$modal", "trsHttpService", "trsconfirm", "params", "trsspliceString", function($scope, $modalInstance, $modal, trsHttpService, trsconfirm, params, trsspliceString) {
        initStatus();
        initData();

        function initStatus() {
            $scope.isEdit = false;
            $scope.deleteEmailArray = [];
            $scope.selectedArray = [];
            $scope.params = {
                serviceid: "mlf_maillist",
                methodname: "queryMailLists"
            }
        }

        function initData() {
            requestData();

        }

        function requestData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "post").then(function(data) {
                $scope.emailList = data;
                $scope.selectedArray = [];
                $scope.deleteEmailArray = [];
            });
        }
        //增加通讯人
        $scope.addNewEmail = function() {
            addNewEmail("", function(result) {
                var params = {
                    serviceid: "mlf_maillist",
                    methodname: "saveMailList",
                    Email: result.email,
                    EmailDesc: result.emailDesc
                };
                if (params.EmailDesc == "") {
                    delete params.EmailDesc;
                }
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    requestData();
                });
            });
        };
        //增加通讯人方法
        function addNewEmail(transData, successFn) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/service/outSending/addEmail/addEmail.html",
                windowClass: 'edit-outSending-add-window',
                backdrop: false,
                controller: "editOutSendingAddCtrl",
                resolve: {
                    params: function() {
                        return transData
                    }
                }
            });
            modalInstance.result.then(function(result) {
                successFn(result)
            });
        }
        //删除通讯人的叉叉
        $scope.deleteEmail = function(item) {
            $scope.emailList.splice($scope.emailList.indexOf(item), 1);
            $scope.deleteEmailArray.push(item);
        };

        //确认删除通讯人
        $scope.editConfirm = function() {
            if ($scope.deleteEmailArray != "") {
                trsconfirm.confirmModel("删除通讯人", "您确认删除？", function() {
                    var ids = trsspliceString.spliceString($scope.deleteEmailArray, 'MAILLISTID', ",");
                    var params = {
                        serviceid: "mlf_maillist",
                        methodname: "deleteMailList",
                        MailListIds: ids
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        $scope.isEdit = false;
                        requestData();
                    });
                });
            } else {
                $scope.quitEdit();
            }
        };
        //单选
        $scope.selectDoc = function(item) {
            if ($scope.selectedArray.indexOf(item) < 0) {
                $scope.selectedArray.push(item);
            } else {
                $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
            }
        };
        //关闭窗口
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.outSendingConfirm = function() {
            if ($scope.selectedArray.length > 0) {
                trsconfirm.confirmModel("外发稿件", "您确认外发？", function() {
                    $modalInstance.close({
                        selectItems: $scope.selectedArray
                    });
                });
            } else {
                $modalInstance.dismiss();
            }
        };
        //进入编辑
        $scope.enterEdit = function() {
            $scope.isEdit = true;
        };
        //退出编辑
        $scope.quitEdit = function() {
            $scope.isEdit = false;
            requestData();
        }
    }]);
