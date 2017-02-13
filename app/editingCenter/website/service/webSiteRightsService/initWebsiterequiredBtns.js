"use strict";
/*
    created by cc 2015-12-24
    网站下编辑页面底部按钮权限
 */
angular.module('initWebsiteNewsModule', []).
factory('initWebsiteNewsService', [function() {
    return {
        initWebSitedBtns: function() {
            var compileArrays = [{
                "RIGHTINDEX": 105,
                "OPERDESC": "送审",
                "OPERFUN": "webCompileSend"
            }, {
                "RIGHTINDEX": 106.1,
                "OPERDESC": "直接签发",
                "OPERFUN": "webCompileSignDirect"
            }, {
                "RIGHTINDEX": 106.2,
                "OPERDESC": "定时签发",
                "OPERFUN": "webCompileSignTiming"
            }, {
                "RIGHTINDEX": 104,
                "OPERDESC": "预览",
                "OPERFUN": "preview"
            }];
            var pendingArrays = [{
                "RIGHTINDEX": 123,
                "OPERDESC": "撤稿",
                "OPERFUN": "webPendingKill"
            }, {
                "RIGHTINDEX": 122.1,
                "OPERDESC": "直接签发",
                "OPERFUN": "webPendingSignDirect"
            }, {
                "RIGHTINDEX": 122.2,
                "OPERDESC": "定时签发",
                "OPERFUN": "webPendingSignTiming"
            },{
                "RIGHTINDEX": 121,
                "OPERDESC": "预览",
                "OPERFUN": "preview"
            }];
            var signArrays = [{
                "RIGHTINDEX": 132,
                "OPERDESC": "预览",
                "OPERFUN": "preview"
            }];
            var arrayWebsiteBtns = [compileArrays, pendingArrays, signArrays];
            return arrayWebsiteBtns;
        }
    };
}]);
