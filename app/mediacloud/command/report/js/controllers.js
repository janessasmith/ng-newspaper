var reportCtrl = angular.module('report.ctrl', [
  'report.ser',
  'report.dir'
  ]);

/**
 * 联合报道管理
 * @param  {[type]} $scope               [description]
 * @param  {[type]} $parse               [description]
 * @param  {[type]} $uibModal            [description]
 * @param  {[type]} $log                 [description]
 * @param  {[type]} reportManagementSer) {               $scope.getReportList [description]
 * @param  {[type]} function(data)       {                                                    console.log(data);      })    };    $scope.open [description]
 * @return {[type]}                      [description]
 */
reportCtrl.controller('reportManagementCtrl', function($scope, $parse, $uibModal, $log, reportManagementSer, dialogServer) {
  //翻页设置
  $scope.PageIndex =1;
  $scope.pageCount =1;
  $scope.getReportList = function(status) {
    var params = {
      title: $scope.title,
      PageSize: 10,
      PageIndex: $scope.PageIndex
    }
    var reportManagementList = reportManagementSer.reportManagementList(params);
    reportManagementList.then(function(data) {
      $scope.reportContents = data.result;
      $scope.pageInfo = data.pageInfo;
      $scope.pageCount = data.pageInfo.pageCount;
    }, function(data) {
      var open = dialogServer.dialogWarn();
      open('400', {
        "data": data
      });
    })
  };
  $scope.open = function(size, channelId) {
    var modalInstance = $uibModal.open({
      templateUrl: 'report/tpls/delnew.html',
      controller: 'deleteCtrlInstance',
      size: size,
      resolve: {
        params: function() {
          return {
            "corpsId": channelId,
          };
        }
      }
    });
  };

  $scope.getReportList();

  //上下页 跳转
  $scope.reduce = function()
  { 
    if($scope.PageIndex-1<=0)return ;
    $scope.PageIndex = $scope.PageIndex-1;
    $scope.getReportList();
  }
  $scope.add = function()
  { 
    if($scope.PageIndex+1>$scope.pageCount)return;
    $scope.PageIndex = $scope.PageIndex+1;
    $scope.getReportList();
  }
})

/**
 * 实例化删除窗口
 * @param  {[type]} $scope            [description]
 * @param  {[type]} $state            [description]
 * @param  {[type]} $rootScope        [description]
 * @param  {[type]} $uibModalInstance [description]
 * @param  {[type]} $log              [description]
 * @param  {[type]} params            [description]
 * @param  {[type]} deleteSer)        {                 $scope.ok [description]
 * @param  {[type]} function(data)    {                                           console.log(data);        })        $uibModalInstance .dismiss('cancel');      };      $scope.cancel [description]
 * @return {[type]}                   [description]
 */
reportCtrl.controller('deleteCtrlInstance', function($scope, $state, $rootScope, $uibModalInstance, $log, params, deleteSer, dialogServer, dialogServer) {
    $scope.ok = function() {
      var deleteList = deleteSer.deleteList(params);
      deleteList.then(function(data) {
        if (data.result > 0) {
          $state.go(".", {
            "t": Math.random()
          });
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
      $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  })

/**
 * 修改联合报道
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $stateParams  [description]
 * @param  {[type]} $parse        [description]
 * @param  {[type]} $uibModal     [description]
 * @param  {[type]} $log          [description]
 * @param  {Object} getReportSer) {               $scope.params [description]
 * @return {[type]}               [description]
 */
reportCtrl.controller('reviseReportCtrl', function($scope, $stateParams, $parse, $state, $uibModal, $log, getReportSer, dialogServer) {
  $scope.params = {
    title: null,
    content: null,
    userIds: null,
    delFileIds: "",
    fileNames: new Array(),
    newFileNames: new Array()
  }
  $scope.users="";
  $scope.getReportCtrl = function(status) {
    var obj = {
      corpsId: status,
    }
    var getReportList = getReportSer.getReportList(obj);
    getReportList.then(function(data) {
    	$scope.users = data.users;
      if (angular.isObject(data)) {
        $scope.params.title = data.TITLE;
        $scope.params.content = data.CONTENT;
        var array = data.NOTIFICATIONS.split(",");
        for (var i = 0; i < array.length; i++) {
          if (array[i] == "1") {
            $scope.wx = 1;
          } else if (array[i] == "2") {
            $scope.reportCtrl = 2;
          } else if (array[i] == "3") {
            $scope.dx = 3;
          }
        }
        $scope.names = data.users[0].userName;
        $scope.params.userIds = data.users[0].userId;
        for (var i = 1; i < data.users.length; i++) {
          $scope.names += "，" + data.users[i].userName;
          $scope.params.userIds += "，" + data.users[i].userId;
        }
        $scope.Reports = data;
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
  }
  $scope.getReportCtrl($stateParams.corpsId);

  $scope.updateReport = function() {
    var notifications = "";
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
    $scope.params.delFileIds = $scope.params.delFileIds.substr(0, $scope.params.delFileIds.length - 1);
    $scope.params.newFileNames = $scope.params.fileNames;
    delete $scope.params.fileNames;
    var updateReport = getReportSer.updateReport($scope.params, notifications, $stateParams.corpsId);
    updateReport.then(function(data) {
      $state.go('command.reportManagement', null, {
        reload: true
      });
    }, function(data) {
      var open = dialogServer.dialogWarn();
      open('400', {
        "data": data
      });
    })
  }
  $scope.names = "";
    // $scope.users=users;

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

//联合报道细览（未完）
reportCtrl.controller('reportDetailedviewCtrl', function($scope, $parse, $uibModal, $stateParams, $log) {
  $scope.corpsId = $stateParams.corpsId;
})

/**
 * 联合报道细览->主界面
 * @param  {[type]} $scope             [description]
 * @param  {[type]} $parse             [description]
 * @param  {[type]} $uibModal          [description]
 * @param  {[type]} $stateParams       [description]
 * @param  {[type]} $log               [description]
 * @param  {String} reportViewMainSer) {               $scope.type [description]
 * @param  {[type]} function(data)     {                                           var open [description]
 * @param  {[type]} function(data)     {                                           var open [description]
 * @return {[type]}                    [description]
 */
reportCtrl.controller('reportViewMainCtrl', function($scope, $state, $parse, $uibModal, $stateParams, $log, reportViewMainSer,getReportSer ,dialogServer) {
  $scope.type = "";

  $scope.params = {
    "corpsId": $stateParams.corpsId,
    "content": "",
    "fileNames": new Array()
  }
//单条报道查询
  var obj = {
	      corpsId: $stateParams.corpsId,
	    }
  var getReportList = getReportSer.getReportList(obj);
  getReportList.then(function(data) {
    $scope.BDtitle = data.TITLE;
    
  }, function(data) {
    var open = dialogServer.dialogWarn();
    open('400', {
      "data": data
    });
  })
  $scope.send = function() {
    var sends = reportViewMainSer.sendconts($scope.params);
    sends.then(function(data) {
      $state.go(".",{
        "t":Math.random()
      });
    }, function(data) {
      console.log(data);
    })
  }
  $scope.trustSrc = function(url){
    return url;
}

  $scope.getReportViewMainList = function() {
    $scope.type = "all";
    var reportViewMainList = reportViewMainSer.reportViewMainList($stateParams.corpsId);
    reportViewMainList.then(function(data) {
      $scope.viewMainContents = data.result;
    }, function(data) {
      var open = dialogServer.dialogWarn();
      open('400', {
        "data": data
      });
    })
  };
  $scope.getReportViewMainList();

  $scope.getUserList = function() {
    var userList = reportViewMainSer.userList($stateParams.corpsId);
    userList.then(function(data) {
      $scope.users = data.result;
    }, function(data) {
      var open = dialogServer.dialogWarn();
      open('400', {
        "data": data
      });
    })
  };
  $scope.getUserList();

  $scope.getReportViewImgList = function() {
    $scope.type = "img";
    var reportViewImgList = reportViewMainSer.reportViewImgList($stateParams.corpsId);
    reportViewImgList.then(function(data) {
      $scope.imgContents = data.result;
    }, function(data) {
      var open = dialogServer.dialogWarn();
      open('400', {
        "data": data
      });
    })
  };

  $scope.getReportViewVideoList = function() {
    $scope.type = "video";
    var reportViewVideoList = reportViewMainSer.reportViewVideoList($stateParams.corpsId);
    reportViewVideoList.then(function(data) {
      $scope.videoContents = data.result;
    }, function(data) {
      var open = dialogServer.dialogWarn();
      open('400', {
        "data": data
      });
    })
  };
  
//联合报道群聊服务
  $scope.corpsChat = function(){
    var corpsChatList = reportViewMainSer.corpsChatList($stateParams.corpsId);
      corpsChatList.then(function(data) {
        if(data.groupId!=null&&data.groupId!=''&&data.groupId!=undefined){
          var open = dialogServer.dialogMessage();
          open('600',data.groupId,2);
        }else{
          var open = dialogServer.dialogWarn();
          open('400',{"data":data});
        }
      }, function(data) {
        var open = dialogServer.dialogWarn();
        open('400',{"data":data});
    })
  }
  //邀请人员权限服务
  $scope.purview = "";
  var inviteUsers = reportViewMainSer.inviteUsers($stateParams.corpsId);
  inviteUsers.then(function(data) {
    $scope.purview = data.result;
  }, function(data) {
    var open = dialogServer.dialogWarn();
    open('400', {
      "data": data
    });
  })
  $scope.open_cp = function(size, $event) {
    if ($scope.purview) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'common/dialog/chat_choosePeople.html',
        controller: 'toolbarCtrlInstance',
        size: size,
        resolve: {
          determineType: function() {
            return {
              "type": "createDir",
            };
          }
        }
      })
      modalInstance.result.then(function(params){
          var addUsers = reportViewMainSer.addUsers($stateParams.corpsId,params.userIds);
          addUsers.then(function(data) {
            if(data.result!=null&&data.result!=''){
              $scope.getUserList();
            }else{
              var open = dialogServer.dialogWarn();
              open('400',{"data":data});
            }
          }, function(data) {
            var open = dialogServer.dialogWarn();
            open('400',{"data":data});
          })
        },function(){
        })
    } else {
      alert("你没有邀请人的权限！");
    }
  };
})

/**
 * 联合报道细览->任务说明
 * @param  {[type]} $scope                [description]
 * @param  {[type]} $parse                [description]
 * @param  {[type]} $uibModal             [description]
 * @param  {[type]} $stateParams          [description]
 * @param  {[type]} $log                  [description]
 * @param  {[type]} reportExplanationSer) {               $scope.getExplanationList [description]
 * @param  {[type]} function(data)        {                                                         var open [description]
 * @return {[type]}                       [description]
 */
reportCtrl.controller('reportViewExplanationCtrl', function($scope, $parse, $uibModal, $stateParams, $log, reportExplanationSer, dialogServer) {
    $scope.getExplanationList = function() {
      var reportExplanationList = reportExplanationSer.reportExplanationList($stateParams.corpsId);
      reportExplanationList.then(function(data) {
        if(data.status==-1||!data){
            var open = dialogServer.dialogWarn();
                open('400', {
                  "data": data.message
                });
        }
        $scope.explanationContents = data;
      }, function(data) {
        var open = dialogServer.dialogWarn();
        open('400', {
          "data": data
        });
      })
    };
    $scope.getExplanationList();
  })
  /**
   * 联合报道细览->任务管理
   * @param  {[type]} $scope                  [description]
   * @param  {[type]} $parse                  [description]
   * @param  {[type]} $uibModal               [description]
   * @param  {[type]} $stateParams            [description]
   * @param  {[type]} $log                    [description]
   * @param  {[type]} reportViewManagementSer [description]
   * @param  {[type]} dialogServer)           {               $scope.corpsId [description]
   * @param  {[type]} function(data)          {                                                var open [description]
   * @param  {[type]} function(data)          {                                                var open [description]
   * @return {[type]}                         [description]
   */
reportCtrl.controller('reportViewManagementCtrl', function($scope, $parse, $uibModal, $stateParams, $log, reportViewManagementSer, dialogServer) {
    $scope.corpsId = $stateParams.corpsId;
    $scope.orderType = "";
    $scope.getMyPublishTaskList = function() {
      if ($stateParams.orderType == "myPublish") {
        $scope.orderType = "myPublish";
        var publishTaskList = reportViewManagementSer.publishTaskList($stateParams.corpsId);
        publishTaskList.then(function(data) {
          $scope.publishTaskLists = data.result;
        }, function(data) {
          var open = dialogServer.dialogWarn();
          open('400', {
            "data": data
          });
        })
      } else if ($stateParams.orderType == "over") {
        $scope.orderType = "over";
        var overList = reportViewManagementSer.overList($stateParams.corpsId);
        overList.then(function(data) {
          $scope.overLists = data.result;
        }, function(data) {
          var open = dialogServer.dialogWarn();
          open('400', {
            "data": data
          });
        })
      } else {
        $scope.orderType = "upcoming";
        var UpcomingList = reportViewManagementSer.UpcomingList($stateParams.corpsId);
        UpcomingList.then(function(data) {
          $scope.upcomingLists = data.result;
        }, function(data) {
          var open = dialogServer.dialogWarn();
          open('400', {
            "data": data
          });
        })
      }
    };
    $scope.getMyPublishTaskList();
  })
  /**
   * 指令查看列表
   * @param  {[type]} $scope                   [description]
   * @param  {[type]} $parse                   [description]
   * @param  {[type]} $uibModal                [description]
   * @param  {[type]} $stateParams             [description]
   * @param  {[type]} $log                     [description]
   * @param  {[type]} reportViewManagementSer) {               $scope.getreportOrderList [description]
   * @param  {[type]} function(data)           {                                                         var open [description]
   * @return {[type]}                          [description]
   */
reportCtrl.controller('reportOrderViewCtrl', function($scope, $parse, $uibModal, $stateParams, $log, reportViewManagementSer, dialogServer) {
	$scope.openMessage = function(userId) {
	      var open = dialogServer.dialogMessage();
	      open('600', userId, 1);
	    }
	$scope.getreportOrderList = function(dictateId, readType) {
      var reportOrderShowList = reportViewManagementSer.reportOrderShowList(dictateId);
      reportOrderShowList.then(function(data) {
        if (readType == 'noRead') {
          $scope.OrderShowLists = data.noRead;
        } else if (readType == 'read') {
          $scope.OrderShowLists = data.read;
        } else if (readType == 'over') {
          $scope.OrderShowLists = data.over;
        }
      }, function(data) {
        var open = dialogServer.dialogWarn();
        open('400', {
          "data": data
        });
      })
    };
  })
  /**
   * 已结束——操作日志查询
   * @param  {[type]} $rootScope [description]
   * @param  {[type]} $parse     [description]
   * @param  {[type]} $scope     [description]
   * @param  {[type]} $uibModal  [description]
   * @param  {[type]} $log)      {               $scope.animationsEnabled [description]
   * @return {[type]}            [description]
   */
reportCtrl.controller('reportJournalReadlCtrl', function($rootScope, $parse, $scope, $uibModal, $log) {
    $scope.animationsEnabled = true;
    $scope.open = function(size, $event, channelId) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'common/dialog/journal.html',
        controller: 'reportJournalReadlInstance',
        size: size,
        resolve: {
          channelId: function() {
            return channelId;
          }
        }
      });
    };
    $scope.openAll = function(size, $event, channelId) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'common/dialog/journal.html',
          controller: 'reportAllJournalReadlInstance',
          size: size,
          resolve: {
            channelId: function() {
              return channelId;
            }
          }
        });
      };
    $scope.toggleAnimation = function() {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };
  })
  //实例化页面journaReadSer
reportCtrl.controller('reportJournalReadlInstance', function($rootScope, $scope, $parse, $uibModal, $state, $log, $uibModalInstance, reportJournalReadSer, dialogServer, channelId) {
  var journalList = reportJournalReadSer.journalList(channelId);
  journalList.then(function(data) {
    $scope.journalContents = data.result;
  }, function(data) {
    var open = dialogServer.dialogWarn();
    open('400', {
      "data": data
    });
  })
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
})
reportCtrl.controller('reportAllJournalReadlInstance', function($rootScope, $scope, $parse, $uibModal, $state, $log, $uibModalInstance, reportJournalReadSer, dialogServer, channelId) {
  var journalAllList = reportJournalReadSer.journalAllList(channelId);
  journalAllList.then(function(data) {
    $scope.journalContents = data.result;
  }, function(data) {
    var open = dialogServer.dialogWarn();
    open('400', {
      "data": data
    });
  })
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
})

/**
 * 联合报道细览——>已完成转待办
 * @param  {[type]} $rootScope [description]
 * @param  {[type]} $parse     [description]
 * @param  {[type]} $scope     [description]
 * @param  {[type]} $uibModal  [description]
 * @param  {[type]} $log)      {               $scope.animationsEnabled [description]
 * @return {[type]}            [description]
 */
reportCtrl.controller('overRemindCtrl', function($rootScope, dialogServer, $parse, $scope, $uibModal, $log) {
    $scope.animationsEnabled = true;
    $scope.open = function(size, $event, channelId, $index) {
      var open = dialogServer.dialogVerify();
      open('400', {
        "dictateid": channelId,
        "index": $index,
        "ctrlInstance": "overRemindCtrlInstance",
        "message": "是否设置为 待办指令？"
      });
    };
  })
  //实例化页面overRemindSer
reportCtrl.controller('overRemindCtrlInstance', function($rootScope, $scope, $state, $log, $uibModalInstance, overRemindSer, dialogServer, params) {
  $scope.index = params.index;
  $scope.ok = function() {
    var overRemindList = overRemindSer.overRemindList(params.dictateid);
    overRemindList.then(function(data) {
      $uibModalInstance.dismiss('cancel');
      $state.go("command.reportDetailedview.reportViewManagement.list", {
        "t": Math.random()
      });
    }, function(data) {
      var open = dialogServer.dialogWarn();
      open('400', {
        "data": data
      });
    })
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
})

/**
 * 联合报道细览——>已完成转待办
 * @param  {[type]} $rootScope [description]
 * @param  {[type]} $parse     [description]
 * @param  {[type]} $scope     [description]
 * @param  {[type]} $uibModal  [description]
 * @param  {[type]} $log)      {               $scope.animationsEnabled [description]
 * @return {[type]}            [description]
 */
reportCtrl.controller('delRemindCtrl', function($rootScope, dialogServer, $parse, $scope, $uibModal, $log) {
    $scope.animationsEnabled = true;
    $scope.open = function(size, $event, channelId, $index) {
      var open = dialogServer.dialogVerify();
      open('400', {
        "dictateid": channelId,
        "index": $index,
        "ctrlInstance": "delRemindCtrlInstance",
        "message": "是否设置为 完成指令？"
      });
    };
  })
  //实例化页面remindSer
reportCtrl.controller('delRemindCtrlInstance', function($rootScope, $scope, $state, $log, $uibModalInstance, dbRemindSer, dialogServer, params) {
  $scope.ok = function() {
    var deleteList = dbRemindSer.deleteList(params.dictateid);
    deleteList.then(function(data) {
      if (data.result > 0) {
        $state.go("command.reportDetailedview.reportViewManagement.list", {
          "t": Math.random()
        });
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
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
})

/**
 * 发布任务
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
homeCtrl.controller('PubTaskCtrl', function($scope, PubTaskSer, $stateParams, $uibModal, dialogServer, $state, $filter) {
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
			"corpsId":$stateParams.corpsId,
			"title": null,
			"content": null,
			"overTime": $scope.startTime,
			"isSecret": 0,
			"notifications": null,
			"userIds": null,
			"type": $scope.dirType.id,
			"fileNames": new Array()
		}
		$scope.bgShow = false;
		$scope.sendDir = function() {
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
			var dirId = PubTaskSer.sendTask($scope.params);
			dirId.then(function(data) {
				$scope.bgShow = false;
				if (data.result > 0) {
					$state.go('.', null, {
						reload: true
					});
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
				templateUrl: 'common/dialog/puTask_choosePeople.html',
				controller: 'toolbarCtrlInstancex',
				size: size,
				resolve: {
					determineType: function() {
						return {
							"type": "createDir",
							"corpsId":$stateParams.corpsId
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

	});
homeCtrl.controller('toolbarCtrlInstancex', function($rootScope, $scope, $state, $log, $uibModal, $modalInstance, $uibModalInstance, determineType, chatSer, dialogServer) {
		$scope.getUserList = function() {
		    var userList = chatSer.userList(determineType.corpsId);
		    userList.then(function(data) {
		    	if(data.status==-1)return;
		      	$scope.users = data.result;
		    }, function(data) {
		      var open = dialogServer.dialogWarn();
		      open('400', {
		        "data": data
		      });
		    })
		};
		
		$scope.getUserList();
		$scope.fhUsers = determineType.users;
		$scope.userIdAarry = []; //加群用户
		$scope.namesAarry = []; //用户姓名
		$scope.headimgAarry = [] ;//头像
		if(determineType.users!=undefined){
			for(var i = 0 ; i<determineType.users.length ; i++){
				$scope.userIdAarry.push(determineType.users[i].userId);
				$scope.namesAarry.push(determineType.users[i].userName);
				$scope.headimgAarry.push(determineType.users[i].headImg);
			}
		}
		$scope.determine = function(size, $event) {
			if ($scope.userIdAarry.length > 0) {
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
			} else {
				alert("你还没有选择人员！");
			}
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
			$scope.userIdAarry = [];
		};
	})

/**
 * 联合报道指令查看（我发起方的单条）
 * @param  {[type]} $scope                      [description]
 * @param  {[type]} $stateParams                [description]
 * @param  {[type]} myLaunchCommandShowCtrlSer) {               $scope.getCommandShowCtrl [description]
 * @param  {[type]} function(data)              {                                                         console.log(data);      })    }    $scope.getCommandShowCtrl($stateParams.DICTATEID);  } [description]
 * @return {[type]}                             [description]
 */
app.controller('myPublishCommandShowCtrl', function($scope, $stateParams, $parse, $uibModal, dialogServer, myLaunchCommandShowCtrlSer) {
  $scope.getCommandShowCtrl = function(status) {
    var params = status;
    //判断密级指令处理
    if ($stateParams.issecret == 0) {
      var myLaunchCommandShowList = myLaunchCommandShowCtrlSer.myLaunchCommandShowList(params);
      myLaunchCommandShowList.then(function(data) {
        if (data.DICTATEID) {
          $scope.launchCommandContent = data;
        } else {
          var open = dialogServer.dialogWarn();
          open('400', {
            "data": data
          });
        }
      }, function(data) {
        var open = dialogServer.dialogWarn();
        open('400', data);
      })
    } else {
      //密级指令处理
      $scope.animationsEnabled = true;
      $scope.open = function(size, dictateid) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          backdrop:"static",
          templateUrl: 'common/dialog/password.html',
          controller: 'myPublishPasswordContrl',
          size: size,
          resolve: {
            dictateid: function() {
              return dictateid;
            }
          }
        });
        modalInstance.result.then(function(data) {
          $scope.launchCommandContent = data;
        }, function() {});

      };
      $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
      $scope.open("400", $stateParams.DICTATEID);
    }
  }
  $scope.getCommandShowCtrl($stateParams.DICTATEID);
})
//我发起的- 密级指令验证界面
app.controller('myPublishPasswordContrl', function($scope, $parse, $state, $uibModal, $uibModalInstance, $modalInstance, dictateid, dialogServer, myLaunchCommandShowCtrlSer) {
    //指令服务 密码验证
    $scope.password = null;
    $scope.check = function() {
      var myLaunchCommandShowList = myLaunchCommandShowCtrlSer.myLaunchCommandShowList(dictateid, $scope.password);
      myLaunchCommandShowList.then(function(data) {
        if (data.DICTATEID) {
          //密码正确返回给页面数据
          $uibModalInstance.close(data);
        } else {
          $scope.warning = data.message;
        }
      }, function(data) {
        var open = dialogServer.dialogWarn();
        open('400', {
          "data": data
        });
      })
    }
    $scope.close = function() {
      $uibModalInstance.close();
      history.go(-1);
    }
  })
/**
 * 完成联合报道任务查看
 * @param  {[type]} $scope              [description]
 * @param  {[type]} $stateParams        [description]
 * @param  {[type]} commandShowCtrlSer) {               $scope.getCommandShowCtrl [description]
 * @param  {[type]} function(data)      {                                                         console.log(data);      })    }    $scope.getCommandShowCtrl($stateParams.DICTATEID);  } [description]
 * @return {[type]}                     [description]
 */
app.controller('overCommandShowCtrl', 
       function($scope, $stateParams, $parse, $uibModal, dialogServer, commandShowCtrlSer) {
    $scope.getCommandShowCtrl = function(status) {
      params = status;
      //判断是否为密级指令并处理
      if ($stateParams.issecret == 0) {
        var commandShowList = commandShowCtrlSer.commandShowList(params);
        commandShowList.then(function(data) {
          if (data.DICTATEID) {
            $scope.commandShowContent = data;
          } else {
            var open = dialogServer.dialogWarn();
            open('400', {
              "data": data
            });
          }
        }, function(data) {
          var open = dialogServer.dialogWarn();
          open('400', data);
        })
      } else {
        //密级指令处理
        $scope.animationsEnabled = true;
        $scope.open = function(size, dictateid) {
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop:"static",
            templateUrl: 'common/dialog/password.html',
            controller: 'overPasswordContrl',
            size: size,
            resolve: {
              dictateid: function() {
                return dictateid;
              }
            }
          });
          modalInstance.result.then(function(data) {
            $scope.commandShowContent = data;
          }, function() {});

        };
        $scope.toggleAnimation = function() {
          $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        $scope.open("400", $stateParams.DICTATEID);
      }
    }
    $scope.getCommandShowCtrl($stateParams.DICTATEID);
  })
//已结束- 密级指令验证界面
app.controller('overPasswordContrl', function($scope, $parse, $state, $uibModal, $uibModalInstance, $modalInstance, dictateid, dialogServer, commandShowCtrlSer) {
    //指令服务 密码验证
    $scope.password = null;
    $scope.check = function() {
      var commandShowList = commandShowCtrlSer.commandShowList(dictateid, $scope.password);
      commandShowList.then(function(data) {
        if (data.DICTATEID) {
          //密码正确返回给页面数据
          $uibModalInstance.close(data);
        } else {
          $scope.warning = data.message;
        }
      }, function(data) {
        var open = dialogServer.dialogWarn();
        open('400', {
          "data": data
        });
      })
    }
     $scope.close = function() {
      $uibModalInstance.close();
      history.go(-1);
    }
  })
/**
 * 待办指令查看
 * @param  {[type]} $scope         [description]
 * @return {[type]}                [description]
 */
app.controller('upcomingCommandShowCtrl', function($scope,$state, $stateParams, $uibModal, backlogSer,reportViewManagementSer, dialogServer) {
    $scope.dictateId = $stateParams.dictateId;
    //判断是否为密级指令并处理
    if ($stateParams.issecret == 0) {
      var orderList = reportViewManagementSer.queryCorpsDictateDetails($stateParams.dictateId);
      orderList.then(function(data) {
        if (data.DICTATEID) {
          $scope.contents = data;
          $scope.files = data.files;
          if (data.TYPE == 1) {
            $scope.type = "采访任务"
          }
          if (data.TYPE == 2) {
            $scope.type = "通知"
          }
          if (data.ISSECRET == 0) {
            $scope.isSecret = "否"
          }
          if (data.ISSECRET == 1) {
            $scope.isSecret = "是"
          }
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
    } else {
      //密级指令处理
      $scope.animationsEnabled = true;
      $scope.open = function(size, dictateid) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          backdrop:"static",
          templateUrl: 'common/dialog/password.html',
          controller: 'upcomingPasswordContrl',
          size: size,
          resolve: {
            dictateid: function() {
              return dictateid;
            }
          }
        });
        modalInstance.result.then(function(data) {
          $scope.contents = data;
          $scope.files = data.files;
          if (data.TYPE == 1) {
            $scope.type = "采访任务"
          }
          if (data.TYPE == 2) {
            $scope.type = "通知"
          }
          if (data.ISSECRET == 0) {
            $scope.isSecret = "否"
          }
          if (data.ISSECRET == 1) {
            $scope.isSecret = "是"
          }
        }, function() {});
      };
      $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
      $scope.open("400", $stateParams.dictateId);
    }
    //待办设置成完成
    $scope.task = function(corpsId){
     var perform = backlogSer.perform($stateParams.dictateId);
     perform.then(function(data) {
      if (data.result) {
        $scope.$emit("pressCorps:num");
        $state.go('command.reportDetailedview.reportViewManagement.list',
                 {"corpsId":corpsId,"orderType":"upcoming"}, {reload: false});
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
  })
//待办指令- 密级指令验证界面
app.controller('upcomingPasswordContrl', function($scope, $parse, $state, $uibModal, $uibModalInstance, $modalInstance, dictateid, dialogServer, reportViewManagementSer) {
    //指令服务 密码验证
    $scope.password = null;
    $scope.check = function() {
      var orderList = reportViewManagementSer.queryCorpsDictateDetails(dictateid, $scope.password);
      orderList.then(function(data) {
        if (data.DICTATEID) {
          //密码正确返回给页面数据
          $uibModalInstance.close(data);
        } else {
          $scope.warning = data.message;
        }
      }, function(data) {
        var open = dialogServer.dialogWarn();
        open('400', {
          "data": data
        });
      })
    }
    $scope.close = function() {
      $uibModalInstance.close();
      history.go(-1);
    }
  })
/**
 * 删除附件
 * @param  {[type]} $scope            [description]
 * @param  {[type]} reportViewMainSer [description]
 * @param  {[type]} dialogServer){                 $scope.deleteAccessory [description]
 * @param  {[type]} function(data){                                                             var open [description]
 * @return {[type]}                   [description]
 */
reportCtrl.controller('deleteAccessoryCtrl', function($scope,reportViewMainSer,dialogServer,$state){
  $scope.deleteAccessory = function(id){
       var result = reportViewMainSer.deleteAccessory(id);
       result.then(function(data){
            if(!result || data.result < 0){
              var open = dialogServer.dialogWarn();
              open('400', {
                "data": data
              });
            }else{
              $state.go(".",{
                "t":Math.random()
              })
            }
       },function(data){
            var open = dialogServer.dialogWarn();
            open('400', {
              "data": "连接中断！请检查是否登录。"
            });
       })
  }
})