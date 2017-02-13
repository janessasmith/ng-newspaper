"use strict";
angular.module('cbCustomLeftModule', [])
    .controller('cbCustomLeftCtrl', ['$scope','$location','$state', '$stateParams', function($scope,$location,$state, $stateParams) {
        initStatus();
        initData();

        function initStatus() {
            $scope.data = {
                items: [{
                    name: "全部稿件",
                    id: ""
                }, {
                    name: "新闻稿件",
                    id: "1"
                }, {
                    name: "图片稿件",
                    id: "2"
                }]
            };
            $scope.cbLeftCur = angular.isDefined($stateParams.type)?$scope.data.items[$stateParams.type].id:"";
        }

        function initData() {

        }

        $scope.changeMainLists = function(item) {
            $scope.cbLeftCur = item.id;
            $state.go("resourcectrl.custom.resource", {
                type: item.id
            });
        };
    }]);
