define(function (require) {
    var app = require('app');
/**
 * 微博账号详情
 * @param  {[type]} $scope         [description]
 * @param  {[type]} accountqy)     {					var                   accountList   [description]
 * @param  {[type]} function(data) {		console.log(data);	})} [description]
 * @return {[type]}                [description]
 */
app.controller('wbAccountCtrl', function($scope,$stateParams,wbAccountDetails) {		
		
	var accountList = wbAccountDetails.queryaccount($stateParams.accountId);
	accountList.then(function(data) {
		$scope.account = data;
		}, function(data) {
		console.log(data);
	})
})

/**
 * 综合评分
 * @param  {[type]} $scope            [description]
 * @param  {[type]} $stateParams      [description]
 * @param  {[type]} wbAccountDetails) {					var                   accountList   [description]
 * @param  {[type]} function(data)    {		console.log(data);	})} [description]
 * @return {[type]}                   [description]
 */
app.controller('scoreCtrl', function($scope,$stateParams,wbAccountScore) {		
		
	var accountscoreList = wbAccountScore.queryAccountScore($stateParams.accountId);
	accountscoreList.then(function(data) {
		$scope.countscore = data;
		}, function(data) {
		console.log(data);
	})
})

/**
 * 微博列表查询
 * @param  {[type]} $rootScope    [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $stateParams  [description]
 * @param  {[type]} $filter       [description]
 * @param  {Date}   weiboViewSer) {                var beforeDate [description]
 * @return {[type]}               [description]
 */
app.controller('weiboView', function($rootScope, $scope, $stateParams, $filter,weiboViewSer) {

     var beforeDate = new Date(new Date()-24*60*60*1000);//获取前一天数据
	/*日期控件*/
	$scope.today = function() {
		$scope.startTime = beforeDate;
		$scope.endTime = beforeDate;
		$scope.minStartTime = new Date(2010,1,1);
		$scope.maxStartTime = beforeDate;
		$scope.minEndTime = new Date(2010,1,1);
		$scope.maxEndTime = beforeDate;
	};
	$scope.today();

	$scope.$watch('endTime', function(newValue, oldValue, scope) {
        $scope.maxStartTime = $scope.endTime;
	});

	$scope.$watch('startTime', function(newValue, oldValue, scope) {
        $scope.minEndTime = $scope.startTime;
	});

	$scope.startOpen = function($event) {
		$scope.status.startOpened = true;
	};

	$scope.endOpen = function($event) {
		$scope.status.endOpened = true;
	};

	$scope.status = {
 		startOpened: false,
        endOpened: false
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'yyyy年MM月dd', 'shortDate'];
	$scope.format = $scope.formats[2];

	$scope.disabled = function(date, mode) {
		return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
	};

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.orderType = 1;

	//微博列表查询
	$scope.getcontent = function() {
        
		if (angular.isDate($scope.startTime)) {
			var startTime = $filter('date')($scope.startTime, "yyyy-MM-dd");
		}

		if (angular.isDate($scope.endTime)) {
			var endTime = $filter('date')($scope.endTime, "yyyy-MM-dd");
		}
       
		var params = {
			"accountId": encodeURIComponent($stateParams.accountId),
			"startTime": startTime,
			"endTime": endTime,
			"orderType": $scope.orderType
		}

		var weibolistUtList = weiboViewSer.queryweibolist(params);
		weibolistUtList.then(function(data) {
			$scope.weibolists = data.data;
		}, function(data) {
			console.log(data);
		})
	}

	$scope.getcontent();
})

/**
 * 评分分布雷达图
 * @param  {[type]} $scope         [description]
 * @param  {[type]} radarMap)      {		var                   radarMapList  [description]
 * @param  {[type]} function(data) {		console.log(data);	} [description]
 * @return {[type]}                [description]
 */
app.controller('wbradarMapCtrl', function($scope,$stateParams,wbradarMap) {
	
	var radarMapList = wbradarMap.queryradarMap($stateParams.accountId);
	radarMapList.then(function(data) {
       var radname = [];
       var radvalue = [];

       //复制值并返还给name、value
       
        if(!angular.isArray(data.name))return;
		for(var i=0;i<3;i++){	
				data.name.push(data.name[i]); 
				data.value.push(data.value[i]);			
		}
		
		//赋值两个数组
		for(var j=0;j<data.name.length;j++){
			radname.push(data.name[j]);
			radvalue.push(data.value[j]);
		}
		//拼装数据
 		indicator = [{text:radname[0]},{text:radname[1]},{text:radname[2]},{text:radname[3]},
 			{text:radname[4]},{text:radname[5]}],
 		series = [{
 			data:[{
					value:radvalue,
					name:"评分分布"
 			}]
 		}]
 		
 		$scope.indicator = indicator;
		$scope.series = series;
		$scope.color = ["#2EC6C7"];
	}, function(data) {
		console.log(data);
	})
})

/**
 * 转发趋折线势图
 * @param  {[type]} $scope         [description]
 * @param  {[type]} radarMap)      {		var                   radarMapList  [description]
 * @param  {[type]} function(data) {		console.log(data);	} [description]
 * @return {[type]}                [description]
 */
app.controller('wbfowordlineCtrl', function($scope,$stateParams,wbforwordlinesMap) {
	
	var forwordlinesMapList = wbforwordlinesMap.queryforwordlinesMap($stateParams.accountId);
	forwordlinesMapList.then(function(data) {

		//图标样式
		$scope.grid = {backgroundColor: "#fff",x: 63,y: 55,x2:40,y2:53};
		$scope.symbol = ["emptyCircle"];
		$scope.color = ["red","blue"];

		//获取内容
		$scope.xaxis = data.date;
		$scope.legend = {"data":data.type,"x":"right","padding": 15};

		//循环data添加type属性
		if(!angular.isArray(data.data))return;
		for (var i = 0; i < data.data.length; i++) {
			 data.data[i].type = "line";		
		}
		$scope.series = data.data;

		}, function(data) {
		console.log(data);
	})
})

/**
 * 粉丝变化图
 * @param  {[type]} $scope         [description]
 * @param  {[type]} radarMap)      {		var                   radarMapList  [description]
 * @param  {[type]} function(data) {		console.log(data);	} [description]
 * @return {[type]}                [description]
 */
app.controller('wbfanslineCtrl', function($scope,$stateParams,wbfanslineMap) {
	
	var fanslineMapList = wbfanslineMap.queryfanslineMap($stateParams.accountId);
	fanslineMapList.then(function(data) {
		
		$scope.grid = {backgroundColor: "#fff",x: 63,y: 55,x2:40,y2:53};
		$scope.symbol = ["emptyCircle"];
		$scope.color = ["blue"];

		//获取内容
		$scope.xaxis = data.date;
		

		//循环data添加type属性
		if(!angular.isArray(data.data))return;
		for (var i = 0; i < data.data.length; i++) {
			 data.data[i].type = "line";		
		}
		$scope.series = data.data;
	}, function(data) {
		console.log(data);
	})
})

});