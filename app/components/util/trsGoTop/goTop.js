'use strict'
angular.module("util.trsGoTopModule", []).directive("trsGoTop", function($timeout) {
	return {
		restrict: "E",
		replace: true,
		scope: {},
		template: "<div class='go-top' ng-show='isBottom' ng-click='goTop()'></div>",
		link: function(scope, element, attrs, controller) {
			scope.isBottom = false;

			angular.element(window).unbind("scroll").bind('scroll', function() {
				$timeout(function() {
					if (document.body.scrollTop >= 50) {
						scope.isBottom = true;
					} else {
						scope.isBottom = false;
					}
				}, 100);
			});

			scope.goTop = function() {
				document.body.scrollTop = 0;
				scope.isBottom = false;
			}
		}
	}
})