/*Create by CC 2015-02-18
    报纸编辑页面底部按钮权限
*/
"use strict";
angular.module('newsEditBtnModule', []).
factory('newsEditBtnService', function() {
    return {
        initDraftArrays: function() {
            //待用稿编辑页底部按钮
            var standDraftArray = [{
                "RIGHTINDEX": 153,
                "OPERDESC": "上版",
                "OPERFUN": "newsDraftShangBan",
            }, 
            // {
            //     "RIGHTINDEX": 152,
            //     "OPERDESC": "退稿",
            //     "OPERFUN": "newsDraftTuiGao",
            // }, 
            {
                "RIGHTINDEX": 155,
                "OPERDESC": "转版",
                "OPERFUN": "newsDraftZhuanBan",
            }];
            //今日稿编辑页底部按钮
            var todayDraftArray = [{
                "RIGHTINDEX": 163,
                "OPERDESC": "上版",
                "OPERFUN": "newsDraftShangBan",
            }, 
            // {
            //     "RIGHTINDEX": 161,
            //     "OPERDESC": "退稿",
            //     "OPERFUN": "newsDraftTuiGao",
            // }, 
            {
                "RIGHTINDEX": 165,
                "OPERDESC": "待用",
                "OPERFUN": "newsDraftDaiYong",
            }, {
                "RIGHTINDEX": 166,
                "OPERDESC": "转版",
                "OPERFUN": "newsDraftZhuanBan",
            }];
            //上版稿编辑页底部按钮
            var pageDraftArray = [{
                "RIGHTINDEX": 175,
                "OPERDESC": "签发照排",
                "OPERFUN": "newsDraftZhaoPai",
            }, {
                "RIGHTINDEX": 174,
                "OPERDESC": "撤稿",
                "OPERFUN": "newsDraftCheGao",
            }];
            var arrayBtn = [standDraftArray, todayDraftArray, pageDraftArray];
            return arrayBtn;
        }
    };
});
