/**
 *  weiboCollectModule
 *
 * Description 
 * rebuild:SMG 2016-7-20
 */
"use strict";
angular.module('weiboCollectModule', []).
controller('weiboCollectCtrl', ['$scope', '$sce', '$stateParams', function($scope, $sce, $stateParams) {
    $scope.wbSrc = $sce.trustAsResourceUrl('/wcm/app/scm/microcontent/show_favorites_list.jsp?AccountId=' + $stateParams.accountid);
}]);
