define(function (require) {
    var app = require('app');

/**
 * 组织机构控制器
 * @param  {[type]} $scope     [description]
 * @param  {[type]} commonReq) {	$scope.organizations [description]
 * @return {[type]}            [description]
 */
 app.controller('unitCtrl', ['$scope','utilUnit','dialogServer',function($scope,utilUnit,dialogServer) {		
		//获取单位组织机构
		var promise = utilUnit.queryUnit();
		promise.then(function(data) {
			if(angular.isArray(data.result)){
				$scope.units = data.result;
			}else{
				var open = dialogServer.dialogWarn();
				open('400',{"data":data});
			}	
		}, function(data) {
			var open = dialogServer.dialogWarn();
			open('400',{"data":data});
		})
	}
	])

/**
 * 分类控制器
 * @param  {[type]} $scope     [description]
 * @param  {[type]} commonReq) {	$scope.organizations [description]
 * @return {[type]}            [description]
 */
 app.controller('classCtrl',function($scope, trshttpServer, utilClass,$log,dialogServer) {
 	var classList = utilClass.queryClass();
 	classList.then(function(data) {
 		if(angular.isArray(data.result)){
 			$scope.classs = data.result;
 		}else{
 			var open = dialogServer.dialogWarn();
 			open('400',{"data":data});
 		}
 	}, function(data) {
 		var open = dialogServer.dialogWarn();
 		open('400',{"data":data});
 	})
 })

/**
 * 账号列表
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $stateParams) {                }] [description]
 * @return {[type]}               [description]
 */
app.controller('accountView',function($rootScope, $scope, $stateParams, trshttpServer, $log,dialogServer) {

		var options = {};
		options.method = 'get';
		$rootScope.UnitId = $stateParams.UnitId;
		$rootScope.ClassId = $stateParams.ClassId;
		$scope.Search = $stateParams.Search;

        //组装参数
		var parameters = {};
		if ($rootScope.UnitId) {
			parameters.UnitId = $rootScope.UnitId;
		}
		if ($rootScope.ClassId) {
			parameters.ClassId = $rootScope.ClassId;
		}
		if ($scope.Search) {
			parameters.AccountName = $scope.Search;
		}

		//请求HTTP
		var promise = trshttpServer.httpServer('/wcm/rbcenter.do?serviceid=wcm61_scmaccount&methodName=findAccountsToJson',options,parameters);
		promise.then(function(data) {
			if(angular.isArray(data.result)){
				$scope.accounts = data.result;
			}else{
				var open = dialogServer.dialogWarn();
				open('400',{"data":data});
			}
		}, function(data) {
			var open = dialogServer.dialogWarn();
				open('400',{"data":data});
		})

		$scope.skip = function(accountId) {
			window.location.href = '/wcm/app/scm/index.jsp?AccountId='+accountId;
		}
	});

/**
 * 账号延期
 * @param  {[type]} $scope){	$scope.delay [延期方法]
 * @return {[type]}                        [description]
 */
app.controller('accountDelay', function($rootScope,$scope,$uibModal,trshttpServer,dialogServer) {

    $rootScope.activeDelay = true;
    $rootScope.activeisDelay = false;

	$scope.animationsEnabled = true;
	//1 调用弹出组件
	$scope.open = function(size,accountId,$event,CLASSID,UNITID) {
		
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'editorial/scm/account/tpls/accountEdit.html',
			controller: 'accountDelayInstance',
			size: size,
			resolve: {
				params: function() {
					return {
						"CLASSID": CLASSID,
						"UNITID": UNITID
					};
				}
			}
		});
  
        //1.1 阻止事件冒泡
		$event.stopPropagation();
	};
    
	$scope.toggleAnimation = function() {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	};

    //2 取消延期
	$scope.isDelay = function(accountId,$event) {
		var options = {};
		options.method = 'get';
		//2.1 请求HTTP
		var promise = trshttpServer.httpServer('/wcm/rbcenter.do?serviceid=wcm61_scmaccount&methodName=relieveBindAutoAccountToJson', options, {
			AccountId : accountId
		});
		promise.then(function(data) {
			if(data.result>0){
				$scope.accounts = data.result;
			}else{
				var open = dialogServer.dialogWarn();
				open('400',{"data":data});
			}
		}, function(data) {
			var open = dialogServer.dialogWarn();
			open('400',{"data":data});
		})

		$rootScope.activeDelay = true;
		$rootScope.activeisDelay = false;

		//2.3 阻止事件冒泡
        $event.stopPropagation();
	}
});

//实例化页面
app.controller('accountDelayInstance', function($rootScope,$scope, $state, $modalInstance,trshttpServer,params,dialogServer) {
    
    $scope.UnitTitle=params.UNITID;
    $scope.ClassTitle=params.CLASSID;
	$scope.ok = function(UserId,Passwd) {

		var options = {};
		options.method = 'get';
		//请求HTTP
		var promise = trshttpServer.httpServer('/wcm/rbcenter.do?serviceid=wcm61_scmaccount&methodName=autoBindAccountToJson', options, {
			UserId: UserId,
			Passwd: Passwd
		});

		promise.then(function(data) {
			var id=data.result;
			if(id > 0){
				$scope.accounts = data.result;
				$rootScope.activeDelay = false;
				$rootScope.activeisDelay = true;
			}else{
				var open = dialogServer.dialogWarn();
				open('400',{"data":data});
			}	
		}, function(data) {
			var open = dialogServer.dialogWarn();
			open('400',{"data":data});
		})

		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
})

/**
 * 添加账号
 * @param  {Array}  $scope)    {	$scope.items       [description]
 * @param  {[type]} function() {			$log.info('Modal dismissed     at: ' + new Date());		} [description]
 * @return {[type]}            [description]
 */
app.controller('accountAdd', function($scope, $uibModal, $log) {
    
    //2 调用弹出组件
	$scope.animationsEnabled = true;
	//2.1 调用open打开弹出窗
	$scope.open = function(size) {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'editorial/scm/account/tpls/accountAdd.html',
			controller: 'accountAddInstance',
			size: size
		});
	};

	$scope.toggleAnimation = function() {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	};
})

//实例化页面
app.controller('accountAddInstance', 
	function($rootScope,$scope,$state,$modalInstance,trshttpServer,utilClass,utilUnit,dialogServer) {
	
	//获取单位组织机构
	var promise = utilUnit.queryUnit();
	promise.then(function(data) {
		if(angular.isArray(data.result)){
				$scope.units = data.result;
			}else{
				var open = dialogServer.dialogWarn();
				open('400',{"data":data});
			}	
	}, function(data) {
		var open = dialogServer.dialogWarn();
		open('400',{"data":data});
	})

	//获取分类
	var classList = utilClass.queryClass();
	classList.then(function(data) {
		if(angular.isArray(data.result)){
 			$scope.classs = data.result;
 		}else{
 			var open = dialogServer.dialogWarn();
 			open('400',{"data":data});
 		}
	}, function(data) {
		var open = dialogServer.dialogWarn();
 		open('400',{"data":data});
	})

	$scope.uid = $rootScope.UnitId;
	$scope.cid = $rootScope.ClassId;

	$scope.getUnitId = function(id){
		 $scope.$apply(function(){
		 	$scope.uid = id;
		 })
	}

	$scope.getClassId = function (id){
		$scope.$apply(function(){
		 	$scope.cid = id;
		 })
	}
	
    //下一步
	$scope.select = true;
	$scope.add = false;
	$scope.next = function() {

		if (!$scope.cid||$scope.cid==0) {
			alert("请选择账号所属分类");
			return;
		}
		$scope.select = false;
		$scope.add = true;
	}

	$scope.ok = function() {
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
		$state.go("wbaccount.list",null,{
				reload: true
		});
	};
});

/**
 * 账号解绑
 * @param  {[type]} $scope     [description]
 * @param  {[type]} $modal     [description]
 * @param  {[type]} $log){	} [description]
 * @return {[type]}            [description]
 */
app.controller('accountDel', function($scope, $uibModal, $log) {
	$scope.animationsEnabled = true;

	$scope.open = function(size,$event,accountId) {

		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'editorial/scm/account/tpls/accountDel.html',
			controller: 'accountDelInstance',
			size: size,
			resolve: {
				accountId: function() {
					return accountId;
				}
			}
		});
        
		$event.stopPropagation();
	};

	$scope.toggleAnimation = function() {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	};
});

//实例化解绑页面
app.controller('accountDelInstance',
	function($scope, $state, $modalInstance, trshttpServer, accountId,dialogServer) {

		$scope.ok = function() {
			var options = {};
			options.method = 'get';

			//调用删除账号服务
			var promise = trshttpServer.httpServer('/wcm/rbcenter.do', options, {
				serviceid: "wcm61_scmaccount",
				methodName: "deleteToJson",
				ObjectIds: accountId
			});
			promise.then(function(data) {
				$scope.accounts = data.result;
				$state.go("wbaccount.list",null, {
					reload: true
				});	
			}, function(data) {
				var open = dialogServer.dialogWarn();
				open('400',{"data":data});
			})
			$modalInstance.close();
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	});
})
