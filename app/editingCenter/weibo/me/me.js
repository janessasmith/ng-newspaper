/**
 *  weiboMeModule
 *
 * Description 
 * rebuild:SMG 2016-7-20
 */
"use strict";
angular.module('weiboMeModule', []).
controller('weiboMeCtrl', ['$scope', '$sce', '$stateParams', function ($scope, $sce, $stateParams) {
	var type = "&Type=";
    type += $stateParams.atwotype === 'true' ? '1' : '2'; 
    $scope.wbSrc = $sce.trustAsResourceUrl('/wcm/app/scm/microcontent/show_at_list.jsp?AccountId=' + $stateParams.accountid + type);
}]);