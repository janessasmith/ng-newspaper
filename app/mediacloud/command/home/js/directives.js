var homeDir = angular.module('home.dir', []);
/**
 * 百度地图
 * @param  {[type]} $templateCache [description]
 * @param  {[type]} $compile)      {	return        {		scope:    {			search:  '@',			searchResultPanel: '@'		}       [description]
 * @param  {[type]} restrict:      'E'              [description]
 * @param  {String} template:      '<div            id            [description]
 * @param  {[type]} replace:       true             [description]
 * @param  {[type]} link:          function($scope, iElm,         iAttrs,       controller                [description]
 * @return {[type]}                [description]
 */
homeDir.directive('map', function($templateCache, $compile) {
	return {
		scope: {
			search: '@',
			searchResultPanel: '@'
		},
		restrict: 'E',
		template: '<div id=\"allmap\"></div>',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			var template = "<div class=\"popup-box qf-box\">" +
				"    <div class=\"popup-top\">" +
				"        <span class=\"map-popup-name lf\">赵武</span>" +
				"        <a href=\"javascript:;\" class=\"map-close-btn rt\"></a>" +
				"    </div>" +
				"    <div class=\"popup-con\">" +
				"        <div class=\"map-popup-deal\">" +
				"            <img src=\"common/images/new-pic.jpg\"/>" +
				"            <div class=\"map-bk-deal\">" +
				"                <h3>重庆晨报</h3>" +
				"                <div class=\"lx-dh-bk\">" +
				"                    <span>联系电话：</span>" +
				"                    <p>8910487669</p>" +
				"                </div>" +
				"                <div class=\"lx-dh-bk\">" +
				"                    <span>擅长领域：</span>" +
				"                    <p>农村社会新闻</p>" +
				"                </div>" +
				"                <div class=\"lx-dh-bk\">" +
				"                    <span>当前位置：</span>" +
				"                    <p>重庆市渝中区临江门大庆街98号</p>" +
				"                </div>" +
				"            </div>" +
				"        </div>" +
				"        <div class=\"popup-btn-bk\">" +
				"            <div class=\"bnt-bk-deal\" style=\"width: 220px;\">" +
				"                <a href=\"javascript:;\" class=\"popup-btn-confirm\" data-ng-click=\"t();\">加入</a>" +
				"                <a href=\"javascript:;\" class=\"popup-btn-message\">发消息</a>" +
				"                <a href=\"javascript:;\" class=\"popup-btn-cancel\">取消</a>" +
				"            </div>" +
				"        </div>" +
				"    </div>" +
				"</div>";
			//初始化地图
			var map = new BMap.Map("allmap");
			map.centerAndZoom('重庆', 12);
			var data_info = [
				[106.543189, 29.555389, 'http://img1.imgtn.bdimg.com/it/u=2633980629,4278863756&fm=21&gp=0.jpg'],
				[106.542319, 29.554171, 'http://img1.imgtn.bdimg.com/it/u=2633980629,4278863756&fm=21&gp=0.jpg'],
				[106.542821, 29.554863, 'http://img1.imgtn.bdimg.com/it/u=2633980629,4278863756&fm=21&gp=0.jpg']
			];
			var opts = {
					closeIconUrl: 'common/images/popup-icon02.png',
					closeIconMargin: '11px;'
				}
				//创建自定义窗口

			for (var i = 0; i < data_info.length; i++) {
				var point = new BMap.Point(data_info[i][0], data_info[i][1]); //图片
				var myIcon = new BMap.Icon(data_info[i][2], new BMap.Size(55, 55));
				var marker = new BMap.Marker(point, {
					icon: myIcon
				}); // 创建标注
				var content = data_info[i][2];
				map.addOverlay(marker); // 将标注添加到地图中
				addClickHandler(marker);
			}

			function addClickHandler(marker) {
				marker.addEventListener("click", function(e) {
					openInfo(e, marker)
				});
			}

			function openInfo(e, marker) {
				var infoBox = new BMapLib.InfoBox(map);
				var p = e.target;
				var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
				infoBox.open(point);
				infoBox.setContent($compile(template)($scope)[0]);
			}

			//百度地图搜索功能
			function G(id) {
				return document.getElementById(id);
			}

			var ac = new BMap.Autocomplete( //建立一个自动完成的对象
				{
					"input": $scope.search,
					"location": map
				});

			ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
				var str = "";
				var _value = e.fromitem.value;
				var value = "";
				if (e.fromitem.index > -1) {
					value = _value.province + _value.city + _value.district + _value.street + _value.business;
				}
				str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

				value = "";
				if (e.toitem.index > -1) {
					_value = e.toitem.value;
					value = _value.province + _value.city + _value.district + _value.street + _value.business;
				}
				str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
				G($scope.searchResultPanel).innerHTML = str;
			});

			var myValue;
			ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
				var _value = e.item.value;
				myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
				G($scope.searchResultPanel).innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

				setPlace();
			});

			function setPlace() {
				function myFun() {
					var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
					map.centerAndZoom(pp, 18);
				}
				var local = new BMap.LocalSearch(map, { //智能搜索
					onSearchComplete: myFun
				});
				local.search(myValue);
			}

		}
	};
});
/**
 * 聊天列表
 * @param  {[type]} $uibModal                 [description]
 * @param  {[type]} chatSer                   [description]
 * @param  {[type]} dialogServer)             {		return            {			scope:   {}    [description]
 * @param  {[type]} restrict:                 'E'                   [description]
 * @param  {[type]} templateUrl:              'home/tpls/chat.html' [description]
 * @param  {[type]} replace:                  true                  [description]
 * @param  {[type]} link:                     function($scope,      iElm,         iAttrs, controller,$parse,$uibModal, $log) {								$scope.getdbUserList [description]
 * @param  {[type]} function(data){						var open                  [description]
 * @param  {[type]} function(data){						var open                  [description]
 * @return {[type]}                           [description]
 */
homeDir.directive('chat', function($rootScope,$uibModal,$compile,chatSer, dialogServer,messageSer,rongService) {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: 'home/tpls/chat.html',
		replace: true,
		link: function($scope, iElm, iAttrs, controller, $parse, $uibModal, $log) {
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
			}

			function getImgMessageTemplate(headImg,sendContent, style1,style2,sendname) {
				if(sendname===undefined){
					sendname="";
				}
				return "<div class=\"lt-my-ha\">" +
					"<div class=\"lt-my-pc " + style2 + "\"><img src=\""+headImg+"\"/></div><span style=\"width:76px;margin-left: 41px;display: block;\">"+sendname+"</span>" +
					"<div class=\""+style1 + style2 + "\">" +
					"<img src=\"../../scm/file/read_image.jsp?FileName=" + sendContent + "\">" +
					"</div>" +
					"</div>";
			}
			// 初始化融云。在整个应用程序全局，只需要调用一次 init 方法。
		rongService.d3().then(function(data) {
		    var RongIMLib = data.RongIMLib;
			RongIMLib.RongIMClient.init("cpj2xarljgytn");
		    //获取人员信息
		    var currentUser = messageSer.getUserInformation();
			currentUser.then(function(data) {
					$rootScope.userInfo = data.queryMe[0];
					//连接融云服务器
					initIm($rootScope.userInfo.token);
				},
				function(data) {
					alert("连接断开");
				})
		    //点击获取更新会话列表
			$(".dp-icon-user img").on("click", function() {
				//获取未读取聊天和会话列表
				RongIMLib.RongIMClient.getInstance().getRemoteConversationList({
					onSuccess: function(list) {
						//list 会话列表
						$(".ls-xx").empty();
						for (var i = 0; i < list.length; i++) {
							//单聊
							if (list[i].conversationType == 1) {
								var usrlist = "<usrlist id=" + list[i].targetId + " type=" + list[i].conversationType + "></usrlist>";
								$(".ls-xx").append($compile(usrlist)($scope));
							}
							//群发 
							if (list[i].conversationType == 3) {
								var grouplist = "<grouplist id=" + list[i].targetId + " type=" + list[i].conversationType + "></grouplist>";
								$(".ls-xx").append($compile(grouplist)($scope));
							}
						}
					},
					onError: function(error) {
						//GetConversationList error
						console.log(list);
					}
				}, null);
			})
		// 连接融云服务器。
	     function initIm (token) {
			RongIMLib.RongIMClient.connect(token, {
				onSuccess: function(userId) {
					console.log("Login successfully." + userId);
				},
				onTokenIncorrect: function() {
					console.log('token无效');
					var currentUserToken = messageSer.getUserTokenToJson();
					currentUserToken.then(function(data) {
							initIm(data.result);
						},
						function(data) {
							alert("连接断开");
						})
				},
				onError: function(errorCode) {
					var info = '';
					switch (errorCode) {
						case RongIMLib.ErrorCode.TIMEOUT:
							info = '超时';
							break;
						case RongIMLib.ErrorCode.UNKNOWN_ERROR:
							info = '未知错误';
							break;
						case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
							info = '不可接受的协议版本';
							break;
						case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
							info = 'appkey不正确';
							break;
						case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
							info = '服务器不可用';
							break;
					}
					console.log(errorCode);
				}
			});

			RongIMLib.RongIMClient.setConnectionStatusListener({
				onChanged: function(status) {
					switch (status) {
						//链接成功
						case RongIMLib.ConnectionStatus.CONNECTED:
							console.log('链接成功');
							break;
							//正在链接
						case RongIMLib.ConnectionStatus.CONNECTING:
							console.log('正在链接');
							break;
							//重新链接
						case RongIMLib.ConnectionStatus.DISCONNECTED:
							console.log('断开连接');
							break;
							//其他设备登陆
						case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
							console.log('其他设备登陆');
							break;
							//网络不可用
						case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
							console.log('网络不可用');
							break;
					}
				}
			});
		}
			
			    //初始化接收监听消息
			    RongIMLib.RongIMClient.setOnReceiveMessageListener({
                // 接收到的消息
                onReceived: function(message) {  
        	       //获取会话列表
                    RongIMLib.RongIMClient.getInstance().getRemoteConversationList({
                    	onSuccess: function(list) {
                    	$scope.getMsgCountsToJson();
	                   //list 会话列表
	                   $(".ls-xx").empty();
	                   for(var i=0;i<list.length;i++){
		                   	//单聊
		                   	if(list[i].conversationType==1){
		                   		var usrlist="<usrlist id="+list[i].targetId+" type="+list[i].conversationType+"></usrlist>";
		                   		$(".ls-xx").append($compile(usrlist)($scope));
		                   	}
		                   	//群发 
		                   	if(list[i].conversationType==3){
		                   		var grouplist="<grouplist id="+list[i].targetId+" type="+list[i].conversationType+"></grouplist>";
		                   		$(".ls-xx").append($compile(grouplist)($scope));
		                   	}                  
		                   }
               },
               onError: function(error) {
			     //GetConversationList error
			     console.log(list);
			 }
			},null);
                 // 判断消息类型
                 switch (message.messageType) {
                 	case RongIMLib.RongIMClient.MessageType.TextMessage:
                 	console.log(message);
                 if (message.conversationType == 1 && message.senderUserId == $scope.$parent.$$childTail.$$prevSibling.id ) {
                 		var str = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content);
                 		$(".lt-jm-lf").append(getMessageTemplate($rootScope.queryother.headImg,str, "lt-df-deal"," lf",""));
                 		$(".lt-jm-lf").scrollTop($(".lt-jm-lf")[0].scrollHeight);
                 	}
	                 if (message.conversationType == 3 && message.targetId == $scope.$parent.$$childTail.$$prevSibling.id) {
	              		for(var i=0;i<$rootScope.groupmembers.length;i++){
	              			if(message.senderUserId==$rootScope.groupmembers[i].userId){
	                            var str = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content);
	              		       $(".lt-jm-lf").append(getMessageTemplate($rootScope.groupmembers[i].headImg,str, "lt-df-deal"," lf",$rootScope.groupmembers[i].userName,$rootScope.queryother.headImg));
	              		       $(".lt-jm-lf").scrollTop($(".lt-jm-lf")[0].scrollHeight);
	              			}
	              		}
	              		
	              	}
                 	break;
                 	case RongIMLib.RongIMClient.MessageType.ImageMessage:
                 	console.log(message);
                 	if (message.conversationType == 1 && message.senderUserId == $scope.$parent.$$childTail.$$prevSibling.id ) {
                 		$(".lt-jm-lf").append(getImgMessageTemplate($rootScope.queryother.headImg,message.content.imageUri, "lt-df-deal"," lf",""));
                 	}
                 	if (message.conversationType == 3 && message.targetId == $scope.$parent.$$childTail.$$prevSibling.id) {
                 		for(var i=0;i<$rootScope.groupmembers.length;i++){
                 			if(message.senderUserId==$rootScope.groupmembers[i].userId){
                 		       $(".lt-jm-lf").append(getImgMessageTemplate($rootScope.groupmembers[i].headImg,message.content.imageUri, "lt-df-deal"," lf",$rootScope.groupmembers[i].userName));
                 			}
                 		}
                 	}
                 	break;
                 	case RongIMLib.RongIMClient.MessageType.RichContentMessage:

                 	break;
                 	default:
                 }
             }
         }); 
		});

			$scope.openMessage = function(userId, type) {
					var open = dialogServer.dialogMessage();
					open('600', userId, type);
				}
				//待办消息
			$scope.getdbUserList = function(msg) {
				var dbUserList = chatSer.dbUserList(msg);
				dbUserList.then(function(data) {
					if(data.status==-1)return;
					$scope.dbUsers = data.result;
				}, function(data) {
					var open = dialogServer.dialogWarn();
					open('400', {
						"data": data
					});
				});
			}
			$scope.getdbUserList('');
			//搜索查询
			$scope.searchChatUsert = function(e) {
				var keycode = window.event?e.keyCode:e.which;
	            if(keycode==13){
	                $scope.searchChatUser();
	            }
			}
			$scope.searchChatUser = function() {
				var searchUserList = chatSer.searchChatUser($scope.searchname);
				searchUserList.then(function(data) {
					jQuery('.ls-ss').show();
					$scope.SerNames=data.data;
				}, function(data) {
					var open = dialogServer.dialogWarn();
					open('400', {
						"data": data
					});
				});
			}
			//未读信息
			$scope.getMsgCountsToJson= function(){
				var  getMsgCounts=messageSer.queryUnreadMessageCountsToJson();
				getMsgCounts.then(function(data) {
					if(data.totalCounts>0){
						$('.dp-red').show();
					}else{
						$('.dp-red').hide();
					}
				},function(data) {
				})
			}
			$scope.getMsgCountsToJson();
			//及时通讯
			$scope.gettxUserList = function(msg) {
				var txUserList = chatSer.txUserList(msg);
				txUserList.then(function(data) {
					if(data.status==-1)return;
					$scope.txUsers = data;
				}, function(data) {
					var open = dialogServer.dialogWarn();
					open('400', {
						"data": data
					});
				});
			}
			$scope.gettxUserList('');
			//领域
			$scope.getlyUserList = function() {
				var lyUserList = chatSer.lyUserList();
				lyUserList.then(function(data) {
					if(data.status==-1)return;
					$scope.lyUsers = data.data;
				}, function(data) {
					var open = dialogServer.dialogWarn();
					open('400', {
						"data": data
					});
				});
			}
			$scope.getlyUserList();
			//分组
			$scope.getfzUserList = function() {
				var fzUserList = chatSer.fzUserList();
				fzUserList.then(function(data) {
					if(data.status==-1)return;
					$scope.fzUsers = data.data;
				}, function(data) {
					var open = dialogServer.dialogWarn();
					open('400', {
						"data": data
					});
				});
			}
			$scope.getfzUserList();
			//对话框关闭事件
			jQuery(document).bind("click", function(e) {
				var target = jQuery(e.target);
				if (target.closest(".gt-deal-box").length == 0 && target.closest(".popup").length == 0 && target.closest(".dp-icon-user").length == 0 && target.closest(".popup-box").length == 0) {
					jQuery('.gt-deal-box').hide();
				}
			});
			//待办消息页面显示
			jQuery('.dp-db-xx').bind("click", function(e) {
				jQuery('.db-ym').show();
				jQuery('.tx-ym').hide();
			});
			//及时通讯页面显示
			jQuery('.dp-js-tx').bind("click", function(e) {
				jQuery('.db-ym').hide();
				jQuery('.tx-ym').show();
			});
			jQuery('.js-tx-tb .js-tx-ls').bind("click", function(e) {
				if (!jQuery(this).hasClass('js-tx-cur')) {
					jQuery('.js-tx-hh').removeClass('js-tx-cur');
					jQuery(this).addClass('js-tx-cur');
					jQuery('.ls-xx').show();
					jQuery('.gt-fz').hide();
					jQuery('.ls-ss').hide();
				}
				jQuery('.ls-ss').hide();
			});
			jQuery('.js-tx-tb .js-tx-hh').bind("click", function(e) {
				if (!jQuery(this).hasClass('js-tx-cur')) {
					jQuery('.js-tx-ls').removeClass('js-tx-cur');
					jQuery(this).addClass('js-tx-cur');
					jQuery('.ls-xx').hide();
					jQuery('.gt-fz').show();
				}
				jQuery('.ls-ss').hide();
			});
			/*jQuery('.searuser').bind("click", function(e) {
				    jQuery('.js-tx-hh').removeClass('js-tx-cur');
				    jQuery('.js-tx-ls').removeClass('js-tx-cur');
				    jQuery('.ls-ss').show();
					jQuery('.ls-xx').hide();
					jQuery('.gt-fz').hide();
				
			});*/
		}
	};
});
/**
 * 聊天会话列表(单人)
 * @param  {[type]} $log                    [description]
 * @param  {[type]} trshttpServer){	return {		scope:                                         {			id:'@'		} [description]
 * @param  {[type]} restrict:               'E'                                                [description]
 * @param  {String} template:               '<div><p                                           class           [description]
 * @param  {[type]} replace:                true                                               [description]
 * @param  {Object} link:                   function(scope,                                    iElm,           iAttrs,       controller) {			var options [description]
 * @param  {[type]} function(data)          {				console.log(data);				$log.error(data);			} [description]
 * @return {[type]}                         [description]
 */
app.directive('usrlist', function(messageSer,dialogServer){
	return {
		scope: {
			id:'@',
			type:'@'
		}, 
		restrict: 'E',
		template:   "<a href=\"javascript:void(0);\" ng-click=\"openMessage(datalsit[0].fromuserid,1,$event);\" class=\"th-deal-bk pl20\">"
                   	+"<div class=\"th-deal-pc lf\">"
                   	+"<img src=\"{{datalsit[0].headimg}}\">"
                   	+"</div>"
                   	+"<div class=\"th-deal-sp\">"
                   	+"<p class=\"sp-name\">{{datalsit[0].username}}</p>"
                   	+"<p class=\"sp-sta\">{{datalsit[0].job}}</p>"
                   	+"</div>"
                   	+"<div class=\"rt usermess\" style=\"margin-right:52px;margin-top: -30px;padding: 0 5px;background-color: red;border-radius: 10px;color: white;\">{{datalsit[0].messagecount}}</div>"
                   	+"<span class=\"delete_single\" style=\"display:none\"><div style=\"display:none\">{{datalsit[0].fromuserid}}</div><span>"
                   	+"</a>" ,
		replace: true,
		link: function(scope, iElm, iAttrs, controller) {
			var  list_info=messageSer.queryUnreadMessageByIdToJson(scope.id,scope.type);
			list_info.then(function(datalsit) {
               scope.datalsit=datalsit;
			},function(data) {
			})
            scope.openMessage = function(userId, type,$event) {
            	    // $event.currentTarget.childNodes[2].innerHTML=""; 
            	    // $event.currentTarget.children(".usermess").innerHTML=""
					var open = dialogServer.dialogMessage();
					open('600', userId, type);
				}
			//鼠标效果（显示删除）
			$(iElm).mouseover(function ()
			{
				$(this).children(".delete_single").css("display","block");
			}).mouseout(function ()
			{
				$(this).children(".delete_single").css("display","none");
			})
			//删除会话列表
			$(iElm).children(".delete_single").on("click",function(event){
				event.stopPropagation();
				// event.preventDefault();
				var targetId=$(this).children().html(); 
				RongIMClient.getInstance().removeConversation(1, targetId,{
					onSuccess: function(list) {
						// /st 会话列表
						$(iElm).remove();
					},
					onError: function(error) {
						//getRemoteConversationList error
						alert("删除失败");
					}
				});
			})		
		}
	};
});
/**
 * 聊天会话列表(群发)
 * @param  {[type]} $log                    [description]
 * @param  {[type]} trshttpServer){	return {		scope:                                         {			id:'@'		} [description]
 * @param  {[type]} restrict:               'E'                                                [description]
 * @param  {String} template:               '<div><p                                           class           [description]
 * @param  {[type]} replace:                true                                               [description]
 * @param  {Object} link:                   function(scope,                                    iElm,           iAttrs,       controller) {			var options [description]
 * @param  {[type]} function(data)          {				console.log(data);				$log.error(data);			} [description]
 * @return {[type]}                         [description]
 */
app.directive('grouplist', function(messageSer,dialogServer){
	return {
		scope: {
			id:'@',
			type:'@'
		}, 
		restrict: 'E',
		template:  "<div class=\"ls-se-deal\">"
                   +"<div class=\"df-fz-bk\"  ng-click=\"openMessage(datalsit[0].groupid,2,$event);\">"
                   +"<img src=\"common/images/dp-main-icon123.png\"/>"
                   +"<div class=\"df-fz-rt\">"
                   +"<div class=\"fz-rt-name\">"
                   +"<p>{{datalsit[0].groupname}}"
                   +"<div class=\"rt\" style=\"margin-top:2px;padding: 0 5px;background-color: red;border-radius: 10px;color: white;    margin-right: 25px;\">{{datalsit[0].messagecount}}</div>"
                   +"</p>"
                   +"</div>"                      
                   +"</div>"
                   +"<span class=\"deletechart\" style=\"display:none\"><div style=\"display:none\">{{datalsit[0].groupid}}</div></span>"
                   +"</div>" 
                   +"</div>" ,
		replace: true,
		link: function(scope, iElm, iAttrs, controller) {
			var  list_info=messageSer.queryUnreadMessageByIdToJson(scope.id,scope.type);
			list_info.then(function(datalsit) {
               scope.datalsit=datalsit;
			},function(data) {
			})
            scope.openMessage = function(userId, type,$event) {
            	    // $event.currentTarget.childNodes[1].childNodes[0].childNodes[1].innerHTML="";
					var open = dialogServer.dialogMessage();
					open('600', userId, type);
				}
			//鼠标效果
			$(iElm).mouseover(function ()
			{
				$(this).children().children(".deletechart").css("display","block");
			}).mouseout(function ()
			{
				$(this).children().children(".deletechart").css("display","none");
			})	
			//删除会话列表
			$(iElm).children().children(".deletechart").on("click",function(event){
				event.stopPropagation();
				var targetId=$(this).children().html(); 
				RongIMClient.getInstance().removeConversation(3, targetId,{
					onSuccess: function(list) {
						// /st 会话列表
						$(iElm).remove();
					},
					onError: function(error) {
						//getRemoteConversationList error
						alert("删除失败");
					}
				});
			})	
		}
	};
});
/**
 * 列表切换
 * @param  {[type]} chatSer)  {		return       {			scope:   {}    [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller)   {				jQuery(iElm).bind('mouseover', function() {						jQuery('.gt-deal-box').show();				});			}		};	} [description]
 * @return {[type]}           [description]
 */
homeDir.directive('chatshow', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).bind('click', function() {
				jQuery('.gt-deal-box').show();
			});
		}
	};
});
/**
 * 聊天列表一级菜单隐藏显示
 * @param  {[type]} )         {		return       {			scope:   {}    [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller)   {				jQuery(iElm).click(function(event) {					var element [description]
 * @return {[type]}           [description]
 */
homeDir.directive('openMenu', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).click(function(event) {
				var element = event.target || event.srcElement;
				var node = jQuery(element).parent('.ls-ft-tit');
				var show = node.siblings('.ls-se-deal').is(":hidden");
				var classs = node.parent().attr('class');
				if (show) {
					node.siblings('.ls-se-deal').show();
					node.children('.ft-op').show();
					node.children('.ft-cl').hide();
				} else {
					node.siblings('.ls-se-deal').hide();
					node.children('.ft-op').hide();
					node.children('.ft-cl').show();
				}
			});
		}
	};
});
/**
 * 聊天领域、自定义分组列表二级菜单隐藏显示
 * @param  {[type]} )         {		return       {			scope:   {}    [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller)   {				jQuery(iElm).click(function() {					var show [description]
 * @return {[type]}           [description]
 */
homeDir.directive('lyMenuOpen', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).click(function() {
				var show = jQuery(iElm).siblings('.ls-th-deal').is(":hidden");
				if (show) {
					jQuery(iElm).siblings('.ls-th-deal').show();
					jQuery(iElm).children('.se-op').show();
					jQuery(iElm).children('.se-cl').hide();
				} else {
					jQuery(iElm).siblings('.ls-th-deal').hide();
					jQuery(iElm).children('.se-op').hide();
					jQuery(iElm).children('.se-cl').show();
				}
			});
		}
	};
});

/**
 * 群聊人员添加
 * @param  {[type]} )         {		return       {			scope:   {}    [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller)   {				jQuery(iElm).bind('click', function() {					var roleId [description]
 * @return {[type]}           [description]
 */
homeDir.directive('addPeople', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).bind('click', function() {
				var roleId = jQuery('.selected').children('.conlspc').children('.userId').val();
				var index = $.inArray(roleId, $scope.$parent.userIdAarry);
				if (roleId != undefined && roleId != '') {
					if (index < 0) {
						$scope.$parent.userIdAarry.push(roleId);
						var src = jQuery('.selected').children('.conlspc').children('.headImg').val();
						$scope.$parent.headimgAarry.push(src);
						var roleName = jQuery('.selected').children('.roleName').html();
						$scope.$parent.namesAarry.push(roleName);
						jQuery('.selected').removeClass("selected");
						var createobj = $(
							'<a class="con-ls-deal" selected="bg-white">' +
							'<div class="con-ls-pc lf">' +
							'<img src="' + src + '">' +
							'</div>' +
							'<span class="con-ls-name">' + roleName + '</span>' +
							'<input class="headImg" type="hidden" value="' + src + '">' +
							'<input class="roleId" type="hidden" value="' + roleId + '">' +
							'</a>'
						);
						angular.element(jQuery('.add-peo-list')).append(createobj);
						jQuery('.con-ls-deal').bind('click', function() {
							jQuery(this).addClass("bg-white").siblings().removeClass("bg-white");
						});
					} else {
						alert("你已经选择了这个用户！");
					}
				} else {
					alert("你还没有选择人员！");
				}
			});
		}
	};
});
/**
 * 群聊人员删除
 * @param  {[type]} )         {		return       {			scope:   {}    [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller)   {				jQuery(iElm).bind('click', function() {					var roleId [description]
 * @return {[type]}           [description]
 */
homeDir.directive('removePeople', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).bind('click', function() {
				var roleId = jQuery('.bg-white').children('.roleId').val();
				var roleName = jQuery('.bg-white').children('.con-ls-name').html();
				var headImg = jQuery('.bg-white').children('.headImg').val();
				jQuery('.add-peo-list').children('.bg-white').remove();
				$scope.$parent.userIdAarry.splice($.inArray(roleId, $scope.$parent.userIdAarry), 1);
				$scope.$parent.namesAarry.splice($.inArray(roleName, $scope.$parent.namesAarry), 1);
				$scope.$parent.headimgAarry.splice($.inArray(headImg, $scope.$parent.headimgAarry), 1);
			});
		}
	};
});
/**
 * 选择群聊弹出窗切换
 * @param  {[type]} )         {		return       {			scope:   {}    [description]
 * @param  {[type]} restrict: 'A'              [description]
 * @param  {[type]} replace:  true             [description]
 * @param  {[type]} link:     function($scope, iElm,         iAttrs, controller)   {				jQuery(iElm).bind('click', function() {					var type [description]
 * @return {[type]}           [description]
 */
homeDir.directive('choose', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).bind('click', function() {
				var type = iAttrs.choose;
				var siblingClass = iAttrs.siblingClass;
				jQuery('.con-ls-deal').removeClass('selected');
				if (type == "one") {
					jQuery('.one').show().siblings('.' + siblingClass + '').hide();
				} else if (type == "two") {
					jQuery('.two').show().siblings('.' + siblingClass + '').hide();
				} else if (type == "three") {
					jQuery('.three').show().siblings('.' + siblingClass + '').hide();
				} else if (type == "four") {
					jQuery('.four').show().siblings('.' + siblingClass + '').hide();
				}
			})
		}
	};
});
homeDir.directive('selected', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			jQuery(iElm).bind('click', function() {
				jQuery('.con-ls-deal').removeClass(iAttrs.selected);
				jQuery('.con-ls-deal').removeClass('bg-white');
				if (!jQuery(this).hasClass(iAttrs.selected)) {
					jQuery(this).addClass(iAttrs.selected);
				};
			});
			jQuery(iElm).bind('dblclick', function() {
				var roleId = jQuery('.selected').children('.conlspc').children('.userId').val();
				var index = $.inArray(roleId, $scope.$parent.userIdAarry);
				if (roleId != undefined && roleId != '') {
					if (index < 0) {
						$scope.$parent.userIdAarry.push(roleId);
						var src = jQuery('.selected').children('.conlspc').children('.headImg').val();
						$scope.$parent.headimgAarry.push(src);
						var roleName = jQuery('.selected').children('.roleName').html();
						$scope.$parent.namesAarry.push(roleName);
						jQuery('.selected').removeClass("selected");
						var createobj = $(
							'<a class="con-ls-deal" selected="bg-white">' +
							'<div class="con-ls-pc lf">' +
							'<img src="' + src + '">' +
							'</div>' +
							'<span class="con-ls-name">' + roleName + '</span>' +
							'<input class="headImg" type="hidden" value="' + src + '">' +
							'<input class="roleId" type="hidden" value="' + roleId + '">' +
							'</a>'
						);
						angular.element(jQuery('.add-peo-list')).append(createobj);
						jQuery('.con-ls-deal').bind('click', function() {
							jQuery(this).addClass("bg-white").siblings().removeClass("bg-white");
						});
					} else {
						alert("你已经选择了这个用户！");
					}
				} else {
					alert("你还没有选择人员！");
				}
			});
		}
	};
});
homeDir.directive('menuhigh', function() {
	return {
		scope: {},
		restrict: 'A',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			setModule(jQuery(".clearfix-body"));
			/*window.onresize=function(){
			    setModule(jQuery(".dp-navbar"));
			}*/
			function setModule(div){
			    var screen_height;
			    if(jQuery(window).height()>=jQuery(iElm).height()){
			        screen_height=jQuery(window).height()-60;
			        div.css({'min-height':screen_height+'px'});
			    }
			    else{
			        screen_height=jQuery(iElm).height()-60;
			        div.css({'min-height':screen_height+'px'});
			    }
			}
		}
	};
});