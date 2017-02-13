/**
 * Author:XCL
 *
 * Time:2016-01-15
 */
"use strict";
angular.module('editNewspapaerSignedZPModule', [])
    .controller('editNewspapersignedZPCtrl', ['$scope', '$filter', '$modalInstance', 'trsHttpService', 'item', 'trsspliceString', 'trsconfirm', function($scope, $filter, $modalInstance, trsHttpService, item, trsspliceString, trsconfirm) {
        initStatus();

        function initStatus() {
            $scope.items = item;
            $scope.isRequeted = false;
        }
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        /**
         * [reponseFilter description]过滤返回的reports
         * @param  {[obj]} elm [description]各个返回的report
         * @return {[null]}     [description]
         */
        $scope.reportsFilter = function(elm) {
            if (angular.isDefined(elm)) {
                return angular.isDefined(elm.RESULT);
            }
        };
        $scope.confirm = function() {
            var params = {
                serviceid: "mlf_paper",
                methodname: "doQianFa",
                SrcDocIds: trsspliceString.spliceString(item,
                    'METADATAID', ','),
                IsPaiChong: true,
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("签发照排成功", "", "success", false, function() {
                    $modalInstance.close("success");
                });
            }, function(data) {
                var temp = $filter('pick')(data.REPORTS, $scope.reportsFilter);
                var result = {
                    reports: temp,
                    params: params
                };
                $modalInstance.close(result);
            });
        };
    }]);
