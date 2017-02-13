angular.module('websiteCloudNewFileModule', [])
    .controller("websiteCloudNewFileCtrl", ['$scope', "$modalInstance", '$validation', 'transmission', function($scope, $modalInstance, $validation, transmission) {
        initData();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $validation.validate($scope.typingForm).success(function() {
                $modalInstance.close($scope.content);
            });
        };

        function initData() {
            $scope.title = transmission.title;
            $scope.content = transmission.content;
            $scope.type = transmission.type;
        }
    }]);
