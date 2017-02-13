/**
 *  weiboToBeCompiledModule
 *
 * Description 
 * rebuild:SMG 2016-7-20
 */

"use strict";
angular.module('weiboToBeCompiledModule', ['weiboToBeCompiledCreatModule']).
controller('weiboToBeCompiledCtrl', ['$scope', '$timeout', '$window', '$sce', '$stateParams', '$modal',
    function($scope, $timeout, $window, $sce, $stateParams, $modal) {
        $scope.wbSrc = $sce.trustAsResourceUrl('/wcm/app/scm/microcontent/all_microblog_list.jsp?AccountId=' + $stateParams.accountid + '&FlowStatus=40');
        $scope.modalInstance = "";
        $window.addEventListener("storage", function(e) {
            $timeout(function() {
                if (e.key == "weibo.microblogWindow") {
                    $scope.modalInstance = $modal.open({
                        templateUrl: "./editingCenter/weibo/toBeCompiled/weiboCreat/creat_tpl.html",
                        windowClass: 'weiboCreat',
                        backdrop: true,
                        controller: 'weiboToBeCompiledCreatCtrl'
                    });
                } else if (e.key == "weibo.close") {
                    $scope.modalInstance.dismiss();
                    $timeout(function() {
                        var ifm = $window.document.getElementById("ifm").contentWindow;
                        ifm.window.location.href = '/wcm/app/scm/microcontent/all_microblog_list.jsp?AccountId=' + $stateParams.accountid + '&FlowStatus=40';
                    }, 400);
                }
            }, 1);
        });
    }
]);
