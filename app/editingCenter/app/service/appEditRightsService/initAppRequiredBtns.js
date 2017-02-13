"use strict";
/*
    created by cc 2016-07-20
    APP渠道下编辑页面底部按钮权限
 */
angular.module('initAppRequiredBtnModule', []).
factory('initAppRequiredBtnService', [function() {
    return {
        initAppRequiredBtns: function() {
            var compileArrays = [{
                "RIGHTINDEX": 52,
                "OPERDESC": "送审",
                "OPERFUN": "appTrial"
            }, {
                "RIGHTINDEX": 53.1,
                "OPERDESC": "直接签发",
                "OPERFUN": "appSignDirect"
            }, {
                "RIGHTINDEX": 53.2,
                "OPERDESC": "定时签发",
                "OPERFUN": "appSignTiming"
            }, {
                "RIGHTINDEX": 57,
                "OPERDESC": "预览",
                "OPERFUN": "appPreview"
            }];
            var pendingArrays = [{
                "RIGHTINDEX": 83,
                "OPERDESC": "撤稿",
                "OPERFUN": "appRevoke"
            }, {
                "RIGHTINDEX": 60.1,
                "OPERDESC": "直接签发",
                "OPERFUN": "appSignDirect"
            }, {
                "RIGHTINDEX": 60.2,
                "OPERDESC": "定时签发",
                "OPERFUN": "appSignTiming"
            }, {
                "RIGHTINDEX": 88,
                "OPERDESC": "预览",
                "OPERFUN": "appPreview"
            }];
            var signArrays = [{
                "RIGHTINDEX": 95,
                "OPERDESC": "预览",
                "OPERFUN": "appPreview"
            }];
            var arrayWebsiteBtns = [compileArrays, pendingArrays, signArrays];
            return arrayWebsiteBtns;
        }
    };
}]);
