define(function(require) {
	var app = require('app');

	/*条件筛选高亮*/
	app.directive('descDir', function() {

		return {
			restrict: 'A',
			replace: true,
			link: function($scope, element, iAttrs, controller) {
				element.bind('click', function() {
					jQuery(this).addClass("list-px-cur");
					jQuery(this).siblings().removeClass("list-px-cur");
				})
			}
		};
	});
});