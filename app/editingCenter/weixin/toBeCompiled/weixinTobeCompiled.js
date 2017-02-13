"use strict";
angular.module('weixinTobeCompiledModule', ['weixinTobeCompiledRouter']).controller('WeiXinTobeCompiledCtrl', ['$scope', "$filter", "$http", "$q", "$modal", "$state", "$stateParams", "trsHttpService", "$timeout", "$window", "trsconfirm", "storageListenerService", "initSingleSelecet", "editingCenterService", "trsspliceString", "trsPrintService", "WeiXininitService", "editcenterRightsService", "globleParamsSet", function($scope, $filter, $http, $q, $modal, $state, $stateParams, trsHttpService, $timeout, $window, trsconfirm, storageListenerService, initSingleSelecet, editingCenterService, trsspliceString, trsPrintService, WeiXininitService, editcenterRightsService, globleParamsSet) {
    initStatus();
    initData();

    /**
     * [initStatus description] 初始化状态
     * @return {[type]} [description]
     */
    function initStatus() {
        $scope.data = {
            items: [],
            selectedArray: [],
            printResult: [],
        };
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
            params: {
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "serviceid": "mlf_wechat",
                "methodname": "queryToBeCompiledDoc",
                "ChannelId": $stateParams.channelid,
                "timeType": "",
                "DocType": ""
            },
            copyCurrPage: 1,
            currChannel: {},
            btnRights: {},
            onlyMine: false,
            isESSearch: false
        };
    }

    /**
     * [initData description] 初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        initCurrSite();
        requestData();
        initDropDown();
        initBtnRights();
        listenStorage();
    }

    /**
     * [initCurrSite description] 获取栏目名称
     * @return {[type]} [description]
     */
    function initCurrSite() {
        WeiXininitService.queryCurrChannel($stateParams.channelid).then(function(data) {
            $scope.status.currChannel = data.substring(data.indexOf('《') + 1, data.indexOf('"', 1));
        });
    }

    /**
     * [requestData description] 请求数据
     * @return {[type]} [description]
     */
    function requestData() {
        var params = $scope.status.isESSearch ? getESSearchParams() : $scope.status.params;
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.items = data.DATA;
            $scope.page.ITEMCOUNT = data.PAGER.ITEMCOUNT;
            $scope.page.PAGESIZE = data.PAGER.PAGESIZE;
            $scope.data.selectedArray = [];
        });
    }

    /**
     * [initDropDown description] 初始化下拉框
     * @return {[type]} [description]
     */
    function initDropDown() {
        //初始化选择日期
        $scope.data.timeTypeJsons = initSingleSelecet.timeType();
        $scope.data.timeType = angular.copy($scope.data.timeTypeJsons[0]);
        //初始化全部
        $scope.data.iWoAll = initSingleSelecet.iWoEntire();
        $scope.data.iWoAllSelected = angular.copy($scope.data.iWoAll[0]);
        //初始化排序方式
        $scope.data.sortTypeJsons = initSingleSelecet.sortType();
        $scope.data.sortType = angular.copy($scope.data.sortTypeJsons[1]);
    }

    /**
     * [getESSearchParams description]设置ES检索参数
     * @return {[json]} [description] 参数对象
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForWeChatToBeCompiledDoc",
            searchParams: {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: $scope.page.CURRPAGE + "",
                searchFields: [{
                    searchField: $scope.data.iWoAllSelected.value,
                    keywords: $scope.keywords ? $scope.keywords : ""
                }, {
                    searchField: "timeType",
                    keywords: $scope.data.timeType.value
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
     * [initBtnRights description] 初始化权限
     * @return {[type]} [description]
     */
    function initBtnRights() {
        editcenterRightsService.initWeixinListBtn('wechat.daibian', $stateParams.channelid).then(function(rights) {
            $scope.status.btnRights = rights;
        });
    }

    /**
     * [listenStorage description] 监听本地缓存
     * @return {[type]} [description]
     */
    function listenStorage() {
        storageListenerService.listenWeixin(function() {
            $scope.status.isESSearch = false;
            requestData();
            storageListenerService.removeListener("weixin");
        });
    }

    /**
     * [examDraft description]检测微信稿件是否带图片
     * @return {[type]} [description]
     */
    function examDraft() {
        var deferred = $q.defer();
        var params = {
            serviceid: "mlf_wechatoper",
            methodname: "canPublish",
            Metadataids: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ","),
        };
        $http({ //使用$http为无奈之举，trsHttpService将错误直接return了，出错时拿不到值
            method: "POST",
            url: trsHttpService.getWCMRootUrl(),
            headers: {
                'formdata': "1",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: params
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }
    /**
     * [trial description] 稿件送审
     * @return {[type]} [description]
     */
    $scope.trial = function() {
        examDraft().then(function(data) {
            if (data.ISSUCCESS === 'true') {
                $scope.status.isESSearch = false;
                var metaDataIds = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
                trsconfirm.inputModel("送审", "送审意见（可选）", function(content) {
                    var params = {
                        "serviceid": "mlf_wechatoper",
                        "methodname": "trialMetaDatas",
                        "MetaDataIds": metaDataIds,
                        "Opinion": content,
                        "CurrChnlId": $scope.status.params.ChannelId,
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                        .then(function(data) {
                            trsconfirm.alertType("送审成功", "", "success", false);
                            requestData();
                        });
                });
            } else {
                trsconfirm.alertType("送审失败", "所选稿件中存在没有缩略图的稿件", "warning", false);
            }

        }).then(function(data) {
            //网络请求失败处理
        });
    };


    /**
     * [sign description] 稿件签发
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.sign = function() {
        $scope.status.isESSearch = false;
        var chnldocIDs = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ',');
        trsconfirm.confirmModel('签发', '确认签发', function() {
            var params = {
                serviceid: "mlf_wechatoper",
                methodname: "webDaiBianPublish",
                ObjectIds: chnldocIDs,
                ChnlDocIds: chnldocIDs
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("签发成功", "", "success", false, function() {
                    requestData();
                });
            });
        });
    };

    /**
     * [draftlist description] 发稿单
     * @return {[type]} [description]
     */
    $scope.draftlist = function() {
        $scope.status.isESSearch = false;
        editingCenterService.draftList($scope.data.selectedArray, {
            "serviceid": "mlf_appfgd",
            "methodname": "webDaiBianbatchUpdateFgdUsers"
        }, function() {
            requestData();
        });
    };

    /**
     * [delete description] 废稿
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.delete = function() {
        $scope.status.isESSearch = false;
        var chnldocIDs = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ',');
        trsconfirm.inputModel('是否确认废稿', "删除稿件原因（可选）", function(content) {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "trashMetaDatas",
                ChnlDocIds: chnldocIDs,
                ChannelId: $scope.status.params.ChannelId,
                Opinion: content
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function() {
                requestData();
            });
        });
    };

    /**
     * [outSending description] 邮件外发
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.outSending = function() {
        $scope.status.isESSearch = false;
        editingCenterService.outSending("", function(result) {
            outSendingDraft(result.selectItems, $scope.data.selectedArray);
        });
    };

    /**
     * [outSendingDraft description] 邮件外发开始
     * @param  {[type]} items [description]
     * @param  {[type]} item  [description]
     * @return {[type]}       [description]
     */
    function outSendingDraft(items, item) {
        var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
        var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ",");
        var params = {
            serviceid: "mlf_mailoutgoingoper",
            methodname: "wechatDaiBianSendEmail",
            Emails: userids,
            MetaDataIds: draftids
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType("邮件外发成功", "", "success", false, function() {
                requestData();
            });
        });
    }

    /**
     * [collect description] 稿件收藏
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.collect = function() {
        $scope.status.isESSearch = false;
        var chnldocids = trsspliceString.spliceString($scope.data.selectedArray, 'RECID', ',');
        trsconfirm.confirmModel("稿件收藏", "确认收藏稿件", function() {
            var params = {
                serviceid: "mlf_wechatoper",
                methodname: "collectionDAIBIANDocs",
                ChnlDocIds: chnldocids,
                ChannelId: $scope.status.params.ChannelId
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
                trsconfirm.alertType("收藏成功", "", "success", false);
                requestData();
            });
        });
    };

    /**
     * [exportDraft description] 导出稿件
     * @return {[type]} [description]
     */
    $scope.exportDraft = function() {
        $scope.status.isESSearch = false;
        var params = {
            serviceid: 'mlf_exportword',
            methodname: 'exportWordFile',
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ','),
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            $window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
            requestData();
        });
    };

    /**
     * [printBtn description] 打印
     * @return {[type]} [description]
     */
    $scope.printBtn = function() {
        $scope.status.isESSearch = false;
        angular.forEach($scope.data.selectedArray, function(value, key) {
            requestPrintVersion(value).then(function(data) {
                requestPrintData(value, data);
            });
        });
    };

    /**
     * [requestPrintVersion description] 打印请求流程
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
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
     * [requestPrintData description] 打印请求详情
     * @param  {[type]} item    [description]
     * @param  {[type]} version [description]
     * @return {[type]}         [description]
     */
    function requestPrintData(item, version) {
        var params = {
            "serviceid": "mlf_website",
            "methodname": "getNewsDoc",
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
     * [isOnlyMine description] 只看我的
     * @return {Boolean} [description]
     */
    $scope.isOnlyMine = function() {
        $scope.status.copyCurrPage = $scope.status.params.CurrPage = $scope.page.CURRPAGE = "1";
        $scope.status.onlyMine = !$scope.status.onlyMine;
        $scope.status.params.isOnlyMine = $scope.status.onlyMine;
        requestData();
    };

    /**
     * [queryByDropdown description] 筛选条件
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
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

    /**
     * [fullTextSearch description;全文检索]
     * @param  {[type]} ev [description:按下回车也能提交]
     */
    $scope.fullTextSearch = function(ev) {
        if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
            if ($scope.data.iWoAllSelected.value == "DocID") {
                $scope.status.isESSearch = false;
                $scope.status.params.DocId = $scope.keywords;
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
        cancelBatchOperate();
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
        cancelBatchOperate();
    };

    /**
     * [cancelBatchOperate description] 取消批量操作的样式
     * @return {[type]} [description]
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
        $scope.status.copyCurrPage = 1;
        $scope.status.params.PageSize = $scope.page.PAGESIZE;
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        requestData();
    };

    /**
     * [selectPageNum description] 选择一页要显示的数据量
     * @return {[type]} [description]
     */
    $scope.selectPageNum = function() {
        $scope.status.copyCurrPage = 1;
        $scope.status.params.PageSize = $scope.page.PAGESIZE;
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        requestData();
    };

    /**
     * [pageChanged description] 待编页面分页
     * @return {[type]} [description]
     */
    $scope.pageChanged = function() {
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };

    /**
     * [jumpToPage description] 跳转到指定页面
     * @return {[type]} [description]
     */
    $scope.jumpToPage = function() {
        if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.status.params.CurrPage = $scope.status.copyCurrPage;
        $scope.page.CURRPAGE = $scope.status.copyCurrPage;
        requestData();
    };
}]);
