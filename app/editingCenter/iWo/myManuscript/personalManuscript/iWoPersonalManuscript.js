/**
 *  Module
 *
 * Description: IWO 个人稿库
 * Author:wang.jiang 2016-2-20
 * Modify:wang.jiang 2016-2-21
 */
"use strict";
angular.module('iWoPersonalManuscriptModule', []).
controller('iWopersonalManuscriptCtrl', ["$scope", "$q", '$window', "$modal", "$timeout", '$filter', "trsHttpService", "SweetAlert", "myManuscriptService", "trsconfirm", "initSingleSelecet", "trsResponseHandle", "trsspliceString", "$stateParams", "editingCenterService", "initVersionService", "iWoService", "editcenterRightsService", "trsPrintService", "localStorageService", "storageListenerService", "globleParamsSet",


    function personalManuscriptCtrl($scope, $q, $window, $modal, $timeout, $filter, trsHttpService, SweetAlert, myManuscriptService, trsconfirm, initSingleSelecet, trsResponseHandle, trsspliceString, $stateParams, editingCenterService, initVersionService, iWoService, editcenterRightsService, trsPrintService, localStorageService, storageListenerService, globleParamsSet) {
        initStatus();
        initData();
        /**
         * [initStatus description:初始化状态]
         */
        function initStatus() {
            $scope.data = {
                items: [],
                selectedArray: [], //已选
                editPath: iWoService.initEditPath(),
                preview: iWoService.initPreviewPath(),
                printResult: []
            };
            /**
             * [page description:分页信息]
             */
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": globleParamsSet.getPageSize(),
                "ITEMCOUNT": 0,
                "PAGECOUNT": 1
            };
            $scope.status = {
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },
                personalEdit: 0,
                copyCurrPage: 1,
                btnRights: [], //权限按钮
                params: {
                    "serviceid": "mlf_releasesource",
                    "methodname": "queryPersonalRelease",
                    "PageSize": $scope.page.PAGESIZE,
                    "CurrPage": $scope.page.CURRPAGE,
                    "OperTime": ""
                },
                methodname: {
                    1: "getNewsDoc",
                    2: "getPicsDoc"
                },
                isESSearch: false, //是否通过ES检索列表
            };
        }
        /** 
         * [draftImport description]导入文档
         * @return {[type]} [description]
         */
        $scope.draftImport = function() {
            editingCenterService.draftImport("mlf_extmyrelease", "releaseSourceImportDoc", "", function() {
                requestData();
            });
        };
        /**
         * [pageChanged description:下一页]
         */
        $scope.pageChanged = function() {
            $scope.status.params.CurrPage = $scope.page.CURRPAGE;
            $scope.status.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };

        /**
         * [jumpToPage description:跳转指定页面]
         */
        $scope.jumpToPage = function() {
            if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.status.params.CurrPage = $scope.status.copyCurrPage;
            $scope.page.CURRPAGE = $scope.status.copyCurrPage;
            requestData();
        };
        /**
         * [getESSearchParams description]设置ES检索参数
         * @return {[json]} [description] 参数对象
         */
        function getESSearchParams() {
            var esParams = {
                serviceid: "mlf_essearch",
                methodname: "queryForIwoPersonalDoc",
                searchParams: {
                    PAGESIZE: $scope.page.PAGESIZE + "",
                    PAGEINDEX: $scope.page.CURRPAGE + "",
                    searchFields: [{
                        searchField: $scope.iWoAllSelected.value,
                        keywords: $scope.keywords ? $scope.keywords : ""
                    }, {
                        searchField: "docType",
                        keywords: $scope.iWoDocStatusSelected.value
                    }, {
                        searchField: "timeType",
                        keywords: $scope.timeType.value
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
         * [draft description:传稿]
         */
        $scope.draft = function() {
            $scope.status.batchOperateBtn.clickStatus = "draft";
            myManuscriptService.draft("传稿", angular.copy($scope.data.selectedArray), function() {
                requestData();
            }, function() {
                requestData();
            }, "personalTransferMetaDatas");
        };
        /**
         * [copyBuildDraft description:复制建新稿]
         */
        $scope.copyBuildDraft = function() {
            if ($scope.data.selectedArray.length === 0) {
                trsconfirm.alertType("请选择稿件", "请选择稿件", "info", false, function() {});
            } else {
                myManuscriptService.copyBuildDraft($scope.data.selectedArray, "personalCopyBuildDraft", function() {
                    //$scope.selectedArray = [];
                    requestData();
                });
            }
        };
        //
        /**
         * [draftlist description:发稿单]
         */
        $scope.draftlist = function() {
            $scope.status.batchOperateBtn.clickStatus = "draftlist";
            editingCenterService.draftList($scope.data.selectedArray, {
                "serviceid": "mlf_appfgd",
                "methodname": "iwoPersonbatchUpdateFgdUsers"
            }, function() {
                $scope.data.selectedArray = [];
                requestData();
            });
        };

        /**
         * [singleDraft description:单个传稿]
         * @param  {[type]} item [description:传入稿件]
         */
        $scope.singleDraft = function(item) {
            myManuscriptService.draft("传稿", [item], function() {
                requestData();
            }, "personalTransferMetaDatas");
        };
        /**
         * [new description:新建 ]
         */
        $scope.new = function() {
            $scope.status.batchOperateBtn.clickStatus = "new";
        };
        /**
         * [more description:更多]
         */
        $scope.more = function() {
            $scope.status.batchOperateBtn.clickStatus = "more";
        };
        /**
         * [exportDraft description:导出稿件]
         */
        $scope.exportDraft = function() {
            var params = {
                serviceid: 'mlf_exportword',
                methodname: 'exportWordFile',
                MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ','),
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
            });
        };
        /**
         * [submit description:提交]
         */
        $scope.submit = function() {
            $scope.status.batchOperateBtn.clickStatus = "submit";
            myManuscriptService.submit(angular.copy($scope.data.selectedArray), function() {
                requestData();
            }, function() {
                requestData();
            }, "personalSubmitMedia");
        };
        //
        /**
         * [singleSubmit description:单个提交]
         * @param  {[type]} item [description:稿件对象]
         */
        $scope.singleSubmit = function(item) {
            myManuscriptService.submit([item], function() {
                requestData();
            }, "personalSubmitMedia");
        };
        /**
         * [initData description:初始化数据]
         */
        function initData() {
            //依据初始化按钮
            editcenterRightsService.initIwoListBtn("iwo.personal").then(function(rights) {
                $scope.status.btnRights = rights;
            });
            requestData();
            initDropDown();
            listenStorage();

        }
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
         * [requestData description:数据请求函数]
         */
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
        /**
         * [selectAll description:全选]
         */
        $scope.selectAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
            cancelBatchOperate();
        };
        /**
         * [selectDoc 单选]
         * @param  {[type]} item [description：单个对象] 
         */
        $scope.selectDoc = function(item) {
            if ($scope.data.selectedArray.indexOf(item) < 0) {
                $scope.data.selectedArray.push(item);
            } else {
                $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
            }
            cancelBatchOperate();
        };

        /**
         * [cancelBatchOperate description：取消批量操作的样式]
         */
        function cancelBatchOperate() {
            if ($scope.data.selectedArray.length === 0) {
                $scope.status.batchOperateBtn = {
                    "hoverStatus": "",
                    "clickStatus": ""
                };
            }
        }
        /**
         * [batchShare description：共享]
         */
        $scope.batchShare = function() {
            var shareSelectedArray = angular.copy($scope.data.selectedArray);
            var ChnlDocIds = trsspliceString.spliceString(shareSelectedArray, "CHNLDOCID", ",");
            var MetaDataIds = trsspliceString.spliceString(shareSelectedArray, "METADATAID", ",");
            share(ChnlDocIds, MetaDataIds);
        };

        /**
         * [share description：共享方法]
         * @param  {[type]} chnldocids  [description:逗号隔开的ID]
         * @param  {[type]} metadataids [description：逗号隔开的ID]
         * @return {[type]}             [description]
         */
        function share(chnldocids, metadataids) {
            editingCenterService.share(function(data) {
                data.serviceid = 'mlf_myrelease';
                data.methodname = 'personalMyShare';
                data.ChnlDocIds = chnldocids;
                data.MetaDataIds = metadataids;
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), data, "post")
                    .then(function(data) {
                        trsconfirm.alertType("共享成功", "", "success", false, function() {
                            requestData();
                        });
                    }, function() {
                        requestData();
                    });
            });
        }
        /**
         * [outSending description：外发]
         */
        $scope.outSending = function() {
            editingCenterService.outSending("", function(result) {
                outSendingDraft(result.selectItems);
            });
        };

        function outSendingDraft(items) {
            var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
            var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ",");
            var params = {
                serviceid: "mlf_mailoutgoingOper",
                methodname: "iPersonSendEmail",
                Emails: userids,
                MetaDataIds: draftids
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("稿件外发成功！", "", "success", false, function() {
                    requestData();
                });
            });
        }
        /**
         * [deleteManuscript description：废稿方法]
         * @param  {[type]} chnlDocIdsArray [description：id数组]
         * @param  {[type]} content         [description：废稿意见]
         */
        function deleteManuscript(chnlDocIdsArray, content) {
            var params = {
                serviceid: "mlf_myrelease",
                methodname: "scrapMyRelease",
                ChnlDocIds: chnlDocIdsArray,
                Opinion: content

            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("废稿成功！", "", "success", false);
                requestData();
            });

        }
        /**
         * [batchDelete description：批量废稿]
         */
        $scope.batchDelete = function() {
            trsconfirm.inputModel("是否确认废除稿件", "废除稿件原因（可选）", function(content) {
                var chnlDocIdsArray = trsspliceString.spliceString($scope.data.selectedArray,
                    'CHNLDOCID', ',');
                deleteManuscript(chnlDocIdsArray, content);
            });
        };
        /**
         * [printBtn description：打印]
         */
        $scope.printBtn = function() {
            angular.forEach($scope.data.selectedArray, function(value, key) {
                requestPrintVersion(value).then(function(data) {
                    requestPrintData(value, data);
                });
            });
        };
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
                "serviceid": "mlf_myrelease",
                "methodname": $scope.status.methodname[item.DOCTYPEID],
                "MetaDataId": item.METADATAID
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                var result = data;
                data.VERSION = version;
                data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
                $scope.data.printResult.push(result);
                if ($scope.data.printResult.length == $scope.data.selectedArray.length) {
                    trsPrintService.trsIwoPrintDocument($scope.data.printResult);
                    $scope.data.printResult = [];
                }
            });
        }
        /**
         * [singleDelete description：单个删除]
         * @param  {[type]} item [description：稿件对象]
         */
        $scope.singleDelete = function(item) {
            trsconfirm.inputModel("是否确认废除稿件", "废除稿件原因（可选", function(content) {
                deleteManuscript(item.CHNLDOCID, content);
            });
        };
        /**
         * [getDraft description：取单传稿件 多选]
         * @param  {[type]} item [description：稿件对象]
         * @return {[type]}      [description]
         */
        $scope.getDraft = function(item) {
            /*trsconfirm.listModel($scope, 'mlf_myrelease', 'queryRecentTransferedDoc', function() {
                takeDraft(list);                   
            });*/
            $scope.status.batchOperateBtn.clickStatus = "getDraft";
            var array = angular.copy($scope.data.selectedArray);
            myManuscriptService.getDraft(array, 'mlf_myrelease', 'queryRecentTransferedDoc', 'personalGetRecentTransferedDoc', function(data) {
                requestData();
            });
        };
        /**
         * [initDropDown description:初始化下拉框]
         */
        function initDropDown() {
            //初始化选择日期
            $scope.timeTypeJsons = initSingleSelecet.iWoOperTime();
            $scope.timeType = angular.copy($scope.timeTypeJsons[0]);
            //初始状态
            $scope.iWoDocStatusName = initSingleSelecet.iWoDocType();
            $scope.iWoDocStatusSelected = angular.copy($scope.iWoDocStatusName[0]);
            //初始化全部
            $scope.iWoAll = initSingleSelecet.iWoEntire();
            $scope.iWoAllSelected = angular.copy($scope.iWoAll[0]);
            // 排序方式
            $scope.sortTypeJsons = initSingleSelecet.sortType();
            $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
        }
        /**
         * [selectPageNum description:选择单页显示个数]
         */
        $scope.selectPageNum = function() {
            $scope.status.params.PageSize = $scope.page.PAGESIZE;
            $scope.status.params.CurrPage = $scope.page.CURRPAGE;
            $scope.status.copyCurrPage = 1;
            requestData();
        };
        /**
         * [queryByDropdown description] 筛选条件触发后请求数据
         * @param  {[type]} key   [description] 请求对象参数key
         * @param  {[type]} value [description] 请求对象值
         * @return {[type]}       [description] null
         */
        $scope.queryByDropdown = function(key, value) {
            $scope.status.params[key] = value;
            $scope.status.params.CurrPage = $scope.status.copyCurrPage = $scope.page.CURRPAGE = "1";
            if (key == 'OperTime') {
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
        /**
         * [showVersionTime description:流程版本时间与操作日志]
         * @param  {[type]} item [description:稿件对象]
         */
        $scope.showVersionTime = function(item) {
            editingCenterService.getVersionTime(item, true);
        };
        /**
         * [fullTextSearch description;全文检索]
         * @param  {[type]} ev [description:按下空格也能提交]
         */
        $scope.fullTextSearch = function(ev) {
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                $scope.status.isESSearch = true;
                $scope.page.CURRPAGE = 1;
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), getESSearchParams(), "post").then(function(data) {
                    $scope.data.items = data.DATA;
                    $scope.page = data.PAGER;
                });
            }
        };
        /**
         * [mergeToAtlas description] 合并成图集
         * @return {[type]} [description]
         */
        $scope.mergeToAtlas = function() {
            var hasUnAtlas = $filter('some')($scope.data.selectedArray, "DOCTYPEID!=='2'");
            if (hasUnAtlas) {
                trsconfirm.alertType("您选择的稿件中包含非图集稿", "", "error", false, function() {});
            } else {
                var params = {
                    serviceid: "mlf_myrelease",
                    methodname: "mergePicDocsOfPersonal",
                    MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ','),
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function() {
                    trsconfirm.alertType("合并图集成功！", "", "success", false, function() {
                        requestData();
                    });


                });
            }
        };

        //川报修改
        /**
         * [submitToHXSJB description] 推送到华西手机报
         * @return {[type]} [description]
         */
        // $scope.submitToHXSJB = function() {
        //     if ($scope.data.selectedArray.length > 1) {
        //         trsconfirm.alertType("一次只能选择一篇稿件推送至华西手机报", "", "warning", false);
        //         $scope.data.selectedArray.length = [];
        //     } else {
        //         trsconfirm.confirmModel('推送', '确认推送到华西手机报', function() {
        //             var params = {
        //                 serviceid: "mlf_mobilepaperexchange",
        //                 methodname: "pushDocToMobilePaper",
        //                 DocId: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ','),
        //             };
        //             trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
        //                 trsconfirm.alertType("推送成功", "", "success", false, function() {
        //                     requestData();
        //                 });
        //             });
        //         });
        //     }
        // };
    }
]);
