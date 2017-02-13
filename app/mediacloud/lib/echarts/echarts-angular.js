define(function(require) {
	var app = require('app');

	app.directive('echartsLine', function($window) {
		return {
			scope: {
				id: '@',
				type: '@',
				width: '@',
				height: '@',
				head: '=',
				legend: '=',
				xaxis: '=',
				series: '=',
				color: '=',
				symbol: '=',
				grid: '='

			},
			restrict: 'AE',
			templateUrl: 'template/echarts.html',
			replace: true,
			link: function(scope, iElm, iAttrs, controller) {

				function aliasVar(fromName, toName) {
					scope.$watch(fromName, function(newVal) {
						if (typeof newVal === 'undefined') return;
						scope[toName] = newVal;
					});
				}

				aliasVar('series', 'echartsSeries');
				aliasVar('legend', 'echartsLegend');
				aliasVar('color', 'echartsColor');
				aliasVar('head', 'echartsHead');
				aliasVar('xaxis', 'echartsXaxis');
				aliasVar('symbol', 'echartsSymbol');
				aliasVar('grid', 'echartsGrid');

				scope.$watch('echartsSeries', function(newVal, oldVal) {
					if (!newVal || !newVal.length || (Array.isArray(newVal[0]) && !newVal[0].length)) return;
					scope.render();
				}, true);

				scope.render = function() {

					if (!angular.isUndefined(scope.width)) {
						document.getElementById(scope.id).style.width = scope.width + "px";
					}

					if (!angular.isUndefined(scope.height)) {
						document.getElementById(scope.id).style.height = scope.height + "px";
					}

					var myChart = echarts.init(document.getElementById(scope.id));

					var line = {
						stacked: function() {
							return {
								grid: scope.echartsGrid,
								tooltip: {
									trigger: 'axis'
								},
								legend: scope.echartsLegend,
								calculable: false,
								xAxis: [{
									type: 'category',
									boundaryGap: false,
									data: scope.echartsXaxis
								}],
								yAxis: [{
									type: 'value'
								}],
								series: scope.echartsSeries,
								symbolList: scope.echartsSymbol || ['emptyRectangle'],
								color: scope.echartsColor || []
							}
						},
						logarithmic: function() {
							return {
								grid: scope.echartsGrid,
								title: scope.echartsHead,
								tooltip: {
									trigger: "item",
									formatter: "{a} <br/>{b} : {c}"
								},
								legend: scope.echartsLegend,
								xAxis: [{
									type: "category",
									name: "x",
									splitLine: {
										show: false
									},
									data: scope.echartsXaxis
								}],
								yAxis: [{
									type: "log",
									name: "y"
								}],
								calculable: true,
								series: scope.echartsSeries,
								symbolList: scope.echartsSymbol || ['emptyRectangle'],
								color: scope.echartsColor || []
							}
						}
					}
					option = line[scope.type]();
					myChart.setOption(option);
				}
			}
		};
	});

	app.directive('echartsRadar', function($window) {
		return {
			scope: {
				id: '@',
				width: '@',
				height: '@',
				head: '=',
				indicator: '=',
				series: '=',
				legend: '=',
				color: '=',
				grid: '='
			},
			restrict: 'AE',
			templateUrl: 'template/echarts.html',
			replace: true,
			link: function(scope, iElm, iAttrs, controller) {

				function aliasVar(fromName, toName) {
					scope.$watch(fromName, function(newVal) {
						if (typeof newVal === 'undefined') return;
						scope[toName] = newVal;
					});
				}

				aliasVar('series', 'echartsSeries');
				aliasVar('legend', 'echartsLegend');
				aliasVar('color', 'echartsColor');
				aliasVar('head', 'echartsHead');
				aliasVar('indicator', 'echartsIndicator');
				aliasVar('grid', 'echartsGrid');

				scope.$watch('echartsSeries', function(newVal, oldVal) {
					if (!newVal || !newVal.length || (Array.isArray(newVal[0]) && !newVal[0].length)) return;
					scope.render();
				}, true);

				scope.render = function() {

					if (!angular.isUndefined(scope.width)) {
						document.getElementById(scope.id).style.width = scope.width + "px";
					}

					if (!angular.isUndefined(scope.height)) {
						document.getElementById(scope.id).style.height = scope.height + "px";
					}

					var myChart = echarts.init(document.getElementById(scope.id));

					option = {
						grid: scope.echartsGrid,
						title: scope.echartsHead,
						tooltip: {
							trigger: 'axis'
						},
						legend: scope.echartsLegend,
						polar: [{
							indicator: scope.echartsIndicator
						}],
						calculable: true,
						series: [{
							name: scope.echartsSeries[0].name || '',
							type: 'radar',
							data: scope.echartsSeries[0].data
						}],
						symbolList: ['emptyRectangle'],
						color: scope.echartsColor || []
					};

					myChart.setOption(option);
				}
			}
		}
	});

	app.directive('echartsPie', function($window) {
		return {
			scope: {
				id: '@',
				width: '@',
				height: '@',
				head: '=',
				legend: '=',
				series: '=',
				color: '=',
				grid: '='
			},
			restrict: 'AE',
			templateUrl: 'template/echarts.html',
			replace: true,
			link: function(scope, iElm, iAttrs, controller) {

				function aliasVar(fromName, toName) {
					scope.$watch(fromName, function(newVal) {
						if (typeof newVal === 'undefined') return;
						scope[toName] = newVal;
					});
				}

				aliasVar('series', 'echartsSeries');
				aliasVar('legend', 'echartsLegend');
				aliasVar('color', 'echartsColor');
				aliasVar('head', 'echartsHead');
				aliasVar('grid', 'echartsGrid');

				scope.$watch('echartsSeries', function(newVal, oldVal) {
					if (!newVal || !newVal.length || (Array.isArray(newVal[0]) && !newVal[0].length)) return;
					scope.render();
				}, true);

				scope.render = function() {

					if (!angular.isUndefined(scope.width)) {
						document.getElementById(scope.id).style.width = scope.width + "px";
					}

					if (!angular.isUndefined(scope.height)) {
						document.getElementById(scope.id).style.height = scope.height + "px";
					}

					var myChart = echarts.init(document.getElementById(scope.id));
					option = {
						grid: scope.echartsGrid,
						title: scope.echartsHead,
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b} : {c} ({d}%)"
						},
						legend: scope.echartsLegend,
						calculable: true,
						series: [{
							name: '面积模式',
							type: 'pie',
							radius: [30, 110],
							center: ['50%', 200],
							roseType: 'area',
							x: '50%',
							max: 40,
							sort: 'ascending',
							data: scope.echartsSeries
						}],
						color: scope.echartsColor || []
					};
					myChart.setOption(option);
				}
			}
		};
	});

	app.directive('echartsBar', function($window) {
		return {
			scope: {
				id: '@',
				width: '@',
				height: '@',
				head: '=',
				legend: '=',
				xaxis: '=',
				series: '=',
				color: '=',
				grid: '='
			},
			restrict: 'AE',
			templateUrl: 'template/echarts.html',
			replace: true,
			link: function(scope, iElm, iAttrs, controller) {

				function aliasVar(fromName, toName) {
					scope.$watch(fromName, function(newVal) {
						if (typeof newVal === 'undefined') return;
						scope[toName] = newVal;
					});
				}

				aliasVar('series', 'echartsSeries');
				aliasVar('legend', 'echartsLegend');
				aliasVar('color', 'echartsColor');
				aliasVar('xaxis', 'echartsXaxis');
				aliasVar('head', 'echartsHead');
				aliasVar('grid', 'echartsGrid');

				scope.$watch('echartsSeries', function(newVal, oldVal) {
					if (!newVal || !newVal.length || (Array.isArray(newVal[0]) && !newVal[0].length)) return;
					scope.render();
				}, true);

				scope.render = function() {

					if (!angular.isUndefined(scope.width)) {
						document.getElementById(scope.id).style.width = scope.width + "px";
					}

					if (!angular.isUndefined(scope.height)) {
						document.getElementById(scope.id).style.height = scope.height + "px";
					}

					var myChart = echarts.init(document.getElementById(scope.id));

					option = {
						grid: scope.echartsGrid,
						title: scope.echartsHead,
						tooltip: {
							trigger: 'axisjs'
						},
						legend: scope.echartsLegend,
						calculable: true,
						xAxis: [{
							type: 'category',
							data: scope.echartsXaxis
						}],
						yAxis: [{
							type: 'value'
						}],
						series: scope.echartsSeries,
						color: scope.echartsColor || []
					};

					myChart.setOption(option);
				}
			}
		};
	});

	app.directive('echartsScatter', function($window) {
		return {
			scope: {
				id: '@',
				width: '@',
				height: '@',
				grid: '=',
				legend: '=',
				xaxis: '=',
				yaxis: '=',
				series: '='
			},
			restrict: 'AE',
			templateUrl: 'template/echarts.html',
			replace: true,
			link: function(scope, iElm, iAttrs, controller) {

				function aliasVar(fromName, toName) {
					scope.$watch(fromName, function(newVal) {
						if (typeof newVal === 'undefined') return;
						scope[toName] = newVal;
					});
				}

				aliasVar('series', 'echartsSeries');
				aliasVar('legend', 'echartsLegend');
				aliasVar('xaxis', 'echartsXaxis');
				aliasVar('yaxis', 'echartsYaxis');
				aliasVar('grid', 'echartsGrid');

				scope.$watch('echartsSeries', function(newVal, oldVal) {
					if (!newVal || !newVal.length || (Array.isArray(newVal[0]) && !newVal[0].length)) return;
					scope.render();
				}, true);

				scope.render = function() {

					scope.seriesArray = [];
					for (var i = 0; i < scope.echartsSeries.length; i++) {
						scope.seriesArray.push({
							name: scope.echartsSeries[i].name || 'scatter1',
							type: 'scatter',
							symbolSize: function(value) { //标签大小
								return Math.round(value[2] / 2);
							},
							itemStyle: {
								normal: {
									color: scope.echartsSeries[i].normalColor || 'red', //标签颜色
									label: {
										show: true,
										formatter: function(params) { //标签文本值
											return params.name;
										},
										position: 'inside' //值显示位置
									}
								},
								emphasis: {
									color: scope.echartsSeries[i].emphasisColor || 'red', //标签颜色
								}
							},
							symbol: 'circle',
							data: scope.echartsSeries[i].data
						})
					}

					if (!angular.isUndefined(scope.width)) {
						document.getElementById(scope.id).style.width = scope.width + "px";
					}

					if (!angular.isUndefined(scope.height)) {
						document.getElementById(scope.id).style.height = scope.height + "px";
					}

					var myChart = echarts.init(document.getElementById(scope.id));

					option = {
						grid: scope.echartsGrid,
						// backgroundColor:'#fff',
						// borderColor: scope.gridData.borderColor||'#fff', 
						// borderWidth: scope.gridData.borderWidth || 1,
						// x: scope.gridData.x || 20,
						// y: scope.gridData.y || 20,
						// x2: scope.gridData.x2 || 10,
						// y2: scope.gridData.y2 || 50		
						tooltip: {
							trigger: 'axis',
							showDelay: 0,
							axisPointer: { //坐标轴指示器
								show: false,
								type: 'none',
								lineStyle: {
									type: 'dashed',
									width: 1
								}
							},
							formatter: '{b}', //格式化提示消息
							textStyle: {
								color: '#fff' //文本样式
							}
						},
						legend: scope.echartsLegend,
						xAxis: [{
							type: 'value',
							splitNumber: 4,
							scale: true,
							max: scope.echartsXaxis || 900, //设置横坐标长度
							axisLabel: true,
							splitLine: true,
							axisLine: true
						}],
						yAxis: [{
							type: 'value',
							splitNumber: 4,
							scale: true,
							max: scope.echartsYaxis || 900, //设置纵坐标长度
							axisLabel: true,
							splitLine: true,
							axisLine: true
						}],
						series: scope.seriesArray
					}
					myChart.setOption(option);

				}
			}
		};
	});

	app.directive('echartsGauges', function($window) {
		return {
			scope: {
				id: '@'
			},
			restrict: 'AE',
			templateUrl: 'template/echarts.html',
			replace: true,
			link: function(scope, iElm, iAttrs, controller) {
				scope.$watch(function() {
					return angular.element($window)[0].innerWidth;
				}, function(a, b) {
					scope.render();
				});

				scope.render = function() {

					if (!angular.isUndefined(scope.width)) {
						document.getElementById(scope.id).style.width = scope.width + "px";
					}

					if (!angular.isUndefined(scope.height)) {
						document.getElementById(scope.id).style.height = scope.height + "px";
					}

					var myChart = echarts.init(document.getElementById(scope.id));

					option = {
						tooltip: {
							formatter: "{a} <br/>{b} : {c}%"
						},
						series: [{
							name: '业务指标',
							type: 'gauge',
							detail: {
								formatter: '{value}%'
							},
							data: [{
								value: 50,
								name: '完成率'
							}]
						}]
					};

					//clearInterval(timeTicket);
					timeTicket = setInterval(function() {
						option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
						myChart.setOption(option, true);
					}, 2000);

					myChart.setOption(option);
				}
			}
		};
	});

	app.run(["$templateCache", function($templateCache) {
		$templateCache.put("template/echarts.html",
			"<div id=\"{{id}}\" a=\"a\" style=\"height:600px;width:900px;\" ></div>");
	}]);

});