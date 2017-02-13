'use strict';
angular.module('productManageMentAppModule', [
    'productManageMentAppModify',
    'productManageMentAppDelete'
    ]).
controller('productManageMentAppController', ['$scope','$state','$modal', function($scope,$state,$modal) {
        $scope.modifyFn=function(){
          
           $modal.open({
                templateUrl: "./manageConfig/productManageMent/app/alertViews/modify/productManageMentModify_tpl.html",
                scope: $scope,
                windowClass: 'productManageMent-website-modify',
                backdrop: false,
                controller: "productManageMentAppModifyCtrl"
            });
     
       };

       $scope.delete=function(){
		  
		   $modal.open({
                templateUrl: "./manageConfig/productManageMent/app/alertViews/delete/productManageMentAppDelete_tpl.html",
                scope: $scope,
                windowClass: 'toBeCompiled-review-window',
                backdrop: false,
                controller: "productManageMentAppDeleteCtrl"
            });
	 
	   };
        
        $scope.btnClick = function(item){
            $scope.click_btn = item;
        }
}]);