/*
    Create by LiangYu 2015-12-4
*/
"use strict";
angular.module("getDraftModule", [])
    .controller("getDraftCtrl", ['$scope', '$modalInstance', 'params', 'trsHttpService', 'trsResponseHandle', "trsspliceString", "trsconfirm", "success", function($scope, $modalInstance, params, trsHttpService, trsResponseHandle, trsspliceString, trsconfirm, success) {
        initData();

        function initData() {
            $scope.params = {
                "serviceid": params.serviceid, //"mlf_appoper",
                "methodname": params.methodname, //"share",
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "post")
                .then(function(data) {
                    $scope.lists = trsResponseHandle.responseHandle(data);
                });
            $scope.listSelect = [];
        }
        $scope.isConfirm = function(list) {
            var MetaDataId = trsspliceString.spliceString($scope.listSelect, "METADATAID", ",");
            //var chnlDocIds = trsspliceString.spliceString($scope.listSelect,'RECID', ',');
            takeDraft(MetaDataId);

        };
        $scope.cancel = function() {
            $scope.$close();
        };
        $scope.listChoose = function(list) {
            // list.selected = true;
            if (list.selected !== true) {
                list.selected = true;
                $scope.listSelect.push(list);
            } else {
                toLeft(list);
            }
        };

        function toLeft(list) {
            if (list !== "" && list !== undefined && $scope.listSelect.indexOf(list) !== -1) {
                $scope.listSelect.splice($scope.listSelect.indexOf(list), 1);
                list.selected = false;
            }
            list = "";
        }

        function takeDraft(MetaDataId) {
            if (MetaDataId) {
                $scope.params = {
                    "serviceid": "mlf_myrelease",
                    "methodname": params.darftservice,
                    // "Opinion": item,
                    "ChnldocIds": trsspliceString.spliceString($scope.listSelect, "RECID", ","),
                    "MetaDataIds": MetaDataId

                };
                $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "post")
                    .then(function(data) {
                        trsconfirm.alertType("取稿成功", "", "success", false, function() {
                            success();
                        });
                        trsResponseHandle.responseHandle(data, false)
                            .then(function() {
                                $scope.listSelect = [];
                                // request($scope.params);
                            }, function() {});
                    }, function(data) {});
                $scope.$close();
            } else {
                trsconfirm.alertType("取稿失败", "请在列表中选择取回稿件", "error", false, function() {});
            }
        }

    }]);
