/*
    Create by CC 2016-07-20
    APP编辑页面权限字典
*/
'use strict';
angular.module("appDictionaryBtnServiceModule", []).
factory("appDictionaryBtnService", ["trsHttpService", function(trsHttpService) {
    return {
        //app待编平台权限
        initAppCompBtn: function() {
            var btnRights = {
                51: {
                    "OPERDESC": "新建",
                    "OPERNAME": "appCreate"
                },
                239: {
                    "OPERDESC": "编辑",
                    "OPERNAME": "appEdit"
                },
                52: {
                    "OPERDESC": "送审",
                    "OPERNAME": "appTrial"
                },
                53: [{
                    "RIGHTINDEX": "53.1",
                    "OPERDESC": "直接签发",
                    "OPERNAME": "appSignDirect"
                }, {
                    "RIGHTINDEX": "53.2",
                    "OPERDESC": "定时签发",
                    "OPERNAME": "appSignTiming"
                }],
                54: {
                    "OPERDESC": "发稿单",
                    "OPERFUN": "appFgd"
                },
                55: {
                    "OPERDESC": "移动",
                    "OPERNAME": "appMove"
                },
                56: {
                    "OPERDESC": "废稿",
                    "OPERFUN": "appDraft"
                },
                57: {
                    "OPERDESC": "预览",
                    "OPERNAME": "appPreview"
                },
                58: {
                    "OPERDESC": "外发",
                    "OPERNAME": "appWaifa"
                },
                59: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "appCollect"
                },
            };
            return btnRights;
        },
        //app待审平台权限
        initAppPendBtn: function() {
            var btnRights = {
                301: {
                    "OPERDESC": "编辑",
                    "OPERNAME": "appEdit"
                },
                60: [{
                    "RIGHTINDEX": "60.1",
                    "OPERDESC": "直接签发",
                    "OPERNAME": "appSignDirect"
                }, {
                    "RIGHTINDEX": "60.2",
                    "OPERDESC": "定时签发",
                    "OPERNAME": "appSignTiming"
                }],
                83: {
                    "OPERDESC": "撤稿",
                    "OPERNAME": "appRevoke"
                },
                84: {
                    "OPERDESC": "移动",
                    "OPERNAME": "appMove"
                },
                85: {
                    "OPERDESC": "发稿单",
                    "OPERNAME": "appFgd"
                },
                86: {
                    "OPERDESC": "外发",
                    "OPERNAME": "appWaifa"
                },
                87: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "appCollect"
                },
                88: {
                    "OPERDESC": "预览",
                    "OPERNAME": "appPreview"
                }
            };
            return btnRights;
        },
        //app已签发平台权限
        initAppSignBtn: function() {
            var btnRights = {
                302: {
                    "OPERDESC": "编辑",
                    "OPERNAME": "appEdit"
                },
                89: {
                    "OPERDESC": "取消签发",
                    "OPERNAME": "appQuxiaoqianfa"
                },
                90: {
                    "OPERDESC": "外发",
                    "OPERNAME": "appWaifa"
                },
                91: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "appCollect"
                },
                92: {
                    "OPERDESC": "稿件排序",
                    "OPERNAME": "appDraftSort"
                },
                93: {
                    "OPERDESC": "隐藏",
                    "OPERNAME": "appHidden"
                },
                94: {
                    "OPERDESC": "固定位置",
                    "OPERNAME": "appFixedPos"
                },
                95: {
                    "OPERDESC": "预览",
                    "OPERNAME": "appPreview"
                },
            };
            return btnRights;
        }
    };
}]);
