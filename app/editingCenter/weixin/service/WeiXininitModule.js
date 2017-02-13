"use strict";
angular.module('WeiXininitModule', []).
factory('WeiXininitService',['$q', 'trsHttpService', function($q, trsHttpService) {
    return {
        initDocGenre: function() {
            var DocGenre = [{
                "name": "无体裁",
                "value": "无体裁"
            }, {
                "name": "一版头条消息",
                "value": "一版头条消息"
            }, {
                "name": "其它版头条消息",
                "value": "其它版头条消息"
            }, {
                "name": "其它消息",
                "value": "其它消息"
            }, {
                "name": "调查类报道",
                "value": "调查类报道"
            }, {
                "name": "来信",
                "value": "来信"
            }, {
                "name": "重要评论文章",
                "value": "重要评论文章"
            }, {
                "name": "社论、特约评论员",
                "value": "社论、特约评论员"
            }, {
                "name": "通讯",
                "value": "通讯"
            }, {
                "name": "简讯",
                "value": "简讯"
            }, {
                "name": "本报评论员、署名评论",
                "value": "本报评论员、署名评论"
            }, {
                "name": "摄影作品",
                "value": "摄影作品"
            }, {
                "name": "短评（含编辑按、编后、小言论等）",
                "value": "短评（含编辑按、编后、小言论等）"
            }, {
                "name": "内参",
                "value": "内参"
            }, {
                "name": "新华社",
                "value": "新华社"
            }, {
                "name": "文摘",
                "value": "文摘"
            }];
            return DocGenre;
        },
        queryCurrChannel: function(channelid) {
            var params = {
                serviceid: "mlf_mediasite",
                methodname: "getChannelPath",
                ChannelId: channelid
            };
            var deffered=$q.defer(); 
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                deffered.resolve(data);
            });
            return deffered.promise;
        }
    };
}]);
