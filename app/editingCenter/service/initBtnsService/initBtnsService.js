"use strict";
angular.module('editctrInitBtnModule', []).factory('initeditctrBtnsService', ['trsHttpService', '$q', function(trsHttpService, $q) {
    return {
        initData: function(metaDataId, ChnlDocId) {
            var params = {
                "serviceid": "mlf_metadataright",
                "methodname": "findDocStatusByMetadataId",
                "MetaDataId": metaDataId,
                "ChnlDocId": ChnlDocId
            };
            return trsHttpService.httpServer("/wcm/mlfcenter.do", params,
                "post");
        },
        initIwoData: function(ModalName) {
            var params = {
                "serviceid": "mlf_metadataright",
                "methodname": "findMyOperRightByModal",
                "ModalName": ModalName
            };
            return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params,
                "post");
        },
        initNewsData: function(ModalName, siteid) {
            var params = {
                'serviceid': "mlf_metadataright",
                'methodname': "queryPaperOperRightOfModal",
                "ModalName": ModalName,
                "SiteId": siteid
            };
            return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post");
        },
        initWebsiteData: function(ChannelId, StatusType) {
            var params = {
                'serviceid': "mlf_metadataright",
                "methodname": "queryOperRightByDocStatus",
                "ChannelId": ChannelId,
                "StatusType": StatusType
            };
            return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params,
                "post");
        },
        initAppData: function(ChannelId, Classify) {
            var params = {
                'serviceid': "mlf_metadataright",
                'methodname': "queryOperKeyByBaseChannel",
                'Classify': Classify,
                'ChannelId': ChannelId
            };
            return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params,
                "post");
        },
        /**
         * [initWechatData description]初始化微信权限
         * @param  {[num]} channelid [description]栏目id
         * @param  {[num]} classify  [description]平台类型
         * @return {[obj]}           [description]返回权限
         */
        initWechatData: function(channelid, classify) {
            var params = {
                'serviceid': "mlf_metadataright",
                'methodname': "queryOperKeyByBaseChannel",
                'Classify': classify,
                'ChannelId': channelid
            };
            return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params,
                "post");
        },
        initBtns: function(_arrary, btns) {
            var tempBtn;
            var btnStatus = [];
            var rightStatus = btns;
            if (angular.isArray(_arrary)) {
                angular.forEach(_arrary, function(value, key) {
                    tempBtn = value;
                    if (angular.isArray(rightStatus[value.RIGHTINDEX])) {
                        angular.forEach(rightStatus[value.RIGHTINDEX], function(_value, _key) {
                            var tpBtn = _value;
                            tpBtn.RIGHTINDEX = _value.RIGHTINDEX;
                            tpBtn.OPERDESC = _value.OPERDESC;
                            tpBtn.OPERFUN = _value.OPERFUN;
                            btnStatus.push(tpBtn);
                        });
                    } else {
                        tempBtn.OPERDESC = rightStatus[value.RIGHTINDEX].OPERDESC;
                        tempBtn.OPERFUN = rightStatus[value.RIGHTINDEX].OPERFUN;
                        btnStatus.push(tempBtn);
                    }
                });
                return btnStatus;
            }
        }
    };

    function initRightStatus() {
        var rightStatus = {
            1: {
                "OPERDESC": "保存",
                "OPERFUN": "save"
            },
            2: {
                "OPERDESC": "编辑",
                "OPERFUN": ""
            },
            3: {
                "OPERDESC": "提交",
                "OPERFUN": "personalSubmit",
            },
            4: {
                "OPERDESC": "传稿",
                "OPERFUN": "personalTransfer",
            },
            5: {
                "OPERDESC": "共享",
                "OPERFUN": "personalShare",
            },
            6: {
                "OPERDESC": "取刚传稿",
                "OPERFUN": "personalGetrecenttransfereddoc",
            },
            7: {
                "OPERDESC": "发稿单",
                "OPERFUN": "personalFagaodan",
            },
            8: {
                "OPERDESC": "废稿",
                "OPERFUN": "personalWastedraft",
            },
            9: {
                "OPERDESC": "复制建新稿",
                "OPERFUN": "personalCopybuilddraft",
            },
            44: {
                "OPERDESC": "保存",
                "OPERFUN": "save"
            },
            10: {
                "OPERDESC": "外发",
                "OPERFUN": "personalOutgoing",
            },
            11: {
                "OPERDESC": "提交",
                "OPERFUN": "receivedSubmit",
            },
            12: {
                "OPERDESC": "传稿",
                "OPERFUN": "receivedTransfer",
            },
            13: {
                "OPERDESC": "共享",
                "OPERFUN": "receivedShare",
            },
            14: {
                "OPERDESC": "取刚传稿",
                "OPERFUN": "receivedGetrecenttransfereddoc"
            },
            15: {
                "OPERDESC": "废稿",
                "OPERFUN": "receivedRejection"
            },
            16: {
                "OPERDESC": "发稿单",
                "OPERFUN": "receivedFagaodan"
            },
            17: {
                "OPERDESC": "废稿",
                "OPERFUN": "release.my.received.wastedraft"
            },
            18: {
                "OPERDESC": "外发",
                "OPERFUN": "receivedOutgoing"
            },
            43: {
                "OPERDESC": "编辑",
                "OPERFUN": ""
            },
            53: {
                "OPERDESC": "保存",
                "OPERFUN": "save"
            },
            54: {
                "OPERDESC": "保存送审",
                "OPERFUN": "saveSend"
            },
            55: [{
                "RIGHTINDEX": 55.1,
                "OPERDESC": "直接签发",
                "OPERFUN": "compileSignDirect"
            }, {
                "RIGHTINDEX": 55.2,
                "OPERDESC": "定时签发",
                "OPERFUN": "compileSignTiming"
            }],
            70: {
                "OPERDESC": "保存",
                "OPERFUN": "save"
            },
            69: [{
                "RIGHTINDEX": 69.1,
                "OPERDESC": "直接签发",
                "OPERFUN": "pendingSignDirect"
            }, {
                "RIGHTINDEX": 69.2,
                "OPERDESC": "定时签发",
                "OPERFUN": "pendingSignTiming"
            }],
            77: {
                "OPERDESC": "退稿",
                "OPERFUN": "rejection"
            },
            94: {
                "OPERDESC": "保存并发布",
                "OPERFUN": "savePub"
            },
        };
        return rightStatus;
    }


}]);
