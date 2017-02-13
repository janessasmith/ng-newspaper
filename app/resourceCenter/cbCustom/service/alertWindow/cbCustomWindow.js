"use strict";
angular.module('cbCustomWindowModule', [])
    .controller('cbCustomWindowCtrl', ['$scope', '$modalInstance', 'trsconfirm', 'trsHttpService', 'transform', function($scope, $modalInstance, trsconfirm, trsHttpService, transform) {
        initStatus();
        initData();

        function initStatus() {
            $scope.data = {
                name: transform.MODALNAME || "",
                desc: transform.MODALDESC,
                modalid: transform.MODALID
            };
        }

        function initData() {

        }

        $scope.confirm = function() {
            var params = {
                serviceid: "mlf_extmodal",
                methodname: "saveZYZXModal",
                ModalName: $scope.data.name,
                ModalDesc: $scope.data.desc
            };
            params.ModalId = angular.isDefined(transform.MODALID) ? transform.MODALID : 0;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $modalInstance.close(data);
            });
        };

        $scope.delete = function() {
            trsconfirm.confirmModel("删除", "请确定是否删除", function() {
                var params = {
                    serviceid: "mlf_extmodal",
                    methodname: "delZYZXModal",
                    ModalId: $scope.data.modalid
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("删除成功！", "", "success", false, "");
                    $modalInstance.close(data);
                });
            });
        };

        $scope.cancel = function() {
            $modalInstance.close();
        };
    }]);
