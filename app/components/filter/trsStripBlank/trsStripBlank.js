/**
 * 
 */
angular.module('trsStripBlankModule', [])
	.filter("trsStripBlank", [function() {
		return function(str) {
			return str.replace(/(　| |&nbsp;)+/g, "");
		};
	}]);