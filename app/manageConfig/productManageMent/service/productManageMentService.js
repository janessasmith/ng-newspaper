"use strict";
/**
 * author  baizhiming  2016/6/21
 */
angular.module('productManageMentServiceModule', [])
    .factory("productManageMentService", [function() {
        return {
            //网站左边树选中站点
            leftTreeChooseSite: function(treedata, cursiteId) {
                var index = 0;
                for (var i = 0; i < treedata.length; i++) {
                    if (treedata[i].SITEID === cursiteId) {
                        index = i;
                        break;
                    }
                }
                return index;
            }
        };
    }]);
