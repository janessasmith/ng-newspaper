var commandDir = angular.module('command.dir', []);

/**
 * 导航菜单
 * @param  {[type]} ){		return {			scope:      {}          [description]
 * @param  {Array}  controller: function($scope, $element,     $attrs,       $transclude) {				var expanders [description]
 * @param  {[type]} restrict:   'E'              [description]
 * @param  {String} template:   "<div            class         [description]
 * @param  {[type]} replace:    true             [description]
 * @param  {[type]} transclude: true		};	}     [description]
 * @return {[type]}             [description]
 */
commandDir.directive('trsAccordion', function($state) {
	return {
		scope: {},
		controller: function($scope, $element, $attrs, $transclude) {
			var expanders = [];
			this.gotOpened = function(selectedExpander) {
				angular.forEach(expanders, function(expander) {
					if (selectedExpander != expander) {
						expander.isOpened = false;
					}
				})
			}

			this.addExpander = function(expander) {
				expanders.push(expander);
			}
		},
		restrict: 'E',
		template: "<div class=\"dp-nav-div\" ng-transclude >",
		replace: true,
		transclude: true
	};
});

commandDir.directive('trsAccordionGroup', function($state) {
	return {
		scope: {
			heading: '@',
			isOpened: '@',
			icon: '@',
			id: '@',
			num: '@'
		},
		restrict: 'E',
		require: '^?trsAccordion',
		template: "<div class=\"lf-sd-list\"> " +
			"   <a href=\"javascript:;\" class=\"sd-ls-tit\" ng-click=\"toggleOpen($event)\">" +
			"       <label class=\"{{icon}}\">{{heading}}</label>" +
			"       <i ng-show=\"num>0\">{{num}}</i>"+
			"       <span class=\"s-op\" ng-show=\"down\"></span>" +
			"       <span class=\"s-cl\" ng-show=\"up\"></span>" +
			"   </a>" +
			"   <div class=\"sd-ls-deal\" style=\"display:none\" ng-transclude></div>" +
			"</div>",
		replace: true,
		transclude: true,
		link: function($scope, iElm, iAttrs, accordionController) {

			var name = $state.current.name;

			if (name.indexOf($scope.id) != -1) {
				$scope.isOpened = true;
			}

			accordionController.addExpander($scope);

			$scope.up = true;
			$scope.down = false;
			$scope.toggleOpen = function(event) {
				$scope.isOpened = !$scope.isOpened;
				$scope.up = !$scope.up;
				$scope.down = !$scope.down;
				accordionController.gotOpened($scope);
			}

			$scope.$watch('isOpened', function(newValue, oldValue, scope) {
				if (newValue) {
					jQuery(iElm).children('.sd-ls-deal').slideDown(500);
				} else {
					jQuery(iElm).children('.sd-ls-deal').slideUp(500);
				}
			});
		}
	};
});

/**
 * 高亮选中标签
 * @param  {[type]} ) {	return     {				restrict: 'A',		replace: true,		link: function($scope, iElm, iAttrs, controller){			jQuery(iElm).bind('click', function() {				if (!jQuery(this).hasClass("lg-sel-cur")) {					jQuery(this).addClass("lg-sel-cur");					jQuery(this).siblings().removeClass("lg-sel-cur");					$scope.getContent();				};			})		}	};} [description]
 * @return {[type]}   [description]
 */
commandDir.directive('checked', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).bind('click', function() {
				if (!jQuery(this).hasClass(iAttrs.checked)) {
					jQuery(this).addClass(iAttrs.checked);
					jQuery(this).siblings().removeClass(iAttrs.checked);
				};
			})
		}
	};
});
/**
 * 高亮移动标签
 * @param  {[type]} ) {	return     {				restrict: 'A',		replace: true,		link: function($scope, iElm, iAttrs, controller){			jQuery(iElm).bind('click', function() {				if (!jQuery(this).hasClass("lg-sel-cur")) {					jQuery(this).addClass("lg-sel-cur");					jQuery(this).siblings().removeClass("lg-sel-cur");					$scope.getContent();				};			})		}	};} [description]
 * @return {[type]}   [description]
 */
commandDir.directive('move', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).bind('mouseover', function() {
				jQuery(this).addClass(iAttrs.move);
			});
			jQuery(iElm).bind('mouseout', function() {
				jQuery(this).removeClass(iAttrs.move);
			});
		}
	};
});
/**
 * 上传文件
 * @param  {[type]} $state)   {	return        {		scope:    {}        [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, element,      attributes, controller)   {			$(element).click(function() {				$('#t_file').click();			});			$("#t_file").change(function() {				var address [description]
 * @return {[type]}           [description]
 */
commandDir.directive('uplodeDirective', function($state, upload) {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, element, attributes, controller) {
			$(element).click(function() {
				$('#t_file').click();
			});
			$("#t_file").change(function() {
				var address = $("#t_file").val();
				//上传文件
				upload.setFileName(address);
				var result = upload.uploadFile("iconForm", "wxHeadImg-browser-btn");
				result.then(function(data) {
					var params = {
						"fileName": upload.getFileName(),
						"filePath": data.Message
					}
					$scope.$parent.params.fileNames.push(params);
					var createobj = $(
						'<div id=""><a class="fname">' + upload.getFileName() + '</a><span class="delete" ></span></div>'
					);
					angular.element($('.fileList')).append(createobj);
				}, function(data) {
					console.log(data)
				})
			});

		}
	};
});
/**
 * 上传文件删除
 * @param  {[type]} )         {		return       {			scope:   {}    [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller)   {				jQuery(iElm).click(function(event) {					var element [description]
 * @return {[type]}           [description]
 */
commandDir.directive('deletefile', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).click(function(event) {
				var element = event.target || event.srcElement;
				if ($(element).attr('class') == "delete") {
					if ($(element).parent().attr('id') != "") {
						$scope.$parent.params.delFileIds += $(element).parent().attr('id') + ","; //获取删除已有文件ID
					} else {
						var fileName = $scope.$parent.params.fileNames; //获取新上传文件数组
						for (var i = 0; i < fileName.length; i++) { //循环比对删除新上传文件
							if (fileName[i].fileName == $(element).siblings('.fname').html()) {
								fileName.splice(i, 1);
							}
						}
					}
					$(element).parent().hide();
				}

			})
		}
	};
});
/**
 * 上传文件(去掉$('.fileList')).append(createobj))
 * @param  {[type]} $state)   {	return        {		scope:    {}        [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, element,      attributes, controller)   {			$(element).click(function() {				$('#t_file').click();			});			$("#t_file").change(function() {				var address [description]
 * @return {[type]}           [description]
 */
commandDir.directive('myuplodeDirective', function($state, upload) {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, element, attributes, controller) {
			$(element).click(function() {
				$('#t_file').click();
			});
			$("#t_file").change(function() {
				var address = $("#t_file").val();
				//上传文件
				upload.setFileName(address);
				var result = upload.uploadFile("iconForm", "wxHeadImg-browser-btn");
				result.then(function(data) {
					var params = {
						"fileName": upload.getFileName(),
						"filePath": data.Message
					}
					$scope.$parent.params.fileNames.push(params);
					var createobj = $(
						'<div id=""><a class="fname">' + upload.getFileName() + '</a><span class="delete" ></span></div>'
					);
					// angular.element($('.fileList')).append(createobj);
				}, function(data) {
					console.log(data)
				})
			});

		}
	};
});
/**
 * 选择框样式改变
 * @param  {[type]} )         {		return       {			scope:   {}    [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller)   {				jQuery(iElm).click(function() {					var box [description]
 * @return {[type]}           [description]
 */
commandDir.directive('selectbox', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).click(function() {
				var box = jQuery(this).parent();
				if (box.hasClass("check-box-cur")) {

				} else {
					box.addClass("check-box-cur");
					box.parent().find(".cg-ls-tit").css("color", "#0072c7");
				}
			})
		}
	};
});

/**
 * 已结束改变隐藏事件
 * @param  {[type]} )         {                                                 return {      scope: {}                          [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller) {                    jQuery(iElm).click(function() {                     var id [description]
 * @return {[type]}           [description]
 */
commandDir.directive('changes', function() {
	return {
		scope: {},
		restrict: 'AC',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).click(function() {
				jQuery('.cg-check-box').removeClass("check-box-cur");
				jQuery('.cg-check-box').parent().find(".cg-ls-tit").css("color", "#4d4f5e");
			})
		}
	};
});

/**
 * 集成百度编辑器
 * @param  {String} )     {		return    {			restrict: "C",			require: "ngModel",			scope: {				config: "           [description]
 * @param  {[type]} link: function($S,  element,       attr,           ctrl)               {				var     _NGUeditor, _updateByRender;				_updateByRender [description]
 * @return {[type]}       [description]
 */
commandDir.directive('ueditor', function() {
	return {
		restrict: "C",
		require: "ngModel",
		scope: {
			config: "=",
			ready: "="
		},
		link: function($S, element, attr, ctrl) {
			var _NGUeditor, _updateByRender;
			_updateByRender = false;
			_NGUeditor = (function() {
				function _NGUeditor() {
					this.bindRender();
					this.initEditor();
					return;
				}
				/**
				 * 初始化编辑器
				 * @return {[type]} [description]
				 */
				_NGUeditor.prototype.initEditor = function() {
					var _UEConfig, _editorId, _self;
					_self = this;
					if (typeof UE === 'undefined') {
						console.error("Please import the local resources of ueditor!");
						return;
					}
					_UEConfig = $S.config ? $S.config : {};
					_editorId = attr.id ? attr.id : "_editor" + (Date.now());
					element[0].id = _editorId;
					this.editor = new UE.ui.Editor(_UEConfig);
					this.editor.render(_editorId);
					return this.editor.ready(function() {
						_self.editorReady = true;
						_self.editor.addListener("contentChange", function() {
							ctrl.$setViewValue(_self.editor.getContent());
							if (!_updateByRender) {
								if (!$S.$$phase) {
									$S.$apply();
								}
							}
							_updateByRender = false;
						});
						if (_self.modelContent && _self.modelContent.length > 0) {
							_self.setEditorContent();
						}
						if (typeof $S.ready === "function") {
							$S.ready(_self.editor);
						}
						$S.$on("$destroy", function() {
							if (!attr.id && UE.delEditor) {
								UE.delEditor(_editorId);
							}
						});
					});
				};

				_NGUeditor.prototype.setEditorContent = function(content) {
					if (content == null) {
						content = this.modelContent;
					}
					if (this.editor && this.editorReady) {
						this.editor.setContent(content);
					}
				};

				_NGUeditor.prototype.bindRender = function() {
					var _self;
					_self = this;
					ctrl.$render = function() {
						_self.modelContent = (ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
						_updateByRender = true;
						_self.setEditorContent();
					};
				};

				return _NGUeditor;

			})();
			new _NGUeditor();
		}
	};
});

/**
 * 即时通讯
 * @param  {[type]} $rootScope                          [description]
 * @param  {[type]} messageSer                          [description]
 * @param  {[type]} upload                              [description]
 * @param  {[type]} $compile)                           {		return       {			scope:   {}    [description]
 * @param  {[type]} restrict:                           "E"              [description]
 * @param  {[type]} templateUrl:'template/message.html' [description]
 * @param  {[type]} replace:                            true             [description]
 * @param  {String} link:                               function($scope, iElm,         iAttrs, rongyunCtrl)  {                               function getMessageTemplate(sendContent,style){                	return "<div class [description]
 * @return {[type]}                                     [description]
 */
commandDir.directive('message', function($rootScope,messageSer, upload, $compile,$templateCache) {
	return {
		scope: {},
		restrict: "E",
		templateUrl: 'template/message.html',
		replace: true,
		link: function($scope, iElm, iAttrs, rongyunCtrl) {

			function getMessageTemplate(headImg,sendContent, style1,style2,sendname) {
				if(sendname===undefined){
					sendname="";
				}
				return "<div class=\"lt-my-ha\">" +
					"<div class=\"lt-my-pc " + style2 + "\"><img src=\""+headImg+"\"/></div><span style=\"width:76px;margin-left: 41px;display: block;\">"+sendname+"</span>" +
					"<div class=\""+ style1 + style2 + "\">" +
					"<span>" + sendContent + "</span>" +
					"</div>" +
					"</div>";
				$(".lt-jm-lf").scrollTop($(".lt-jm-lf")[0].scrollHeight); 
			}
			function getErrorMessageTemplate(headImg,sendContent, style1,style2,sendname) {
				if(sendname===undefined){
					sendname="";
				}
				return "<div class=\"lt-my-ha\">" +
					"<div class=\"lt-my-pc " + style2 + "\"><img src=\""+headImg+"\"/></div><span style=\"width:76px;margin-left: 41px;display: block;\">"+sendname+"</span>" +
					"<div class=\""+ style1 + style2 + "\">" +
					"<span style='color:red;'>" + sendContent + "</span>" +
					"</div>" +
					"</div>";
				$(".lt-jm-lf").scrollTop($(".lt-jm-lf")[0].scrollHeight); 
			}

			function getImgMessageTemplate(headImg,sendContent, style1,style2,sendname) {
                if(sendname===undefined){
					sendname="";
				}
				return "<div class=\"lt-my-ha\">" +
					"<div class=\"lt-my-pc " + style2 + "\"><img src=\""+headImg+"\"/></div><span style=\"width:76px;margin-left: 41px;display: block;\">"+sendname+"</span>" +
					"<div class=\""+style1 + style2 + "\">" +
					"<img src=\"" + sendContent + "\">" +
					"</div>" +
					"</div>";
				$(".lt-jm-lf").scrollTop($(".lt-jm-lf")[0].scrollHeight); 
			}

			//连接融云服务器
			// messageSer.initIm($rootScope.userInfo.token);

			//初始化人员基本信息
			var initUserInfo = function(userId) {
				if ($scope.$parent.type == 1) {
					//获取单聊人员信息
					var currentUser = messageSer.getUserInformation($scope.$parent.id);
					currentUser.then(function(data) {
							var content = data;
							$rootScope.queryother = content.queryOther[0];
							$scope.queryother = content.queryOther[0];
							$rootScope.queryme = content.queryMe[0];
							$scope.queryme = content.queryMe[0];
							gethistory();
						},
						function(data) {
							alert("连接中断");
						})
				} else {
					//获取群聊人员信息
					var currentUser = messageSer.queryGroupInfo($scope.$parent.id);
					currentUser.then(function(data) {
							var groupUserInfo = data;
							$scope.groupmembers = groupUserInfo.groupmembers;
							$rootScope.groupmembers = groupUserInfo.groupmembers;
							gethistory();
						},
						function(data) {
							alert("连接中断");
						})
				}

			}
			initUserInfo();
 
            //拉取历史消息
            $scope.history_count=5;
			$(".getmoreinfo").on('click',function(){
				$scope.history_count=$scope.history_count+5;
				gethistory();
			})

            var gethistory = function(){
            	$('.huoing').show();
            	$('.getmoreinfo').hide();
            	var Historytype=null;
            	var Historyid=$scope.$parent.id.toString();
            	if($scope.$parent.type==2){
            		Historytype=3;
            	}else{
            		Historytype=1;
            	}
            	RongIMLib.RongIMClient.getInstance().getRemoteHistoryMessages(Historytype,Historyid ,new Date().getTime(), $scope.history_count, {
            		
            		onSuccess: function(list, hasMsg) {
            			$('.huoing').hide();
            			$('.getmoreinfo').show();
			            if(list.length!=0){	
			            $(".lt-jm-lf").empty();
			  		    //list 历史消息数组，hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
			  		    angular.forEach(list, function(obj, key) {

			  		    	if(obj.senderUserId==$rootScope.userInfo.userid){
										//0.文本消息 1.图片消息
										if (obj.messageType == "TextMessage") {
											var str = RongIMLib.RongIMEmoji.symbolToEmoji(obj.content.content);
											$(".lt-jm-lf").append(getMessageTemplate($rootScope.userInfo.headImg, str, "lt-my-deal", " rt"));
										}
										if (obj.messageType == "ImageMessage") {
											$(".lt-jm-lf").append(getImgMessageTemplate($rootScope.userInfo.headImg, obj.content.imageUri, "lt-my-deal", " rt"));
										}
									}else{
										//对方发的消息(单聊)
										//0.文本消息 1.图片消息
										if (obj.messageType == "TextMessage"&&obj.conversationType==1) {
											var str = RongIMLib.RongIMEmoji.symbolToEmoji(obj.content.content);
											$(".lt-jm-lf").append(getMessageTemplate($rootScope.queryother.headImg, str, "lt-df-deal", " lf"));
										}
										if (obj.messageType == "ImageMessage"&&obj.conversationType==1) {
											$(".lt-jm-lf").append(getImgMessageTemplate($rootScope.queryother.headImg, obj.content.imageUri, "lt-df-deal", " lf"));
										}
										//对方发的消息(群聊)
										//0.文本消息 1.图片消息
										
										if (obj.messageType == "TextMessage"&&obj.conversationType==3) {
											for(var i=0;i<$rootScope.groupmembers.length;i++){
												if(obj.senderUserId==$rootScope.groupmembers[i].userId){
													var str = RongIMLib.RongIMEmoji.symbolToEmoji(obj.content.content);
													$(".lt-jm-lf").append(getMessageTemplate($rootScope.groupmembers[i].headImg,str, "lt-df-deal"," lf",$rootScope.groupmembers[i].userName));
												}
											}
										}
										if (obj.messageType == "ImageMessage"&&obj.conversationType==3) {
											for(var i=0;i<$rootScope.groupmembers.length;i++){
												if(obj.senderUserId==$rootScope.groupmembers[i].userId){
													$(".lt-jm-lf").append(getImgMessageTemplate($rootScope.groupmembers[i].headImg,obj.content.imageUri, "lt-df-deal"," lf",$rootScope.groupmembers[i].userName));
												}
											}	
										}

									}

												});
							}
						},
						onError: function(error) {
							$('.huoing').hide();
						  	       //getRemoteHistoryMessages error
						  	}
					});
				}

			//获取离线消息
			// var queryAllUnreadMessage = function() {
			// 	var queryAllUnreadMessage = messageSer.queryAllUnreadMessage($scope.$parent.id, $scope.$parent.type);
			// 	queryAllUnreadMessage.then(function(data) {
			// 		var offLineMessages = data;
			// 		angular.forEach(offLineMessages, function(obj, key) {
			// 			//0.文本消息 1.图片消息
			// 			if (obj.messagetype == 0) {
			// 				$(".lt-jm-lf").append(getMessageTemplate(obj.headimg, obj.messagecontent, "lt-df-deal", " lf"));
			// 			}
			// 			if (obj.messagetype == 1) {
			// 				$(".lt-jm-lf").append(getImgMessageTemplate(obj.headimg, obj.messagecontent, "lt-df-deal", " lf"));
			// 			}
			// 		});
			// 	}, function(data) {
			// 		alert("连接中断");
			// 	});
			// }
			// queryAllUnreadMessage();
			

			//初始化表情
			var initRongIMEmoji = function() {
				if (RongIMLib.RongIMEmoji.emojis.length <= 0) {
					RongIMLib.RongIMEmoji.init();
				}
				var emojis = RongIMLib.RongIMEmoji.emojis;
				var bqTemplate = "";
				angular.forEach(emojis, function(value, key) {
					bqTemplate += "<emoji>" + emojis[key].innerHTML + "</emoji>";
				});
				$("#face").append($compile(bqTemplate)($scope));
			}
			initRongIMEmoji();

			//表情选择
			$scope.sendContent = "";
			$("emoji").on('click', function() {
				var name = $(this).children("span").attr("name");
				$scope.sendContent = $scope.sendContent + name;
			})

			var txtMsg = "RC:TxtMsg"; //文本消息               
			var imgMsg = "RC:ImgMsg" //图片消息
			var imgTextMsg = "RC:ImgTextMsg"; //图文消息
			var sendBool = true;

			//发送文本信息
			$scope.sendTextMessage = function(id) {
				$('.sending').show();
				var params = {};
				params.objectName = txtMsg;
				params.content = "{\"content\":\"" + encodeURIComponent($scope.sendContent) + "\"}";

				var res; //1.单聊 2.群聊
				
				if(sendBool){
					if ($scope.$parent.type == 1) {
					params.toUserId = id;
					res = messageSer.sendOneMessage(params);
					sendBool = false;
					} else {
						params.toGroupId = id;
						res = messageSer.sendGroupMessage(params);
						sendBool = false;
					}
				}
				res.then(function(data) {
					$('.sending').hide();
					var messagecontent = data.messagecontent;
					if (messagecontent) {
						//发送成功
						var str = RongIMLib.RongIMEmoji.symbolToEmoji(messagecontent);
						$(".lt-jm-lf").append(getMessageTemplate($rootScope.userInfo.headImg,str, "lt-my-deal"," rt"));
						$scope.sendContent = "";
						$(".lt-jm-lf").scrollTop($(".lt-jm-lf")[0].scrollHeight); 
						sendBool = true;
					} else {
						$(".lt-jm-lf").append(getErrorMessageTemplate($rootScope.userInfo.headImg, "发送失败！", "lt-my-deal", " rt"));
						$(".lt-jm-lf").scrollTop($(".lt-jm-lf")[0].scrollHeight); 
						sendBool = true;
					}
				}, function(data) {
					$(".lt-jm-lf").append(getErrorMessageTemplate($rootScope.userInfo.headImg, "系统异常！", "lt-my-deal", " rt"));
					$(".lt-jm-lf").scrollTop($(".lt-jm-lf")[0].scrollHeight); 
					sendBool = true;
				})
			}
			//快捷回车键发送
            jQuery(iElm).bind('keydown',function(event){
                    if(event.keyCode == "13"){
                      	$scope.sendTextMessage($scope.$parent.id);
                      	event.returnValue = false;
                      	return false;
                    }
                });
            
			//发送图片信息
			$("#bq-btn-pc").on("click", function() {
				$('#t_file').click();
			});
			$("#t_file").change(function() {
				$('.sending').show();
				var address = $("#t_file").val();
				upload.setFileName(address);
				var result = upload.uploadFile("iconForm", "wxHeadImg-browser-btn");
				result.then(function(data) {
					var params = {};
					params.objectName = imgMsg;
					params.content = "{\"imageUri\":\"" + data.Message + "\"}";

					var res; //1.单聊 2.群聊
					if ($scope.$parent.type == 1) {
						params.toUserId = $scope.$parent.id;
						res = messageSer.sendOneMessage(params);
					} else {
						params.toGroupId = $scope.$parent.id;
						res = messageSer.sendGroupMessage(params);
					}

					res.then(function(data) {
						$('.sending').hide();
						var messagecontent = data.messagecontent;
						if (messagecontent) {
							$(".lt-jm-lf").append(getImgMessageTemplate($rootScope.userInfo.headImg,messagecontent, "lt-my-deal"," rt"));
							$scope.sendContent = "";
							$(".lt-jm-lf").scrollTop($(".lt-jm-lf")[0].scrollHeight);
						} else {
							$(".lt-jm-lf").append(getErrorMessageTemplate($rootScope.userInfo.headImg, "发送失败！", "lt-my-deal", " rt"));
							$(".lt-jm-lf").scrollTop($(".lt-jm-lf")[0].scrollHeight); 
						}
					}, function(data) {
						alert("系统异常");
					})
				}, function(data) {
					console.log(data)
				})
			});
			
			//初始化接收消息
			// RongIMLib.RongIMClient.setOnReceiveMessageListener({
			// 	// 接收到的消息
			// 	onReceived: function(message) {
			// 		// 判断消息类型
			// 		switch (message.messageType) {
			// 			case RongIMLib.RongIMClient.MessageType.TextMessage:
			// 				console.log(message);
			// 				if (message.conversationType == 1 && message.senderUserId == $scope.$parent.id && !message.hasReceivedByOtherClient) {
			// 					var str = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content);
			// 					$(".lt-jm-lf").append(getMessageTemplate($scope.queryother.headImg,str, "lt-df-deal"," lf"));
			// 				}
			// 				if (message.conversationType == 3 && !message.hasReceivedByOtherClient) {
			// 					var str = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content);
			// 					$(".lt-jm-lf").append(getMessageTemplate($scope.queryother.headImg,str, "lt-df-deal"," lf"));
			// 				}
			// 				break;
			// 			case RongIMLib.RongIMClient.MessageType.ImageMessage:
			// 				console.log(message);
			// 				if (message.conversationType == 1 && message.senderUserId == $scope.$parent.id && !message.hasReceivedByOtherClient) {
			// 					$(".lt-jm-lf").append(getImgMessageTemplate($scope.queryother.headImg,message.content.imageUri, "lt-df-deal"," lf"));
			// 				}
			// 				if (message.conversationType == 3 && !message.hasReceivedByOtherClient) {
			// 					$(".lt-jm-lf").append(getImgMessageTemplate($scope.queryother.headImg,message.content.imageUri, "lt-df-deal"," lf"));
			// 				}
			// 				break;
			// 			case RongIMLib.RongIMClient.MessageType.RichContentMessage:

			// 				break;
			// 			default:
			// 		}
			// 	}
			// });

			//隐藏表情
			$(document).on('click', function(event) {
				var event = event ? event : window.event;
				var element = event.target || event.srcElement;
				if ($(element).attr("id") == "pic") {
					return;
				}
				$scope.$apply(function() {
					$scope.showemoji = false;
				})
			})

			//关闭聊天窗口
			$scope.cancel = function() {
				$scope.$parent.cancel();
				var cancelvar = messageSer.cancel($scope.$parent.type,$scope.$parent.id);
				cancelvar.then(function(data) {
					var result=data.targetId;
					var  getMsgCounts=messageSer.queryUnreadMessageCountsToJson();
					getMsgCounts.then(function(data) {
						if(data.totalCounts>0){
							$('.dp-red').show();
						}else{
							$('.dp-red').hide();
						}
					},function(data) {
					})
				}, function(data) {
					
				})
				
				// RongIMLib.RongIMClient.getInstance().disconnect();
			}
		}
	};
});
commandDir.run(['$templateCache', function($templateCache) {
	$templateCache.put("template/message.html", ["<div class=\"lt-box\">",
		"    <div class=\"popup-top\">",
		"        <span class=\"lt-jm-sp lf\"><span>{{queryother.userName}}</span> - 会话中</span>",
		"        <div class=\"lt-jm-btn rt\">",
		"            <a href=\"javascript:;\" class=\"lt-cl-btn lf\" ng-click=\"cancel();\"></a>",
		"        </div>",
		"    </div>",
		"    <div class=\"lt-jm-bk\">",
		"        <div class=\"lt-jm-tp\">",
		"        <a href class=\"getmoreinfo\" style=\"position: fixed; right: 231px;top: 46px;z-index:2;\">获取更多记录</a>",
		"        <img class=\"huoing\" src='common/images/dialogloading.gif' style=\"position: fixed; right: 231px;top: 46px;z-index:2;display:none\"></img>",
		"            <div class=\"lt-jm-lf lf\">",
		"            </div>",
		"            <div class=\"lt-jm-rt rt\" ng-show=\"$parent.type==1\">",
		"                <img ng-src=\"{{queryother.headImg}}\"/>",
		"                <p class=\"dh-df-name\"></p>",
		"                <div class=\"dh-df-info\">",
		"                    <p>擅长领域：<span></span></p>",
		"                    <p>标签：<span>&lt;{{queryother.label}}&gt;</span></p>",
		"                    <p>电话：<span>{{queryother.tel}}</span></p>",
		"                </div>",
		"            </div>",
		"<div class=\"rt rw-qz-cy\" ng-show=\"$parent.type==2\">",
		"<div class=\"qz-cy-tit\">讨论组成员</div>",
		"<div class=\"qz-cy-bk\">",
		"<div class=\"qz-cy-ls\">",
		"<div class=\"qz-cy-deal\" ng-repeat=\"groupmember in groupmembers\">",
		"  <img ng-src=\"{{groupmember.headImg}}\">",
		"   <p>{{groupmember.userName}}</p>",
		"</div>",
		"</div>",
		"</div>",
		"</div>",
		"        </div>",
		"        <div class=\"lt-jm-in\">",
		"            <div class=\"jm-in-lf lf\">",
		"                <div class=\"jm-in-bq\">",
		"                    <div class=\"in-bq-btn_dialog lf\">",
		"                        <span href=\"javascript:;\" class=\"bq-btn-bq\" id=\"pic\" ng-click=\"showemoji=!showemoji\"></span>",
		"<div class=\"expressionWrap\" id=\"face\" ng-show=\"showemoji\">",
		"<i class=\"arrow\"></i>",

		"</div>",
		"<form method=\"post\" id=\"iconForm\" name=\"iconForm\" enctype=\"multipart/form-data\" style=\"float:left\">",
		"<span href=\"javascript:;\" class=\"bq-btn-pc\" id=\"bq-btn-pc\"></span>",
		"<input name=\"wxHeadImg-browser-btn\" name=\"upload\" type=\"file\" id=\"t_file\" style=\"display:none\"/>",
		"</form>",
		"                    </div>",
							"<div  class=\"sending\">发送中…………</div>",
		"                    <div class=\"rt\">",
		//"                        <span>消息记录</span>",
		"                        <span class=\"his-jl-arrow\"></span>",
		"                    </div>",
		"                </div>",
		"                <div class=\"jm-in-area\">",
		"                    <textarea name=\"\" id=\"messed\" ng-model=\"sendContent\"></textarea>",
		"                </div>",
		"                <div class=\"jm-area-btn\">",
		"                    <a href=\"javascript:;\" class=\"jm-send-btn rt\" ng-click=\"sendTextMessage($parent.id);\">发送</a>",
		"                    <a href=\"javascript:;\" class=\"jm-close-btn rt\" ng-click=\"cancel();\">关闭</a>",
		"                </div>",
		"            </div>",
		"            <div class=\"lt-jm-rt jm-in-rt rt\">",
		"            <img ng-show=\"$parent.type==1\" ng-src=\"{{queryme.headImg}}\">",
		"                <p class=\"dh-df-name\">{{queryme.userName}}</p>",
		"            </div>",
		"        </div>",
		"    </div>",
		"</div>"
	].join(""));
}])