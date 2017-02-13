angular.module('util.trsTDCheckModule', [])


.directive('tdCheck', [function() {

	return {
		restrict: 'C',
		link: function($scope, $element, $attrs) {
			$element.click(function() {
				//处理TD列的checkbox选中
				$element.find('trs-checkbox label').click();
			});
		}
	}
}]);