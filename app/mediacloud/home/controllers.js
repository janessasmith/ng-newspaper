"use strict";
define(function (require) {
    var app = require('app');
    require('jquery.mCustomScrollbar');

/**
 * 最新微信/微博列表
 * @param  {[type]} ){	} [description]
 * @return {[type]}        [description]
 */
app.controller('homeweixinListCtrl', function($scope,$window,$log,$uibModal,homeweixinListSer,homeweiboListSer,weinxinContentPreviewSer,localStorageService){
	$window.location.href=localStorageService.get('mediacloud')=='weixin'?'/mediacloud/#/wxaccount/list':'/mediacloud/#/wbaccount/list';
	localStorageService.remove('mediacloud');
	// console.log(localStorageService.get('mlfCachedUser'));
	// $scope.contents = null;
	// $scope.clType = 'wx';
	// $scope.getWxList = function(){
	// 	$scope.clType = 'wx';
	// 	var winxinList = homeweixinListSer.queryWinxinList();
	// 	winxinList.then(function(data){
	//          $scope.contents = data.data;
	// 	},function(data){
	// 	});
	// };
	// $scope.getWbList = function(){
	// 	$scope.clType = 'wb';
	// 	var winboList = homeweiboListSer.queryWinboList();
	// 	winboList.then(function(data){
	//          $scope.contents = data.data;
	// 	},function(data){
	// 	});
	// };
	// $scope.getWxList();
	// //2 微信内容预览
	// $scope.animationsEnabled = true;
	// //2.1 调用open打开弹出窗
	// $scope.open = function(size,wxId) {
	// 	if($scope.clType =='wx'){
	// 		var modalInstance = $uibModal.open({
	// 			animation: $scope.animationsEnabled,
	// 			templateUrl: 'home/tpls/weinxinContentPreview.html',
	// 			controller: 'ContentPreviewInstance',
	// 			size: size,
	// 			resolve: {
	// 				content: function() {
	// 					var weixinContent = weinxinContentPreviewSer.queryWeixinContent(wxId);
	// 					return weixinContent;
	// 				}
	// 			}
	// 		});
	// 	}	
	// };

	// $scope.toggleAnimation = function() {
	// 	$scope.animationsEnabled = !$scope.animationsEnabled;
	// };
});

/**
 * 微信账号列表
 * @param  {[type]} ){	} [description]
 * @return {[type]}        [description]
 */
app.controller('homeweixinAccountCtrl', function($scope,homeweixinAccountSer){
	$scope.wxAccounts = null;
	$scope.wxAccount = null;
	$scope.index_n = 0;
	function getWxAccounts(){
		var winxinAccounts =  homeweixinAccountSer.queryWinxinAccounts();
		winxinAccounts.then(function(data){
	        $scope.wxAccounts = data.result;
	        $scope.wxAccount = data.result[0];
		},function(data){
	        console.log(data);
		});
	}
	getWxAccounts();
	$scope.preAccount = function(){
		if($scope.index_n>0){
			$scope.index_n--;
		}else{
			$scope.index_n = $scope.wxAccounts.length-1;
		}
		$scope.wxAccount = $scope.wxAccounts[$scope.index_n];
	}
	$scope.nextAccount = function(){
		if($scope.index_n<$scope.wxAccounts.length-1){
			$scope.index_n++;
		}else{
			$scope.index_n = 0;
		}
		$scope.wxAccount = $scope.wxAccounts[$scope.index_n];
	}
});

/**
 * 最新微博列表
 * @param  {[type]} ){	} [description]
 * @return {[type]}        [description]
 */
// app.controller('homeweiboListCtrl', function($scope,homeweiboListSer){
// 	var winboList = homeweiboListSer.queryWinboList();
// 	winboList.then(function(data){
//          $scope.contents = data.data;
// 	},function(data){
//          console.log(data);
// 	})
// })

/**
 * 微博账号
 * @param  {[type]} ){	} [description]
 * @return {[type]}        [description]
 */
app.controller('homeweiboAccountCtrl', function($scope,homeweiboAccountSer){
	$scope.wbAccounts = null;
	$scope.wbAccount = null;
	$scope.index_n = 0;
	function getWxAccounts(){
		var winboAccounts = homeweiboAccountSer.queryWeiboAccounts();
		winboAccounts.then(function(data){
	        $scope.wbAccounts = data.result;
		    $scope.wbAccount = data.result[0];
		},function(data){
	         console.log(data);
		})
	}
	getWxAccounts();
	$scope.preAccount = function(){
		if($scope.index_n>0){
			$scope.index_n--;
		}else{
			$scope.index_n = $scope.wbAccounts.length-1;
		}
		$scope.wbAccount = $scope.wbAccounts[$scope.index_n];
	}
	$scope.nextAccount = function(){
		if($scope.index_n<$scope.wbAccounts.length-1){
			$scope.index_n++;
		}else{
			$scope.index_n = 0;
		}
		$scope.wbAccount = $scope.wbAccounts[$scope.index_n];
	}
})


/**
 * 微信内容预览
 * @param  {Array}  $scope)    {	$scope.items       [description]
 * @param  {[type]} function() {			$log.info('Modal dismissed     at: ' + new Date());		} [description]
 * @return {[type]}            [description]
 */
// app.controller('weinxinContentPreview', function($scope,$log,$uibModal,weinxinContentPreviewSer) {
    
   
// })

//实例化页面
app.controller('ContentPreviewInstance', function($rootScope,$location,$scope,$state,$modalInstance,content) {
     
    $scope.content = content; 

	$scope.ok = function() {
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});

});