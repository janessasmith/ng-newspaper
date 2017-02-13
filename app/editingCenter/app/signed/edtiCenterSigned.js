"use strict";
angular.module('editingCenterSignedModule', [
    'editingCenterSignedRouterModule',
    'editingCenterSignedRetractionModule',
    'editingCenterSignedFocusModule',
    'trsNavLocationModule'
]).
controller("editCompileSignedCtroller", ["$stateParams", "$q", "$filter", "trsHttpService", "$scope", "$modal", "$window", "trsconfirm", "trsspliceString", "$timeout", "initSingleSelecet", 'editingCenterService', 'storageListenerService', 'trsPrintService', 'globleParamsSet', 'editingCenterAppService', 'editcenterRightsService',
    function($stateParams, $q, $filter, trsHttpService, $scope, $modal, $window, trsconfirm, trsspliceString, $timeout, initSingleSelecet, editingCenterService, storageListenerService, trsPrintService, globleParamsSet, editingCenterAppService, editcenterRightsService) {
        initStatus();
        initData();

        /**
         * [initStatus description] 初始化状态
         * @return {[type]} [description]
         */
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": globleParamsSet.getPageSize()
            };
            $scope.data = {
                printResult: [],
                items: [],
                selectedArray: [],
                copyCurrPage: 1,
                editPath: editingCenterAppService.initEditPath(),
            };
            $scope.status = {
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
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
                onlyMine: false,
                isESSearch: false,
                channelId: $stateParams.channelid,
                siteId: $stateParams.siteid,
                hasHide: false, //包含隐藏的稿件
                hasNoHide: false, //包含未隐藏的稿件
                hasFixed: false, //包含固定位置的稿件
                hasNoFixed: false, //包含未定位的稿件
            };
            $scope.params = {
                'serviceid': 'mlf_appmetadata',
                'methodname': 'querySignedDoc',
                'PageSize': $scope.page.PAGESIZE,
                'CurrPage': $scope.page.CURRPAGE,
                'ChannelId': $stateParams.channelid,
                'SiteId': $stateParams.siteid
            };
            $scope.fixPos = []; //被固定位置的稿件集合
        }

        /**
         * [initData description] 初始化数据
         * @return {[type]} [description]
         */
        function initData() {
            requestData();
            initDropDown();
            listenStorage();
            editcenterRightsService.initAppListBtn('app.yiqianfa', $stateParams.channelid).then(function(rights) {
                $scope.status.btnRights = rights;
            });
        }

        /**
         * [requestData description] 请求数据
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        function getData() {
            var deferred = $q.defer();
            var params = $scope.status.isESSearch ? getESSearchParams() : $scope.params;
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                var ListItems = data.DATA;
                $scope.data.items = ListItems;
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
                $scope.data.selectedArray = [];
                requestListImg(ListItems).then(function(data) {
                    angular.forEach(ListItems, function(value, key) {
                        value.ALLIMG = data[value.METADATAID];
                    });
                });
                deferred.resolve();
            });
            return deferred.promise;
        }

        /**
         * [requestData description] 请求数据更新状态
         * @return {[type]} [description]
         */
        function requestData() {
            getData().then(function() {
                initFixed();
            });
        }

        /**
         * [description] 监听勾选的数据
         * @param  {[type]} newValue) {                       var hasFixed [description]
         * @return {[type]}           [description]
         */
        $scope.$watch("data.selectedArray.length", function(newValue) {
            var hasFixed = false;
            var hasNoFixed = false;
            var hasHide = false;
            var hasNoHide = false;
            angular.forEach($scope.data.selectedArray, function(item) {
                angular.isDefined(item.GDORDER) ? hasFixed = true : hasNoFixed = true;
                item.HIDDEN == '1' ? hasHide = true : hasNoHide = true;
                $scope.status.hasFixed = hasFixed;
                $scope.status.hasNoFixed = hasNoFixed;
                $scope.status.hasHide = hasHide;
                $scope.status.hasNoHide = hasNoHide;
            });
        });

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

        /**
         * [initFixed description] 初始化固定位置的稿件
         * @return {[type]} [description]
         */
        function initFixed() {
            angular.forEach($scope.data.items, function(data, index) {
                if (data.GDORDER && $scope.fixPos.indexOf(Number(data.GDORDER)) < 0) {
                    $scope.fixPos.push(Number(data.GDORDER));
                }
            });
        }

        /**
         * [initDropDown description]初始化下拉框
         * @return {[type]} [description]
         */
        function initDropDown() {
            // $scope.data.singleJsons = initSingleSelecet.docStatus();
            // $scope.data.docStatus = angular.copy($scope.data.singleJsons[0]);
            $scope.data.docTypeJsons = initSingleSelecet.websiteDocType();
            $scope.data.selectedDocType = angular.copy($scope.data.docTypeJsons[0]);
            $scope.data.timeTypeJsons = initSingleSelecet.timeType();
            $scope.data.selectedTimeType = angular.copy($scope.data.timeTypeJsons[0]);
            $scope.data.sortTypeJsons = initSingleSelecet.sortType();
            $scope.data.sortType = angular.copy($scope.data.sortTypeJsons[1]);
            $scope.data.classifyJsons = initSingleSelecet.iWoEntire();
            $scope.data.selectedClassify = angular.copy($scope.data.classifyJsons[0]);
        }

        /**
         * [getESSearchParams description]设置ES检索参数
         * @return {[json]} [description] 参数对象
         */
        function getESSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForAppSignedDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: $scope.data.selectedClassify.value,
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
                        keywords: $scope.data.sortType.value
                    }]
                }
            };
            esParams.searchParams = JSON.stringify(esParams.searchParams);
            return esParams;
        }

        /**
         * [listenStorage description]监听本地缓存
         * @return {[promise]} [description] promise
         */
        function listenStorage() {
            storageListenerService.listenApp(function() {
                $scope.status.isESSearch = false;
                requestData();
                storageListenerService.removeListener("app");
            });
        }

        // /**
        //  * [pushBar description] 稿件推头条
        //  * @return {[type]} [description]
        //  */
        // $scope.pushBar = function() {
        //     var chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
        //     var metaDataId = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
        //     pushBar(chnlDocIds, metaDataId);

        // };

        // /**
        //  * [pushBar description] 推头条函数
        //  * @param  {[type]} chnlDocIds  [description]
        //  * @param  {[type]} MetaDataIds [description]
        //  * @return {[type]}             [description]
        //  */
        // function pushBar(chnlDocIds, metaDataId) {
        //     trsconfirm.confirmModel("推头条", "您确定推送头条么？", function() {
        //         var params = {
        //             "serviceid": "mlf_appoper",
        //             "methodname": "pushTopChnl",
        //             "ChnlDocIds": chnlDocIds,
        //             "MetaDataIds": metaDataId,
        //             "ChannelId": $stateParams.channelid,
        //         };
        //         $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
        //             trsconfirm.alertType("推头条成功", "", "success", false, function() {
        //                 requestData();
        //             });
        //         });
        //     });
        // }

        /**
         * [retraction description] 稿件取消签发
         * @return {[type]} [description]
         */
        $scope.retraction = function() {
            $scope.status.isESSearch = false;
            var chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
            var metaDataId = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
            retraction(chnlDocIds, metaDataId);
        };

        /**
         * [retraction description] 取消签发函数
         * @param  {[type]} ChnlDocIds  [description]
         * @param  {[type]} MetaDataIds [description]
         * @param  {[type]} content     [description]
         * @return {[type]}             [description]
         */
        function retraction(chnlDocIds, metaDataId) {
            trsconfirm.inputModel("是否确认取消签发", "取消签发原因(可选)", function(content) {
                var params = {
                    "serviceid": "mlf_appoper",
                    "methodname": "withdraw",
                    "ObjectIds": chnlDocIds,
                    "ChnlDocIds": chnlDocIds,
                    "MetaDataIds": metaDataId,
                    "WithDrawOpinion": content
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("取消签发成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        }

        /**
         * [move description] 移动稿件
         * @return {[type]} [description]
         */
        $scope.move = function() {
            $scope.status.isESSearch = false;
            editingCenterAppService.moveDraft('移动稿件', $stateParams.siteid, $stateParams.channelid, 5, function(data) {
                var chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
                var metaDataId = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
                var params = {
                    "serviceid": "mlf_appoper",
                    "methodname": "moveMetaDatas",
                    "SrcChannelId": $stateParams.channelid,
                    "ChnlDocIds": chnlDocIds,
                    "MetaDataIds": metaDataId,
                    "ToChannelId": data.channelid
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("稿件移动成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        };

        /**
         * [outSending description] 稿件外发
         * @return {[type]} [description]
         */
        $scope.outSending = function() {
            $scope.status.isESSearch = false;
            if (checkDraftType($scope.status.draftType.subject) || checkDraftType($scope.status.draftType.linkDoc)) {
                trsconfirm.alertType("只能外发新闻稿或图集稿", '', "error", false);
                return;
            }
            editingCenterService.outSending("", function(result) {
                outSendingDraft(result.selectItems);
            });
        };

        /**
         * [outSendingDraft description] 外发函数
         * @param  {[type]} data.items [description]
         * @param  {[type]} item  [description]
         * @return {[type]}       [description]
         */
        function outSendingDraft(items) {
            var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
            var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ",");
            var params = {
                serviceid: "mlf_mailoutgoingOper",
                methodname: "appYiQianFaSendEmail",
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
         * [examDraftType description]检验稿件类型
         * @param  {[obj]} elm [description]稿件的具体信息
         * @return {[type]}     [description]
         */
        $scope.examDraftType = function(elm) {
            if (angular.isDefined(elm)) {
                return elm.DOCTYPEID == 3 || elm.DOCTYPEID == 4;
            }
        };

        /**
         * [collect description] 稿件收藏
         * @return {[type]} [description]
         */
        $scope.collect = function() {
            $scope.status.isESSearch = false;
            var temp = $filter('pick')($scope.data.selectedArray, $scope.examDraftType);
            if (temp.length < 1) {
                var chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
                var metaDataId = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
                trsconfirm.confirmModel("稿件收藏", "确认收藏稿件", function() {
                    var params = {
                        "serviceid": "mlf_appoper",
                        "methodname": "collectionMetaDatas",
                        "ChnlDocIds": chnlDocIds,
                        "MetaDataIds": metaDataId,
                        "ChannelId": $stateParams.channelid
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
                        trsconfirm.alertType("收藏成功", "", "success", false);
                        requestData();
                    });
                });
            } else {
                trsconfirm.alertType("只能收藏新闻稿或图集稿", '', "error", false);
            }

        };


        /**
         * [printBtn description] 稿件打印
         * @return {[type]} [description]
         */
        $scope.printBtn = function() {
            $scope.status.isESSearch = false;
            if (checkDraftType($scope.status.draftType.subject)) {
                trsconfirm.alertType("所选稿件中有专题稿，无法打印", '', "error", false);
                return;
            }
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
                    trsPrintService.trsWebPrintDocument($scope.data.printResult, true);
                    $scope.data.printResult = [];
                }
            });
        }

        /**
         * [hide description] 隐藏已签发稿件
         * @return {[type]} [description]
         */
        $scope.hide = function() {
            $scope.status.isESSearch = false;
            var chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
            var metaDataId = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
            hide(chnlDocIds, metaDataId);
        };

        /**
         * [hide description] 隐藏已签发稿件函数
         * @param  {[type]} chnlDocIds [description]
         * @param  {[type]} metaDataId [description]
         * @return {[type]}            [description]
         */
        function hide(chnlDocIds, metaDataId) {
            trsconfirm.confirmModel("隐藏", "是否确定修改显示状态？", function() {
                var params = {
                    "serviceid": "mlf_appoper",
                    "methodname": "hidden",
                    "ChannelId": $stateParams.channelid,
                    "ChnlDocIds": chnlDocIds,
                    "MetaDataIds": metaDataId
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("隐藏成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        }

        /**
         * [hide description] 已签发稿件取消隐藏
         * @return {[type]} [description]
         */
        $scope.cancelHidden = function() {
            $scope.status.isESSearch = false;
            var chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
            var metaDataId = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
            cancelHidden(chnlDocIds, metaDataId);
        };

        /**
         * [hide description] 取消隐藏函数
         * @param  {[type]} chnlDocIds [description]
         * @param  {[type]} metaDataId [description]
         * @return {[type]}            [description]
         */
        function cancelHidden(chnlDocIds, metaDataId) {
            trsconfirm.confirmModel("取消隐藏", "是否确定修改显示状态？", function() {
                var params = {
                    "serviceid": "mlf_appoper",
                    "methodname": "cancelHidden",
                    "ChannelId": $stateParams.channelid,
                    "ChnlDocIds": chnlDocIds,
                    "MetaDataIds": metaDataId
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType("取消隐藏成功", "", "success", false, function() {
                        requestData();
                    });
                });
            });
        }

        /**
         * [fixed description] 稿件固定位置
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        $scope.fixed = function() {
            $scope.status.isESSearch = false;
            if ($scope.data.selectedArray.length > 1) {
                trsconfirm.alertType("固定位置无法多选", "", "error", false);
                return;
            }
            var chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
            fixedPosition(chnlDocIds);
        };

        /**
         * [fixedPosition description] 固定位置函数
         * @param  {[type]} chnlDocIds [description]
         * @return {[type]}            [description]
         */
        function fixedPosition(chnlDocIds) {
            var rankLength = $scope.data.items.length > 10 ? 10 : $scope.data.items.length;
            trsconfirm.selectedModel('新闻置顶', rankLength, function(position) {
                var params = {
                    "serviceid": "mlf_appoper",
                    "methodname": "sortFixedMetaDatas",
                    "ChnlDocId": chnlDocIds,
                    "ChannelId": $stateParams.channelid,
                    "_OrderSort": position
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.fixPos.push(Number(position));
                    requestData();
                });
            }, $scope.fixPos);
        }

        /**
         * [cancelFixed description] 取消固定位置
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        $scope.cancelFixed = function() {
            $scope.status.isESSearch = false;
            if ($scope.data.selectedArray.length > 1) {
                trsconfirm.alertType("取消定位无法多选", "", "error", false);
                return;
            }
            var chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
            cancelPosition(chnlDocIds);
        };

        /**
         * [cancelPosition description] 取消固定位置函数
         * @param  {[type]} chnlDocIds [description]
         * @return {[type]}            [description]
         */
        function cancelPosition(chnlDocIds) {
            trsconfirm.confirmModel('取消定位', "是否取消固定定位", function() {
                var params = {
                    "serviceid": "mlf_appoper",
                    "methodname": "cancelFixedMetaDatas",
                    "ChnlDocId": chnlDocIds,
                    "ChannelId": $stateParams.channelid,
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.fixPos.splice($scope.fixPos.indexOf(Number($scope.data.selectedArray.GDORDER)));
                    requestData();
                });
            });
        }

        /**
         * [exportDraft description] 导出稿件
         * @return {[type]} [description]
         */
        $scope.exportDraft = function() {
            $scope.status.isESSearch = false;
            var temp = $filter('pick')($scope.data.selectedArray, $scope.examDraftType);
            if (temp.length < 1) {
                var params = {
                    serviceid: 'mlf_exportword',
                    methodname: 'exportWordFile',
                    MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ','),
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    $window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
                    $scope.data.selectedArray = [];
                });
            } else {
                trsconfirm.alertType("只能导出新闻稿或图集稿", '', "error", false);
            }
        };

        /**
         * [isOnlyMine description]只看我的
         * @return {Boolean} [description] null
         */
        $scope.isOnlyMine = function() {
            $scope.status.copyCurrPage = $scope.params.CurrPage = $scope.page.CURRPAGE = "1";
            $scope.status.onlyMine = !$scope.status.onlyMine;
            $scope.params.isOnlyMine = $scope.status.onlyMine;
            requestData();
        };

        /**
         * [queryByDropdown description] 筛选条件
         * @param  {[type]} key   [description]
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        $scope.queryDropDown = function(key, value) {
            $scope.params[key] = value;
            $scope.data.copyCurrPage = $scope.params.CurrPage = $scope.page.CURRPAGE = "1";
            if (key == 'timeType') {
                if (value.length < 10) {
                    $scope.params.OperTimeStart = null;
                    $scope.params.OperTimeEnd = null;
                } else {
                    $scope.params.OperTimeStart = $scope.data.fromdate;
                    $scope.params.OperTimeEnd = $scope.data.untildate;
                    $scope.params[key] = null;
                }
            }
            requestData();
        };

        /**
         * [fullTextSearch description;全文检索]
         * @param  {[type]} ev [description:按下回车也能提交]
         */
        $scope.fullTextSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                if ($scope.data.selectedClassify.value == "DocID") {
                    $scope.status.isESSearch = false;
                    $scope.params.DocId = $scope.keywords;
                } else {
                    $scope.status.isESSearch = true;
                }
                $scope.page.CURRPAGE = 1;
                requestData();
            }
        };

        /**
         * [selectAll description] 全选
         * @return {[type]} [description]
         */
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
        };

        /**
         * [selectDoc description] 单选
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        $scope.selectDoc = function(item) {
            if ($scope.data.selectedArray.indexOf(item) < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
            }
        };

        //h5拖拽开始
        // $scope.dragoverCallback = function(event, index, external, type) {
        //     return index < 10;
        // };
        $scope.dropCallback = function(event, index, item, external, type, allowedType) {
            var trueIndex;
            var params = {
                "serviceid": "mlf_appoper",
                "methodname": "sortPositionMetaDatas",
                "ChannelId": $stateParams.channelid,
                "FromChnlDocId": item.CHNLDOCID,
            };
            if ($scope.moveIndex < index) {
                trueIndex = index - 1;
                params.Position = 0;
            } else {
                trueIndex = index;
                params.Position = 1;
            }
            params.ToChnlDocId = $scope.data.items[trueIndex].CHNLDOCID;
            trsconfirm.alertType("位置调整", "确定调整位置么？", "info", true, function() {
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    requestData();
                });
            }, function() { requestData(); });
            return item;
        };
        //h5拖拽结束
        $scope.getIndex = function(index) {
            $scope.moveIndex = index;
        };

        /**
         * [showVersionTime description]展示流程版本与操作日志
         * @param  {[str]} MetaDataId [description]
         * @return {[type]}            [description]
         */
        $scope.showVersionTime = function(item) {
            editingCenterService.getVersionTime(item, false);
        };

        /** [selectPageNum description] 每页显示的数据数量
         */
        $scope.selectPageNum = function() {
            $scope.data.copyCurrPage = 1;
            $scope.params.PageSize = $scope.page.PAGESIZE;
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            requestData();
        };

        /**
         * [pageChanged description] 分页
         * @return {[type]} [description]
         */
        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.data.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };

        /**
         * [jumpToPage description] 跳转到指定页面
         * @return {[type]} [description]
         */
        $scope.jumpToPage = function() {
            if ($scope.data.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.data.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.params.CurrPage = $scope.data.copyCurrPage;
            $scope.page.CURRPAGE = $scope.data.copyCurrPage;
            requestData();
        };

        // 雅安日报新增
        $scope.push = function() {
            // $modal.open({
            //     templateUrl: "./editingCenter/app/service/pushWindow/pushWin_tpl.html",
            //     windowClass: "edit-app-push-win-class",
            //     controller: "editAppPushWinCtrl",
            //     backdrop:false,
            //     resolve: {
            //         item: function() {
            //             return $scope.data.selectedArray;
            //         }
            //     }
            // });
            editingCenterAppService.pushDraft($scope.data.selectedArray,"雅安云报",function(){
                $scope.data.selectedArray = [];
            });
        };
    }
]);
