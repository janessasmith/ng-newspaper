"use strict";
angular.module('editCenterAtlas', [
    'mgcrea.ngStrap.button',
    'atlasMultiImagesUploaderModule'
]).
controller('EditCenterAtlasController', atlasController);
atlasController.$injector = ["$scope", '$compile', '$window', 'localStorageService', '$q', "$anchorScroll", "$timeout", "$modal", "$stateParams", "$validation", "$state", "trsHttpService", "initAddMetaDataService", "initVersionService", "jsonArrayToStringService", "trsconfirm", "trsResponseHandle", "initeditctrBtnsService", "editingCenterAppService", "editingCenterService", "storageListenerService", "initAppRequiredBtnService", "appDictionaryBtnService", "filterEditctrBtnsService"];
var editCallback = null;
var editPhotoCallback = null;

function atlasController($scope, $compile, $window, localStorageService, $q, $anchorScroll, $timeout, $modal, $stateParams, $validation, $state, trsHttpService, initAddMetaDataService, initVersionService, jsonArrayToStringService, trsconfirm, trsResponseHandle, initeditctrBtnsService, editingCenterAppService, editingCenterService, storageListenerService, initAppRequiredBtnService, appDictionaryBtnService, filterEditctrBtnsService) {
    initStatus();
    initData();
    /**
     * [initStatus description]初始化稿件状态
     * @return {[type]} [description]
     */
    function initStatus() {
        $scope.page = {
            CURRPAGE: 1,
            PAGESIZE: 20,
        };
        $scope.status = {
            uploaderImgSelected: [],
            openBtn: true,
        };
        $scope.status.hasVersionTime = angular.isDefined($stateParams.chnldocid) ? true : false;
        $scope.data = {
            copyVersion: [],
            listStyle: editingCenterAppService.initListStyle(),
            label: editingCenterAppService.initLabel(),
            commentSet: editingCenterAppService.initCommentSet(),
            contributorsOne: editingCenterAppService.initContributorsOne(),
            belongChannel: editingCenterAppService.initBelongChannel(),
            docGenre: editingCenterAppService.initDocGenre(),
            KEYWORDS: [],
        };
        $scope.params = {
            "serviceid": "mlf_appmetadata",
            "methodname": "getPicsDoc",
            "ChnlDocId": $stateParams.chnldocid
        };
        $scope.handleBtnClick = function(funname) {
            eval("$scope." + funname + "()");
        };
    }
    /**
     * [initData description]初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        angular.isDefined($stateParams.chnldocid) ? initEditData() : initNewData();
        loadDirective();
        initBtnArray();

    }
    /**
     * [initEditData description]初始化编辑页数据
     * @return {[type]} [description]
     */
    function initEditData() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
            $scope.list = data;
            reWriteImg();
            getVersion();
            initKeyWords();
        });
    }
    /**
     * [initNewData description]初始化新建页数据
     * @return {[type]} [description]
     */
    function initNewData() {
        $scope.list = initAddMetaDataService.initAtlas();
    }
    /**
     * 图集稿新增代码与重构开始
     * 
     */
    /**
     * [reWriteImg description]回写图片列表数据
     * @return {[type]} [description]
     */
    function reWriteImg() {
        var imgArray = ["DOC_PICTURELIST", "FOCUSIMAGE", "LISTPICS"];
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
    //空格增加关键词
    $scope.blank = function(e) {
        if (e.keyCode == 32 && $scope.list.KEYWORDS.indexOf($scope.keywordTxt) < 0) {
            $scope.list.KEYWORDS.push($scope.keywordTxt);
            $scope.keywordTxt = "";
        }

    };
    //删除关键词
    $scope.delete = function(record) {
        $scope.list.KEYWORDS.splice(record, 1);
    };
    //检验关键词的总个数和总记录长度
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
            });
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
        /*if (angular.isDefined($scope.keywordsTips) && $scope.keywordsTips !== "") {
            $scope.isShowKeywordTips = true;
        }*/
    };
    //初始化关键词开始
    function initKeyWords() {
        if ($scope.list.KEYWORDS !== "") {
            var KEYWORDS = $scope.list.KEYWORDS.split(",");
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
     * [getKeyWords description]获取关键词
     * @return {[type]} [description]
     */
    function getKeyWords() {
        $scope.list.KEYWORDS = "";
        angular.forEach($scope.data.KEYWORDS, function(data, index, array) {
            if (index != ($scope.data.KEYWORDS.length - 1)) {
                $scope.list.KEYWORDS += data.name + ",";
            } else {
                $scope.list.KEYWORDS += data.name;
            }
        });
    }
    /**
     * [deleteUploaderImg description]删除上传后的图片
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
     * [toggleFoucesImg description]切换显示焦点图
     * @return {[type]} [description]
     */
    $scope.toggleFoucesImg = function() {
        $scope.list.ISFOCUSIMAGE = $scope.list.ISFOCUSIMAGE == 0 ? 1 : 0;
    };
    /*批量上传图片模态框*/
    $scope.multiImgsUploader = function() {
        editingCenterService.imageUpload(function(result) {
            $scope.list.DOC_PICTURELIST = $scope.list.DOC_PICTURELIST.concat(result);
        });
    };
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
    //单个删除批量上传后的图片
    $scope.deleteImg = function(ID) {
        trsconfirm.confirmModel('删除', '是否确认删除图片', function() {
            $scope.list.DOC_PICTURELIST.splice(ID, 1);
        });
    };
    //说明引用到全部
    $scope.declareAll = function(index) {
        trsconfirm.confirmModel('同步', "是否确定该条说明应用到其他图片说明", function() {
            var text = $scope.list.DOC_PICTURELIST[index].APPDESC;
            angular.forEach($scope.list.DOC_PICTURELIST, function(data, key) {
                $scope.list.DOC_PICTURELIST[key].APPDESC = text;
            });
        });
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

    function swapItems(list, index1, index2) {
        list[index1] = list.splice(index2, 1, list[index1])[0];
    }
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
     * 编辑裁剪图片
     */
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
        window.editCallback = appAtalsCallback;
    };
    /**
     * [updateCKSelection description]是否发稿费
     * @return {[type]} [description]
     */
    $scope.updateCKSelection = function() {
        $scope.list.ISNOPAYMENT = $scope.list.ISNOPAYMENT == 0 ? 1 : 0;
    };
    /**
     * [loadDirective description]动态加载指令
     * @return {[type]} [description]
     */
    function loadDirective() {
        var draftList = '<editor-dir meta-data-id="{{list.METADATAID}}" editor-json="list.FGD_EDITINFO" show-all-tips="showAllTips" editor-form="newsForm"></editor-dir>' +
            '<editor-auth-dir author="list.FGD_AUTHINFO"></editor-auth-dir>';
        draftList = $compile(draftList)($scope);
        $($(angular.element(document)).find('editor')).append(draftList);
    }
    /*点击保存*/
    $scope.save = function() {
        trsconfirm.sensitiveWords($stateParams.chnldocid, function() {
            save(true).then(function(data) {
                getVersion($scope.list.METADATAID);
            });
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
        editingCenterService.closeWinow($scope.atlasForm.$dirty, false).then(function() {
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
     * [manangeListBeforeSave description]保存前检查图片
     * @return {[type]} [description]
     */
    function manangeListBeforeSave() {
        $validation.validate($scope.atlasForm.authorForm);
        $scope.atlasForm.$pending = {};
    }
    /**
     * [dealAttribute description]处理属性
     * @return {[obj]} [description]list对象
     */
    function dealAttribute() {
        getKeyWords();
        var list = angular.copy($scope.list);
        $scope.status.openBtn = false;
        list.LISTPICS = editingCenterAppService.manageListpics(list.LISTPICS);
        list = jsonArrayToStringService.jsonArrayToString(list);
        //处理发稿单作者信息空数据提交问题
        if (angular.isDefined(list.FGD_AUTHINFO[0]) && (!angular.isDefined(list.FGD_AUTHINFO[0].USERNAME) || list.FGD_AUTHINFO[0].USERNAME === "")) {
            list.FGD_AUTHINFO = [];
        }
        list.serviceid = "mlf_appmetadata";
        list.methodname = "savePicsDoc";
        return list;
    }
    /**
     * [manageListAfterSave description]保存后处理数据 
     * @param  {[obj]} data [description]保存后的返回值
     * @param  {[boolean]} flag [description]标志位
     * @return {[type]}      [description]
     */
    function manageListAfterSave(data, flag) {
        $scope.status.openBtn = true;
        $scope.list.METADATAID = data.METADATAID;
        $scope.list.CHNLDOCID = data.CHNLDOCID;
        $stateParams.metadataid = angular.isDefined($stateParams.metadataid) ? $stateParams.metadataid : data.METADATAID;
        $stateParams.chnldocid = angular.isDefined($stateParams.chnldocid) ? $stateParams.chnldocid : data.CHNLDOCID;
        $stateParams.channelid = angular.isDefined($stateParams.channelid) ? $stateParams.channelid : $scope.list.CHANNELID;
        if (flag) {
            storageListenerService.addListenerToApp("save");
            $state.transitionTo($state.current, $stateParams, {
                reload: false
            });
            trsconfirm.saveModel("保存成功", "", "success");
        } else {
            $scope.params = {
                serviceid: "mlf_appoper",
                ChannelId: $scope.list.CHANNELID,
                ChnlDocIds: data.CHNLDOCID,
                ObjectIds: data.CHNLDOCID,
                MetaDataIds: data.METADATAID
            };
        }
    }
    /**
     * [examImg description]图集稿必须上传图片
     * @return {[boolean]} [description]标识位
     */
    function examImg() {
        var flag = $scope.list.DOC_PICTURELIST.length <= 0 ? false : true;
        return flag;
    }
    /*保存函数*/
    function save(flag) {
        var deferred = $q.defer();
        var isHasImg = examImg();
        if (isHasImg) {
            manangeListBeforeSave();
            $validation.validate($scope.atlasForm).success(function() {
                $scope.atlasForm.$setPristine();
                var list = dealAttribute();
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), list, "post").then(function(data) {
                    manageListAfterSave(data, flag);
                    deferred.resolve(data);
                }, function(data) {
                    deferred.reject(data);
                });
            }).error(function() {
                editingCenterService.checkSaveError($scope.atlasForm); //定位输入错的表单位置
                $timeout(function() {
                    trsconfirm.saveModel("提交失败", "请检查填写项", "error");
                }, 100);
            });
        } else {
            $timeout(function() {
                trsconfirm.saveModel("提交失败", "图集稿必须上传图片", "error");
            }, 100);
        }
        return deferred.promise;
    }
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

    function appAtalsCallback(params) {
        $scope.list.DOC_PICTURELIST[params.photoIndex].APPFILE = params.imageName;
        $scope.list.DOC_PICTURELIST[params.photoIndex].PERPICURL = "/wcm/file/read_image.jsp?FileName=" + params.imageName + "&r=" + new Date().getTime();
        delete $scope.list.DOC_PICTURELIST[params.photoIndex].APPENDIXID;
        editPhotoCallback();
    }

}
trsPhotoCropCtrl.$injector = ["$scope", "$compile", "$timeout", "params", "$modalInstance"];

function trsPhotoCropCtrl($scope, $compile, $timeout, params, $modalInstance) {
    editPhotoCallback = function() {
        $scope.$close();
    };
}
