"use strict";
/**
 * webIMModule Module
 *
 * Description 接入云通讯指令
 * Author:wang.jiang 2016-3-2
 */
angular.module('webIMModule', [
    'inviteJoinGroupModule',
    'IMDeleteGroupMemberModule',
    'IMServiceMoudle',
    'IMWCMServiceModule',
]).controller('trsImController', ['$scope', '$q', '$filter', '$location', 'IMService', '$timeout', '$modal', '$sce', '$window', 'trsSelectItemByTreeService', 'trsHttpService', 'trsspliceString', 'IMWCMService', 'trsconfirm', 'Upload',
    function($scope, $q, $filter, $location, IMService, $timeout, $modal, $sce, $window, trsSelectItemByTreeService, trsHttpService, trsspliceString, IMWCMService, trsconfirm, Upload) {
        /*return {
            restrict: 'E',
            templateUrl: "./components/util/IM/template/IM_tpl.html",
            link: function($scope, iElement, iAttrs) {*/
        initStatus();
        initData();

        function initStatus() {
            $scope.page = {
                pageSize: 20,
            };
            $scope.data = {
                IMInfo: {},
                groups: {},
                searchUserName: "",
                friendList: [], //好友列表
                allUserList: [], //所有用户列表
                users: [],
                order: 2, //排序方式 1升序 2降序 默认为1,
                recentContacts: [], //最近联系人
                talkGroupList: [], //讨论组
            };
            $scope.tabs = [
                { currName: "news" },
                { currName: "address" },
            ];
            $scope.status = {
                content: "",
                selectedNode: "",
                expandedNodes: "",
                currTalkTo: "",
                dowmIcon: false, //下拉箭头
                downGroup: false,
                treeOptions: {
                    nodeChildren: "CHILDREN",
                    dirSelectable: true,
                    injectClasses: {
                        ul: "a1",
                        li: "a2",
                        liSelected: "a7",
                        iExpanded: "a3",
                        iCollapsed: "a4",
                        iLeaf: "a5",
                        label: "a6",
                        labelSelected: "a8"
                    },
                    isLeaf: function(node) {
                        return node.HASCHILDREN == "false";
                    }
                },
                unReadMessageIcon: { //未读信息标志

                },
                deleteTalk: { //好友的删除按钮
                    deleteIcon: false,
                    onDeleteIcon: false,
                    curMouseEnter: ""
                },
                dropOut: false, //退出
                emojies: [],
                emojiesOut: [],
                emojiKey: [],
                msgType: 1, // text: 1,voice: 2, video: 3,image: 4,place: 5,file: 6, default:1

                imgStyle: {
                    width: 150,
                    height: 200,
                },
                files: [],
            };
            initDependencies();
        }

        function initData() {
            getAllUserList().then(function(data) {
                $scope.data.allUserList = data.DATA;
            });
        }
        $scope.$on("$destroy", function() {
            DO_logout();
            $scope.loadingPromise = IMService.IMLogout();
        });

        function initDependencies() {
            $scope.dependencies = [];
            $scope.dependencies.push("http://app.cloopen.com/im50/ytx-web-im-min-new.js");
            $scope.dependencies.push($location.absUrl().split("#")[0] + "/lib/js-base64/base64.js");
            $scope.dependencies.push($location.absUrl().split("#")[0] + "/lib/md5/md5-min.js");
            $scope.dependencies.push($location.absUrl().split("#")[0] + "/lib/im/emoji.js");
        }
        $scope.loadingPromise = LazyLoad.js($scope.dependencies, function(emoji) {
            initEmoji();
            $scope.loadingPromise = IMService.getIMInfo().then(function(data) {
                $scope.data.IMInfo = data;
                //初始化SDK
                return $scope.loadingPromise = IMService.initIM($scope.data.IMInfo.APPID);
            }).then(function(data) {
                //获取组织
                return $scope.loadingPromise = IMService.getWCMGroups();
            }).then(function(data) {
                $scope.data.groups = [data];
                //var timestamp = IMService.getTimeStamp();
                var timestamp = getTimeStamp();
                return $scope.loadingPromise = IMService.getMD5Sig(timestamp);
                //登录
            }).then(function(data) {
                return $scope.loadingPromise = IMService.IMLogin($scope.data.IMInfo.USER.USERID, data.SIG, data.TIMESTAMP);
            }).then(function(obj) {
                getGroupList().then(function(data) {
                    $scope.loadingPromise = IMWCMService.getFriendList().then(function(dataC) {
                        $scope.data.friendList = dataC;
                        $scope.data.friendList = $scope.data.friendList.concat(data);
                    });
                });
                $scope.status._onMsgReceiveListener = RL_YTX.onMsgReceiveListener(function(obj) {
                    document.getElementById('im_ring').play();
                    $scope.status.msgType = obj.msgType;
                    saveMessage(obj.msgReceiver, obj.msgContent, obj.msgDateCreated, obj.msgSender, obj.msgId, obj.msgType, obj.msgFileUrl).then(function() {
                        //群聊
                        if (obj.msgReceiver === $scope.status.currTalkTo.groupId) {
                            getGroupChat($scope.status.currTalkTo).then(function() {
                                $("div.IM_chat02_content").scrollTop($("div.IM_chat02_content")[0].scrollHeight);
                            });
                        }
                        //私聊
                        else if ($scope.status.currTalkTo.FRIENDID === obj.msgSender && obj.msgReceiver.indexOf('gg') < 0) {
                            getPrivateChat($scope.status.currTalkTo).then(function() {
                                $("div.IM_chat02_content").scrollTop($("div.IM_chat02_content")[0].scrollHeight);
                            });
                        } else {
                            IMWCMService.getFriendList().then(function(data) {
                                $scope.data.friendList = data;
                                if (obj.msgReceiver.indexOf('gg') < 0) {
                                    $scope.status.unReadMessageIcon[obj.msgSender] = true;
                                } else {
                                    $scope.status.unReadMessageIcon[obj.msgReceiver] = true;
                                }
                                getGroupList().then(function(data) {
                                    $scope.data.friendList = $scope.data.friendList.concat(data);
                                });
                            });
                        }


                    });

                });
                //注册群组通知事件监听
                $scope.status._onNoticeReceiveListener = RL_YTX.onNoticeReceiveListener(function(obj) {
                    //收到群组通知

                    //getGroupChat(group);

                });
                $scope.status._onConnectStateChangeLisenter = RL_YTX.onConnectStateChangeLisenter(function(obj) {
                    //连接状态变更
                });
                // 服务器连接状态变更时的监听
                $scope.status._onConnectStateChangeLisenter = RL_YTX.onConnectStateChangeLisenter(function(obj) {
                    // obj.code;//变更状态 1 断开连接 2 重练中 3 重练成功 4 被踢下线 5 断开连接，需重新登录
                    // 断线需要人工重连
                    if (1 == obj.code) {

                    } else if (2 == obj.code) {
                        //$alert({ title: 'Holy guacamole!', content: 'Best check yo self, you\'re not looking too good.', placement: 'top', type: 'info', show: true });

                        /*IM.HTML_showAlert('alert-warning',
                            '网络状况不佳，正在试图重连服务器', 10 * 60 * 1000);*/
                    } else if (3 == obj.code) {
                        //$alert({ title: 'Holy guacamole!', content: 'Best check yo self, you\'re not looking too good.', placement: 'top', type: 'info', show: true });

                        /*IM.HTML_showAlert('alert-success', '连接成功');*/
                    } else if (4 == obj.code) {
                        /*IM.DO_logout();
                        alert(obj.msg);*/
                    } else if (5 == obj.code) {
                        // $alert({ title: '网络状况不佳，正在试图重连服务器', content: '', placement: 'top', type: 'info', show: true });

                        /* IM.HTML_showAlert('alert-warning',
                             '网络状况不佳，正在试图重连服务器');*/
                        $scope.loadingPromise = IMService.IMLogin($scope.data.IMInfo.USER.USERID, $scope.data.IMInfo.SIG, $scope.data.IMInfo.TIMESTAMP);
                    } else {
                        console.log('onConnectStateChangeLisenter obj.code:' + obj.msg);
                    }
                });
            });
        });

        /**
         * [newLine,sendIt description]按下ctrl+enter换行，按下enter直接发送消息
         * @param  {[type]} ev [description]
         * @return {[type]}    [description]
         */
        $scope.newLine = function(ev) {
            if (ev.ctrlKey && ev.keyCode == 13) {
                $scope.status.content = $scope.status.content + '\r';
            }
        };
        $scope.sendIt = function(ev) {
            if (ev.keyCode == 13) {
                ev.preventDefault();
                $scope.sendMessage();
            }
        };

        /**
         * [sendMessage description]发送消息
         * @return {[type]} [description]
         */
        $scope.sendMessage = function() {
            var content = $scope.status.content.replace(/\r/g, '');
            if ($scope.status.content === "") {
                trsconfirm.saveModel("禁止发送空消息", "", "error");
                return;
            }
            var reciveid = $scope.status.isSingleTalk ? $scope.status.currTalkTo.FRIENDID || ($scope.status.currTalkTo.USERID + '') : $scope.status.currTalkTo.groupId;
            var msgid = reciveid + new Date().getTime() + $scope.data.IMInfo.USER.USERID;
            var type = $scope.status.isSingleTalk ? 2 : 1;
            var contentArray = divideContent();
            for (var i in contentArray) {
                var file = contentArray[i].type > 1 ? contentArray[i].file : '';
                doSendMessage(reciveid, msgid, contentArray[i].content, file, contentArray[i].type).then(function() {
                    $scope.status.content = "";
                    $scope.status.files = [];
                });
            }
            $("#editArea").focus();
            // addMessageList();
        };

        function doSendMessage(reciveid, msgid, content, file, msgType) {
            var defer = $q.defer();
            IMService.sendMsg(reciveid, msgid, msgType, file, replaceContent(content).replace(/\n/g, '<br/>')).then(function(obj) {
                saveMessage(reciveid, content.replace(/\n/g, '<br/>'), new Date().getTime(), $scope.data.IMInfo.USER.USERID, obj.msgId, msgType).then(function() {
                    addMessageList(content);
                    defer.resolve();
                });
                if ($scope.data.friendList.indexOf($scope.status.currTalkTo) > 0) {
                    $scope.data.friendList.splice($scope.data.friendList.indexOf($scope.status.currTalkTo), 1);
                    $scope.data.friendList.splice(0, 0, $scope.status.currTalkTo);
                }
            }, function(sended, total) {
                addMessageList(content);
                defer.resolve();
            });
            return defer.promise;
        }
        /**
         * [addMessageList description] 增加一条聊天记录
         */
        function addMessageList(content) {
            var message = {
                TRANSMITSNAME: $scope.data.IMInfo.USER.TRUENAME,
                HISTORICALNEWS: content.replace(/\n/g, '<br/>'),
                TRANSMITS: $scope.data.IMInfo.USER.USERID,
                CHATTYPE: $scope.status.isSingleTalk ? 2 : 1,
                AVATAR: $scope.data.IMInfo.USER.USERHEAD,
                HISTORCALTIME: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                NEWSTYPE: '1'
            };
            $scope.data.messageList.unshift(message);
            $timeout(function() { $("div.IM_chat02_content").scrollTop($("div.IM_chat02_content")[0].scrollHeight); }, 10);
        }
        /**
         * [getTime description] 智能显示聊天记录的时间
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        $scope.getTime = function(item) {
            var curTime = new Date(); //当前时间
            var theTime = new Date(Date.parse(item.HISTORCALTIME)); //选中时间
            var curDate = $filter("date")(curTime, "yyyy-MM-dd").toString();
            var theDate = $filter("date")(theTime, "yyyy-MM-dd").toString();
            if (curDate === theDate) {
                return $filter("date")(theTime, "HH:mm").toString();
            } else {
                return $filter("date")(theTime, "yyyy-MM-dd HH:mm").toString();
            }
        };
        /**
         * [nodeToggle description] 组织树节点切换
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
        $scope.nodeToggle = function(node) {
            if (node.HASCHILDREN === "true" && node.CHILDREN.length === 0)
                getChildrenNode(node);
        };

        function getChildrenNode(node) {
            var params = {
                "serviceid": "mlf_group",
                "methodname": "queryChildGroupsWithOutRight",
                "GroupId": node.GROUPID
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                node.CHILDREN = data.CHILDREN;

            });
        }
        $scope.selectNode = function(node) {
            $scope.status.selectedNode = node;
            if (!!node.USERLIST)
                $scope.data.users = node.USERLIST.DataUser;
        };
        //回到好友列表
        $scope.backToFriends = function(item) {
            $scope.tabs[0].active = true;
            addUserToFriend(item);
        };
        /**
         * [filterFriendid description]通过好友的好友id过滤
         * @param  {[obj]} elm [description]好友的信息
         * @return {[boolean]}     [description]
         */
        $scope.filterFriendid = function(elm) {
            if (angular.isDefined(elm.FRIENDID)) {
                return elm.FRIENDID == $scope.data.userInfo.USERID;
            } else {
                return elm.USERID == $scope.data.userInfo.USERID;
            }
        };
        /**
         * [addUserToFriend description]将集团用户加入到好友列表，,如果对象在好友列表中了，
         * 则将该好友排在第一位，否则加入到好友列表中
         * @param {[type]} item [description] 双击集团用户传入的对象
         */
        function addUserToFriend(item) {
            $scope.data.userInfo = item;
            $scope.status.isSingleTalk = true;
            $scope.status.currTalkTo = item;
            var temp = $filter('pick')($scope.data.friendList, $scope.filterFriendid);
            if (temp.length > 0) {
                $scope.data.friendList.splice($scope.data.friendList.indexOf(temp[0]), 1);
                $scope.data.friendList.splice(0, 0, item);
            } else {
                addFriend(item);
            }
            $("div.IM_chat01_content ul.content_news_hover").scrollTop(0);
            getPrivateChat(item).then(function() {
                $timeout(function() {
                    $("div.IM_chat02_content").scrollTop($("div.IM_chat02_content")[0].scrollHeight);
                });
            });
        }
        /**
         * [addFriend description]将WCM用户加入到常用联系人
         * @param {[type]} item [description]
         */
        function addFriend(item) {
            var params = {
                serviceid: "mlf_yuncloud",
                methodname: "saveUserFriends",
                friendid: item.USERID
            };
            var defer = $q.defer();
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function() {
                $scope.loadingPromise = IMWCMService.getFriendList().then(function(data) {
                    $scope.data.friendList = $filter('unique')(data.concat($scope.data.friendList), 'FRIENDID');
                    defer.resolve();
                });
            });
            return defer.promise;
        }
        /**
         * [talkTo description]单聊
         * @param  {[type]} friend [description] wcm friend对象
         */
        $scope.talkTo = function(friend) {
            if (angular.isDefined(friend.FRIENDID) || angular.isDefined(friend.USERID)) {
                $scope.status.unReadMessageIcon[friend.FRIENDID] = false;
                talkToFriend(friend);
            } else {
                $scope.status.unReadMessageIcon[friend.groupId] = false;
                $scope.status.isSingleTalk = false;
                $scope.data.messageList = [];
                $scope.status.currTalkTo = friend;
                getGroupChat(friend).then(function() {
                    $timeout(function() {
                        $("div.IM_chat02_content").scrollTop($("div.IM_chat02_content")[0].scrollHeight);
                    });
                });
                getGroupMemberList(friend);
            }
        };
        //单聊
        function talkToFriend(friend) {
            $scope.status.isSingleTalk = true;
            $scope.data.messageList = [];
            $scope.data.groupMembers = [];
            $scope.status.currTalkTo = friend;
            //if ($scope.data.friendList.indexOf(friend) < 0) $scope.data.friendList = $scope.data.friendList.splice(0, 0, friend);
            getPrivateChat(friend).then(function() {
                $timeout(function() {
                    $("div.IM_chat02_content").scrollTop($("div.IM_chat02_content")[0].scrollHeight);
                });
            });
        }
        /**
         * [rankUp description] 有新消息时置顶提示
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        $scope.rankUp = function(item) {
            if ((!item.groupId && $scope.status.unReadMessageIcon[item.FRIENDID]) || (item.groupId && $scope.status.unReadMessageIcon[item.groupId])) {
                $scope.data.friendList.splice($scope.data.friendList.indexOf(item), 1);
                $scope.data.friendList.splice(0, 0, item);
                return true;
            } else {
                return false;
            }
        };
        /**
         * [getGroupMemberList description]分页获取群成员
         * @param  {[type]} group [description] 荣连组
         * @return {[type]}       [description]
         */
        function getGroupMemberList(group) {
            var deferred = $q.defer();
            var GetGroupMemberListBuilder = new RL_YTX.GetGroupMemberListBuilder();
            GetGroupMemberListBuilder.setGroupId(group.groupId);
            RL_YTX.getGroupMemberList(GetGroupMemberListBuilder, function(data) {
                $scope.data.groupMembers = data;
                deferred.resolve(data);
            }, function(obj) {
                deferred.reject();
            });
            return deferred.promise;
        }
        /**
         * [talkToGroup description]群聊
         * @return {[type]} [description]
         */
        // $scope.talkToGroup = function(group) {
        //     $scope.status.isSingleTalk = false;
        //     $scope.data.messageList = [];
        //     $scope.status.currTalkTo = group;
        //     getGroupChat(group).then(function() {
        //         $timeout(function() {
        //             $("div.IM_chat02_content").scrollTop($("div.IM_chat02_content")[0].scrollHeight);
        //         });
        //     });
        //     getGroupMemberList(group);
        // };
        /**
         * [getGroupChat description]获取群组消息记录
         * @return {[type]} [description]
         */
        function getGroupChat(group) {
            var defer = $q.defer();
            var params = {
                serviceid: "mlf_yuncloud",
                methodname: "getGroupChattingRecords",
                RECEIVE: group.groupId

            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.messageList = data.DATA;
                defer.resolve();
            });
            return defer.promise;
        }
        /**
         * [getPrivateChat description]获取私聊记录
         * @param  {[type]} friend [description] friend 对象
         * @return {[type]}        [description]
         */
        function getPrivateChat(friend) {
            var params = {
                serviceid: "mlf_yuncloud",
                methodname: "getPrivateChattingRecords",
                receive: friend.FRIENDID || friend.groupId || friend.USERID,

            };
            var defer = $q.defer();
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.messageList = data.DATA;
                defer.resolve();
            });
            return defer.promise;
        }

        function saveMessage(msgReceiver, msgContent, msgDateCreated, msgSender, msgId, msgType, msgFileUrl) {
            var params = {
                serviceid: "mlf_yuncloud",
                methodname: "saveMessage",
                CHATTYPE: msgReceiver.indexOf("g") === 0 ? 1 : 2, //群聊：1 私聊：2
                RECEIVE: msgReceiver,
                NEWSTYPE: msgType,
                HISTORICALNEWS: msgContent,
                POSITION: "",
                FILENAME: "",
                timestamp: msgDateCreated,
                sender: msgSender,
                messageid: msgId,
                msgFileUrl: msgFileUrl

            };
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $scope.status.msgType = 1;
                deferred.resolve();
            });
            return deferred.promise;
        }

        /**
         * [getGroupList description]获取讨论组
         * @return {[type]} [description]
         */
        function getGroupList() {
            var deferred = $q.defer();
            IMService.getTalkGroups().then(function(data) {
                $scope.data.talkGroupList = data;
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        $scope.showIcon = function(event, isToggle) {
            event.stopPropagation();
            $scope.status.dowmIcon = isToggle ? !$scope.status.dowmIcon : true;
        };

        $scope.showGroup = function(event, isToggle) {
            event.stopPropagation();
            $scope.status.downGroup = isToggle ? !$scope.status.downGroup : true;
        };

        /**
         * [createTalkGroup description]创建群组
         * @return {[type]} [description]
         */
        $scope.createTalkGroup = function() {
            $scope.loadingPromise = IMService.createGroup("TRSWebIM" + getTimeStamp());
        };
        //邀请好友加入群组
        $scope.inviteJoinGroup = function() {
            /*getGroupMemberList($scope.status.currTalkTo).then(function(data){
               console.log(data);
            });*/

            var modalInstance = $modal.open({
                templateUrl: "./components/util/IM/template/inviteJoinGroup.html",
                windowClass: 'discussionGrou',
                backdrop: true,
                controller: "InviteJoinGroupCtrl",
                resolve: {
                    params: function() {
                        return {
                            "currTalkTo": $scope.status.currTalkTo,
                            "currMembers": $scope.data.groupMembers,
                            "isGroup": $scope.status.currTalkTo.groupId ? true : false,
                        };
                    }
                },
            });
            modalInstance.result.then(function(result) {
                var groupName = result.groupName,
                    userids = trsspliceString.spliceString(result.selectedArray, "FRIENDID", ",");
                if ($scope.status.currTalkTo.groupId) {
                    inviteJoinGroup($scope.status.currTalkTo.groupId, userids).then(function() {
                        getGroupMemberList($scope.status.currTalkTo);
                    });
                } else {
                    $scope.loadingPromise = IMService.createGroup(groupName).then(function(obj) {
                        inviteJoinGroup(obj.data, userids).then(function() {
                            // refreshFriendList();
                            var temporaryGroup = {
                                'groupId': obj.data,
                                'name': groupName,
                            }
                            $scope.data.friendList.unshift(temporaryGroup);
                            $timeout(function() {
                                $("ul.content_news_hover").scrollTop(0);
                            });
                        });
                    });
                }
            });
        };
        /**
         * 
         * [inviteJoinGroup description]邀请用户加入群组
         * @return {[type]} [description]
         */
        function inviteJoinGroup(group, userids) {
            var deferred = $q.defer();
            var InviteJoinGroupBuilder = new RL_YTX.InviteJoinGroupBuilder();
            InviteJoinGroupBuilder.setGroupId(group);

            userids = userids.split(",");
            /* for (var i in users) {
                 var member = {};
                 member.member = users[i].UNAME;
                 member.nickName = "";
                 member.role = 2;
                 member.speakState = 1;
                 members.push(member);
             }*/
            InviteJoinGroupBuilder.setMembers(userids);
            InviteJoinGroupBuilder.setConfirm(1); //默认不需要被邀请者确认
            RL_YTX.inviteJoinGroup(InviteJoinGroupBuilder, function(data) {

                deferred.resolve(data);
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        };
        //踢出群组成员
        $scope.deleteGroupMember = function() {
            if ($scope.status.currTalkTo.owner == $scope.data.IMInfo.USER.USERID) {
                deleteGroupMember();
            } else {
                trsconfirm.confirmModel('退出群组', '确定退出该群组', function() {
                    IMService.quitGroup($scope.status.currTalkTo.groupId).then(function() {
                        refreshFriendList();
                    })
                })
            }
        };
        /**
         * [deleteGroupMember description]踢出群组成员
         * @param  {[type]} group [description]
         * @return {[type]}       [description]
         */
        function deleteGroupMember() {
            var modalInstance = $modal.open({
                templateUrl: "./components/util/IM/template/deleteGroupMember_tpl.html",
                windowClass: 'IMDeleteGroupMember',
                backdrop: true,
                controller: "IMDeleteGroupMemberCtrl",
                resolve: {
                    params: function() {
                        return {
                            "currTalkTo": $scope.status.currTalkTo,
                            "currMembers": $scope.data.groupMembers,
                            "user": $scope.data.IMInfo.USER,
                        };
                    }
                },
            });
            modalInstance.result.then(function(result) {
                if (result == 'quit') {
                    IMService.quitGroup($scope.status.currTalkTo.groupId).then(function() {
                        refreshFriendList();
                    })
                } else {
                    if (result.deleteMember.length < 1) return;
                    var userids = trsspliceString.spliceString(result.deleteMember, "member", ",");
                    IMService.deleteGroupMember($scope.status.currTalkTo.groupId, userids).then(function(obj) {
                        getGroupMemberList($scope.status.currTalkTo);
                    }, function(obj) {})
                }
            });
        }
        /**
         * [quitGroup description]退出群组
         * @param  {[type]} group [description]
         * @return {[type]}       [description]
         */
        function quitGroup() {
            var QuitGroupBuilder = new RL_YTX.QuitGroupBuilder();
            QuitGroupBuilder.setGroupId($scope.status.currTalkTo.groupId);
            RL_YTX.quitGroup(QuitGroupBuilder, function(data) {
                refreshFriendList();
            }, function(obj) {});
        }
        /**
         * [getSuggestions description]  按照姓名检索用户
         * @param  {[type]} viewValue [description]
         * @return {[type]}           [description]
         */
        $scope.getSuggestions = function(viewValue) {
            if (viewValue !== '' && checkValue(viewValue)) {
                var searchUsers = {
                    serviceid: "mlf_report",
                    methodname: "queryUserByName",
                    Name: viewValue
                };
                return $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), searchUsers, "post").then(function(data) {
                    return data.DATA;
                });

            }

        };
        var checkValue = function(newValue) {
            if (angular.isObject(newValue)) {
                $scope.saveFriend(newValue);
                return false;
            } else {
                return true;
            }
        };

        /**
         * 登出
         * 
         * @constructor
         */
        function DO_logout() {
            // 销毁PUSH监听
            $scope.status._onMsgReceiveListener = null;
            // 注册客服消息监听
            $scope.status._onDeskMsgReceiveListener = null;
            // 销毁注册群组通知事件监听
            $scope.status._noticeReceiveListener = null;
            // 服务器连接状态变更时的监听
            $scope.status._onConnectStateChangeLisenter = null;
            //呼叫监听
            $scope.status._onCallMsgListener = null;
            //阅后即焚监听
            $scope.status._onMsgNotifyReceiveListener = null;
        }
        /**
         * 获取当前时间戳 YYYYMMddHHmmss
         * 
         * @returns {*}
         */
        function getTimeStamp() {
            var now = new Date();
            var timestamp = now.getFullYear() + '' + ((now.getMonth() + 1) >= 10 ? "" + (now.getMonth() + 1) : "0" + (now.getMonth() + 1)) + (now.getDate() >= 10 ? now.getDate() : "0" + now.getDate()) + (now.getHours() >= 10 ? now.getHours() : "0" + now.getHours()) + (now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()) + (now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds());
            return timestamp;
        }

        /*getAllUserList: 获取所有用户列表*/
        function getAllUserList() {
            var params = {
                serviceid: "mlf_yuncloud",
                methodname: "queryAllUsers",
                searchName: $scope.data.searchUserName,
            };
            var defer = $q.defer();
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                defer.resolve(data);
            });
            return defer.promise;
        }

        /*searchAllUser: 搜索所有用户*/
        var promise;
        $scope.searchAllUser = function(searchName) {
            if (promise) {
                $timeout.cancel(promise);
                promise = null;
            }
            promise = $timeout(function() {
                if (searchName !== '') {
                    var params = {
                        serviceid: "mlf_yuncloud",
                        methodname: "queryAllUsers",
                        searchName: $scope.data.searchUserName,
                    };
                }
                if ($scope.status.isRequest) {
                    $scope.status.isRequest = false;
                    return [];
                } else {
                    return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        return data;
                        // return [$filter('groupBy')(data, "ISFRIEND")]; 
                    });
                }
            }, 10);
            return promise;
        };

        $scope.$watch('data.searchUserName', function(newValue, oldValue, scope) {
            if (angular.isObject(newValue)) {
                $scope.status.isRequest = true;
                $scope.data.searchUserName = newValue.TRUENAME;
                $scope.tabs[0].active = true;
                addUserToFriend(newValue);
            }
        });

        /**
         * [deleteTalk description] 删除选中的会话
         * @param  {[type]} item [description]
         * @param  {[type]} ev   [description]
         * @return {[type]}      [description]
         */
        $scope.deleteTalk = function(item, ev) {
            ev.stopPropagation();
            !!item.groupId ? deleteGroup(item) : deleteFriend(item);
        };

        /**
         * [deleteFriend description] 删除会话列表里的好友
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        function deleteFriend(item) {
            var params = {
                serviceid: "mlf_yuncloud",
                methodname: "unFriend",
                friendIds: item.FRIENDID || item.USERID,
            };
            trsconfirm.confirmModel("删除好友", "请确认是否要删除该好友", function() {
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.data.friendList.splice($scope.data.friendList.indexOf(item), 1);
                    $scope.status.currTalkTo = "";
                    $scope.data.messageList = [];
                });
            });
        }

        /**
         * [deleteGroup description] 删除会话列表里的群组
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        function deleteGroup(item) {
            trsconfirm.confirmModel("删除群组", "请确认是否要删除该群组", function() {
                $scope.loadingPromise = IMService.dismissGroup(item.groupId).then(function(data) {
                    $scope.data.friendList.splice($scope.data.friendList.indexOf(item), 1);
                    $scope.status.currTalkTo = "";
                    $scope.data.messageList = [];
                }, function(obj) {
                    console.log(obj);
                });
            });
        }

        /*用于多种情况下的重新刷新好友列表*/
        function refreshFriendList() {
            var deferred = $q.defer();
            getGroupList().then(function(data) {
                $scope.loadingPromise = IMWCMService.getFriendList().then(function(dataC) {
                    $scope.data.friendList = dataC;
                    $scope.data.friendList = $scope.data.friendList.concat(data);
                    $scope.status.currTalkTo = "";
                    $scope.data.messageList = [];
                    deferred.resolve();
                });
            });
            return deferred.promise;
        }

        /**
         * [showIcon description] 显示好友列表头像
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        $scope.showIcon = function(item) {
            if (item.FRIENDTRUENAME || item.TRUENAME) {
                if (item.FRIENDHEAD || item.USERHEAD) {
                    return ('/wcm/app/system/read_image.jsp?FileName=' + (item.FRIENDHEAD || item.USERHEAD));
                } else {
                    return ('./components/util/IM/images/2016.jpg');
                }
            }
            if (item.name) {
                return ('./components/util/IM/images/tx-28.jpg');
            }
        };
        //初始化表情
        function initEmoji() {
            for (var i in emoji.show_data) {
                $scope.status.emojiKey.push(i);
                $scope.status.emojies.push(emoji.show_data[i]);
                $scope.status.emojiesOut.push(emoji.replace_unified((emoji.show_data[i])[0][0]));
            }
        }

        //选择表情
        $scope.chooseEmoji = function(index) {
            var content_emoji = '<img imtype="content_emoji" emoji_value_unicode="' +
                $scope.status.emojiKey[index] +
                '" style="width:18px; height:18px; margin:0 1px 0 1px;" src="./components/util/IM/emoji/' +
                $scope.status.emojiKey[index] + '.png"/>';
            $scope.status.content = $scope.status.content + content_emoji;
        };

        function replaceContent(content) {
            var str = angular.copy(content),
                caculator = 0;
            var emojiHtml = [];
            var regx = /emoji_value_unicode="([\s\S]*?)"/gi,
                regxImg = /(<img[\s\S]*?png"[\/]?>)/gi;
            while (regxImg.test(str)) {
                emojiHtml.push(RegExp.$1);
            }
            while (regx.test($scope.status.content)) {
                str = str.replace(emojiHtml[caculator++], emoji.show_data[RegExp.$1][0][0]);
            }
            return str;
        }
        $scope.replaceUnified = function(content) {
            if (!content) return content;
            return emoji.replace_unified(content);
        };
        //附件上传
        $scope.upload = function(oFile, msgType) {
            if (!oFile) return;
            var fileObj = {
                file: oFile,
                type: msgType
            };
            $scope.status.files.push(fileObj);
            var reciveid = $scope.status.isSingleTalk ? $scope.status.currTalkTo.FRIENDID || ($scope.status.currTalkTo.USERID + '') : $scope.status.currTalkTo.groupId;
            var msgid = reciveid + new Date().getTime() + $scope.data.IMInfo.USER.USERID;
            var url = $window.URL.createObjectURL(oFile);
            var str = '<img trsfile imtype="msg_attach_src" src="' + url + '" style="max-width:' +
                $scope.status.imgStyle.width + 'px; max-height:' + $scope.status.imgStyle.height + 'px;" ' +
                ' onclick="IM.DO_pop_phone(\'' + reciveid + '\', \'' + '' + '\',this)" />';
            $scope.status.content += str;
        };
        //分割内容，将附件和文字信息分开发送
        function divideContent() {
            var regxFile = /(<[\s\S]*? trsfile[\s\S]*?\/?>)/gi,
                str = angular.copy($scope.status.content);
            var fileIndex = 0;
            var contentArray = [],
                contentObj = {},
                index = 0;
            if (str.indexOf("trsfile") === -1) {
                contentArray.push({ content: str, type: 1 });
                return contentArray;
            }
            while (regxFile.test(str)) {
                fileIndex = str.indexOf(RegExp.$1);
                if (fileIndex > 0) {
                    contentArray.push({
                        content: str.substring(0, fileIndex),
                        type: 1
                    });
                }
                contentArray.push({
                    content: str.substring(fileIndex, RegExp.$1.length + fileIndex),
                    type: $scope.status.files[index].type,
                    file: $scope.status.files[index].file
                });
                str = str.replace(str.substring(0, RegExp.$1.length + fileIndex), "");
                if (str.indexOf("trsfile") === -1&&str!=="") {
                    contentArray.push({
                        content: str,
                        type: 1,
                    });
                }
                index++;
            }
            return contentArray;
        }
    }
]);
