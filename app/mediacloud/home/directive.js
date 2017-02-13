define(function(require) {
	var app = require('app');

	app.directive('scroll', function() {
		return {
			scope: {},
			restrict: 'A',
			replace: true,
			link: function($scope, iElm, iAttrs, controller) {
				jQuery(iElm).mCustomScrollbar({
					scrollButtons: {
						enable: true
					}
				});
			}
		};
	});

	app.directive('addhtml', function() {
		  return {
			scope: {},	
	        restrict: 'C',
	        template: '<div class="wx-article-sp" id="wxetail"></div>',
	        replace: true,
	        link: function($scope, iElm, iAttrs, controller) {
					$("#wxetail").append($scope.$parent.content.content);
				}
       };
	});	

	app.directive('resize', function() {
		return {
			scope: {},
			restrict: 'A',
			replace: true,
			link: function($scope, iElm, iAttrs, controller) {
				var height = $(window).height();			
				$(".cb-home-container").height(height-61);
			}
		};
	});
});

