/** 申请资源 */
angular.module("resSubscribeModule", []).
controller("resSubscribeCtrl", [
	'$scope',
	'resCtrModalService',
	'resourceCenterService',
	'trsHttpService',
	'trsspliceString',
	'dateFilter',
	'$timeout',
	'SweetAlert',
	'$stateParams',
	'$state',
	'$window',
	function($scope, resCtrModalService, resourceCenterService, trsHttpService, trsspliceString, dateFilter, $timeout, SweetAlert, $stateParams, $state, $window) {
		initStatus();
		initData();
		/** [initStatus 初始化状态] */
		function initStatus() {
			$scope.data = {
				channelList: [{
					name: "网站栏目",
					ename: "wz"
				}, {
					name: "APP栏目",
					ename: "app"
				}, {
					name: "微信公众号",
					ename: "wx"
				}, {
					name: "集团成品库",
					ename: "jtcpg"
				}, {
					name: "数字报刊",
					ename: "szb"
				}, {
					name: "新华社线路",
					ename: "xhsg"
				}],
				items: [],
				list: [],
				selectedArray: [],
				editType: [{
					name: "订阅检索",
					default: "选择",
					active: "已选",
					type: 0
				}, {
					name: "编辑已选",
					default: "删除",
					active: "取消删除",
					type: 1
				}],
				suggestList: []
			};
			$scope.status = {
				curSubscribe: "",
				curEditTRype: "",
				showSuggest: false
			}

			$scope.curChannel = $stateParams.channelType ? {
				ename: $stateParams.channelType
			} : $scope.data.channelList[0];
			$scope.status.curEditTRype = $stateParams.channelType ? $scope.data.editType[1] : $scope.data.editType[0];
			$scope.page = {
				CURRPAGE: 1,
				PAGESIZE: 10,
			};
			$scope.basicParams = {
				typeid: "zyzx",
				serviceid: "iwo"
			};
			$scope.params = {
				channelName: $scope.curChannel.ename,
				modelId: "subscription",
				pageSize: $scope.page.PAGESIZE,
				pageNum: $scope.page.CURRPAGE,
				keyword: ""
			};
		}
		/** [initData 初始化数据] */
		function initData() {
			if ($stateParams.sourceId) {
				loadEditInfo($stateParams.sourceId);
			} else {
				requestData();
			}
		}
		/** [loadEditInfo description] 加载资源编辑信息*/
		function loadEditInfo(sourceId) {
			var params = {
				typeid: "zyzx",
				serviceid: "subscript",
				modelId: "findSourceById",
				sourceId: sourceId
			}
			trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
				angular.forEach(data, function(value, key) {
					value.btnTitle = $scope.status.curEditTRype.default;
				});
				$scope.data.items = $scope.data.selectedArray = data;
				if (data.length) {
					var docChannel = formatDocChannel(data[0]);
					requestList(docChannel, $scope.params.channelName, data[0].SECTION);
					$scope.status.curSubscribe = data[0];
				}
			});
		}
		/** [checkIsSubscribe description]检查是否已订阅 */
		function checkIsSubscribe(ids, callback) {
			var params = {
				typeid: "zyzx",
				serviceid: "subscript",
				modelId: "checkIsSubscript",
				hybaseIds: ids
			}
			trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
				typeof callback == "function" && callback(data);
			});
		}
		/** [requestData 请求数据] */
		function requestData() {
			var params = angular.extend($scope.basicParams, $scope.params);
			trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
				if (data.result == "success") {
					var ids = trsspliceString.getArrayString(data.content, "HYBASEID", ",");
					//检查是否已订阅
					checkIsSubscribe(ids, function(data2) {
						angular.forEach(data.content, function(value, key) {
							if (isContain($scope.data.selectedArray, value)) {
								value.btnTitle = $scope.status.curEditTRype.active;
							} else {
								value.btnTitle = $scope.status.curEditTRype.default;
							}
							angular.forEach(data2, function(n, i) {
								if (value.HYBASEID == n.HYBASEID) {
									value.isSubscribe = true;
								}
							});
						});
						$scope.data.items = data.content;
					});

					$scope.page = data.summary_info;
					//刷新列表
					if (data.content.length) {
						var docChannel = formatDocChannel(data.content[0]);
						requestList(docChannel, $scope.params.channelName, data.content[0].SECTION);
						$scope.status.curSubscribe = data.content[0];
					} else {
						$scope.data.list = [];
					}
				}
			});
		}
		/** [requestList 请求右侧列表] */
		function requestList(docChannel, channelName, section) {
			var params = {
				typeid: "zyzx",
				serviceid: "iwo",
				modelId: "previews",
				pageSize: 10,
				pageNum: 1,
				docChannel: docChannel,
				channelName: channelName,
				section: section || ""
			};
			trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
				if (data.result == "success") {
					$scope.data.list = data.content;
					$scope.basicParams.indexName = data.summary_info.indexName;
				} else {
					$scope.data.list = [];
				}
			});
		}
		/** [formatDocChannel 格式化docChannel] */
		function formatDocChannel(item) {
			var docChannel;
			if (item.CHANNELNAME == "xhsg") {
				docChannel = item.CHANNEL;
			} else if (item.CHANNELNAME == "szb") {
				docChannel = item.SOURCENAME;
			} else if (item.CHANNELNAME == "wx") {
				docChannel = item.CHANNEL;
			} else if (item.CHANNELNAME == "app" || item.CHANNELNAME == "wz") {
				docChannel = item.SOURCENAME + ":" + item.CHANNEL;
			}
			return docChannel;
		}
		/** [resetPageData 重置页面数据] */
		function resetPageData() {
			$scope.params.keyword = "";
			$scope.params.pageNum = 1;
			//$scope.data.selectedArray = [];
			$scope.status.curEditTRype = $scope.data.editType[0];
			$scope.status.showSuggest = false;
		}
		/** [isContain 判断是否包含] */
		function isContain(list, item, deleteItem) {
			var temp = false;
			angular.forEach(list, function(value, key) {
				if (value.ID == item.ID || value.HYBASEID == item.HYBASEID) {
					temp = true;
					return temp;
				}
			});
			return temp;
		}
		/** [deleteItem 删除选中] */
		function deleteItem(list, item) {
			angular.forEach(list, function(value, key) {
				if (value.ID == item.ID || value.HYBASEID == item.HYBASEID) {
					list.splice(key, 1);
				}
			});
		};
		/** [removeDeleteItems 移除被标记为删除的节点] */
		function removeDeleteItems(list) {
			var arr = [];
			angular.forEach(list, function(value, key) {
				if (value.delete != true) {
					arr.push(value);
				}
			});
			return arr;
		}
		/** [changeBtnName 编辑状态替换按钮名称] */
		function changeBtnName() {
			angular.forEach($scope.data.selectedArray, function(value, key) {
				if (value.btnTitle == $scope.data.editType[0].default) {
					value.btnTitle = $scope.data.editType[1].active;
				} else {
					value.btnTitle = $scope.data.editType[1].default;
				}
			});
			$scope.data.items = $scope.data.selectedArray;
			if (!$scope.data.selectedArray.length) return;
			$scope.requestList($scope.data.selectedArray[0]);
		};
		$scope.isContain = function(list, item) {
			return isContain(list, item);
		};
		/** [setCurChannel 设置当前渠道] */
		$scope.setCurChannel = function(item) {
			$scope.curChannel = item;
			$scope.params.channelName = item.ename;
			resetPageData();
			requestData();
		};
		/** [searchWithKeyword 搜索] */
		$scope.searchWithKeyword = function(evt) {
			$scope.params.pageNum = 1;
			if (evt) {
				if (evt.keyCode == 13) {
					$scope.status.showSuggest = false;
					requestData();
				}
			} else {
				requestData();
			}
		};
		/** [selectSubscribe 订阅] */
		$scope.selectSubscribe = function(item) {
			var arr = removeDeleteItems($scope.data.selectedArray);
			var obj = {
				sourceType: $scope.params.channelName,
				items: arr,
				sourceId: $stateParams.sourceId,
				parentId: $stateParams.parentId,
				title: $stateParams.title
			};
			// item.sourceType = $scope.params.channelName;
			if ($scope.data.selectedArray.length) {
				var modalInstance = resCtrModalService.subscribeModal(obj);
				modalInstance.result.then(function(result) {
					if (result) {
						$state.go("retrieval.subscribe", {
							parentId: "",
							sourceId: "",
							channelType: "",
							title: ""
						}, {
							reload: true
						});
					}
				}, function(result) {
					if (result) {
						$state.go("retrieval.subscribe", {
							parentId: "",
							sourceId: "",
							channelType: "",
							title: ""
						}, {
							reload: true
						});
					}
				});
			} else {
				SweetAlert.swal({
					title: '提示',
					text: "请选择订阅后再保存！",
					type: "warning",
					closeOnConfirm: true,
					cancelButtonText: "取消",
				});
			}
			// $scope.curSubscribe = item.ID;
		};
		/** [pageChanged 分页] */
		$scope.pageChanged = function() {
			$scope.params.pageNum = $scope.page.CURRPAGE;
			requestData();
		};
		/** [requestList 请求右侧列表] */
		$scope.requestList = function(item) {
			var docChannel = formatDocChannel(item);
			requestList(docChannel, $scope.params.channelName, item.SECTION);
			$scope.status.curSubscribe = item;
		};
		/**
		 * [selectAll description:全选]
		 */
		$scope.selectAll = function() {
			if (!$scope.data.selectedArray.length) {
				$scope.data.selectedArray = [].concat($scope.data.items);
			} else {
				angular.forEach($scope.data.items, function(item, key) {
					if (!isContain($scope.data.selectedArray, item)) {
						$scope.data.selectedArray.push(item);
					}
				});
			}
		};
		/** [deleteAll description:不选] */
		$scope.deleteAll = function() {
			$scope.data.selectedArray = [];
		};
		/**
		 * [selectDoc 单选]
		 * @param  {[type]} item [description：单个对象]
		 */
		$scope.selectDoc = function(item) {
			var index = $scope.data.selectedArray.indexOf(item);
			if (!isContain($scope.data.selectedArray, item, true)) {
				$scope.data.selectedArray.push(item);
			}
		};
		/** [changeEditType description:修改状态] */
		$scope.changeEditType = function(item) {
			$scope.status.curEditTRype = item;
			$scope.status.showSuggest = false;
			if (item.type == 0) {
				$scope.data.selectedArray = removeDeleteItems($scope.data.selectedArray);
				requestData();
			} else {
				changeBtnName();
			}
		};
		/** [changeBtnTitle description:修改按钮状态] */
		$scope.changeBtnTitle = function(item) {
			if (item.btnTitle == $scope.status.curEditTRype.default) {
				item.btnTitle = $scope.status.curEditTRype.active;
				var index = $scope.data.selectedArray.indexOf(item);
				if (!isContain($scope.data.selectedArray, item)) {
					$scope.data.selectedArray.push(item);
				}
			} else {
				item.btnTitle = $scope.status.curEditTRype.default;
				deleteItem($scope.data.selectedArray, item);
			}
		};
		$scope.changeBtnTitle2 = function(item) {
			if (item.btnTitle == $scope.status.curEditTRype.default) {
				item.delete = true;
				item.btnTitle = $scope.status.curEditTRype.active;
				// deleteItem($scope.data.selectedArray, item);
			} else {
				item.delete = false;
				item.btnTitle = $scope.status.curEditTRype.default;
				var index = $scope.data.selectedArray.indexOf(item);
				if (!isContain($scope.data.selectedArray, item)) {
					$scope.data.selectedArray.push(item);
				}
			}
		};
		/** ------------搜索建议 start-------------- */
		/** [showSuggest description]打开搜索建议面板 */
		$scope.showSuggest = function() {
			$scope.status.showSuggest = true;
			$scope.data.suggestList = [];
			if ($scope.params.keyword) {
				var arr = formatSuggestValues();
				getSuggest(arr[0], arr[1]);
			}
		};
		/** 搜索建议 */
		var timer;
		$scope.getSuggest = function() {
			timer && $timeout.cancel(timer);
			timer = $timeout(function() {
				var arr = formatSuggestValues();
				getSuggest(arr[0], arr[1]);
			}, 500);
		};
		/** [refreshList 选择建议刷新列表] */
		$scope.refreshList = function(item) {
			$scope.params.keyword = item;
			$scope.params.pageNum = 1;
			$scope.status.showSuggest = false;
			requestData();
		};
		/** [hideSuggest description:隐藏搜索建议] */
		$scope.hideSuggest = function() {
			$timeout(function() {
				$scope.status.showSuggest = false;
			}, 1000);
		};
		/** [formatSuggestValues 格式化搜索建议] */
		function formatSuggestValues() {
			var keywords = $scope.params.keyword.replace(/(^\s*)/g, "").split(" ");
			var fv = keywords.length && keywords[0];
			var sv = "";
			angular.forEach(keywords, function(value, key) {
				if (key > 0 && value) {
					sv = value;
					return;
				}
			});
			return [fv, sv];
		}
		/** [getSuggest description]搜索建议 */
		function getSuggest(fv, sv) {
			if (!fv) return;
			var params = {
				typeid: "zyzx",
				serviceid: "iwo",
				modelId: "subSuggest",
				channelName: $scope.params.channelName,
				Fkeyword: fv || "",
				Skeyword: sv || ""
			}
			trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
				$scope.data.suggestList = data;
			});
		}
		/** ------------搜索建议 end  -------------- */
	}
]);