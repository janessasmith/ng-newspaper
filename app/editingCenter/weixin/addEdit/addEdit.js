"use strict";
angular.module('weixinEditModule', []).
controller('WeiXinEditCtrl', ['$scope', '$compile', "$state", "$stateParams", "$timeout", "$q", "$filter", "$validation", "$window", "trsHttpService", "ueditorService", "jsonArrayToStringService", "editingCenterService", "trsconfirm", "initWeiXinDataService", "WeiXininitService", "storageListenerService", "initWechatNewsService", "initeditctrBtnsService", "wechatBtnService", "filterEditctrBtnsService",
    function($scope, $compile, $state, $stateParams, $timeout, $q, $filter, $validation, $window, trsHttpService, ueditorService, jsonArrayToStringService, editingCenterService, trsconfirm, initWeiXinDataService, WeiXininitService, storageListenerService, initWechatNewsService, initeditctrBtnsService, wechatBtnService, filterEditctrBtnsService) {
        var ue; //百度编辑器
        initStatus();
        initData();

        function initStatus() {
            $scope.page = {
                CURRPAGE: 1,
                PAGESIZE: 20
            };
            $scope.status = {
                support: {
                    content: "" //提交给辅助写作的纯文本
                },
                hasVersionTime: false, //是否存在流程版本,
                wechatTemplate: ""
            };
            $scope.data = {
                version: [],
                copyVersion: [],
                lastVersionid: "",
                DocGenre: WeiXininitService.initDocGenre(),
            };
        }

        function initData() {
            if ($stateParams.metadataid) {
                //编辑
                $scope.params = {
                    "serviceid": "mlf_wechat",
                    "methodname": "getNewsDoc",
                    "MetaDataId": $stateParams.metadataid
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                    $scope.list = data;
                    //获取流程版本
                    getVersion().then(function(data) {
                        loadDirective();
                    });
                    initKeyWords();
                });
            } else {
                //新建
                $scope.list = initWeiXinDataService.initNews();
                loadDirective();
                initKeyWords();
            }
            initBtnArray();
            $scope.handleBtnClick = function(funname) {
                eval("$scope." + funname + "()");
            };
        }

        //初始化底部功能按钮
        function initBtnArray() {
            //所需权限初始化
            $scope.wechatBtns = initWechatNewsService.initWechatBtns()[$stateParams.platform];
            //查询权限方法
            $scope.methodArrary = ['wechat.daibian', 'wechat.daishen', 'wechat.yiqianfa'];
            initeditctrBtnsService.initWechatData($stateParams.channelid, $scope.methodArrary[$stateParams.platform]).then(function(data) {
                $scope.dictionaryBtn = [wechatBtnService.initWechatCompBtn(), wechatBtnService.initWechatPenBtn(), wechatBtnService.initWechatSignBtn()];
                $scope.btnStatus = initeditctrBtnsService.initBtns(data, $scope.dictionaryBtn[$stateParams.platform]);
                $scope.arrayBtn = filterEditctrBtnsService.filterBtn($scope.btnStatus, $scope.wechatBtns);
                addBtn();
            });
        }

        //新增预览与关闭按钮
        function addBtn() {
            $scope.arrayBtn.unshift({
                RIGHTINDEX: "save",
                OPERDESC: "保存",
                OPERNAME: "",
                OPERFUN: "save"
            });
            $scope.arrayBtn.push({
                RIGHTINDEX: "close",
                OPERDESC: "关闭",
                OPERNAME: "",
                OPERFUN: "close"
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
        //检验关键词的总个数和总记录长度
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
                        if (containArr.indexOf(spaceArr[i]) < 0 && spaceArr[i] !== '') {
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

        //不发稿费选择按钮
        $scope.updateCKSelection = function(variable) {
            $scope.list[variable] = $scope.list[variable] == 1 ? 0 : 1;
        };

        /**
         * [addUploaderImg description]缩略图片上传
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

        function saveContent() {
            ueditorService.saveContent($scope.list);
        }

        $scope.save = function() {
            save(true);
        };


        /**
         * [save description]稿件保存方法
         * @param  {[Boolean]} flag [description]标识
         * @return {[type]}      [description]
         */
        function save(flag) {
            var deferred = $q.defer();
            var ue = UE.getEditor('ueditor');
            saveContent();
            $validation.validate($scope.newsForm.authorForm);
            $validation.validate($scope.newsForm)
                .success(function() {
                    ueditorService.saveToLocal($scope.list.METADATAID);
                    $scope.newsForm.$setPristine();
                    var list = manageSaveObjBeforeSave();
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(),
                        list, "post").then(function(data) {
                        manageDataAfterSave(data, flag);
                        deferred.resolve(data);
                    }, function(data) {
                        deferred.reject(data);
                    });
                })
                .error(function(msg) {
                    $scope.showAllTips = true;
                    editingCenterService.checkSaveError($scope.newsForm);
                    trsconfirm.saveModel("保存失败", "请检查填写项", "error");
                });
            return deferred.promise;
        }

        /**
         * [manageSaveObjBeforeSave description]在保存前处理保存对象
         * @return {[type]} [description]
         */
        function manageSaveObjBeforeSave() {
            getKeyWords();
            $scope.list.serviceid = "mlf_wechat"; //在编辑时后台为返回服务名
            $scope.list.Methodname = "saveImgTextDoc";
            var list = angular.copy($scope.list);
            //初始化处理概览图片,仅编辑时生效
            $scope.list.ATTACHFILE = doWithPicsOrAttach($scope.list.ATTACHFILE);

            //处理发稿单作者信息空数据提交问题
            if (angular.isDefined(list.FGD_AUTHINFO[0]) && (!angular.isDefined(list.FGD_AUTHINFO[0].USERNAME) || list.FGD_AUTHINFO[0].USERNAME === "")) {
                list.FGD_AUTHINFO = [];
            }
            //处理发稿单作者信息空数据提交问题
            //JSON对象数组转字符串
            list = jsonArrayToStringService.jsonArrayToString(list);
            list.HTMLCONTENT = list.HTMLCONTENT.replace(/_ueditor_page_break_tag_/g, "<hr class='pagebreak' noshade='noshade' size='5' style='-webkit-user-select: none;'>");
            return list;
        }

        /**
         * [manageDataAfterSave description]保存操作完成后进行数据处理
         * @param  {[type]} data [description]保存后的返回值
         * @param  {[type]} flag [description]调用保存服务后是否弹出成功窗口判断
         * @return {[type]}      [description]
         */
        function manageDataAfterSave(data, flag) {
            $scope.list.METADATAID = data.METADATAID;
            $scope.list.CHNLDOCID = data.CHNLDOCID;
            $stateParams.chnldocid = $scope.list.CHNLDOCID;
            $stateParams.metadataid = $scope.list.METADATAID;
            if (flag) {
                storageListenerService.addListenerToWeixin("save");
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
                    serviceid: "mlf_wechatoper",
                };
            }
        }

        //动态加载指令
        function loadDirective() {
            LazyLoad.js(["./lib/ueditor2/ueditor.config.js?v=7.0", "./lib/ueditor2/ueditor.all.js?v=7.0"], function() {
                var ueditor = '<ueditor form="newsForm" versionid = "data.lastVersionid" list="list"></ueditor>';
                ueditor = $compile(ueditor)($scope);
                $($(angular.element(document)).find('ueditorLocation')).append(ueditor);
                ue = UE.getEditor('ueditor');
                $scope.status.support.content = $scope.list.CONTENT;
                ue.ready(function() {
                    ue.addListener("keydown", function(type, event) {
                        if (event.keyCode === 13) {
                            //获取纯文本
                            $scope.status.support.content = ue.getContentTxt();
                        }
                    });
                });
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
                $scope.status.hasVersionTime = true;
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
         * [getKeywordsOrAbstract description]获得关键词或者摘要
         * @param  {[str]} type [description]种类
         * @return {[type]}      [description]
         */
        $scope.getKeywordsOrAbstract = function(type) {
            editingCenterService.getKeywordsOrAbstract(type, ueditorService.bindContent()).then(function(data) {
                if (type === "keywords") {
                    if (data !== '""') {
                        var keywordsArray = data.substring(1, data.length - 1).split(";");
                        var arr = [];
                        angular.forEach(keywordsArray, function(value, key) {
                            arr.push({
                                name: value
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

        /*保存并送审*/
        $scope.weixinCompileSend = function() {
            save().then(function(data) {
                saveSend();
            });
        };

        /*待编平台直接签发*/
        $scope.weixinCompileSignDirect = function() {
            save().then(function(data) {
                compileSign();
            });
        };

        /**
         * [weixinPendSignDirect description] 待审平台直接签发
         * @return {[type]} [description]
         */
        $scope.weixinPendSignDirect = function() {
            save().then(function(data) {
                pendSign();
            });
        }

        /**
         * [weixinPendrejectionDraft description] 待审平台撤稿
         * @return {[type]} [description]
         */
        $scope.weixinPendRejectionDraft = function() {
            save().then(function(data) {
                rejectionDraft();
            });
        };

        /**
         * [weixinSignRevoke description] 已签发平台取消签发
         * @return {[type]} [description]
         */
        $scope.weixinSignRevoke = function() {
            save().then(function(data) {
                revoke();
            });
        };

        /*保存送审函数*/
        function saveSend() {
            trsconfirm.inputModel("送审", "确定送审吗？", function(content) {
                var params = {
                    "serviceid": "mlf_wechatoper",
                    "methodname": "trialMetaDatas",
                    "MetaDataIds": $stateParams.metadataid,
                    "CurrChnlId": $stateParams.channelid,
                    "Opinion": content
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("送审成功", "", "success", false, function() {
                        storageListenerService.addListenerToWeixin("send");
                        $window.close();
                    });
                });
            });
        }

        /*待编平台直接签发函数*/
        function compileSign() {
            trsconfirm.confirmModel('签发', '确认发布稿件', function() {
                var params = {
                    "serviceid": "mlf_wechatoper",
                    "methodname": "webDaiBianPublish",
                    "ObjectIds": $stateParams.chnldocid,
                    "ChnlDocIds": $stateParams.chnldocid
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("直接签发成功", "", "success", false,
                        function() {
                            storageListenerService.addListenerToWeixin("directSign");
                            $window.close();
                        });
                });
            });
        }

        /*待审平台直接签发函数*/
        function pendSign() {
            trsconfirm.confirmModel('签发', '确认发布稿件', function() {
                var params = {
                    "serviceid": "mlf_wechatoper",
                    "methodname": "webDaiShenPublish",
                    "ObjectIds": $stateParams.chnldocid,
                    "ChnlDocIds": $stateParams.chnldocid
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("直接签发成功", "", "success", false,
                        function() {
                            storageListenerService.addListenerToWeixin("directSign");
                            $window.close();
                        });
                });
            });
        }

        /**
         * [rejectionDraft description] 撤稿函数
         * @return {[type]} [description]
         */
        function rejectionDraft() {
            trsconfirm.inputModel("是否确认撤稿", "撤稿原因(可选)", function(content) {
                var params = {
                    'serviceid': "mlf_wechatoper",
                    'methodname': "rejectionMetaDatas",
                    'ChannelId': $stateParams.channelid,
                    'Opinion': content,
                    'ChnlDocIds': $stateParams.chnldocid,
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("撤稿成功", "", "success", false, function() {
                        storageListenerService.addListenerToWeixin("rejectionDraft");
                        $window.close();
                    });
                });
            });
        }

        /**
         * [revoke description] 取消签发函数
         * @return {[type]} [description]
         */
        function revoke() {
            trsconfirm.inputModel('是否确认取消签发', '取消签发原因(可选)', function(content) {
                var params = {
                    serviceid: "mlf_wechatoper",
                    methodname: "withdraw",
                    WithDrawOpinion: content,
                    ChnlDocIds: $stateParams.chnldocid,
                    ObjectIds: $stateParams.chnldocid
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        trsconfirm.alertType("取消签发成功", "", "success", false, function() {
                            storageListenerService.addListenerToWeixin("revoke");
                            $window.close();
                        });
                    });
            });
        }

        /**
         * [close description]页面关闭
         * @return {[type]} [description]
         */
        $scope.close = function() {
            editingCenterService.closeWinow($scope.newsForm.$dirty, ueditorService.contentTranscoding($scope.list) != ueditorService.bindContent(), false).then(function() {
                save().then(function() {
                    storageListenerService.addListenerToWeixin("save");
                    var opened = $window.open('about:blank', '_self');
                    opened.close();
                });
            }, function() {
                var opened = $window.open('about:blank', '_self');
                opened.close();
            });
        };

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
                $scope.status.isRequest = true;
                newValue = {
                    SOURCEID: "0",
                    SRCNAME: newValue
                };
            }
            if (angular.isDefined($scope.list)) {
                $scope.list.NEWSSOURCES = newValue;
            }
        });

        //空格增加关键词
        $scope.addkeywords = function(e) {
            if (e.keyCode == 32 && $scope.list.KEYWORDS.indexOf($scope.keywordTxt) < 0) {
                $scope.data.KEYWORDS.push($scope.keywordTxt);
                $scope.keywordTxt = "";
            }
        };
        //删除关键词
        $scope.delete = function(record) {
            $scope.list.KEYWORDS.splice(record, 1);
        };
        //获取微信模板
        $scope.getSection = function() {
            $timeout(function() {
                ue.execCommand('inserthtml', angular.copy($scope.status.wechatTemplate));
                ue.fireEvent("contentChange");
            });
        };
    }
]);
