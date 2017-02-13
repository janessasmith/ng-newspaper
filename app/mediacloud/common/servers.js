define(function(require) {
	var app = require('app');
	/**
	 * 根据用户ID查询用户信息(后台方法)
	 * @param  {Object} trshttpServer){                 var options [description]
	 * @return {[type]}                  [description]
	 */
	app.factory('headPortraitSer', function(trshttpServer){
	    var options = {};
	    options.method = 'post';
	    var params = {
	         "serviceid":"im_imtalk",
	         "methodName":"queryUserInfoToJson"
	    }
	    var headPortraitUtil = {
	        headPortrait: function() {
	            return trshttpServer.httpServer('/wcm/rbcenter.do', options,params);
	        }
	    }

	    return headPortraitUtil;
	})
	/**
	 * ajax交互
	 * @param  {[type]} $q     [description]
	 * @param  {Object} $http) {		var       service [description]
	 * @return {[type]}        [description]
	 */
	app.factory('trshttpServer', ['$q', '$http','$window', function($q, $http,$window) {
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
				params: params,
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
	 * 上传文件
	 * @param  {Object} $q)    {		var        service                                           [description]
	 * @param  {[type]} error: function(data) {					deferred.reject(data);				}			};			$("#" +             formId).ajaxSubmit(options);			return deferred.promise;		}		return service;	} [description]
	 * @return {[type]}        [description]
	 */
	app.factory('upload', function($q, $window) {
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
	 * @param  {Object} ) {			var      service [description]
	 * @return {[type]}   [description]
	 */
	app.factory('isNullSer', function() {
			var service = {};
			var newObj = {};
			service.check = function(obj) {
				angular.forEach(obj, function(value, key) {
					if ((value !== null) && (value !== undefined)) {
						newObj[key] = value;
					}
				});
				return newObj;
			}
			return service;
		})
	/**
	 * 获取账号所属分类
	 * @param  {[type]} ){	return function      name(){			};}] [description]
	 * @return {[type]}            [description]
	 */
	app.factory('utilClass', function(trshttpServer) {
			var options = {};
			options.method = 'get';

			var classUnitl = {
				queryClass: function() {
					return trshttpServer.httpServer('/wcm/rb/class.json', options);
				}
			}

			return classUnitl;
		})

	/**
	 * 获取账号所属单位
	 * @param  {Object} trshttpServer) {		var       options [description]
	 * @return {[type]}                [description]
	 */
	app.factory('utilUnit', function(trshttpServer) {
		var options = {};
		options.method = 'get';

		var unitUtil = {
			queryUnit: function() {
				return trshttpServer.httpServer('/wcm/rb/unit.json', options);
			}
		}

		return unitUtil;
	})

	/**
 * 弹窗
 * @param  {[type]} ){			tt: function(){								var animationsEnabled [description]
 * @return {[type]}           [description]
 */
app.factory('dialogServer', function($uibModal) {
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
							"<span class=\"dialog-warn-content\">{{obj.data}}</span>" +
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
app.controller('dialogWarnCtr', function($scope, $uibModalInstance, params) {
		$scope.data = params.data;
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	})
});