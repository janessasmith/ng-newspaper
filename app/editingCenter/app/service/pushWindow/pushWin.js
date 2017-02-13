"use strict";
angular.module('editAppPushWinModule', [])
    .controller('editAppPushWinCtrl', ['$scope', '$modalInstance', '$timeout', '$http', 'trsHttpService', 'item', 'pushTit', 'trsconfirm', function($scope, $modalInstance, $timeout, $http, trsHttpService, item, pushTit, trsconfirm) {
        initStatus();
        initData();

        function initStatus() {
            $scope.expiration = 86400;
            $scope.prod = 'prod';
        }

        function initData() {
            $scope.item = item;
        }
        /**
         * [close description] 关闭
         * @return {[type]} [description]
         */
        $scope.close = function() {
            $modalInstance.dismiss();
        };

        /**
         * [confirm description] 确定
         * @return {[type]} [description]
         */
        $scope.confirm = function() {
            var params = {
                "expiration_interval": $scope.expiration,
                // "prod": $scope.prod,
                "data": {
                    "alert": pushTit,
                    "title": $scope.item.TITLE,
                    "action": "com.avos.push.action",
                    "key": {
                        "docId": $scope.item.CHNLDOCID,
                        "docType": $scope.item.DOCTYPEID,
                        "clickType": 1,
                        "docDate": $scope.item.CRTIME,
                        "docTitle": $scope.item.TITLE,
                        "docContent": "",
                        "docImage": "",
                        "docUrl": ""
                    }
                }
            };
            $http({
                method: "POST",
                url: "https://leancloud.cn/1.1/push",
                data: JSON.stringify(params),
                headers: {
                    "X-LC-Id": "jPbaegow8uVUDUDw1XS7LCv0-gzGzoHsz",
                    "X-LC-Key": "vzCjtS1G4yz5GIOnWKhDFcJt",
                    "Content-Type": "application/json"
                }
            }).then(function(data) {
                $modalInstance.close();
            }, function(data) {
                $modalInstance.close();
                trsconfirm.alertType("推送失败", "", "error", false);
            });
            // trsHttpService.httpServer("https://leancloud.cn/1.1/push", params, "post").then(function(data) {
            //     console.log(data);
            // });
            // $modalInstance.close();
        };

        $scope.chooseExpiration = function(time) {
            if (time == 'day') {
                $scope.expiration = 86400;
            } else if (time == 'hour') {
                $scope.expiration = 3600;
            }
        };

        $scope.chooseEnv = function(type) {
            if (type == 'dev') {
                $scope.prod = 'dev';
            } else if (type == 'prod') {
                $scope.prod = 'prod';
            }
        };
    }]);
