'use strict';
angular.module('newspaperRetractDraftModule', []).
controller('newspaperRetractCtrl', ['$scope', "$modalInstance", function($scope, $modalInstance) {
    $scope.title = "撤稿";
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
}]);
