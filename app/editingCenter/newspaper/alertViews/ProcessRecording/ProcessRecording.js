/**
 * Created by ma.rongqin 2016.3.4
 */
"use strict";
angular.module('editCenNewspaperProcessRecordingModule', [])
    .controller('editCenNewspaperProcessRecordingCtrl', ['$scope', "$modalInstance", "params", function($scope, $modalInstance, params) {
        initData();

        function initData() {
            $scope.items = params;
        }

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);
