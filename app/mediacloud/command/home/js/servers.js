var homeSer = angular.module('home.ser', []);

/**
 * 联合报道列表查询
 * @param  {Object} trshttpServer) {		var       options [description]
 * @return {[type]}                [description]
 */
homeSer.factory('homeManagementSer', function(trshttpServer,isNullSer) {
		var options = {};
		options.method = 'post';
		var homeManagementUtil = {
			homeManagementList: function(obj) {
				var params = {
					"serviceid": "cad_corps",
					"methodName": "queryAllCorpsToJson",
				}
				var newobj = isNullSer.check(obj);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			findCadDictateRightKeys: function() {//指令管理权限服务
				var params = {
					"serviceid": "cad_dictate",
					"methodName": "findCadDictateRightKeysToJson",
				}
				// var newobj = isNullSer.check(obj);
				// angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			findCadCorpsRightKeys: function() {//联合报道管理权限服务
				var params = {
					"serviceid": "cad_corps",
					"methodName": "findCadCorpsRightKeysToJson",
				}
				// var newobj = isNullSer.check(obj);
				// angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return homeManagementUtil;
	})
/**
 * 保存，发布指令
 * @param  {Object} ){                            	                     var options [description]
 * @param  {Object} sendDir: function(){  				var params [description]
 * @return {[type]}          [description]
 */
homeSer.factory('crerteDirSer', function(trshttpServer, isNullSer) {
	var options = {};
	options.method = 'post';
	var createDirUtil = {
		saveDir: function(obj) { //保存指令
			var params = {
				"serviceid": "cad_dictate",
				"methodName": "saveToJson"
			}

			var newobj = isNullSer.check(obj);
			newobj.fileNames = JSON.stringify(newobj.fileNames);
			angular.extend(params, newobj);
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		},
		sendDir: function(obj) { //发布指令
			var params = {
				"serviceid": "cad_dictate",
				"methodName": "savePubToJson"
			}
			var newobj = isNullSer.check(obj);
			newobj.fileNames = JSON.stringify(newobj.fileNames);
			angular.extend(params, newobj);
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		},
		sendCheck: function(obj){//送审
            var params = {
				"serviceid": "cad_dictate",
				"methodName": "createWaitingDictateToJson",
			}
			var newobj = isNullSer.check(obj);
			newobj.fileNames = JSON.stringify(newobj.fileNames);
			angular.extend(params, newobj);
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		}
	}
	return createDirUtil;
})
homeSer.factory('crerteReportSer', function(trshttpServer, isNullSer) {
		var options = {};
		options.method = 'post';
		var crerteReportUtil = {
			saveReport: function(obj, notifications) { //保存指令
				var params = {
					"serviceid": "cad_corps",
					"methodName": "saveToJson",
					"notifications": notifications
				}
				var newobj = isNullSer.check(obj);
				newobj.fileNames = JSON.stringify(newobj.fileNames);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return crerteReportUtil;
	})

/**
 * 获取待办任务
 * @param  {Object} trshttpServer){	               var options [description]
 * @return {[type]}                   [description]
 */
homeSer.factory('backlogNumSer', function(trshttpServer){
	  var options = {};
	  options.method = 'post';

	  var backlogUtil = {};

	  //获取指令代码任务
      backlogUtil.queryDicateNum = function(){
      	var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryDicateNumToJson"
				}
        return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
      }

      //获取联合报道任务
      backlogUtil.queryCropsDicateNum = function(){
      	var params = {
					"serviceid": "cad_dictate",
					"methodName": "queryCropsDicateNumToJson"
				}
        return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
      }
     return backlogUtil;
})
/**
 * 聊天类表
 * @param  {Object} trshttpServer){                          	                     var options [description]
 * @param  {Object} txUserList:      function(name){ 				var params [description]
 * @return {[type]}                  [description]
 */
homeSer.factory('chatSer', function(trshttpServer) {
	var options = {};
	options.method = 'post';
	var chatUtil = {
		dbUserList: function(title) {
			var params = {
				"serviceid": "im_imtalk",
				"methodName": "queryAllDoToJson",
				"title": title
			}
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		},
		txUserList: function(name) {
			var params = {
				"serviceid": "im_imtalk",
				"methodName": "queryUserByOrganizationToJson",
				"name": name
			}
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		},
		lyUserList: function() {
			var params = {
				"serviceid": "im_imtalk",
				"methodName": "queryUserByFieldToJson",
			}
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		},
		fzUserList: function() {
			var params = {
				"serviceid": "im_imtalk",
				"methodName": "queryUserByGroupToJson",
			}
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		},
		fzXzUserList: function() {
			var params = {
				"serviceid": "im_imtalk",
				"methodName": "queryDicateGroupUser",
			}
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		},
		getcxUserList: function(msg) {
			var params = {
				"serviceid": "im_imtalk",
				"methodName": "queryUserByLikeToJson",
				"truename": msg,
			}
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		},
		saveGroup: function(obj) {
			var params = {
				"serviceid": "im_imtalk",
				"methodName": "saveCreateGroupToJson",
			}
			angular.extend(params, obj);
			return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
		},
		searchChatUser: function(name) {
			var params = {
				"serviceid": "im_imtalk",
				"methodName": "queryUserByLikeToJson",
			}
			delete params.truename;
			params.truename = name;
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
		}
	}
	return chatUtil;
})

homeSer.factory('rongService', ['$document', '$q','$window','$rootScope',
    function($document, $q, $window,$rootScope) {
      var d = $q.defer();
      function onScriptLoad() {
        
			var scriptTag1 = $document[0].createElement('script');
			scriptTag1.type = 'text/javascript';
			scriptTag1.async = true;
			scriptTag1.src = 'http://cdn.ronghub.com/RongEmoji-2.0.15.min.js';
			scriptTag1.onreadystatechange = function() {
				if (this.readyState == 'complete') onScriptLoad1();
			}
			scriptTag1.onload = onScriptLoad1;
			s.appendChild(scriptTag1);
      }
      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript'; 
      scriptTag.async = true;
      scriptTag.src = 'http://cdn.ronghub.com/RongIMLib-2.0.10.min.js';
      scriptTag.onreadystatechange = function () {
        if (this.readyState == 'complete') onScriptLoad();
      }
      scriptTag.onload = onScriptLoad;

      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);


	  function onScriptLoad1() {
			$rootScope.$apply(function() {
				d.resolve({
					"RongIMLib": $window.RongIMLib
				});
			});
	  }
      // var scriptTag1 = $document[0].createElement('script');
      // scriptTag1.type = 'text/javascript';
      // scriptTag1.async = true;
      // scriptTag1.src = 'http://cdn.ronghub.com/RongEmoji-2.0.15.min.js';
      // scriptTag1.onreadystatechange = function() {
      //   if (this.readyState == 'complete') onScriptLoad1();
      // }
      // scriptTag1.onload = onScriptLoad1;

      // s.appendChild(scriptTag1);

      return {
        d3: function() { return d.promise; }
      };
}]);