define(function (require) {
    var app = require('app');

/**
 * 账号搜索
 * @param  {[type]} $state){	return {		restrict: 'A', 		replace: true,		link: function($scope, element, attributes, controller) {			jQuery(element).bind('click',function(){				var search [description]
 * @return {[type]}                  [description]
 */
app.directive('searchDirective',  function($state){
	return {
		restrict: 'A', 
		replace: true,
		link: function($scope, element, attributes, controller) {
			element.bind('click',function(){
				var search = attributes.searchDirective;
				$state.go("wbaccount.list",{Search:search},{
					reload: true
				});
				jQuery(this).prev().val('');
			})
		}
	};
});

/**
 * 消息提示
 * @param  {String} ){	return {				        restrict: 'E',	     template:'<uib-alert ng-repeat [description]
 * @return {[type]}            [description]
 */
app.directive('alertDirective', function(){
	return {
		// scope: {}, 
		 restrict: 'E',
	     template:'<uib-alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</uib-alert>',
		 replace: true,
		 transclude: true
	};
});

/**
 * 查询已发微博和粉丝数
 * @param  {[type]} $log                    [description]
 * @param  {[type]} trshttpServer){	return {		scope:                                         {			id:'@'		} [description]
 * @param  {[type]} restrict:               'E'                                                [description]
 * @param  {String} template:               '<div><p                                           class           [description]
 * @param  {[type]} replace:                true                                               [description]
 * @param  {Object} link:                   function(scope,                                    iElm,           iAttrs,       controller) {			var options [description]
 * @param  {[type]} function(data)          {				console.log(data);				$log.error(data);			} [description]
 * @return {[type]}                         [description]
 */
app.directive('accountFans', function($log,trshttpServer){
	return {
		scope: {
			id:'@'
		}, 
		restrict: 'E',
		template: '<div><p class="result_fans">粉丝：<span>{{RelateMicroUser.followersCount}}</span></p>'+
                  '<p class="result_wb">微博：<span>{{RelateMicroUser.microContentCount}}</span></p></div>',
		replace: true,
		link: function(scope, iElm, iAttrs, controller) {
			var options = {};
			options.method = 'get';
			var promise = trshttpServer.httpServer('/wcm/rbcenter.do', options, {
				serviceid: "wcm61_scmmicrouser",
				methodName: "findRelateMicroUserToJson",
				AccountId: scope.id 
			});
			promise.then(function(data) {
				scope.RelateMicroUser = data.result;
			}, function(data) {
				console.log(data);
				$log.error(data);
			})

		}
	};
});


app.directive('activateUnit', function() {
	return {
		restrict: 'A',
		replace: true,
		link: function(scope, iElm, iAttrs, controller) {
			$(iElm).click(function() {
				$(this).parent().siblings().children("span").css("color","");
				$(this).siblings().css("color", "");
				$(this).css("color", "red");
				scope.getUnitId($(this).attr("id"));
			})
		}
	};
});

app.directive('activateClass', function(){
	return {	
		 restrict: 'A', 
		 replace: true,
		 link: function(scope, iElm, iAttrs, controller) {
			$(iElm).click(function(){
				$(this).parent().siblings().children("span").css("color","");
				$(this).css("color","red");
				scope.getClassId($(this).attr("id"));
			})
		}
	};
});
});

