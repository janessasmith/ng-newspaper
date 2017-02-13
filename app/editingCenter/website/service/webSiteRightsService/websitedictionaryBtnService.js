/*
    Create by CC 2015-1-19
    网站编译页面权限字典
*/
'use strict';
angular.module("websiteBtnServiceModule", []).
factory("websiteBtnService", ["trsHttpService", function(trsHttpService) {
    return {
        //网站待编平台权限
        initWebCompBtn: function() {
            var btnRights = {
                44: {
                    "OPERDESC": "导出",
                    "OPERNAME": "webCompDaochu"
                },
                101: {
                    "OPERDESC": "查看",
                    "OPERNAME": "webCompChaKan"
                },
                102: {
                    "OPERDESC": "新建",
                    "OPERNAME": "webCompCreate"
                },
                103: {
                    "OPERDESC": "编辑",
                    "OPERFUN": "webCompileEdit"
                },
                104: {
                    "OPERDESC": "预览",
                    "OPERNAME": "preview"
                },
                105: {
                    "OPERDESC": "送审",
                    "OPERFUN": "webCompileSend"
                },
                106: [{
                    "RIGHTINDEX": "104.1",
                    "OPERDESC": "直接签发",
                    "OPERNAME": "webCompileSignDirect"
                }, {
                    "RIGHTINDEX": "104.2",
                    "OPERDESC": "定时签发",
                    "OPERNAME": "webCompileSignTiming"
                }],
                107: {
                    "OPERDESC": "共享",
                    "OPERNAME": "webCompileShare"
                },
                108: {
                    "OPERDESC": "移动",
                    "OPERNAME": "webCompileMove"
                },
                109: {
                    "OPERDESC": "复制",
                    "OPERNAME": "webCompileCopy"
                },
                110: {
                    "OPERDESC": "发稿单",
                    "OPERNAME": "webCompileFgd"
                },
                111: {
                    "OPERDESC": "废稿箱",
                    "OPERNAME": "webCompileRecycle"
                },
                112: {
                    "OPERDESC": "外发",
                    "OPERNAME": "webCompileOutgoing"
                },
                113: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "webCompileCollect"
                },
                149: {
                    "OPERDESC": "移动",
                    "OPERNAME": "webCompileMove"
                },
                277:{
                    "OPERDESC":"导入",
                    "OPERNAME":"webCompileImport"
                }
            };
            return btnRights;
        },
        //网站待审平台权限
        initWebPenBtn: function() {
            var btnRights = {
                45: {
                    "OPERDESC": "导出",
                    "OPERNAME": "webPendDaochu"
                },
                119: {
                    "OPERDESC": "查看",
                    "OPERNAME": "webPendingChaKan"
                },
                120: {
                    "OPERDESC": "编辑",
                    "OPERNAME": "webPendingEdit"
                },
                121: {
                    "OPERDESC": "预览",
                    "OPERNAME": "preview"
                },
                122: [{
                    "RIGHTINDEX": "122.1",
                    "OPERDESC": "直接签发",
                    "OPERNAME": "webPendingSignDirect"
                }, {
                    "RIGHTINDEX": "122.2",
                    "OPERDESC": "定时签发",
                    "OPERNAME": "webPendingSignTiming"
                }],
                123: {
                    "OPERDESC": "撤稿",
                    "OPERNAME": "webPendingKill"
                },
                124: {
                    "OPERDESC": "共享",
                    "OPERNAME": "webPendingShare"
                },
                125: {
                    "OPERDESC": "移动",
                    "OPERNAME": "webPendingMove"
                },
                126: {
                    "OPERDESC": "复制",
                    "OPERNAME": "webPengdingCopy"
                },
                127: {
                    "OPERDESC": "发稿单",
                    "OPERNAME": "webPendingFgd"
                },
                128: {
                    "OPERDESC": "外发",
                    "OPERNAME": "webPendingOutgoing"
                },
                129: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "webPendingCollect"
                },
                150: {
                    "OPERDESC": "移动",
                    "OPERNAME": "webPendingMove"
                }
            };
            return btnRights;
        },
        //网站已签发平台权限
        initSingBtn: function() {
            var btnRights = {
                42:{
                    "OPERDESC":"关注",
                    "OPERNAME":"webSignGuanzhu"
                },
                46: {
                    "OPERDESC": "导出",
                    "OPERNAME": "webSignDaochu"
                },
                130: {
                    "OPERDESC": "查看",
                    "OPERNAME": "webSingChaKan"
                },
                131: {
                    "OPERDESC": "编辑",
                    "OPERNAME": "webSingEdit"
                },
                132: {
                    "OPERDESC": "预览",
                    "OPERNAME": "preview"
                },
                133: {
                    "OPERDESC": "推首页",
                    "OPERNAME": "webSignPushIndex"
                },
                134: {
                    "OPERDESC": "撤稿",
                    "OPERNAME": "webSignWithdraw"
                },
                135: {
                    "OPERDESC": "隐藏",
                    "OPERNAME": "webSignHide",
                },
                136: {
                    "OPERDESC": "取消隐藏",
                    "OPERNAME": "webSignCancelHide"
                },
                137: {
                    "OPERDESC": "共享",
                    "OPERNAME": "webSignShare"
                },
                138: {
                    "OPERDESC": "移动",
                    "OPERNAME": "webSignMove"
                },
                139: {
                    "OPERDESC": "多签",
                    "OPERNAME": "webSignMultipleSign"
                },
                140: {
                    "OPERDESC": "复制",
                    "OPERNAME": "webSignCopy"
                },
                141: {
                    "OPERDESC": "外发",
                    "OPERNAME": "webSignOutgoing"
                },
                142: {
                    "OPERDESC": "收藏",
                    "OPERNAME": "webSignCollect"
                },
                143: {
                    "OPERDESC": "稿件排序",
                    "OPERNAME": "webSignDortDraft"
                },
                144: {
                    "OPERDESC": "固定位置",
                    "OPERNAME": "webSingPlacedTop"
                },
                145: {
                    "OPERDESC": "批量转移",
                    "OPERNAME": "webSignTransfer"
                },
                146: {
                    "OPERDESC": "批量生成",
                    "OPERNAME": "webSignMultipleCreate"
                },
                276:{
                    "OPERDESC":"置顶",
                    "OPERNAME":"webSignToTop"
                },
            };
            return btnRights;
        }
    };
}]);
