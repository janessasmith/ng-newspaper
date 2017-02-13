angular.module('manageSysManageSMSGatewayConfigModule', [])
    .controller('manageSysManageSMSGatewayConfigCtrl', ['$scope', function($scope) {
        function initStatus() {
            $scope.status = {
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
            }
        }
    }]);
