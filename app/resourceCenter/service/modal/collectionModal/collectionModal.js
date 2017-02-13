'use strict';
angular.module('resourceCollectModule', []).
controller('collectModalCtrl', function ($scope, $timeout) {
    $scope.cancel = function() {
        $scope.$close();
    };
});
