"use strict";
angular.module('editingCenterAddWebsiteModule', [])
    .controller('EditingCenterAddWebsiteController', ['$scope', '$q', '$state',
        '$modal', '$location', '$stateParams', '$anchorScroll', '$window', 'trsHttpService',
        'initAddMetaDataService', 'initVersionService', '$timeout', 'storageListenerService',
        'jsonArrayToStringService', 'trsconfirm', "$validation", 'initeditctrBtnsService', 'editingCenterAppService', 'editingCenterService', 'initAppRequiredBtnService', 'editcenterRightsService', 'filterEditctrBtnsService', 'appDictionaryBtnService',
        function($scope, $q, $state, $modal, $location, $stateParams, $anchorScroll, $window,
            trsHttpService, initAddMetaDataService, initVersionService, $timeout, storageListenerService, jsonArrayToStringService, trsconfirm,
            $validation, initeditctrBtnsService, editingCenterAppService, editingCenterService, initAppRequiredBtnService, editcenterRightsService, filterEditctrBtnsService, appDictionaryBtnService) {
            /*初始化*/
            initStatus();
            initData();

            function initStatus() {
                $scope.params = {
                    "serviceid": "mlf_appmetadata",
                    "methodname": "getLinkDoc",
                    "ChnlDocId": $stateParams.chnldocid
                };
                $scope.status = {
                    openBtn: true,
                };
                $scope.data = {
                    belongChannel: editingCenterAppService.initBelongChannel(),
                    commentSet: editingCenterAppService.initCommentSet(),
                    listStyle: editingCenterAppService.initListStyle(),
                    label: editingCenterAppService.initLabel(),
                };
                $scope.handleBtnClick = function(funname) {
                    eval("$scope." + funname + "()");
                };
            }

            function initData() {
                angular.isDefined($stateParams.chnldocid) ? initEditData() : initNewData();
                initBtnArray();
            }
            /**
             * [initNewData description]初始化新建页面
             * @return {[type]} [description]
             */
            function initNewData() {
                $scope.list = initAddMetaDataService.initWebsite();
            }
            /**
             * [initEditData description]初始化编辑页面
             * @return {[type]} [description]
             */
            function initEditData() {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                    $scope.list = data;
                    reWriteImg();
                });
            }
            /**
             * [reWriteImg description]回写图片列表数据
             * @return {[type]} [description]
             */
            function reWriteImg() {
                var imgArray = ["FOCUSIMAGE", "LISTPICS"];
                angular.forEach(imgArray, function(data, index) {
                    if ($scope.list[data] !== 0) {
                        var arrayDocPic = [];
                        angular.forEach($scope.list[data], function(dataC, indexC) {
                            arrayDocPic.push({
                                "APPFILE": dataC.APPFILE,
                                "APPDESC": dataC.APPDESC,
                                'PERPICURL': dataC.PERPICURL
                            });
                        });
                        $scope.list[data] = arrayDocPic;
                    }
                });
            }
            /**
             * 网页稿重构开始
             */
            /**
             * [updateCKSelection description]单选框回调函数
             * @param  {[str]} attribute [description]需要改变的属性
             * @return {[type]}           [description]
             */
            $scope.updateCKSelection = function(attribute) {
                $scope.list[attribute] = $scope.list[attribute] == 0 ? 1 : 0;
            };
            /**
             * [deleteUploaderImg description]删除已经上传的图片
             * @param  {[str]} attribute [description]要删除的属性
             * @param  {[num]} index     [description]下标
             * @return {[type]}           [description]
             */
            $scope.deleteUploaderImg = function(attribute, index) {
                if (attribute === 'LISTPICS') {
                    $scope.list[attribute][index].APPFILE = "";
                } else {
                    $scope.list[attribute] = [];
                }
            };
            /**
             * [save description]保存函数
             * @return {[type]} [description]
             */
            $scope.save = function() {
                trsconfirm.sensitiveWords($stateParams.chnldocid, function() {
                    save(true).then(function() {});
                });
            };
            /**
             * [appTrial description]APP送审操作
             * @return {[type]} [description]
             */
            $scope.appTrial = function() {
                trsconfirm.sensitiveWords($stateParams.chnldocid, function() {
                    save().then(function() {
                        trial();
                    });
                });
            };
            /**
             * [trial description]稿件送审
             * @return {[type]} [description]
             */
            function trial() {
                trsconfirm.inputModel("送审", "请输入送审意见", function(content) {
                    var params = {
                        "serviceid": "mlf_appoper",
                        "methodname": "trialMetaDatas",
                        "MetaDataIds": $scope.list.METADATAID,
                        "ChnlDocIds": $scope.list.CHNLDOCID,
                        "ChannelId": $stateParams.channelid,
                        "Opinion": content
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        trsconfirm.alertType("送审成功", "", "success", false, function() {
                            storageListenerService.addListenerToApp("send");
                            $window.close();
                        });
                    });
                });
            }
            /**
             * [appSignDirect description]app直接签发
             * @return {[type]} [description]
             */
            $scope.appSignDirect = function() {
                trsconfirm.sensitiveWords($stateParams.chnldocid, function() {
                    save().then(function() {
                        signDirect();
                    });
                });
            };
            /**
             * [signDirect description]直接签发
             * @return {[type]} [description]
             */
            function signDirect() {
                trsconfirm.confirmModel('签发', '确认发布稿件', function() {
                    var methodname = ["appDaiBianPublish", "appDaiShenPublish", "appYiQianFaPublish"];
                    var params = {
                        serviceid: "mlf_appoper",
                        methodname: methodname[$stateParams.platform],
                        ObjectIds: $scope.list.CHNLDOCID,
                        ChnlDocIds: $scope.list.CHNLDOCID,
                        MetaDataIds: $scope.list.METADATAID,
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        trsconfirm.alertType("签发成功", "", "success", false, function() {
                            storageListenerService.addListenerToApp("directSign");
                            $window.close();
                        });
                    });
                });
            }
            /**
             * [appSignTiming description]定时签发
             * @return {[type]} [description]
             */
            $scope.appSignTiming = function() {
                trsconfirm.sensitiveWords($stateParams.chnldocid, function() {
                    save().then(function() {
                        timeSign();
                    });
                });
            };
            /**
             * [timeSign description]定时签发函数
             * @return {[type]} [description]
             */
            function timeSign() {
                var methodname = ['appDaiBianTimingPublish', 'appDaiShenTimingPublish'];
                var params = {
                    selectedArray: [$scope.list],
                    isNewDraft: true,
                    methodname: methodname[$stateParams.platform],
                    serviceid: "mlf_appoper",
                };
                editingCenterService.draftTimeSinged(params).then(function(data) {
                    trsconfirm.alertType("定时签发成功", "", "success", false, function() {
                        storageListenerService.addListenerToApp("timeSign");
                        $window.close();
                    });
                });
            }
            /**
             * [appPreview description]稿件预览
             * @return {[type]} [description]
             */
            $scope.appPreview = function() {
                trsconfirm.sensitiveWords($stateParams.chnldocid, function() {
                    save().then(function(data) {
                        preview();
                    });
                });
            };
            /**
             * [preview description]预览方法
             * @return {[type]} [description]
             */
            function preview() {
                editingCenterService.draftPublish($stateParams.chnldocid);
            }
            /**
             * [appRevoke description]稿件撤稿
             * @return {[type]} [description]
             */
            $scope.appRevoke = function() {
                save().then(function(data) {
                    revoke();
                });
            };
            /**
             * [revoke description]撤稿函数
             * @return {[type]} [description]
             */
            function revoke() {
                trsconfirm.inputModel("撤稿", "请输入撤稿意见", function(content) {
                    var params = {
                        serviceid: "mlf_appoper",
                        methodname: "rejectionMetaDatas",
                        ChnlDocIds: $scope.list.CHNLDOCID,
                        MetaDataIds: $scope.list.METADATAID,
                        Opinion: content,
                        ChannelId: $stateParams.channelid
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
                        trsconfirm.alertType("撤稿成功", "", "success", false, function() {
                            storageListenerService.addListenerToApp("revoke");
                            $window.close();
                        });
                    });
                });
            }
            /**
             * [savePublish description]保存并发布
             * @return {[type]} [description]
             */
            $scope.savePublish = function() {
                save().then(function(data) {
                    signDirect();
                });
            };
            /**
             * [close description]关闭页面
             * @return {[type]} [description]
             */
            $scope.close = function() {
                editingCenterService.closeWinow($scope.webForm.$dirty, false).then(function() {
                    save().then(function() {
                        storageListenerService.addListenerToApp("save");
                        var opened = $window.open('about:blank', '_self');
                        opened.close();
                    });
                }, function() {
                    var opened = $window.open('about:blank', '_self');
                    opened.close();
                });
            };
            /**
             * [dealAttributeBeforeSave description]在保存前处理数据
             * @return {[type]} [description]
             */
            function dealAttributeBeforeSave() {
                $scope.webForm.$setPristine();
                $scope.status.openBtn = false;
                var list = angular.copy($scope.list);
                list.SERVICEID = "mlf_appmetadata";
                list.METHODNAME = "saveLinkDoc";
                list.LISTPICS = editingCenterAppService.manageListpics(list.LISTPICS);
                list = jsonArrayToStringService.jsonArrayToString(list);
                return list;
            }
            /**
             * [dealAttributeAfterSave description]保存成功后处理属性
             * @param  {[obj]} data [description]保存成功后的返回值
             * @param  {[boolean]} flag [description]标示位
             * @return {[type]}      [description]
             */
            function dealAttributeAfterSave(data, flag) {
                $scope.status.openBtn = true;
                $stateParams.chnldocid = $scope.list.CHNLDOCID = data.CHNLDOCID;
                $stateParams.metadataid = $scope.list.METADATAID = data.METADATAID;
                if (flag) {
                    storageListenerService.addListenerToApp("save");
                    $state.transitionTo($state.current, $stateParams, {
                        reload: false
                    });
                    trsconfirm.saveModel("保存成功", "", "success");
                } else {
                    $scope.params.MetaDataIds = $scope.list.METADATAID;
                    $scope.params.CHNLDOCIDS = $scope.list.CHNLDOCID;
                    $scope.params.ObjectIds = $scope.list.CHNLDOCID;
                    $scope.params.serviceid = "mlf_appoper";
                }
            }
            /**
             * [save description]保存函数
             * @param  {[boolean]} flag [description]标示位
             * @return {[type]}      [description]
             */
            function save(flag) {
                var deferred = $q.defer();
                $validation.validate($scope.webForm)
                    .success(function() {
                        var list = dealAttributeBeforeSave();
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), list, "post").then(function(data) {
                            dealAttributeAfterSave(data, flag);
                            deferred.resolve(data);
                        }, function(data) {
                            deferred.reject(data);
                        });
                    }).error(function() {
                        editingCenterService.checkSaveError($scope.webForm); //定位输入错的表单位置
                        $timeout(function() {
                            trsconfirm.saveModel("提交失败", "请检查填写项", "error", false);
                        }, 100);
                    });
                return deferred.promise;
            }
            /**
             * [initBtnArray description]初始化功能按钮
             * @return {[type]} [description]
             */
            function initBtnArray() {
                //所需的按钮
                $scope.data.appRequiredBtns = initAppRequiredBtnService.initAppRequiredBtns()[$stateParams.platform];
                //根据不同平台调用不同权限方法
                $scope.data.rightsMethod = ['app.daibian', 'app.daishen', 'app.yiqianfa'];
                initeditctrBtnsService.initAppData($stateParams.channelid, $scope.data.rightsMethod[$stateParams.platform]).then(function(data) {
                    //字典按钮
                    $scope.data.dictionaryBtn = [appDictionaryBtnService.initAppCompBtn(), appDictionaryBtnService.initAppPendBtn(), appDictionaryBtnService.initAppSignBtn()];
                    $scope.status.btnStatus = initeditctrBtnsService.initBtns(data, $scope.data.dictionaryBtn[$stateParams.platform]);
                    //最终得到的按钮
                    $scope.data.arrayBtn = filterEditctrBtnsService.filterBtn($scope.status.btnStatus, $scope.data.appRequiredBtns);
                    addBtn();
                });
            }
            /**
             * [addBtn description]新增保存关闭按钮
             */
            function addBtn() {
                var OPERDESC = ['保存', '保存', '保存并发布'];
                var OPERFUN = ['save', 'save', 'savePublish'];
                $scope.data.arrayBtn.unshift({
                    RIGHTINDEX: "save",
                    OPERDESC: OPERDESC[$stateParams.platform],
                    OPERNAME: "",
                    OPERFUN: OPERFUN[$stateParams.platform]
                });
                $scope.data.arrayBtn.push({
                    RIGHTINDEX: "close",
                    OPERDESC: "关闭",
                    OPERNAME: "",
                    OPERFUN: "close"
                });
            }
        }
    ]);
