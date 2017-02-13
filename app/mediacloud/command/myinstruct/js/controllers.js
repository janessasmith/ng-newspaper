var myinstructCtrl = angular.module('myinstruct.ctrl', [
  'myinstruct.ser',
  'myinstruct.dir'
]);

/**
 * 待办指令
 * @param  {[type]} $scope){                         } [description]
 * @return {[type]}           [description]
 */
app.controller('backlogCtrl', function($scope, backlogSer, dialogServer, $stateParams) {

    $scope.getbacklogList = function() {
      var params = {
          title: $stateParams.title,
          type: $stateParams.type
        }
        //今天待办
      var todayList = backlogSer.todayList(params);
      todayList.then(function(data) {
          if (angular.isArray(data.result)) {
            $scope.todayContents = data.result;
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
        //上阶段待办
      var upBenchList = backlogSer.upBenchList(params);
      upBenchList.then(function(data) {
        if (angular.isArray(data.result)) {
          $scope.upBenchContents = data.result;
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
    $scope.getbacklogList();

  })
  //实例化页面
app.controller('backlogCtrlInstance', function($scope, $modalInstance, $state, backlogSer, dialogServer, params) {

    $scope.ok = function() {
      var perform = backlogSer.perform(params.dictateid);
      perform.then(function(data) {
        var id = data.result;
        if (id > 0) {
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
      $modalInstance.close();
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  })
//待办指令- 密级指令验证界面
app.controller('blacklogPasswordContrl', function($scope, $parse, $state, $uibModal, $uibModalInstance, $modalInstance, dictateid, dialogServer, view_orderSer) {
    //指令服务 密码验证
    $scope.password = null;
    $scope.check = function() {
      var orderList = view_orderSer.view_orderList(dictateid, $scope.password);
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
      $state.go('command.myinstructBacklog.list', null, {
        reload: true
      });
    }
  })

/**
 * 待办指令查看
 * @param  {[type]} $scope         [description]
 * @return {[type]}                [description]
 */
app.controller('blacklog_detailsCtrl', function($scope,$state, $stateParams, $uibModal, backlogSer,view_orderSer, dialogServer) {
    $scope.dictateId = $stateParams.dictateId;
    //判断是否为密级指令并处理
    if ($stateParams.issecret == 0) {
      var orderList = view_orderSer.view_orderList($stateParams.dictateId);
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
            "data": data
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
          controller: 'blacklogPasswordContrl',
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
    $scope.task = function(){
     var perform = backlogSer.perform($stateParams.dictateId);
     perform.then(function(data) {
      var id = data.result;
      if (id > 0) {
        $state.go('command.myinstructBacklog.list', null, {
          reload: false
        });
        $scope.$emit("backlog:num");
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
  })

/**
 * 待办指令发送
 * @param  {[type]} $scope         [description]
 * @return {[type]}                [description]
 */
app.controller('blacklogforwardCtrl', function($scope, $state, $uibModal, $parse, $stateParams, $filter, dialogServer, forward_orderSer) {

    var orderList = forward_orderSer.forward_orderList($stateParams.dictateId);
    $scope.dictateId = $stateParams.dictateId;
    //指令对象
    $scope.params = {
      "title": null,
      "content": null,
      "forwardId": null,
      "overTime": null,
      "isSecret": null,
      "notifications": null,
      "userIds": null,
      "type": null,
      "fileNames": new Array()
    }
    orderList.then(function(data) {
        if (angular.isObject(data)) {
          //指令类型分类初始化
          $scope.dirTypes = [{
            "id": 1,
            "name": "采访任务"
          }, {
            "id": 2,
            "name": "通知"
          }];
          var innertype = data.TYPE - 1;
          $scope.dirType = $scope.dirTypes[innertype];
          //默认选择通知方式
          var arraynotifications = data.NOTIFICATIONS.split(",");
          for (var i = 0; i < arraynotifications.length; i++) {
            if (arraynotifications[i] == 1) {
              $scope.wx = 1;
            }
            if (arraynotifications[i] == 2) {
              $scope.app = 2;
            }
            if (arraynotifications[i] == 3) {
              $scope.dx = 3;
            }
          }
          $scope.dataList = data;
          $scope.params.forwardId = data.FORWARDID;
          $scope.params.title = data.TITLE;
          $scope.params.content = data.CONTENT;
          $scope.params.overTime = data.OVERTIME;
          $scope.params.isSecret = data.ISSECRET;
          $scope.params.type = $scope.dirType.id;
          $scope.params.fileNames = data.files;
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

    $scope.formats = ['yyyy-MM-dd HH:mm:ss', 'yyyy/MM/dd', 'yyyy年MM月dd', 'shortDate'];
    $scope.format = $scope.formats[0];

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
    //发布指令
    $scope.sendDir = function() {
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
        $scope.params.notifications = notifications.substr(0, notifications.length - 1);
        $scope.params.overTime = $filter('date')($scope.params.overTime, "yyyy-MM-dd");
        var dirId = forward_orderSer.sendDir($scope.params);
        dirId.then(function(data) {
          var id = data.result;
          if (id > 0) {
            $state.go('command.myinstructBacklog.list');
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
      //取消转发
    $scope.cancelDir = function() {
        $state.go('command.myinstructBacklog.list');
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
 * 已结束
 * @param  {[type]} $scope         [description]
 * @param  {[type]} finishSer)     {               $scope.getfinishList [description]
 * @param  {[type]} function(data) {                                                    console.log(data);      })    }    $scope.getfinishList();  } [description]
 * @return {[type]}                [description]
 */
app.controller('finishCtrl', function($scope, $uibModal, $state, dialogServer, finishSer, $stateParams) {
    //翻页设置
    $scope.PageIndex =1;
    $scope.pageCount =1;
    $scope.getfinishList = function(status) {
      var params = {
        title: $stateParams.title,
        type: $stateParams.type,
        PageSize:10,
        PageIndex:$scope.PageIndex
      }
      var finishList = finishSer.finishList(params);
      finishList.then(function(data) {
        if (angular.isArray(data.result)) {
          $scope.finishContents = data.result;
          $scope.pageInfo = data.pageInfo;
          $scope.pageCount = data.pageInfo.pageCount;
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
    }
    $scope.getfinishList();
    $scope.reduce = function()
    { 
      if($scope.PageIndex-1<=0)return ;
      $scope.PageIndex = $scope.PageIndex-1;
      $scope.getfinishList();
    }
    $scope.add = function()
    { 
      if($scope.PageIndex+1>$scope.pageCount)return;
      $scope.PageIndex = $scope.PageIndex+1;
      $scope.getfinishList();
    }
  })

//已结束- 密级指令验证界面
app.controller('finishPasswordContrl', function($scope, $parse, $state, $uibModal, $uibModalInstance, $modalInstance, dictateid, dialogServer, commandShowCtrlSer) {
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
      $state.go('command.myinstructFinish.list', null, {
        reload: true
      });
    }
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
app.controller('journalReadlCtrl', function($rootScope, $parse, $scope, $uibModal, $log) {
    $scope.animationsEnabled = true;
    //$rootScope.journalReadlCtrl = true;(暂去)
    //2.1 调用open打开弹出窗
    $scope.open = function(size, $event, channelId) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'common/dialog/journal.html',
        controller: 'journalReadlCtrlInstance',
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
app.controller('journalReadlCtrlInstance', function($rootScope, $scope, $state, $log, $uibModalInstance, journalReadSer, dialogServer, channelId) {
    var journalList = journalReadSer.journalList(channelId);
    journalList.then(function(data) {
      if (angular.isArray(data.result)) {
        $scope.journalContents = data.result;
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
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  })

/**
 * 已结束——已结束转待办
 * @param  {[type]} $rootScope [description]
 * @param  {[type]} $parse     [description]
 * @param  {[type]} $scope     [description]
 * @param  {[type]} $uibModal  [description]
 * @param  {[type]} $log)      {               $scope.animationsEnabled [description]
 * @return {[type]}            [description]
 */
app.controller('remindCtrl', function($rootScope, dialogServer, $parse, $scope, $uibModal, $log) {
    $scope.animationsEnabled = true;
    $scope.open = function(size, $event, channelId, $index) {
      var open = dialogServer.dialogVerify();
      open('400', {
        "dictateId": channelId,
        "index": $index,
        "ctrlInstance": "remindCtrlInstance",
        "message": "是否设置为 待办指令？"
      });
    };
  })

//实例化页面remindSer
app.controller('remindCtrlInstance', function($rootScope, $scope, $state, $log, $uibModalInstance, dialogServer, remindSer, params) {
    $scope.index = params.index;
    $scope.ok = function() {
      var remindList = remindSer.remindList(params.dictateId);
      remindList.then(function(data) {
        $uibModalInstance.dismiss('cancel');
        $state.go("command.myinstructFinish.list", {
          "t": Math.random()
        });
      }, function(data) {
        var open = dialogServer.dialogWarn();
        open('400', data);
      })
    };
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  })

/**
 * 已结束指令查看
 * @param  {[type]} $scope              [description]
 * @param  {[type]} $stateParams        [description]
 * @param  {[type]} commandShowCtrlSer) {               $scope.getCommandShowCtrl [description]
 * @param  {[type]} function(data)      {                                                         console.log(data);      })    }    $scope.getCommandShowCtrl($stateParams.DICTATEID);  } [description]
 * @return {[type]}                     [description]
 */
app.controller('commandShowCtrl', 
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
            controller: 'finishPasswordContrl',
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

/**
 * 我发起的
 * @param  {[type]} $scope         [description]
 * @param  {[type]} myLaunchSer)   {               $scope.getmyLaunchList [description]
 * @param  {[type]} function(data) {                                                      console.log(data);      })    }    $scope.getmyLaunchList(1,2);  } [description]
 * @return {[type]}                [description]
 */
app.controller('myLaunchCtrl', function($scope, $state, $uibModal, dialogServer, myLaunchSer, $stateParams) {
    //翻页设置
    $scope.PageIndex =1;
    $scope.pageCount =1;
    $scope.type = null;
    $scope.overType = null;
    $scope.getmyLaunchList = function(statusType, statusOverType,mark) {
      //新查询 初始化当前页数
      if(mark==1)
      {
        $scope.PageIndex =1;
      }
      $scope.type = statusType;
      $scope.overType = statusOverType;
      var params = {
        title: $scope.title,
        type: $scope.type,
        overType: $scope.overType,
        PageSize: 10,
        PageIndex: $scope.PageIndex
      }
      var myLaunchList = myLaunchSer.myLaunchList(params);
      myLaunchList.then(function(data) {
        if (angular.isArray(data.result)) {
          $scope.myLaunchContents = data.result;
          $scope.pageInfo = data.pageInfo;
          $scope.pageCount = data.pageInfo.pageCount;
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
    }
    $scope.getmyLaunchList('',2,1);
    //上下页 跳转
    $scope.reduce = function()
    { 
      if($scope.PageIndex-1<=0)return ;
      $scope.PageIndex = $scope.PageIndex-1;
      $scope.getmyLaunchList($scope.type,$scope.overType);
    }
    $scope.add = function()
    { 
      if($scope.PageIndex+1>$scope.pageCount)return;
      $scope.PageIndex = $scope.PageIndex+1;
      $scope.getmyLaunchList($scope.type,$scope.overType);
    }
  })
//我发起的- 密级指令验证界面
app.controller('launchPasswordContrl', function($scope, $parse, $state, $uibModal, $uibModalInstance, $modalInstance, dictateid, dialogServer, myLaunchCommandShowCtrlSer) {
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
      $state.go('command.myinstructMyLaunch.list', null, {
        reload: true
      });
    }
  })

/**
 * 已读，未读，已完成
 * @param  {[type]} $scope                      [description]
 * @param  {[type]} myLaunchCommandShowCtrlSer) {               $scope.getMyLaunchViewCtrl [description]
 * @param  {[type]} function(data)              {                                                          console.log(data);      })    }  } [description]
 * @return {[type]}                             [description]
 */
app.controller('myLaunchViewCtrl', function($scope, $uibModal, dialogServer, myLaunchCommandUserSer) {

    $scope.openMessage = function(userId) {
      var open = dialogServer.dialogMessage();
      open('600', userId, 1);
    }

    $scope.getMyLaunchViewCtrl = function(status, readType) {
      var params = status;
      var type = readType;
      var myLaunchCommandShowList = myLaunchCommandUserSer.myLaunchCommandUserList(params);
      myLaunchCommandShowList.then(function(data) {
        if (angular.isObject(data)) {
          if (type == 'noRead') {
            $scope.commandShowContents = data.noRead;
          } else if (type == 'read') {
            $scope.commandShowContents = data.read;
          } else if (type == 'over') {
            $scope.commandShowContents = data.over;
          }
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
    }
  })

/**
 * 我发起的——操作日志查询
 * @param  {[type]} $rootScope [description]
 * @param  {[type]} $parse     [description]
 * @param  {[type]} $scope     [description]
 * @param  {[type]} $uibModal  [description]
 * @param  {[type]} $log)      {               $scope.animationsEnabled [description]
 * @return {[type]}            [description]
 */
app.controller('mylaunchjournalReadlCtrl', function($rootScope, $parse, $scope, $uibModal, $log) {
    $scope.animationsEnabled = true;
    $scope.open = function(size, $event, channelId) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'common/dialog/journal.html',
        controller: 'mylaunchjournalReadlCtrlInstance',
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
app.controller('mylaunchjournalReadlCtrlInstance', function($rootScope, $scope, $state, $log, $uibModalInstance, mylaunchjournalReadSer, dialogServer, channelId) {
    var journalList = mylaunchjournalReadSer.journalList(channelId);
    journalList.then(function(data) {
      if (angular.isArray(data.result)) {
        $scope.journalContents = data.result;
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
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  })

/**
 * 指令查看（我发起方的单条）
 * @param  {[type]} $scope                      [description]
 * @param  {[type]} $stateParams                [description]
 * @param  {[type]} myLaunchCommandShowCtrlSer) {               $scope.getCommandShowCtrl [description]
 * @param  {[type]} function(data)              {                                                         console.log(data);      })    }    $scope.getCommandShowCtrl($stateParams.DICTATEID);  } [description]
 * @return {[type]}                             [description]
 */
app.controller('launchCommandShowCtrl', function($scope, $stateParams, $parse, $uibModal, dialogServer, myLaunchCommandShowCtrlSer) {
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
          controller: 'launchPasswordContrl',
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

/**
 * 指令撤回
 * @param  {[type]} $rootScope   [description]
 * @param  {[type]} $parse       [description]
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $stateParams [description]
 * @param  {[type]} $uibModal    [description]
 * @param  {[type]} $log)        {               $scope.animationsEnabled [description]
 * @return {[type]}              [description]
 */
app.controller('revokeCtrl', function($rootScope, $parse, $scope, $stateParams, $uibModal, $log) {
    $scope.animationsEnabled = true;
    //$rootScope.revokeCtrl = true;(暂去)
    //2.1 调用open打开弹出窗
    $scope.open = function(size, $event, channelId) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'common/dialog/revokeRemind.html',
        controller: 'revokeCtrlInstance',
        size: size,
        resolve: {
          channelId: function() {
            return $stateParams.DICTATEID;
          }
        }
      });
    };
    $scope.toggleAnimation = function() {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };
  })
//实例化页面revokeSer
app.controller('revokeCtrlInstance', function($rootScope, $scope, $state, $log, $uibModalInstance, dialogServer, revokeSer, channelId) {
  $scope.determine = function() {
    var revokeList = revokeSer.revokeList(channelId);
    revokeList.then(function(data) {
      var id = data.result;
      if (id > 0) {
        $uibModalInstance.dismiss('cancel');
        $state.go('command.myinstructMyLaunch.list', null, {
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
      open('400', data);
    })
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
})

//提醒未读(未完)
app.controller('noReadRemindCtrl', function($rootScope, $parse, $scope, $stateParams, $uibModal, $log) {
    $scope.animationsEnabled = true;
    //$rootScope.noReadRemindCtrl = true;(暂去)
    //2.1 调用open打开弹出窗
    $scope.open = function(size, $event, channelId) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'common/dialog/noReadRemind.html',
        controller: 'noReadRemindCtrlInstance',
        size: size,
        resolve: {
          channelId: function() {
            return $stateParams.DICTATEID;
          }
        }
      });
    };
    $scope.toggleAnimation = function() {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };
  })
  //实例化页面revokeSer(未完)
app.controller('noReadRemindCtrlInstance', function($rootScope, $scope, $state, $log, $uibModalInstance, channelId) {
  // $scope.determine = function() {
  //   var revokeList = revokeSer.revokeList(channelId);
  //   revokeList.then(function(data) {
  //     console.log("成功撤回！");
  //     $uibModalInstance.dismiss('cancel');
  //   }, function(data) {
  //     console.log("成功失败！");
  //   })
  // };
  $scope.determine = function() {

    if ($scope.selFormWx) {
      alert("title:" + $scope.selFormWx);
    } else {
      alert("未选择");
    }
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
})

/**
 *草稿箱列表查询
 * @param  {[type]} $scope         [description]
 * @param  {[type]} draftSer)      {                                       var draftsList [description]
 * @param  {[type]} function(data) {                   conlose.log(data);                                })    function pitch(Obj){                var collid [description]
 * @return {[type]}                [description]
 */
app.controller('draftsCtrl', function($parse, $log, $scope, $uibModal, $state, draftSer, dialogServer, $stateParams) {
    //翻页设置
    $scope.PageIndex =1;
    $scope.pageCount =1;
    //列表查询
    $scope.getdraftsList = function() {
      var params = {
        PageIndex:$scope.PageIndex,
        PageSize: 10,
        title: $stateParams.title,
        type: $stateParams.type
      }

      var draftsList = draftSer.querydraft(params);
      draftsList.then(function(data) {
        if (angular.isObject(data)) {
          $scope.contents = data.result;
          $scope.pageInfo = data.pageInfo;
          $scope.pageCount = data.pageInfo.pageCount;
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
    $scope.getdraftsList();
    //翻页
    $scope.reduce = function()
    { 
      if($scope.PageIndex-1<=0)return ;
      $scope.PageIndex = $scope.PageIndex-1;
      $scope.getdraftsList();
    }
    $scope.add = function()
    { 
      if($scope.PageIndex+1>$scope.pageCount)return;
      $scope.PageIndex = $scope.PageIndex+1;
      $scope.getdraftsList();
    }

    $scope.x = false;
    $scope.master = false;
    var flag = false;
    var dictateIds = "";
    //全选
    $scope.all = function(master, contents) {
        dictateIds = "";
        if (master) {
          for (var i = 0; i < contents.length; i++) {
            dictateIds = dictateIds + contents[i].DICTATEID + ",";
          }
        }
        flag = true;
      }
      //单选
    $scope.chk = function(c, x) {
      if (x) {
        dictateIds = dictateIds + c + ",";
      } else if($scope.master){
        $scope.master = false;
        dictateIds = dictateIds.replace(c + ",", "");
      } else {
        dictateIds = dictateIds.replace(c + ",", "");
      }
    }

    //多选删除
    $scope.multipleDel = function() {
        if (!dictateIds) {
          alert("至少选择一条指令！")
          return;
        };
        dictateIds.substr(0, dictateIds.length - 1);
        var open = dialogServer.dialogVerify();
        open('400', {
          "dictateid": dictateIds,
          "ctrlInstance": "draftsCtrlInstance",
          "message":"确认删除？"
        });
      }
      //单选删除
    $scope.oneDel = function(dictateId) {
      var open = dialogServer.dialogVerify();
      open('400', {
        "dictateid": dictateId,
        "ctrlInstance": "draftsCtrlInstance",
        "message":"确认删除？"
      });
    }
  })
//草稿箱-实例化密级指令验证
app.controller('draftspasswordContrl', function($scope, $state, dictateid, $uibModalInstance, $modalInstance, draftsDetailSer, dialogServer) {
  //指令服务 密码验证
  $scope.password = null;
  $scope.check = function() {
    var commandShowList = draftsDetailSer.querydraftsDetail(dictateid, $scope.password);
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
    $state.go('command.myinstructDrafts.list', null, {
          reload: true
        });
  }
})

//草稿箱-实例化删除页面
app.controller('draftsCtrlInstance', function($scope, $state, $rootScope, $modalInstance, $log, delSer, params, dialogServer) {

    $scope.ok = function() {
      //调用删除账号服务
      var draftDelList = delSer.querydraftDel(params.dictateid);

      draftDelList.then(function(data) {
        if (data.result) {
          $scope.contents = data.result;
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
      $modalInstance.close();
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  })

/**
 * 草稿箱详情
 * @param  {[type]} $scope        [description]
 * @param  {[type]} crerteDirSer) {                     $scope.today [description]
 * @param  {[type]} 'yyyy/MM/dd'  [description]
 * @param  {[type]} 'yyyy年MM月dd'  [description]
 * @param  {[type]} 'shortDate'];                 $scope.format [description]
 * @return {[type]}               [description]
 */
app.controller('draftsDetailCtrl', function($scope, $state, $stateParams, $uibModal, draftsDetailSer, dialogServer, draftsDetailSer, $filter,checkSer) {
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

  $scope.formats = ['yyyy-MM-dd HH:mm:ss', 'yyyy/MM/dd', 'yyyy年MM月dd', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.disabled = function(date, mode) {
    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.params = {
      notifications: null,
      userIds: null,
      delFileIds: "",
      fileNames: new Array(),
      newFileNames: new Array()
    }
    //指令详情(判断是否密级)
  if ($stateParams.issecret == 0) {
    var commandShowList = draftsDetailSer.querydraftsDetail($stateParams.dictateId);
    commandShowList.then(function(data) {
      if (data.DICTATEID) {
        //指令类型分类初始化
        $scope.dirTypes = [{
          "id": 1,
          "name": "采访任务"
        }, {
          "id": 2,
          "name": "通知"
        }];
        var innertype = data.TYPE - 1;
        $scope.dirType = $scope.dirTypes[innertype];
        //选择通知方式
        var arraynotifications = data.NOTIFICATIONS.split(",");
        for (var i = 0; i < arraynotifications.length; i++) {
          if (arraynotifications[i] == 1) {
            $scope.wx = 1;
          }
          if (arraynotifications[i] == 2) {
            $scope.app = 2;
          }
          if (arraynotifications[i] == 3) {
            $scope.dx = 3;
          }
        }
        $scope.dirObj = data;
        $scope.params.dictateId = data.DICTATEID;
        $scope.params.title = data.TITLE;
        $scope.params.content = data.CONTENT;
        $scope.params.overTime = data.OVERTIME;
        $scope.params.isSecret = data.ISSECRET;
        $scope.params.type = $scope.dirType.id;
        $scope.files = data.files;
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
  } else {
    //密级指令处理页面
    $scope.animationsEnabled = true;
    $scope.open = function(size, dictateid) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        backdrop:"static",
        templateUrl: 'common/dialog/password.html',
        controller: 'draftspasswordContrl',
        size: size,
        resolve: {
          dictateid: function() {
            return dictateid;
          }
        }
      });

      modalInstance.result.then(function(data) {
        //指令类型分类初始化
        $scope.dirTypes = [{
          "id": 1,
          "name": "采访任务"
        }, {
          "id": 2,
          "name": "通知"
        }];
        var innertype = data.TYPE - 1;
        $scope.dirType = $scope.dirTypes[innertype];
        //选择通知方式
        var arraynotifications = data.NOTIFICATIONS.split(",");
        for (var i = 0; i < arraynotifications.length; i++) {
          if (arraynotifications[i] == 1) {
            $scope.wx = 1;
          }
          if (arraynotifications[i] == 2) {
            $scope.app = 2;
          }
          if (arraynotifications[i] == 3) {
            $scope.dx = 3;
          }
        }
        $scope.dirObj = data;
        $scope.params.dictateId = data.DICTATEID;
        $scope.params.title = data.TITLE;
        $scope.params.content = data.CONTENT;
        $scope.params.overTime = data.OVERTIME;
        $scope.params.isSecret = data.ISSECRET;
        $scope.params.type = $scope.dirType.id;
        $scope.files = data.files;
      }, function() {});
    };

    $scope.toggleAnimation = function() {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };
    $scope.open("400", $stateParams.dictateId);

  }
  //取消
  $scope.cancel = function(){
    $state.go('command.myinstructDrafts.list', null, {
      reload: true
    });
  }

  //重发/送审 0送审 1重发
  $scope.send = function(type) {

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
    $scope.params.notifications = notifications.substr(0, notifications.length - 1);
    $scope.params.delFileIds = $scope.params.delFileIds.substr(0, $scope.params.delFileIds.length - 1);
    $scope.params.overTime = $filter('date')($scope.params.overTime, "yyyy-MM-dd");
    $scope.params.type = $scope.dirType.id;
    $scope.params.newFileNames = $scope.params.fileNames;
    delete $scope.params.fileNames;
    var dirId;
    if(type==1){//重发
        dirId = draftsDetailSer.querydraftsResend($scope.params);
    }
    if(type==0){//送审
        dirId = checkSer.sendCheck($scope.params);
    }
   
    dirId.then(function(data) {
      if (data.result) {
        $state.go('command.myinstructDrafts.list', null, {
          reload: false
        });
        $scope.params = data.result;
        $scope.$emit("backlog:num");
      } else {
        console.log(data);
        var open = dialogServer.dialogWarn();
        open('400', data.message);
      }
    }, function(data) {
      var open = dialogServer.dialogWarn();
      open('400', data);
    })
  }

  //人员选择
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
 * 审核列表
 * @param  {[type]} $scope){                   }] [description]
 * @return {[type]}           [description]
 */
app.controller('checkCtrl', ['$stateParams','$scope','checkSer','dialogServer', 
    function($stateParams,$scope,checkSer,dialogServer){
    //翻页设置
    $scope.PageIndex =1;
    $scope.pageCount =1;
    //列表查询
    $scope.getcheckList = function(status) {
      var params = {
        PageIndex:$scope.PageIndex,
        PageSize: 10,
        title: $stateParams.title,
        type: $stateParams.type,
        status:status
      }

      var checkList = checkSer.queryCheck(params);
      checkList.then(function(data) {
        if (angular.isObject(data)&&data.status!=-1) {
          $scope.contents = data.result;
          $scope.pageInfo = data.pageInfo;
          $scope.pageCount = data.pageInfo.pageCount;
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
    $scope.getcheckList(0);
}])

/**
 * 审核详情页
 * @param  {[type]} $scope){               }] [description]
 * @return {[type]}           [description]
 */
app.controller('checkDetailCtrl', ['$stateParams','$scope','checkSer','dialogServer', '$uibModal','$state',
    function($stateParams,$scope,checkSer,dialogServer,$uibModal,$state){
      //配置编辑默认参数  
      $scope.config = {
        initialFrameHeight: 200
      }

      //指令详情
      function queryDetail(){
          var details = checkSer.queryDetail($stateParams.dictateId);
          details.then(function(data){
               if(angular.isObject(data)&&data.status!=-1){
                    $scope.contents = data;
               }else{
                  var open = dialogServer.dialogWarn();
                  open('400', {
                    "data": data.message
                  });
               }
          },function(data){
                  var open = dialogServer.dialogWarn();
                  open('400', {
                    "data": data
                  });
          })
      }
      queryDetail();
     
     //通过
     $scope.ok = function(){
        checkSer.updateCheck($scope.contents).then(function(data){
              if(!data.result){
                  var open = dialogServer.dialogWarn();
                  open('400', {
                    "data": data.message
                  });
              }else{
                  $state.go("command.myinstructCheck.list");
                  $scope.$emit("backlog:num");
              }
        },function(data){
              var open = dialogServer.dialogWarn();
              open('400', {
                "data": data
              });
        })
     } 

     //返工
     $scope.rework = function(size){
        $scope.animationsEnabled = true;
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'common/dialog/rework.html',
          controller: 'reworkInstance',
          size: size,
          resolve: {
            items: function () {
              return $scope.contents.DICTATEID;
            }
          }
        });
     }

}])

app.controller('reworkInstance', ['$scope','$modalInstance','$uibModalInstance','checkSer','items','dialogServer','$state', 
    function($scope,$modalInstance,$uibModalInstance,checkSer,items,dialogServer,$state){
      $scope.ok = function(){
    	  if($scope.suggestion!=''&&$scope.suggestion!=null){
              var dictateId = items;
              checkSer.rework(dictateId,$scope.suggestion).then(function(data){
                      if(!data.result){
                          var open = dialogServer.dialogWarn();
                          open('400', {
                            "data": data.message
                          });
                      }else{
                        $state.go("command.myinstructCheck.list");
                        $scope.$emit("backlog:num");
                      }
                    },function(data){
                          var open = dialogServer.dialogWarn();
                          open('400', {
                            "data": data
                          });
                    });
              $modalInstance.close();
            }else{
              alert('返工意见不能为空！');
            } 
      }
      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
}])
/**
 * 指令翻阅列表
 * @param  {[type]} $scope){                   }] [description]
 * @return {[type]}           [description]
 */
app.controller('browseCtrl', ['$stateParams','$scope','browseSer','dialogServer', 
                              function($stateParams,$scope,browseSer,dialogServer){
    //翻页设置
    $scope.PageIndex =1;
    $scope.pageCount =1;
    //列表查询
    $scope.statusType = 1;
    $scope.exGetBrowseList = function(status){
        $scope.PageIndex =1;
        $scope.pageCount =1;
        statusType = status;
        $scope.getBrowseList(status);
    }
    $scope.getBrowseList = function(status) {
      var params = {
        PageIndex:$scope.PageIndex,
        PageSize: 10,
        title: $stateParams.title,
        type: $stateParams.type,
        overType:status
      }

      var browseList = browseSer.queryBrowse(params);
      browseList.then(function(data) {
        if (angular.isObject(data)&&data.status!=-1) {
          $scope.contents = data.result;
          $scope.pageInfo = data.pageInfo;
          $scope.pageCount = data.pageInfo.pageCount;
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
     $scope.reduce = function()
    { 
      if($scope.PageIndex-1<=0)return ;
      $scope.PageIndex = $scope.PageIndex-1;
      $scope.getBrowseList($scope.statusType);
    }
    $scope.add = function()
    { 
      if($scope.PageIndex+1>$scope.pageCount)return;
      $scope.PageIndex = $scope.PageIndex+1;
      $scope.getBrowseList($scope.statusType);
    }
    $scope.getBrowseList(1);
}])
/**
 * 指令翻阅详情页
 * @param  {[type]} $scope){               }] [description]
 * @return {[type]}           [description]
 */
app.controller('browseDetailCtrl', ['$stateParams','$scope','$sce','browseSer','dialogServer', '$uibModal','$state',
    function($stateParams,$scope,$sce,browseSer,dialogServer,$uibModal,$state){
      //配置编辑默认参数  
      $scope.config = {
        initialFrameHeight: 200
      }

      //指令详情
      function queryDetail(){
          var details = browseSer.queryDetail($stateParams.dictateId);
          details.then(function(data){
               if(angular.isObject(data)&&data.status!=-1){
                    $scope.contents = data;
                    $scope.contHtml = $sce.trustAsHtml(data.CONTENT);
               }else{
                  var open = dialogServer.dialogWarn();
                  open('400', {
                    "data": data.message
                  });
               }
          },function(data){
                  var open = dialogServer.dialogWarn();
                  open('400', {
                    "data": data
                  });
          })
      }
      queryDetail();

}])