"use strict";
angular.module('initWeiXinDataModule', []).
factory('initWeiXinDataService', ["$stateParams", "WeiXininitService", function($stateParams, WeiXininitService) {
    return {
        initNews: function() {
            var list = {
                "METADATAID": 0,
                "CHANNELID": $stateParams.channelid,
                "TITLE": "",
                "ORIGINALTITLE": "",
                "ORIGINALADDRESS": "",
                "DOCSOURCENAME":"",
                "CHANNEL": "",
                "AUTHOR": "",
                "KEYWORDS": "",
                "ATTRIBUTIONLABEL": "",
                "ABSTRACT": "",
                "CONTENT": "",
                "HTMLCONTENT": "",
                "ATTACHFILE": [{
                    "APPFILE": "",
                    "APPDESC": ""
                }],
                "ISSHOWATCONTENT": 0,
                "ISSUETIME": "",
                "REPRINT": 0,
                "EDITOR": "",
                "EDITORTRUENAME": "",
                "HITS": "",
                "ISNOPAYMENT": 1,
                "DOCGENRE": angular.copy(WeiXininitService.initDocGenre()[0]),
                "DOCTYPE": "",
                "DOCWORDSCOUNT": "0",
                "REMARKS": "",
                "TEMPID": 0,
                "OWNER": "",
                "FGD_EDITINFO": [],
                "FGD_AUTHINFO": [{ "isCreate": true }],
            };
            return list;
        }
    };
}]);
