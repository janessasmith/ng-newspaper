/*Create by CC 2015-12-25
    iwo编辑页面底部按钮权限
*/
"use strict";
angular.module('iWoinitBtnModule', []).
factory('iWoinitBtnService', function() {
    return {
        initBtnArrays: function() {
            var personBtnArray = [{
                "RIGHTINDEX": 4,
                "OPERDESC": "传稿",
                "OPERFUN": "iWoTransfer",
            }, {
                "RIGHTINDEX": 3,
                "OPERDESC": "提交",
                "OPERFUN": "iWoSubmit",
            }, {
                "RIGHTINDEX": 5,
                "OPERDESC": "共享",
                "OPERFUN": "iWoshare",
            }];
            var receivedBtnArray = [{
                "RIGHTINDEX": 12,
                "OPERDESC": "传稿",
                "OPERFUN": "iWoTransfer",
            }, {
                "RIGHTINDEX": 11,
                "OPERDESC": "提交",
                "OPERFUN": "iWoSubmit",
            }, {
                "RIGHTINDEX": 13,
                "OPERDESC": "共享",
                "OPERFUN": "iWoshare",
            }];
            var arrayBtn = [personBtnArray, receivedBtnArray];
            return arrayBtn;
        }
    };
});
