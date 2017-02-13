/**
 *  weiboToBeCompiledCreatModule
 *
 * Description 
 * rebuild:SMG 2016-7-20
 */
"use strict";
angular.module('weiboToBeCompiledCreatModule', []).
controller('weiboToBeCompiledCreatCtrl', ['$scope', '$window', '$sce', '$stateParams', 'localStorageService',
    function($scope, $window, $sce, $stateParams, localStorageService) {
        var dataSrc = eval("(" + localStorage.getItem("weibo.microblogWindow") + ")");
        $scope.wbSrc = $sce.trustAsResourceUrl("/" + dataSrc.url);
        $scope.iHeight = 391;
        $window.addEventListener("storage", function(e) {
            var dataObj = eval("(" + e.newValue + ")");
            if (angular.isDefined(dataObj.height)) {
                $scope.iHeight = dataObj.height;
            }
        });
    }
]);
