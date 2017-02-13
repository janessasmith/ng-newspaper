/** 地区选择服务 */
angular.module('trsAreaSelectModule', []).directive('trsAreaSelect', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: "./resourceCenter/directive/areaSelect/areaselect.html",
		scope: {
			area: "=",
			selectAreaText: "=",
			callback: "&"
		},
		controller: function($scope, $timeout, resourceCenterService, trsspliceString) {
			initStatus();
			initData();
			/** [initStatus description:初始化数据] */
			function initStatus() {
				$scope.data = {
					areaLevel: [{
						dictName: "国家",
						level: "0",
						children: []
					}, {
						dictName: "省",
						level: "1",
						children: []
					}, {
						dictName: "市",
						level: "2",
						children: []
					}, {
						dictName: "县",
						level: "3",
						children: []
					}],
					areaList: []
				};
				$scope.status = {
					curArea: {},
					curAreaLevel: "",
					showPanel: false,
					areaText: ""
				};
				$scope.status.curAreaLevel = $scope.data.areaLevel[0];
				$scope.area = $scope.data.areaList;
			}

			function initData() {
				loadArea();
			};
			/** [isContained description] 判断是否存在 */
			function isContained(item) {
				var temp = false;
				angular.forEach($scope.data.areaList, function(value, key) {
					if (value.id == item.id) {
						temp = true;
						return;
					}
				});
				return temp;
			}
			/** 内容地域 */
			function loadArea() {
				resourceCenterService.getRetrievalRootList({
					"serviceid": "area"
				}).then(function(data) {
					$scope.data.area = data;
					$scope.data.areaLevel[0].children = data;
					$scope.data.areaLevel[0].cur = data[0];
				});
			};
			/** [loadSubArea 地域 子集] */
			function loadSubArea(item, level) {
				if (item) {
					$scope.status.curAreaLevel = $scope.data.areaLevel[level];
					$scope.data.areaLevel[level - 1].cur = item;
					resourceCenterService.getRetrievalChildren({
						"serviceid": "area",
						"parentId": item.id
					}).then(function(data) {
						$scope.data.area = data;
						$scope.data.areaLevel[level].children = data;
						$scope.data.areaLevel[level].cur = data[0];
					});
				} else {
					$scope.data.area = [];
				}
			};
			/** [clearAreaData description 清理数据] */
			function clearAreaData(level) {
				angular.forEach($scope.data.areaLevel, function(value, key) {
					if (key >= level && key >= 1) {
						value.children = [];
						value.cur = "";
					}
				});
			};
			/** [changeAreaLevel description:切换地域等级] */
			$scope.changeAreaLevel = function(item, level) {
				$scope.status.curAreaLevel = item;
				if (level == 0) {
					$scope.data.area = item.children || [];
				} else {
					var parent = $scope.data.areaLevel[parseInt(level) - 1].cur;
					if (item.children.length && parent) {
						if (item.children[0].id.indexOf(parent.id) > -1) {
							$scope.data.area = item.children || [];
						} else {
							loadSubArea(parent, level);
						}
					} else {
						loadSubArea(parent, level);
					}
				}
			};
			/** [loadSubArea description:加载子集] */
			$scope.loadSubArea = function(item, level) {
				$scope.data.areaLevel[level].cur = item;
			};
			/** [getCurArea description:获取当前地区] */
			$scope.getCurArea = function(item, event) {
				if (!isContained(item)) {
					$scope.data.areaList.push(item);
				}
				$scope.selectAreaText = trsspliceString.getArrayString($scope.data.areaList, "dictName", ";");
				$timeout(function() {
					$scope.status.showPanel = false;
				}, 0);
				return false;
			};
			/** [emptySelectArea description:清空选择的地区列表] */
			$scope.emptySelectArea = function() {
				$scope.data.areaList = [];
				$scope.selectAreaText = "";
			};
			/** [removeItem description] 移除选中的地区 */
			$scope.removeItem = function(index) {
				$scope.data.areaList.splice(index, 1);
				$scope.selectAreaText = trsspliceString.getArrayString($scope.data.areaList, "dictName", ";");
			}
		}
	}
});