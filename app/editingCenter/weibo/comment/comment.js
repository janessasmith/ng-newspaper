/**
 *  weiboCommentModule
 *
 * Description 
 * rebuild:SMG 2016-7-20
 */
"use strict";
angular.module('weiboCommentModule', []).
controller('weiboCommentCtrl', ['$scope', '$sce', '$stateParams', function($scope, $sce, $stateParams) {
    var comeType = "&ComeType=";
    comeType += $stateParams.sdtype === 'true' ? '1' : '2'; 
    $scope.wbSrc = $sce.trustAsResourceUrl('/wcm/app/scm/microcontent/show_comment_list.jsp?SCMGroupId=0&AccountId=' + $stateParams.accountid + comeType);
}]);
