var setupSer = angular.module('setup.ser', []);
/**
 * 自定义分组服务
 * @param  {[type]} trshttpServer [description]
 * @param  {Object} isNullSer)    {		var          options       [description]
 * @param  {Object} setGroupList: function()       {				var     params        [description]
 * @param  {[type]} delGroup:     function(groupId [description]
 * @return {[type]}               [description]
 */
setupSer.factory('setGroupSer', function(trshttpServer,isNullSer) {
		var options = {};
		options.method = 'post';
		var setGroupUtil = {
			//新建分组
			saveGroup: function(obj) {
				var params = {
					"serviceid": "im_imtalk",
					"methodName": "createDictateGroupToJson",
				}
				var newobj = isNullSer.check(obj);
				angular.extend(params, newobj);
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			//查询分组列表
			setGroupList: function() {
				var params = {
					"serviceid": "im_imtalk",
					"methodName": "queryDicateGroupUser",
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			//删除分组
			delGroup: function(groupId) {
				var params = {
					"serviceid": "im_imtalk",
					"methodName": "deleteGroupByIdToJson",
					"groupId":groupId,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			//分组详情
			groupDetails: function(groupId) {
				var params = {
					"serviceid": "im_imtalk",
					"methodName": "findByDictateGroupIdToJson",
					"groupId":groupId,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			//上移分组
			upGroupList: function(groupId) {
				var params = {
					"serviceid": "im_imtalk",
					"methodName": "changeGroupOrderUpToJson",
					"GroupId":groupId,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			//下移分组
			downGroupList: function(groupId) {
				var params = {
					"serviceid": "im_imtalk",
					"methodName": "changeGroupOrderDownToJson",
					"GroupId":groupId,
				}
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			},
			//修改分组详情
			groupUpdate: function(obj) {
				var params = {
					"serviceid": "im_imtalk",
					"methodName": "updateDictateGroupToJson",
				}
				var newobj = isNullSer.check(obj);
				newobj.fileNames = JSON.stringify(newobj.fileNames);
				angular.extend(params, newobj);
				debugger;
				return trshttpServer.httpServer('/wcm/rbcenter.do', options, params);
			}
		}
		return setGroupUtil;
	})