var  commandSer = angular.module('command.ser', []);
/**
 * ajax交互
 * @param  {[type]} $q     [description]
 * @param  {Object} $http) {		var       service [description]
 * @return {[type]}        [description]
 */
commandSer.factory('trshttpServer', ['$q', '$http','$window', function($q, $http,$window) {
	var service = {};
	//与后台交互
	service.httpServer = function(url, options, params) {
		var deferred = $q.defer();

		var method = options.method;
		if (!method || method != "get" && method != "post") {
			deferred.reject("无效的【" + method + "】参数.");
			return deferred.promise;
		}

		$http({
			method: method,
			url: url,
			data:params,
			headers: {
                'distributionType':1
            }
		}).success(function(data,status, headers, config) {
			if(headers("TRSNotLogin")){
               $window.location.href = "/mediacube/#/login";
               return;
			}
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject("连接异常！");
		});
		return deferred.promise;
	}
	return service;
}]);

/**
 * 弹窗
 * @param  {[type]} ){			tt: function(){								var animationsEnabled [description]
 * @return {[type]}           [description]
 */
commandSer.factory('dialogServer', function($uibModal) {
		var service = {};
		//确认弹出框
		service.dialogVerify = function() {
				var animationsEnabled = true;
				var open = function(size, obj) {
					var modalInstance = $uibModal.open({
						animation: animationsEnabled,
						template: "<div class=\"qf-pop-box\">" +
							"<div class=\"popup-box qf-box\">" +
							"<div class=\"popup-top\">" +
							"<span class=\"tx-wd-box lf\"></span>" +
							"<a href=\"javascript:;\" class=\"popup-close-btn rt\" ng-click=\"cancel();\"></a>" +
							"</div>" +
							"<div class=\"popup-con\">" +
							"<div class=\"sf-ch-sp\">" +
							"<div class=\"sf-ch-icon\" style=\"width: 330px;text-align:center;\">" +
							"<span>" + obj.message + "</span>" +
							"</div>" +
							"</div>" +
							"<div class=\"popup-btn-bk\">" +
							"<div class=\"bnt-bk-verify\" changes>" +
							"<a href=\"javascript:;\" class=\"popup-btn-yes\" ng-click=\"ok();\">是</a>" +
							"<a href=\"javascript:;\" class=\"popup-btn-no\" ng-click=\"cancel();\">否</a>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"</div>",
						controller: obj.ctrlInstance,
						size: size,
						resolve: {
							params: function() {
								return obj;
							}
						}
					});
				};
				var toggleAnimation = function() {
					animationsEnabled = !animationsEnabled;
				};
				return open;
			},
			//错误提示框
			service.dialogWarn = function() {
				var animationsEnabled = true;
				var open = function(size, obj) {
					var modalInstance = $uibModal.open({
						animation: animationsEnabled,
						template: "<div class=\"popup-box qf-box\">" +
							"<div class=\"popup-con\">" +
							"<div class=\"dialog-warn\">" +
							"<div class=\"sf-ch-icon\">" +
							"<img src=\"../common/images/c.png\"/>" +
							"</div>" +
							"<span class=\"dialog-warn-content\">"+obj.data+"</span>" +
							"</div>" +
							"<div class=\"popup-btn-bk\">" +
							"<div class=\"bnt-bk-warn\">" +
							"<a href=\"javascript:;\" class=\"popup-btn-warn\" ng-click=\"cancel();\">确认</a>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"</div>",
						controller: "dialogWarnCtr",
						size: size,
						resolve: {
							params: function() {
								return obj;
							}
						}
					});
				};
				var toggleAnimation = function() {
					animationsEnabled = !animationsEnabled;
				};
				return open;
			},
			//聊天窗口
			service.dialogMessage = function() {
				var animationsEnabled = true;
				var open = function(size, userId, type) {
					var modalInstance = $uibModal.open({
						animation: animationsEnabled,
						template: '<message></message>',
						controller: "dialogMessageCtr",
						size: size,
						resolve: {
							params: function() {
								return {
									"id": userId,
									"type": type
								}
							}
						}
					});
				};
				var toggleAnimation = function() {
					animationsEnabled = !animationsEnabled;
				};
				return open;
			}
		return service;
	})
	//错误框关闭
commandSer.controller('dialogWarnCtr', function($scope, $uibModalInstance, params) {
		$scope.data = params.data;
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	})
	//聊天窗口
commandSer.controller('dialogMessageCtr', function($scope, $uibModalInstance, messageSer, params) {
	$scope.id = params.id;
	$scope.type = params.type;
	//关闭窗口
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
})

/**
 * 聊天相关
 * @param  {Object} trshttpServer) {		var       service [description]
 * @return {[type]}                [description]
 */
commandSer.factory('messageSer', function($compile,trshttpServer) {
	var service = {};
	//获取用户基本信息
	service.getUserInformation = function(userId) {
		var params = {
			"serviceid": "im_imtalk",
			"methodName": "queryUserInfoToJson"
		}
		delete params.userId;
		if (userId) {
			params.userId = userId;
		}
		return trshttpServer.httpServer('/wcm/rbcenter.do', {
			"method": "post"
		}, params);
	}
	//重新用户token
	service.getUserTokenToJson = function() {
		var params = {
			"serviceid": "im_imtalk",
			"methodName": "getUserTokenToJson"
		}
		return trshttpServer.httpServer('/wcm/rbcenter.do', {
			"method": "post"
		}, params);
	}
	//获取用户信息和未读总条数
	service.queryUnreadMessageCountsToJson = function() {
		var params = {
			"serviceid": "im_imtalk",
			"methodName": "queryUnreadMessageCountsToJson"
		}
		return trshttpServer.httpServer('/wcm/rbcenter.do', {
			"method": "post"
		}, params);
	}
	//获取用户信息和未读条数
	service.queryUnreadMessageByIdToJson = function(userId,type) {
		var params = {
			"serviceid": "im_imtalk",
			"methodName": "queryUnreadMessageByIdToJson"
		}
		delete params.userId;
		delete params.type,
		params.targetId  = userId;
		if(type==1){
			params.type = 1;
		}
		if(type==3){
			params.type = 2;
		}
		return trshttpServer.httpServer('/wcm/rbcenter.do', {
			"method": "post"
		}, params);
	}
	//发送单聊消息
	service.sendOneMessage = function(obj) {
		var params = {
			"serviceid": "im_imtalk",
			"methodName": "publishPrivateMessageToJson"
		}
		angular.extend(params, obj);
		return trshttpServer.httpServer('/wcm/rbcenter.do', {
			"method": "post"
		}, params);
	}
	//发送群聊消息
	service.sendGroupMessage = function(obj) {
		var params = {
			"serviceid": "im_imtalk",
			"methodName": "publishGroupMessageToJson"
		}
		angular.extend(params, obj);
		return trshttpServer.httpServer('/wcm/rbcenter.do', {
			"method": "post"
		}, params);
	}
	//查询群组信息
	service.queryGroupInfo = function(groupId) {
		var params = {
			"serviceid": "im_imtalk",
			"methodName": "queryGroupInfoToJson"
		}
		params.groupId = groupId;
		return trshttpServer.httpServer('/wcm/rbcenter.do', {
			"method": "post"
		}, params);
	}
	//查询离线消息
	service.queryAllUnreadMessage = function(targetId,type){
		var params = {
			"serviceid": "im_imtalk",
			"methodName": "queryAllUnreadMessageToJson",
			"targetId": targetId,
			"type": type
		}
		return trshttpServer.httpServer('/wcm/rbcenter.do', {
			"method": "post"
		}, params);
	}
	// // 连接融云服务器。
	// service.initIm = function(token) {
	// 	RongIMLib.RongIMClient.connect(token, {
	// 		onSuccess: function(userId) {
	// 			console.log("Login successfully." + userId);
	// 		},
	// 		onTokenIncorrect: function() {
	// 			console.log('token无效');
	// 		},
	// 		onError: function(errorCode) {
	// 			var info = '';
	// 			switch (errorCode) {
	// 				case RongIMLib.ErrorCode.TIMEOUT:
	// 					info = '超时';
	// 					break;
	// 				case RongIMLib.ErrorCode.UNKNOWN_ERROR:
	// 					info = '未知错误';
	// 					break;
	// 				case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
	// 					info = '不可接受的协议版本';
	// 					break;
	// 				case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
	// 					info = 'appkey不正确';
	// 					break;
	// 				case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
	// 					info = '服务器不可用';
	// 					break;
	// 			}
	// 			console.log(errorCode);
	// 		}
	// 	});

	// 	RongIMLib.RongIMClient.setConnectionStatusListener({
	// 		onChanged: function(status) {
	// 			switch (status) {
	// 				//链接成功
	// 				case RongIMLib.ConnectionStatus.CONNECTED:
	// 					console.log('链接成功');
	// 				//获取未读取聊天
 //                    RongIMLib.RongIMClient.getInstance().getConversationList({
 //                        onSuccess: function(list) {
 //                       //list 会话列表
	//                    $(".ls-xx").empty();
	//                    for(var i=0;i<list.length;i++){
	//                    	var usrlist="<usrlist id="+list[i].targetId+"></usrlist>";
	//                    	$(".ls-xx").append($compile(usrlist)($scope));                   
	//                    }
	//                },
	//                onError: function(error) {
	// 			     //GetConversationList error
	// 			     console.log(list);
	// 			 }
	// 			},null);
	// 					break;
	// 					//正在链接
	// 				case RongIMLib.ConnectionStatus.CONNECTING:
	// 					console.log('正在链接');
	// 					break;
	// 					//重新链接
	// 				case RongIMLib.ConnectionStatus.DISCONNECTED:
	// 					console.log('断开连接');
	// 					break;
	// 					//其他设备登陆
	// 				case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
	// 					console.log('其他设备登陆');
	// 					break;
	// 					//网络不可用
	// 				case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
	// 					console.log('网络不可用');
	// 					break;
	// 			}
	// 		}
	// 	});
	// }
	//关闭聊天
	service.cancel =function(type,targetId){
      var params = {
			"serviceid": "im_imtalk",
			"methodName": "updateCheckTimeToJson",
			"type":type,
			"targetId":targetId
		}
		return trshttpServer.httpServer('/wcm/rbcenter.do', {
			"method": "post"
		}, params);
	}
	return service;
})

/**
 * 上传文件
 * @param  {Object} $q)    {		var        service                                           [description]
 * @param  {[type]} error: function(data) {					deferred.reject(data);				}			};			$("#" +             formId).ajaxSubmit(options);			return deferred.promise;		}		return service;	} [description]
 * @return {[type]}        [description]
 */
commandSer.factory('upload', function($q, $window) {
		var service = {};
		var fileName = '';
		var domain = '';

		var getDomain = function() {
			var index = $window.location.pathname.indexOf("/", 1) + 1;
			var path = $window.location.pathname.substring(0, index);
			domain = $window.location.protocol + "//" + window.location.host;
		}

		service.setFileName = function(address) {
			var arr = address.split('\\');
			fileName = arr[arr.length - 1];
		}
		service.getFileName = function() {
				return fileName
			}
			//上传文件
		service.uploadFile = function(formId, type) {
			getDomain();
			var deferred = $q.defer();
			var options = {
				url: domain + "/wcm/app/application/" +
					"core/com.trs.ui/appendix/file_upload_dowith.jsp?" +
					"fileNameParam=" + type + "&fileNameValue=" + fileName +
					"&Type=METAVIEWDATA_APPENDIX_SIZE_LIMIT&pathFlag=W0",
				dataType: "json",
				success: function(data) {
					deferred.resolve(data);
				},
				error: function(data) {
					deferred.reject(data);
				}
			};
			$("#" + formId).ajaxSubmit(options);
			return deferred.promise;
		}
		return service;
	})

/**
 * 过滤null值
 * @param  {Object} ) {	var        service [description]
 * @return {[type]}   [description]
 */
commandSer.factory('isNullSer', function() {
	var service = {};
	service.check = function(obj) {
	    var newObj = {};
		angular.forEach(obj, function(value, key) {
			if ((value != null) && (value != undefined)) {
				newObj[key] = value;
			}
		});
		return newObj;
	}
	return service;
})
