"use strict";
/**
 *  Module  报纸编辑模块  初始化数据
 *  CreateBy  Ly
 * Description
 */
angular.module('initDataNewspaperServiceModule', []).factory('initDataNewspaperService', function() {
    return {
        initNewspaperNews: function() {
            var list = {
                "JTITLE": "",
                "TITLE": "",
                "SUBTITLE": "",
                "IMGFILE": "",
                "CONTENT": "",
                "AUTHOR": "",
                "KEYWORDS": "",
                "CONABSTRACT": "",
                "REMARKS": "",
                "FGD_EDITINFO": [],
                "FGD_AUTHINFO": [{"isCreate":true}],
                "ISNOPAYMENT": "",
                "DOCSOURCE": "",
                "DOC_PICTURELIST":[],
            };
            return list;
        },
        initNewspaperAltas: function() {
            var list = {
                "JTITLE": "",
                "TITLE": "",
                "SUBTITLE": "",
                "IMGFILE": "",
                "CONTENT": "",
                "AUTHOR": "",
                "KEYWORDS": "",
                "CONABSTRACT": "",
                "REMARKS": "",
                "FGD_EDITINFO": [],
                "FGD_AUTHINFO": [{"isCreate":true}],
                "ISNOPAYMENT": "",
                "DOCSOURCE": "",
                "DOC_PICTURELIST": [],
            };
            return list;
        }

    };
});
