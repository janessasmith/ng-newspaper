"use strict";
define(function (require) {
    var app = require('app');
/**
 * 账号数据查询
 * @param  {[type]} $scope         [description]
 * @param  {[type]} accountcx)     {					var                   accountList   [description]
 * @param  {[type]} function(data) {		console.log(data);	})} [description]
 * @return {[type]}                [description]
 */
app.controller('accountCtrl', function($scope,$stateParams,accountcx) {		
		
	var accountList = accountcx.queryaccountcx($stateParams.accountId);
	accountList.then(function(data) {
		$scope.account = data;
		}, function(data) {
	});
});

/**
 * 账号综合评分
 * @param  {[type]} $scope         [description]
 * @param  {[type]} accountcx)     {					var                   accountList   [description]
 * @param  {[type]} function(data) {		console.log(data);	})} [description]
 * @return {[type]}                [description]
 */
app.controller('countScoreCtrl', function($scope,$stateParams,wxAccountScore) {		
		
	var wxAccountScoreList = wxAccountScore.queryAccountScore($stateParams.accountId);
	wxAccountScoreList.then(function(data) {
		$scope.countScore = data;
		}, function(data) {
	});
});

/**
 * 账号粉丝变化情况
 * @param  {[type]} $scope         [description]
 * @param  {[type]} countcx)       {					var                   countcxList   [description]
 * @param  {[type]} function(data) {		console.log(data);	})} [description]
 * @return {[type]}                [description]
 */
app.controller('countCtrl',function($scope,$stateParams,countcx) {		
		
	var countcxList = countcx.querycountcx($stateParams.accountName);
	countcxList.then(function(data) {
			$scope.actionCounts = data.data;
		}, function(data) {
	});
});

/**
 * 账号阅读数对比
 * @param  {[type]} $scope         [description]
 * @param  {[type]} publiccount)   {					var                   publiccountList [description]
 * @param  {[type]} function(data) {		console.log(data);	})} [description]
 * @return {[type]}                [description]
 */
app.controller('publishNumCtrl',function($scope,$stateParams,publiccount) {		
		
	var publiccountList = publiccount.querypubliccount($stateParams.accountId);
	publiccountList.then(function(data) {
			$scope.publics = data;
		}, function(data) {
	});
});

/**
 * 账号阅读数，点赞数统计
 * @param  {[type]} $scope         [description]
 * @param  {[type]} totalcount)    {					var                   totalcountList [description]
 * @param  {[type]} function(data) {		console.log(data);	})} [description]
 * @return {[type]}                [description]
 */
app.controller('totalCtrl',function($scope,$stateParams,totalcount) {		
		
	var totalcountList = totalcount.querytotalcount($stateParams.accountId);
	totalcountList.then(function(data) {
			$scope.total = data;
		}, function(data) {
	});
});

/**
 * 微信列表查询
 * @param  {[type]} $scope         [description]
 * @param  {[type]} weixinlistCx   [description]
 * @param  {[type]} weixinweek     [description]
 * @param  {[type]} weixinnews)    {						var                                weixinlistCxList [description]
 * @param  {[type]} function(data) {			console.log(data);		})				$scope.hot [description]
 * @param  {[type]} function(data) {				console.log(data);			})		}                                             		$scope.newpb [description]
 * @return {[type]}                [description]
 */
app.controller('weixinListCtrl',function($rootScope, $scope, $stateParams, $filter,weixinlistSer) {
		
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
		};

		var weibolistUtList = weixinlistSer.queryweixinlist(params);
		weibolistUtList.then(function(data) {
			$scope.contents = data.data;
		}, function(data) {
		});
	};

	$scope.getcontent();	
});

/**
 * 评分分布雷达图
 * @param  {[type]} $scope         [description]
 * @param  {[type]} radarMap)      {		var                   radarMapList  [description]
 * @param  {[type]} function(data) {		console.log(data);	} [description]
 * @return {[type]}                [description]
 */
app.controller('radarMapCtrl', function($scope,$stateParams,radarMap) {
	
	var radarMapList = radarMap.queryradarMap($stateParams.accountId);
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
 		}];
 		
 		$scope.indicator = indicator;
		$scope.series = series;
		$scope.color = ["blue"];
	}, function(data) {
	});
});

/**
 * 账号发布趋势折线图
 * @param  {[type]} $scope         [description]
 */
app.controller('actionlineMapCtrl', function($scope,$stateParams,accountlineMap) {
	
	var accountlineMapList = accountlineMap.queryaccountlineMap($stateParams.accountId);
	accountlineMapList.then(function(data) {
		
		//图表样式
		$scope.grid = {backgroundColor: "#fff",x: 63,y: 55,x2:40,y2:53};
		$scope.symbol = ["emptyCircle"];
		$scope.color = ["blue"];

		//获取内容
		$scope.xaxis = data.date;
		$scope.legend = {"data":data.accounts};

		//循环data添加type属性
		if(!angular.isArray(data.data))return;
		for (var i = 0; i < data.data.length; i++) {
			 data.data[i].type = "line";		
		}
		$scope.series = data.data;
	}, function(data) {
	});
});

});