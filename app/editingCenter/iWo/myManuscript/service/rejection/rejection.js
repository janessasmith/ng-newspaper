/*2015-12-05*/
"use strict";
angular.module("iWoRejectionModule", []).
controller('iWoRejectionCtrl', ['$scope', '$modalInstance', 'selectedArray', 'trsHttpService', 'trsspliceString', 'trsconfirm', 'myManuscriptService', function($scope, $modalInstance, selectedArray, trsHttpService, trsspliceString, trsconfirm, myManuscriptService) {
    init();
    //关闭窗口
    $scope.switch = function(type) {
        $scope.type = type;
        if (type === "3") {
            myManuscriptService.draft("退稿", "", function() {}, "", "", function(data) {
                $scope.otherUserId = data.ID;
                $scope.otherGroupId = data.GROUPID;
                $scope.otherUsername = data.USERNAME;
            });
        } else {
            $scope.otherUsername = "";
        }
    };
    $scope.selectUser = function(user) {
        $scope.selectedUser = user;
    };
    $scope.confirm = function() {
        var params = {
            ChnlDocIds: trsspliceString.spliceString($scope.chooseArray, "CHNLDOCID", ","),
            MetaDataIds: trsspliceString.spliceString($scope.chooseArray, "METADATAID", ","),
            serviceid: "mlf_myrelease",
            methodname: "receiveRejectionMetaDatas",
            RejectionType: $scope.type
        };
        if ($scope.type === "1") {
            if (angular.isDefined($scope.selectedUser)) {
                params.UserId = $scope.selectedUser.ID;
                params.Opinion = $scope.broReason;

                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        $modalInstance.close("success");
                    }, function(data) {});
            } else {
                trsconfirm.alertType("请选择经手人", "请选择经手人", "warning", false, function() {});
            }

        } else {
            params.Opinion = $scope.reason;
            if ($scope.type === "3") {
                if (angular.isDefined($scope.otherUserId)) {
                    params.UserId = $scope.otherUserId;
                    params.GroupId = $scope.otherGroupId;
                } else {
                    trsconfirm.alertType("请选择其他人员", "请选择其他人员", "warning", false, function() {});
                    return;
                }
            }
            if ($scope.type === "4") {
                delete params.ChnlDocIds;
                delete params.RejectionType;
                params.methodname = "scrapReceivedRelease";
            }
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    $modalInstance.close("success");
                }, function(data) {
                    $modalInstance.close("error");
                });
        }
    };
    $scope.cancel = function() {
        $scope.$close();
    };

    function init() {
        var radioJson = [{
            "type": "1",
            "describe": "退回经手人"
        }, {
            "type": "2",
            "describe": "退回原稿库"
        }, {
            "type": "3",
            "describe": "退回其他"
        }];
        $scope.chooseArray = selectedArray;
        $scope.titleList = [];
        $scope.medias = [];
        var tite = selectedArray;
        for (var i = 0; i < selectedArray.length; i++) {
            if (i <= 2) {
                $scope.titleList.push(selectedArray[i].TITLE);
            } else {
                $scope.medias.push(selectedArray[i].TITLE);
            }

        }
        $scope.moreDrafts = function() {
            $scope.hideNewsList = !$scope.hideNewsList;
        };
        if ($scope.chooseArray.length === 1) {
            $scope.radioJson = radioJson;
            $scope.type = "1";
            var brokerageParams = {
                "serviceid": "mlf_appfgd",
                "methodname": "queryEditFlowGroupPath",
                "MetaViewDataId": $scope.chooseArray[0].METADATAID
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), brokerageParams, "post")
                .then(function(data) {
                    $scope.users = data;
                    $scope.selectedUser = $scope.users[0];
                }, function(data) {});
        } else {
            radioJson.splice(0, 1);
            $scope.radioJson = radioJson;
            $scope.type = "2";
        }
    }
}]);
