"use strict";
define(function (require) {
    var app = require('app');
    require('jquery.mCustomScrollbar');
    /**
	 * 用户头像
	 * @param  {[type]} ){	} [description]
	 * @return {[type]}        [description]
	 */
	app.controller('headPortraitCtrl', function($scope,headPortraitSer){
		var headPortrait = headPortraitSer.headPortrait();
		headPortrait.then(function(data){
			$scope.userInfo = data.queryMe[0];
			$scope.userName = data.queryMe[0].userName+' 欢迎您！ ';
		},function(data){
		});
	});
});