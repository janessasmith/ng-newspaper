"use strict";
angular.module('initiWoDataModule', []).
factory('initiWoDataService', [function() {
    return {
        initNews: function() {
            var list = {
                "METADATAID": 0,
                "TITLE": "",
                "SUBTITLE": "",
                "LEADTITLE": "",
                "CONTENT": "",
                "NEWSSOURCES": "",
                "SIGNATUREAUTHOR": "",
                "KEYWORDS": "",
                "ABSTRACT": "",
                "DOCGENRE": "",
                "HTMLCONTENT": "",
                "DOCWORDSCOUNT": 0,
                "ISNOPAYMENT": "1",
                "REMARKS": "",
                "FGD_EDITINFO": [],
                "FGD_AUTHINFO": [{ "isCreate": true }],
                "ORIGINAL": "0",
                "MEDIATYPES": "0",
                "AUDIOVIDEO": "",
                "AUDIOVIDEOURL": "",
                "ATTACHFILE": [],
            };
            return list;
        },
        initAtlas: function() {
            var list = {
                "SERVICEID": "mlf_myrelease",
                "METADATAID": 0,
                "TITLE": "",
                "SUBTITLE": "",
                "LEADTITLE": "",
                "NEWSSOURCES": "",
                "SIGNATUREAUTHOR": "",
                "CONTRIBUTORS": "",
                "KEYWORDS": "",
                "CONABSTRACT": "",
                "DOCGENRE": "",
                "ISNOPAYMENT": "1",
                "DOC_PICTURELIST": [],
                "SOURCEMETAID": "",
                "FLOWVERSIONTIME": "",
                "REMARKS": "",
                "DOCWORDSCOUNT": 0,
                "FGD_EDITINFO": [],
                "FGD_AUTHINFO": [{ "isCreate": true }],
                "ORIGINAL": "0",
                "HTMLCONTENT": "",
                "CONTENT": "",
                "MEDIATYPES": "0"
            };
            return list;
        }
    };
}]);
