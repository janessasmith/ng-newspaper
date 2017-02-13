"use strict";
angular.module('websiteToBeCompiledNewsModule', ['visualChooseModule', 'initWebsiteNewsModule'])
    .controller('editingCenterWebsiteNewsCtrl', ['$scope', '$compile', '$window', '$modal', '$filter', '$location', '$anchorScroll', '$stateParams', '$q', '$state', '$validation', '$timeout', 'trsHttpService', 'initWebsiteDataService', 'initVersionService', 'trsconfirm', 'trsResponseHandle', 'jsonArrayToStringService', 'SweetAlert', 'websiteService', 'trsspliceString', '$sce', 'initSingleSelecet', "initeditctrBtnsService", "filterEditctrBtnsService", "initWebsiteNewsService", "localStorageService", "trsSelectDocumentService", "Upload", "websiteBtnService", "iWoService", "editingCenterService", "storageListenerService", "ueditorService", "editIsLock", "editcenterRightsService", 'uploadAudioVideoService',
        function($scope, $compile, $window, $modal, $filter, $location, $anchorScroll, $stateParams, $q, $state, $validation, $timeout, trsHttpService, initWebsiteDataService, initVersionService, trsconfirm, trsResponseHandle, jsonArrayToStringService, SweetAlert, websiteService, trsspliceString, $sce, initSingleSelecet, initeditctrBtnsService, filterEditctrBtnsService, initWebsiteNewsService, localStorageService, trsSelectDocumentService, Upload, websiteBtnService, iWoService, editingCenterService, storageListenerService, ueditorService, editIsLock, editcenterRightsService, uploadAudioVideoService) {
            initStatus();
            initData();
            /*初始化状态*/
            function initStatus() {
                $scope.news = false;
                $scope.address = true;
                $scope.page = {
                    CURRPAGE: 1,
                    PAGESIZE: 20
                };
                $scope.params = {
                    "serviceid": "mlf_website",
                    "methodname": "getNewsDoc",
                    "ChnlDocId": $stateParams.chnldocid,
                    "ChannelId": $stateParams.channelid,
                    "SiteId": $stateParams.siteid,
                    "MetaDataId": $stateParams.metadataid
                };
                $scope.status = {
                    siteid: $stateParams.siteid,
                    chnldocid: $stateParams.chnldocid,
                    openBtn: true,
                    support: {
                        content: "" //提交给辅助写作的纯文本
                    },
                    files: [], //上传附件绑定数组
                    showFiles: [], //附件展示以及上传字段
                    isUploaderFile: false, //上传按钮是否可点击
                    isSubTitleShow: true, //是否显示副标题
                    hideOrMoreText: true, //显示隐藏或者更多操作
                    showRelated: false, //关联延展阅读单选框
                    relatedContent: false, //关联延展阅读内容
                    hasTimeline: false, //是否存在流程版本
                    isDarftMove: true, //稿件是否移动
                    isEditDraft: angular.isDefined($stateParams.chnldocid) ? true : false, //是否会死编辑稿件
                    bitFaceTit: "查看痕迹",
                    isHasBigFace: false,
                    position: $stateParams.status,
                    audioVideoidsArray: [], //播放音视频临时数组
                    uploadMasProgress: 0, //上传的进度
                    uploadMasNow: false,
                    masUploadExtensions: 'mp3,mp4,flv,rmvb,avi', //允许上传的文件类型
                    masUploadMimeTypes: 'audio/mp3,video/mp4,video/flv,video/rmvb,video/avi' //对应的文件种类
                };
                $scope.data = {
                    relNewsSelectedItems: [],
                    ownerSelectedItems: '',
                    KEYWORDS: [],
                    version: [],
                    copyVersion: [],
                    tag: {
                        hasChoose: false,
                        originalTag: [],
                        selectTag: [],
                    },
                    comment: {
                        comment: [],
                        voiceObj: {},
                        hasMore: false,
                        currPage: 1,
                    },
                };
                //判断流程版本的存在与否
                $anchorScroll.yOffset = 63;
                $scope.showAllTips = false; // 初始化错误提示状态为关闭；
            }
            /**
             * [initData description]初始化数据
             * @return {[type]} [description]
             */
            function initData() {
                $scope.handleBtnClick = function(funname) {
                    eval("$scope." + funname + "()");
                };
                //存在$stateParams.chnldocid,则编辑新闻
                angular.isDefined($stateParams.chnldocid) ? initEditData() : initNewData();
                editcenterRightsService.getRightsofBigFace($stateParams.siteid, 'website.trace').then(function(data) {
                    $scope.status.bigFaceRights = data;
                });
                // editcenterRightsService.initIwoListBtn("website.trace").then(function(data) {
                //     $scope.status.bigFaceRigths = data;
                // });
                initUploadMasFn();
                storageListenerService.removeListener("website");
                // getDefaultSources();
            }
            /**
             * [initEditData description]初始化编辑数据
             * @return {[type]} [description]
             */
            function initEditData() {
                $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
                    $scope.list = data;
                    $scope.list.AUDIOVIDEO = angular.isDefined($scope.list.AUDIOVIDEO) ? $scope.list.AUDIOVIDEO : "";
                    $scope.list.AUDIOVIDEO = $scope.list.AUDIOVIDEO === "" ? [] : $scope.list.AUDIOVIDEO.split(","); //将音视频文件转换为数组格式
                    //将音视频ID存入audioVideoidsArray对象，方便之后渲染
                    angular.forEach($scope.list.AUDIOVIDEO, function(_data, index, array) {
                        $scope.status.audioVideoidsArray.push({ id: _data });
                    });
                    $scope.list.TITLE = $scope.list.TITLE.split("<br />").join("\n");
                    $scope.status.isHasBigFace = true;
                    reWriteAttachFile(data);
                    $scope.data.initContent = angular.copy(data.HTMLCONTENT); //初始化正文，用于后面比较正文是否被修改过（特殊处理）
                    $scope.data.relNewsSelectedItems = angular.isDefined(data.RELATEDNEWS) ? data.RELATEDNEWS : [];
                    //获取流程版本
                    getVersion().then(function(data) {
                        loadDirective();
                    });
                    initDocgenre(data);
                    //初始化处理概览图片,仅编辑时生效
                    $scope.list.OUTLINEPICS = doWithPicsOrAttach($scope.list.OUTLINEPICS);
                    template($stateParams.channelid).then(function(dataC) {
                        angular.isDefined($stateParams.metadataid) ? "" : $scope.websiteTemplate = dataC[0];
                        $scope.list.TEMPNAME = {
                            name: data.TEMPNAME.NAME,
                            value: data.TEMPNAME.VALUE
                        };
                        $scope.list.TEMPID = $scope.list.TEMPNAME.value;
                    });
                    initBtnArray();
                    getChannel();
                    initKeyWords();
                    //初始化责任编辑
                    getCurrentLoginUser().then(function(name) {
                        $scope.list.EDITORTRUENAME = $scope.list.EDITORTRUENAME ? $scope.list.EDITORTRUENAME : name[0].TRUENAME;
                    });
                    //请求这个稿件的标签
                    getCurrDraftTag();
                    //获取评审意见
                    getComment($stateParams.metadataid, $scope.data.comment.currPage);
                });
                //稿件加锁
                $timeout(function() {
                    editIsLock.lockDraft($stateParams.metadataid);
                }, 1700);
            }
            /**
             * [initNewData description]初始化新建数据
             * @return {[type]} [description]
             */
            function initNewData() {
                $scope.list = initWebsiteDataService.initNews();
                initKeyWords();
                $scope.list.AUDIOVIDEO = []; //将音视频文件转换为数组格式
                $scope.list.CHANNELID = $stateParams.channelid;
                $scope.data.initContent = angular.copy($scope.list.HTMLCONTENT); //初始化正文，用于后面比较正文是否被修改过（特殊处理）
                loadDirective();
                initDocgenre();
                // $scope.list.ISSUETIME = $filter("date")(new Date(), "yyyy-MM-dd HH:mm").toString();
                initBtnArray();
                getChannel();
                getCurrentLoginUser().then(function(data) {
                    $scope.list.EDITORTRUENAME = data[0].TRUENAME;
                });
                template($stateParams.channelid).then(function(dataC) {
                    angular.isDefined($stateParams.metadataid) ? "" : $scope.websiteTemplate = dataC[0];
                    $scope.list.TEMPID = $scope.list.TEMPNAME.value;
                });
            }
            /**
             * [initDocgenre description]初始化稿件体裁
             * @return {[type]} [description]
             */
            function initDocgenre(obj) {
                iWoService.initData().then(function(data) {
                    $scope.docgenre = data.DocGenre;
                    $scope.list.DOCGENRE = angular.isDefined(obj) ? obj.DOCGENRE : angular.copy($scope.docgenre[0]);
                });
            }
            $scope.invalidTag = function(tag) {
                var reg = /^[^<>\/]*$/;
                if (tag.name.length > 20) {
                    $scope.isShowKeywordTips = true;
                    $scope.keywordsTips = "单个关键词长度不能超过20";
                }
                if (!reg.test(tag.name)) {
                    $scope.isShowKeywordTips = true;
                    $scope.keywordsTips = "不能包含特殊字符";
                }
            };
            $scope.checkTag = function(tag) {
                var len = $scope.data.KEYWORDS.length;
                if (len == 10) {
                    $scope.isShowKeywordTips = true;
                    $scope.keywordsTips = "关键词个数不能超过10个";
                    return false;
                } else {
                    $scope.keywordsTips = "";
                    $scope.isShowKeywordTips = false;
                }
                if (tag.name.indexOf(" ") > -1) {
                    var spaceArr = tag.name.split(" ");
                    $timeout(function() {
                        $scope.data.KEYWORDS.pop();
                        var containArr = [];
                        for (var j = 0; j < $scope.data.KEYWORDS.length; j++) {
                            containArr.push($scope.data.KEYWORDS[j].name);
                        }
                        for (var i = 0; i < spaceArr.length; i++) {
                            if (containArr.indexOf(spaceArr[i]) < 0 && spaceArr[i] != '') {
                                $scope.data.KEYWORDS.push({ 'name': spaceArr[i] });
                                containArr.push(spaceArr[i]);
                            }
                        }
                    });
                }
            };
            $scope.leave = function() {
                $scope.isShowKeywordTips = false;
            };
            $scope.enter = function() {
                var reg = /^[^<>\/]*$/;
                if (angular.isDefined($scope.KEYWORDTEXT) && (!reg.test($scope.KEYWORDTEXT) || $scope.KEYWORDTEXT.length > 20)) {
                    $scope.isShowKeywordTips = true;
                }
            };
            //稿源开始
            var promise;
            $scope.getNewSources = function(viewValue) {
                if (viewValue == '') {
                    var searchParams = {
                        "serviceid": "mlf_website",
                        "methodname": "getReleaseSource",
                        "SiteId": $stateParams.siteid,
                    };
                    return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), searchParams, "get").then(function(data) {
                        return data;
                    });
                } else {
                    if (promise) {
                        $timeout.cancel(promise);
                        promise = null;
                    }
                    promise = $timeout(function() {
                        var searchParams = {
                            "serviceid": "mlf_website",
                            "methodname": "getReleaseSource",
                            "SrcName": viewValue,
                            "SiteId": $stateParams.siteid,
                        };
                        return trsHttpService.httpServer("/wcm/mlfcenter.do", searchParams, "post").then(function(data) {
                            return data;
                        });
                    }, 10);
                    return promise;
                }
            };
            //监听稿源
            $scope.$watch("list.DOCSOURCENAME", function(newValue, oldValue) {
                if (!angular.isObject(newValue)) {
                    newValue = {
                        SRCNAME: newValue,
                        SOURCEID: "0"
                    };
                }
                if (angular.isDefined($scope.list)) {
                    $scope.list.DOCSOURCENAME = newValue;
                }
            });
            //稿源结束
            //是否原创稿
            $scope.oringin = function(list) {
                $scope.newsForm.$dirty = true;
                list.ORIGINAL = list.ORIGINAL === '1' ? '0' : '1';
                if (angular.isUndefined($stateParams.chnldocid) && list.ORIGINAL === '1') {
                    list.ISNOPAYMENT = '0'; //判断为原创稿的话需要默认发稿费  
                }
            };
            //新增稿源
            $scope.saveReleaseSource = function() {
                $scope.params = {
                    "serviceid": "mlf_website",
                    "methodname": "saveReleaseSource",
                    "siteid": $scope.status.siteid,
                    "SrcName": $scope.SrcName,
                };
                $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "post").then(function(data) {
                    if (data.TYPE == 3) {
                        trsconfirm.alertType("新增稿源", "", "success", false);
                        requestData(function() {
                            $scope.params = {
                                "serviceid": "mlf_website",
                                "methodname": "getReleaseSource",
                            };
                            initSingleSelecet.websiteSource().then(function(data) {
                                $scope.sourceJson = data;
                                $scope.websiteSource = angular.copy($scope.sourceJson[0]);
                            });
                        });
                    }
                    if (data.TYPE == 5) {
                        trsconfirm.alertType("新增稿源", "该名字已存在稿源库中，请重新命名", "error", false);
                    }
                });
            };
            //自定义请求数据
            function requestData(callback) {
                $scope.loadingPromise = trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, "get")
                    .then(function(data) {
                        if (angular.isFunction(callback)) {
                            callback(data);
                        } else {
                            $scope.items = data.DATA;
                        }
                    });
            }
            //点击模板请求
            $scope.websiteTemplateFn = function() {
                $scope.list.TEMPID = $scope.list.TEMPNAME.value;
            };

            function template(channelid) {
                var deferred = $q.defer();
                var params = {
                    "serviceid": "mlf_websiteconfig",
                    "methodname": "getOptionalTemplates",
                    "ObjectType": "101",
                    "ObjectId": channelid,
                    "TEMPLATETYPE": "2",
                    "DocTemp": true
                };
                $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                    var templateJson = data.DATA;
                    var channel = [];
                    channel.push({
                        name: "请选择模板",
                        value: 0,
                    });
                    for (var key in templateJson) {
                        channel.push({
                            name: templateJson[key].TEMPNAME,
                            value: parseInt(templateJson[key].TEMPID),
                        });
                        if (templateJson[key].DEFAULTTEMP == 1 && !$stateParams.chnldocid) {
                            $scope.list.TEMPNAME = {
                                name: templateJson[key].TEMPNAME,
                                value: templateJson[key].TEMPID
                            };
                        }
                    }
                    $scope.templateJson = channel;
                    deferred.resolve($scope.templateJson);
                });
                return deferred.promise;
            }

            //锚点定位
            $scope.goto = function(id) {
                $location.hash(id);
                $anchorScroll();
            };

            //时间轴测试数据
            $scope.timelineTestData = {
                day: new Date(),
                time: new Date()
            };

            //组装关键词为数组开始
            $scope.delete = function(record) {
                $scope.list.KEYWORDS.splice(record, 1);
            };
            // $scope.chooseFile = function() {
            //     if ($scope.status.tempAppendix === null) return;
            //     $scope.loadingPromise = uploadAudioVideoService.uploadVoiceOrVideo([$scope.status.tempAppendix])
            //         .then(function(data) {
            //             $scope.list.AUDIOVIDEO.push(data[0].masId);
            //             $scope.status.audioVideoidsArray.push({ id: data[0].masId });
            //             delete $scope.status.tempAppendix;
            //         });
            // };
            /**
             * [initUploadMasFn description]上传音视频
             * @return {[type]} [description]
             */
            function initUploadMasFn() {
                $scope.uploadMasCallBack = {
                    success: function(file, src, uploader) {
                        uploadAudioVideoService.submit(src).then(function(data) {
                            $scope.status.uploadMasProgress = '100%';
                            $scope.status.uploadMasNow = false;
                            $scope.list.AUDIOVIDEO.push(data.masId);
                            $scope.status.audioVideoidsArray.push({ id: data.masId });
                            delete $scope.status.tempAppendix;
                        });
                    },
                    error: function(file) {},
                    file: function(file, uploader) {
                        uploader.upload();
                    },
                    tar: function(file, percentage) {
                        var per = Math.ceil(percentage * 90) + "%";
                        $timeout(function() {
                            $scope.status.uploadMasProgress = per;
                            $scope.status.uploadMasNow = true;
                        });
                    },
                    comp: function(file) {}
                };
            }
            /**
             * [getAudioVideoPlayer description]获得音视频播放地址
             * @param  {[obj]} item  [description]视频信息
             * @return {[type]}      [description]
             */
            $scope.getAudioVideoPlayer = function(item) {
                uploadAudioVideoService.getPlayerById(item.id).then(function(data) {
                    if (angular.isDefined(data.err)) {
                        $timeout(function() {
                            $scope.getAudioVideoPlayer(item); //刷到视频上传成功为止
                        }, 10000);
                    }
                    item.value = data;
                });
            };
            /**
             * [deleteAudioVideo description]删除音视频
             * @param  {[obj]} item  [description]要删除的音视频
             * @return {[type]}      [description]
             */
            $scope.deleteAudioVideo = function(item) {
                trsconfirm.confirmModel("删除音视频", "确定要删除选中的音/视频？", function() {
                    for (var i = 0; i < $scope.list.AUDIOVIDEO.length; i++) {
                        if (item.id === $scope.list.AUDIOVIDEO[i]) {
                            $scope.list.AUDIOVIDEO.splice(i, 1);
                            break;
                        }
                    }
                    for (var j = 0; j < $scope.status.audioVideoidsArray.length; j++) {
                        if (item.id === $scope.status.audioVideoidsArray[j].id) {
                            $scope.status.audioVideoidsArray.splice(i, 1);
                            break;
                        }
                    }
                });
            };
            /**
             * [downloadAudioVideo description]下载音视频
             * @param  {[str]} id  [description]要下载的音视频id
             * @return {[type]}    [description]
             */
            $scope.downloadAudioVideo = function(id) {
                uploadAudioVideoService.download(id);
            };
            //点击隐藏副标题
            $scope.subTitleHide = function() {
                $scope.status.isSubTitleShow = false;
                $scope.status.hideOrMoreText = false;
            };

            //点击显示副标题
            $scope.subTitleShow = function() {
                $scope.status.isSubTitleShow = true;
                $scope.status.hideOrMoreText = true;
            };
            //不发稿费选择按钮
            $scope.draftPayment = function() {
                $scope.list.ISNOPAYMENT === '1' ? $scope.list.ISNOPAYMENT = '0' : $scope.list.ISNOPAYMENT = '1';
            };
            //显示关联阅读延展
            $scope.selectRelated = function() {
                $scope.status.showRelated = !$scope.status.showRelated;
                $scope.status.relatedContent = !$scope.status.relatedContent;
            };

            //初始化关键词
            function initKeyWords() {
                if (angular.isDefined($scope.list.KEYWORDS) && $scope.list.KEYWORDS !== "") {
                    var KEYWORDS = $scope.list.KEYWORDS.split(";");
                    $scope.data.KEYWORDS = [];
                    angular.forEach(KEYWORDS, function(data, index, array) {
                        $scope.data.KEYWORDS.push({
                            "name": data
                        });
                    });
                } else {
                    $scope.data.KEYWORDS = [];
                }
            }

            //选择栏目
            $scope.chooseChannel = function() {
                if ($scope.status.position == 2) return;
                websiteService.singleChooseChnl("栏目选择", $stateParams.siteid, "", function(data_1) {
                    $scope.getChannelParams = {
                        "serviceid": "mlf_mediasite",
                        "methodname": "getChannelPathAndId",
                        "ChannelId": data_1.channelid,
                        "Burster": ">"
                    };
                    $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.getChannelParams, "get").then(function(data_2) {
                        $scope.CHANNEL = data_2[0].CHANNELPATH;
                        $scope.list.CHANNELID = data_2[0].CHANNELID;
                        template($scope.list.CHANNELID);
                        moveDarft();
                    }, function(data) {});
                });
            };

            //内容拓展
            $scope.contentExpansion = function() {
                websiteService.contentExpansion($scope.list, function(data) {
                    $scope.list.ADDITIONALTEXTTOP = data.AdditionalTextTop;
                    $scope.list.ADDITIONALTEXTBOTTOM = data.AdditionalTextBottom;
                    $scope.list.ADDITIONALTEXTLEFT = data.AdditionalTextLeft;
                    $scope.list.ADDITIONALTEXTRIGHT = data.AdditionalTextRight;
                });
            };


            function getKeyWords() {
                $scope.list.KEYWORDS = "";
                angular.forEach($scope.data.KEYWORDS, function(data, index, array) {
                    if (index != ($scope.data.KEYWORDS.length - 1)) {
                        $scope.list.KEYWORDS += data.name + ";";
                    } else {
                        $scope.list.KEYWORDS += data.name;
                    }
                });
            }

            //可视化选择弹窗
            $scope.visualChooseWindow = function() {
                trsSelectDocumentService.trsSelectDocument({
                    siteid: $scope.status.siteid,
                    relNewsData: angular.copy($scope.data.relNewsSelectedItems),
                    position: $stateParams.status,
                    showMetadaId: true
                }, function(result) {
                    angular.forEach(result, function(value, key) {
                        value.METADATAID = value.metadataId;
                        value.TITLE = value.title;
                    });
                    $scope.data.relNewsSelectedItems = result;
                });
            };

            //删除相关新闻
            $scope.relNesDelete = function(curIndex) {
                $scope.data.relNewsSelectedItems.splice($scope.data.relNewsSelectedItems.indexOf(curIndex), 1);
            };

            /*点击保存*/
            $scope.webCompileSave = function() {
                save(true).then(function() {
                    getVersion($scope.list.METADATAID);
                    if (angular.isDefined($stateParams.chnldocid)) {
                        var params = {
                            "serviceid": "mlf_website",
                            "methodname": "getNewsDoc",
                            "ChnlDocId": $stateParams.chnldocid,
                            "ChannelId": $stateParams.channelid,
                            "SiteId": $stateParams.siteid,
                            "MetaDataId": $stateParams.metadataid
                        };
                        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                            var ue = UE.getEditor('ueditor');
                            ue.ready(function() {
                                ue.setContent(data.HTMLCONTENT.replace(/<trs_page_separator pagetitle="" firstpagetitle=""><\/trs_page_separator>/g, '<hr ispageseparator="true"/>'));
                                $scope.data.initContent = ue.getContent();
                                ueditorService.saveToLocal($scope.list.METADATAID);
                                // $scope.newsForm.$setPristine();
                                editcenterRightsService.getRightsofBigFace($stateParams.siteid, 'website.trace').then(function(data) {
                                    $scope.status.bigFaceRights = data;
                                    $scope.status.isHasBigFace = true;
                                });
                            });
                            $scope.data.relNewsSelectedItems = angular.isDefined(data.RELATEDNEWS) ? data.RELATEDNEWS : [];
                            reWriteAttachFile(data);
                        });
                    }
                })
            };
            /*保存并送审*/
            $scope.webCompileSend = function() {
                save().then(function(data) {
                    $scope.params.serviceid = "mlf_websiteoper";
                    $scope.params.methodname = "trialMetaDatas";
                    $scope.params.CurrChnlId = $stateParams.channelid;
                    saveSend();
                });
            };

            /*待编平台直接签发*/
            $scope.webCompileSignDirect = function() {
                save().then(function(data) {
                    $scope.params.serviceid = "mlf_websiteoper";
                    $scope.params.methodname = "webDaiBianPublish";
                    singDirect();
                });
            };

            /*待编平台定时签发*/
            $scope.webCompileSignTiming = function() {
                save().then(function(data) {
                    singTiming();
                });
            };
            /*待审平台直接签发*/
            $scope.webPendingSignDirect = function() {
                save().then(function(data) {
                    $scope.params.serviceid = "mlf_websiteoper";
                    $scope.params.methodname = "webDaiShenPublish";
                    singDirect();
                });
            };
            /*待审平台定时签发*/
            $scope.webPendingSignTiming = function() {
                save().then(function(data) {
                    singTiming();
                });
            };
            /*待审平台退稿*/
            $scope.webPendingKill = function() {
                save().then(function(data) {
                    $scope.params.methodname = "rejectionMetaDatas";
                    rejection();
                });
            };
            /*已签发平台保存并发布*/
            $scope.webSignPublish = function() {
                save().then(function(data) {
                    $scope.params.serviceid = "mlf_websiteoper";
                    $scope.params.methodname = "webYiQianPublish";
                    singDirect();
                });
            };
            /**
             * [close description]页面关闭
             * @return {[type]} [description]
             */
            $scope.close = function() {
                editingCenterService.closeWinow($scope.newsForm.$dirty, ueditorService.contentTranscoding($scope.list) != ueditorService.bindContent()).then(function() {
                    save().then(function() {
                        storageListenerService.addListenerToWebsite("save");
                        editIsLock.normalLock($stateParams.metadataid).then(function(data) {
                            $window.close();
                        });
                    });
                }, function() {
                    angular.isDefined($stateParams.metadataid) ?
                        editIsLock.normalLock($stateParams.metadataid).then(function(data) {
                            $window.close();
                        }) : $window.close();
                });
            };
            //浏览器关闭
            $window.onunload = onbeforeunload_handler;

            function onbeforeunload_handler() {
                editIsLock.normalLock($stateParams.metadataid).then(function(data) {
                    $window.close();
                });
            }

            /*预览*/
            $scope.preview = function() {
                save().then(function(data) {
                    preview();
                });
            };
            //保存预览
            function preview() {
                editingCenterService.draftPublish($stateParams.chnldocid);
            }

            function save(flag) { //flag用于调用保存服务后是否弹出成功窗口判断
                saveContent($scope.list); //获取编辑器内容
                var deferred = $q.defer();
                $validation.validate($scope.newsForm.authorForm);
                $validation.validate($scope.newsForm)
                    .success(function() {
                        ueditorService.saveToLocal($scope.list.METADATAID);
                        $scope.newsForm.$setPristine();
                        var list = dealAttribute();
                        $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do",
                            list, "post").then(function(data) {
                            dealWithDataAfterSave(data, flag);
                            deferred.resolve(data);
                        }, function(data) {
                            $scope.status.openBtn = true;
                            deferred.reject(data);
                        });

                    }).error(function() {
                        $scope.showAllTips = true;
                        editingCenterService.checkSaveError($scope.newsForm);
                        trsconfirm.saveModel("提交失败", "请检查填写项", "error");
                    });
                return deferred.promise;
            }
            /**
             * [examAttachFile description]检测attachFile字段,存在为空的字段删除
             * @return {[type]} [description]
             */
            function examAttachFile() {
                if ($scope.list.ATTACHFILE === "") return;
                angular.forEach($scope.list.ATTACHFILE, function(value, key) {
                    if (value.appFile === "") {
                        $scope.list.ATTACHFILE.splice($scope.list.ATTACHFILE.indexOf(value), 1);
                    }
                });
            }
            /*保存送审函数*/
            function saveSend() {
                trsconfirm.inputModel("送审", "确定送审吗？", function(content) {
                    $scope.params.Opinion = content;
                    $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "post").then(function(dataC) {
                        trsconfirm.alertType("送审成功", "", "success", false,
                            function() {
                                storageListenerService.addListenerToWebsite("send");
                                $window.close();
                            });
                    });
                });
            }

            /*直接签发函数*/
            function singDirect() {
                trsconfirm.confirmModel('签发', '确认发布稿件', function() {
                    $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "post").then(function(dataC) {
                        trsconfirm.alertType("直接签发成功", "", "success", false,
                            function() {
                                storageListenerService.addListenerToWebsite("directSign");
                                $window.close();
                            });
                    });
                });
            }

            /*定时签发函数*/
            function singTiming() {
                var methodname = ['webDaiBianTimingPublish', 'webDaiShenTimingPublish'];
                var params = {
                    selectedArray: [$scope.list],
                    isNewDraft: true,
                    methodname: methodname[$stateParams.status]
                };
                editingCenterService.draftTimeSinged(params).then(function(data) {
                    trsconfirm.alertType("定时签发成功", "", "success", false, function() {
                        storageListenerService.addListenerToWebsite("timeSign");
                        $window.close();
                    });
                });
            }

            //退稿函数
            function rejection() {
                trsconfirm.inputModel('是否确认撤稿', '撤稿原因(可选)', function(content) {
                    $scope.params.Opinion = content;
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function() {
                        trsconfirm.alertType('撤稿成功', '', "success", false, function() {
                            storageListenerService.addListenerToWebsite("reject");
                            $window.close();
                        });
                    });
                });
            }
            //初始化底部功能按钮
            function initBtnArray() {
                //所需权限初始化
                $scope.webSiteBtns = initWebsiteNewsService.initWebSitedBtns()[$stateParams.status];
                //查询权限方法
                $scope.methodArrary = ['web.daibian', 'web.daishen', 'web.yiqianfa'];
                initeditctrBtnsService.initWebsiteData($stateParams.channelid, $scope.methodArrary[$stateParams.status]).then(function(data) {
                    $scope.dictionaryBtn = [websiteBtnService.initWebCompBtn(), websiteBtnService.initWebPenBtn(), websiteBtnService.initSingBtn()];
                    $scope.btnStatus = initeditctrBtnsService.initBtns(data, $scope.dictionaryBtn[$stateParams.status]);
                    $scope.arrayBtn = filterEditctrBtnsService.filterBtn($scope.btnStatus, $scope.webSiteBtns);
                    addBtn();
                });
            }
            //新增预览与关闭按钮
            function addBtn() {
                var OPERDESC = ['保存', '保存', '保存并发布'];
                var OPERFUN = ['webCompileSave', 'webCompileSave', 'webSignPublish'];
                $scope.arrayBtn.unshift({
                    RIGHTINDEX: "save",
                    OPERDESC: OPERDESC[$stateParams.status],
                    OPERNAME: "",
                    OPERFUN: OPERFUN[$stateParams.status]
                });
                $scope.arrayBtn.push({
                    RIGHTINDEX: "close",
                    OPERDESC: "关闭",
                    OPERNAME: "",
                    OPERFUN: "close"
                });
            }
            /**
             * [politicalCommonSense description]正文政治常识校验
             * @return {[type]} [description]
             */
            $scope.politicalCommonSense = function() {
                editingCenterService.checkoutDraft(ueditorService.bindContent()).then(function(data) {
                    if (data.content[0].resultInfo.length > 0) {
                        var ue = UE.getEditor('ueditor');
                        ue.setContent(ueditorService.handlingSensitiveInf(data, ue.getContent()));
                    }
                });
            };
            //动态加载指令
            function loadDirective() {
                LazyLoad.js(["./lib/ueditor2/ueditor.config.js?v=7.0", "./lib/ueditor2/ueditor.all.js?v=7.0"], function() {
                    $scope.status.docTypeToUeditor = "website";
                    var ueditor = '<ueditor versionid="data.lastVersionid" type="{{status.docTypeToUeditor}}" list="list"></ueditor>';
                    // $scope.button = { title: "政治常识校对", name: "polComSense" };
                    // var ueditor = '<ueditor custom-button-fn="politicalCommonSense()" custom-button="button" versionid="data.lastVersionid" list="list"></ueditor>';
                    ueditor = $compile(ueditor)($scope);
                    $($(angular.element(document)).find('ueditorLocation')).append(ueditor);
                    var ue = UE.getEditor('ueditor');
                    $scope.status.support.content = $scope.list.CONTENT;
                    ue.ready(function() {
                        ue.addListener("keydown", function(type, event) {
                            if (event.keyCode === 13) {
                                $scope.status.support.content = ue.getContentTxt();
                            }
                        });

                    });
                    var supportCreation = '<support-creation></support-creation>';
                    supportCreation = $compile(supportCreation)($scope);
                    $($(angular.element(document)).find('supportcreation')).append(supportCreation);
                });
                var draftList = '<editor-dir meta-data-id="{{list.METADATAID}}" editor-json="list.FGD_EDITINFO" show-all-tips="showAllTips" editor-form="newsForm"></editor-dir>' +
                    '<editor-auth-dir author="list.FGD_AUTHINFO"></editor-auth-dir>';
                draftList = $compile(draftList)($scope);
                $($(angular.element(document)).find('editor')).append(draftList);
            }
            /**
             * [getVersion description]获取流程版本与操作日志
             * @return {[type]} [description]
             */
            function getVersion(id) {
                var deferred = $q.defer();
                var metadataid = angular.isDefined(id) ? id : $stateParams.metadataid;
                editingCenterService.getEditVersionTime(metadataid, $scope.page, $scope.data.copyVersion).then(function(data) {
                    $scope.data.version = data;
                    $scope.page = data.page;
                    $scope.data.copyVersion = data.copyArray;
                    $scope.status.hasTimeline = true;
                    $scope.data.lastVersionid = data.lastVersionid;
                    deferred.resolve();
                });
                return deferred.promise;
            }
            /**
             * [getLoadMore description]操作日志加载更多
             * @return {[type]} [description]
             */
            $scope.getLoadMore = function() {
                $scope.page.CURRPAGE++;
                getVersion();
            };
            /**
             * [getComment description]获取评审意见
             * @return {[type]} [description]
             */
            function getComment(id, currPage) {
                editingCenterService.getComment(id, currPage).then(function(data) {
                    $scope.data.comment['comment'] = $scope.data.comment['comment'].concat(data.comment);
                    $scope.data.comment.hasMore = data.hasMore;
                    for (var i in data.voiceObj) {
                        $scope.data.comment.voiceObj[i] = data.voiceObj[i];
                    }
                })
            }
            /**
             * [getComment description]获取评审意见
             * @return {[type]} [description]
             */
            $scope.getLoadMoreComment = function() {
                $scope.data.comment.currPage += 1;
                getComment($stateParams.metadataid, $scope.data.comment.currPage);
            };
            /**
             * [trustUrl description]信任url
             */
            $scope.trustUrl = $sce.trustAsResourceUrl;
            /**
             * [filterTime description]时间过滤
             * @return {[type]} [description]
             */
            function filterTime() {
                if (angular.isObject($scope.list.CUSTOMTIME)) {
                    $scope.list.CUSTOMTIME = $filter('date')($scope.list.CUSTOMTIME, "yyyy-MM-dd HH:mm").toString();
                }
            }
            //根据栏目ID获取栏目名称
            function getChannel() {
                var params = {
                    "serviceid": "mlf_mediasite",
                    "methodname": "getChannelPath",
                    "ChannelId": $stateParams.channelid,
                    "Burster": ">"
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.CHANNEL = data.replace(/\"/g, "");
                });
            }
            //编辑中，初始化处理图片或者附件
            function doWithPicsOrAttach(array) {
                //处理READINGPICS字段为空数组的情况，防止相关图片框消失。
                if (array.length === 0) {
                    array = [{
                        APPFILE: "",
                        APPDESC: ""
                    }];
                }
                return array;
            }
            /**
             * [saveContent description]获取编辑器内容
             * @return {[type]} [description]
             */
            function saveContent(list) {
                ueditorService.saveContent(list);
            }
            /**
             * [dealAttribute description]处理保存时对象属性问题
             * @return {[type]} [description]
             */
            function dealAttribute() {
                saveAttachFile();
                examAttachFile();
                filterTime();
                getKeyWords();
                $scope.status.openBtn = false;
                $scope.list.RELATEDNEWS = trsspliceString.spliceString($scope.data.relNewsSelectedItems, 'METADATAID', ",");
                var list = angular.copy($scope.list);
                //标题回车处理成</br> 存入数据库里
                list.TITLE = list.TITLE.split("\n").join("<br />");
                //处理相关图片数组，删除APPFILE属性值为空的对象元素。
                list.OUTLINEPICS = angular.copy(jsonArrayToStringService.clearEmptyObjects(list.OUTLINEPICS, "APPFILE"));
                //原始标签
                list.OLDTAGIDS = $scope.data.tag.originalTag.join(',');
                //如果编辑过就传编辑后的内容，没有的话与原始标签一样
                list.TAGIDS = $scope.data.tag.hasChoose ? angular.copy($scope.data.tag.selectTag).join(',') : angular.copy(list.OLDTAGIDS);
                //稿件归属人
                list.OWNER = $scope.data.ownerSelectedItems;
                //将音视频数组转成ID串
                list.AUDIOVIDEO = list.AUDIOVIDEO.join(",");
                //删除多余字段开始
                delete list.RELEVANTNEWS;
                delete list.RELEVANTOFFICIALS;
                delete list.OBJ_VERSION;
                delete list.LOG_OPERATION;
                delete list.CRDEPT;
                //删除多余字段结束
                //处理发稿单作者信息空数据提交问题
                if (angular.isDefined(list.FGD_AUTHINFO[0]) && (!angular.isDefined(list.FGD_AUTHINFO[0].USERNAME) || list.FGD_AUTHINFO[0].USERNAME === "")) {
                    list.FGD_AUTHINFO = [];
                }
                //处理发稿单作者信息空数据提交问题
                //JSON对象数组转字符串
                list = jsonArrayToStringService.jsonArrayToString(list);
                list.serviceid = "mlf_website";
                list.methodname = "saveImgTextDoc";
                return list;
            }
            /**
             * [dealWithDataAfterSave description]保存之后处理数据
             * @param  {[obj]} data [description]保存后返回的数据
             * @param  {[boolean]} flag [description]标识
             * @return {[type]}      [description]
             */
            function dealWithDataAfterSave(data, flag) {
                $scope.status.openBtn = true;
                //再次初始化标签相关的属性
                $scope.list.METADATAID = data.METADATAID;
                $scope.list.CHNLDOCID = data.CHNLDOCID;
                $stateParams.metadataid = angular.isDefined($stateParams.metadataid) ? $stateParams.metadataid : data.METADATAID;
                $stateParams.chnldocid = angular.isDefined($stateParams.chnldocid) ? $stateParams.chnldocid : data.CHNLDOCID;
                $stateParams.channelid = angular.isDefined($stateParams.channelid) ? $stateParams.channelid : $scope.list.CHANNELID;
                initTagAfterSave();
                if (flag) {
                    storageListenerService.addListenerToWebsite("save");
                    $state.transitionTo($state.current, $stateParams, {
                        reload: false
                    });
                    trsconfirm.saveModel("保存成功", "", "success");
                } else {
                    $scope.params = {
                        MetaDataIds: $stateParams.metadataid,
                        CHNLDOCIDS: $stateParams.chnldocid,
                        ObjectIds: $stateParams.chnldocid,
                        ChannelId: $stateParams.channelid,
                        serviceid: "mlf_websiteoper"
                    };
                }
            }
            /**
             * [getKeywordsOrAbstract description]提取关键词或摘要
             * @param  {[str]} type [description]关键词类型或摘要
             * @return {[type]}      [description]
             */
            $scope.getKeywordsOrAbstract = function(type) {
                editingCenterService.getKeywordsOrAbstract(type, ueditorService.bindContent()).then(function(data) {
                    if (type === "keywords") {
                        if (data !== '""') {
                            var arr = [];
                            var keywordsArray = data.substring(1, data.length - 1).split(";");
                            angular.forEach(keywordsArray, function(value, key) {
                                arr.push({
                                    name: value,
                                });
                            });
                            $scope.data.KEYWORDS = $scope.data.KEYWORDS.concat(arr);
                            $scope.data.KEYWORDS = $filter('unique')($scope.data.KEYWORDS, "name");
                        } else {
                            return;
                        }
                    }
                    if (type === "abstract")
                        $scope.list.ABSTRACT = data.substring(1, data.length - 1);
                }, function(data) {

                });
            };
            /**********************************************附件上传开始**********************************************/
            /**
             * [selectFiles description]选择文件
             * @param  {[type]} files    [description]所有文件
             * @param  {[type]} file     [description]
             * @param  {[type]} newFiles [description]新增的文件
             * @return {[type]}          [description]
             */
            $scope.selectFiles = function(files, file, newFiles) {
                $scope.status.isUploaderFile = true;
                angular.forEach(newFiles, function(value, key) {
                    $scope.status.showFiles.push({
                        SRCFILE: newFiles[key].name,
                        APPDESC: newFiles[key].name,
                        FILEINFO: "等待上传",
                        FILE: newFiles[key],
                    });
                });
            };
            /**
             * [getAttachFile description]为ATTACHFILE重新复制，可更改
             * @return {[type]} [description]null
             */
            function saveAttachFile() {
                $scope.list.ATTACHFILE = [];
                angular.forEach($scope.status.showFiles, function(value, key) {
                    if (value.FILEINFO === '上传成功') {
                        delete value.FILE;
                        $scope.list.ATTACHFILE.push(value);
                    }
                });
            }

            function reWriteAttachFile(data) {
                $scope.status.showFiles = angular.copy(data.ATTACHFILE);
                angular.forEach($scope.status.showFiles, function(value, key) {
                    value.FILEINFO = "上传成功";
                });
            }
            /**
             * [clearAllKeywords description]清空关键词
             * @return {[type]} [description]
             */
            $scope.clearAllKeywords = function() {
                $scope.data.KEYWORDS = [];
            };
            /**
             * [fileSubmit description]附件提交
             * @return {[type]} [description]
             */
            $scope.fileSubmit = function() {
                if (angular.isUndefined($scope.newsForm.$error.filename)) {
                    if ($scope.status.showFiles) {
                        angular.forEach($scope.status.showFiles, function(file, key) {
                            if (file.FILEINFO === '等待上传') {
                                Upload.upload({
                                    url: "/wcm/openapi/uploadImage",
                                    data: {
                                        file: file.FILE
                                    },
                                }).then(function(resp) {
                                    if (resp.data.success) {
                                        file.FILEINFO = '上传成功';
                                        file.APPFILE = resp.data.imgName;
                                    } else {
                                        file.FILEINFO = resp.data.error;
                                    }
                                }, function(resp) {

                                }, function(evt) {
                                    // file.progressPercentage = parseInt(100.0 * evt.loaded / evt.total) + '%';
                                    file.FILEINFO = "上传中";
                                });
                                $scope.status.isUploaderFile = false;
                            }
                        });
                    }
                } else {
                    trsconfirm.saveModel("附件上传失败", "附件填写有误", "error");
                }
            };
            /**
             * [removeCurFile description]移除当前附件
             * @param  {[obj]} file  [description]被选中的附件
             * @param  {[num]} index [description]附件下标
             * @return {[type]}       [description]
             */
            $scope.removeCurFile = function(file, index) {
                $scope.status.showFiles.splice($scope.status.showFiles.indexOf(file), 1);
            };
            /**********************************************附件上传结束*************************************************/
            /*******************************************新闻稿图片相关操作**********************************************/
            /**
             * [addUploaderImg description]导读，概览图片上传
             * @param {[type]} array [description]
             */
            $scope.addUploaderImg = function(array, type) {
                if (array.length > 9) {
                    trsconfirm.alertType(type + "最多支持10张", "", "error", false);
                    return;
                }
                array.push({
                    "APPFILE": "",
                    "APPDESC": "",
                    "PERPICURL": "",
                });
            };
            /**
             * [deleteImgContainer description]删除图片容器
             * @param  {[obj]} item  [description]要删除的某项
             * @param  {[obj]} array [description]要删除的图片数组
             * @return {[type]}       [description]null
             */
            $scope.deleteImgContainer = function(item, array) {
                array.splice(array.indexOf(item), 1);
            };
            /**
             * [getCurrentLoginUser description]获取当前用户
             * @return {[type]} [description]
             */
            function getCurrentLoginUser() {
                var deferred = $q.defer();
                var userParams = {
                    serviceid: "mlf_extuser",
                    methodname: "findUserInfo"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), userParams, "post").
                then(function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
            /**
             * [queryRelatedNewsByKeyWords description] 查询相关新闻
             * @return {[type]} [description]
             */
            $scope.queryRelatedNewsByKeyWords = function() {
                var DocId = $stateParams.metadataid ? $stateParams.metadataid : 0;
                var keywords = [];
                keywords = trsspliceString.spliceString(angular.copy($scope.data.KEYWORDS), "name", ";");
                var params = {
                    serviceid: "mlf_website",
                    methodname: "queryRelatedNewsByKeyWords",
                    MetaDataId: DocId,
                    ChannelId: $stateParams.channelid,
                    KeyWords: keywords
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").
                then(function(data) {
                    var ralNewsLen = angular.copy($scope.data.relNewsSelectedItems).length;
                    if (ralNewsLen >= 5) return;
                    $scope.data.relNewsSelectedItems = darftRemove($scope.data.relNewsSelectedItems, data).splice(0, 5);
                });
            };
            //清空相关联稿件
            $scope.cleanRelatedNews = function() {
                $scope.data.relNewsSelectedItems = [];
            };
            /**
             * [darftRemove description]  数组去重
             * @param  {[type]} selectArray [description]  当前数组
             * @param  {[type]} dataArray   [description]   再次请求出数组
             * @return {[type]}             [description]
             */
            function darftRemove(selectArray, dataArray) {
                var arr = selectArray.concat(dataArray);
                var lastArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (!unique(arr[i].METADATAID, lastArr)) {
                        lastArr.push(arr[i]);
                    }
                }
                return lastArr;
            }

            function unique(n, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (n == arr[i].METADATAID) {
                        return true;
                    }
                }
                return false;
            }
            /**
             * [moveDarft description]稿件移动
             * @return {[type]} [description]
             */
            function moveDarft() {
                if ($stateParams.chnldocid) {
                    var deferred = $q.defer();
                    var params = {
                        "serviceid": "mlf_websiteoper",
                        "methodname": "moveDAIBIANDoc",
                        "SrcChannelId": $stateParams.channelid,
                        "ChnlDocIds": $stateParams.chnldocid,
                        "ToChannelId": $scope.list.CHANNELID
                    };
                    trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                        if (data.ISSUCCESS === 'false') {
                            $scope.status.isDarftMove = false;
                        }
                        storageListenerService.addListenerToWebsite("move");

                    });
                    deferred.resolve();
                    return deferred.promise;
                }
            }
            /**
             * [chooseTag description]选择标签
             * @return {[type]} [description]
             */
            $scope.chooseTag = function() {
                websiteService.subjectModel($stateParams.metadataid, $stateParams.channelid, function(result) {
                    $scope.data.tag.hasChoose = true;
                    $scope.data.tag.selectTag = result.selectedArray;
                });
            };
            /**
             * [chooseTag description]请求当前稿件的标签
             * @return {[type]} [description]
             */
            function getCurrDraftTag() {
                var params = {
                    serviceid: "mlf_tag",
                    methodname: "queryTagsFromViewData",
                    metadataid: $stateParams.metadataid,
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                    angular.forEach(data, function(value, key) {
                        $scope.data.tag.originalTag.push(value.TAGID);
                    });
                });
            }
            /**
             * [initTagAfterSave description]保存之后再次初始化标签需要的属性
             * @return {[type]} [description]
             */
            function initTagAfterSave() {
                $scope.data.tag.originalTag = angular.copy($scope.data.tag.selectTag);
                $scope.data.tag.hasChoose = false;
                $scope.data.tag.selectTag = [];
            }
            /**
             * [chooseAscription description]选择稿件归属人
             */
            $scope.chooseAscription = function() {
                websiteService.ascriptionModel($stateParams.metadataid, function(result) {
                    $scope.data.ownerSelectedItems = result.selectedArray.join(',');
                });
            }
        }
    ]);
