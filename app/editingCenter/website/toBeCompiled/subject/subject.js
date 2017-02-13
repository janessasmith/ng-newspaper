'use strict';
/**
 *  Module 网站专题模板
 *  creatyBy SMG
 *  Description
 */
angular.module('websiteSubjectModule', []).controller('editingCenterWebsiteSubjectCtrl', websitesubject);
websitesubject.$injector = ["$scope", "$sce", "$timeout", "$stateParams", "$q", "$state", "$validation", "$window", "$filter", "initWebsiteDataService", "initWebsiteNewsService", "initeditctrBtnsService", "websiteBtnService", "filterEditctrBtnsService", "trsHttpService", "trsconfirm", "jsonArrayToStringService", "editingCenterService", "storageListenerService", "editIsLock", "Upload", "websiteService", "trsSelectDocumentService", "trsspliceString"];

function websitesubject($scope, $sce, $timeout, $stateParams, $q, $state, $validation, $window, $filter, initWebsiteDataService, initWebsiteNewsService, initeditctrBtnsService, websiteBtnService, filterEditctrBtnsService, trsHttpService, trsconfirm, jsonArrayToStringService, editingCenterService, storageListenerService, editIsLock, Upload, websiteService, trsSelectDocumentService, trsspliceString) {
    initStatus();
    initData();


    function initStatus() {
        $scope.params = {
            "serviceid": "mlf_website",
            "methodname": "getSpecialDoc",
            "ChnlDocId": $stateParams.chnldocid,
            "ChannelId": $stateParams.channelid,
            "SiteId": $stateParams.siteid,
            "MetaDataId": $stateParams.metadataid
        };
        $scope.status = {
            openBtn: true,
            files: [], //上传附件绑定数组
            showFiles: [], //附件展示以及上传字段
            isUploaderFile: false, //上传按钮是否可点击
            tag: {
                currTagId: '',
                currTagIndex: '',
                tagArray: [],
                newTagName: '',
                currDraftId: '',
                dragStartIndex: '',
                draftOriginalName: '',
            },
            position: $stateParams.status,
            isEdit: angular.isDefined($stateParams.chnldocid),
        };
        $scope.data = {
            relNewsSelectedItems: [],
            ownerSelectedItems: '',
            comment: {
                comment: [],
                voiceObj: {},
                hasMore: false,
                currPage: 1,
            },
        };
    }

    function initData() {
        $scope.handleBtnClick = function(funname) {
            eval("$scope." + funname + "()");
        };
        //判断是否存在chnldocid,存在则执行编辑数据,否则就是新建数据
        angular.isDefined($stateParams.chnldocid) ? initEditData() : initNewData();
    }
    /**
     * [visualChooseWindow description]可视化选择
     * @return {[type]} [description]
     */
    $scope.visualChooseWindow = function() {
        trsSelectDocumentService.trsSelectDocumentForST({
            siteid: $stateParams.siteid,
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
    /**
     * [initEditData description]初始化编辑数据
     * @return {[type]} [description]
     */
    function initEditData() {
        $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", $scope.params, "get").then(function(data) {
            $scope.list = data;
            $scope.data.relNewsSelectedItems = angular.isDefined(data.RELATEDNEWS) ? data.RELATEDNEWS : [];
            $scope.list.serviceid = "mlf_website";
            $scope.list.methodname = "saveSpecialDoc";
            $scope.list.CHNLDOCID = $stateParams.chnldocid;
            $scope.list.OUTLINEPICS = doWithPicsOrAttach($scope.list.OUTLINEPICS);
            $scope.list.TITLE = $scope.list.TITLE.split("<br />").join("\n");
            initBtnArray();
            getChannel();
            reWriteAttachFile(data);
            //初始化责任编辑
            // getCurrentLoginUser().then(function(name) {
            //     $scope.list.EDITORTRUENAME = $scope.list.EDITORTRUENAME ? $scope.list.EDITORTRUENAME : name[0].TRUENAME;
            // });
            //获取评审意见
            getComment($stateParams.metadataid, $scope.data.comment.currPage);
        });
        //稿件加锁
        editIsLock.lockDraft($stateParams.metadataid);
        //稿件的标签列表
        requestTagList().then(function() {
            if ($scope.status.tag.tagArray.length > 0) {
                $scope.status.tag.currTagId = $scope.status.tag.tagArray[0].SPECAILTAGID;
                $scope.status.tag.currTagIndex = 0;
                requestTagDraftList($scope.status.tag.tagArray[0].SPECAILTAGID)
            };
        })
    }

    function initNewData() {
        $scope.list = initWebsiteDataService.initSubject();
        $scope.list.CHANNELID = $stateParams.channelid;
        initBtnArray();
        getChannel();
        $scope.list.ISSUETIME = $filter("date")(new Date(), "yyyy-MM-dd HH:mm").toString();
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
    /*点击保存*/
    $scope.webCompileSave = function() {
        save(true).then(function() {
            if (angular.isDefined($stateParams.chnldocid)) {
                var params = {
                    "serviceid": "mlf_website",
                    "methodname": "getSpecialDoc",
                    "ChnlDocId": $stateParams.chnldocid,
                    "ChannelId": $stateParams.channelid,
                    "SiteId": $stateParams.siteid,
                    "MetaDataId": $stateParams.metadataid
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.data.relNewsSelectedItems = angular.isDefined(data.RELATEDNEWS) ? data.RELATEDNEWS : [];
                    reWriteAttachFile(data);
                });
            }
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
        editingCenterService.closeWinow($scope.subjectForm.$dirty, false, false).then(function() {
            save().then(function() {
                storageListenerService.addListenerToWebsite("save");
                editIsLock.normalLock($stateParams.metadataid).then(function(data) {
                    $window.close();
                });
            });
        }, function() {
            clearDirtyTag(); //清除未和专题关联的标签
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
    /**
     * [manageDataAtferSave description]保存后数据处理
     * @param  {[type]} data [description]保存后返回的数据
     * @param  {[type]} flag [description]标识
     * @return {[type]}      [description]
     */
    function manageDataAtferSave(data, flag) {
        $scope.status.openBtn = true;
        $scope.list.METADATAID = data.METADATAID;
        $scope.list.CHNLDOCID = data.CHNLDOCID;
        $stateParams.metadataid = angular.isDefined($stateParams.metadataid) ? $stateParams.metadataid : data.METADATAID;
        $stateParams.chnldocid = angular.isDefined($stateParams.chnldocid) ? $stateParams.chnldocid : data.CHNLDOCID;
        $stateParams.channelid = angular.isDefined($stateParams.channelid) ? $stateParams.channelid : $scope.list.CHANNELID;
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

    function save(flag) { //flag用于调用保存服务后是否弹出成功窗口判断
        var deferred = $q.defer();
        $timeout(function() {
            $validation.validate($scope.subjectForm)
                .success(function() {
                    $scope.subjectForm.$setPristine();
                    $scope.status.openBtn = false;
                    var list = dealAttribute();
                    $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do",
                        list, "post").then(function(data) {
                        manageDataAtferSave(data, flag);
                        deferred.resolve(data);
                    }, function(data) {
                        $scope.status.openBtn = true;
                        deferred.reject(data);
                    });
                }).error(function() {
                    $scope.showAllTips = true;
                    editingCenterService.checkSaveError($scope.subjectForm);
                    trsconfirm.saveModel("提交失败", "请检查填写项", "error");
                });
        }, 100);
        return deferred.promise;
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

    /**
     * [dealAttribute description]处理保存时对象属性问题
     * @return {[type]} [description]
     */
    function dealAttribute() {
        saveAttachFile();
        filterTime();
        var list = angular.copy($scope.list);
        list.RELATEDNEWS = trsspliceString.spliceString($scope.data.relNewsSelectedItems, 'METADATAID', ",");
        list.OUTLINEPICS = angular.copy(jsonArrayToStringService.clearEmptyObjects(list.OUTLINEPICS, "APPFILE"));
        //标题回车处理成</br> 存入数据库里
        list.TITLE = list.TITLE.split("\n").join("<br />");
        //与专题关联的标签ID
        list.TagIds = $scope.status.tag.tagArray.length > 0 ? trsspliceString.spliceString($scope.status.tag.tagArray, 'SPECAILTAGID', ',') : null;
        //稿件归属人
        list.OWNER = $scope.data.ownerSelectedItems;
        list = jsonArrayToStringService.jsonArrayToString(list);
        return list;
    }
    /**
     * [filterTime description]时间过滤
     * @return {[type]} [description]
     */
    function filterTime() {
        $scope.list.ISSUETIME = $filter('date')($scope.list.ISSUETIME, "yyyy-MM-dd HH:mm").toString();
        $scope.list.DOCRELTIME = $filter('date')(new Date(), "yyyy-MM-dd HH:mm").toString();
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
            storageListenerService.addListenerToWebsite("timeSign");
            $window.close();
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
            var fileType = value.name.split('.').pop().toLowerCase();
            //只能上传.zip类型的文档
            if (fileType == 'zip') {
                $scope.status.showFiles.push({
                    SRCFILE: newFiles[key].name,
                    APPDESC: newFiles[key].name,
                    FILEINFO: "等待上传",
                    FILE: newFiles[key],
                });
            } else {
                trsconfirm.alertType("请选择.zip类型的文档", "", "warning", false);
            }
        });
    };
    /**
     * [getAttachFile description]为SPECIALFILE重新复制，可更改并删除多余字段
     * @return {[type]} [description]null
     */
    function saveAttachFile() {
        $scope.list.SPECIALFILE = [];
        angular.forEach($scope.status.showFiles, function(value, key) {
            if (value.FILEINFO === '上传成功') {
                delete value.FILE;
                delete value.PICURL;
                delete value.PERPICURL;
                delete value.APPENDIXID;
                delete value.APPDOCID;
                $scope.list.SPECIALFILE.push(value);
            }
        });
    }
    /**
     * [reWriteAttachFile description]附件字段回写
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function reWriteAttachFile(data) {
        $scope.status.showFiles = angular.copy(data.SPECIALFILE);
        angular.forEach($scope.status.showFiles, function(value, key) {
            value.FILEINFO = "上传成功";
        });
    }

    /**
     * [fileSubmit description]附件提交
     * @return {[type]} [description]
     */
    $scope.fileSubmit = function() {
        if (angular.isUndefined($scope.subjectForm.$error.filename)) {
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
    $scope.deleteImgContainer = function(item, array) {
        array.splice(array.indexOf(item), 1);
    };
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
    };
    /******************************标签管理开始********************************/
    /**
     * [requestTagList description]请求标签列表
     */
    function requestTagList() {
        var deferred = $q.defer();
        var params = {
            'serviceid': 'mlf_tag',
            'methodname': "querySpecialTagsFromViewData",
            'metaDataId': angular.isDefined($stateParams.chnldocid) ? $stateParams.metadataid : "0",
        }
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
            $scope.status.tag.tagArray = data.DATA;
            deferred.resolve();
        })
        return deferred.promise;
    }
    /**
     * [requestTagDraftList description]请求标签下稿件的列表
     */
    function requestTagDraftList(tagId) {
        var params = {
            'serviceid': 'mlf_tag',
            'methodname': "queryViewDatasFromTag",
            'channelId': $stateParams.channelid,
            'siteid': $stateParams.siteid,
            'TagId': tagId,
        }
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
            $scope.status.tag.tagArray[$scope.status.tag.currTagIndex].DRAFTLIST = data.DATA;
        })
    }
    /**
     * [addDraftToTag description]给指定标签增加稿件
     */
    function addDraftToTag() {
        var deferred = $q.defer();
        var params = {
            'serviceid': 'mlf_tag',
            'methodname': "addDataFromSpecialTag",
            'TagId': $scope.status.tag.currTagId,
            'metaDataIds': trsspliceString.spliceString($scope.status.tag.tagArray[$scope.status.tag.currTagIndex].DRAFTLIST, 'METADATAID', ",")
        }
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function() {
            deferred.resolve();
        })
        return deferred.promise;
    }
    /**
     * [clearDirtyTag description]如果未保存就关闭，清除没有和专题关联的标签
     */
    function clearDirtyTag() {
        if ($scope.status.tag.tagArray.length == 0) return;
        var params = {
            'serviceid': "mlf_tag",
            'methodname': 'deleteTagsNoMetadata',
            'TagIds': trsspliceString.spliceString($scope.status.tag.tagArray, 'SPECAILTAGID', ','),
        }
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get');
    };
    /**
     * [selectCurrTag description]选择标签
     * @param {[obj]} item [description] 所选的标签
     */
    $scope.selectCurrTag = function(item, index) {
        $scope.status.tag.currTagId = item.SPECAILTAGID;
        $scope.status.tag.currTagIndex = index;
        if (item.DRAFTLIST) return;
        requestTagDraftList(item.SPECAILTAGID);
    };
    /**
     * [chooseDraftWindow description]选择稿件窗口
     */
    $scope.chooseDraftWindow = function() {
        trsSelectDocumentService.trsSelectDocument({
            siteid: $stateParams.siteid,
            relNewsData: angular.copy($scope.status.tag.tagArray[$scope.status.tag.currTagIndex].DRAFTLIST),
            position: $stateParams.status,
            showMetadaId: true
        }, function(result) {
            angular.forEach(result, function(value, key) {
                value.METADATAID = value.metadataId;
                value.TITLE = value.title;
            });
            $scope.status.tag.tagArray[$scope.status.tag.currTagIndex].DRAFTLIST = result;
            //给标签加稿件
            addDraftToTag().then(function() {
                //刷新稿件列表
                requestTagDraftList($scope.status.tag.currTagId);
            });
        });
    };
    /**
     * [removeTagDraft description]取消所选标签稿件
     */
    $scope.removeTagDraft = function(item, index) {
        var params = {
            'serviceid': 'mlf_tag',
            'methodname': 'removeDataFromTag',
            'TagId': $scope.status.tag.currTagId,
            'metaDataIds': item.METADATAID,
        }
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
            requestTagDraftList($scope.status.tag.currTagId);
        })
    };
    /**
     * [markOriginalDraftName description]记录原稿件名
     * @params item [obj] 所选的稿件
     */
    $scope.markOriginalDraftName = function(item) {
        $scope.status.tag.draftOriginalName = item.RTITLE;
    };
    /**
     * [modifyDraftName description]更改稿件名
     * @params item [obj] 所选的稿件
     */
    $scope.modifyDraftName = function(item) {
        if (item.RTITLE == "") {
            item.RTITLE = $scope.status.tag.draftOriginalName;
            return;
        }
        $scope.status.tag.currDraftId = "";
        var params = {
            'serviceid': 'mlf_tag',
            'methodname': 'updateDocHomeTitle',
            'tagId': $scope.status.tag.currTagId,
            'metaDataId': item.METADATAID,
            'HomeTitle': item.RTITLE,
        }
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get');
    };
    /**
     * [newTag description]新建标签
     */
    $scope.newTag = function(ev) {
        if (angular.isDefined(ev) && ev.keyCode == 13) {
            if ($scope.status.tag.newTagName == '') return;
            for (var i = 0; i < $scope.status.tag.tagArray.length; i++) {
                if ($scope.status.tag.tagArray[i].TAGNAME == $scope.status.tag.newTagName) return;
            }
            var params = {
                'serviceid': 'mlf_tag',
                'methodname': 'addSpecialTagFromData',
                'TagNames': $scope.status.tag.newTagName,
                'metadataid': "0",
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $timeout(requestTagList(), 300);
                $scope.status.tag.newTagName = '';
            })
        }
    };
    /**
     * [deleteTag description]删除标签
     * @params item [obj] 所选的稿件
     */
    $scope.deleteTag = function(item) {
        trsconfirm.confirmModel("删除标签", "您确定删除此标签", function() {
            var params = {
                'serviceid': 'mlf_tag',
                'methodname': 'deleteSpecialTag',
                'TagId': item.SPECAILTAGID,
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $timeout(requestTagList(), 300);
                if (item.SPECAILTAGID == $scope.status.tag.currTagId) {
                    $scope.status.tag.currTagId = "";
                    $scope.status.tag.currDraftId = "";
                    $scope.status.tag.currTagIndex = "";
                }
            });
        })
        window.event.stopPropagation();
    };
    /**
     * [modifyTagName description]更改标签名
     * @params item [obj] 所选的稿件
     */
    $scope.modifyTagName = function(item) {
        var originalName = item.TAGNAME;
        trsconfirm.typingModel("重命名", item.TAGNAME, function(result) {
            if (result == originalName) return;
            var params = {
                'serviceid': 'mlf_tag',
                'methodname': 'modifyTagName',
                'metaDataId': angular.isDefined($stateParams.chnldocid) ? $stateParams.metadataid : "0",
                'TagName': result,
                'TagId': item.SPECAILTAGID,
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function() {
                requestTagList().then(function() {
                    requestTagDraftList($scope.status.tag.tagArray[$scope.status.tag.currTagIndex].SPECAILTAGID)
                })
            })
        });
    };
    //允许拖拽
    $scope.dragoverCallback = function(event, index, external, type) {
        return true;
    };
    //拖拽开始
    $scope.dragStart = function(event, item, index) {
        $scope.status.tag.dragStartIndex = index;
    };
    //拖拽结束
    $scope.dropCallback = function(event, index, item, external, type, allowedType) {
        if ($scope.status.tag.dragStartIndex == index) return;
        $scope.status.tag.tagArray[$scope.status.tag.currTagIndex].DRAFTLIST.splice($scope.status.tag.dragStartIndex, 1);
        $scope.status.tag.dragStartIndex > index ?
            $scope.status.tag.tagArray[$scope.status.tag.currTagIndex].DRAFTLIST.splice(index, 0, item) :
            $scope.status.tag.tagArray[$scope.status.tag.currTagIndex].DRAFTLIST.splice(index - 1, 0, item);
        addDraftToTag();
    };

    // $timeout(function() {
    //     var container = $('#section-2').find('textarea').eq(0),
    //         val = $('#section-2').find('textarea').eq(0).val(),
    //         valArr = val.split('\n');
    //     console.log(val);
    //     console.log(container);
    //     for (var row = 0; row < valArr.length; row++) {
    //         if (valArr[row].indexOf('TagId="26"') > -1) break;
    //     };

    //     //选中
    //     container[0].setSelectionRange(val.indexOf('TagId="26"'), val.indexOf('TagId="26"') + 10);
    //     container.focus();
    //     container.scrollTop(row * 20);
    // });
    /**
     * [markTag description]标识所选的标签在哪里
     * @params item [obj] 所选的标签
     */
    $scope.markTag = function(item) {
        var txtContainer = $('#section-2').find('textarea').eq(0),
            val = $('#section-2').find('textarea').eq(0).val(),
            valRowArr = val.split('\n'),
            tagIndex = val.indexOf('TagId="' + item.SPECAILTAGID + '"');
        //找到标签在第几行
        for (var row = 0; row < valRowArr.length; row++) {
            if (valRowArr[row].indexOf('TagId="' + item.SPECAILTAGID + '"') > -1) {
                break;
            } else if (row == valRowArr.length - 1 && valRowArr[row].indexOf('TagId="' + item.SPECAILTAGID + '"') < 0) {
                trsconfirm.alertType('没有找到', "", "warning", false);
                return;
            }
        };
        // 选中效果标示位置
        txtContainer[0].setSelectionRange(tagIndex, tagIndex + item.SPECAILTAGID.length + 8); //TagId=""  == 8
        txtContainer.focus();
        txtContainer.scrollTop(row * 20); //20==行高
    };
    /**
     * [chooseAscription description]选择稿件归属人
     */
    $scope.chooseAscription = function() {
            websiteService.ascriptionModel($stateParams.metadataid, function(result) {
                $scope.data.ownerSelectedItems = result.selectedArray.join(',');
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
}
