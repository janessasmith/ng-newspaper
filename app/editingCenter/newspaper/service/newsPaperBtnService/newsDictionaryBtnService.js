/*
    Create by CC 2015-2-17
    获得报纸下各类报纸的操作按钮权限字典
*/
'use strict';
angular.module("newsDictionBtnServiceModule", []).
factory("newsDictionBtnService", ["trsHttpService", function(trsHttpService) {
    return {
        //待用稿按钮权限
        initStandDraftBtn: function() {
            var btnRights = {
                151: {
                    "OPERDESC": "查看",
                    "OPERNAME": "newsStandDraftChaKan"
                },
                152: {
                    "OPERDESC": "编辑",
                    "OPERNAME": "newsStandDraftBianJi"
                },

                153: {
                    "OPERDESC": "上版",
                    "OPERFUN": "newsDraftShangBan"
                },
                154: {
                    "OPERDESC": "退稿",
                    "OPERFUN": "newsDraftTuiGao"
                },
                155: {
                    "OPERDESC": "转版",
                    "OPERNAME": "newsDraftZhuanBan"
                },
                156: {
                    "OPERDESC": "发稿单",
                    "OPERNAME": "newsStandDraftFaGaoDan"
                },
                157: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "newsStandDraftShouCang"
                },
                158: {
                    "OPERDESC": "邮件外发",
                    "OPERNAME": "newsStandDraftWaiFa"
                },
                159: {
                    "OPERDESC": "导出",
                    "OPERNAME": "newsStandDraftDaoChu"
                },
                160: {
                    "OPERDESC": "打印",
                    "OPERNAME": "newsStandDraftDaYin"
                },
                184: {
                    "OPERDESC": "归档",
                    "OPERNAME": "newsPaperGuiDang"
                },
            };
            return btnRights;
        },
        //今日稿按钮权限
        initTodayDraftBtn: function() {
            var btnRights = {
                186: {
                    "OPERDESC": "归档",
                    "OPERNAME": "newsPaperGuiDang"
                },
                161: {
                    "OPERDESC": "查看",
                    "OPERNAME": "newsTodayDraftChaKan"
                },
                162: {
                    "OPERDESC": "编辑",
                    "OPERNAME": "newsTodayDraftBianJi"
                },
                163: {
                    "OPERDESC": "上版",
                    "OPERFUN": "newsDraftShangBan"
                },
                164: {
                    "OPERDESC": "退稿",
                    "OPERFUN": "newsDraftTuiGao"
                },
                165: {
                    "OPERDESC": "待用",
                    "OPERNAME": "newsDraftDaiYong"
                },
                166: {
                    "OPERDESC": "转版",
                    "OPERNAME": "newsDraftZhuanBan"
                },
                167: {
                    "OPERDESC": "发稿单",
                    "OPERNAME": "newsTodayDraftFaGaoDan"
                },
                168: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "newsTodayDraftShouCang"
                },
                169: {
                    "OPERDESC": "邮件外发",
                    "OPERNAME": "newsTodayDraftWaiFa"
                },
                170: {
                    "OPERDESC": "导出",
                    "OPERNAME": "newsTodayDraftDaoChu"
                },
                171: {
                    "OPERDESC": "打印",
                    "OPERNAME": "newsTodayDraftDaYin"
                },
            };
            return btnRights;
        },
        //上版稿按钮权限
        initPageDraftBtn: function() {
            var btnRights = {
                172: {
                    "OPERDESC": "查看",
                    "OPERNAME": "newsPageDraftChaKan"
                },
                173: {
                    "OPERDESC": "编辑",
                    "OPERNAME": "newsPageDraftBianJi"
                },
                174: {
                    "OPERDESC": "撤稿",
                    "OPERFUN": "newsDraftCheGao"
                },
                175: {
                    "OPERDESC": "签发照排",
                    "OPERFUN": "newsDraftZhaoPai"
                },
                177: {
                    "OPERDESC": "发稿单",
                    "OPERNAME": "newsPageDraftFaGaoDan"
                },
                176: {
                    "OPERDESC": "归档",
                    "OPERNAME": "newsPaperGuiDang"
                },
                178: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "newsPageDraftShouCang"
                },
                179: {
                    "OPERDESC": "邮件外发",
                    "OPERNAME": "newsPageDraftWaiFa"
                },
                180: {
                    "OPERDESC": "导出",
                    "OPERNAME": "newsPageDraftDaoChu"
                },
                181: {
                    "OPERDESC": "打印",
                    "OPERNAME": "newsPageDraftDaYin"
                },
                196: {
                    "OPERDESC": "转版",
                    "OPERNAME": "newsDraftZhuanBan"
                },
                197: {
                    "OPERDESC": "退稿",
                    "OPERNAME": "newsDraftTuiGao"
                },
            };
            return btnRights;
        },
    };
}]);
