'use strict';
/**
 *  Module 网站图集模板
 *  creatyBy ly
 * Description
 */
var editCallback = null;
var editPhotoCallback = null;
angular.module('websiteAtlasModule', ['util.ueditorForAtlas'])
    .controller('editingCenterWebsiteAtlasCtrl', ["$scope", "$compile", "$filter", "$q", "$window", "$state", "$timeout", "$modal", "$location", "$validation", "localStorageService", "jsonArrayToStringService", "trsResponseHandle", "initeditctrBtnsService", "initVersionService", "initAddMetaDataService", "$stateParams", "$anchorScroll", "trsHttpService", "SweetAlert", "initSingleSelecet", "trsconfirm", "trsspliceString", "editingCenterService", "$sce", "initWebsiteDataService", "websiteService", "filterEditctrBtnsService", "initWebsiteNewsService", "trsSelectDocumentService", "Upload", "websiteBtnService", "iWoService", 'storageListenerService', 'ueditorService', 'editIsLock', 'uploadAudioVideoService',
        function($scope, $compile, $filter, $q, $window, $state, $timeout, $modal, $location, $validation, localStorageService, jsonArrayToStringService, trsResponseHandle, initeditctrBtnsService, initVersionService, initAddMetaDataService, $stateParams, $anchorScroll, trsHttpService, SweetAlert, initSingleSelecet, trsconfirm, trsspliceString, editingCenterService, $sce, initWebsiteDataService, websiteService, filterEditctrBtnsService, initWebsiteNewsService, trsSelectDocumentService, Upload, websiteBtnService, iWoService, storageListenerService, ueditorService, editIsLock, uploadAudioVideoService) {
            initStatus();
            initData();

            function initStatus() {
                $scope.page = {
                    CURRPAGE: 1,
                    PAGESIZE: 20
                };
                $scope.status = {
                    localStorage: {
                        websiteSaved: "",
                        websiteSend: "",
                        websiteClockSign: "",
                        websisteSignDirective: "",
                        websiteRejection: ""
                    },
                    openBtn: true,
                    files: [], //上传附件绑定数组
                    showFiles: [], //附件展示以及上传字段
                    isUploaderFile: false, //上传按钮是否可点击
                    isDarftMove: true, //稿件是否移动
                    siteid: $stateParams.siteid,
                    channelid: $stateParams.channelid,
                    chnldocid: $stateParams.chnldocid,
                    MetaDataId: $stateParams.metadataid,
                    isSubTitleShow: true, //副标题隐藏
                    hasVersionTime: false,
                    isEditDraft: angular.isDefined($stateParams.chnldocid) ? true : false, //是否是编辑稿件说
                    position: $stateParams.status,
                    audioVideoidsArray: [], //播放音视频临时数组
                    uploadMasProgress: 0, //上传的进度
                    uploadMasNow: false,
                    masUploadExtensions: 'mp3,mp4,flv,rmvb,avi', //允许上传的文件类型
                    masUploadMimeTypes: 'audio/mp3,video/mp4,video/flv,video/rmvb,video/avi' //对应的文件种类
                };
                $scope.data = {
                    relNewsSelectedItems: [],
                    SrcName: "",
                    uploaderImgSelected: [],
                    channelParams: {
                        "serviceid": "mlf_mediasite",
                        "methodname": "getChannelPath",
                        "ChannelId": $stateParams.channelid,
                        "Burster": ">"
                    },
                    DocGenre: [],
                    KEYWORDS: [],
                    version: [],
                    copyVersion: [],
                    tag: {
                        hasChoose: false,
                        originalTag: [],
                        selectTag: [],
                    },
                    ownerSelectedItems: '',
                    comment: {
                        comment: [],
                        voiceObj: {},
                        hasMore: false,
                        currPage: 1,
                    },
                };
                $scope.params = {
                    "serviceid": "mlf_website",
                    "methodname": "getPicsDoc",
                    "ChnlDocId": $stateParams.chnldocid,
                    "MetaDataId": $stateParams.metadataid
                };
                $scope.handleBtnClick = function(funname) {
                    eval("$scope." + funname + "()");
                };
                $anchorScroll.yOffset = 55;
                $scope.showAllTips = false; // 初始化错误提示状态为关闭；
            }

            function initData() {
                storageListenerService.removeListener("website");
                $stateParams.chnldocid ? manageEditData() : manageCreateData();
                getChannel();
                //初始化权限按钮
                initBtnArray();
                initUploadMasFn();
            }
            /**
             * [getTemp description]获得模板
             * @return {[type]} [description]
             */
            function getTemp(data) {
                $scope.list.TEMPNAME = {
                    name: data.TEMPNAME.NAME,
                    value: data.TEMPNAME.VALUE
                };
                $scope.list.TEMPID = $scope.list.TEMPNAME.value;
            }
            /**
             * [manageEditData description]处理编辑时初始化数据
             * @param  {[obj]} data [description]编辑请求到的数据
             * @return {[type]}      [description]
             */
            function manageEditData(data) {
                trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
                    $scope.list = data;
                    $scope.list.AUDIOVIDEO = angular.isDefined($scope.list.AUDIOVIDEO) ? $scope.list.AUDIOVIDEO : "";
                    $scope.list.AUDIOVIDEO = $scope.list.AUDIOVIDEO === "" ? [] : $scope.list.AUDIOVIDEO.split(","); //将音视频文件转换为数组格式
                    //将音视频ID存入audioVideoidsArray对象，方便之后渲染
                    angular.forEach($scope.list.AUDIOVIDEO, function(_data, index, array) {
                        $scope.status.audioVideoidsArray.push({ id: _data });
                    });
                    $scope.list.TITLE = $scope.list.TITLE.split("<br />").join("\n");
                    reWriteAttachFile(data);
                    template($stateParams.channelid).then(function(dataC) {
                        angular.isDefined($stateParams.metadataid) ? "" : $scope.websiteTemplate = dataC[0];
                        getTemp(data);
                    });
                    initKeyWords();
                    initDocGenre(data);
                    loadDirective();
                    $scope.data.relNewsSelectedItems = angular.isDefined(data.RELATEDNEWS) ? data.RELATEDNEWS : [];
                    //初始化处理概览图片,仅编辑时生效
                    $scope.list.OUTLINEPICS = doWithPicsOrAttach($scope.list.OUTLINEPICS);
                    //初始化责任编辑
                    getCurrentLoginUser().then(function(name) {
                        $scope.list.EDITORTRUENAME = $scope.list.EDITORTRUENAME ? $scope.list.EDITORTRUENAME : name[0].TRUENAME;
                    });
                    //稿件加锁
                    $timeout(function() {
                        editIsLock.lockDraft($stateParams.metadataid);
                    }, 1700);
                });
                getVersion();
                //请求这个稿件的标签
                getCurrDraftTag();
                //获取评审意见
                getComment($stateParams.metadataid, $scope.data.comment.currPage);
            }
            /**
             * [manageCreateData description]初始化新建稿件相关数据
             * @return {[type]} [description]
             */
            function manageCreateData() {
                $scope.list = initWebsiteDataService.initAtlas();
                $scope.list.CHANNELID = $stateParams.channelid;
                $scope.list.AUDIOVIDEO = []; //将音视频文件转换为数组格式
                template($stateParams.channelid).then(function(data) {
                    angular.isDefined($stateParams.metadataid) ? "" : $scope.websiteTemplate = data[0];
                    $scope.list.TEMPID = $scope.list.TEMPNAME.value;
                });
                initKeyWords();
                initDocGenre();
                loadDirective();
                getCurrentLoginUser().then(function(data) {
                    $scope.list.EDITORTRUENAME = data[0].TRUENAME;
                });
            }
            /**
             * [initDocGenre description]初始化稿件体裁
             * @return {[type]} [description]
             */
            function initDocGenre(obj) {
                iWoService.initData().then(function(data) {
                    $scope.data.DocGenre = data.DocGenre;
                    $scope.list.DOCGENRE = angular.isDefined(obj) ? obj.DOCGENRE : angular.copy($scope.data.DocGenre[0]);
                });
            }
            //初始化函数
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
            //上传音频视频
            /*$scope.uploadAudioVideo = function() {
                ueditorService.insertVideo(function() {
                    var audioVideoArray = localStorageService.get("page.video");
                    $scope.list.AUDIOVIDEO = decodeURIComponent(trsspliceString.spliceString(audioVideoArray, "playUrl", ","));
                    $scope.atlasForm.$dirty = true;
                    localStorageService.remove("page.video");
                    localStorageService.remove("ue.video");
                });
                //var audioVideoArray = localStorageService.get("page.video");
            };*/
            // $scope.chooseFile = function() {
            //     if ($scope.status.tempAppendix === null) return;
            //     $scope.uploadPromise = uploadAudioVideoService.uploadVoiceOrVideo([$scope.status.tempAppendix])
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
             * @param  {[obj]} item  [description]音视频信息
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
             * @param  {[str]} id  [description]音视频id
             * @return {[type]}    [description]
             */
            $scope.downloadAudioVideo = function(id) {
                uploadAudioVideoService.download(id);
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
            /**
             * [moveUploadImg description]图集上传图片列表拖拽
             * @param  {[type]} index [description]
             * @return {[type]}       [description]
             */
            $scope.moveUploadImg = function(index) {
                $scope.list.DOC_PICTURELIST.splice(index, 1);
            };
            /**
             * [reWritePic description]保存后图片回写，目的是将上传图片的临时路径改为正式路径
             * @param  {[type]} data [description]保存后的返回值
             * @return {[type]}      [description]
             */
            function reWritePic(data) {
                var arrayDocPic = [];
                angular.forEach(data.DOC_PICTURELIST, function(data, index) {
                    arrayDocPic.push({
                        "APPFILE": data.APPFILE,
                        "APPDESC": data.APPDESC,
                        'PERPICURL': data.PERPICURL,
                        'APPENDIXID': data.APPENDIXID
                    });
                });
                $scope.list.DOC_PICTURELIST = arrayDocPic;
            }
            //获取关键词开始
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
            /**
             * [examAttachFile description]检测附件字段
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
            $scope.websiteTemplateFn = function() {
                $scope.list.TEMPID = $scope.list.TEMPNAME.value;
            };
            //副标题显示隐藏
            $scope.subTitleShow = function() {
                $scope.status.isSubTitleShow = !$scope.status.isSubTitleShow;
            };
            //锚点切换开始
            $scope.goto = function(id) {
                $location.hash(id);
                $anchorScroll();
            };
            //是否原创稿
            $scope.oringin = function(list) {
                $scope.atlasForm.$dirty = true;
                list.ORIGINAL = list.ORIGINAL === '1' ? '0' : '1';
                if (angular.isUndefined($stateParams.chnldocid) && list.ORIGINAL === '1') {
                    list.ISNOPAYMENT = '0'; //判断为原创稿的话需要默认发稿费  
                }
            };
            //初始化关键词开始
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
                    $scope.list.CHANNELID = data_1.channelid;
                    trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.getChannelParams, "get").then(function(data_2) {
                        $scope.CHANNEL = data_2[0].CHANNELPATH;
                        $scope.list.CHANNELID = data_2[0].CHANNELID;
                        template($scope.list.CHANNELID);
                        moveDarft();
                    });
                });
            };

            /**
             * [calculateWordNum description]计算图集稿字数
             * @return {[type]} [description]
             */
            function calculateWordNum(list) {
                var len = 0;
                angular.forEach($scope.list.DOC_PICTURELIST, function(value, key) {
                    if (angular.isDefined(value.APPDESC)) {
                        len += value.APPDESC.length;
                    }
                });
                list.DOCWORDSCOUNT += len;
            }
            /**
             * [manageDataBeforeSave description]保存前保存数据处理
             * @return {[type]} [description]
             */
            function manageDataBeforeSave() {
                $scope.status.openBtn = false;
                examAttachFile();
                saveAttachFile();
                $scope.atlasForm.$setPristine();
                //获取关键词开始
                getKeyWords();
                if (angular.isObject($scope.list.CUSTOMTIME)) {
                    $scope.list.CUSTOMTIME = $filter('date')($scope.list.CUSTOMTIME, "yyyy-MM-dd HH:mm").toString();
                }
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
                calculateWordNum(list);
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
                list.methodname = "saveAtlasDoc";
                return list;
            }
            /**
             * [manageDataAfterSave description]保存后保存数据处理
             * @param  {[type]} data [description]
             * @param  {[type]} flag [description]
             * @return {[type]}      [description]
             */
            function manageDataAfterSave(data, flag) {
                $scope.status.openBtn = true;
                //把最后结果标签赋值给原标签
                $scope.list.METADATAID = data.METADATAID;
                $scope.list.CHNLDOCID = data.CHNLDOCID;
                $stateParams.metadataid = angular.isDefined($stateParams.metadataid) ? $stateParams.metadataid : data.METADATAID;
                $stateParams.chnldocid = angular.isDefined($stateParams.chnldocid) ? $stateParams.chnldocid : data.CHNLDOCID;
                $stateParams.channelid = angular.isDefined($stateParams.channelid) ? $stateParams.channelid : $scope.list.CHANNELID;
                $scope.data.tag.originalTag = angular.copy($scope.data.tag.selectTag);
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
                        SERVICEID: "mlf_websiteoper",
                        methodname: "getPicsDoc",
                    };
                }
            }

            function saveContent() {
                ueditorService.saveContent($scope.list);
            }
            /*保存函数*/
            function save(flag) {
                saveContent();
                var deferred = $q.defer();
                var hasImg = examUploaderImg();
                if (hasImg === false) {
                    $scope.atlasForm.$pending = {};
                    // console.log($scope.atlasForm);
                    $validation.validate($scope.atlasForm.authorForm);
                    $validation.validate($scope.atlasForm)
                        .success(function() {
                            $scope.atlasForm.$setPristine();
                            var list = manageDataBeforeSave();
                            trsHttpService.httpServer("/wcm/mlfcenter.do",
                                list, "post").then(function(data) {
                                manageDataAfterSave(data, flag);
                                deferred.resolve(data);
                            }, function(data) {
                                $scope.status.openBtn = true;
                                deferred.reject(data);
                            });
                        }).error(function() {
                            $scope.showAllTips = true;
                            editingCenterService.checkSaveError($scope.atlasForm);
                            trsconfirm.saveModel("保存失败", "请检查填写项", "error");
                        });
                }
                return deferred.promise;
            }


            /************************************图片相关操作开始****************************************************/
            /**
             * [examUploaderImg description]检查图集稿图片
             * @return {[Boolean]} [description]是否可以保存
             */
            function examUploaderImg() {
                var flag = false;
                if ($scope.list.DOC_PICTURELIST.length <= 0) {
                    flag = true;
                    $timeout(function() {
                        trsconfirm.saveModel("提交失败", "图集稿需要上传图片", "error");
                    }, 100);
                }
                return flag;
            }
            //编辑图片
            $scope.editImage = function(image, index) {
                editingCenterService.editUploaderImg(image, function(result) {
                    $scope.list.DOC_PICTURELIST[index].PERPICURL = result.PERPICURL;
                    $scope.list.DOC_PICTURELIST[index].APPFILE = result.APPFILE;
                    // $scope.list.DOC_PICTURELIST[index].APPDESC = result.APPDESC;
                    delete $scope.list.DOC_PICTURELIST[index].APPENDIXID;
                });
            };
            //列表图片单选
            $scope.selectImg = function(item) {
                if ($scope.data.uploaderImgSelected.indexOf(item) < 0) {
                    $scope.data.uploaderImgSelected.push(item);
                } else {
                    $scope.data.uploaderImgSelected.splice($scope.data.uploaderImgSelected.indexOf(item), 1);
                }
            };
            //列表图片全选
            $scope.selectAllImg = function() {
                $scope.data.uploaderImgSelected = $scope.data.uploaderImgSelected.length === $scope.list.DOC_PICTURELIST.length ? [] : [].concat($scope.list.DOC_PICTURELIST);
            };
            //图片上移开始
            $scope.upMove = function(index) {
                if (index !== 0) {
                    swapItems($scope.list.DOC_PICTURELIST, index, index - 1);
                }
            };
            //图片下移开始
            $scope.downMove = function(index) {
                if (index !== $scope.list.DOC_PICTURELIST.length - 1) {
                    swapItems($scope.list.DOC_PICTURELIST, index, index + 1);
                }
            };
            //图片单个删除
            $scope.deleteImg = function(index) {
                trsconfirm.confirmModel('删除', '是否确认删除图片', function() {
                    $scope.list.DOC_PICTURELIST.splice(index, 1);
                });
            };
            //说明引用到所有
            $scope.declareAll = function(index) {
                trsconfirm.confirmModel('说明应用到所有', "是否确定该条说明应用到其他图片说明", function() {
                    angular.forEach($scope.list.DOC_PICTURELIST, function(data, key) {
                        $scope.list.DOC_PICTURELIST[key].APPDESC = $scope.list.DOC_PICTURELIST[index].APPDESC;
                    });
                });
            };
            //单个删除列表图片
            $scope.delete = function(record) {
                $scope.list.KEYWORDS.splice(record, 1);
            };
            /*批量上传图片模态框*/
            $scope.multiImgsUploader = function() {
                editingCenterService.imageUpload(function(result) {
                    $scope.list.DOC_PICTURELIST = $scope.list.DOC_PICTURELIST.concat(result);
                });
            };
            //批量删除列表图片
            $scope.batchDelete = function() {
                trsconfirm.confirmModel('删除', '是否确认删除选择的图片', function() {
                    var temp = [];
                    angular.forEach($scope.list.DOC_PICTURELIST, function(value, key) {
                        if ($scope.data.uploaderImgSelected.indexOf(value) < 0) {
                            temp.push(value);
                        }
                    });
                    $scope.list.DOC_PICTURELIST = temp;
                    $scope.data.uploaderImgSelected = [];
                });
            };
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
            /************************************图片相关操作结束****************************************************/

            function swapItems(list, index1, index2) {
                list[index1] = list.splice(index2, 1, list[index1])[0];
            }
            //不发稿费
            $scope.updateCKSelection = function() {
                $scope.list.ISNOPAYMENT === '1' ? $scope.list.ISNOPAYMENT = '0' : $scope.list.ISNOPAYMENT = '1';
            };
            /*点击保存*/
            $scope.webCompileSave = function() {
                save(true).then(function() {
                    getVersion($scope.list.METADATAID);
                    var params = {
                        "serviceid": "mlf_website",
                        "methodname": "getPicsDoc",
                        "ChnlDocId": $stateParams.chnldocid,
                        "MetaDataId": $stateParams.metadataid
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        reWritePic(data);
                        $scope.data.relNewsSelectedItems = angular.isDefined(data.RELATEDNEWS) ? data.RELATEDNEWS : [];
                        reWriteAttachFile(data);
                    });
                });
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
            /*待审平台撤稿*/
            $scope.webPendingKill = function() {
                save().then(function(data) {
                    $scope.params.methodname = "rejectionMetaDatas";
                    rejection();
                });
            };

            /*预览*/
            $scope.preview = function() {
                save().then(function(data) {
                    preview();
                });
            };
            /*保存送审函数*/
            function saveSend() {
                trsconfirm.inputModel("送审", "确定送审吗？", function(content) {
                    $scope.params.Opinion = content;
                    trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "post").then(function(dataC) {
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
                    trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "post").then(function(dataC) {
                        trsconfirm.alertType("直接签发成功", "", "success", false,
                            function() {
                                storageListenerService.addListenerToWebsite("directSign");
                                $window.close();
                            });
                    });
                });
            }
            /**
             * [singTiming description]稿件定时签发函数
             * @return {[type]} [description]
             */
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
            //撤稿函数
            function rejection() {
                trsconfirm.inputModel('是否确认撤稿', '撤稿原因(可选)', function(content) {
                    $scope.params.Opinion = content;
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function() {
                        trsconfirm.alertType('撤稿成功', '', "success", false, function() {
                            storageListenerService.addListenerToWebsite("reject");
                            $window.close();
                        });
                    });
                });
            }
            //保存预览
            function preview() {
                editingCenterService.draftPublish($stateParams.chnldocid);
            }
            //关闭
            $scope.close = function() {
                editingCenterService.closeWinow($scope.atlasForm.$dirty, ueditorService.contentTranscoding($scope.list) != ueditorService.bindContent()).then(function() {
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
                }
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
            //模块
            function template(channelid) {
                var defer = $q.defer();
                var params = {
                    "serviceid": "mlf_websiteconfig",
                    "methodname": "getOptionalTemplates",
                    "ObjectType": "101",
                    "ObjectId": channelid,
                    "TEMPLATETYPE": "2",
                    "DocTemp": true
                };
                trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
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
                    defer.resolve($scope.templateJson);
                });
                return defer.promise;
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
            //动态加载指令
            function loadDirective() {
                LazyLoad.js(["./lib/ueditor2/ueditor.config.js?v=7.0", "./lib/ueditor2/ueditor.all.js?v=7.0"], function() {
                    var ueditor = '<ueditor-for-atlas list="list"></ueditor-for-atlas>';
                    ueditor = $compile(ueditor)($scope);
                    $($(angular.element(document)).find('ueditorLocation')).append(ueditor);
                });
                var draftList = '<editor-dir meta-data-id="{{list.METADATAID}}" editor-json="list.FGD_EDITINFO" show-all-tips="showAllTips" editor-form="newsForm"></editor-dir>' +
                    '<editor-auth-dir author="list.FGD_AUTHINFO"></editor-auth-dir>';
                draftList = $compile(draftList)($scope);
                $($(angular.element(document)).find('editor')).append(draftList);
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

            //模糊查询相关新闻


            //删除相关新闻
            $scope.relNesDelete = function(curIndex) {
                $scope.data.relNewsSelectedItems.splice($scope.data.relNewsSelectedItems.indexOf(curIndex), 1);
            };
            /**
             * [getVersion description]获取流程版本与操作日志
             * @return {[type]} [description]
             */
            function getVersion(id) {
                var metadataid = angular.isDefined(id) ? id : $stateParams.metadataid;
                editingCenterService.getEditVersionTime(metadataid, $scope.page, $scope.data.copyVersion).then(function(data) {
                    $scope.data.version = data;
                    $scope.page = data.page;
                    $scope.data.copyVersion = data.copyArray;
                    $scope.status.hasVersionTime = true;
                });
            }
            /**
             * [getComment description]获取评审意见
             * @return {[type]} [description]
             */
            function getComment(id, currPage) {
                editingCenterService.getComment(id, currPage).then(function(data) {
                    if (angular.isDefined($scope.data.comment.comment[$scope.data.comment.comment.length - 1]) && $filter('date')($scope.data.comment.comment[$scope.data.comment.comment.length - 1].day, "yyyy-MM-dd").toString() == $filter('date')(data.comment[0].day, "yyyy-MM-dd").toString()) {
                        $scope.data.comment.comment[$scope.data.comment.comment.length - 1].times = $scope.data.comment.comment[$scope.data.comment.comment.length - 1].times.concat(data.comment[0].times);
                        data.comment.shift();
                    }
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
            //清空相关联稿件
            $scope.cleanRelatedNews = function() {
                $scope.data.relNewsSelectedItems = [];
            };
            /**
             * [getLoadMore description]操作日志加载更多
             * @return {[type]} [description]
             */
            $scope.getLoadMore = function() {
                $scope.page.CURRPAGE++;
                getVersion();
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
             * [fileSubmit description]附件提交
             * @return {[type]} [description]
             */
            $scope.fileSubmit = function() {
                if (angular.isUndefined($scope.atlasForm.$error.filename)) {
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
            /**********************************************附件上传结束**********************************************/
            /**
             * [conversionRelNewsSelected description]相关新闻字段转换
             * @return {[type]} [description]
             */
            //根据栏目ID获取栏目名称
            function getChannel() {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.data.channelParams, "get").then(function(data) {
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
             * [updateLocalStorage description]更新本地缓存
             * @return {[type]} [description]
             */
            function updateLocalStorage(key) {
                $scope.status.localStorage[key] = true;
                localStorageService.set("iwo.newsaddedit", $scope.status.localStorage);
            }
            /**
             * [webSignPublish description]已签发平台保存并发布
             * @return {[type]} [description]
             */
            $scope.webSignPublish = function() {
                save().then(function(data) {
                    $scope.params.serviceid = "mlf_websiteoper";
                    $scope.params.methodname = "webYiQianPublish";
                    singDirect();
                });
            };

            $scope.photoCrop = function(image, index) {
                $scope.photoFileName = image.APPFILE;
                var modalInstance = $modal.open({
                    template: '<iframe src="/wcm/app/photo/photo_compress_mlf.jsp?photo=..%2F..%2Ffile%2Fread_image.jsp%3FFileName%3D' + image.APPFILE + '&index=' + index + '" width="1210px" height="600px"></iframe>',
                    windowClass: 'photoCropCtrl',
                    backdrop: false,
                    controller: "trsPhotoCropCtrl",
                    resolve: {
                        params: function() {
                            return image;
                        }
                    }
                });
                window.editCallback = webAtalsCallback;
            };

            function webAtalsCallback(params) {
                $scope.list.DOC_PICTURELIST[params.photoIndex].APPFILE = params.imageName;
                $scope.list.DOC_PICTURELIST[params.photoIndex].PERPICURL = "/wcm/file/read_image.jsp?FileName=" + params.imageName + "&r=" + new Date().getTime();
                delete $scope.list.DOC_PICTURELIST[params.photoIndex].APPENDIXID;
                editPhotoCallback();
            }
            /**
             * [moveDarft description]稿件移动为保存的前置动作
             * @return {[type]} [description]
             */
            function moveDarft() {
                var deferred = $q.defer();
                if ($stateParams.chnldocid) {
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
                }
                deferred.resolve();
                return deferred.promise;
            }
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
             * [getKeywordsOrAbstract description]提取关键词或者摘要
             * @param  {[type]} type [description]提取的种类
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
                }, function(data) {});
            };
            /**
             * [clearAllKeywords description]清空关键词
             * @return {[type]} [description]
             */
            $scope.clearAllKeywords = function() {
                $scope.data.KEYWORDS = [];
            };
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
    ]).controller('trsPhotoCropCtrl', ["$scope", "$compile", "$timeout", "params", "$modalInstance",
        function($scope, $compile, $timeout, params, $modalInstance) {
            editPhotoCallback = function() {
                $scope.$close();
            };
        }
    ]);
