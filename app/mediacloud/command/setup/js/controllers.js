var setupCtrl = angular.module('setup.ctrl', [
  'setup.ser',
  'setup.dir'
  ]);
/**
 * 自定义分组
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $parse        [description]
 * @param  {[type]} $state        [description]
 * @param  {[type]} $uibModal     [description]
 * @param  {[type]} $log          [description]
 * @param  {[type]} setGroupSer   [description]
 * @param  {[type]} dialogServer) {	$scope.open_cp  [description]
 * @param  {[type]} function()    {})	};	function groupList(){		var saveGroup [description]
 * @return {[type]}               [description]
 */
setupCtrl.controller('setGroupCtrl', function($scope, $parse, $state, $uibModal, $log, setGroupSer, dialogServer) {
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
						"type": "setGroup",
					};
				}
			}
		})
		modalInstance.result.then(function(params) {
			$state.go('command.setGroup', null, {
	          reload: true
	        });
		}, function() {})
	};
	function groupList(){
		var saveGroup = setGroupSer.setGroupList();
		saveGroup.then(function(data) {
			if(data.status==-1)return;
			$scope.groupConts = data.data;
			$scope.groupNum = data.data.length-1;
		}, function(data) {
			var open = dialogServer.dialogWarn();
			open('400', {
				"data": data
			});
		});
	};
	groupList();
	//上移服务
	$scope.upGroup = function(groupid){
		var upGroup = setGroupSer.upGroupList(groupid);
		upGroup.then(function(data) {
			if(data.groupid<0)return;
			groupList();
		}, function(data) {
			var open = dialogServer.dialogWarn();
			open('400', {
				"data": data
			});
		});
	};
	//下移服务
	$scope.downGroup = function(groupid){
		var downGroup = setGroupSer.downGroupList(groupid);
		downGroup.then(function(data) {
			if(data.groupid<0)return;
			groupList();
		}, function(data) {
			var open = dialogServer.dialogWarn();
			open('400', {
				"data": data
			});
		});
	};
	$scope.delGroup = function(groupid){
		var open = dialogServer.dialogVerify();
	      open('400', {
		        "groupid": groupid,
		        "ctrlInstance": "delGroupCtrlInstance",
		        "message":"确认删除？"
	      });
	};
})
//自定义分组 实例化页面
setupCtrl.controller('setGroupCtrlInstance', function($rootScope, $scope, $state, $log, $modalInstance, $uibModalInstance, setGroupSer, dialogServer, userIdAarry) {
	var userId = "";
	for (var i = 0; i < userIdAarry.length; i++) {
		userId += userIdAarry[i] + ','
	}
	$scope.determine = function() {
		var params = {
			userIds: userId,
			groupName: $scope.groupName
		}
		if($scope.groupName==null||$scope.groupName==undefined){
			alert("分组名称不能为空！");
		}else{
			var saveGroup = setGroupSer.saveGroup(params);
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
//自定义分组-实例化删除页面
app.controller('delGroupCtrlInstance', function($scope, $state, $rootScope, $modalInstance, $log, setGroupSer, params, dialogServer) {

    $scope.ok = function() {
      //调用删除账号服务
      var draftDelList = setGroupSer.delGroup(params.groupid);
      draftDelList.then(function(data) {
        if (data.groupid>0) {
          	$state.go('command.setGroup', null, {
	          reload: true
	        });
	        $modalInstance.close();
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
      })
      $modalInstance.close();
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
})
/**
 * 自定义分组详情，修改页面
 * @param  {[type]} $scope         [description]
 * @param  {[type]} $parse         [description]
 * @param  {[type]} $stateParams   [description]
 * @param  {[type]} $state         [description]
 * @param  {[type]} $uibModal      [description]
 * @param  {[type]} $log           [description]
 * @param  {[type]} setGroupSer    [description]
 * @param  {Object} dialogServer)  {	$scope.params [description]
 * @param  {[type]} function(data) {			var         open          [description]
 * @return {[type]}                [description]
 */
setupCtrl.controller('groupDetailsCtrl', function($scope, $parse,$stateParams, $state, $uibModal, $log, setGroupSer, dialogServer) {
	$scope.params = {
		"groupName": null,
		"groupId": null,
		"userIds": ''
	}
	$scope.userNames ='';
	$scope.groupmembers=null;
	function groupDetails(groupId){
		var groupDetails = setGroupSer.groupDetails(groupId);
		groupDetails.then(function(data) {
			$scope.params.groupName = data.groupname;
			$scope.params.groupId = data.groupid;
			$scope.groupmembers = data.groupmembers;
			for(var i = 0 ; i < data.groupmembers.length ; i ++){
				$scope.userNames+=data.groupmembers[i].userName+','
				$scope.params.userIds+=data.groupmembers[i].userId+','
			}
		}, function(data) {
			var open = dialogServer.dialogWarn();
			open('400', {
				"data": data
			});
		});
	};
	groupDetails($stateParams.groupId);
	$scope.bgShow = false;
	$scope.revise = function(){
		$scope.bgShow = true;
		var groupUpdate = setGroupSer.groupUpdate($scope.params);
		groupUpdate.then(function(data) {
			$scope.bgShow = false;
			if(data.groupid>0){
				$state.go('command.setGroup', null, {
		           reload: true
		        });
			}else{
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
	};
	$scope.return = function(){
		$state.go('command.setGroup', null, {
           reload: true
        });
	};
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
							"users":$scope.groupmembers
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
				$scope.userNames = params.names;
				$scope.params.userIds = params.userIds;
			}, function() {
			})
		};
})