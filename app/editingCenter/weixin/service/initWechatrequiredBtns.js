"use strict";
/*
    微信下编辑页面底部按钮权限
 */
angular.module('initWechatNewsModule', []).
factory('initWechatNewsService', [function() {
    return {
        initWechatBtns: function() {
            var compileArrays = [{
                "RIGHTINDEX": 242,
                "OPERDESC": "送审",
                "OPERFUN": "weixinCompileSend"
            }, {
                "RIGHTINDEX": 243,
                "OPERDESC": "签发",
                "OPERFUN": "weixinCompileSignDirect"
            }];
            var pendingArrays = [{
                "RIGHTINDEX": 257,
                "OPERDESC": "签发",
                "OPERFUN": "weixinPendSignDirect"
            }, {
                "RIGHTINDEX": 258,
                "OPERDESC": "撤稿",
                "OPERFUN": "weixinPendRejectionDraft"
            }];
            var signArrays = [
            // {
            //     "RIGHTINDEX": 263,
            //     "OPERDESC": "取消签发",
            //     "OPERFUN": "weixinSignRevoke"
            // }
            ];
            var arrayWebsiteBtns = [compileArrays, pendingArrays, signArrays];
            return arrayWebsiteBtns;
        }
    };
}]);
