/**
 * created by CC 2016-07-19
 */
"use strict";
angular.module('editingCenterSubjectModule', ['mgcrea.ngStrap.button']).
controller('EditingCenterSubjectController', editController);
editController.$injector = ["$scope", "$q", "$timeout", "$state", "$filter", "$validation", "$stateParams", "$window", "trsHttpService", "trsconfirm", "editingCenterAppService", "editingCenterService", "jsonArrayToStringService", "initAddMetaDataService", "storageListenerService", "trsspliceString", "trsSelectDocumentService", "initAppRequiredBtnService", "initeditctrBtnsService", "appDictionaryBtnService", "filterEditctrBtnsService"];

function editController($scope, $q, $timeout, $state, $filter, $validation, $stateParams, $window, trsHttpService, trsconfirm, editingCenterAppService, editingCenterService, jsonArrayToStringService, initAddMetaDataService, storageListenerService, trsspliceString, trsSelectDocumentService, initAppRequiredBtnService, initeditctrBtnsService, appDictionaryBtnService, filterEditctrBtnsService) {
    initStatus();
    initData();
    $window.onbeforeunload = function() {
        var specialGroupIds = trsspliceString.spliceString($scope.data.groups, "SPECIALGROUPID", ",");
        groupDelect(specialGroupIds).then(function() {
            var opened = $window.open('about:blank', '_self');
            opened.close();
        });
    };
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
            openBtn: true,
        };
        $scope.data = {
            listStyle: editingCenterAppService.initListStyle(),
            label: editingCenterAppService.initLabel(),
            displaySet: editingCenterAppService.initDisplaySet(),
            groups: [],
            groupNews: [],
            KEYWORDS: [],
        };
        $scope.params = {
            "serviceid": "mlf_appmetadata",
            "methodname": "getSpecialDoc",
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
        initBtnArray();
    }

    /**
     * [initEditData description]初始化编辑页数据
     * @return {[type]} [description]
     */
    function initEditData() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
            $scope.list = data;
            $scope.list.FZ_SPECIALGROUPINFO = null;
            reWriteImg();
            initKeyWords();
            getGroup();
            getKeyWords();
        });
    }
    /**
     * [initNewData description]初始化新建页数据
     * @return {[type]} [description]
     */
    function initNewData() {
        $scope.list = initAddMetaDataService.initSubject();
    }
    /**
     * [reWriteImg description]回写图片列表数据
     * @return {[type]} [description]
     */
    function reWriteImg() {
        var imgArray = ["FOCUSIMAGE", "LISTPICS", "FIGURE"];
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

    //获取关键词开始
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
     * [updateCKSelection description]切换checkbox
     * @param  {[string]} attribute [description]需要切换的属性
     * @return {[type]}           [description]
     */
    $scope.updateCKSelection = function(attribute) {
        $scope.list[attribute] = $scope.list[attribute] == 0 ? 1 : 0;
    };
    /**
     * [save description]保存函数
     * @return {[type]} [description]
     */
    $scope.save = function() {
        trsconfirm.sensitiveWords($stateParams.chnldocid, function() {
            save(true);
        });
    };

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
        list.SERVICEID = "mlf_appmetadata";
        list.METHODNAME = "saveSpecialDoc";
        list.SpecialGroupIds = trsspliceString.spliceString($scope.data.groups, "SPECIALGROUPID", ",");
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
        $stateParams.metadataid = $scope.list.METADATAID = data.METADATAID;
        $stateParams.chnldocid = $scope.list.CHNLDOCID = data.CHNLDOCID;
        if (flag) {
            storageListenerService.addListenerToApp("save");
            $state.transitionTo($state.current, $stateParams, {
                reload: false
            });
            trsconfirm.saveModel("保存成功", "", "success");
        } else {
            $scope.params = {
                ChannelId: $stateParams.CHANNELID,
                ObjectIds: $stateParams.CHNLDOCID,
                ChnlDocIds: $stateParams.CHNLDOCID,
                MetaDataIds: $stateParams.METADATAID,
                serviceid: "mlf_appoper",
            };
        }
    }

    /*保存函数*/
    function save(flag) {
        var deferred = $q.defer();
        $validation.validate($scope.subjectForm).success(function() {
            $scope.subjectForm.$setPristine();
            var list = dealAttribute();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), list, "post").then(function(data) {
                manageListAfterSave(data, flag);
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
        }).error(function() {
            editingCenterService.checkSaveError($scope.subjectForm); //定位输入错的表单位置
            $timeout(function() {
                trsconfirm.saveModel("提交失败", "请检查填写项", "error");
            }, 100);
        });
        return deferred.promise;
    }
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
        editingCenterService.closeWinow($scope.subjectForm.$dirty, false).then(function() {
            save().then(function() {
                storageListenerService.addListenerToApp("save");
                var opened = $window.open('about:blank', '_self');
                opened.close();
            });
        }, function() {
            var specialGroupIds = trsspliceString.spliceString($scope.data.groups, "SPECIALGROUPID", ",");
            groupDelect(specialGroupIds).then(function() {
                var opened = $window.open('about:blank', '_self');
                opened.close();
            });  
        });
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

    /**
     * [addGroup description]新增分组
     */
    function addGroup() {
        var params = {
            serviceid: "mlf_specialgroup",
            methodname: "addGroupInfoFromData",
            GroupName: $scope.data.groupName,
            MetaDataId: $scope.list.METADATAID,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
            getGroup();
        });
    }
    /**
     * 分组新闻相关操作来时
     */
    /**
     * [addGrouping description]添加分组
     * @param {[type]} event [description]
     */
    $scope.newGroup = function(ev) {
        if (angular.isDefined(ev) && ev.keyCode == 13) {
            if($scope.data.groupName.length>50||$scope.data.groupName.length<1) {
                trsconfirm.alertType("创建分组失败", "分组长度必须在1-50个字符之间！", "error", false);
                return;
            }
            addGroup();
            $scope.data.groupName = "";
        }
    };
    /**
     * [selectGroup description]选择分组
     * @param  {[obj]} group [description]分组信息
     * @return {[type]}       [description]
     */
    $scope.selectGroup = function(group) {
        $scope.data.selectedGroup = group;
        getGroupDraft();
    };
    /**
     * [getGroup description]获取分组信息
     * @return {[type]} [description]
     */
    function getGroup() {
        var params = {
            serviceid: "mlf_specialgroup",
            methodname: "querySpecialGroupsFromData",
            MetaDataId: $scope.list.METADATAID,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.groups = data.DATA;
        });
    }
    /**
     * [groupDelect description]删除分组
     * @return {[type]} [description]
     */
    $scope.groupDelect = function() {
        var specialGroupIds = $scope.data.selectedGroup.SPECIALGROUPID;
        trsconfirm.confirmModel("删除分组", "您确定删除此分组", function() {
            groupDelect(specialGroupIds);
        });
    };
    /**
     * [groupDelect description] 删除分组函数
     * @return {[type]} [description]
     */
    function groupDelect(specialGroupIds) {
        var deferred = $q.defer();
        var params = {
            serviceid: "mlf_specialgroup",
            methodname: "deleteSpecialGroupFromData",
            MetaDataId: $scope.list.METADATAID,
            SpecialGroupIds: specialGroupIds,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            getGroup();
            $scope.data.groupNews = [];
            deferred.resolve();
        });
        return deferred.promise;
    }
    /**
     * [upRecord description]分组上移
     * @return {[type]} [description]
     */
    $scope.groupUpRecord = function() {
        upAndDown('up', "groups", $scope.data.selectedGroup);
        recordGroupOrder();
    };
    /**
     * [downRecord description]分组下移
     * @return {[type]} [description]
     */
    $scope.groupDownRecord = function() {
        upAndDown('down', "groups", $scope.data.selectedGroup);
        recordGroupOrder();
    };
    /**
     * [newsUpRecord description]相关新闻上移
     * @return {[type]} [description]
     */
    $scope.newsUpRecord = function() {
        upAndDown('up', "groupNews", $scope.data.selectedNews);
        recordNewsOrder();
    };
    /**
     * [newsDownRecord description]相关新闻下移
     * @return {[type]} [description]
     */
    $scope.newsDownRecord = function() {
        upAndDown('down', "groupNews", $scope.data.selectedNews);
        recordNewsOrder();
    };
    /**
     * [upAndDown description]数组上移下移
     * @param  {[str]} type      [description]上移或者下移
     * @param  {[str]} attribute [description]要改变的数组
     * @param  {[obj]} select    [description]被选中的值
     * @return {[type]}           [description]
     */
    function upAndDown(type, attribute, select) {
        var index = $scope.data[attribute].indexOf(select);
        if (type === "up") {
            if (index === 0) return;
            $scope.data[attribute].splice(index, 1);
            $scope.data[attribute].splice(index - 1, 0, select);
        } else {
            if (index === $scope.data[attribute].length) return;
            $scope.data[attribute].splice(index, 1);
            $scope.data[attribute].splice(index + 1, 0, select);
        }
    }
    /**
     * [recordGroupOrder description]记录分组顺序
     * @return {[type]} [description]
     */
    function recordGroupOrder() {
        var deferred = $q.defer();
        var params = {
            serviceid: "mlf_specialgroup",
            methodname: "addSpecialGroups",
            MetaDataId: $scope.list.METADATAID,
            SpecialGroupIds: trsspliceString.spliceString($scope.data.groups, "SPECIALGROUPID", ","),
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            deferred.resolve();
        });
        return deferred.promise;
    }
    /**
     * [recordNewsOrder description]记录新闻顺序
     * @return {[type]} [description]
     */
    function recordNewsOrder() {
        var deferred = $q.defer();
        if ($scope.data.groupNews.length > 0) {
            var params = {
                serviceid: "mlf_specialgroup",
                methodname: "addDataFromSpecialGroup",
                MetaDataIds: trsspliceString.spliceString($scope.data.groupNews, 'NEWSSPECIALDATAID', ','),
                SpecialGroupId: $scope.data.selectedGroup.SPECIALGROUPID,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                deferred.resolve(data);
            });
        } else {
            deferred.reject();
        }
        return deferred.promise;
    }
    /**
     * [chooseDraftWindow description]稿件选择框
     * @return {[type]} [description]
     */
    $scope.chooseDraftWindow = function() {
        trsSelectDocumentService.trsSelectDocument({
            siteid: $stateParams.siteid,
            relNewsData: $scope.data.groupNews,
            showMetadaId: true
        }, function(result) {
            var params = {
                serviceid: "mlf_specialgroup",
                methodname: "addDataFromSpecialGroup",
                MetaDataIds: trsspliceString.spliceString(result, 'metadataId', ','),
                SpecialGroupId: $scope.data.selectedGroup.SPECIALGROUPID,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
                getGroupDraft();
            });
        });
    };
    /**
     * [getGroupDraft description]获取指定分组下的新闻
     * @return {[type]} [description]
     */
    function getGroupDraft() {
        var params = {
            serviceid: "mlf_specialgroup",
            methodname: "querySpecialGroupNewsFromGroup",
            SpecialGroupID: $scope.data.selectedGroup.SPECIALGROUPID,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.groupNews = data.DATA;
            $scope.data.groupNews = $filter('unique')($scope.data.groupNews, 'NEWSSPECIALDATAID');
            angular.forEach($scope.data.groupNews, function(data, index) {
                data.METADATAID = data.NEWSSPECIALDATAID;
                data.TITLE = data.DOCTITLE;
            });
            $scope.data.selectedNews = $scope.data.groupNews[0];
        });
    }
    /**
     * [newsDetete description]删除指定分组下的新闻
     * @return {[type]} [description]
     */
    $scope.newsDelete = function() {
        var params = {
            serviceid: "mlf_specialgroup",
            methodname: "deleteNewsFromSpecialGroup",
            SpecialGroupId: $scope.data.selectedGroup.SPECIALGROUPID,
            MetaDataIds: $scope.data.selectedNews.NEWSSPECIALDATAID,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            getGroupDraft();
        });
    };
    /**
     * 分组新闻相关操作结束
     */

}
