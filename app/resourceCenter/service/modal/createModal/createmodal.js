angular.module("createGroupModule", []).controller("createGroupCtrl", ['$scope', '$state', '$modalInstance', 'resourceCenterService', 'hasCloseAlert', 'SweetAlert',
    function($scope, $state, $modalInstance, resourceCenterService, hasCloseAlert, SweetAlert) {

        //关闭窗口
        $scope.close = function() {
            $modalInstance.dismiss();
        };
        $scope.save = function() {
            resourceCenterService.getSubscribe('addGroup', {
                title: $scope.groupName
            }).then(function(data) {
                $modalInstance.close(data);
            }, function(err) {
                console.log(err);
            });
        };
    }
]);