'use strict';
/**
 *  Module  柱形图数据服务
 *
 * Description
 */
angular.module('planHotHeadBarEchartsModule', []).factory('barEcharts', function() {
    return {
        /*
         *@params 数据对象
         *@success return 回调
         */
        barEcharts: function(params, success, id) {
            var initTopNewspaperName = [];
            var initTopNewspaperNumber = [];
            var initTopNewspaperGuid = [];
            var initTopNewspaperData = [];
            var initTopNewspaperSids = [];
            for (var key in params) {
                initTopNewspaperName.push(params[key].SHORTTITLE.substr(0,15));
                initTopNewspaperNumber.push(params[key].TOTALNUMBER);
                initTopNewspaperGuid.push(params[key].GUIDS);
                initTopNewspaperSids.push(params[key].HKEY);
            }
            initTopNewspaperData = {
                name: initTopNewspaperName,
                data: initTopNewspaperNumber,
                guids: initTopNewspaperGuid,
                sids: initTopNewspaperSids,
            };
            return success(initTopNewspaperData);
        }
    };
});
