define(function (require) {
    var app = require('app');

/**
 *  导航菜单
 * @param  {[type]} $scope         [description]
 * @param  {[type]} utilUnit)      {					var                   unitList      [description]
 * @param  {[type]} function(data) {		console.log(data);	})} [description]
 * @return {[type]}                [description]
 */
app.controller('wxNavigationCtrl', function($scope,utilUnit,utilClass) {

    //单位查询		
	var unitList = utilUnit.queryUnit();
	unitList.then(function(data) {
		$scope.units = data.result;
	}, function(data) {
		console.log(data);
	})

    //分类查询
	var classList = utilClass.queryClass();
	classList.then(function(data) {
		$scope.classs = data.result;
	}, function(data) {
		console.log(data);
	})
})

/**
 * 微信排行列表
 * @param  {[type]} $scope){	} [description]
 * @return {[type]}              [description]
 */
app.controller('weixinRankListCtrl',  function($scope,$stateParams,weixinRankListSer,$filter){
	
    var beforeDate = new Date(new Date()-24*60*60*1000);//获取前一天数据
	/*日期控件*/
	$scope.today = function() {
		//初始化默认显示日期
		$scope.startTime = beforeDate;
		$scope.minStartTime = new Date(2010,1,1);
		$scope.maxStartTime = beforeDate;
	};
	$scope.today();

	//禁用周末选择
	$scope.disabled = function(date, mode) {
		return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
	};

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function($event) {
		$scope.status.opened = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	//设置日期显示格式
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'yyyy年MM月dd', 'shortDate'];
	$scope.format = $scope.formats[2];

	$scope.status = {
		opened: false
	};

	//配置分页基本参数
	$scope.paginationConf = {
		pageIndex: 1,
		pageSize: 10
	};

	$scope.up = function() {
		if ($scope.paginationConf.pageIndex >1) {
			$scope.paginationConf.pageIndex = $scope.paginationConf.pageIndex - 1;
			$scope.getcontent();
		}
	}

	$scope.next = function(pageCount){
         if($scope.paginationConf.pageIndex<pageCount){
               $scope.paginationConf.pageIndex = $scope.paginationConf.pageIndex+1;
               $scope.getcontent();
         }
	}

	// $scope.$watch('paginationConf.pageIndex', function(newValue, oldValue, scope) {
	// 	 $scope.getcontent();
	// });
    
    $scope.unitName = $stateParams.unitName;  //单位
	$scope.accountType = $stateParams.accountType; //分类
	
	//查询列表
	$scope.getcontent = function() {

		$scope.params = {
			"unitName": $scope.unitName,
			"accountType": $scope.accountType,
			"Time": $filter('date')($scope.startTime, "yyyy-MM-dd"),
			"pageIndex":$scope.paginationConf.pageIndex
		}

		var weixinRankList = weixinRankListSer.queryWeixinRankList($scope.params);

		weixinRankList.then(function(data) {
			$scope.contents = data.data;
			$scope.pageInfo = data.pageInfo;
		}, function(data) {
			console.log(data);
		})
	}

	$scope.getcontent();

})

})