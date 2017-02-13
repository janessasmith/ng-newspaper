var reportSer = angular.module('report.ser', []);

/**
 * 联合报道列表查询
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
reportSer.factory('reportManagementSer', function(trshttpServer,isNullSer) {
		var options = {};
		options.method = 'post';
		var reportManagementUtil = {
			reportManagementList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryAllCorpsToJson",
				}
				var newobj = isNullSer.check(obj);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return reportManagementUtil;
	})
/**
 * 删除联合报道
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
reportSer.factory('deleteSer', function(trshttpServer,isNullSer) {
		var options = {};
		options.method = 'post';
		var deleteUtil = {
			deleteList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "deleteByIdToJson",
				}
				var newobj = isNullSer.check(obj);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return deleteUtil;
	})
/**
 * 查看、修改联合报道
 * @param  {Object} trshttpServer) {		var                                      options [description]
 * @param  {Object} updateReport:  function(obj,notifications,corpsId){				var params  [description]
 * @return {[type]}                [description]
 */
reportSer.factory('getReportSer', function(trshttpServer, isNullSer) {
		var options = {};
		options.method = 'post';
		var getReportUtil = {
			getReportList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryByIdToJson",
				}
				var newobj = isNullSer.check(obj);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			updateReport: function(obj, notifications, corpsId) {
				var params = {
					"corpsId": corpsId,
					"serviceid": "cad_corps",
					"methodName": "updateToJson",
					"notifications": notifications,
				}
				var newobj = isNullSer.check(obj);
				newobj.newFileNames = JSON.stringify(newobj.newFileNames);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return getReportUtil;
	})
/**
 * 联合报道细览->主界面
 * @param  {Object} trshttpServer)     {		var                options       [description]
 * @param  {Object} userList:          function(obj){				var params        [description]
 * @param  {[type]} reportViewImgList: function(obj           [description]
 * @return {[type]}                    [description]
 */
reportSer.factory('reportViewMainSer', function(trshttpServer, isNullSer) {
		var options = {};
		options.method = 'post';
		var reportViewMainUtil = {
			reportViewMainList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryPubContentByIdToJson",
					"corpsId": obj,
					"headPicWidth":50,
					"appendixPicWidth":80,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			userList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryUsersIdToJson",
					"corpsId": obj,
					"headPicWidth":60
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			reportViewImgList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryImgToJson",
					"corpsId": obj,
					"appendixPicWidth":327
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			reportViewVideoList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryVideoToJson",
					"corpsId": obj,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			sendconts: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "saveContentToJson",
				}
				var newobj = isNullSer.check(obj);
				newobj.fileNames = JSON.stringify(newobj.fileNames);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			inviteUsers: function(corpsId) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "inviteUsersToJson",
					"corpsId": corpsId
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			addUsers: function(corpsId, userIds) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "addUsersToJson",
					"corpsId": corpsId,
					"userIds": userIds
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
	   	    corpsChatList: function(corpsId){
				var params = {
					"serviceid": "im_imtalk",
					"methodName": "corpsChatToJson",
					"corpsId":corpsId
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
	   	    },
	   	    deleteAccessory:function(accessoryId){
				var params = {
					"serviceid": "cad_corps",
					"methodName": "deleteAppandexByIdToJson",
					"fileId": accessoryId
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
	   	    }
		}
		return reportViewMainUtil;
	})
/**
 * 联合报道细览->任务说明
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
reportSer.factory('reportExplanationSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var reportExplanationUtil = {
			reportExplanationList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryContentByIdToJson",
					"corpsId": obj,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return reportExplanationUtil;
	})
/**
 * 联合报道细览->任务管理->列表循环
 * @param  {Object} trshttpServer) {		var                options       [description]
 * @param  {Object} overList:      function(obj){				var params        [description]
 * @param  {[type]} UpcomingList:  function(obj           [description]
 * @return {[type]}                [description]
 */
reportSer.factory('reportViewManagementSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var reportManagementSerUtil = {
			publishTaskList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryDraftMeByIdToJson",
					"corpsId": obj,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);

			},
			overList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryOverByIdToJson",
					"corpsId": obj,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			UpcomingList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryDictateByIdToJson",
					"corpsId": obj,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			reportOrderShowList: function(dictateId) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryUsersToJson",
					"dictateId": dictateId,
					"headPicWidth":40
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			queryCorpsDictateDetails: function(dictateId,password){
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryCorpsDictateByIdToJson",
					"dictateId": dictateId,
					"password" : password
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return reportManagementSerUtil;
	})
/**
 * 操作日志查询
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
reportSer.factory('reportJournalReadSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var journalUtil = {
			journalList: function(dictateId) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryLogToJson",
					"dictateId": dictateId,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			journalAllList: function(dictateId) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryLogAllToJson",
					"dictateId": dictateId,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return journalUtil;
	})
/**
 * 完成转待办
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
reportSer.factory('overRemindSer', function(trshttpServer) {
		var options = {};
		options.method = 'post';
		var overRemindUtil = {
			overRemindList: function(dictateId) {
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "saveOverToDoToJson",
					"dictateId": dictateId,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return overRemindUtil;
	})
/**
 * 发布任务
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
reportSer.factory('PubTaskSer', function(trshttpServer, isNullSer) {
		var options = {};
		options.method = 'post';
		var PubTaskUtil = {
			sendTask: function(obj) { //发布任务
				var params = {
					"serviceid": "cad_corps",
					"methodName": "savePubToJson",
				}
				var newobj = isNullSer.check(obj);
				newobj.fileNames = JSON.stringify(newobj.fileNames);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return PubTaskUtil;
})
/**
 * 待办完成
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
reportSer.factory('dbRemindSer', function(trshttpServer) {
	var options = {};
	options.method = 'post';
	var deleteUtil = {
		deleteList: function(dictateId) {
			var params = {
				"serviceid": "cad_dictate",
				"methodName": "saveOverToJson",
				"dictateId": dictateId,
			}
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		}
	}
	return deleteUtil;
})