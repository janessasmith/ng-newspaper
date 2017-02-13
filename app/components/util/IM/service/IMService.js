'use strict';
angular.module('IMServiceMoudle', []).factory('IMService', ['$q', 'trsHttpService', 'versionCtrl', function($q, trsHttpService, versionCtrl) {
    return {
        getIMInfo: function() {
            var deferred = $q.defer();
            var params = {
                serviceid: "mlf_yuncloud",
                methodname: "queryMD5Sig",
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        initIM: function(appid) {
            var deferred = $q.defer();
            if (versionCtrl.isDebug) appid = "8a48b55152f73add01532b8cd7a85b20";
            if (versionCtrl.isOffical) appid = "8a216da854e1a37a0154e20f19b1013a";
            var resp = RL_YTX.init(appid);
            if (170002 == resp.code) {
                //缺少必要参数，详情见msg参数
                //用户逻辑处理
                deferred.reject("缺少必要参数");
            } else if (174001 == resp.code) {
                //不支持HTML5，关闭页面
                //用户逻辑处理
                deferred.reject("不支持HTML5，关闭页面");
            } else if (200 == resp.code) {
                //初始化成功
                //用户逻辑处理
                //判断不支持的功能，屏蔽页面展示
                //var unsupport = obj.unsupport;
                deferred.resolve();
                /*IMService.IMLogin().then(function(obj) {

                });*/
            }
            return deferred.promise;
        },
        /**
         * 獲取WCM組織用戶
         */

        getWCMGroups: function() {
            var deferred = $q.defer();
            var params = {
                serviceid: "mlf_yuncloud",
                methodname: "queryGroupTreeWithOutRights"
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;

        },
        IMLogin: function(userid, sig, timeStamp) {
            var deferred = $q.defer();
            var loginBuilder = new RL_YTX.LoginBuilder();
            loginBuilder.setType(1); //登录类型 1账号登录，3voip账号密码登录
            loginBuilder.setUserName(userid); //设置用户名
            loginBuilder.setPwd(); //type值为1时，密码可以不赋值
            if (versionCtrl.isDebug) sig = hex_md5('8a48b55152f73add01532b8cd7a85b20' + userid + timeStamp + 'beb73534837882ef71536aad12732600');
            if (versionCtrl.isOffical) sig = hex_md5('8a216da854e1a37a0154e20f19b1013a' + userid + timeStamp + '18c143babd825e6d37c4ba43aa0354e7');
            loginBuilder.setSig(sig); //设置sig
            loginBuilder.setTimestamp(timeStamp); //设置时间戳
            //执行用户登录

            RL_YTX.login(loginBuilder, function(obj) {
                //登录成功回调
                deferred.resolve(obj);
            }, function(obj) {
                console.log(obj);
                deferred.reject(obj);
                //登录失败方法回调
            });
            return deferred.promise;
        },
        getTimeStamp: function() {
            var now = new Date();
            var timestamp = now.getFullYear() + '' + ((now.getMonth() + 1) >= 10 ? "" + (now.getMonth() + 1) : "0" + (now.getMonth() + 1)) + (now.getDate() >= 10 ? now.getDate() : "0" + now.getDate()) + (now.getHours() >= 10 ? now.getHours() : "0" + now.getHours()) + (now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()) + (now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds());
            return timestamp;
        },
        getMD5Sig: function(timestamp) {
            var deferred = $q.defer();
            var params = {
                serviceid: "mlf_yuncloud",
                methodname: "getMD5Sig",
                timestamp: timestamp
            };

            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                data.TIMESTAMP = timestamp;
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        IMLogout: function() {
            var deferred = $q.defer();
            RL_YTX.logout(function() {
                //登出成功处理
                deferred.resolve();
            }, function(obj) {
                //登出失败处理
                deferred.reject(obj);
            });
            return deferred.promise;
        },
        sendMsg: function(reciverid, msgid, type, file, text) {
            var deferred = $q.defer();
            //新建消息体对象
            var obj = new RL_YTX.MsgBuilder();
            //设置自定义消息id
            obj.setId(msgid);
            //假设页面存在一个id为file的<input type=”file”>元素 
            //获取图片或附件对象
            // var file = document.getElementById("file").files[0];
            //设置图片或附件对象
            obj.setFile(file);
            //设置发送的文本内容
            obj.setText(text);
            //设置发送的消息类型1文本消息4 图片消息6 附件消息
            //发送非文本消息时，text字段将被忽略，发送文本消息时 file字段将被忽略
            obj.setType(type);
            //设置接收者
            obj.setReceiver(reciverid);
            RL_YTX.sendMsg(obj, function(obj) {
                deferred.resolve(obj);
                //发送消息成功
                //处理用户逻辑，通知页面
            }, function(obj) { //失败
                deferred.reject(obj);
                //发送消息失败
                //处理用户逻辑，通知页面刷新，展现重发按钮
            }, function(sended, total) {
                deferred.reject(sended, total);
                //发送图片或附件时的进度条
                //如果发送文本消息，可以不传该参数
            });
            return deferred.promise;
        },
        getMsg: function(obj) {
            //获取发送者为 
            var sender = obj.msgSender;
            //获取发送者昵称，如果不存在，使用账号代替
            var you_senderNickName = obj.senderNickName;
            var name = obj.msgSender;
            if (!!you_senderNickName) {
                name = you_senderNickName;
            }
            var content_type = null;
            //获取消息版本号
            var version = obj.version;
            //获取消息发送时间
            var time = obj.msgDateCreated;
            //获取消息类型 
            //1:文本消息 2:语音消息4:图片消息6:文件
            var msgType = obj.msgType;
            if (1 == msgType || 0 == msgType) {
                //文本消息，获取消息内容
                var you_msgContent = obj.msgContent;
                return ({ type: "texst", value: you_msgContent });
            } else if (2 == msgType) {
                //语音消息，获取语音文件url
                var url = obj.msgFileUrl;
                return ({ type: "voidce", "value": url });
            } else if (3 == msgType) {
                //3：视频消息，获取视频url
                //语音消息，获取语音文件url
                var url = obj.msgFileUrl;
                return ({ type: "video", "value": url });

            } else if (4 == msgType) {
                //图片消息 获取图片url
                var url = obj.msgFileUrl;
                return ({ type: "pic", "value": url });
            } else {
                //后续还会支持(地理位置，视频，以及自定义消息等)

            }

        },
        createGroup: function(gName) {
            var deferred = $q.defer();
            //新建创建群组对象
            var obj = new RL_YTX.CreateGroupBuilder();
            //设置群组名称
            obj.setGroupName(gName);
            //设置群组公告
            obj.setDeclared('欢迎加入' + gName);
            // 设置群组类型，如：1临时群组（100人）
            obj.setScope(1);
            // 设置群组验证权限，如：需要身份验证2
            obj.setPermission(2);
            //设置为讨论组 该字段默认为2 表示群组，创建讨论组时设置为1
            obj.setTarget(1);
            //发送消息
            RL_YTX.createGroup(obj, function(obj) {
                deferred.resolve(obj);
                //获取新建群组id
                //var groupId = obj.data;
                //更新页面

            }, function(obj) {
                //创建群组失败
                deferred.reject(obj);
            });
            return deferred.promise;
        },
        /**
         * [getTalkGroups description]获取讨论组
         * @return {[type]} [description]
         */
        getTalkGroups: function() {
            var GetGroupListBuilder = new RL_YTX.GetGroupListBuilder();
            GetGroupListBuilder.setTarget(125);
            var deferred = $q.defer();
            RL_YTX.getGroupList(GetGroupListBuilder, function(obj) {
                deferred.resolve(obj);
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        },
        joinGroup: function(groupid, declared) {
            var deferred = $q.defer();
            var builder = new RL_YTX.JoinGroupBuilder();
            //设置申请群组id
            builder.setGroupId(groupid);
            //设置申请理由
            builder.setDeclared(declared);
            //发送请求
            RL_YTX.joinGroup(builder, function() {
                //操作成功
                deferred.resolve();
            }, function(obj) {
                //操作失败
                deferred.reject(obj);
            });
            return deferred.promise;
        },
        confirmJoinGroup: function(gropupid, IMUserid, agreeeorrefuse) {
            var deferred = $q.defer();
            //新建同意加入请求对象
            var obj = new RL_YTX.ConfirmJoinGroupBuilder();
            //设置群组id
            obj.setGroupId(gropupid);
            //设置申请者账号
            obj.setMemberId(IMUserid);
            //设置同意或拒绝 1拒绝 2同意
            obj.setConfirm(agreeeorrefuse);
            //发送请求
            RL_YTX.confirmJoinGroup(obj, function() {
                //处理成功
                deferred.resolve();
            }, function(obj) {
                //处理失败
                deferred.reject(obj);
            });
            return deferred.promise;
        },
        inviteGroup: function(groupid, IMUserid) {
            var builder = new RL_YTX.InviteJoinGroupBuilder();
            builder.setGroupId(groupid);
            builder.setMembers([IMUserid]);
            //是否需要对方确认（1不需要直接加入，2需要）
            var confirm = 1;
            builder.setConfirm(confirm);
            //发送邀请
            RL_YTX.inviteJoinGroup(builder, function() {
                //邀请成功
                if (confirm == 1) {
                    //更新页面群组成员列表
                }
                //等待被邀请者同意
            }, function(obj) {
                //邀请成员失败
            });

        },
        deleteGroupMember: function(groupid, IMUserid) {
            var deferred = $q.defer();
            var DeleteGroupMemberBuilder = new RL_YTX.DeleteGroupMemberBuilder();
            DeleteGroupMemberBuilder.setGroupId(groupid);
            DeleteGroupMemberBuilder.setMemberId(IMUserid);
            RL_YTX.deleteGroupMember(DeleteGroupMemberBuilder, function(data) {
                deferred.resolve(data);
            }, function(obj) {
                deferred.reject();
            });
            return deferred.promise;
        },
        //解散群组
        dismissGroup: function(groupId) {
            var dismissGroupBuilder = new RL_YTX.DismissGroupBuilder();
            var defer = $q.defer();
            dismissGroupBuilder.setGroupId(groupId);
            RL_YTX.dismissGroup(dismissGroupBuilder, function(obj) {
                defer.resolve(obj);
            }, function(obj) {
                defer.reject(obj);
            });
            return defer.promise;
        },
        //退出群组
        quitGroup: function(groupId) {
            var defer = $q.defer();
            var QuitGroupBuilder = new RL_YTX.QuitGroupBuilder();
            QuitGroupBuilder.setGroupId(groupId);
            RL_YTX.quitGroup(QuitGroupBuilder, function() {
                defer.resolve();
            }, function() {
                defer.reject();
            });
            return defer.promise;
        }
    };
}]);
