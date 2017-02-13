/**
 *  weiboAttentionModule
 *
 * Description 
 * rebuild:SMG 2016-7-20
 */
"use strict";
angular.module('weiboAttentionModule', []).
controller('weiboAttentionCtrl', ['$scope', '$sce', '$stateParams', function($scope, $sce ,$stateParams) {
    $scope.wbSrc = $sce.trustAsResourceUrl('/wcm/app/scm/microcontent/attention_microblog_list.jsp?AccountId=' + $stateParams.accountid);
}]);
