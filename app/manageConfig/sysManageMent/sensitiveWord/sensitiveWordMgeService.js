"use strict";
angular.module("sysMgrSensitiveWordCtrlModule", [])
    .controller('sensitiveBatchAddCtrl', ['$scope', "$filter", "$modalInstance", '$validation', '$timeout', 'initManageConSelectedService', 'trsconfirm', function($scope, $filter, $modalInstance, $validation, $timeout, initManageConSelectedService, trsconfirm) {
        initData();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $validation.validate($scope.websiteSensitiveBatchAddForm).success(function() {
                var sensitiveObj = {
                    'sensitiveArray': $scope.sensitiveArray,
                    'sensitiveLevel': $scope.sensitiveLevel
                };
                $modalInstance.close(sensitiveObj);
            });
        };

        function initData() {
            //初始化敏感级别
            $scope.sensitiveLevelJsons = initManageConSelectedService.websiteSensitiveLevel();
            $scope.sensitiveLevel = angular.copy($scope.sensitiveLevelJsons[0]);
        }
    }])
    .controller('sensitiveAddCtrl', ['$scope', "$modalInstance", '$validation', '$timeout', 'initManageConSelectedService', function($scope, $modalInstance, $validation, $timeout, initManageConSelectedService) {
        initData();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $timeout(function() {
            $scope.confirm = function() {
                $validation.validate($scope.websiteSensitiveAddForm).success(function() {
                    var sensitiveObj = {
                        'sensitiveWord': $scope.sensitiveWord,
                        'substituteWord': $scope.substituteWord,
                        'sensitiveLevel': $scope.sensitiveLevel
                    };
                    $modalInstance.close(sensitiveObj);
                });
            };
        });

        function initData() {
            //初始化敏感级别
            $scope.sensitiveLevelJsons = initManageConSelectedService.websiteSensitiveLevel();
            $scope.sensitiveLevel = angular.copy($scope.sensitiveLevelJsons[0]);
        }
    }])
    .controller('sensitiveModifyCtrl', ['$scope', "$modalInstance", '$validation', '$timeout', 'initManageConSelectedService', 'item', function($scope, $modalInstance, $validation, $timeout, initManageConSelectedService, item) {
        initData();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $timeout(function() {
            $scope.confirm = function() {
                $validation.validate($scope.websiteSensitiveModifyForm).success(function() {
                    var sensitiveObj = {
                        'sensitiveWord': $scope.sensitiveWord,
                        'substituteWord': $scope.substituteWord,
                        'sensitiveLevel': $scope.sensitiveLevel
                    };
                    $modalInstance.close(sensitiveObj);
                });
            };
        });

        function initData() {
            //初始化敏感级别
            $scope.sensitiveLevelJsons = initManageConSelectedService.websiteSensitiveLevel();
            $scope.sensitiveLevel = angular.copy($scope.sensitiveLevelJsons[item.SENSITIVELEVELDESC == "一般" ? 0 : 1]);
            $scope.sensitiveWord = item.SENSITIVEWORDS;
            $scope.substituteWord = item.SUBSTITUTEWORDS;
        }
    }])
    .controller('sensitiveImportCtrl', ['$scope', "$filter", "$modalInstance", 'Upload', "trsconfirm", function($scope, $filter, $modalInstance, Upload, trsconfirm) {
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $scope.upload($scope.file);
        };
        $scope.chooseFile = function() {
            // console.log($scope.file);
        };
        $scope.upload = function(file) {
            var fileType = $filter('endsWith')(file.name, '.xls');
            if (fileType) {
                Upload.upload({
                    url: '/wcm/openapi/uploadImage',
                    data: {
                        file: file
                    }
                }).then(function(resp) {
                    var params = {
                        "name": resp.data.imgName
                    };
                    $modalInstance.close(params);
                }, function(resp) {});
            } else {
                trsconfirm.alertType('文件格式错误', "请选择以.xls结尾的文件", "error", false);
            }

        };
    }]);
