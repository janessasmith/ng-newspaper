'use strict';
/**
 *  Module
 *
 * Description
 */


angular.module('newspaperPreviewModule', [
        'newspaperDraftCorrelationModule',
    ])
    /*
     *controller:
     *newspaperPreviewCtrl:报纸细缆控制器
     */
    .controller('newspaperPreviewCtrl', ['$scope', '$location', "$q", '$sce', '$cacheFactory', '$stateParams', '$state', '$window', 'trsHttpService', 'editcenterRightsService', 'editNewspaperService', 'editingCenterService', 'trsconfirm', 'draftCorrela', 'storageListenerService', 'localStorageService', 'trsspliceString', 'trsPrintService', 'editIsLock',
        function($scope, $location, $q, $sce, $cacheFactory, $stateParams, $state, $window, trsHttpService, editcenterRightsService, editNewspaperService, editingCenterService, trsconfirm, draftCorrela, storageListenerService, localStorageService, trsspliceString, trsPrintService, editIsLock) {
            initdata();
            initstatus();
            //初始化数据
            function initdata() {
                $scope.data = {
                    item: [],
                    //当前报纸信息
                    paperMsg: "",
                    params: {
                        serviceid: "mlf_paper",
                        methodname: "queryViewDatas",
                        MetaDataIds: $stateParams.metadata,
                    },
                    newspaperEdit: {
                        1: "newspapertext",
                        2: "newspaperpic"
                    },
                    preview: {
                        news: '1',
                        atlas: '2'
                    },
                    METADATAID: $stateParams.metadataid,
                    typeOfAttachmentArr: [],
                };
                //当前报纸信息
                editingCenterService.getSiteInfo($stateParams.paperid).then(function(data) {
                    $scope.data.paperMsg = data;
                });
                storageListenerService.removeListener("newspaper");
                requestData();
            }
            //初始化状态
            function initstatus() {
                /**
                 * [status description]按钮信息与报纸
                 * @type {Object}
                 * btnRights {obj} 按钮对象
                 * ischoose {
                 *     mark:是否选中 返回布尔型
                 *     key:一个值标 
                 * } 
                 * preview  {obj} 预览图
                 * selectArray [] 选择数组
                 * selectDefault ：选择默认值
                 * 
                 */
                $scope.status = {
                    //初始化按钮
                    btnRights: "",
                    //是否选中
                    ischoose: {
                        mark: false,
                        key: ''
                    },
                    //选择预览新闻或者图集
                    preview: {
                        news: "1",
                        atlas: "2"
                    },
                    isRequestData: '0',
                    //进入预览页的报纸
                    methodname: [
                        'paper.dyg',
                        'paper.jrg',
                        'paper.sbg',
                        'paper.yqg',
                        'paper.gdg'
                    ],
                    //关联稿件类型
                    relatedDarftObj: {
                        29: {
                            type: "4",
                            name: "归档稿"
                        },
                        30: {
                            type: "1",
                            name: "今日稿"
                        },
                        31: {
                            type: "0",
                            name: "待用稿"
                        },
                        32: {
                            type: "1",
                            name: "今日稿"
                        },
                        33: {
                            type: "1",
                            name: "今日稿"
                        },
                        34: {
                            type: "2",
                            name: "上版稿"
                        },
                        35: {
                            type: "3",
                            name: "已签稿"
                        },
                        36: {
                            type: "3",
                            name: "已签稿"
                        },
                        37: {
                            type: "3",
                            name: "已签稿"
                        },
                        38: {
                            type: "3",
                            name: "已签稿"
                        }
                    },
                    previewtype: $stateParams.newspapertype,
                    //预览相关联方法
                    queryMethodName: [
                        "queryRelateDocsInDaiYong",
                        "queryRelateDocsInJinRi",
                        "queryRelateDocsInShangBan",
                        "queryReleteDocsInYiQianFa",
                        "queryReleteDocsInGuiDang"
                    ],
                    bitFaceTit: '查看痕迹',
                    // 初始化跳转显示
                    switchShow: true,
                    //初始化关联稿
                    RelatedDarft: [],
                    //初始化选中集合
                    selectArray: [],
                    //初始化选中对象
                    // clickedItem: "",
                    //默认选中对象
                    //selectDefault: item,
                    //默认选择集合
                    //selectCurrent: items.DOCUMENTS,
                    //默认选择集合METADATAID
                    current: [],
                    previewCache: "newspaperPreviewCache",
                    previewMetadataid: [],
                    previewItemMetadata: "",
                    //从缓存拿出
                    selectArrayIdCache: [],
                    doctype:$stateParams.doctype
                };
                /**
                 * [if description]对于归档稿暂时没有权限模型使用的缓兵之计
                 * @param  {[type]} $scope.status.methodname[newspapertype] [description]
                 * @return {[type]}                                         [description]
                 */
                if ($scope.status.methodname[$stateParams.newspapertype] !== 'paper.gdg') {
                    editcenterRightsService.initNewspaperListBtn($scope.status.methodname[$stateParams.newspapertype], $stateParams.paperid).then(function(data) {
                        $scope.status.btnRights = data;
                    });
                }
                //获取查看痕迹按钮权限
                editcenterRightsService.getRightsofBigFace($stateParams.paperid, 'paper.trace').then(function(data) {
                    $scope.status.bigFaceRights = data;
                });
            }

            //请求数据
            function requestData(metadataid) {
                LazyLoad.css('./components/util/ueditor/service/css/ueditorBuiltInStyles.css?v=1.0', function(arg) {
                    $scope.data.params.MetaDataIds = metadataid ? metadataid : $stateParams.metadata;
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.data.params, 'post').then(function(data) {
                        console.log(data);
                        $scope.item = data[0];
                        $scope.data.item = data[0];
                        $scope.data.item.HTMLCONTENTTRUST = $sce.trustAsHtml(data[0].HTMLCONTENT);
                        $scope.data.item.HTMLCONTENT = data[0].HTMLCONTENT;
                        $scope.data.CONTENT = data[0].CONTENT.replace(/\n/g, "<br/>");
                        getAttachFileType(data[0].ATTACHFILE);
                        document.title = data[0].TITLE;
                        if ($scope.data.preview.atlas == data[0].DOCTYPEID && data[0].DOCTYPEID.REMARKS !== undefined) {
                            $scope.data.item.REMARKS = $scope.data.item.REMARKS.replace(/\n/g, "<br/>");
                        }
                        /*
                         * draftCorrelationView[ description] 相关关联稿件
                         */
                        draftCorrela.initDraftCorrela($scope.status.queryMethodName[$stateParams.newspapertype], $stateParams.paperid, $scope.data.item.METADATAID).then(function(data) {
                            $scope.status.RelatedDarft = data;
                        });
                        localstorageItem();
                        isMark(data[0].METADATAID);
                    });
                });
            }

            //选择按钮
            $scope.chooseItem = function() {
                var selectCurrentr = angular.copy($scope.data.item.METADATAID);
                $scope.status.selectArrayIdCache = localStorageService.get('newspaperPreviewSelectArray');
                if ($scope.status.selectArrayIdCache === null || $scope.status.selectArrayIdCache === undefined || $scope.status.selectArrayIdCache === '') {
                    localStorageService.set('newspaperPreviewSelectArray', [selectCurrentr]);
                    $scope.status.selectArrayIdCache = [selectCurrentr];
                    isMark(selectCurrentr);
                }
                if (($scope.status.selectArrayIdCache.indexOf(selectCurrentr)) > -1) {
                    $scope.status.selectArrayIdCache.splice($scope.status.selectArrayIdCache.indexOf(selectCurrentr), 1);
                    localStorageService.set('newspaperPreviewSelectArray', $scope.status.selectArrayIdCache);
                } else {
                    $scope.status.selectArrayIdCache.push(selectCurrentr);
                    localStorageService.set('newspaperPreviewSelectArray', $scope.status.selectArrayIdCache);
                }
                isMark(selectCurrentr);
            };
            //是否打标记
            function isMark(metadata) {
                if ($scope.status.selectArrayIdCache === "" || $scope.status.selectArrayIdCache === null)
                    return;
                if ($scope.status.selectArrayIdCache.indexOf(metadata) < 0 || $scope.status.selectArrayIdCache.indexOf(metadata) === undefined) {
                    $scope.status.ischoose.mark = false;
                } else {
                    $scope.status.ischoose.mark = true;
                }
            }
            //从缓存获取列表页上的Item
            //从缓存获取selectArray
            function localstorageItem() {
                $scope.status.previewMetadataid = localStorageService.get('newspaperPreviewCache');
                if ($scope.status.selectArrayIdCache = localStorageService.get('newspaperPreviewSelectArray') === null) {
                    localStorageService.set('newspaperPreviewSelectArray', []);
                    $scope.status.selectArrayIdCache = localStorageService.get('newspaperPreviewSelectArray');
                } else {
                    $scope.status.selectArrayIdCache = localStorageService.get('newspaperPreviewSelectArray');
                }

            }
            //上一页
            $scope.pageUp = function() {
                if (($scope.status.previewMetadataid.indexOf($scope.data.item.METADATAID)) - 1 < 0) {
                    trsconfirm.alertType("您当前处于第一页", "", "warning", false, "");
                    return;
                }
                var MetaDataIds = $scope.status.previewMetadataid[($scope.status.previewMetadataid.indexOf($scope.data.item.METADATAID)) - 1];
                //requestData(MetaDataIds);

                $state.go("newspaperNewsPreview", {
                    metadata: MetaDataIds,
                    paperid: $stateParams.paperid,
                    newspapertype: $stateParams.newspapertype
                });
            };
            //下一页
            $scope.pageDown = function() {
                if (($scope.status.previewMetadataid.indexOf($scope.data.item.METADATAID)) + 1 === $scope.status.previewMetadataid.length) {
                    trsconfirm.alertType("没有更多稿件了", "", "warning", false, "");
                    return;
                }
                var MetaDataIds = $scope.status.previewMetadataid[($scope.status.previewMetadataid.indexOf($scope.data.item.METADATAID)) + 1];
                //requestData(MetaDataIds);

                $state.go("newspaperNewsPreview", {
                    metadata: MetaDataIds,
                    paperid: $stateParams.paperid,
                    newspapertype: $stateParams.newspapertype
                });
            };

            //关闭
            $scope.close = function() {
                window.close();
            };
            //签发照排操作
            $scope.signZhaopai = function() {
                singZhaopai([$scope.data.item]);
            };
            //签发照排函数
            function singZhaopai(item) {
                if ($scope.data.paperMsg.ISZHAOPAI === '0') {
                    editNewspaperService.stopSignZp(item, function(result) {
                        storageListenerService.addListenerToNewspaper("qianfazp");
                        window.close();
                    }, function() {

                    });
                } else {
                    editNewspaperService.useSignZP(item, function(result) {
                        storageListenerService.addListenerToNewspaper("qianfazp");
                        window.close();
                    }, function() {

                    });
                }
            }
            //撤稿
            $scope.cancelDraft = function() {
                var transferData = {
                    "title": "撤稿",
                    "opinionTit": "撤稿原因",
                    "items": [$scope.data.item],
                    "PaperId": $stateParams.SITEID,
                    "queryMethod": ""
                };
                editNewspaperService.cancelSignedViews(transferData, function(result) {
                    var params = {
                        'SrcDocIds': $scope.data.item.METADATAID,
                        'Option': result.opinion ? result.opinion : "",
                        "serviceid": "mlf_paper",
                        "methodname": "doCheGao"
                    };
                    promptRequest(params, "撤稿成功");
                    $scope.status.selectCurrent.splice($scope.status.current.indexOf($scope.data.item.METADATAID), 1);

                });
            };
            /**
             * [rejection description]退稿操作
             * @return {[type]} [description]
             */
            $scope.rejection = function() {
                var transferData = {
                    "PaperId": $stateParams.paperid,
                    "queryMethod": "",
                    "item": [$scope.data.item],
                    "rejecectionMethod": "rejectionShangBanViewDatas"
                };
                editNewspaperService.rejectionDraft(transferData, function(result) {
                    storageListenerService.addListenerToNewspaper("tuigao");
                    window.close();
                }, function() {

                });
            };
            //流程版本操作日志
            $scope.showVersionTime = function() {
                editingCenterService.getVersionTime($scope.data, false);
            };
            //上版
            $scope.shangban = function() {
                var transferData = {
                    "title": "上版",
                    "opinionTit": "上版意见",
                    "selectedArr": [$scope.data.item],
                    "isShowDate": true,
                    "PaperId": $stateParams.paperid,
                    "queryMethod": ""
                };

                editNewspaperService.changeLayoutDraft(transferData, function(result) {
                    var shangbanParams = {
                        serviceid: "mlf_paper",
                        oprtime: "1m",
                        methodname: "doShangBanJinRi",
                        SrcDocIds: result.srcdocids,
                        BanMianID: result.banmianid,
                        PubDate: result.dateStr,
                        Option: result.option,
                        SrcBanMianIds: result.SrcBanMianIds
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), shangbanParams, "get").then(function(data) {
                        promptRequest(shangbanParams, "上版成功");
                        $scope.status.selectCurrent.splice($scope.status.current.indexOf($scope.data.item.METADATAID), 1);
                    });
                });
            };
            //待用
            $scope.daiyong = function() {
                var transferData = {
                    "title": "待用",
                    "opinionTit": "待用说明",
                    "items": [$scope.data.item],
                    "PaperId": $stateParams.SITEID,
                    "queryMethod": ""
                };
                editNewspaperService.cancelSignedViews(transferData, function(result) {
                    var params = {
                        'SrcDocIds': $scope.data.item.METADATAID,
                        'Option': result.opinion ? result.opinion : "",
                        "serviceid": "mlf_paper",
                        "methodname": "doDaiYong",
                        SrcBanMianIds: $scope.data.item.CHNLID
                    };
                    promptRequest(params, "待用成功");
                });
            };
            //转版
            $scope.zhuangban = function() {
                var transferData = {
                    "title": "转版",
                    "opinionTit": "转版意见",
                    "selectedArr": [$scope.data.item],
                    "PaperId": $stateParams.SITEID,
                    "queryMethod": ""
                };
                editNewspaperService.changeLayoutDraft(transferData, function(result) {
                    var zhuanbanParams = {
                        serviceid: "mlf_paper",
                        methodname: "doZhuanBan",
                        oprtime: "1m",
                        SrcDocIds: result.srcdocids,
                        BanMianID: result.banmianid,
                        SrcBanMianId: transferData.selectedArr[0].CHNLID,
                        PubDate: result.dateStr,
                        Option: result.option
                    };
                    promptRequest(zhuanbanParams, "转版成功");
                });
            };
            //取消签发
            $scope.cancelSign = function() {
                var transferData = {
                    "title": "取消签发",
                    "opinionTit": "签发意见",
                    "items": [$scope.data.item],
                    "PaperId": $stateParams.SITEID,
                    "queryMethod": $scope.status.queryMethodName[$stateParams.newspapertype]
                };
                editNewspaperService.cancelSignedViews(transferData, function(result) {
                    var params = {
                        'SrcDocIds': $scope.data.item.METADATAID,
                        'Option': result.opinion ? result.opinion : "",
                        "serviceid": "mlf_paper",
                        "methodname": "doQuXiaoQF"
                    };
                    promptRequest(params, "取消签发成功");
                });
            };


            //创作轴
            $scope.creationAxis = function() {
                var params = {
                    serviceid: "mlf_releasesource",
                    methodname: "setCreation",
                    metadataid: $stateParams.metadata
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("加入创作轴成功", "", "success", false);
                });
            };

            /**
             * [promptRequest description]具体操作数据请求成功后关闭页面
             * @param  {[obj]} params [description]请求参数
             * @param  {[string]} info   [description]提示语
             * @return {[type]}        [description]
             */
            function promptRequest(params, info) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType(info, "", "success", false, function() {
                        window.close();
                        window.opener.location.reload();
                    });
                    $scope.status.isRequestData = '1';

                });
            }
            /**
             * [relatedDarft description]具体操作数据请求成功后关闭页面
             * @param  {[obj]} params [description]请求参数
             */
            // $scope.relatedDarftSwitch = function() {
            //     $scope.status.switchShow = false;
            //     $scope.data.params.MetaDataIds = item.METADATAID;
            //     requestData(params);
            // };

            //编辑
            $scope.edit = function() {
                editIsLock.isLock($scope.data.item).then(function(data) {
                    var editPath = $scope.data.newspaperEdit[$scope.data.item.DOCTYPEID];
                    var editParams = {
                        metadata: $stateParams.metadata,
                        paperid: $stateParams.paperid,
                        newspapertype: $stateParams.newspapertype
                    };
                    var editUrl = $state.href(editPath, editParams);
                    if (data.ISLOCK == "false") {
                        $window.open(editUrl);
                        $window.close();
                    } else {
                        trsconfirm.alertType("稿件已经被【" + data.LOCKUSER + "】锁定,是否强制解锁", "", "warning", true, function() {
                            editIsLock.forceDeblocking($scope.data.item).then(function(data) {
                                $window.open(editUrl);
                                $window.close();
                            });
                        }, function() {});
                    }
                });
            };

            //关闭
            $scope.close = function() {
                $window.close();
            };
            /**
             * [openUrl description]打开图片看大图
             * @param  {[type]} url [description]图片地址
             * @return {[type]}     [description]
             */
            $scope.openUrl = function(url) {
                $window.open(url);
            };
            /**
             * 批量打印功能
             */
            $scope.printBtn = function() {
                var chnlDocIdsArray = $stateParams.metadata;
                var params = {
                    serviceid: "mlf_paper",
                    methodname: "queryViewDatas",
                    MetaDataIds: chnlDocIdsArray
                };

                function requestVersion() {
                    var idsArray = $stateParams.metadata;
                    var versionResult = {};
                    var defer = $q.defer();
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), {
                        serviceid: "mlf_metadatalog",
                        methodname: "query",
                        MetaDataId: $stateParams.metadata
                    }, 'get').then(function(data) {
                        versionResult = data.DATA;
                        defer.resolve(versionResult);
                    });
                    return defer.promise;
                }
                $scope.loadingPromise = $q.all([trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get'), requestVersion()]).then(function(data) {
                    var detail = data[0];
                    var version = data[1];
                    detail[0].VERSION = version;
                    trsPrintService.trsPrintDocument(detail);
                });
            };

            /**
             * [getAttachFileType description]获取附件后缀
             * @param  {[obj]} params [description]请求参数
             * @return {[obj]}        [description]请求返回值
             */
            function getAttachFileType(data) {
                angular.forEach(data, function(value, key) {
                    var attachmentType = value.APPFILE.split(".");
                    var length = value.APPFILE.split(".").length;
                    $scope.data.typeOfAttachmentArr.push(attachmentType[length - 1]);
                });
            }
        }
    ]);
