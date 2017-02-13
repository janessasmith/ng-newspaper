var homeCtrl = angular.module('home.ctrl', 
	[
	'command.dir', 
	'home.dir', 
	'home.ser'
	]);

/**
 * 联合列表查询默认查询（5条）
 * @param  {[type]} $scope               [description]
 * @param  {[type]} $parse               [description]
 * @param  {[type]} $uibModal            [description]
 * @param  {[type]} $log                 [description]
 * @param  {[type]} reportManagementSer) {               $scope.getReportList [description]
 * @param  {[type]} function(data)       {                                                    console.log(data);      })    };    $scope.open [description]
 * @return {[type]}                      [description]
 */
homeCtrl.controller('homeManagementCtrl', 
	  function($scope,$rootScope ,$parse, $uibModal, homeManagementSer, dialogServer,backlogNumSer) {
  //翻页设置
  $scope.PageIndex =1;
  $scope.pageCount =1;
  $scope.getReportList = function() {
    var params = {
      title: $scope.title,
      PageSize: 5,
      PageIndex: $scope.PageIndex
    }
    var homeManagementList = homeManagementSer.homeManagementList(params);
    homeManagementList.then(function(data) {
      $scope.reportContents = data.result;
    }, function(data) {
      var open = dialogServer.dialogWarn();
      open('400', {
        "data": data
      });
    })
  };
  	$scope.getReportList();
  	//指令管理权限服务
  	$rootScope.dictateRightKeys={
  		"add":false,
  		"edit":false,
  		"del":false,
  		"forward":false,
  		"sign":false,
  		"check":false
    }
  	var findCadDictateRightKeys = homeManagementSer.findCadDictateRightKeys();
    findCadDictateRightKeys.then(function(data) {
      	//$rootScope.dictateRightKeys = data.result;// = "权限测试值！";
      	for(var i =0 ; i<data.result.length ; i++){
      		switch(data.result[i]){
    			case "cad.dictate.add":$rootScope.dictateRightKeys.add=true;break;
    			case "cad.dictate.edit":$rootScope.dictateRightKeys.edit=true;break;
    			case "cad.dictate.del":$rootScope.dictateRightKeys.del=true;break;
    			case "cad.dictate.forward":$rootScope.dictateRightKeys.forward=true;break;
    			case "cad.dictate.sign":$rootScope.dictateRightKeys.sign=true;break;
    			case "cad.dictate.check":$rootScope.dictateRightKeys.check=true;break;
    		}
      	}
    }, function(data) {
      	var open = dialogServer.dialogWarn();
      	open('400', {
        	"data": data
      	});
   	})
   	//联合报道管理权限服务
   	$rootScope.corpsRightKeys={
  		"add":false,
  		"edit":false,
  		"del":false,
  		"forward":false
    }
   	var findCadCorpsRightKeys = homeManagementSer.findCadCorpsRightKeys();
    findCadCorpsRightKeys.then(function(data) {
      	for(var i =0 ; i<data.result.length ; i++){
      		switch(data.result[i]){
    			case "cad.corps.add":$rootScope.corpsRightKeys.add=true;break;
    			case "cad.corps.edit":$rootScope.corpsRightKeys.edit=true;break;
    			case "cad.corps.del":$rootScope.corpsRightKeys.del=true;break;
    			case "cad.corps.forward":$rootScope.corpsRightKeys.forward=true;break;
    		}
      	}
    }, function(data) {
      	var open = dialogServer.dialogWarn();
      	open('400', {
        	"data": data
      	});
   	})

   	//获取指令代码任务
   	$scope.queryDicateNum = function(){
       backlogNumSer.queryDicateNum().then(function(data){
	     $scope.dirBacklogNums = data.result;
	   	},function(data){
            alert(data);
	   	})
   	}
   	$scope.queryDicateNum();

   	$rootScope.$on("backlog:num",function(){
       $scope.queryDicateNum();
     });

   	//获取联合报道任务
   	$scope.queryCropsDicateNum = function(){
       backlogNumSer.queryCropsDicateNum().then(function(data){
	     $scope.cropsDicateNum = data.result;
	   	},function(data){
            alert(data);
	   	})
   	}
   	$scope.queryCropsDicateNum();

   	$rootScope.$on("pressCorps:num",function(){
       $scope.queryCropsDicateNum();
     });
})
/**
 * 创建指令
 * @param  {[type]} $scope                       [description]
 * @param  {[type]} crerteDirSer                 [description]
 * @param  {[type]} $stateParams                 [description]
 * @param  {[type]} $uibModal                    [description]
 * @param  {[type]} dialogServer                 [description]
 * @param  {[type]} $state                       [description]
 * @param  {[type]} $filter)                     {				$scope.today [description]
 * @param  {[type]} 'yyyy/MM/dd'                 [description]
 * @param  {[type]} 'yyyy年MM月dd'                 [description]
 * @param  {[type]} 'shortDate'];		$scope.format [description]
 * @return {[type]}                              [description]
 */
homeCtrl.controller('createDirCtrl', function($scope, $rootScope,crerteDirSer, $stateParams, $uibModal, dialogServer, $state, $filter) {
		/*日期控件*/
		$scope.today = function() {
			$scope.startTime = new Date();
			$scope.minStartTime = new Date();
		};
		$scope.today();

		$scope.open = function($event) {
			$scope.status.opened = true;
		};

		$scope.status = {
			opened: false,
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

		//表单验证配置
		var vm = $scope.vm = {
			htmlSource: "",
			showErrorType: 1,
			showDynamicElement: true
		};

		//指令类型分类初始化
		$scope.dirTypes = [{
			"id": 1,
			"name": "采访任务"
		}, {
			"id": 2,
			"name": "通知"
		}];
		$scope.dirType = $scope.dirTypes[0];

		//初始化指令对象
		$scope.params = {
			"title": null,
			"content": null,
			"overTime": $scope.startTime,
			"isSecret": 0,
			"notifications": null,
			"userIds": null,
			"type": $scope.dirType.id,
			"fileNames": new Array()
		}

		//保存草稿
		$scope.wx = null;
		$scope.app = 2;
		$scope.dx = null;

		$scope.bgShow = false;
		$scope.save = function(type){
			$scope.bgShow = true;
			var notifications = '';
			if ($scope.wx) {
				notifications += $scope.wx + ',';
			}
			if ($scope.app) {
				notifications += $scope.app + ',';
			}
			if ($scope.dx) {
				notifications += $scope.dx + ',';
			}
			$scope.params.type = $scope.dirType.id;
			$scope.params.overTime = $filter('date')($scope.params.overTime, "yyyy-MM-dd");
			$scope.params.notifications = notifications.substr(0, notifications.length - 1);
			var dirId;
			if(type==0){//送审
                 dirId = crerteDirSer.sendCheck($scope.params);
			}
			if(type==1){//保存草稿
                 dirId = crerteDirSer.saveDir($scope.params);
			}
			if(type==2){//发布
                 dirId = crerteDirSer.sendDir($scope.params);
			}
			dirId.then(function(data) {
				$scope.bgShow = false;
				if (data.result > 0) {
					$state.go('command.myinstructMyLaunch.list', {"type":"1"}, {
						reload: true
					});
				} else {
					var open = dialogServer.dialogWarn();
					open('400', {
						"data": data.message
					});
				}
			}, function(data) {
				var open = dialogServer.dialogWarn();
				open('400', {
					"data": data
				});
			})
		}

		//配置编辑默认参数  
		$scope.config = {
			initialFrameHeight: 200
		}
		$scope.names = "";
		$scope.users=new Array();

		$scope.open_cp = function(size, $event) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				backdrop:"static",
				templateUrl: 'common/dialog/chat_choosePeople.html',
				controller: 'toolbarCtrlInstance',
				size: size,
				resolve: {
					determineType: function() {
						return {
							"type": "createDir",
							"users":$scope.users
						};
					}
				}
			})
			modalInstance.result.then(function(params) {
				$scope.users=[];
				var namesAarry = params.names.split(",");
				var useridAarry = params.userIds.split(",");
				var headImgAarry = params.headImg.split(",");
				for(var i=0 ;i<namesAarry.length-1;i++){
					$scope.objArray={
						"headImg":headImgAarry[i],
						"userId":useridAarry[i],
						"userName":namesAarry[i]
					};
					$scope.users.push($scope.objArray)
				}
				$scope.names = params.names;
				$scope.params.userIds = params.userIds;
			}, function() {
			})
		};

	})

/**
 * 新建联合报道
 * @param  {[type]} $scope           [description]
 * @param  {[type]} crerteReportSer) {		$scope.wx [description]
 * @param  {[type]} function(data)   {			                             console.log(data);		    })		}	} [description]
 * @return {[type]}                  [description]
 */
homeCtrl.controller('createReportCtrl', function($scope, crerteReportSer, $uibModal, $state, dialogServer, isNullSer) {
		//配置编辑默认参数
		$scope.config = {
			initialFrameHeight: 200
		}
		$scope.wx = null;
		$scope.app = 2;
		$scope.dx = null;
		$scope.params = {
			title: null,
			content: null,
			userIds: null,
			fileNames: []
		}
		$scope.bgShow = false;
		$scope.saveReport = function() {
			$scope.bgShow = true;
			var notifications = '';
			if ($scope.wx) {
				notifications += $scope.wx + ',';
			}
			if ($scope.app) {
				notifications += $scope.app + ',';
			}
			if ($scope.dx) {
				notifications += $scope.dx + ',';
			}
			notifications = notifications.substr(0, notifications.length - 1);
			// var notifications = $scope.wx+','+$scope.homeCtrl+','+$scope.dx;
			var saveReport = crerteReportSer.saveReport($scope.params, notifications);
			saveReport.then(function(data) {
				$scope.bgShow = false;
				if (data.result) {
					$state.go('command.reportManagement', null, {
						reload: true
					});
				} else {
					var open = dialogServer.dialogWarn();
					open('400', {
						"data": data.message
					});
				}

			}, function(data) {
				var open = dialogServer.dialogWarn();
				open('400', {
					"data": data
				});
			})
		}

		$scope.names = "";
		$scope.users=new Array();

		$scope.open_cp = function(size, $event) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				backdrop:"static",
				templateUrl: 'common/dialog/chat_choosePeople.html',
				controller: 'toolbarCtrlInstance',
				size: size,
				resolve: {
					determineType: function() {
						return {
							"type": "createDir",
							"users":$scope.users
						};
					}
				}
			})
			modalInstance.result.then(function(params) {
				$scope.users=[];
				var namesAarry = params.names.split(",");
				var useridAarry = params.userIds.split(",");
				var headImgAarry = params.headImg.split(",");
				for(var i=0 ;i<namesAarry.length-1;i++){
					$scope.objArray={
						"headImg":headImgAarry[i],
						"userId":useridAarry[i],
						"userName":namesAarry[i]
					};
					$scope.users.push($scope.objArray)
				}
				$scope.names = params.names;
				$scope.params.userIds = params.userIds;
			}, function() {
			})
		};
	})
/**
 * 聊天列表
 * @param  {[type]} $scope             [description]
 * @param  {[type]} $state             [description]
 * @param  {[type]} chatSer            [description]
 * @param  {[type]} dialogServer){	} [description]
 * @return {[type]}                    [description]
 */
homeCtrl.controller('chatCtrl', function($scope, $state, chatSer, dialogServer) {})
homeCtrl.controller('toolbarCtrl', function($rootScope, $parse, $scope, $uibModal, $log) {
	$scope.open_cp = function(size, $event) {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			backdrop:"static",
			templateUrl: 'common/dialog/chat_choosePeople.html',
			controller: 'toolbarCtrlInstance',
			size: size,
			resolve: {
				determineType: function() {
					return {
						"type": "createGroup",
					};
				}
			}
		})
		modalInstance.result.then(function(params) {
			$scope.$parent.getfzUserList();
		}, function() {})
	};
})
homeCtrl.controller('Light', function($scope, $state, chatSer, dialogServer) {
	var txUserList = chatSer.txUserList();
	txUserList.then(function(data) {
		if(data.status==-1)return;
		$scope.treedata = data;
	}, function(data) {
		var open = dialogServer.dialogWarn();
		open('400', {
			"data": data
		});
	});
})
homeCtrl.controller('toolbarCtrlInstance', function($rootScope, $scope, $state, $log, $uibModal, $modalInstance, $uibModalInstance, determineType, chatSer, dialogServer) {

		//组织机构
		$scope.gettxUserList = function() {
			var txUserList = chatSer.txUserList();
			txUserList.then(function(data) {
				if(data.status==-1)return;
				$scope.txUsers = data;
			}, function(data) {
				var open = dialogServer.dialogWarn();
				open('400', {
					"data": data
				});
			});
		}
		$scope.gettxUserList();
		//领域
		$scope.getlyUserList = function() {
			var lyUserList = chatSer.lyUserList();
			lyUserList.then(function(data) {
				if(data.status==-1)return;
				$scope.lyUsers = data.data;
			}, function(data) {
				var open = dialogServer.dialogWarn();
				open('400', {
					"data": data
				});
			});
		}
		$scope.getlyUserList();
		//分组
		$scope.getfzUserList = function() {
			var fzXzUserList = chatSer.fzXzUserList();
			fzXzUserList.then(function(data) {
				if(data.status==-1)return;
				$scope.fzUsers = data.data;
			}, function(data) {
				var open = dialogServer.dialogWarn();
				open('400', {
					"data": data
				});
			});
		}
		$scope.getfzUserList();
		//查询
		$scope.userName = "";
		$scope.getcxUserListt = function(e) {
			var keycode = window.event?e.keyCode:e.which;
	            if(keycode==13){
	                $scope.getcxUserList($scope.userName);
	            }
		}
		$scope.getcxUserList = function(msg) {
			var getcxUserList = chatSer.getcxUserList(msg);
			getcxUserList.then(function(data) {
				if(data.status==-1)return;
				$scope.cxUsers = data.data;
			}, function(data) {
				var open = dialogServer.dialogWarn();
				open('400', {
					"data": data
				});
			});
		}
		$scope.fhUsers = determineType.users;
		$scope.userIdAarry = []; //加群用户
		$scope.namesAarry = []; //用户姓名
		$scope.headimgAarry = [] ;//头像
		if(determineType.users!=undefined){
			for(var i = 0 ; i<determineType.users.length ; i++){
				$scope.userIdAarry.push(determineType.users[i].userId+'');
				$scope.namesAarry.push(determineType.users[i].userName);
				$scope.headimgAarry.push(determineType.users[i].headImg);
			}
		}
		$scope.determine = function(size, $event) {
			if ($scope.userIdAarry.length > 0 && determineType.type == "createGroup") {
				var modalInstance = $uibModal.open({
					animation: $scope.animationsEnabled,
					templateUrl: 'common/dialog/fenzu_dialog.html',
					controller: 'createGroupCtrlInstance',
					size: size,
					resolve: {
						userIdAarry: function() {
							return $scope.userIdAarry;
						}
					}
				})
				modalInstance.result.then(function(params) {
					$scope.getfzUserList();
					$uibModalInstance.close(params);
				}, function() {})
			} else if ($scope.userIdAarry.length > 0 && determineType.type == "createDir") {
				var params = {
					userIds: "",
					names: "",
					headImg:""
				}
				for (var i = 0; i < $scope.userIdAarry.length; i++) {
					params.userIds += $scope.userIdAarry[i] + ',';
					params.names += $scope.namesAarry[i] + ',';
					params.headImg += $scope.headimgAarry[i] + ',';
				}
				$modalInstance.close(params);
			} else if ($scope.userIdAarry.length > 0 && determineType.type == "setGroup") {
				var modalInstance = $uibModal.open({
					animation: $scope.animationsEnabled,
					templateUrl: 'common/dialog/fenzu_dialog.html',
					controller: 'setGroupCtrlInstance',
					size: size,
					resolve: {
						userIdAarry: function() {
							return $scope.userIdAarry;
						}
					}
				})
				modalInstance.result.then(function(params) {
					$scope.getfzUserList();
					$uibModalInstance.close(params);
				}, function() {})
			}else {
				alert("你还没有选择人员！");
			}
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
			$scope.userIdAarry = [];
		};
	})
	//聊天分组 实例化页面
homeCtrl.controller('createGroupCtrlInstance', function($rootScope, $scope, $state, $log, $modalInstance, $uibModalInstance, chatSer, dialogServer, userIdAarry) {
	var userId = "";
	for (var i = 0; i < userIdAarry.length; i++) {
		userId += userIdAarry[i] + ','
	}
	$scope.determine = function() {
		var params = {
			userId: userId,
			groupName: $scope.groupName
		}
		if($scope.groupName==null||$scope.groupName==undefined){
			alert("分组名称不能为空！");
		}else{
			var saveGroup = chatSer.saveGroup(params);
			saveGroup.then(function(data) {
				if (data.groupid > 0) {
					$modalInstance.close(data);
				} else {
					var open = dialogServer.dialogWarn();
					open('400', {
						"data": data
					});
				}
			}, function(data) {
				var open = dialogServer.dialogWarn();
				open('400', {
					"data": data
				});
			});
		}
	};
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
})
//二维码
homeCtrl.controller('QRcodeCtrl', function($scope, $state) {
	$scope.QRcode=false;
	$scope.determine = function() {
		$scope.QRcode = !$scope.QRcode;
	};	
})