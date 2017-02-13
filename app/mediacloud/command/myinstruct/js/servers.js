var myinstructSer = angular.module('myinstruct.ser', []);

myinstructSer.factory('backlogSer', function(trshttpServer,isNullSer) {
		var options = {};
		options.method = 'post';

		var backlogUtil = {
			//查询今天任务
			todayList: function(obj) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryTodayDoToJson"
				}
				var newobj = isNullSer.check(obj);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			//查询下阶段任务
			upBenchList: function(obj) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryNextDoToJson"
				}
				var newobj = isNullSer.check(obj);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			//指令完成
			perform: function(id) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "saveOverToJson",
					"dictateId": id
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return backlogUtil;
	})
/**
 * 已结束指令列表查询
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('finishSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var finishUtil = {
			finishList: function(obj) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryOverToJson",
					"PageSize":obj.PageSize,
                    "PageIndex":obj.PageIndex
				}
				if (obj.title) {
					params.title = obj.title;
				}
				if (obj.type) {
					params.type = obj.type;
				}

				//angular.extend(params, obj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return finishUtil;
	})
/**
 * 待办指令查看
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('view_orderSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var view_orderUtil = {
			view_orderList: function(dictateId, password) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryDictateDoByIdToJson"
				}
				params.dictateId = dictateId;
				params.password = password;
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return view_orderUtil;
	})
/**
 * 待办指令转发
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('forward_orderSer', function(trshttpServer, isNullSer) {
		var options = {};
		options.method = 'post';
		var view_orderUtil = {
			forward_orderList: function(dictateId) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryDictateToForwardToJson"
				}
				params.dictateId = dictateId;
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			sendDir: function(obj) { //发布指令
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "forwardAndPubToJson",
				}
				var newobj = isNullSer.check(obj);
				newobj.fileNames = JSON.stringify(newobj.fileNames);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return view_orderUtil;
	})
/**
 * 操作日志查询
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('journalReadSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var journalUtil = {
			journalList: function(dictateId) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryLogToJson",
					"dictateId": dictateId
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return journalUtil;
	})
/**
 * 已结束转待办
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('remindSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var remindUtil = {
			remindList: function(dictateId) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "saveOverToDoToJson",
					"dictateId": dictateId
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return remindUtil;
	})
/**
 * 指令查看（已结束单条）
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('commandShowCtrlSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var commandShow = {
			commandShowList: function(dictateId, password) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "querytDictateByIdToJson",
					"dictateId": dictateId,
					"password": password
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return commandShow;
	})
/**
 * 我发起的
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('myLaunchSer', function(trshttpServer, isNullSer) {
		var options = {};
		options.method = 'post';
		var myLaunchUtil = {
			myLaunchList: function(obj) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryDraftByMeToJson",
				}
				var newobj = isNullSer.check(obj);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return myLaunchUtil;
	})
/**
 * 我的发起 操作日志查询
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('mylaunchjournalReadSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var journalUtil = {
			journalList: function(dictateId) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryLogAllToJson",
					"dictateId": dictateId
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return journalUtil;
	})
/**
 * 指令查看（我发起的单条）
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('myLaunchCommandShowCtrlSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var myLaunchCommandShowUtil = {
			myLaunchCommandShowList: function(dictateId, password) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "querytDictateAllByIdToJson",
					"dictateId": dictateId,
					"password":password,
					"headPicWidth":40
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return myLaunchCommandShowUtil;
	})
/**
 * 查看已读，未读，完成人员信息
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('myLaunchCommandUserSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var myLaunchCommandShowUtil = {
			myLaunchCommandUserList: function(dictateId) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryUsersToJson",
					"dictateId": dictateId,
					"headPicWidth":40
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return myLaunchCommandShowUtil;
	})
/**
 * 指令撤回
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
myinstructSer.factory('revokeSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var revokeUtil = {
			revokeList: function(dictateId) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "dictateWithdrawToJson",
					"dictateId": dictateId
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return revokeUtil;
	})
/**
 * 草稿箱列表查询
 * @param  {Object} httpServer){		var options       [description]
 * @return {[type]}                    [description]
 */
myinstructSer.factory('draftSer', function(trshttpServer, isNullSer) {
		var options = {};
		options.method = 'post';

		var params = {
			"serviceid": "cad_dictate",
			"methodName": "queryDraftToJson"
		}

		var draftsUtil = {
			querydraft: function(obj) {
				var newobj = isNullSer.check(obj);
				delete params.title;
				angular.extend(params, newobj);
				if(params.type==0){
					delete params.type;
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return draftsUtil;
	})
/**
 * 草稿箱-指令删除
 * @param  {Object} trshttpServer){		var options       [description]
 * @return {[type]}                       [description]
 */
myinstructSer.factory('delSer', function(trshttpServer) {
	var options = {};
	options.method = 'post';

	var draftsDelUtil = {
		querydraftDel: function(dictateIds) {
			var params = {
				"serviceid": "cad_dictate",
				"methodName": "deleteByIdsToJson",
				"dictateIds": dictateIds
			}
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		}
	}
	return draftsDelUtil;
})

/**
 * 草稿箱详情
 * @param  {Object} httpServer){		var options       [description]
 * @return {[type]}                    [description]
 */
myinstructSer.factory('draftsDetailSer', function(trshttpServer, isNullSer) {
	var options = {};
	options.method = 'post';
  
	var draftsDetailUtil = {};

	//详情
	draftsDetailUtil.querydraftsDetail = function(dictateId, password) {
		var params = {
			"serviceid": "cad_dictate",
			"methodName": "queryDraftByIdToJson",
			"dictateId": dictateId,
			"password": password
			}
		    return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
	}

	//重发
	draftsDetailUtil.querydraftsResend = function(obj) {
		var params = {
			"serviceid": "cad_dictate",
			"methodName": "dictateToPubToJson",
	    }
		var newobj = isNullSer.check(obj);
		newobj.newFileNames = JSON.stringify(newobj.newFileNames);
		angular.extend(params, newobj);
		return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
	}
	
	return draftsDetailUtil;
})

/**
 * 指令审核服务
 * @param  {Object} httpServer){		var options       [description]
 * @return {[type]}                    [description]
 */
myinstructSer.factory('checkSer', function(trshttpServer, isNullSer) {
	var options = {};
	options.method = 'post';

	var checkUtil = {};
	
    //查看审核列表
	checkUtil.queryCheck = function(obj) {
		var params = {
			"serviceid": "cad_dictate",
			"methodName": "queryAllWatingDictateToJson",
	    }
		var newobj = isNullSer.check(obj);
		angular.extend(params, newobj);
		return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
	}
    
    //审核详情
	checkUtil.queryDetail = function(dictateId){
		var params = {
			"serviceid": "cad_dictate",
			"methodName": "queryAllWatingDictateByIdToJson",
			"dictateId":dictateId
	    }
		return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
	}

	//审核修改
	checkUtil.updateCheck = function(obj){
		var params = {
			"serviceid": "cad_dictate",
			"methodName": "updateAndSendDictateToJson"
	    }
	    delete obj.CRUSER;
	    angular.extend(params, obj);
		return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
	}

	//返工
	checkUtil.rework = function(dictateId,suggestion){
		var params = {
			"serviceid": "cad_dictate",
			"methodName": "updateDictateToDraftToJson",
			"dictateId": dictateId,
			"suggestion": suggestion
	    }
		return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
	}

	checkUtil.sendCheck = function(obj){//送审
            var params = {
				"serviceid": "cad_dictate",
				"methodName": "dictateToWatingToJson",
			}
			var newobj = isNullSer.check(obj);
			newobj.fileNames = JSON.stringify(newobj.fileNames);
			angular.extend(params, newobj);
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
	}

	return checkUtil;
})
/**
 * 指令翻阅服务
 * @param  {Object} httpServer){		var options       [description]
 * @return {[type]}                    [description]
 */
myinstructSer.factory('browseSer', function(trshttpServer, isNullSer) {
	var options = {};
	options.method = 'post';

	var checkUtil = {};
	
    //查看指令翻阅列表
	checkUtil.queryBrowse = function(obj) {
		var params = {
			"serviceid": "cad_dictate",
			"methodName": "queryAllDicateToJson",
	    }
		var newobj = isNullSer.check(obj);
		angular.extend(params, newobj);
		return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
	}

	//指令翻阅详情queryAllWatingDictateByIdToJson
	checkUtil.queryDetail = function(dictateId){
		var params = {
			"serviceid": "cad_dictate",
			"methodName": "querytDictateAllByIdToJson",
			"dictateId":dictateId
	    }
		return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
	}

	return checkUtil;
})