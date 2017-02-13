"use strict";
angular.module('editingCenterWeiBoServiceModule', ['editctrBindWeiboModule'])
    .factory("editingCenterWeiBoService", [function() {
        return {
            autoRouter: function() {
                return {
                    DAIBIAN: "tobecompiled",
                    DAISHEN: "pending",
                    YIQIANFA: "signed",
                    WODEWEIBO: "myweibo",
                    GUANZHUDEWEIBO: "attention",
                    SHOUDAODEPINGLUN: "comment",
                    FACHUDEPINGLUN: "comment",
                    SHOUCANG: "collect",
                    ATWODEWEIBO: "me",
                    ATWODEPINGLUN: 'me'
                };
            }
        };
    }]);
