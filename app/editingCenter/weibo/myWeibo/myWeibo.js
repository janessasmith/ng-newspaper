/**
 *  weiboMyWeiBoModule
 *
 * Description 
 * rebuild:SMG 2016-7-20
 */
"use strict";
angular.module('weiboMyWeiBoModule', []).
controller('weiboMyWeiBoCtrl', ['$scope', '$sce', '$stateParams', function ($scope, $sce, $stateParams) {
    $scope.wbSrc = $sce.trustAsResourceUrl('/wcm/app/scm/microcontent/single_microblog_list.jsp?AccountId=' + $stateParams.accountid);
}]);
