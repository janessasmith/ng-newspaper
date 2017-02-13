/**
 *  websitetoBeCompiledModuleModule
 *
 * Description 网站渠道 待编
 * rebuild: wang.jiang 2016-3-4
 */
"use strict";
angular.module('websitetoBeCompiledModule', [
    'websitetoBeCompiledRouterModule',
    'editingCenterCompiledWebsiteTimingSignModule',
    'editingCenterCompiledWebsiteRecycleModule',
    "websiteAtlasModule",
    'websiteLinkDocModule',
    'websiteSubjectModule',
    'initWebsiteDataModule',
    'editingCenterWebsiteOwnerModule',
]).
controller('websitetoBeCompiledCtrl', ["$scope", "$filter", "$q", '$state', "$timeout", "$stateParams", "$window", "localStorageService", "trsHttpService", "initSingleSelecet", "trsconfirm", "trsspliceString", "editingCenterService", "websiteService", "initVersionService", "initeditctrBtnsService", "storageListenerService", 'editcenterRightsService', 'globleParamsSet', 'editIsLock', 'trsPrintService',
    function toBeCompiled($scope, $filter, $q, $state, $timeout, $stateParams, $window, localStorageService, trsHttpService, initSingleSelecet, trsconfirm, trsspliceString, editingCenterService, websiteService, initVersionService, initeditctrBtnsService, storageListenerService, editcenterRightsService, globleParamsSet, editIsLock, trsPrintService) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化状态
         * @return {[type]} [description] null
         */
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": globleParamsSet.getPageSize(),
                "ITEMCOUNT": 0,
                "PAGECOUNT": 1
            };
            $scope.status = {
                isESSearch: false,
                onlyMine: false,
                onlyCurChannel: false,
                btnRights: {},
                copyCurrPage: 1,
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                params: {
                    "serviceid": "mlf_website",
                    "methodname": "queryToBeCompiledDoc",
                    "CurrPage": $scope.page.CURRPAGE,
                    "PageSize": $scope.page.PAGESIZE,
                    "ChannelId": $stateParams.channelid,
                    "SiteId": $stateParams.siteid,
                    "timeType": "",
                    "DocId": ""
                },
                icon: {
                    noVideo: '0',
                    noAudio: '0',
                    noPic: '0'
                },
                detailMethodname: {
                    1: 'getNewsDoc',
                    2: 'getPicsDoc',
                    3: 'getSpecialDoc',
                    4: 'getLinkDoc'
                },
                draftType: {
                    news: "1",
                    atlas: "2",
                    subject: "3",
                    linkDoc: "4"
                },
            };
            $scope.data = {
                items: [],
                selectedArray: [],
                printResult: [],
                editPath: websiteService.getEditandPreviewPath().edit,
                previewPath: websiteService.getEditandPreviewPath().preview,
            };
            $scope.status.isCrTime = websiteService.storgeTimeOrder;
            $scope.status.params.OrderBy = websiteService.storgeTimeOrder === 'OPERTIME' ? null : "CrTime";
        }
        /**
         * [initData description]初始化数据
         * @return {[type]} [description] null
         */
        function initData() {
            if (!angular.isDefined($stateParams.siteid)) return; //如果没有站点，不进行初始化请求
            initDropList();
            requestData();
            listenStorage();
            editcenterRightsService.initWebsiteListBtn('web.daibian', $stateParams.channelid).then(function(rights) {
                $scope.status.btnRights = rights;
                getObjLength($scope.status.btnRights);
            });
            editingCenterService.getChannelDetail($stateParams.channelid).then(function(data) {
                $scope.data.getChannelDetail = data;
            });
        }
        /** 
         * [getObjLength description]计算对象长度
         * @return {[type]} [description]
         */
        function getObjLength(obj) {
            var size = 0,
                key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            $scope.status.btnLength = size;
        }
        //下一页
        $scope.pageChanged = function() {
            $scope.status.params.CurrPage = $scope.page.CURRPAGE;
            $scope.status.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        /*跳转指定页面*/
        $scope.jumpToPage = function() {
            if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.status.params.CurrPage = $scope.status.copyCurrPage;
            $scope.page.CURRPAGE = $scope.status.params.CurrPage;
            requestData();
        };
        /**
         * [selectPageNum description]选择单页显示条数
         * @return {[type]} [description]
         */
        $scope.selectPageNum = function() {
            $scope.status.params.CurrPage = $scope.page.CURRPAGE;
            $scope.status.params.PageSize = $scope.page.PAGESIZE;
            $scope.status.copyCurrPage = 1;
            requestData();
        };
        /** 
         * [draftImport description]导入文档
         * @return {[type]} [description]
         */
        $scope.draftImport = function() {
            editingCenterService.draftImport("mlf_extmyrelease", "websiteImportDoc", $stateParams.channelid, function() {
                requestData();
            });
        };
        //全选
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : []
                .concat($scope.data.items);
        };
        //单选
        $scope.selectDoc = function(item) {
            var index = $scope.data.selectedArray.indexOf(item);
            if (index < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice(index, 1);
            }
        };
        /**
         * [draftPublish description]稿件预览
         * @param  {[obj]} item [description]稿件信息结合
         * @return {[type]}      [description]
         */
        $scope.draftPublish = function(item) {
            editingCenterService.draftPublish(item.CHNLDOCID);
        };
        /**
         * [trial description]送审
         * @param  {[type]} item [description] 如果传入代表单个稿件收藏，不传代表批量操作
         * @return {[type]}      [description] null
         */
        $scope.trial = function(item) {
            var chnlDocIds, metaDataIds;
            if (!!item) {
                chnlDocIds = item.CHNLDOCID;
                metaDataIds = item.METADATAID;
            } else {
                chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
                metaDataIds = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
            }
            trial(chnlDocIds, metaDataIds);
        };
        /**
         * [share description] 共享操作
         * @param  {[type]} item [description]  如果传入代表单个稿件收藏，不传代表批量操作
         * @return {[type]}      [description]
         */
        $scope.share = function(item) {
            var chnlDocIds, metaDataIds;
            if (!!item) {
                chnlDocIds = item.CHNLDOCID;
                metaDataIds = item.METADATAID;
            } else {
                chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
                metaDataIds = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
            }
            share(chnlDocIds, metaDataIds);
        };

        /**
         * [share description]共享方法
         * @param  {[type]} chnldocids  [description] 多个chnldocid 以逗号隔开
         * @param  {[type]} metadataids [description] 多个metadataid  以逗号隔开
         * @return {[type]}             [description]
         */
        function share(chnldocids, metadataids) {
            editingCenterService.share(function(data) {
                data.serviceid = "mlf_websiteoper";
                data.methodname = "doShareDAIBIAN";
                data.ChnlDocIds = chnldocids;
                data.MetaDataIds = metadataids;
                data.ChannelId = $stateParams.channelid;
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), data, "post")
                    .then(function(data) {
                        trsconfirm.alertType("操作成功", "", "success", false, function() {
                            requestData();
                        });
                    });
            });
        }
        /**
         * [draftlist description]发稿单
         * @return {[type]} [description] null
         */
        $scope.draftlist = function() {
            editingCenterService.draftList($scope.data.selectedArray, {
                "serviceid": "mlf_appfgd",
                "methodname": "webDaiBianbatchUpdateFgdUsers"
            }, function() {
                $scope.data.selectedArray = [];
            });
        };
        /**
         * [copyDraft description]复制稿件
         * @return {[type]} [description]
         */
        $scope.copyDraft = function(item) {

            if (!!item) copyDraft([item]);
            else {
                copyDraft($scope.data.selectedArray);
            }

        };
        /**
         * [moveDraft description]移动稿件
         * @param  {[type]} item [description]如果传入代表单个稿件收藏，不传代表批量操作
         * @return {[type]}      [description]
         */
        $scope.moveDraft = function(item) {
            if (!!item) moveDraft([item]);
            else {
                moveDraft($scope.data.selectedArray);
            }
        };
        /**
         * [collect description] 稿件收藏
         * @param  {[type]} item [description] 如果传入代表单个稿件收藏，不传代表批量操作
         * @return {[type]}      [description]
         */
        $scope.collect = function(item) {
            var param = !!item ? item.RECID : trsspliceString.spliceString($scope.data.selectedArray,
                'RECID', ',');
            trsconfirm.confirmModel("稿件收藏", "确认收藏稿件", function() {
                collectDraft(param);
            });
        };

        /**
         * [listenStorage description]监听本地缓存
         * @return {[promise]} [description] promise
         */
        function listenStorage() {
            storageListenerService.listenWebsite(function() {
                requestData();
                storageListenerService.removeListener("website");
            });
        }

        //数据请求函数
        function requestData() {
            var params = $scope.status.isESSearch ? getESSearchParams() : $scope.status.params;
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                var ListItems = data.DATA;
                $scope.data.items = ListItems;
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
                $scope.data.selectedArray = [];
                requestListImg(ListItems).then(function(data) {
                    angular.forEach(ListItems, function(value, key) {
                        value.ALLIMG = data[value.METADATAID];
                    });
                });
            });
        }
        /**
         * [requestListImg description:查询列表图示]
         */
        function requestListImg(items) {
            var defer = $q.defer();
            if (!items || items.length < 1) defer.resolve([]);
            else {
                var params = {
                    serviceid: "mlf_myrelease",
                    methodname: "queryAllImgLogo",
                    metadataids: trsspliceString.spliceString(items, "METADATAID", ",")
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    defer.resolve(data);
                });
            }
            return defer.promise;
        }
        //初始化下拉框
        function initDropList() {
            $scope.data.docTypeArray = initSingleSelecet.websiteDocType();
            $scope.data.selectedDocType = angular.copy($scope.data.docTypeArray[0]);
            $scope.data.timeTypeArray = initSingleSelecet.chooseTimeType();
            $scope.data.selectedTimeType = angular.copy($scope.data.timeTypeArray[0]);
            //初始化搜索框边的下拉框
            $scope.data.iWoAll = initSingleSelecet.iWoEntire();
            $scope.data.iWoAllSelected = angular.copy($scope.data.iWoAll[0]);
            // 排序方式
            $scope.sortTypeJsons = initSingleSelecet.sortType();
            $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
        }
        /**
         * [queryByDropdown description] 筛选条件触发后请求数据
         * @param  {[type]} key   [description] 请求对象参数key
         * @param  {[type]} value [description] 请求对象值
         * @return {[type]}       [description] null
         */
        $scope.queryByDropdown = function(key, value) {
            $scope.status.params[key] = value;
            $scope.status.copyCurrPage = $scope.status.params.CurrPage = $scope.page.CURRPAGE = "1";
            if (key == 'timeType') {
                if (value.length < 10) {
                    $scope.status.params.OperTimeStart = null;
                    $scope.status.params.OperTimeEnd = null;
                } else {
                    $scope.status.params.OperTimeStart = $scope.data.fromdate;
                    $scope.status.params.OperTimeEnd = $scope.data.untildate;
                    $scope.status.params[key] = null;
                }
            }
            requestData();
        };
        //送审开始
        function trial(chnlDocIds, metaDataIds) {
            var temp = $filter('pick')($scope.data.selectedArray, $scope.filterChannelId);
            if (temp.length === $scope.data.selectedArray.length) {
                trsconfirm.inputModel("送审", "送审意见（可选）", function(content) {
                    var params = {
                        "serviceid": "mlf_websiteoper",
                        "methodname": "trialMetaDatas",
                        "MetaDataIds": metaDataIds,
                        "ChnlDocIds": chnlDocIds,
                        "Opinion": content,
                        "CurrChnlId": $scope.data.selectedArray[0].CHANNELID,
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                        .then(function(data) {
                            trsconfirm.alertType("送审成功", "", "success", false);
                            requestData();
                        }, function() { requestData(); });
                });
            } else {
                trsconfirm.alertType("稿件送审失败", "所选稿件不属于同一栏目", "error", false);
            }
        }
        /**
         * [collectDraft description]收藏稿件方法
         * @param  {[type]} chnldocids [description] 稿件chnldocids
         * @return {[type]}            [description]
         */
        function collectDraft(chnldocids) {
            var temp = $filter('pick')($scope.data.selectedArray, $scope.filterChannelId);
            if (temp.length === $scope.data.selectedArray.length) {
                var params = {
                    serviceid: "mlf_websiteoper",
                    methodname: "collectionDAIBIANDocs",
                    ChnlDocIds: chnldocids,
                    ChannelId: $scope.data.selectedArray[0].CHANNELID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
                    trsconfirm.alertType("收藏成功", "", "success", false);
                    requestData();
                }, function() {
                    $scope.data.selectedArray = [];
                });
            } else {
                trsconfirm.alertType('收藏失败', "所选稿件不属于同一栏目", "error", false);
                $scope.data.selectedArray = [];
            }
        }
        $scope.timeSign = function(item) {
            var param = !!item ? [item] : $scope.data.selectedArray;
            timeSign(param);
        };
        //定时签发函数
        function timeSign(items) {
            var params = {
                selectedArray: items,
                isNewDraft: false,
                methodname: "webDaiBianTimingPublish"
            };
            editingCenterService.draftTimeSinged(params).then(function(data) {
                requestData();
            }, function() {
                requestData();
            });
        }
        //直接签发
        $scope.directSign = function(item) {
            var param = !!item ? item.CHNLDOCID : trsspliceString.spliceString($scope.data.selectedArray,
                "CHNLDOCID", ',');
            trsconfirm.confirmModel('签发', '确认直接签发', function() {
                directSign(param);
            });
        };
        /* //单项直接签发
         $scope.immediateSinged = function(item) {
             trsconfirm.confirmModel('签发', '确认发布稿件', function() {
                 signed(item.CHNLDOCID);
             });
         };*/
        //签发函数
        function directSign(chnldocIDs) {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "webDaiBianPublish",
                ObjectIds: chnldocIDs,
                ChnlDocIds: chnldocIDs
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("签发成功", "", "success", false, function() {
                    requestData();
                });
            }, function() {
                requestData();
            });

        }
        /**
         * [delete description] 废稿
         * @param  {[type]} item [description] 如果传入item 代表单个废稿，不传则多个废稿
         * @return {[type]}      [description]
         */
        $scope.delete = function(item) {
            var chnlDocIds = "";
            if (!!item) {
                chnlDocIds = item.CHNLDOCID;
            } else {
                chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");

            }
            trsconfirm.inputModel('是否确认废稿', "删除稿件原因（可选）", function(content) {
                abandonDraft(chnlDocIds, content);
            });

        };
        /**
         * [abandonDraft description]废稿函数
         * @param  {[type]} chnldocIDs [description] chnldocid 逗号隔开
         * @param  {[type]} content    [description] 废稿意见
         * @return {[type]}            [description]
         */
        function abandonDraft(chnldocIDs, content) {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "trashMetaDatas",
                ChnlDocIds: chnldocIDs,
                ChannelId: $stateParams.channelid,
                Opinion: content
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function() {
                requestData();
            }, function() {
                requestData();
            });
        }
        /**
         * [isOnlyMine description]只看我的
         * @return {Boolean} [description] null
         */
        $scope.isOnlyMine = function() {
            $scope.status.copyCurrPage = $scope.status.params.CurrPage = $scope.page.CURRPAGE = "1";
            $scope.status.onlyMine = !$scope.status.onlyMine;
            $scope.status.params.isOnlyMine = $scope.status.onlyMine;
            requestData();
        };

        /**
         * [isOnlyCurChannel description]只看当前栏目
         * @return {Boolean} [description] null
         */
        $scope.isOnlyCurChannel = function() {
            $scope.status.copyCurrPage = $scope.status.params.CurrPage = $scope.page.CURRPAGE = "1";
            $scope.status.onlyCurChannel = !$scope.status.onlyCurChannel;
            $scope.status.params.IsCurrentChnl = $scope.status.onlyCurChannel;
            requestData();
        };

        /**
         * [copyDraft description]复制建新稿
         * @param  {[type]} items [description]  稿件集合
         * @return {[type]}       [description]
         */
        function copyDraft(items) {
            websiteService.batChooseChnl("复制稿件", $stateParams.siteid, function(data) {
                var params = {
                    "serviceid": "mlf_websiteoper",
                    "methodname": "copyDAIBIANDoc",
                    "ChannelId": $stateParams.channelid,
                    "MetaDataIds": trsspliceString.spliceString(items, "METADATAID", ","),
                    "ChannelIds": data.ChannelIds
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        trsconfirm.alertType("复制稿件成功", "", "success", false, function() {
                            requestData();
                        });
                    });
            });
        }
        /**
         * [selectedChannelId description]过滤器过滤移动稿件CHANNELID不相同的情况
         * @param  {[type]} elm [description]传入的值
         * @return {[type]}     [description]
         */
        $scope.filterChannelId = function(elm) {
            if (angular.isDefined(elm.CHANNELID)) {
                return elm.CHANNELID == $scope.data.selectedArray[0].CHANNELID;
            }
        };
        /**
         * [moveDraft description] 移动稿件
         * @param  {[type]} items [description] 稿件结合
         * @return {[type]}       [description] null
         */
        function moveDraft(items) {
            var temp = $filter('pick')(items, $scope.filterChannelId);
            if (temp.length === items.length) {
                websiteService.singleChooseChnl("移动稿件", $stateParams.siteid, $stateParams.channelid, function(data) {
                    var params = {
                        "serviceid": "mlf_websiteoper",
                        "methodname": "moveDAIBIANDoc",
                        "SrcChannelId": items[0].CHANNELID,
                        "ChnlDocIds": trsspliceString.spliceString(items, "CHNLDOCID", ","),
                        "ToChannelId": data.channelid
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                        .then(function(data) {
                            trsconfirm.alertType("稿件移动成功", "", "success", false);
                            requestData();
                        });
                });
            } else {
                trsconfirm.alertType("稿件移动失败", "所选稿件不属于同一栏目", "error", false);
            }
        }
        /**
         * [showVersionTime description]展示流程版本与操作日志
         * @param  {[str]} MetaDataId [description]
         * @return {[type]}            [description]
         */
        $scope.showVersionTime = function(item) {
            editingCenterService.getVersionTime(item, false);
        };

        //邮件外发
        $scope.outSending = function(item) {
            editingCenterService.outSending("", function(result) {
                outSendingDraft(result.selectItems, item);
            });
        };

        function outSendingDraft(items, item) {
            var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
            var draftids = trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'METADATAID', ",");
            var params = {
                serviceid: "mlf_mailoutgoingOper",
                methodname: "webDaiBianSendEmail",
                Emails: userids,
                MetaDataIds: draftids
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("邮件外发成功", "", "success", false, function() {
                    requestData();
                });
            }, function() {
                $scope.data.selectedArray = [];
            });
        }
        /**
         * [getESSearchParams description]设置ES检索参数
         * @return {[json]} [description] 参数对象
         */
        function getESSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForWebSiteToBeCompiledDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: $scope.data.iWoAllSelected.value,
                        keywords: $scope.keywords ? $scope.keywords : ""
                    }, {
                        searchField: "docType",
                        keywords: $scope.data.selectedDocType.value
                    }, {
                        searchField: "timeType",
                        keywords: $scope.data.selectedTimeType.value
                    }, {
                        searchField: "isOnlyMine",
                        keywords: $scope.status.onlyMine
                    }, {
                        searchField: "channelid",
                        keywords: $stateParams.channelid
                    }, {
                        searchField: "_sort",
                        keywords: $scope.sortType.value
                    }]
                }
            };
            esParams.searchParams = JSON.stringify(esParams.searchParams);
            return esParams;
        }
        /**
         * [fullTextSearch description;全文检索]
         * @param  {[type]} ev [description:按下空格也能提交]
         */
        $scope.fullTextSearch = function(ev) {
            if ($scope.data.iWoAllSelected.value == "DocID") {
                $scope.status.isESSearch = false;
                $scope.status.params.DocId = $scope.keywords;
            } else {
                $scope.status.isESSearch = true;
            }
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                $scope.page.CURRPAGE = 1;
                requestData();
            }
        };
        /**
         * [quote description;引用]
         * @param  {[type]} item [description:]
         */
        $scope.quote = function(item) {
            var selectedArray;
            if (!!item) {
                selectedArray = [item];
            } else {
                selectedArray = $scope.data.selectedArray;
            }
            quoteItem(selectedArray);
        };

        function quoteItem(array) {
            websiteService.batChooseChnl("引用", $stateParams.siteid, function(data) {
                var params = {
                    "serviceid": "mlf_websiteoper",
                    "methodname": "DaiBianQuoteDoc",
                    "ChnlDocIds": trsspliceString.spliceString(array, "CHNLDOCID", ","),
                    "ChannelIds": data.ChannelIds
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        trsconfirm.alertType("引用成功", "引用成功", "success", false, function() {
                            $scope.data.selectedArray = [];
                            requestData();
                        });
                    });
            });
        }
        /**
         * [isLockEdit description:编辑前请求解锁]
         * @param  {[type]} item [description:稿件对象]
         */
        $scope.isLockEdit = function(item) {
            editIsLock.isLock(item).then(function(data) {
                var editPath = $scope.data.editPath[item.DOCTYPEID];
                var editParams = {
                    channelid: item.CHANNELID,
                    chnldocid: item.CHNLDOCID,
                    metadataid: item.METADATAID,
                    siteid: $stateParams.siteid,
                    status: 0
                };
                var editUrl = $state.href(editPath, editParams);
                if (data.ISLOCK == "false") {
                    $window.open(editUrl);
                } else {
                    trsconfirm.alertType("稿件已经被【" + data.LOCKUSER + "】锁定,是否强制解锁", "", "warning", true, function() {
                        editIsLock.forceDeblocking(item).then(function(data) {
                            $window.open(editUrl);
                        });
                    }, function() {});
                }
            });
        };
        /**
         * [printBtn description：打印]
         */
        $scope.printBtn = function() {
            if (checkDraftType($scope.status.draftType.subject)) {
                trsconfirm.alertType("所选稿件中有专题稿，无法打印", '', "error", false);
                return;
            };
            angular.forEach($scope.data.selectedArray, function(value, key) {
                requestPrintVersion(value).then(function(data) {
                    requestPrintData(value, data);
                });
            });
        };
        /**
         * [checkDraftType description：检查是否选中了某种类型的稿件]
         * @params typeId 稿件ID
         * return 若有该类型则返回true
         */
        function checkDraftType(typeId) {
            var flag = false;
            for (var i = 0; i < $scope.data.selectedArray.length; i++) {
                if ($scope.data.selectedArray[i].DOCTYPEID == typeId) {
                    flag = true;
                    break;
                }
            }
            return flag;
        }
        /**
         * [requestPrintVersion description：打印请求流程]
         */
        function requestPrintVersion(item) {
            var deferred = $q.defer();
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), {
                serviceid: "mlf_metadatalog",
                methodname: "query",
                MetaDataId: item.METADATAID
            }, 'get').then(function(data) {
                deferred.resolve(data.DATA);
            });
            return deferred.promise;
        }
        /**
         * [requestPrintVersion description：打印请求详情]
         */
        function requestPrintData(item, version) {
            var params = {
                "serviceid": "mlf_website",
                "methodname": $scope.status.detailMethodname[item.DOCTYPEID],
                "MetaDataId": item.METADATAID
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                var result = data;
                data.VERSION = version;
                data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
                $scope.data.printResult.push(result);
                if ($scope.data.printResult.length == $scope.data.selectedArray.length) {
                    trsPrintService.trsWebPrintDocument($scope.data.printResult);
                    $scope.data.printResult = [];
                }
            });
        }
        /**
         * [exportDraft description:导出稿件]
         */
        $scope.exportDraft = function() {
            if (checkDraftType($scope.status.draftType.subject) || checkDraftType($scope.status.draftType.linkDoc)) {
                trsconfirm.alertType("只能导出新闻稿或图集稿", '', "error", false);
                return;
            }
            var params = {
                serviceid: 'mlf_exportword',
                methodname: 'exportWordFile',
                MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ','),
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
                $scope.data.selectedArray = [];
            });
        };
        /**
         * [timeOrder description]根据时间排序
         * @return {[type]} [description]
         */
        $scope.timeOrder = function(type) {
            websiteService.storgeTimeOrder = type;
            $scope.status.isCrTime = type;
            $scope.status.params.OrderBy = type === 'OPERTIME' ? null : "CrTime";
            requestData();
        };
    }
]);
