/** 搜索建议指令 */
angular.module('trsInputSuggestModule', []).directive('trsInputSuggest', function(resourceCenterService, $timeout, $state) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: "./resourceCenter/directive/trsInputSuggest/trsInputSuggest.html",
		scope: {
			"keyword": "=",
			"channelname": "@",
			"typename": "@",
			"callback": "&",
			"curel": "="
		},
		controller: function($scope) {
			/** 加载搜素建议数据 */
			this.loadSuggestData = function() {

				var suggestData = {
					area: [],
					zyzxfield: [],
					account: []
				};
				if ($scope.keyword) {
					var ajaxObj = resourceCenterService.getSuggestion({
						"channelName": $scope.channelname,
						"typeName": $scope.typename,
						"keyword": $scope.keyword,
						"serviceId": $scope.channelname
					}).then(function(data) {
						angular.forEach(data, function(value, key) {
							if (value.dicttype == "area") {
								suggestData.area.push(value);
							} else if (value.dicttype == "zyzxfield") {
								suggestData.zyzxfield.push(value);
							} else {
								suggestData.account.push(value);
							}
						});
						(suggestData.area.length || suggestData.zyzxfield.length || suggestData.account.length) && ($scope.suggestShow = true);
						$scope.suggestData = suggestData;
					});
				} else {
					$scope.suggestShow = false;
				}
			}
		},
		link: function(scope, element, attrs, ctrl) {
			var timer;
			scope.suggestShow = false;
			/** 搜索建议查询 */
			scope.getSuggestion = function() {
				timer && $timeout.cancel(timer);
				timer = $timeout(ctrl.loadSuggestData, 500);
			};
			/** 隐藏搜索框 */
			scope.hideSuggestion = function() {
				$timeout(function() {
					scope.suggestShow = false;
				}, 500);
			};
			scope.goSuggestion = function(item) {
				scope.suggestShow = false;
				scope.curel = item;
				$timeout(function() {
					scope.callback();
				}, 0);
			}
		}
	}
});