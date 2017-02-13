angular.module('trsNewsTooltipModule', [])
.directive("newsTooltipDir",["trsHttpService",function(trsHttpService){
	return {
		restrict:"EA",
		templateUrl:"./editingCenter/directive/app/newsTooltip/news_tooltip_tpl.html",
		link: function(scope, iElement, iAttrs){
			var params = {};
			trsHttpService.httpServer("/data/newsTooltip.json",params,"get").then(function(data){
				scope.infos = data;
			},function(data){})
		}
	}
}])