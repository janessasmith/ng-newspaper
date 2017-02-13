define(function(require) {
	var app = require('app');

	app.filter('unitFlr', function() {
		return function(unitId) {
			var unitName = '无';
			switch (parseInt(unitId)) {
				case 1:
					unitName = '重庆日报';
					break;
				case 2:
					unitName = '重庆晚报';
					break;
				case 3:
					unitName = '重庆晨报';
					break;
				case 4:
					unitName = '重庆商报';
					break;
				case 5:
					unitName = '华龙网';
					break;
				case 6:
					unitName = '新女报';
					break;
				case 7:
					unitName = '今日重庆';
					break;
				default:
			}
			return unitName;
		}
	});

	app.filter('classFlr', function() {
		return function(classId) {
			var className = '无';
			switch (parseInt(classId)) {
				case 1:
					className = '官微';
					break;
				case 2:
					className = '政务';
					break;
				case 3:
					className = '娱乐';
					break;
				case 4:
					className = '媒体';
					break;
				case 5:
					className = '体育';
					break;
				default:
			}
			return className;
		}
	});
});