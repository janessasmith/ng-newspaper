angular.module('trsSetColumnsModule', []).directive('trsSetColumns', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: "./resourceCenter/directive/setColumns/setColumns.html",
		scope: {
			columns: "=",
			callback: "&"
		},
		controller: function($scope) {
			$scope.showPanel = false;
		},
		link: function(scope, element, attrs, ctrl) {
			scope.togglePanel = function() {
				scope.showPanel = !scope.showPanel;
				if (!scope.showPanel) {
					scope.callback(); //选择完后关闭弹出层
				}
			}

			scope.toggleStatus = function(item) {
				item.isChecked = !item.isChecked;
			}
		}
	}
});