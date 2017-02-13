define(function (require) {
    var app = require('app');

/*账号单位*/
app.controller('unitCtrl', function($scope,utilUnit) {		
		
	var unitList = utilUnit.queryUnit();
	unitList.then(function(data) {
		$scope.units = data.result;
	}, function(data) {
		console.log(data);
	})
})

/*账号类别*/
app.controller('classCtrl',function($scope,utilClass) {		
		
	var classList = utilClass.queryClass();
	classList.then(function(data) {
		$scope.classs = data.result;
	}, function(data) {
		console.log(data);
	})
})


/**
 * 微博列表查询
 * @param  {[type]} $rootScope       [description]
 * @param  {[type]} $scope           [description]
 * @param  {[type]} $stateParams     [description]
 * @param  {[type]} weibonewlistSer) {	$rootScope.accountType [description]
 * @return {[type]}                  [description]
 */
app.controller('weiboNewlistCtrl', 
	function($rootScope, $scope, $stateParams, weibonewlistSer,$filter) {

	$scope.accountType = $stateParams.accountType; //分类
	$scope.unitName = $stateParams.unitName;  //单位
	$scope.accountId = $stateParams.accountId;//账号名称
	$scope.keyWord = $stateParams.keyWord; //搜索参数
	$scope.orderType = $stateParams.orderType; //1.按时间排序 2.按热度排序

    var beforeDate = new Date(new Date()-24*60*60*1000);//获取前一天数据
	/*日期控件*/
	$scope.today = function() {
		//初始化默认显示日期
		$scope.startTime = $stateParams.startTime || beforeDate;
		$scope.endTime = $stateParams.endTime || beforeDate;
		//初始化可选最小、最大时间
		$scope.minStartTime = new Date(2010,1,1);
		$scope.maxStartTime = beforeDate;
		$scope.minEndTime = new Date(2010,1,1);
		$scope.maxEndTime = beforeDate;

	};
	$scope.today();

	//控制时间显示规则
	$scope.$watch('endTime', function(newValue, oldValue, scope) {
        $scope.maxStartTime = $scope.endTime;
	});

	$scope.$watch('startTime', function(newValue, oldValue, scope) {
        $scope.minEndTime = $scope.startTime;
	});

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

	$scope.open1 = function($event) {
		$scope.status1.opened = true;
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

	$scope.status1 = {
		opened: false
	};

	//配置分页基本参数
	$scope.paginationConf = {
		pageIndex: 1,
		pageSize: 10
	};
    
    //上一页
	$scope.up = function() {
		if ($scope.paginationConf.pageIndex > 1) {
			$scope.paginationConf.pageIndex = $scope.paginationConf.pageIndex - 1;
			$scope.getWeibonewlist();
		}
	}
    
    //下一页
	$scope.next = function(pageCount) {
		if ($scope.paginationConf.pageIndex < pageCount) {
			$scope.paginationConf.pageIndex = $scope.paginationConf.pageIndex + 1;
			$scope.getWeibonewlist();
		}
	}

	//搜索条件
	$scope.getWeibonewlist = function() {

		if(angular.isDate($scope.startTime)){
           var startTime = $filter('date')($scope.startTime, "yyyy-MM-dd");
		}

		if(angular.isDate($scope.endTime)){
           var endTime = $filter('date')($scope.endTime, "yyyy-MM-dd");
		}
		
		var params = {
			"accountType": $scope.accountType,
			"unitName": $scope.unitName,
			"accountId": $scope.accountId,
			"startTime": startTime,
			"endTime": endTime,
			"keyWord": $scope.keyWord,
			"orderType": $scope.orderType,
			"pageIndex": $scope.paginationConf.pageIndex
		}

		var searchList = weibonewlistSer.queryWeibonewlist(params);
		
		searchList.then(function(data) {
			$scope.accounts = data.data;
			$scope.pageInfo = data.pageInfo;
		}, function(data) {
			console.log(data);
		})
	}
    
	$scope.getWeibonewlist();

    // 时间热度查询
	$scope.timeHotList = function(orderType){
        $scope.orderType = orderType;
        $scope.getWeibonewlist();
	}
})
})
