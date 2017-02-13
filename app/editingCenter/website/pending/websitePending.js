/**
    Author:XCL
    Time:2015-12-14
**/
"use strict";
angular.module('websitePendingModule', [
    'websitePendingRouterModule',
    'editingCenterCompiledPendingTimingSignModule'
]).
controller('websitePendingCtrl', websitePendingCtrl);
websitePendingCtrl.$injector = ["$scope", "$filter", "$q", "$modal", "$stateParams", "$state", "$window", "editIsLock", "localStorageService", "trsHttpService", "SweetAlert", "initSingleSelecet", "editingCenterService", "trsspliceString", "trsconfirm", "websiteService", "initVersionService", "editcenterRightsService", "storageListenerService", "globleParamsSet", "trsPrintService"];

function websitePendingCtrl($scope, $filter, $q, $modal, $stateParams, $state, $window, editIsLock, localStorageService, trsHttpService, SweetAlert, initSingleSelecet, editingCenterService, trsspliceString, trsconfirm, websiteService, initVersionService, editcenterRightsService, storageListenerService, globleParamsSet, trsPrintService) {
    initStatus();
    initData();
    //初始化状态
    function initStatus() {
        $scope.urlPath = ["websitenews", "websiteatlas"];
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.getPageSize(),
            "ITEMCOUNT": 0,
            "PAGECOUNT": 0
        };
        $scope.params = {
            "serviceid": "mlf_website",
            "methodname": "queryReviewDoc",
            "SiteId": $stateParams.siteid,
            "ChannelId": $stateParams.channelid,
            "PageSize": $scope.page.PAGESIZE,
            "CurrPage": $scope.page.CURRPAGE,
            "isOnlyMine": false,
            "IsCurrentChnl": false,
            "DocType": "",
            "timeType": "",
            "DocId": ""
        };
        $scope.status = {
            'isESSearch': false,
            'copyCurrPage': 1,
            'icon': {
                noVideo: '0',
                noAudio: '0',
                noPic: '0'
            },
            'urlPath': {
                "1": "websitenews",
                "2": "websiteatlas",
            },
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
            "isAllRoute": {
                'isAllRoute': true,
                'isWebsite': true
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
            'selectedArray': [],
            'printResult': [],
            'id': {
                channelid: $stateParams.channelid,
                siteid: $stateParams.siteid
            },
            'btnRights': "",
            'dropDown': {
                'allType': '',
                'allTypeSelected': '',
                'timeType': '',
                'timeTypeSelected': '',
                'websiteAll': '',
                'websiteAllSelected': ''
            },
            editPath: websiteService.getEditandPreviewPath().edit,
        };
        $scope.status.isCrTime = websiteService.storgeTimeOrder;
        $scope.params.OrderBy = websiteService.storgeTimeOrder === 'OPERTIME' ? null : "CrTime";
    }
    //初始化数据
    function initData() {
        requestData();
        initDropList();
        initListBtn();
        listenStorage();
    }
    /**
     * [initListBtn description]初始化权限按钮列表
     */
    function initListBtn() {
        editcenterRightsService.initWebsiteListBtn('web.daishen', $stateParams.channelid).then(function(rights) {
            $scope.data.btnRights = rights;
            getObjLength($scope.data.btnRights);
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

    //请求数据
    function requestData() {
        var params = $scope.status.isESSearch ? getESSearchParams() : $scope.params;
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
        }, function() {
            requestData();
        });
    }
    /**
     * [initDropList description] 初始化下拉框
     */
    function initDropList() {
        //类型
        $scope.data.dropDown.allType = initSingleSelecet.websiteDocType();
        $scope.data.dropDown.allTypeSelected = angular.copy($scope.data.dropDown.allType[0]);
        //时间
        $scope.data.dropDown.timeType = initSingleSelecet.chooseTimeType();
        $scope.data.dropDown.timeTypeSelected = angular.copy($scope.data.dropDown.timeType[0]);
        //ES条件
        $scope.data.dropDown.websiteAll = initSingleSelecet.iWoEntire();
        $scope.data.dropDown.websiteAllSelected = angular.copy($scope.data.dropDown.websiteAll[0]);
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
    $scope.queryByDropdown = function(key, selected) {
        $scope.params[key] = selected.value;
        $scope.status.copyCurrPage = $scope.params.CurrPage = $scope.page.CURRPAGE = "1";
        if (key == 'timeType') {
            if (selected.value.length < 10) {
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
     * [isOnlyMine description] 是否只看我的
     */
    $scope.isOnlyMine = function() {
        $scope.params.isOnlyMine = !$scope.params.isOnlyMine;
        $scope.status.copyCurrPage = $scope.params.CurrPage = $scope.page.CURRPAGE = "1";
        requestData();
    };

    /**
     * [isOnlyCurChannel description]只看当前栏目
     * @return {Boolean} [description] null
     */
    $scope.isOnlyCurChannel = function() {
        $scope.status.copyCurrPage = $scope.params.CurrPage = $scope.page.CURRPAGE = "1";
        $scope.params.IsCurrentChnl = !$scope.params.IsCurrentChnl;
        requestData();
    };

    /**
     * [pageChanged description] 下一页
     */
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = $scope.page.CURRPAGE;
        requestData();
    };
    /**
     * [jumpToPage description] 跳转到指定页面
     */
    $scope.jumpToPage = function() {
        if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
            $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.params.CurrPage = $scope.status.copyCurrPage;
        $scope.page.CURRPAGE = $scope.params.CurrPage;
        requestData();
    };
    /**
     * [selectPageNum description]选择单页分页条数
     * @return {[type]} [description]
     */
    $scope.selectPageNum = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.params.PageSize = $scope.page.PAGESIZE;
        $scope.status.copyCurrPage = 1;
        requestData();
    };
    /**
     * [copyDraft description] 复制稿件
     */
    $scope.copyDraft = function(item) {
        copyDraft(item);
    };
    /**
     * [copyDraft description] 复制稿件方法
     */
    function copyDraft(item) {
        websiteService.batChooseChnl("复制稿件", $stateParams.siteid, function(data) {
            var params = {
                "serviceid": "mlf_websiteoper",
                "methodname": "copyDAISHENDoc",
                "ChannelId": $stateParams.channelid,
                "MetaDataIds": trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, "METADATAID", ","),
                "ChannelIds": data.ChannelIds
            };
            promptRequest(params, "复制稿件成功");
        });
    }
    /**
     * [moveDraft description] 移动稿件
     */
    $scope.moveDraft = function(item) {
        if (!!item) moveDraft([item]);
        else {
            moveDraft($scope.data.selectedArray);
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
     * [filterChannelId description]栏目ID过滤器
     * @param  {[obj]} elm [description]传入的值
     * @return {[type]}     [description]
     */
    $scope.filterChannelId = function(elm) {
        if (angular.isDefined(elm.CHANNELID)) {
            return elm.CHANNELID == $scope.data.selectedArray[0].CHANNELID;
        }
    };
    /**
     * [moveDraft description] 移动稿件方法
     */
    function moveDraft(items) {
        var temp = $filter("pick")(items, $scope.filterChannelId);
        if (temp.length === items.length) {
            websiteService.singleChooseChnl("移动稿件", $stateParams.siteid, $stateParams.channelid, function(data) {
                var params = {
                    "serviceid": "mlf_websiteoper",
                    "methodname": "moveDAISHENDoc",
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
     * [collectDraft description] 稿件收藏
     */
    $scope.collectDraft = function(item) {
        trsconfirm.confirmModel("稿件收藏", "确认收藏稿件", function() {
            collectDraft(item);
        });
    };
    /**
     * [collectDraft description] 稿件收藏方法
     */
    function collectDraft(item) {
        var temp = $filter('pick')($scope.data.selectedArray, $scope.filterChannelId);
        if (temp.length === $scope.data.selectedArray.length) {
            var params = {
                'serviceid': 'mlf_websiteoper',
                'methodname': 'collectionDAISHENDocs',
                'ChannelId': $scope.data.selectedArray[0].CHANNELID,
                'ChnlDocIds': trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'RECID', ',')
            };
            promptRequest(params, "稿件收藏成功");
        } else {
            trsconfirm.alertType('收藏失败', "所选稿件不属于同一栏目", "error", false);
            $scope.data.selectedArray = [];
        }
    }
    /**
     * [outSending description] 邮件外发
     */
    $scope.outSending = function(item) {
        editingCenterService.outSending("", function(result) {
            outSendingDraft(result.selectItems, item);
        });
    };
    /**
     * [outSendingDraft description] 邮件外发方法
     */
    function outSendingDraft(items, item) {
        var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
        var draftids = trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'METADATAID', ",");
        var params = {
            serviceid: "mlf_mailoutgoingOper",
            methodname: "webDaiShenSendEmail",
            Emails: userids,
            MetaDataIds: draftids
        };
        promptRequest(params, "邮件外发成功");
    }
    /**
     * [shareDraft description] 共享
     */
    $scope.shareDraft = function(item) {
        share(item);
    };
    /**
     * [share description] 共享方法
     */
    function share(item) {
        editingCenterService.share(function(data) {
            data.serviceid = 'mlf_websiteoper';
            data.methodname = 'doShareDAISHEN';
            data.ChannelId = $stateParams.channelid;
            data.MetaDataIds = trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, "METADATAID", ",");
            data.ChnlDocIds = trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, "CHNLDOCID", ",");
            promptRequest(data, '稿件共享成功');
        });
    }
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
     * [rejectionDraft description] 撤稿
     */
    $scope.rejectionDraft = function(item) {
        trsconfirm.inputModel("是否确认撤稿", "撤稿原因(可选)", function(content) {
            rejection(item, content);
        });
    };
    /**
     * [rejection description] 退稿方法
     */
    function rejection(item, Opinion) {
        var params = {
            'serviceid': "mlf_websiteoper",
            'methodname': "rejectionMetaDatas",
            'ChannelId': $stateParams.channelid,
            'Opinion': Opinion,
            'ChnlDocIds': trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, "CHNLDOCID", ","),
            'metaDataIds': trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, "METADATAID", ","),
        };
        promptRequest(params, '撤稿成功');
    }
    /**
     * [draftlist description] 发稿单
     */
    $scope.draftlist = function() {
        editingCenterService.draftList($scope.data.selectedArray, {
            "serviceid": "mlf_appfgd",
            "methodname": "webDaiShenbatchUpdateFgdUsers"
        }, function() {
            $scope.data.selectedArray = [];
        });
    };
    /**
     * [directSigned description] 签发
     */
    $scope.directSigned = function(item) {
        trsconfirm.confirmModel('签发', '确认发布稿件', function() {
            signed(item);
        });
    };
    /**
     * [signed description] 签发方法
     */
    function signed(item) {
        var params = {
            'serviceid': "mlf_websiteoper",
            'methodname': "webDaiShenPublish",
            'ObjectIds': trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, "RECID", ','),
            'ChnlDocIds': trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, "RECID", ',')
        };
        promptRequest(params, '直接签发成功');
    }
    /**
     * [multitermTiimeSigned description] 定时签发
     */
    $scope.multitermTiimeSigned = function() {
        timeSigned();
    };
    /**
     * [timeSigned description] 定时签发方法
     */
    function timeSigned() {
        var params = {
            selectedArray: $scope.data.selectedArray,
            isNewDraft: false,
            methodname: "webDaiShenTimingPublish"
        };
        editingCenterService.draftTimeSinged(params).then(function(data) {
            requestData();
        }, function() {
            requestData();
        });
    }
    /**
     * [selectAll description] 全选
     */
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : []
            .concat($scope.data.items);
    };
    /**
     * [selectDoc description] 单选
     */
    $scope.selectDoc = function(item) {
        if ($scope.data.selectedArray.indexOf(item) < 0) {
            $scope.data.selectedArray.push(item);
        } else {
            $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(item), 1);
        }
    };
    /**
     * [showVersionTime description]展示流程版本与操作日志
     * @param  {[str]} MetaDataId [description]
     * @return {[type]}            [description]
     */
    $scope.showVersionTime = function(item) {
        editingCenterService.getVersionTime(item, false);
    };
    /**
     * [fullTextSearch description;全文检索]
     * @param  {[type]} ev [description:按下空格也能提交]
     */
    $scope.fullTextSearch = function(ev) {
        if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
            if ($scope.data.dropDown.websiteAllSelected.value == "DocID") {
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
     * [getESSearchParams description]设置ES检索参数
     * @return {[json]} [description] 参数对象
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForWebSiteToBeReviewDoc",
            searchParams: {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: $scope.page.CURRPAGE + "",
                searchFields: [{
                    searchField: $scope.data.dropDown.websiteAllSelected.value,
                    keywords: $scope.keywords ? $scope.keywords : ""
                }, {
                    searchField: "docType",
                    keywords: $scope.data.dropDown.allTypeSelected.value
                }, {
                    searchField: "timeType",
                    keywords: $scope.data.dropDown.timeTypeSelected.value
                }, {
                    searchField: "isOnlyMine",
                    keywords: $scope.params.isOnlyMine
                }, {
                    searchField: "channelid",
                    keywords: $scope.data.id.channelid
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
                status: 1
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
        $scope.params.OrderBy = type === 'OPERTIME' ? null : "CrTime";
        requestData();
    };
}
