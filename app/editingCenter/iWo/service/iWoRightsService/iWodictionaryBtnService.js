/*
    Create by CC 2015-1-20
    获得iwo个人稿库与已收稿库权限
*/
'use strict';
angular.module("iWoBtnServiceModule", []).
factory("iWoBtnService", ["trsHttpService", function(trsHttpService) {
    return {
        //iwo个人稿库权限
        initIwoPersonBtn: function() {
            var btnRights = {
                1: {
                    "OPERDESC": "新建",
                    "OPERFUN": "iWoPersonalCreate"
                },
                2: {
                    "OPERDESC": "编辑",
                    "OPERFUN": "iWoPersonalEdit"
                },
                3: {
                    "OPERDESC": "提交",
                    "OPERFUN": "personalSubmit"
                },
                4: {
                    "OPERDESC": "传稿",
                    "OPERNAME": "personalTransfer"
                },
                5: {
                    "OPERDESC": "共享",
                    "OPERNAME": "personalShare"
                },
                6: {
                    "OPERDESC": "取刚传稿",
                    "OPERNAME": "iWoPersonalQuGangChuangGao"
                },
                7: {
                    "OPERDESC": "发稿单",
                    "OPERNAME": "iWoPersonalFaGaoDan"
                },
                8: {
                    "OPERDESC": "打印",
                    "OPERNAME": "iWoPersonalDaYin"
                },
                9: {
                    "OPERDESC": "导出",
                    "OPERNAME": "iWoPersonalDaoChu"
                },
                10: {
                    "OPERDESC": "废稿",
                    "OPERNAME": "iWoPersonalFeiGao"
                },
                11: {
                    "OPERDESC": "复制建新稿",
                    "OPERNAME": "iWoPersonalFeizhiXinGao"
                },
                12: {
                    "OPERDESC": "外发",
                    "OPERNAME": "iWoPersonalWaiFa"
                },
                13: {
                    "OPERDESC": "合成图集",
                    "OPERNAME": "mergepic"
                },
                278:{
                    "OPERDESC":"导入",
                    "OPERNAME":"iWoImport"
                },
                421: {
                    "OPERDESC": "查看",
                    "OPERNAME": "iWoPersonalChaKan"
                }
            };
            return btnRights;
        },
        //iwo已收稿库权限
        initIwoReceiveBtn: function() {
            var btnRights = {
                14: {
                    "OPERDESC": "编辑",
                    "OPERFUN": "iWoReceiveEdit"
                },
                15: {
                    "OPERDESC": "提交",
                    "OPERFUN": "personalSubmit"
                },
                16: {
                    "OPERDESC": "传稿",
                    "OPERFUN": "personalTransfer"
                },
                17: {
                    "OPERDESC": "共享",
                    "OPERFUN": "personalShare"
                },
                18: {
                    "OPERDESC": "取刚传稿",
                    "OPERFUN": "iWoReceiveQuGangChuanGao"
                },
                19: {
                    "OPERDESC": "退稿",
                    "OPERFUN": "iWoReceiveTuiGao"
                },
                20: {
                    "OPERDESC": "发稿单",
                    "OPERFUN": "iWoReceiveFaGaoDan"
                },
                21: {
                    "OPERDESC": "导出",
                    "OPERFUN": "iWoReceiveDaoChu"
                },
                22: {
                    "OPERDESC": "废稿",
                    "OPERFUN": "iWoReceiveFeiGao"
                },
                23: {
                    "OPERDESC": "外发",
                    "OPERFUN": "iWoReceiveWaiFa"
                },
                29: {
                    "OPERDESC": "合成图集",
                    "OPERNAME": "mergepic"
                },
                422: {
                    "OPERDESC": "查看",
                    "OPERFUN": "iWoReceiveChaKan"
                }
            };
            return btnRights;
        }
    };
}]);
