"use strict";
angular.module('iWoReceivedManuscriptModule', []).
controller('iWoReceivedManuscriptCtrl', receivedManuscriptCtrl);
receivedManuscriptCtrl.$injector = ["$scope", "$rootScope", "$q", "$filter", "$timeout", "$modal", "localStorageService", "trsHttpService", "SweetAlert", "trsconfirm", "myManuscriptService", 'initSingleSelecet', 'editingCenterService', 'trsResponseHandle', 'trsspliceString', "initVersionService", "iWoService", "editcenterRightsService", "storageListenerService", "globleParamsSet", "trsPrintService "];

function receivedManuscriptCtrl($scope, $rootScope, $q, $filter, $timeout, $modal, localStorageService, trsHttpService, SweetAlert, trsconfirm, myManuscriptService, initSingleSelecet, editingCenterService, trsResponseHandle, trsspliceString, initVersionService, iWoService, editcenterRightsService, storageListenerService, globleParamsSet, trsPrintService) {
    initStatus();
    initData();

    //初始化状态
    function initStatus() {
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.getPageSize(),
            "ITEMCOUNT": 0,
            "PAGECOUNT": 1
        };
        $scope.status = {
            onmouseBtn: "",
            params: {
                "serviceid": "mlf_releasesource",
                "methodname": "queryReceivedRelease",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE
            },
            copyCurrPage: 1,
            btnRights: [],
            batchOperateBtn: {
                hoverStatus: "",
                clickStatus: ""
            },
            receiveEdit: 1,
            methodname: {
                1: "getNewsDoc",
                2: "getPicsDoc"
            },
            isESSearch: false, //是否通过ES检索列表,

        };
        $scope.data = {
            items: [],
            selectedArray: [], //已选
            selectedBtn: "",
            editPath: iWoService.initEditPath(),
            preview: iWoService.initPreviewPath(),
            dropdown: {

            },
            printResult: []
        };
        editcenterRightsService.initIwoListBtn("iwo.received").then(function(rights) {
            $scope.status.btnRights = rights;
        });
    }
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
     * [draft description]传稿
     */
    $scope.draft = function() {
        $scope.status.batchOperateBtn.clickStatus = "draft";
        myManuscriptService.draft("传稿", angular.copy($scope.data.selectedArray), function() {
            requestData();
        }, function() {
            requestData();
        }, "receivedTransferMetaDatas");
    };
    /**
     * [getDraft description]取刚传稿件
     */
    $scope.getDraft = function() {
        $scope.status.batchOperateBtn.clickStatus = "getDraft";
        var array = angular.copy($scope.data.selectedArray);
        myManuscriptService.getDraft(array, 'mlf_myrelease', 'queryRecentTransferedDoc', 'receivedGetRecentTransferedDoc', function(data) {
            requestData();
        });
    };
    /**
     * [singleDraft description]单个传稿
     * @param  {[type]} item [description] 传入单个对象
     * @return {[type]}      [description] null
     */
    $scope.singleDraft = function(item) {
        myManuscriptService.draft("传稿", [item], function() {
            requestData();
        }, "receivedTransferMetaDatas");
    };
    /**
     * [batchShare description]共享
     * @return {[type]} [description] null
     */
    $scope.batchShare = function() {
        var shareSelectedArray = angular.copy($scope.data.selectedArray);
        var ChnlDocIds = trsspliceString.spliceString(shareSelectedArray, "CHNLDOCID", ",");
        var MetaDataIds = trsspliceString.spliceString(shareSelectedArray, "METADATAID", ",");
        share(ChnlDocIds, MetaDataIds);
    };
    /**
     * [getESSearchParams description]设置ES检索参数
     * @return {[json]} [description] 参数对象
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForIwoReceivedDoc",
            searchParams: {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: $scope.page.CURRPAGE + "",
                searchFields: [{
                    searchField: $scope.iWoEntireSelected.value,
                    keywords: $scope.keywords ? $scope.keywords : ""
                }, {
                    searchField: "docType",
                    keywords: $scope.iWoDocTypeSelected.value
                }, {
                    searchField: "timeType",
                    keywords: $scope.timeType.value
                }, {
                    searchField: "docStatus",
                    keywords: $scope.iWoDocStatuSelected.value
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
     * [share description]共享方法体
     * @param  {[string]} chnldocids  [description] chnldocid 以逗号隔开  
     * @param  {[string]} metadataids [description] metadataid 以逗号隔开
     * @return {[null]}             [description]
     */
    function share(chnldocids, metadataids) {
        editingCenterService.share(function(data) {
            data.serviceid = 'mlf_myrelease';
            data.methodname = 'receivedMyShare';
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
     * [exportDraft description]导出稿件
     * @return {[type]} [description] null
     */
    $scope.exportDraft = function() {
        var params = {
            serviceid: 'mlf_exportword',
            methodname: 'exportWordFile',
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ','),
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            window.open("/wcm/app/file/read_file.jsp?FileName=" + data)
        });
    };
    /**
     * [draftlist description]发稿单
     * @return {[type]} [description] null
     */
    $scope.draftlist = function() {
        $scope.status.batchOperateBtn.clickStatus = "draftlist";
        editingCenterService.draftList($scope.data.selectedArray, {
            "serviceid": "mlf_appfgd",
            "methodname": "iwoReceivedbatchUpdateFgdUsers"
        }, function() {
            $scope.data.selectedArray = [];
            requestData();
        });
    };
    /**
     * [more description]更多
     * @return {[type]} [description] null
     */
    $scope.more = function() {
        $scope.status.batchOperateBtn.clickStatus = "more";
    };


    /**
     * [initData description]初始化数据
     * @return {[type]} [description] null
     */
    function initData() {
        requestData();
        getDropDown();
        listenStorage();
        // getUnreadCounts();

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
     * [requestData description]数据请求
     * @param  {Function} callback [description] 回调函数
     * @return {[type]}            [description] null
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
     * [selectAll description]全选
     * @return {[type]} [description] null
     */
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
        cancelBatchOperate();
    };

    /**
     * [selectDoc description]全选
     * @param  {[object]} item [description] 单个对象
     * @return {[type]}      [description] null
     */
    $scope.selectDoc = function(item) {
        //item.selected ? $scope.data.selectedArray.push(item) : $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
        if ($scope.data.selectedArray.indexOf(item) < 0) {
            $scope.data.selectedArray.push(item);
        } else {
            $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
        }
        cancelBatchOperate();
    };

    /**
     * [cancelBatchOperate description]取消批量操作的样式
     * @return {[type]} [description] null
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
     * [getDropDown description] 初始化下拉框
     * @return {[type]} [description] null
     */
    function getDropDown() {
        //全部
        $scope.iWoEntireJsons = initSingleSelecet.iWoEntire();
        $scope.iWoEntireSelected = angular.copy($scope.iWoEntireJsons[0]);
        //类型
        $scope.iWoDocTypes = initSingleSelecet.iWoDocType();
        $scope.iWoDocTypeSelected = angular.copy($scope.iWoDocTypes[0]);
        //初始化选择日期
        $scope.timeTypeJsons = initSingleSelecet.iWoOperTime();
        $scope.timeType = angular.copy($scope.timeTypeJsons[0]);
        //状态
        $scope.iWoDocStatus = initSingleSelecet.iWoReceiveDocStatus();
        $scope.iWoDocStatuSelected = angular.copy($scope.iWoDocStatus[0]);
        //下拉框单选结束

        // 排序方式
        $scope.sortTypeJsons = initSingleSelecet.sortType();
        $scope.sortType = angular.copy($scope.sortTypeJsons[1]);
    }
    /**
     * [deleteManuscript description]更多之废稿操作
     * @param  {[type]} metaDataIds [description] metadataid 逗号分隔
     * @param  {[type]} content          [description] 废稿意见
     * @return {[type]}                  [description] null
     */
    function deleteManuscript(metaDataIds, content) {
        var params = {
            serviceid: "mlf_myrelease",
            methodname: "scrapReceivedRelease",
            metadataids: metaDataIds,
            Opinion: content
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("废稿成功", "", "success", false);
            requestData();
        });
    }
    /**
     * [batchDelete description]批量废稿
     * @return {[type]} [description] null
     */
    $scope.batchDelete = function() {
        trsconfirm.inputModel("是否确认废除稿件", "废除稿件原因（可选）", function(content) {
            var metaDataIds = trsspliceString.spliceString($scope.data.selectedArray,
                'METADATAID', ',');
            deleteManuscript(metaDataIds, content);
        });
    };
    /**
     * [rejection description]退稿
     * @return {[type]} [description]null
     */
    $scope.rejection = function() {
        $scope.status.batchOperateBtn.clickStatus = "rejection";
        myManuscriptService.rejection(angular.copy($scope.data.selectedArray), function() {
            trsconfirm.alertType("退稿成功", "", "success", false, function() {
                requestData();
            });
        }, function() {
            requestData();
        });
    };
    /**
     * [submit description]提交
     * @return {[type]} [description] null
     */
    $scope.submit = function() {
        $scope.status.batchOperateBtn.clickStatus = "submit";
        myManuscriptService.submit(angular.copy($scope.data.selectedArray), function() {
            requestData();
        }, function() {
            requestData();
        }, "receivedSubmitMedia");
    };
    /**
     * [singleSubmit description]单个提交
     * @param  {[object]} item [description] 单个记录对象
     * @return {[type]}      [description]
     */
    $scope.singleSubmit = function(item) {
        myManuscriptService.submit([item], function() {
            requestData();
        }, "receivedSubmitMedia");
    };
    /**
     * [selectPageNum description]选择单页显示个数
     * @return {[type]} [description] null
     */
    $scope.selectPageNum = function() {
        $scope.status.params.PageSize = $scope.page.PAGESIZE;
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = 1;
        requestData();
    };
    /**
     * [showVersionTime description]流程版本时间与操作日志
     * @param  {[object]} item [description] 单个对象
     * @return {[type]}      [description]
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
     * [outSending description]外发
     * @return {[type]} [description] null1
     */
    $scope.outSending = function() {
        editingCenterService.outSending("", function(result) {
            outSendingDraft(result.selectItems);
        });
    };
    /**
     * [outSendingDraft description]外发FUN
     * @param  {[type]} items [description] 单条记录
     * @return {[type]}       [description] null
     */
    function outSendingDraft(items) {
        var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
        var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ",");
        var params = {
            serviceid: "mlf_mailoutgoingoper",
            methodname: "iReceivedSendEmail",
            Emails: userids,
            MetaDataIds: draftids
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType("邮件外发成功！", "", "success", false, function() {
                requestData();
            });
        });
    }
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
     * [getUnreadCounts description：获取已收稿库未读信息]
     */

    // function getUnreadCounts() {
    //     var params = {
    //         "serviceid": "mlf_releasesource",
    //         "methodname": "queryReceivedReleaseUnreadCount"
    //     };
    //     trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
    //         // $scope.status.isUnread = data == "0" ? false : true;
    //         $scope.$emit("isUnreadEvent", data.replace(/\"/g,""));
    //     });
    // }

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
                methodname: "mergePicDocsOfReceived",
                MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ','),
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function() {
                trsconfirm.alertType("合并图集成功！", "", "success", false, function() {
                    $scope.data.selectedArray = [];
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
