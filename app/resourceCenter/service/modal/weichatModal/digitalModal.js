angular.module("digitalModule", []).controller('digitalCtrl', function($scope, $modalInstance, selectedSource, trsHttpService) {
	var selectedSource = selectedSource;
	initStatus();
	// 关闭
	$scope.close = function() {
		$modalInstance.dismiss();
	};
	$scope.requestDataPromise = requestDataPromise;
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
			nodeId: selectedSource.id,
			typeid: "zyzx",
			modelid: "szbAccount",
			serviceid: "szb",
			keyword: ""
		};
		requestDataPromise();
	}

	function requestDataPromise() {
		var params = angular.extend($scope.params, {
			pageNum: $scope.page.CURRPAGE,
			pageSize: $scope.page.PAGESIZE
		});
		trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
			$scope.page = data.summary_info;

			angular.forEach(data.content, function(n, i) {
				n.newsId = $scope.page.PAGESIZE * ($scope.page.CURRPAGE - 1) + i + 1;
			});
			$scope.items = data.content;
		}, function(msg) {
			console.log(msg);
		});
	}
});