'use strict';
angular.module('resourceExportModule', []).
controller('exportModalCtrl', function ($scope, $timeout) {
    $scope.cancel = function() {
        $scope.$close();
    };
});
