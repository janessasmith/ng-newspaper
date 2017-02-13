angular.module("weichatModule", []).controller('weichatCtrl', function($scope, $modalInstance, selectedSource, resourceCenterService) {
	var selectedSource = selectedSource;
	initStatus();
	// 关闭
	$scope.close = function() {
		$modalInstance.dismiss();
	};
	$scope.requestDataPromise = function() {
		$scope.page.CURRPAGE = 1;
		requestDataPromise();
	};
	// 选择公众号
	$scope.slectItem = function(item, index) {
		item.ischecked = !item.ischecked;
		if (item.ischecked) {
			$scope.selectedList.push(item);
		} else {
			$scope.selectedList.splice(index, 1);
		}
	};
	// 移除已选
	$scope.removeItem = function(item, index) {
		angular.forEach($scope.selectedList, function(n, i) {
			if (n == item) {
				n.ischecked = false;
			}
		});
		$scope.selectedList.splice(index, 1);
	};
	// 确定
	$scope.sendInfo = function() {
		$modalInstance.close($scope.selectedList);
	};
	// 分页
	$scope.pageChanged = function() {
		$scope.copyCurrPage = $scope.page.CURRPAGE;
		requestDataPromise();
	};

	/*跳转指定页面*/
	$scope.jumpToPage = function() {
		if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
			$scope.copyCurrPage = $scope.page.PAGECOUNT;
		}
		$scope.page.CURRPAGE = $scope.copyCurrPage;
		requestDataPromise();
	};

	function initStatus() {
		$scope.selectedList = [];
		$scope.page = {
			CURRPAGE: 1,
			PAGESIZE: 5
		};
		$scope.copyCurrPage = 1;
		$scope.params = {
			typeName: selectedSource.id,
			serviceId: selectedSource.id,
			keyword: ""
		};
		requestDataPromise();
	}

	function requestDataPromise() {
		var params = angular.extend($scope.params, {
			pageNum: $scope.page.CURRPAGE,
			pageSize: $scope.page.PAGESIZE
		});
		resourceCenterService.getWechatSearch(params).then(function(data) {
			if (data.result == "success") {
				$scope.page = data.summary_info;
				angular.forEach(data.content, function(n, i) {
					n.newsId = $scope.page.PAGESIZE * ($scope.page.CURRPAGE - 1) + i + 1;
					n.dictName = n.DICTNAME;
				});
				$scope.items = data.content;
			}
		}, function(msg) {
			console.log(msg);
		});
	}
});