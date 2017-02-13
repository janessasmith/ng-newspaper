angular.module('websiteCloudCreateFileModule', [])
    .controller("websiteCloudCreateFileCtrl", ['$scope', "$modalInstance", '$validation', function($scope, $modalInstance, $validation) {
        initStatus();
        //初始化状态
        function initStatus() {
            $scope.status = {
                typeOption: [{
                    'name': "html",
                    'value': '.html',
                }, {
                    'name': "shtml",
                    'value': '.shtml',
                }, {
                    'name': "js",
                    'value': '.js',
                }, {
                    'name': "css",
                    'value': '.css',
                }],
                content: "",
            };
            $scope.status.selectedType = $scope.status.typeOption[0];
        }
        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        //确定
        $scope.confirm = function() {
            $validation.validate($scope.createFileForm).success(function() {
                $modalInstance.close($scope.status.content + $scope.status.selectedType.value);
            });
        };
    }]);
