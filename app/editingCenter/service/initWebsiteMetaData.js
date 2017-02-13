"use strict";
angular.module('initWebsiteDataModule', []).
factory('initWebsiteDataService', [function($stateParams) {
    return {
        initNews: function() {
            var list = {
                "SERVICEID": "mlf_website",
                "METHODNAME": "saveImgTextDoc",
                "METADATAID": 0,
                "TITLECOLOR": "",
                "TITLE": "",
                "RELEASESOURCE": "",
                "ORIGINALTITLE": "",
                "ORIGINALADDRESS": "",
                "TEMPLATESETTING": "",
                "HOMETITLE": "",
                "AUTHOR": "",
                "MOVETITLE": "",
                "KEYWORDS": "",
                "RELATEDNEWS": "",
                "DOC_PICTURELIST": [],
                "SUBJECTOFOWNERSHIP": "",
                "ATTRIBUTIONLABEL": "",
                "ABSTRACT": "",
                "CONTENT": "",
                "HTMLCONTENT": "",
                "DOCWORDSCOUNT": 0,
                "ADDITIONALTEXTTOP": "",
                "ADDITIONALTEXTBOTTOM": "",
                "ADDITIONALTEXTLEFT": "",
                "ADDITIONALTEXTRIGHT": "",
                "TEMPNAME": {
                    "name": "请选择模板",
                    "value": 0
                },
                "OUTLINEPICS": [{
                    "APPFILE": "",
                    "APPDESC": ""
                }],
                "AUDIOVIDEO": "",
                "ISSUETIME": "",
                "EDIT": "",
                "ISNOPAYMENT": "1",
                "DOCGENRE": "",
                "DOCSOURCENAME": "",
                "FGD_EDITINFO": [],
                "FGD_AUTHINFO": [{
                    "isCreate": true
                }], //用于判断发稿单是否是新建状态
                "STATE": "",
                "DOCSOURCE": "",
                "REMARKS": "",
                "MEDIATYPES": 2,
                "TEMPID": "0",
                "ORIGINAL": "0",
                "ATTACHFILE": [],
                "AdditionalTextTop": "",
                "AdditionalTextBottom": "",
                "AdditionalTextLeft": "",
                "AdditionalTextRight": "",
                "SUBTITLE": "",
                "LEADTITLE": "",
                "EDITORTRUENAME": "",
                "AUDIOVIDEOURL": "",
            };
            return list;
        },
        initAtlas: function() {
            var list = {
                "SERVICEID": "mlf_website",
                "METHODNAME": "saveAtlasDoc",
                "METADATAID": 0,
                "TITLECOLOR": "",
                "TITLE": "",
                "RELEASESOURCE": "",
                "SUBTITLE": "",
                "LEADTITLE": "",
                "NEWSSOURCES": "",
                "TEMPLATESETTING": "",
                "SIGNATUREAUTHOR": "",
                "CONTRIBUTORS": "",
                "KEYWORDS": "",
                "CONABSTRACT": "",
                "DOCGENRE": "",
                "ISNOPAYMENT": "1",
                "ISSUETIME": "",
                "DOC_PICTURELIST": [],
                "SOURCEMETAID": "",
                "MEDIATYPE": "2",
                "OUTLINEPICS": [{
                    "APPFILE": "",
                    "APPDESC": ""
                }],
                "FLOWVERSIONTIME": "",
                "DOCTYPE": "",
                "DOCWORDSCOUNT": 0,
                "FGD_EDITINFO": [],
                "FGD_AUTHINFO": [{
                    "isCreate": true
                }], //用于判断发稿单是否是新建状态
                "STATE": "",
                "DOCSOURCE": "",
                "REMARKS": "",
                "DOCSOURCENAME": "",
                "TEMPNAME": {
                    "name": "请选择模板",
                    "value": 0
                },
                "TEMPID": "0",
                "RELATEDNEWS": "",
                "ORIGINAL": "0",
                "ATTACHFILE": [],
                "CONTENT": "",
                "AdditionalTextTop": "",
                "AdditionalTextBottom": "",
                "AdditionalTextLeft": "",
                "AdditionalTextRight": "",
                "ATTRIBUTIONLABEL": "",
                "EDITOR": "",
                "HTMLCONTENT": "",
                "EDITORTRUENAME": ""
            };
            return list;
        },
        initLinkDoc: function() {
            var list = {
                "SERVICEID": "mlf_website",
                "METHODNAME": "saveLinkDoc",
                "METADATAID": 0,
                "CHANNELID": "",
                "TITLECOLOR": "",
                "TITLE": "",
                "DOCSOURCENAME": "",
                "DOC_PICTURELIST": [],
                "ORIGINALTITLE": "",
                "ORIGINALADDRESS": "",
                "HOMETITLE": "",
                "AUTHOR": "",
                "MOVETITLE": "",
                "ATTRIBUTIONLABEL": "",
                "ABSTRACT": "",
                "COMMENTSETTINGS": "",
                "ISSUETIME": "",
                "HITS": "",
                "DOCSOURCE": "",
                "REMARKS": "",
                "SRCURL": "",
                "ORIGINAL": "0",
                "CONTENT": "",
                "ATTACHFILE": [],
                "SUBTITLE": "",
                "LEADTITLE": "",
                "EDITOR": "",
                "OUTLINEPICS": [{
                    "APPFILE": "",
                    "APPDESC": ""
                }],
            };
            return list;
        },
        initSubject: function() {
            var list = {
                "SERVICEID": "mlf_website",
                "METHODNAME": "saveSpecialDoc",
                "METADATAID": 0,
                "CHANNELID": "",
                "TITLE": "",
                "SPECIALCONTENT": "",
                "AUTHOR": "",
                "OUTLINEPICS": [{
                    "APPFILE": "",
                    "APPDESC": ""
                }],
                "SPECIALFILE": [],
            };
            return list;
        }
    };
}]);
