"use strict";
/** iwo资源左侧 */
angular.module("resourceCenterIwoLeftModule", []).
controller("resourceCenterIwoLeftCtrl", [
	'$scope',
	'initComDataService',
	'resCtrModalService',
	'resourceCenterService',
	'$state',
	'$stateParams',
	'trsconfirm',
	'trsHttpService',
	'leftService',
	function($scope, initComDataService, resCtrModalService, resourceCenterService, $state, $stateParams, trsconfirm, trsHttpService, leftService) {
		var modalid = leftService.getParamValue('modalid');
		var nodeid = leftService.getParamValue('nodeid');
		initStatus();
		initData();
		/** [initStatus 初始化] */
		function initStatus() {
			$scope.curTpl = "tpl1";
			$scope.setUsual = true;
			$scope.basicParams = {
				typeid: "zyzx",
				serviceid: "subscript"
			}
		}
		/** [initData 初始化数据] */
		function initData() {
			queryMyCustoms(function(data) {
				$scope.customList = data && data.DATA;
				checkDefault();
			});
		}
		/** [checkDefault 判断是否有默认组] */
		function checkDefault() {
			resourceCenterService.getSubscribe('findGroupByUser').then(function(data) {
				if (data.result === 'success') {
					$scope.defaultId = data.content[0];
					loadGroup();
				}
			});
		}
		/** [loadGroup 加载分组] */
		function loadGroup() {
			resourceCenterService.getSubscribe('getGroupAndChildren').then(function(data) {
				if (data.result === 'success') {
					if (data.content.length) {
						if (!nodeid) {
							var curresourceGroup = data.content[0].resourceGroup[0];
							$scope.curdictNum = curresourceGroup && curresourceGroup.id;
							data.content[0].isOpen = true;
							$state.go("resourcectrl.iwo.resource", {
								nodeid: curresourceGroup && curresourceGroup.id,
								nodename: curresourceGroup && curresourceGroup.title
							});
						} else {
							$scope.curdictNum = nodeid;
							angular.forEach(data.content, function(value, key) {
								angular.forEach(value.resourceGroup, function(n, i) {
									if (n.id == nodeid) {
										value.isOpen = true;
										$state.go("resourcectrl.iwo.resource", {
											nodeid: n.id,
											nodename: n.title
										});
										return;
									}
								});
								if (value.isOpen) return;
							});
						}
					} else {
						$scope.curdictNum = data.content[0] && data.content[0].id;
					}

					$scope.groups = data.content;
					$scope.isdataLoaded = true;
				}
			});
		}
		/** [queryMyCustoms 查找已设置常用的] */
		function queryMyCustoms(callback) {
			resourceCenterService.queryMyCustoms(1).then(function(data) {
				typeof callback == "function" && callback(data);
			});
		}
		/** [checkCustom 判断是否常用] */
		function checkCustom(item) {
			angular.forEach($scope.customList, function(m, j) {
				if ((m.CUSTOMTYPE == "1") && (item.id == m.CUSTOMID)) {
					item.custom = true;
				}
			});
		};
		$scope.checkCustom = checkCustom;
		/** [getDraft 子节点切换] */
		$scope.getDraft = function(item, evt) {
			var rd = Math.random(1, 0) * 100;
			$scope.curdictNum = item.id;
			$state.go("resourcectrl.iwo.resource", {
				nodeid: item.id,
				nodename: item.title,
				change: rd
			});
			evt.stopPropagation();
		};
		/** [toggleStatus 父节点切换状态] */
		$scope.toggleStatus = function(group) {
			$scope.curdictNum = group.id;
		};
		/** [setUsualItem 设置常用] */
		$scope.setUsualItem = function(item, temp, evt) {
			var ct = 1;
			if (temp) {
				resourceCenterService.cancleMyCustom({
					CustomId: item.id,
					CustomType: ct
				}).then(function(data) {
					item.custom = false;
				});
			} else {
				resourceCenterService.saveMyCustom({
					Custom: item.title,
					CustomId: item.id,
					CustomType: ct
				}).then(function(data) {
					if (data) {
						item.custom = true;
					}
				});
			}
			evt.stopPropagation();
		};
		/** [cancelUsualItem 取消常用设置] */
		// $scope.cancelUsualItem = function(item) {
		// 	resourceCenterService.cancleMyCustom({
		// 		CustomId: item.id,
		// 		CustomType: 1
		// 	}).then(function(data) {
		// 		item.custom = false;
		// 	});
		// };
	}
]);