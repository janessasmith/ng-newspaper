'use strict';
/**
 *  Module 初始化 预览按钮模块
 *  CreateBY LY
 * Description  
 */
angular.module('initPreviewBtnsModule', [])
    .factory('initPreviewBtnsService', ['trsHttpService', '$q', function(trsHttpService, $q) {
        return {
            initData: function(metaDataId, ChnlDocId) {
                var params = {
                    "serviceid": "mlf_metadataright",
                    "methodname": "queryReleaseOperRight",
                    "MetaDataId": metaDataId,
                    "ChnlDocId": ChnlDocId
                };
                return trsHttpService.httpServer("/wcm/mlfcenter.do", params,
                    "post");
            },
            initBtns: function(_arrary) {
                var tempBtn;
                var btnStatus = [];
                var rightStatus = initRightStatus();
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
                            // console.log(btnStatus);
                        }
                    });

                    btnStatus = btnStatus.concat([{
                        RIGHTINDEX: "preview",
                        OPERDESC: "预览",
                        OPERNAME: "",
                        OPERFUN: ""
                    }],[{
                        RIGHTINDEX: "close",
                        OPERDESC: "流程版本",
                        OPERNAME: "",
                        OPERFUN: "close"
                    }]);

                    return btnStatus;
                }
            }
        };

        function initRightStatus() {
            var rightStatus = {
                53: {
                    "OPERDESC": "编辑",
                    "OPERFUN": "edit"
                },
                54: {
                    "OPERDESC": "送审",
                    "OPERFUN": "sending"
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
                69: [{
                    "RIGHTINDEX": 69.1,
                    "OPERDESC": "直接签发",
                    "OPERFUN": "compileSignDirect"
                }, {
                    "RIGHTINDEX": 69.2,
                    "OPERDESC": "定时签发",
                    "OPERFUN": "compileSignTiming"
                }],
                70: {
                    "OPERDESC": "编辑",
                    "OPERFUN": "edit"
                },
                77: {
                    "OPERDESC": "退稿",
                    "OPERFUN": "rejection" 
                },
                80: {
                    "OPERDESC": "编辑",
                    "OPERFUN": "edit"
                },
                81: {
                    "OPERDESC": "撤稿",
                    "OPERFUN": "retraction"
                },
            };
            return rightStatus;
        }
    }]);
