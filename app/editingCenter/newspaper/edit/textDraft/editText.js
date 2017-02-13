/*
author:wang.jiang 2016-1-16
 */
"use strict";
angular.module('editctrNewspaperTextModule', ['editctrNewspaperRouterModule'])
    .controller('EditctrNewspaperTextCtrl', ["$scope", "$modal", "$sce", "$compile", "$window", "$state", "$timeout", "$location", "$anchorScroll", '$stateParams', '$validation', "$filter", "trsHttpService", 'initiWoDataService', 'SweetAlert', "initVersionService", "jsonArrayToStringService", "trsResponseHandle", "trsconfirm", "$q", "initSingleSelecet", "iWoService", "myManuscriptService", "editingCenterService", "initeditctrBtnsService", "filterEditctrBtnsService", "initDataNewspaperService", "newsDictionBtnService", "newsEditBtnService", "editNewspaperService", "storageListenerService", "localStorageService", "editIsLock", "editcenterRightsService", "ueditorService",
        function($scope, $modal, $sce, $compile, $window, $state, $timeout, $location, $anchorScroll, $stateParams, $validation, $filter, trsHttpService, initiWoDataService, SweetAlert, initVersionService, jsonArrayToStringService, trsResponseHandle, trsconfirm, $q, initSingleSelecet, iWoService, myManuscriptService, editingCenterService, initeditctrBtnsService, filterEditctrBtnsService, initDataNewspaperService, newsDictionBtnService, newsEditBtnService, editNewspaperService, storageListenerService, localStorageService, editIsLock, editcenterRightsService, ueditorService) {
            initStatus();
            initData();
            //锚点切换开始
            $scope.goto = function(id) {
                $location.hash(id);
                $anchorScroll();
            };

            function initStatus() {
                $scope.page = {
                    CURRPAGE: 1,
                    PAGESIZE: 20
                };
                $scope.status = {
                    params: {
                        "serviceid": "mlf_paper",
                        "methodname": "queryViewDatas",
                        "MetaDataIds": $stateParams.metadata,
                    },
                    data: {
                        meataInfo: {}
                    },
                    newsPaperInfo: {},
                    support: {
                        content: "" //提交给辅助写作的纯文本
                    },
                    bitFaceTit: "查看痕迹",
                    openBtn: true,
                    version: [],
                    copyVersion: [],
                    comment: {
                        comment: [],
                        voiceObj: {},
                        hasMore: false,
                        currPage: 1,
                    },
                };

                $scope.list = initDataNewspaperService.initNewspaperNews();
                //获取查看痕迹按钮权限
                editcenterRightsService.getRightsofBigFace($stateParams.paperid, 'paper.trace').then(function(data) {
                    $scope.status.bigFaceRights = data;
                });
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
                });
            }
            /**
             * [close description]关闭页面
             * @return {[type]} [description]
             */
            $scope.close = function() {
                editingCenterService.closeWinow($scope.newsForm.$dirty, ueditorService.contentTranscoding($scope.list) != ueditorService.bindContent()).then(function() {
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
            //浏览器关闭
            $window.onunload = onbeforeunload_handler;

            function onbeforeunload_handler() {
                editIsLock.normalLock($stateParams.metadata).then(function(data) {
                    $window.close();
                });
            }

            function initData() {
                initMataData().then(function(data) {
                    getVersion().then(function() {
                        loadDirective();
                    });
                    initBtn();
                    //获取评审意见
                    getComment($stateParams.metadata, $scope.status.comment.currPage);
                });
                storageListenerService.removeListener("newspaper");
                $scope.status.support.content = "党的十八大以来，以习近平同志为总书记的党中央高度重视党的新闻舆论工作。 从2013年出席全国宣传思想工作会议、发表重要讲话，到去年底视察解放军报社，习近平总书记多次对新闻舆论工作作出重要部署，强调要把党的新闻舆论工作做得更好，坚持正确导向，勇于改革创新，以正确的舆论引导人，激发全党全国各族人民团结奋斗的强大力量。 人民日报、新华社、中央电视台是重要的舆论阵地。一件件实物、一张张图片、一个个短片……习近平参观展览、听取介绍，对3家中央新闻单位近年来取得的发展进步给予充分肯定。 人民日报总编室夜班编辑平台是报纸的编辑中心、出版枢纽。习近平总书记来到这里看望一线编辑。“夜班到几点？”“每天最后谁定版？”“现在一共多少个版？”……习近平总书记认真了解有关情况。总书记对围拢过来的编辑记者说，人民日报是党的重要舆论阵地，适应变化，不断壮大，关键是要不忘初衷，坚定信念，在坚守新闻舆论阵地的同时坚持与时俱进，同时要加强人才队伍建设，永远朝着新的目标不断努力。 参观新华社“历史与发展”主题展览时，听说新华社建立了180多个海外分社，看到新华社已经用海事卫星、无人机等现代装备武装记者，总书记点头表示赞赏。他接过工作人员递过的手持视频直播云终端，拿在手里试拍，体验新华社记者的工作状态。看完展览，总书记边走边说，直观感受真是不一样，新华社事业取得了很大发展。 《新闻联播》已经创办38年，是中央电视台历史最为悠久的栏目。习近平走进联播演播室、导播间，同播出团队互动交流。编辑部主任李风告诉总书记，《新闻联播》是“字字千钧、秒秒政治、天天考试”，传播党的声音容不得一丝一毫疏漏。演播室里，播音员坐的椅子已显陈旧，但大家说，舍不得换。因为，几代联播播音员都是坐在这张椅子上播音，已成为优良传统的象征。总书记点头表示肯定。 下午座谈会上，习近平总书记强调，党的新闻舆论工作坚持党性原则，最根本的是坚持党对舆论工作的领导。党和政府主办的媒体是党和政府的宣传阵地，必须姓党。新闻舆论工作各个方面、各个环节都要坚持正确舆论导向。 19日上午，习近平来到负责采编内参稿件的新华社参编部。桌子上，摆放着各种内参刊物，习近平在听取基本情况介绍后对新华社编辑记者说，内参工作非常重要，做好内参工作要客观真实，要有高度责任心、使命感。我在地方工作时就比较重视内参工作，到中央工作后尤其重视，希望大家再接再厉。 座谈会上，习近平总书记再次对全国新闻工作者提出殷切期望：要深入开展马克思主义新闻观教育，引导广大新闻舆论工作者做党的政策主张的传播者、时代风云的记录者、社会进步的推动者、公平正义的守望者。 人民日报编辑范正伟以《让主流声音更加响亮有力》为题发言。他说，新闻舆论处于意识形态最前沿，在一些大是大非问题上，党报评论必须旗帜鲜明、激浊扬清，敢于交锋、勇于亮剑，总书记引用过陕北的一句话，“不要听蝲喇蛄叫就不种庄稼了”。总书记插话说：“这个话，不光是陕北说，河北也这么说，很生动。";
                $anchorScroll.yOffset = 63;
                //稿件加锁
                $timeout(function() {
                    editIsLock.lockDraft($stateParams.metadata);
                }, 1700);
            }

            function initMataData() {
                var deferred = $q.defer();
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.params, "get")
                    .then(function(data) {
                        $scope.list = data[0];
                        deferred.resolve(data);
                    });
                return deferred.promise;
            }
            $scope.save = function() {
                save(true).then(function() {
                    if ($stateParams.metadata) {
                        getVersion();
                        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.params, "get")
                            .then(function(data) {
                                var ue = UE.getEditor('ueditor');
                                ue.ready(function() {
                                    ue.setContent(data[0].HTMLCONTENT);
                                    ueditorService.saveToLocal($scope.list.METADATAID);
                                });
                            });
                    }
                });
            };

            function saveContent() {
                ueditorService.saveContent($scope.list);
            }

            function save(flag) {
                saveContent();
                var deferred = $q.defer();
                $timeout(function() {
                    $validation.validate($scope.newsForm.authorForm);
                    $validation.validate($scope.newsForm)
                        .success(function() {
                            ueditorService.saveToLocal($scope.list.METADATAID);
                            $scope.newsForm.$setPristine();
                            $scope.status.openBtn = false;
                            $scope.list.DOCRELTIME = $filter('date')(new Date(), "yyyy-MM-dd HH:mm").toString();
                            var list = angular.copy($scope.list);
                            list.serviceid = "mlf_paper";
                            list.methodname = "saveNewsDocument";
                            list.ObjectId = $stateParams.metadata;
                            delete list.CRDEPT;
                            delete list.DOCTYPE;
                            delete list.METADATAID;
                            delete list.LOG_OPERATION;
                            delete list.OBJ_VERSION;
                            //处理发稿单作者信息空数据提交问题
                            if (angular.isDefined(list.FGD_AUTHINFO[0]) && (!angular.isDefined(list.FGD_AUTHINFO[0].USERNAME) || list.FGD_AUTHINFO[0].USERNAME === "")) {
                                list.FGD_AUTHINFO = "[]";
                            }
                            //处理发稿单作者信息空数据提交问题
                            list = jsonArrayToStringService.jsonArrayToString(list);
                            list.HTMLCONTENT = list.HTMLCONTENT.replace(/_ueditor_page_break_tag_/g, "<hr class='pagebreak' noshade='noshade' size='5' style='-webkit-user-select: none;'>");
                            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), list, "post").then(function(data) {
                                $scope.status.openBtn = true;
                                //保存稿件成功后
                                if (flag) {
                                    storageListenerService.addListenerToNewspaper("save");
                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: false
                                    });
                                    trsconfirm.saveModel("保存成功", "", "success");
                                }
                                deferred.resolve(data);
                            }, function(data) {
                                $scope.status.openBtn = true;
                                deferred.reject(data);
                            });
                        }).error(function() {
                            $scope.showAllTips = true;
                            editingCenterService.checkSaveError($scope.newsForm);
                            trsconfirm.saveModel("保存失败", "请检查填写项", "error");
                        });
                });
                return deferred.promise;
            }
            //不发稿费
            $scope.updateCKSelection = function() {
                $scope.list.ISNOPAYMENT === "1" ? $scope.list.ISNOPAYMENT = "0" : $scope.list.ISNOPAYMENT = "1";
            };
            //稿件体裁
            $scope.draftType = function() {
                $scope.list.DOCGENRE = angular.copy($scope.GENREDOC).value;
            };
            //初始化稿体题材
            function initDocgenre() {
                var deferred = $q.defer();
                $scope.loadingPromise = trsHttpService.httpServer("./editingCenter/properties/metadataEnum.json", {}, "get").then(function(data) {
                    $scope.data = data;
                    $scope.DOCGENRE = [];
                    angular.forEach(data.DocGenre, function(item, index) {
                        $scope.DOCGENRE.push({
                            value: item.value,
                            name: item.desc
                        });
                    });
                    deferred.resolve();
                });
                return deferred.promise;
            }
            //动态加载指令
            function loadDirective() {
                LazyLoad.js(["./lib/ueditor2/ueditor.config.js?v=7.0", "./lib/ueditor2/ueditor.all.js?v=7.0"], function() {
                    $scope.status.docTypeToUeditor = "newsPaper";
                    var ueditor = '<ueditor versionid="data.lastVersionid" list="list" type="{{status.docTypeToUeditor}}"></ueditor>';
                    ueditor = $compile(ueditor)($scope);
                    $($(angular.element(document)).find('ueditorLocation')).append(ueditor);
                    var ue = UE.getEditor('ueditor');
                    $scope.status.support.content = $scope.list.CONTENT;
                    ue.addListener("keydown", function(type, event) {
                        if (event.keyCode === 13) {
                            //获取纯文本
                            $scope.status.support.content = ue.getContentTxt();
                        }
                    });
                });
                var draftList = '<editor-dir meta-data-id="{{list.METADATAID}}"  editor-json="list.FGD_EDITINFO" show-all-tips="showAllTips" editor-form="newsForm"></editor-dir>' +
                    '<editor-auth-dir author="list.FGD_AUTHINFO"></editor-auth-dir>';
                draftList = $compile(draftList)($scope);
                $($(angular.element(document)).find('editor')).append(draftList);
            }
            /**
             * [getVersion description]获取流程版本与操作日志
             * @return {[type]} [description]
             */
            function getVersion() {
                var deferred = $q.defer();
                editingCenterService.getEditVersionTime($stateParams.metadata, $scope.page, $scope.status.copyVersion).then(function(data) {
                    $scope.status.version = data;
                    $scope.page = data.page;
                    $scope.status.copyVersion = data.copyArray;
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
            //初始化按钮权限
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
                        PubDate: result.dateStr,
                        Option: result.option,
                        SrcBanMianIds: result.SrcBanMianIds
                    };
                    save().then(function() {
                        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), shangbanParams, "get").then(function(data) {
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
                        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), zhuanbanParams, "get").then(function(data) {
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
                        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
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
            /**
             * [addUploaderImg clearLocalVersion]清除本地呢版本
             * @param {[type]} null
             * @return {[type]}       [description]null
             */
            function clearLocalVersion() {
                //正常关闭清除稿件本地缓存
                if ($stateParams.metadataid) {
                    localStorageService.remove("localversion_" + $stateParams.metadataid);
                }
                //正常关闭清除稿件本地缓存
            }
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
                        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
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
                        window.close();
                    }, function(result) {
                        if (result.reports[0].RESULT) {
                            result.paperid = $stateParams.paperid;
                            editNewspaperService.singZpInfo(result, function() {
                                storageListenerService.addListenerToNewspaper("qianfazp");
                                $window.close();
                            });
                        }
                    });
                } else {
                    editNewspaperService.useSignZP(item, function(result) {
                        storageListenerService.addListenerToNewspaper("qianfazp");
                        $window.close();
                    }, function(result) {
                        if (result.reports[0].RESULT) {
                            result.paperid = $stateParams.paperid;
                            editNewspaperService.singZpInfo(result, function() {
                                storageListenerService.addListenerToNewspaper("qianfazp");
                                $window.close();
                            });
                        }
                    });
                }
            }
        }
    ]);
