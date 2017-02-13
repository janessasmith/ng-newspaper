"use strict";
angular.module('editctrBindWeiboModule', [])
    .controller('editctrBindWeiboCtrl', ['$scope', '$modalInstance', '$http', '$q', 'trsHttpService', 'trsconfirm', function($scope, $modalInstance, $http, $q, trsHttpService, trsconfirm) {
        initStatus();
        initData();

        function initStatus() {
            $scope.status = {
                isFirstStep: false,
                selectedUnit: 1,
                selectedClass: 1
            };
        }

        function initData() {
            initUnits();
            initClass();
        }

        /**
         * [initUnits description] 初始化所属单位
         * @return {[type]} [description]
         */
        function initUnits() {
            trsHttpService.httpServer("./editingCenter/weibo/data/unit.json", "", "post").then(function(data) {
                $scope.units = data.result;
            });
        }

        /**
         * [initClass description] 初始化所属类别
         * @return {[type]} [description]
         */
        function initClass() {
            trsHttpService.httpServer("./editingCenter/weibo/data/class.json", "", "post").then(function(data) {
                $scope.clss = data.result;
            });
        }

        /**
         * [close description] 取消/关闭
         * @return {[type]} [description]
         */
        $scope.close = function() {
            $modalInstance.dismiss();
        };

        /**
         * [next description] 下一步
         * @return {Function} [description]
         */
        $scope.next = function() {
            if ($scope.status.selectedUnit === "" || $scope.status.selectedClass === "") {
                trsconfirm.alertType("请选择所属单位和所属分类", "", "warning", false);
            } else {
                $scope.status.isFirstStep = false;
            }
        };

        $scope.chooseUnit = function(item) {
            $scope.status.selectedUnit = item.UnitId;
        };


        $scope.chooseClass = function(item) {
            $scope.status.selectedClass = item.ClassId;
        };
    }]);
