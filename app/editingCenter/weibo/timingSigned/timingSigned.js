/**
 *  weiboTimingSignedModule
 *
 * Description 
 * rebuild:SMG 2016-7-20
 */
"use strict";
angular.module('weiboTimingSignedModule', []).
controller('weiboTimingSignedCtrl', ['$scope', '$sce', '$stateParams', function($scope, $sce, $stateParams) {
    $scope.wbSrc = $sce.trustAsResourceUrl('/wcm/app/scm/microcontent/all_microblog_list.jsp?AccountId=' + $stateParams.accountid + '&FlowStatus=30');
}]);
