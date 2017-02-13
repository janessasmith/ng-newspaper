"use strict";
angular.module('iWoManuscriptCollectionModule', [])
    .controller('iWoManuscriptCollectionCtrl', ['$scope', "$q", '$state', 'initSingleSelecet', "$stateParams", 'trsHttpService', "trsconfirm", "$document", "$popover", "initVersionService", "$modal", "trsspliceString", "$timeout", "trsResponseHandle", "editcenterRightsService", "resCtrModalService", "resourceCenterService", "iWoService", "editingCenterService", "storageListenerService", "globleParamsSet",
        function($scope, $q, $state, initSingleSelecet, $stateParams, trsHttpService, trsconfirm, $document, $popover, initVersionService, $modal, trsspliceString, $timeout, trsResponseHandle, editcenterRightsService, resCtrModalService, resourceCenterService, iWoService, editingCenterService, storageListenerService, globleParamsSet) {
            initStatus();
            initData();
            /**
             * [listenStorage description]监听本地缓存
             * @return {[promise]} [description] promise
             */
            function listenStorage() {
                storageListenerService.listenIwo(function() {
                    requestData();
                    storageListenerService.removeListener("iwo");
                });
            }
            /**
             * [exportDraft description:数据请求方法]
             */
            function requestData() {
                //判断是否启用ES检索
                var params = $scope.status.isESSearch ? getESSearchParams() : angular.copy($scope.params);
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                    $scope.data.items = data.DATA;

                    var ListItems = data.DATA;
                    !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
                    $scope.data.selectedArray = [];
                    requestListImg(ListItems).then(function(data) {
                        angular.forEach(ListItems, function(value, key) {
                            value.ALLIMG = data[value.MLFID];
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
                        metadataids: trsspliceString.spliceString(items, "MLFID", ","),
                        DocCollect: true
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        defer.resolve(data);
                    });
                }
                return defer.promise;
            }
            /**
             * [promptRequest description]具体操作数据请求成功后刷新列表
             * @param  {[obj]} params [description]请求参数
             * @param  {[string]} info   [description]提示语
             * @return {[type]}        [description]
             */
            function promptRequest(params, info) {
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    trsconfirm.alertType(info, "", "success", false, function() {
                        requestData();
                    });
                });
            }
            /**
             * [exportDraft description:下一页]
             */
            $scope.pageChanged = function() {
                $scope.params.CurrPage = $scope.page.CURRPAGE;
                $scope.status.copyCurrPage = $scope.page.CURRPAGE;
                requestData();
            };
            /**
             * [exportDraft description:跳转至指定页面]
             */
            $scope.jumpToPage = function() {
                if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
                    $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
                }
                $scope.params.CurrPage = $scope.status.copyCurrPage;
                $scope.page.CURRPAGE = $scope.status.copyCurrPage;
                requestData();
            };
            /**
             * [exportDraft description:全选]
             */
            $scope.selectAll = function() {
                $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
            };
            /**
             * [exportDraft description:单选]
             */
            $scope.selectDoc = function(item) {
                if ($scope.data.selectedArray.indexOf(item) < 0) {
                    $scope.data.selectedArray.push(item);
                } else {
                    $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
                }
            };

            /**
             * [exportDraft description:初始化数据]
             */
            function initData() {
                requestData();
                iWoListBtn();
                initDropDown();
                listenStorage();
            }

            /**
             * [exportDraft description:初始化状态]
             */
            function initStatus() {
                $scope.status = {
                    batchOperateBtn: {
                        "hoverStatus": "",
                        "clickStatus": ""
                    },
                    icon: {
                        noVideo: '0',
                        noAudio: '0',
                        noPic: '0'
                    },
                    btnRights: [],
                    isESSearch: false
                };
                $scope.data = {
                    selectedArray: [],
                    preview: {
                        '1': 'iWoNewsPreview',
                        '2': 'iWoAtlasPreview'
                    },
                    docPic: {
                        '1': '新闻',
                        '2': '图集'
                    },
                    id: {
                        siteid: $stateParams.siteid,
                        channelid: $stateParams.channelid
                    },
                    dropDown: {
                        'iWoSelectedAll': '',
                        'iWoEntireJsons': '',
                        'iWoDocSelected': '',
                        'docTypeJsons': '',
                        'collectTimeSelected': '',
                        'collectTimeJsons': '',
                        'createTimeSelected': '',
                        'createTimeJsons': ''
                    }
                };
                $scope.page = {
                    "CURRPAGE": 1,
                    "PAGESIZE": globleParamsSet.getPageSize(),
                    "ITEMCOUNT": 0,
                    "PAGECOUNT": 1,
                };
                $scope.status.copyCurrPage = 1;
                $scope.params = {
                    "serviceid": "mlf_myrelease",
                    "methodname": "queryCollections",
                    "PageSize": $scope.page.PAGESIZE,
                    "CurrPage": $scope.page.CURRPAGE,
                    "DocType": '',
                    "CrTime": '',
                    "CoTime": ''
                };
            }
            /**
             * [exportDraft description:初始化权限按钮]
             */
            function iWoListBtn() {
                editcenterRightsService.initIwoListBtn("iwo.collect").then(function(rights) {
                    $scope.status.btnRights = rights;
                });
            }
            /**
             * [exportDraft description:初始化下拉框的数据]
             */
            function initDropDown() {
                //下拉框单选
                initSingleSelecet.channelStatus().then(function(data) {
                    $scope.iWotest = data;
                });
                //ES类型选择
                $scope.data.dropDown.iWoEntireJsons = initSingleSelecet.iWoEntire();
                $scope.data.dropDown.iWoSelectedAll = angular.copy($scope.data.dropDown.iWoEntireJsons[0]);
                //选择类型
                $scope.data.dropDown.docTypeJsons = initSingleSelecet.docType();
                $scope.data.dropDown.iWoDocSelected = angular.copy($scope.data.dropDown.docTypeJsons[0]);
                //收藏时间
                $scope.data.dropDown.collectTimeJsons = initSingleSelecet.iWoCollect();
                $scope.data.dropDown.collectTimeSelected = angular.copy($scope.data.dropDown.collectTimeJsons[0])
                    //创建时间
                $scope.data.dropDown.createTimeJsons = initSingleSelecet.iWoCollectCreatTime();
                $scope.data.dropDown.createTimeSelected = angular.copy($scope.data.dropDown.createTimeJsons[0])
                    // 排序方式
                $scope.sortTypeJsons = initSingleSelecet.sortType();
                $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
            }
            /**
             * [exportDraft description:下拉框筛选]
             */
            $scope.queryByDropdown = function(key, selected) {
                $scope.params[key] = selected.value;
                $scope.params.CurrPage = $scope.status.copyCurrPage = $scope.page.CURRPAGE = "1";
                if (key == 'CrTime' || key == 'CoTime') {
                    if (selected.value.length < 10) {
                        $scope.params.CollectTimeStart = null;
                        $scope.params.CollectTimeEnd = null;
                    } else {
                        $scope.params.CollectTimeStart = $scope.data.fromdate;
                        $scope.params.CollectTimeEnd = $scope.data.untildate;
                        $scope.params[key] = null;
                    }
                }
                requestData();
            };
            /**
             * [exportDraft description:删除稿件的方法]
             */
            $scope.deleteTit = function() {
                var MetaDataIds = trsspliceString.spliceString($scope.data.selectedArray,
                    'DOCCOLLECTRELID', ',');
                delectDoc(MetaDataIds);
            };
            /**
             * [exportDraft description:删除稿件的方法]
             * @param  {[string]} items [description]所选稿件的DOCCOLLECTRELID集合
             */
            function delectDoc(ChnlDocIds) {
                trsconfirm.inputModel("是否确认取消收藏", "删除稿件原因（可选）", function(content) {
                    var params = {
                        "serviceid": "mlf_myrelease",
                        "methodname": "delCollections",
                        "Ids": ChnlDocIds,
                    };
                    promptRequest(params, "删除成功");
                });
            }
            /**
             * [exportDraft description:选择单页显示个数]
             */
            $scope.selectPageNum = function() {
                $scope.status.copyCurrPage = 1;
                $scope.params.PageSize = $scope.page.PAGESIZE;
                $scope.params.CurrPage = $scope.page.CURRPAGE;
                requestData();
            };
            /**
             * [exportDraft description:单个复制稿件]
             * @param  {[obj]} item [description]单条稿件项
             */
            $scope.copyBuildDraft = function(item) {
                copyBuildDraft([item]);
            };
            /**
             * [exportDraft description:批量复制稿件]
             */
            $scope.batchCopyBuildDraft = function() {
                copyBuildDraft($scope.data.selectedArray);
            };
            /**
             * [exportDraft description:复制稿件方法]
             */
            function copyBuildDraft(array) {
                var params = {
                    serviceid: "mlf_myrelease",
                    methodname: "copyCollection",
                    Ids: trsspliceString.spliceString(array, 'DOCCOLLECTRELID', ',')
                };
                promptRequest(params, "复制成功");
            }
            /**
             * [exportDraft description:导出稿件]
             */
            $scope.exportDraft = function() {
                var params = {
                    serviceid: "mlf_exportword",
                    methodname: "exportCollectedDocs",
                    DOCCOLLECTRELIDS: trsspliceString.spliceString($scope.data.selectedArray, 'DOCCOLLECTRELID', ',')
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    // window.open(data);
                    window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
                })
            };
            /**
             * [exportDraft description:邮件外发]
             */
            $scope.outSending = function() {
                editingCenterService.outSending("", function(result) {
                    outSendingDraft(result.selectItems);
                });
            };
            /**
             * [exportDraft description:邮件外发]
             * @param  {[obj]} items [description]所选的需要外发的邮箱
             */
            function outSendingDraft(items) {
                var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
                var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'DOCCOLLECTRELID', ",");
                var params = {
                    serviceid: "mlf_mailoutgoingOper",
                    methodname: "iColletionSendEmail",
                    Emails: userids,
                    doccollectrelids: draftids
                };
                promptRequest(params, "邮件外发成功");
            }
            /**
             * [fullTextSearch description;全文检索]
             * @param  {[type]} ev [description:按下空格也能提交]
             */
            $scope.fullTextSearch = function(ev) {
                if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                    $scope.status.isESSearch = true;
                    requestData();
                }
            };
            /**
             * [getESSearchParams description]设置ES检索参数
             * @return {[json]} [description] 参数对象
             */
            function getESSearchParams() {
                var esParams = {
                    serviceid: "mlf_essearch",
                    methodname: "queryForIwoCollectDoc",
                    searchParams: {
                        PAGESIZE: $scope.page.PAGESIZE + "",
                        PAGEINDEX: $scope.page.CURRPAGE + "",
                        searchFields: [{
                            searchField: $scope.data.dropDown.iWoSelectedAll.value,
                            keywords: $scope.keywords ? $scope.keywords : ""
                        }, {
                            searchField: "docType",
                            keywords: $scope.data.dropDown.iWoDocSelected.value //稿件类型
                        }, {
                            searchField: "collectTimeType",
                            keywords: $scope.data.dropDown.collectTimeSelected.value //收藏时间
                        }, {
                            searchField: "createTimeType",
                            keywords: $scope.data.dropDown.createTimeSelected.value //创建时间
                        }, {
                            searchField: "_sort",
                            keywords: $scope.sortType.value
                        }]
                    }
                };
                esParams.searchParams = JSON.stringify(esParams.searchParams);
                return esParams;
            }
        }
    ]);
