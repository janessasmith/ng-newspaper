/**
 * Created by MRQ on 2016/1/21.
 */
'use strict';
/**
 *  Module 网站链接型文档模板
 *  creatyBy ly
 * Description
 */
angular.module('websiteLinkDocModule', [])
    .controller('editingCenterWebsiteLinkDocCtrl', websiteLinkDoc)
    .controller('trsPhotoCropCtrl', trsPhotoCropCtrl);
websiteLinkDoc.$injector = ["$scope", "$compile", "$filter", "$q", "$state", "$modal", "$timeout", "$location", "$validation", "$window", "jsonArrayToStringService", "trsResponseHandle", "initeditctrBtnsService", "initVersionService", "initAddMetaDataService", "$stateParams", "$anchorScroll", "trsHttpService", "SweetAlert", "initSingleSelecet", "trsconfirm", "trsspliceString", "editingCenterService", "$sce", "initWebsiteDataService", "websiteService", "filterEditctrBtnsService", "initWebsiteNewsService", "trsSelectDocumentService", "Upload", "websiteBtnService", "editIsLock", "storageListenerService"];
var editCallback = null;
var editPhotoCallback = null;

function websiteLinkDoc($scope, $compile, $filter, $q, $state, $modal, $timeout, $location, $validation, $window, jsonArrayToStringService, trsResponseHandle, initeditctrBtnsService, initVersionService, initAddMetaDataService, $stateParams, $anchorScroll, trsHttpService, SweetAlert, initSingleSelecet, trsconfirm, trsspliceString, editingCenterService, $sce, initWebsiteDataService, websiteService, filterEditctrBtnsService, initWebsiteNewsService, trsSelectDocumentService, Upload, websiteBtnService, editIsLock, storageListenerService) {
    initStatus();
    initData();

    function initStatus() {
        $scope.page = {
            CURRPAGE: 1,
            PAGESIZE: 20,
        };
        $scope.params = {
            siteId: $stateParams.siteid,
            ChannelId: $stateParams.channelid,
            serviceid: "mlf_website",
            methodname: "getLinkDoc",
            METADATAID: $stateParams.metadataid,
        };
        $anchorScroll.yOffset = 55;
        $scope.status = {
            chnldocid: $stateParams.chnldocid,
            openBtn: true,
            files: [], //上传附件绑定数组
            showFiles: [], //附件展示以及上传字段
            isUploaderFile: false, //上传按钮是否可点击
            isSubTitleShow: true,
            hasVersionTime: false,
            isEditDraft: angular.isDefined($stateParams.chnldocid) ? true : false, //是否是编辑稿件说
            position: $stateParams.status,
        };
        $scope.data = {
            KEYWORDS: [],
            channelParams: {
                "serviceid": "mlf_mediasite",
                "methodname": "getChannelPath",
                "ChannelId": $stateParams.channelid,
                "Burster": ">"
            },
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
        initBtnArray();
    }

    function initData() {
        angular.isDefined($stateParams.chnldocid) ? initEditDraftData() : initNewDraftData();
        $scope.handleBtnClick = function(funname) {
            eval("$scope." + funname + "()");
        };
    }

    function initNewDraftData() {
        $scope.list = initWebsiteDataService.initLinkDoc();
        $scope.list.CHANNELID = $stateParams.channelid;
        initKeyWords();
        getChannel();
        $scope.list.ISSUETIME = $filter("date")(new Date(), "yyyy-MM-dd HH:mm").toString();
    }

    function initEditDraftData() {
        trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
            $scope.list = data;
            $scope.list.serviceid = "mlf_website";
            $scope.list.methodname = "saveLinkDoc";
            initKeyWords();
            reWriteAttachFile(data);
            $scope.list.TITLE = $scope.list.TITLE.split("<br />").join("\n");
            $scope.list.OUTLINEPICS = doWithPicsOrAttach($scope.list.OUTLINEPICS);
            getChannel();
            //稿件加锁
            editIsLock.lockDraft($stateParams.metadataid);
            getVersion();
            //请求这个稿件的标签
            getCurrDraftTag();
            //获取评审意见
            getComment($stateParams.metadataid, $scope.data.comment.currPage);
        });
    }
    //根据栏目ID获取栏目名称
    function getChannel() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.data.channelParams, "get").then(function(data) {
            $scope.CHANNEL = data.replace(/\"/g, "");
        });
    }
    //点击显示隐藏副标题
    $scope.subTitleShow = function() {
        $scope.status.isSubTitleShow = !$scope.status.isSubTitleShow;
    };

    //锚点切换开始
    $scope.goto = function(id) {
        $location.hash(id);
        $anchorScroll();
    };
    //稿源操作开始
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
    //稿源操作结束
    //是否原创稿
    $scope.oringin = function(list) {
        $scope.atlasForm.$dirty = true;
        list.ORIGINAL = list.ORIGINAL === '1' ? '0' : '1';
        if (angular.isUndefined($stateParams.chnldocid) && list.ORIGINAL === '1') {
            list.ISNOPAYMENT = '0'; //判断为原创稿的话需要默认发稿费  
        }
    };
    //稿件体裁
    $scope.draftType = function() {
        $scope.list.DOCGENRE = angular.copy($scope.GENREDOC).value;
    };
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
                moveDarft();
                // template($scope.list.CHANNELID);
            }, function(data) {});
        });
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
    //不发稿费
    $scope.updateCKSelection = function() {
        $scope.list.ISNOPAYMENT === '1' ? $scope.list.ISNOPAYMENT = '0' : $scope.list.ISNOPAYMENT = '1';
    };
    /*点击保存*/
    $scope.webCompileSave = function() {
        save(true).then(function(data) {
            getVersion($scope.list.METADATAID);
            $scope.params.METADATAID = $scope.list.METADATAID;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                reWriteAttachFile(data);
            });
        });
    };
    /*保存并送审*/
    $scope.webCompileSend = function() {
        $scope.params.METADATAID = $scope.list.METADATAID;
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
            $scope.params.serviceid = "mlf_websiteoper";
            $scope.params.methodname = "webDaiBianTimingPublish";
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
            $scope.params.serviceid = "mlf_websiteoper";
            $scope.params.methodname = "webDaiShenTimingPublish";
            singTiming();
        });
    };
    /*待审平台退稿*/
    $scope.webPendingKill = function() {
        save().then(function(data) {
            $scope.params.serviceid = "mlf_websiteoper";
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
    /**
     * [dealDataBeforeSave description]保存前处理数据
     * @return {[type]} [description]
     */
    function dealDataBeforeSave() {
        $scope.status.openBtn = false;
        saveAttachFile();
        examAttachFile();
        getKeyWords();
        // //处理图片问题
        $scope.list.ISSUETIME = $filter('date')($scope.list.ISSUETIME, "yyyy-MM-dd HH:mm").toString();
        var list = angular.copy($scope.list);
        list.OUTLINEPICS = angular.copy(jsonArrayToStringService.clearEmptyObjects(list.OUTLINEPICS, "APPFILE"));
        //JSON对象数组转字符串
        list = jsonArrayToStringService.jsonArrayToString(list);
        //标题回车处理成</br> 存入数据库里
        list.TITLE = list.TITLE.split("\n").join("<br />");
        //原始标签
        list.OLDTAGIDS = $scope.data.tag.originalTag.join(',');
        //如果编辑过就传编辑后的内容，没有的话与原始标签一样
        list.TAGIDS = $scope.data.tag.hasChoose ? angular.copy($scope.data.tag.selectTag).join(',') : angular.copy(list.OLDTAGIDS);
        //稿件归属人
        list.OWNER = $scope.data.ownerSelectedItems;
        return list;
    }

    function dealDataAfterSave(data, flag) {
        $scope.status.openBtn = true;
        //再次初始化标签相关的属性
        $scope.params.MetaDataIds = $stateParams.metadataid = $scope.list.METADATAID = data.METADATAID;
        $scope.params.ChnlDocIds = $stateParams.chnldocid = $scope.list.CHNLDOCID = data.CHNLDOCID;
        $stateParams.channelid = $scope.list.CHANNELID;
        initTagAfterSave();
        if (flag) {
            storageListenerService.addListenerToWebsite("save");
            $state.transitionTo($state.current, $stateParams, {
                reload: false
            });
            trsconfirm.saveModel("保存成功", "", "success");
        }
    }
    /*保存函数*/
    function save(flag) {
        var deferred = $q.defer();
        $timeout(function() {
            $validation.validate($scope.linkDocForm)
                .success(function() {
                    $scope.linkDocForm.$setPristine();
                    var list = dealDataBeforeSave();
                    trsHttpService.httpServer("/wcm/mlfcenter.do",
                        list, "post").then(function(data) {
                        data = trsResponseHandle.saveResponse(data, function() {
                            dealDataAfterSave(data, flag);
                            deferred.resolve(data);
                        });
                    }, function(data) {
                        $scope.status.openBtn = true;
                        deferred.reject(data);
                    });
                }).error(function() {
                    $scope.showAllTips = true;
                    editingCenterService.checkSaveError($scope.linkDocForm);
                    trsconfirm.saveModel("提交失败", "请检查填写项", "error");
                });
        }, 100);
        return deferred.promise;
    }
    /**
     * [examAttachFile description]检测attachFile字段,存在为空的字段删除
     * @return {[type]} [description]
     */
    function examAttachFile() {
        if ($scope.list.ATTACHFILE === "") return;
        angular.forEach($scope.files, function(value, key) {
            if (value.appFile === "") {
                $scope.list.ATTACHFILE.splice($scope.list.ATTACHFILE.indexOf(value), 1);
            }
        });
    }
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
    /*已签发平台保存并发布*/
    $scope.webSignPublish = function() {
        save().then(function(data) {
            $scope.params.serviceid = "mlf_websiteoper";
            $scope.params.methodname = "webYiQianPublish";
            singDirect();
        });
    };
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

    /*定时签发函数*/
    function singTiming() {
        var methodname = ['webDaiBianTimingPublish', 'webDaiShenTimingPublish'];
        var params = {
            selectedArray: [$scope.list],
            isNewDraft: true,
            methodname: methodname[$stateParams.status]
        };
        editingCenterService.draftTimeSinged(params).then(function(data) {
            storageListenerService.addListenerToWebsite("timeSign");
            $window.close();
        });
    }
    //退稿函数
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
     * [close description]页面关闭
     * @return {[type]} [description]
     */
    $scope.close = function() {
        editingCenterService.closeWinow($scope.linkDocForm.$dirty, false, false).then(function() {
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
                delete value.progressPercentage;
                delete value.PICURL;
                delete value.PERPICURL;
                delete value.APPENDIXID;
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
        if (angular.isUndefined($scope.linkDocForm.$error.filename)) {
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
        window.editCallback = webLinkCallback;
    };

    function webLinkCallback(params) {
        $scope.list.DOC_PICTURELIST[params.photoIndex].APPFILE = params.imageName;
        $scope.list.DOC_PICTURELIST[params.photoIndex].PERPICURL = "/wcm/file/read_image.jsp?FileName=" + params.imageName + "&r=" + new Date().getTime();
        delete $scope.list.DOC_PICTURELIST[params.photoIndex].APPENDIXID;
        editPhotoCallback();
    }

    $scope.getKeywordsOrAbstract = function(type) {
        editingCenterService.getKeywordsOrAbstract(type, $scope.list.TITLE).then(function(data) {
            if (type === "keywords") {
                if (data !== '""') {
                    var keywordsArray = data.substring(1, data.length - 1).split(";");
                    var arr = [];
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
    $scope.invalidTag = function(tag) {
        var reg = /^[^<>\\\/\'\"]*$/;
        if (tag.name.length > 20) {
            $scope.isShowKeywordTips = true;
            $scope.keywordsTips = "单个关键词长度不能超过20";
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
            })
        }

    };
    $scope.leave = function() {
        $scope.isShowKeywordTips = false;
    };
    $scope.enter = function() {
        var reg = /^[^<>\\\/\'\"]*$/;
        if (angular.isDefined($scope.KEYWORDTEXT) && (!reg.test($scope.KEYWORDTEXT) || $scope.KEYWORDTEXT.length > 20)) {
            $scope.isShowKeywordTips = true;
        }
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
    /**
     * [moveDarft description]稿件移动
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
     * [chooseTag description]选择标签
     * @return {[type]} [description]
     */
    $scope.chooseTag = function() {
        websiteService.subjectModel($stateParams.metadataid, $stateParams.channelid, function(result) {
            $scope.data.tag.hasChoose = true;
            $scope.data.tag.selectTag = result.selectedArray;
        })
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
        }
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
            angular.forEach(data, function(value, key) {
                $scope.data.tag.originalTag.push(value.TAGID);
            });
        })
    };
    /**
     * [initTagAfterSave description]保存之后再次初始化标签需要的属性
     * @return {[type]} [description]
     */
    function initTagAfterSave() {
        $scope.data.tag.originalTag = angular.copy($scope.data.tag.selectTag);
        $scope.data.tag.hasChoose = false;
        $scope.data.tag.selectTag = [];
    };
    /**
     * [chooseAscription description]选择稿件归属人
     */
    $scope.chooseAscription = function() {
        websiteService.ascriptionModel($stateParams.metadataid, function(result) {
            $scope.data.ownerSelectedItems = result.selectedArray.join(',');
        });
    }
}

trsPhotoCropCtrl.$injector = ["$scope", "$compile", "$timeout", "params", "$modalInstance"];

function trsPhotoCropCtrl($scope, $compile, $timeout, params, $modalInstance) {
    editPhotoCallback = function() {
        $scope.$close();
    };
}
