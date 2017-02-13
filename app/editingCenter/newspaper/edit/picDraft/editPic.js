/*
author:wang.jiang 2016-1-16
 */
"use strict";
var editCallback = null;
var editPhotoCallback = null;
angular.module('editctrNewspaperPicModule', ["editctrNewspaperRouterModule"])
    .controller('EditctrNewspaperPicCtrl', ["$scope", "$sce", "$modal", '$window', "$compile", "$state", "$timeout", "$location", "$anchorScroll", '$stateParams', '$validation', "$filter", "trsHttpService", "jsonArrayToStringService", "trsResponseHandle", "trsconfirm", "$q", "initSingleSelecet", "iWoService", "myManuscriptService", "editingCenterService", "initeditctrBtnsService", "filterEditctrBtnsService", "initDataNewspaperService", "initVersionService", "newsDictionBtnService", "newsEditBtnService", "editNewspaperService", "trsspliceString", "storageListenerService", "SweetAlert", "editIsLock", "ueditorService",
        function($scope, $sce, $modal, $window, $compile, $state, $timeout, $location, $anchorScroll, $stateParams, $validation, $filter, trsHttpService, jsonArrayToStringService, trsResponseHandle, trsconfirm, $q, initSingleSelecet, iWoService, myManuscriptService, editingCenterService, initeditctrBtnsService, filterEditctrBtnsService, initDataNewspaperService, initVersionService, newsDictionBtnService, newsEditBtnService, editNewspaperService, trsspliceString, storageListenerService, SweetAlert, editIsLock, ueditorService) {
            initStatus();
            initData();
            loadDirective();
            //锚点切换开始
            $scope.goto = function(id) {
                $location.hash(id);
                $anchorScroll();
            };

            function initStatus() {
                $scope.page = {
                    CURRPAGE: 1,
                    PAGECOUNT: 20
                };
                $scope.status = {
                    params: {
                        "serviceid": "mlf_paper",
                        "methodname": "queryViewDatas",
                        "MetaDataIds": $stateParams.metadata,
                    },
                    data: {
                        meataInfo: {},
                        docgenreOptions: []
                    },
                    newsPaperInfo: {},
                    openBtn: true,
                    version: [],
                    copyVersion: [],
                    comment: {
                        comment: [],
                        voiceObj: {},
                        hasMore: false,
                        currPage: 1,
                    },
                    uploaderImgSelected: [],

                };
                $scope.uploaderImgSelected = [];
                //初始化按钮点击
                $scope.handleBtnClick = function(funname) {
                    eval("$scope." + funname + "()");
                };
                //初始化稿件体裁
                iWoService.initData().then(function(data) {
                    $scope.data = data;
                    $scope.docgenre = [];
                    angular.forEach(data.DocGenre, function(data, key) {
                        $scope.docgenre.push({
                            value: data.desc,
                            name: data.value
                        });
                    });
                    initDocgenre();
                });
            }

            function initData() {
                initMataData().then(function(data) {
                    getVersion();
                    initBtn();
                    //获取评审意见
                    getComment($stateParams.metadata, $scope.status.comment.currPage);
                    reWriteImgData($scope.list);
                });
                $anchorScroll.yOffset = 63;
                //稿件加锁
                $timeout(function() {
                    editIsLock.lockDraft($stateParams.metadata);
                }, 1700);
            }

            function initMataData() {
                var deferred = $q.defer();
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.params, "get")
                    .then(function(data) {
                        $scope.list = data[0];
                        //处理图片附件存在的属性过多问题
                        var arrayDocPic = [];
                        $scope.list.GENREOBJ = {};
                        $scope.list.GENREOBJ.name = $scope.list.GENREDOC;
                        $scope.GENREDOC = $scope.list.GENREOBJ;
                        //处理上传图集多余属性问题
                        examImg();
                        deferred.resolve(data);
                    });
                return deferred.promise;
            }
            $scope.save = function() {
                getVersion();
                hasImg()?save(true):trsconfirm.saveModel("保存失败", "图集稿件必须上传图片", "error");
            };
            /**
             * [examImg description]检验图片，处理上传图集多余属性问题
             * @return {[type]} [description]
             */
            function examImg() {
                if ($scope.list.DOC_PICTURELIST != '[]') {
                    angular.forEach($scope.list.DOC_PICTURELIST, function(data, index) {
                        angular.forEach($scope.list.DOC_PICTURELIST[index], function(value, key) {
                            if (key !== "APPFILE" && key !== "APPDESC" && key !== "PERPICURL" && key !== "APPENDIXID") {
                                delete $scope.list.DOC_PICTURELIST[index][key];
                            }
                        });
                    });
                } else {
                    $scope.list.DOC_PICTURELIST = [];
                }
            }
            /**
             * [calculateWordNum description]计算字数，图集说明字数+各图说字数,但图集说明中的字数为图集说明中输入的字数不为图集稿总字数
             * @return {[type]} [description]
             */
            function calculateWordNum() {
                var len = 0;
                angular.forEach($scope.list.DOC_PICTURELIST, function(value, key) {
                    if (angular.isDefined(value.APPDESC)) {
                        len += value.APPDESC.length;
                    }
                });
                $scope.list.DOCWORDSCOUNT+= len;
            }
            /**
             * [saveContent description]保存正文内容
             * @return {[type]} [description]
             */
            function saveContent() {
                ueditorService.saveContent($scope.list);
            }

            function save(flag) {
                var deferred = $q.defer();
                if ($scope.list.DOC_PICTURELIST.length <= 0) {
                    trsconfirm.saveModel("保存失败", "图集稿需要上传图片", "error");
                    return;
                }
                $validation.validate($scope.atlasForm.authorForm);
                $validation.validate($scope.atlasForm)
                    .success(function() {
                        $scope.atlasForm.$setPristine();
                        $scope.status.openBtn = false;
                        saveContent();
                        calculateWordNum();
                        $scope.list.DOCRELTIME = $filter('date')(new Date(), "yyyy-MM-dd HH:mm").toString();
                        var saveParams = angular.copy($scope.list);
                        saveParams.serviceid = "mlf_paper";
                        saveParams.methodname = "savePicDocument";
                        saveParams.ObjectId = $stateParams.metadata;
                        delete saveParams.CRDEPT;
                        delete saveParams.DOCTYPE;
                        delete saveParams.METADATAID;
                        delete saveParams.LOG_OPERATION;
                        delete saveParams.OBJ_VERSION;
                        //处理发稿单作者信息空数据提交问题
                        if (angular.isDefined(saveParams.FGD_AUTHINFO[0]) && (!angular.isDefined(saveParams.FGD_AUTHINFO[0].USERNAME) || saveParams.FGD_AUTHINFO[0].USERNAME === "")) {
                            saveParams.FGD_AUTHINFO = [];
                        }
                        //处理发稿单作者信息空数据提交问题
                        saveParams = jsonArrayToStringService.jsonArrayToString(saveParams);
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), saveParams, "post").then(function(data) {
                            $scope.status.openBtn = true;
                            //保存稿件成功后
                            if (flag) {
                                storageListenerService.addListenerToNewspaper("save");
                                $state.transitionTo($state.current, $stateParams, {
                                    reload: false
                                });
                                reWriteImgData($scope.list);
                                trsconfirm.saveModel("保存成功", "", "success");
                            }
                            deferred.resolve(data);
                        }, function(data) {
                            $scope.status.openBtn = true;
                            deferred.reject(data);
                        });
                    }).error(function(msg) {
                        $scope.showAllTips = true;
                        editingCenterService.checkSaveError($scope.atlasForm);
                        trsconfirm.saveModel("保存失败", "请检查填写项", "error");
                    });
                return deferred.promise;
            }
            //正常解锁
            function normalLock() {
                var defer = $q.defer();
                var params = {
                    "serviceid": "mlf_metadata",
                    "methodname": "unLock",
                    'MetaDataId': $stateParams.metadata,
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    defer.resolve(data);
                });
                return defer.promise;
            }
            /**
             * [close description]关闭页面
             * @return {[type]} [description]
             */
            $scope.close = function() {
                editingCenterService.closeWinow($scope.atlasForm.$dirty).then(function() {
                    save().then(function() {
                        storageListenerService.addListenerToNewspaper("save");
                        editIsLock.normalLock($stateParams.metadata).then(function(data) {
                            $window.close();
                        });
                    });
                }, function() {
                    editIsLock.normalLock($stateParams.metadata).then(function(data) {
                        $window.close();
                    });
                });
            };
            // };
            //浏览器关闭
            $window.onunload = onbeforeunload_handler;

            function onbeforeunload_handler() {
                editIsLock.normalLock($stateParams.metadata).then(function(data) {
                    $window.close();
                });
            }

            //初始化发稿稿件
            function initDocgenre() {
                trsHttpService.httpServer("./editingCenter/properties/metadataEnum.json", {}, "get").then(function(data) {
                    angular.forEach(data.DocGenre, function(value, key) {
                        $scope.status.data.docgenreOptions.push({
                            value: value.value,
                            name: value.desc
                        });
                    });
                });
            }
            //关键词处理
            $scope.invalidTag = function(tag) {
                var len = $scope.KEYWORDS.length;
                var reg = /^[^<>\\\/\'\"]*$/;
                if (len > 9) {
                    $scope.vm.isShowKeywordTips = true;
                    $scope.vm.keywordsTips = "关键词个数不能超过10个";
                    return false;
                } else if (tag.name.length > 20) {
                    $scope.vm.isShowKeywordTips = true;
                    $scope.vm.keywordsTips = "单个关键词长度不能超过20";
                } else if (!reg.test(tag.name)) {
                    $scope.vm.keywordsTips = "不允许使用特殊字符";
                    $scope.vm.isShowKeywordTips = true;
                }
            };
            //不发稿费
            $scope.updateCKSelection = function() {
                $scope.list.ISNOPAYMENT === "1" ? $scope.list.ISNOPAYMENT = "0" : $scope.list.ISNOPAYMENT = "1";
            };
            //稿件体裁
            $scope.draftType = function() {
                $scope.list.DOCGENRE = angular.copy($scope.GENREDOC).value;
            };
            ////动态加载指令
            // function loadDirective() {
            //     var ueditor = '<ueditor list="list"></ueditor>';
            //     // ueditor = $compile(ueditor)($scope);
            //     // $($(angular.element(document)).find('ueditorLocation')).append(ueditor);
            //     var draftList = '<editor-dir meta-data-id="{{list.METADATAID}}" editor-json="list.FGD_EDITINFO" show-all-tips="showAllTips" editor-form="atlasForm"></editor-dir>' +
            //         '<editor-auth-dir author="list.FGD_AUTHINFO"></editor-auth-dir>';
            //     draftList = $compile(draftList)($scope);
            //     $($(angular.element(document)).find('editor')).append(draftList);
            // }
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
            /**
             * [getVersion description]获取流程版本与操作日志
             * @return {[type]} [description]
             */
            function getVersion() {
                editingCenterService.getEditVersionTime($stateParams.metadata, $scope.page, $scope.status.copyVersion).then(function(data) {
                    $scope.status.version = data;
                    $scope.page = data.page;
                    $scope.status.copyVersion = data.copyArray;
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
                    if (angular.isDefined($scope.status.comment.comment[$scope.status.comment.comment.length - 1]) && $filter('date')($scope.status.comment.comment[$scope.status.comment.comment.length - 1].day, "yyyy-MM-dd").toString() == $filter('date')(data.comment[0].day, "yyyy-MM-dd").toString()) {
                        $scope.status.comment.comment[$scope.status.comment.comment.length - 1].times = $scope.status.comment.comment[$scope.status.comment.comment.length - 1].times.concat(data.comment[0].times);
                        data.comment.shift();
                    }
                    $scope.status.comment['comment'] = $scope.status.comment['comment'].concat(data.comment);
                    $scope.status.comment.hasMore = data.hasMore;
                    for (var i in data.voiceObj) {
                        $scope.status.comment.voiceObj[i] = data.voiceObj[i];
                    }
                })
            }
            /**
             * [getComment description]获取评审意见
             * @return {[type]} [description]
             */
            $scope.getLoadMoreComment = function() {
                $scope.status.comment.currPage += 1;
                getComment($stateParams.metadataid, $scope.status.comment.currPage);
            };
            /**
             * [trustUrl description]信任url
             */
            $scope.trustUrl = $sce.trustAsResourceUrl;
            /**
             * [initBtn description]获得底部可以操作的权限按钮
             * @return {[type]} [description]
             */
            function initBtn() {
                editingCenterService.getSiteInfo($stateParams.paperid).then(function(data) {
                    $scope.status.newInformation = data;
                    $scope.methodnameArray = ['paper.dyg', 'paper.jrg', 'paper.sbg', 'paper.yqg'];
                    $scope.dictionaryArray = [newsDictionBtnService.initStandDraftBtn(), newsDictionBtnService.initTodayDraftBtn(), newsDictionBtnService.initPageDraftBtn()];
                    $scope.newsArray = newsEditBtnService.initDraftArrays()[$stateParams.newspapertype];
                    if (angular.isDefined($stateParams.isfusion) || ($stateParams.newspapertype == 2 && $scope.status.newInformation.ISDUOJISHEN == 0)) {
                        $scope.newsArray.length = 1;
                    }
                    initeditctrBtnsService.initNewsData($scope.methodnameArray[$stateParams.newspapertype], $stateParams.paperid).then(function(data) {
                        $scope.btnStatus = initeditctrBtnsService.initBtns(data, $scope.dictionaryArray[$stateParams.newspapertype]);
                        $scope.arrayBtn = filterEditctrBtnsService.filterBtn($scope.btnStatus, $scope.newsArray);
                        addBtn();
                    });
                });
            }
            //新增保存与关闭按钮
            function addBtn() {
                $scope.arrayBtn.unshift({
                    RIGHTINDEX: "save",
                    OPERDESC: "保存",
                    OPERNAME: "保存",
                    OPERFUN: "save"
                });
                $scope.arrayBtn.push({
                    RIGHTINDEX: "close",
                    OPERDESC: "关闭",
                    OPERNAME: "",
                    OPERFUN: "close"
                });
            }
            //上版操作
            $scope.newsDraftShangBan = function() {
                var methodname = ['doShangBanDaiYong', 'doShangBanJinRi'];
                var transferData = {
                    "title": "上版",
                    "opinionTit": "上版意见",
                    "selectedArr": [$scope.list],
                    "isShowDate": true,
                    "PaperId": $stateParams.paperid,
                    "queryMethod": ""
                };

                editNewspaperService.changeLayoutDraft(transferData, function(result) {
                    var shangbanParams = {
                        serviceid: "mlf_paper",
                        oprtime: "1m",
                        methodname: methodname[$stateParams.newspapertype],
                        SrcDocIds: result.srcdocids,
                        BanMianID: result.banmianid,
                        SrcBanMianIds: result.SrcBanMianIds,
                        PubDate: result.dateStr,
                        Option: result.option
                    };
                    save().then(function() {
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), shangbanParams, "get").then(function(data) {
                            trsconfirm.alertType("上版成功", "", "success", false, function() {
                                storageListenerService.addListenerToNewspaper("shangban");
                                $window.close();
                            });
                        }, function(data) {
                            trsconfirm.multiReportsAlert(data, function() {
                                storageListenerService.addListenerToNewspaper("shangban");
                                $window.close();
                            });
                        });
                    });
                });
            };
            //转版操作
            $scope.newsDraftZhuanBan = function() {
                var transferData = {
                    "title": "转版",
                    "opinionTit": "转版意见",
                    "selectedArr": [$scope.list],
                    "PaperId": $stateParams.paperid,
                    "queryMethod": ""
                };
                editNewspaperService.changeLayoutDraft(transferData, function(result) {
                    var zhuanbanParams = {
                        serviceid: "mlf_paper",
                        methodname: "doZhuanBan",
                        oprtime: "1m",
                        SrcDocIds: result.srcdocids,
                        BanMianID: result.banmianid,
                        SrcBanMianIds: result.SrcBanMianIds,
                        PubDate: result.dateStr,
                        Option: result.option
                    };
                    save().then(function() {
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), zhuanbanParams, "get").then(function(data) {
                            trsconfirm.alertType("转版成功", "", "success", false, function() {
                                storageListenerService.addListenerToNewspaper("zhuanban");
                                $window.close();
                            });
                        }, function(data) {
                            trsconfirm.multiReportsAlert(data, function() {
                                storageListenerService.addListenerToNewspaper("zhuanban");
                                $window.close();
                            });
                        });
                    });
                });

            };
            //待用操作
            $scope.newsDraftDaiYong = function() {
                var transferData = {
                    "title": "待用",
                    "opinionTit": "待用说明",
                    "items": [$scope.list],
                    "PaperId": $stateParams.paperid,
                    "queryMethod": ""
                };
                editNewspaperService.cancelSignedViews(transferData, function(result) {
                    var params = {
                        'SrcDocIds': result.SrcDocIds,
                        'Option': result.opinion ? result.opinion : "",
                        "serviceid": "mlf_paper",
                        "methodname": "doDaiYong",
                        "SrcBanMianIds": result.SrcBanMianIds
                    };
                    save().then(function() {
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                            trsconfirm.alertType("待用成功", "", "success", false, function() {
                                storageListenerService.addListenerToNewspaper("daiyong");
                                $window.close();
                            });
                        }, function(data) {
                            trsconfirm.multiReportsAlert(data, function() {
                                storageListenerService.addListenerToNewspaper("daiyong");
                                $window.close();
                            });
                        });
                    });
                });
            };
            //撤稿操作
            $scope.newsDraftCheGao = function() {
                var transferData = {
                    "title": "撤稿",
                    "opinionTit": "撤稿原因",
                    "items": [$scope.list],
                    "PaperId": $stateParams.paperid,
                    "queryMethod": ""
                };
                editNewspaperService.cancelSignedViews(transferData, function(result) {
                    var params = {
                        'SrcDocIds': result.SrcDocIds,
                        'Option': result.opinion ? result.opinion : "",
                        "serviceid": "mlf_paper",
                        "methodname": "doCheGao"
                    };
                    save().then(function() {
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                            trsconfirm.alertType("撤稿成功", "", "success", false, function() {
                                storageListenerService.addListenerToNewspaper("chegao");
                                $window.close();
                            });
                        });
                    });
                });
            };
            //签发照排操作
            $scope.newsDraftZhaoPai = function() {
                save().then(function() {
                    singZhaopai([$scope.list]);
                });
            };
            /**
             * [singZhaopai description]稿件签发照排
             * @param  {[array]} item [description]所选稿件
             * @return {[type]}      [description]null
             */
            function singZhaopai(item) {
                if ($scope.status.newInformation.ISZHAOPAI === '0') {
                    editNewspaperService.stopSignZp(item, function(result) {
                        storageListenerService.addListenerToNewspaper("qianfazp");
                        $window.close();
                    }, function(result) {});
                } else {
                    editNewspaperService.useSignZP(item, function(result) {
                        storageListenerService.addListenerToNewspaper("qianfazp");
                        $window.close();
                    }, function(result) {
                        result.paperid = $stateParams.paperid;
                    });
                }
            }
            /*****************************************图片相关处理开始*******************************************************************************/
            /**
             * 编辑裁剪图片
             */
            function swapItems(list, index1, index2) {
                list[index1] = list.splice(index2, 1, list[index1])[0];
            }
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
                window.editCallback = newsPicCallback;
            };

            function newsPicCallback(params) {
                $scope.list.DOC_PICTURELIST[params.photoIndex].APPFILE = params.imageName;
                $scope.list.DOC_PICTURELIST[params.photoIndex].PERPICURL = "/wcm/file/read_image.jsp?FileName=" + params.imageName + "&r=" + new Date().getTime();
                delete $scope.list.DOC_PICTURELIST[params.photoIndex].APPENDIXID;
                editPhotoCallback();
            }
            /*批量上传图片模态框*/
            $scope.multiImgsUploader = function() {
                editingCenterService.imageUpload(function(result) {
                    $scope.list.DOC_PICTURELIST = $scope.list.DOC_PICTURELIST.concat(result);
                });
            };
            /**
             * [editImage description]编辑图片模态窗
             * @param  {[obj]} image [description]被选中的图片
             * @param  {[num]} index [description]数组下标
             * @return {[type]}       [description]
             */
            $scope.editImage = function(image, index) {
                editingCenterService.editUploaderImg(image, function(result) {
                    $scope.list.DOC_PICTURELIST[index].PERPICURL = result.PERPICURL;
                    $scope.list.DOC_PICTURELIST[index].APPFILE = result.APPFILE;
                    // $scope.list.DOC_PICTURELIST[index].APPDESC = result.APPDESC;
                    delete $scope.list.DOC_PICTURELIST[index].APPENDIXID;
                });
            };
            /**
             * [reWriteImgData description]保存后回写图片数组
             * @param  {[obj]} data [description]保存后返回的图片数组
             * @return {[type]}      [description]null
             */
            function reWriteImgData(data) {
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

            //全选批量上传后的图片
            $scope.selectAllImg = function() {
                $scope.status.uploaderImgSelected = $scope.status.uploaderImgSelected.length === $scope.list.DOC_PICTURELIST.length ? [] : [].concat($scope.list.DOC_PICTURELIST);
            };
            //选择批量上传后的图片
            $scope.selectImg = function(item) {
                if ($scope.status.uploaderImgSelected.indexOf(item) < 0) {
                    $scope.status.uploaderImgSelected.push(item);
                } else {
                    $scope.status.uploaderImgSelected.splice($scope.status.uploaderImgSelected.indexOf(item), 1);
                }
            };
            //选择批量上传后的图片结束

            //批量删除上传后的图片
            $scope.batchDelete = function() {
                trsconfirm.confirmModel('删除', '是否确认删除选择的图片', function() {
                    var temp = [];
                    angular.forEach($scope.list.DOC_PICTURELIST, function(data, index, array) {
                        if ($scope.status.uploaderImgSelected.indexOf(data) < 0) {
                            temp.push(data);
                        }
                    });
                    $scope.list.DOC_PICTURELIST = temp;
                    $scope.status.uploaderImgSelected = [];
                });
            };
            //批量删除上传后的图片结束

            //单个删除批量上传后的图片
            $scope.deleteImg = function(ID) {
                trsconfirm.confirmModel('删除', '是否确认删除图片', function() {
                    $scope.list.DOC_PICTURELIST.splice(ID, 1);
                });
            };
            /**
             * [examImg description]图集稿必须上传图片
             * @return {[boolean]} [description]标识位
             */
            function hasImg() {
                var flag = $scope.list.DOC_PICTURELIST.length <= 0 ? false : true;
                return flag;
            }
            /*****************************************图片相关处理开始*******************************************************************************/
        }
    ]).controller('trsPhotoCropCtrl', ["$scope", "$compile", "$timeout", "params", "$modalInstance",
        function($scope, $compile, $timeout, params, $modalInstance) {
            editPhotoCallback = function() {
                $scope.$close();
            };
        }
    ]);
