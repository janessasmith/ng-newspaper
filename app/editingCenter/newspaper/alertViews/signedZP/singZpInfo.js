/**
 * Author:CC
 *
 * Time:2016-06-15
 */
"use strict";
angular.module('editNewspapaerSignedZPInfoModule', [])
    .controller('editNewspapersignedZPInfoCtrl', ['$scope', '$state', '$stateParams', '$window', '$modalInstance', 'trsHttpService', 'trsspliceString', 'result', 'trsconfirm', function($scope, $state, $stateParams, $window, $modalInstance, trsHttpService, trsspliceString, result, trsconfirm) {
        initStatus();

        function initStatus() {
            $scope.items = result.reports;
            $scope.params = result.params;
            $scope.status = {
                sbgpreview: 3,
            };
            $scope.data = {
                selectedArray: [],
            };
        }
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $scope.params.IsPaiChong = false;
            if ($scope.items.length > 1) {
                $scope.params.SrcDocIds = [];
                for (var i = 0; i < $scope.data.selectedArray.length; i++) {
                    if ($scope.data.selectedArray[i].RESULT.DOC) {
                        $scope.params.SrcDocIds.push($scope.data.selectedArray[i].RESULT.DOC.METADATAID);
                    }
                }
                $scope.params.SrcDocIds = $scope.params.SrcDocIds.join(',');
            } else {
                $scope.params.SrcDocIds = $scope.items[0].RESULT.DOC.METADATAID;
            }
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                trsconfirm.alertType("签发照排成功", "", "success", false, function() {
                    $modalInstance.close("success");
                });
            });
        };
        /**
         * [selectDoc description]单选
         * @param  {[obj]} item [description]
         * @return {[null]}      [description]
         */
        $scope.selectDoc = function(item) {
            if ($scope.data.selectedArray.indexOf(item) < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
            }
        };
        /**
         * [newspaperPreview description] 报纸预览
         * @param  {[type]} item [description] 当前对象
         */
        $scope.newspaperPreview = function(item) {
            var editPath = 'newspaperNewsPreview';
            var editParams = {
                paperid: result.paperid,
                metadata: item.METADATAID,
                newspapertype: $scope.status.sbgpreview
            };
            var editUrl = $state.href(editPath, editParams);
            // selectedArrayCahe($scope.data.selectedArray);
            $window.open(editUrl);
        };
    }]);
