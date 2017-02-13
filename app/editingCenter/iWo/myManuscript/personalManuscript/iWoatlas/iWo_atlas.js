"use strict";
angular.module('iWoAtlas', [
    'mgcrea.ngStrap.button', 'trsspliceStringModule', 'atlasEditImageModule', 'util.ueditorForAtlas'
]).
controller('iWoAtlasController', iWoAtlasController).
controller('trsPhotoCropCtrl', trsPhotoCropCtrl);
iWoAtlasController.$injector = ["$scope", "$compile", "$window", "$q", "$location", "$anchorScroll", "$timeout", "$modal", "$stateParams", '$sce', "$validation", "$state", "$filter", "trsHttpService", "SweetAlert", "storageListenerService", "initiWoDataService", "initVersionService", "jsonArrayToStringService", "trsconfirm", "trsResponseHandle", "trsspliceString", 'iWoService', 'initSingleSelecet', "myManuscriptService", "editingCenterService", "initeditctrBtnsService", "filterEditctrBtnsService", "iWoinitBtnService", "iWoBtnService", "ueditorService"];
var editCallback = null;
var editPhotoCallback = null;

function iWoAtlasController($scope, $compile, $window, $q, $location, $anchorScroll, $timeout, $modal, $stateParams, $sce, $validation, $state, $filter, trsHttpService, SweetAlert, storageListenerService, initiWoDataService, initVersionService, jsonArrayToStringService, trsconfirm, trsResponseHandle, trsspliceString, iWoService, initSingleSelecet, myManuscriptService, editingCenterService, initeditctrBtnsService, filterEditctrBtnsService, iWoinitBtnService, iWoBtnService, ueditorService) {
    initStatus();
    initData();

    $scope.moveUploadImg = function(index) {
        $scope.list.DOC_PICTURELIST.splice(index, 1);
    };

    function initStatus() {
        $scope.page = {
            CURRPAGE: 1,
            PAGESIZE: 20,
        };
        $scope.status = {
            openBtn: true,
            mediaTypes: [],
            isRequest: true,
            hasVersionTime: false,
            uploaderImgSelected: [],
        };
        $scope.data = {
            docgenre: [],
            selectedImg: {},
            version: [],
            copyVersion: [],
            comment: {
                comment: [],
                voiceObj: {},
                hasMore: false,
                currPage: 1,
            },
        };
        $scope.showAllTips = false;
        $anchorScroll.yOffset = 63;
        $scope.handleBtnClick = function(funname) {
            eval("$scope." + funname + "()");
        };
        initSingleSelecet.getChannelList().then(function(data) {
            $scope.status.mediaTypes = data;
        });
        getDocGenre();
    }

    function initData() {
        storageListenerService.removeListener("iwo");
        if ($stateParams.metadataid) { //判断是新建还是编辑
            iWoService.getPicsDoc($stateParams.metadataid).then(function(data) {
                $scope.list = data;
                $scope.status.incomeData = [{
                    'TITLE': $scope.list.TITLE,
                    'CHNLDOCID': $stateParams.chnldocid,
                    'METADATAID': $stateParams.metadataid
                }];
                loadDirective();
                reWriteImgData($scope.list);
                initKeyWords();
                getVersion();
                //获取评审意见
                getComment($stateParams.metadataid, $scope.data.comment.currPage);
            });
        } else {
            $scope.list = initiWoDataService.initAtlas();
            loadDirective();
            initKeyWords();
        }
        initArrayBtn();
    }
    /**
     * [getDocGenre description]初始化稿件体裁
     * @return {[type]} [description]
     */
    function getDocGenre() {
        iWoService.initData().then(function(data) {
            angular.forEach(data.DocGenre, function(data, key) {
                $scope.data.docgenre.push({
                    value: data.desc,
                    name: data.value
                });
            });
            angular.isDefined($stateParams.chnldocid) ? "" : $scope.list.DOCGENRE = $scope.data.docgenre[0];
        });
    }
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
    /*锚点切换开始*/
    $scope.goto = function(id) {
        $location.hash(id);
        $anchorScroll();
    };
    //组装关键词为数组开始
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
    //组装关键词为数组结束


    //说明引用到全部
    $scope.declareAll = function(index) {
        trsconfirm.confirmModel('同步', "是否确定该条说明应用到其他图片说明", function() {
            var text = $scope.list.DOC_PICTURELIST[index].APPDESC;
            angular.forEach($scope.list.DOC_PICTURELIST, function(data, key) {
                $scope.list.DOC_PICTURELIST[key].APPDESC = text;
            });
        });
    };

    //检验关键词的总个数和总记录长度
    $scope.invalidTag = function(tag) {
        var reg = /^[^<>\\\/\'\"]*$/;
        if (tag.name.length > 20) {
            $scope.isShowKeywordTips = true;
            $scope.data.KEYWORDSTips = "单个关键词长度不能超过20";
        }
    };
    $scope.checkTag = function(tag) {
        var len = $scope.data.KEYWORDS.length;
        if (len == 10) {
            $scope.isShowKeywordTips = true;
            $scope.data.KEYWORDSTips = "关键词个数不能超过10个";
            return false;
        } else {
            $scope.data.KEYWORDSTips = "";
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
        /*if (angular.isDefined($scope.data.KEYWORDSTips) && $scope.data.KEYWORDSTips !== "") {
            $scope.isShowKeywordTips = true;
        }*/
    };
    $scope.save = function() {
        save(true).then(function(data) {
            getVersion($scope.list.METADATAID);
            $scope.status.openBtn = true;
            iWoService.getPicsDoc($stateParams.metadataid).then(function(data) {
                reWriteImgData(data);
                $scope.status.openBtn = true;
                var ue = UE.getEditor('ueditor');
                ue.setContent(data.HTMLCONTENT);
            });
        });
    };
    /**
     * [calculateWordNum description]计算图集稿字数,图集说明字数+各图说字数,但图集说明中的字数为图集说明中输入的字数不为图集稿总字数
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
     * [manageDataBeforeSave description]处理保存前的数据
     * @return {[type]} [description]
     */
    function manageDataBeforeSave() {
        $scope.status.openBtn = false;
        $scope.atlasForm.$setPristine();
        getKeyWords();
        var methodname = ['savePersonalPicsDoc', 'saveReceivedPicsDoc'];
        $scope.list.SERVICEID = "mlf_myrelease";
        $scope.list.METHODNAME = methodname[$stateParams.status];
        $scope.list.DOCRELTIME = $filter('date')(new Date(), "yyyy-MM-dd HH:mm").toString();
        var list = angular.copy($scope.list);
        calculateWordNum(list);
        delete list.RELEVANTNEWS;
        delete list.RELEVANTOFFICIALS;
        delete list.OBJ_VERSION;
        delete list.LOG_OPERATION;
        delete list.FZ_DOCS;
        //处理发稿单作者信息空数据提交问题
        if (angular.isDefined(list.FGD_AUTHINFO[0]) && (!angular.isDefined(list.FGD_AUTHINFO[0].USERNAME) || list.FGD_AUTHINFO[0].USERNAME === "")) {
            list.FGD_AUTHINFO = [];
        }
        //处理发稿单作者信息空数据提交问题
        list = jsonArrayToStringService.jsonArrayToString(list);
        return list;
    }
    /**
     * [manageDataAfterSave description]处理保存后的数据
     * @param  {[obj]} data [description]保存后返回值
     * @param  {[boolean]} flag [description]标识位
     * @return {[type]}      [description]
     */
    function manageDataAfterSave(data, flag) {
        $scope.status.openBtn = true;
        $stateParams.metadataid = $scope.list.METADATAID = data.METADATAID;
        $stateParams.chnldocid = $scope.list.CHNLDOCID = data.CHNLDOCID;
        $scope.status.incomeData = [{
            'TITLE': $scope.list.TITLE,
            'CHNLDOCID': $stateParams.chnldocid,
            'METADATAID': $stateParams.metadataid
        }];
        if (flag) {
            storageListenerService.addListenerToIwo("newsSaved");
            $state.transitionTo($state.current, $stateParams, {
                reload: false
            });
            trsconfirm.saveModel("保存成功", "", "success");

        } else {
            $scope.params = {};
        }
    }

    function saveContent() {
        ueditorService.saveContent($scope.list);
    }

    function save(flag) {
        saveContent();
        var deferred = $q.defer();
        var isHasImg = examImg();
        if (isHasImg === true) {
            $validation.validate($scope.atlasForm.authorForm);
            $scope.atlasForm.$pending = {};
            $validation.validate($scope.atlasForm).
            success(function() {
                var list = manageDataBeforeSave();
                $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do",
                    list, "post").then(function(data) {
                    manageDataAfterSave(data, flag);
                    deferred.resolve(data);
                }, function(data) {
                    $scope.status.openBtn = true;
                    deferred.reject(data);
                });

            }).error(function() {
                $scope.showAllTips = true;
                editingCenterService.checkSaveError($scope.atlasForm); //定位输入错的表单位置
                trsconfirm.saveModel("保存失败", "请检查填写项", "error");
            });
        } else {
            trsconfirm.saveModel("保存失败", "图集稿件必须上传图片", "error");
        }
        return deferred.promise;
    }
    /**
     * [examImg description]图集稿必须上传图片
     * @return {[boolean]} [description]标识位
     */
    function examImg() {
        var flag = $scope.list.DOC_PICTURELIST.length <= 0 ? false : true;
        return flag;
    }
    //多渠道提交触发
    $scope.iWoSubmit = function() {
        save(false).then(function() {
            saveSubmit();
        });
    };
    //共享触发（个人稿库+已收稿库）
    $scope.iWoshare = function() {
        save(false).then(function(data) {
            saveShare(data.METADATAID, data.CHNLDOCID);
        });
    };
    //多渠道提交函数
    function saveSubmit() {
        var methodname = ['personalSubmitMedia', 'receivedSubmitMedia'];
        myManuscriptService.submit($scope.status.incomeData, function() {
            storageListenerService.addListenerToIwo("newsSubmit");
            var opened = $window.open('about:blank', '_self');
            opened.close();
        }, function() {

        }, methodname[$stateParams.status]);
    }
    //多渠道提交函数结束
    //共享函数开始
    function saveShare(metadataid, chnldocid) {
        var shareMethod = ['personalMyShare', 'receivedMyShare'];
        editingCenterService.share(function(data) {
            data.serviceid = 'mlf_myrelease';
            data.methodname = shareMethod[$stateParams.status];
            data.ChnlDocIds = chnldocid;
            data.MetaDataIds = metadataid;
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), data, "post")
                .then(function(data) {
                    trsconfirm.alertType("共享成功", "", "success", false, function() {
                        storageListenerService.addListenerToIwo("newsShared");
                        var opened = $window.open('about:blank', '_self');
                        opened.close();
                    });
                });
        });
    }
    //共享函数结束
    //传稿函数
    function draft() {
        var menthod = ['personalTransferMetaDatas', 'receivedTransferMetaDatas'];
        myManuscriptService.draft("传稿", $scope.status.incomeData, function() {
            storageListenerService.addListenerToIwo("newsPassed");
            var opened = $window.open('about:blank', '_self');
            opened.close();
        }, function() {

        }, menthod[$stateParams.status]);
    }
    //传稿函数结束
    /**
     * [close description]页面关闭
     * @return {[type]} [description]
     */
    $scope.close = function() {
        editingCenterService.closeWinow($scope.atlasForm.$dirty, ueditorService.contentTranscoding($scope.list) != ueditorService.bindContent(), examImg()).then(function() {
            save().then(function() {
                storageListenerService.addListenerToIwo("newsSaved");
                var opened = $window.open('about:blank', '_self');
                opened.close();
            });
        }, function() {
            var opened = $window.open('about:blank', '_self');
            opened.close();
        });
    };
    // 传稿(个人稿库+已收稿库)
    $scope.iWoTransfer = function() {
        save(false).then(function() {
            draft();
        });
    };
    var filter = function(json) {
        var temp = [];
        angular.forEach(json, function(value, key) {
            if (value === true) {
                temp.push(key);
            }
        });
        return temp;
    };
    $scope.togglepayment = function() {
        $scope.list.ISNOPAYMENT = $scope.list.ISNOPAYMENT === '1' ? '0' : '1';
    };
    $scope.oringin = function(list) {
        $scope.atlasForm.$dirty = true;
        list.ORIGINAL = list.ORIGINAL === '1' ? '0' : '1';
        if (angular.isUndefined($stateParams.chnldocid) && list.ORIGINAL === '1') {
            list.ISNOPAYMENT = '0'; //判断为原创稿的话需要默认发稿费  
        }
    };
    $scope.toggleRadio = function(item) {
        $scope.list.MEDIATYPES = item.value;
    };

    function swapItems(list, index1, index2) {
        list[index1] = list.splice(index2, 1, list[index1])[0];
    }
    /*****************************************图片相关处理开始*******************************************************************************/
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
        window.editCallback = iwoAtalsCallback;
    };

    function iwoAtalsCallback(params) {
        $scope.list.DOC_PICTURELIST[params.photoIndex].APPFILE = params.imageName;
        $scope.list.DOC_PICTURELIST[params.photoIndex].PERPICURL = "/wcm/file/read_image.jsp?FileName=" + params.imageName + "&r=" + new Date().getTime();
        delete $scope.list.DOC_PICTURELIST[params.photoIndex].APPENDIXID;
        editPhotoCallback();
    }
    /**********************************图片相关处理结束*************************************************************/
    //初始化权限按钮
    function initArrayBtn() {
        $scope.methodnameArray = ['iwo.personal', 'iwo.received'];
        $scope.dictionaryArray = [iWoBtnService.initIwoPersonBtn(), iWoBtnService.initIwoReceiveBtn()];
        $scope.iWoBtns = iWoinitBtnService.initBtnArrays()[$stateParams.status];
        initeditctrBtnsService.initIwoData($scope.methodnameArray[$stateParams.status]).then(function(data) {
            $scope.btnStatus = initeditctrBtnsService.initBtns(data, $scope.dictionaryArray[$stateParams.status]);
            $scope.arrayBtn = filterEditctrBtnsService.filterBtn($scope.btnStatus, $scope.iWoBtns);
            addBtn();
        });
    }
    //新增保存关闭按钮
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
     * [getSuggestions description]获取suggestion
     * @param  {[str]} viewValue [description]输入框内输入值
     * @return {[type]}           [description]
     */
    $scope.getSuggestions = function(viewValue) {
        var searchUsers = {
            serviceid: "mlf_website",
            methodname: "getReleaseSource",
            SrcName: viewValue,
            SiteId: $stateParams.siteid,
        };
        if (viewValue !== '') {
            return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), searchUsers, "post").then(function(data) {
                return data;
            });
        }
    };
    /**
     * [description]Suggestion 监听
     */
    $scope.$watch('list.NEWSSOURCES', function(newValue, oldValue, scope) {
        if (!angular.isObject(newValue)) {
            newValue = {
                SRCNAME: newValue,
                SOURCEID: "0"
            };
        }
        if (angular.isDefined($scope.list)) {
            $scope.list.NEWSSOURCES = newValue;
        }
    });

    $scope.getKeywordsOrAbstract = function(type) {
        editingCenterService.getKeywordsOrAbstract(type, ueditorService.bindContent()).then(function(data) {
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
            // $scope.list.ABSTRACT = data.content.join("");
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
}
trsPhotoCropCtrl.$injector = ["$scope", "$compile", "$timeout", "params", "$modalInstance"];

function trsPhotoCropCtrl($scope, $compile, $timeout, params, $modalInstance) {
    editPhotoCallback = function() {
        $scope.$close();
    };
}
