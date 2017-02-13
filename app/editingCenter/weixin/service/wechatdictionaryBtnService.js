/*
    微信编译页面权限字典
*/
'use strict';
angular.module("wechatBtnServiceModule", []).
factory("wechatBtnService", ["trsHttpService", function(trsHttpService) {
    return {
        //微信待编平台权限
        initWechatCompBtn: function() {
            var btnRights = {
                240: {
                    "OPERDESC": "新建",
                    "OPERNAME": "wechat.daibian.xinjian"
                },
                241: {
                    "OPERDESC": "编辑",
                    "OPERNAME": "wechat.daibian.bianji"
                },
                242: {
                    "OPERDESC": "送审",
                    "OPERNAME": "wechat.daibian.songshen"
                },
                243: {
                    "OPERDESC": "签发",
                    "OPERFUN": "wechat.daibian.qianfa"
                },
                244: {
                    "OPERDESC": "发稿单",
                    "OPERNAME": "wechat.daibian.fagaodan"
                },
                251: {
                    "OPERDESC": "废稿",
                    "OPERFUN": "wechat.daibian.feigao"
                },
                252: {
                    "OPERDESC": "外发",
                    "OPERNAME": "wechat.daibian.waifa"
                },
                253: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "wechat.daibian.shoucang"
                }
            };
            return btnRights;
        },
        //微信待审平台权限
        initWechatPenBtn: function() {
            var btnRights = {
                256: {
                    "OPERDESC": "编辑",
                    "OPERNAME": "wechat.daishen.bianji"
                },
                257: {
                    "OPERDESC": "签发",
                    "OPERNAME": "wechat.daishen.qianfa"
                },
                258: {
                    "OPERDESC": "撤稿",
                    "OPERNAME": "wechat.daishen.tuigao"
                },
                259: {
                    "OPERDESC": "发稿单",
                    "OPERNAME": "wechat.daishen.fagaodan"
                },
                260: {
                    "OPERDESC": "外发",
                    "OPERNAME": "wechat.daishen.waifa"
                },
                261: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "wechat.daishen.shoucang"
                }
            };
            return btnRights;
        },
        //微信已签发平台权限
        initWechatSignBtn: function() {
            var btnRights = {
                262:{
                    "OPERDESC":"编辑",
                    "OPERNAME":"wechat.yiqianfa.bianji"
                },
                263: {
                    "OPERDESC": "取消签发",
                    "OPERNAME": "wechat.yiqianfa.chegao"
                },
                264: {
                    "OPERDESC": "外发",
                    "OPERNAME": "wechat.yiqianfa.waifa"
                },
                265: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "wechat.yiqianfa.shoucang"
                }
            };
            return btnRights;
        }
    };
}]);
