define(function (require) {
    var app = require('app');

/**
 * 微博账号运营状况
 * @param  {[type]} $scope         [description]
 * @param  {[type]} query)         {                                                 	var classList [description]
 * @param  {[type]} function(data) {		console.log(data);	})                                                        	$scope.getContent [description]
 * @param  {[type]} function(data) {			console.log(data);		})	}}] [description]
 * @return {[type]}                [description]
 */
 app.controller('wbsituationCtr', function($scope, utilClass, scmSituation){
 	//获取分类
	var classList = scmSituation.querySituation();
	classList.then(function(data) {
		var series = []//账号气泡数组
		var colors = ['#1fb8e4','#5c759d','#51d38d','#FF4040','#c4c9cd','#b27dff','#44b6ae','#ff871c','#4391e1','#FFFF00','#66CDAA'];
		var legend ={y: 'bottom',data: []};//,borderWidth:1,borderColor:'#e1e7ec'
		var x = 0 ;//坐标X轴
		var y = 0 ;//坐标Y轴
		var color = "";
		//循环取出账号分类
		if(!angular.isArray(data.data))return;
		for(var i = 0 ; i <data.data.length;i++){
			color = colors[i];//"#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6); 
			for (var j = 0 ; j<data.data[i].account.length ; j++) {
				x = Math.random()*1000;
				y = Math.random()*900;
				series.push({
					name: data.data[i].unitName,
					normalColor: color,
					type:'scatter',
					data: [
					 	{
				        	value : [x, y+100,data.data[i].account[j].score],
				       	 	name: data.data[i].account[j].name
				     	}
					] 
				}); 
			}
			legend.data.push({name:data.data[i].unitName,icon : 'rectangle',});
		}
		var grid={
			borderColor: '#e1e7ec', 
			borderWidth:  0,
			x:  40,
			y:  50,
			x2:  40,
			y2:  50
		};
		$scope.num = series.length;
		$scope.grid = grid;
		$scope.legend = legend;
		$scope.series = series;
	}, function(data) {
		console.log(data);
	})
 })

/**
 * 微博排行
 * @param  {[type]} $scope         [description]
 * @param  {[type]} query)         {                                                 	var classList [description]
 * @param  {[type]} function(data) {		console.log(data);	})                                                        	$scope.getContent [description]
 * @param  {[type]} function(data) {			console.log(data);		})	}}] [description]
 * @return {[type]}                [description]
 */
app.controller('wbseniorityCtr', function($scope, utilClass, scmSeniority) {

	//获取分类
	var classList = utilClass.queryClass();
	classList.then(function(data) {
		$scope.classs = data.result;
	}, function(data) {
		console.log(data);
	})

	//获取微博排行列表
	$scope.getContent = function(accountType) {

		var phList = scmSeniority.querySenioritys(accountType);

		phList.then(function(data) {
			$scope.contents = data.data;
		}, function(data) {
			console.log(data);
		})
	}

	$scope.getContent();
})

/**
 * 集团账号列表查询
 * @param  {[type]} $scope                    [description]
 * @param  {[type]} jtwbAccountViewSer){	var jtwbAccounts  [description]
 * @param  {[type]} function(data){                                            console.log(data);	})} [description]
 * @return {[type]}                           [description]
 */
app.controller('wbjtUnitViewCtr', function($scope, wbjtUnitViewSer) {

	var jtwbAccounts = wbjtUnitViewSer.queryJtwbUnits();

	jtwbAccounts.then(function(data) {
		$scope.units = data.data;
	}, function(data) {
		console.log(data);
	})
})

/**
 * 最新微博
 * @param  {[type]} $scope         [description]
 * @param  {[type]} query)         {                                                 	var classList [description]
 * @param  {[type]} function(data) {		console.log(data);	})                                                        	$scope.getContent [description]
 * @param  {[type]} function(data) {			console.log(data);		})	}}] [description]
 * @return {[type]}                [description]
 */
app.controller('newWeiboCtr', function($scope, $state, newWeibo, utilClass) {

	//获取分类
	var classList = utilClass.queryClass();
	classList.then(function(data) {
		$scope.classs = data.result;
	}, function(data) {
		console.log(data);
	})

	//获取最新微博
	$scope.getContent = function(accountType) {
		$scope.zxAccountType = accountType;
		var phList = newWeibo.queryNewWeibos(accountType);
		phList.then(function(data) {
			$scope.contents = data.data;
		}, function(data) {
			console.log(data);
		})
	}

	$scope.getContent();
})

/**
 * 热点新闻
 * @param  {[type]} $scope         [description]
 * @param  {[type]} query)         {                                                 	var classList [description]
 * @param  {[type]} function(data) {		console.log(data);	})                                                        	$scope.getContent [description]
 * @param  {[type]} function(data) {			console.log(data);		})	}}] [description]
 * @return {[type]}                [description]
 */
app.controller('hotwbNewsCtr', function($scope, hotwbNews, utilClass) {

	//获取分类
	var classList = utilClass.queryClass();
	classList.then(function(data) {
		$scope.classs = data.result;
	}, function(data) {
		console.log(data);
	})

	//获取热点新闻
	$scope.getContent = function(accountType) {
		$scope.htAccountType = accountType;
		var hotNewsList = hotwbNews.queryHotnews(accountType);
		hotNewsList.then(function(data) {
			$scope.contents = data.data;
		}, function(data) {
			console.log(data);
		})
	}

	$scope.getContent();
})

/**
 * 微博运营折线图表
 * @param  {[type]} $scope         [description]
 * @param  {[type]} query)         {                                                 	var classList [description]
 * @param  {[type]} function(data) {		console.log(data);	})                                                        	$scope.getContent [description]
 * @param  {[type]} function(data) {			console.log(data);		})	}}] [description]
 * @return {[type]}                [description]
 */
app.controller('weiboOperationCtr', function($scope, wboperation, wbcommentoperation, wblikesoperation, wbforwordoperation) {

	 //图表样式
	 
		$scope.grid = {backgroundColor: "#fff",x: 100,y: 42,x2: 100,y2: 105};
		$scope.symbol = ["emptyCircle"];

	//集团运营情况微博数（默认）
	$scope.getData = function() {

		var operationList = wboperation.queryOperations();
		operationList.then(function(data) {
			//获取数据
			$scope.xaxis = data.date;
			$scope.legend = {"data":data.units,"y":"bottom","padding": 15};

			//循环data添加type属性
			if(!angular.isArray(data.data))return;
			for (var i = 0; i < data.data.length; i++) {
				 data.data[i].type = "line";		
			}
			$scope.series = data.data;

		}, function(data) {
			console.log(data);
		})
	}
	$scope.getData(0);


	//评论数
	$scope.getcommentData = function() {

		var commentoperationList = wbcommentoperation.querycommentCount();
		commentoperationList.then(function(data) {
			//获取数据
			$scope.xaxis = data.date;
			$scope.legend = {"data":data.units,"y":"bottom","padding": 15};
			
			//循环data添加type属性
			if(!angular.isArray(data.data))return;
			for (var i = 0; i < data.data.length; i++) {
				 data.data[i].type = "line";		
			}
			$scope.series = data.data;
			
		}, function(data) {
			console.log(data);
		})
	}

	//点赞数
	$scope.getlikesData = function() {

		var likesoperationList = wblikesoperation.querylikesCount();
		likesoperationList.then(function(data) {
			//获取数据
			$scope.xaxis = data.date;
			$scope.legend = {"data":data.units,"y":"bottom","padding": 15};
			
			//循环data添加type属性
			if(!angular.isArray(data.data))return;
			for (var i = 0; i < data.data.length; i++) {
				 data.data[i].type = "line";		
			}
			$scope.series = data.data;
			
		}, function(data) {
			console.log(data);
		})
	}

	//转发数
	$scope.getforwordData = function() {

		var replyoperationList = wbforwordoperation.queryreplyCount();
		replyoperationList.then(function(data) {
			//获取数据
			$scope.xaxis = data.date;
			$scope.legend = {"data":data.units,"y":"bottom","padding": 15};
			
			//循环data添加type属性
			if(!angular.isArray(data.data))return;
			for (var i = 0; i < data.data.length; i++) {
				 data.data[i].type = "line";		
			}
			$scope.series = data.data;
		}, function(data) {
			console.log(data);
		})
	}
})

})