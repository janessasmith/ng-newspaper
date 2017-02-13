"use strict";
angular.module('websiteSignedModule', [
    'websiteSignedRouterModule',
    'editWebsiteCancelDraftMgrModule',
    'batchGeneratingModule',
    'batchMoveNewsModule',
    'websiteSignedServiceModule'
]).
controller('websiteSignedCtrl', signed);
signed.$injector = ["$scope", "$filter", "$q", "$modal", "$stateParams", "$state", "$window", "editIsLock", "localStorageService", "trsHttpService", "SweetAlert", "initSingleSelecet", "editingCenterService", "trsconfirm", "trsspliceString", "websiteService", "initVersionService", "editcenterRightsService", "signedService", "storageListenerService", "globleParamsSet", "trsPrintService"];

function signed($scope, $filter, $q, $modal, $stateParams, $state, $window, editIsLock, localStorageService, trsHttpService, SweetAlert, initSingleSelecet, editingCenterService, trsconfirm, trsspliceString, websiteService, initVersionService, editcenterRightsService, signedService, storageListenerService, globleParamsSet, trsPrintService) {
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
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
            params: {
                "serviceid": "mlf_website",
                "methodname": "querySignedDoc",
                "CurrPage": $scope.page.CURRPAGE,
                "PageSize": $scope.page.PAGESIZE,
                "ChannelId": $stateParams.channelid,
                "SiteId": $stateParams.siteid,
                "timeType": "",
                "IsCurrentChnl": false,
                "DocId": ""
            },
            siteid: $stateParams.siteid,
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
            copyCurrPage: 1,
            btnLength: 0,
            hiddenDraft: '1',
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
            id: {
                channelid: $stateParams.channelid,
                siteid: $stateParams.siteid
            }
        };
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
     * [initData description]初始化数据
     * @return {[type]} [description] null
     */
    function initData() {
        if (!angular.isDefined($stateParams.siteid)) return; //如果没有站点，不进行初始化请求
        requestData();
        dropList();
        listenStorage();
        editcenterRightsService.initWebsiteListBtn('web.yiqianfa', $stateParams.channelid).then(function(rights) {
            $scope.status.btnRights = rights;
            getObjLength($scope.status.btnRights);
        });
        editingCenterService.getChannelDetail($stateParams.channelid).then(function(data) {
            $scope.data.getChannelDetail = data;
        });
    }
    /**
     * [pageChanged description]初始化数据
     * @return {[type]} [description] null
     */
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
     * [selectPageNum description]选择单页分页条数
     * @return {[type]} [description]
     */
    $scope.selectPageNum = function() {
        $scope.status.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.params.PageSize = $scope.page.PAGESIZE;
        $scope.status.copyCurrPage = 1;
        requestData();
    };
    /**
     * [selectAll description]初始化数据
     * @return {[type]} [description] null
     */
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : []
            .concat($scope.data.items);
    };
    /**
     * [selectDoc description]初始化数据
     * @return {[type]} [description] null
     */
    $scope.selectDoc = function(item) {
        var index = $scope.data.selectedArray.indexOf(item);
        if (index < 0) {
            $scope.data.selectedArray.push(item);
        } else {
            $scope.data.selectedArray.splice(index, 1);
        }
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
            data.serviceid = 'mlf_websiteoper';
            data.methodname = 'doShareYIQIANFA';
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
     * [sign description]多签
     * @return {[type]} [description] null
     */
    $scope.sign = function(item) {
        var selectedArray;
        if (!!item) {
            selectedArray = [item];
        } else {
            selectedArray = $scope.data.selectedArray;
        }
        batSign(selectedArray);
    };

    function examSelectedArray(name) {
        var flag = true;
        if ($scope.data.selectedArray.length > 1) {
            flag = false;
            trsconfirm.alertType(name + '失败', name + '操作只能选择单篇稿件', "error");
        }
        return flag;
    }
    /**
     * [stick description]置顶
     * @return {[type]} [description] null
     */
    $scope.stick = function() {
        if ($scope.data.getChannelDetail.HASCHILDREN === "1" && !$scope.status.params.IsCurrentChnl) {
            trsconfirm.alertType("请选择“只看当前栏目”", "", "warning", false);
            return;
        }
        if ($scope.data.selectedArray.length !== 1) {
            trsconfirm.alertType("请选择单篇稿件", "", "warning", false);
            return;
        }
        var topFlag = $scope.data.selectedArray[0].DOCORDERPRI === "0" ? 2 : 0;
        trsconfirm.confirmModel(topFlag === 2 ? "置顶？" : "取消置顶？", topFlag === 2 ? "确认要置顶该稿件？" : "确定要取消置顶该稿件？", function() {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "setTopDocument",
                ChannelId: parseInt($scope.data.selectedArray[0].CHNLID),
                DocumentId: $scope.data.selectedArray[0].METADATAID,
                TargetDocumentId: $scope.data.items[0].DOCORDERPRI === "0" ? "0" : $scope.data.items[0].METADATAID,
                TopFlag: topFlag,
                Position: 1,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function() {
                requestData();
            }, function() {
                requestData();
            });
        });
        /*var isSingleDraft = examSelectedArray('置顶');
        if (isSingleDraft === true) {
            websiteService.stick($scope.data.selectedArray, $stateParams.channelid, {
                serviceid: "mlf_websiteoper",
                methodname: "sortTopedMetaDatas",
                _serviceid: "mlf_websiteoper",
                _methodname: "querySetTopInfo",
                ChnlDocId: $scope.data.selectedArray[0].CHNLDOCID
            }, $scope.page.PAGESIZE, function() {
                trsconfirm.alertType("设置置顶成功", "", "success", false, function() {
                    requestData();
                });
            });
        }*/
    };
    /**
     * [rank description]排序
     * @return {[type]} [description] null
     */
    $scope.rank = function() {
        var isSingleDraft = examSelectedArray('排序');
        if (isSingleDraft === true) {
            var channelid = trsspliceString.spliceString($scope.data.selectedArray,
                'CHNLID', ',');
            editingCenterService.rank(channelid, $scope.data.selectedArray, {
                serviceid: "mlf_websiteoper",
                methodname: "sortSetUpMetaDatas"
            }, function() {
                trsconfirm.alertType("排序成功", "", "success", false, function() {
                    requestData();
                });

            });
        }
    };
    /**
     * [copyDraft description]复制
     * @return {[type]} [description] null
     */
    $scope.copyDraft = function(item) {
        var selectedArray;
        if (!!item) {
            selectedArray = [item];
        } else {
            selectedArray = $scope.data.selectedArray;
        }
        copyDraft(selectedArray);
    };
    /**
     * [moveDraft description]复制
     * @return {[type]} [description] null
     */
    $scope.moveDraft = function(item) {
        if (!!item) {
            moveDraft([item]);
        } else {
            moveDraft($scope.data.selectedArray);
        }
    };
    /**
     * [collect description]复制
     * @return {[type]} [description] null
     */
    $scope.collect = function(item) {
        trsconfirm.confirmModel("稿件收藏", "确认收藏稿件", function() {
            var chnlDocIds;
            if (!!item) {
                chnlDocIds = item.RECID;
            } else {
                chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray,
                    'RECID', ',');
            }
            collectDraft(chnlDocIds);
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

    function dropList() {
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
     * [requestData description]数据请求
     * @return {[type]} [description] null
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
     * [pushBar description]推首页
     * @return {[type]} [description] null
     */
    $scope.pushBar = function(item) {
        websiteService.pushBar(function(result) {
            var params = angular.copy(result);
            params.chnldocIds = trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, "RECID", ",");
            promptRequest(params, "推首页成功");
        });
    };
    /**
     * [promptRequest description]具体操作数据请求成功后刷新列表
     * @param  {[obj]} params [description]请求参数
     * @param  {[string]} info   [description]提示语
     * @return {[type]}        [description]
     */
    function promptRequest(params, info) {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType(info, "", "success", false, function() {
                requestData();
            });
        });
    }
    /**
     * [revoke description]撤稿
     * @return {[type]} [description] null
     */
    $scope.revoke = function(item) {
        trsconfirm.inputModel('是否确认取消签发', '取消签发原因(可选)', function(content) {
            var metaDataIds, chnlDocIds, objectIds;
            if (!!item) {
                metaDataIds = item.METADATAID;
                chnlDocIds = item.CHNLDOCID;
                objectIds = "";
            } else {
                metaDataIds = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
                chnlDocIds = trsspliceString.spliceString($scope.data.selectedArray, "CHNLDOCID", ",");
                objectIds = trsspliceString.spliceString($scope.data.selectedArray, "RECID", ",");
            }
            rejection(metaDataIds, chnlDocIds, objectIds, content);
        });
    };
    /**
     * [rejection description]撤稿
     * @return {[type]} [description] null
     */
    function rejection(arrayMetaDataIds, arrayChnlDocIds, arrayObjectIds, content) {
        var params = {
            serviceid: "mlf_websiteoper",
            methodname: "withdraw",
            WithDrawOpinion: content,
            MetaDataIds: arrayMetaDataIds,
            ChnlDocIds: arrayChnlDocIds,
            ObjectIds: arrayChnlDocIds
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
            .then(function(data) {
                trsconfirm.alertType("取消签发成功", "", "success", false, function() {
                    requestData();
                });
            });
    }
    /**
     * [collectDraft description]收藏
     * @return {[type]} [description] null
     */
    function collectDraft(array) {
        var temp = $filter('pick')($scope.data.selectedArray, $scope.filterChannelId);
        if (temp.length === $scope.data.selectedArray.length) {
            var params = {
                serviceid: "mlf_websiteoper",
                methodname: "collectionYIQIANFADocs",
                ChannelId: $scope.data.selectedArray[0].CHANNELID,
                ChnlDocIds: array
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function() {
                    trsconfirm.alertType("收藏成功", "", "success", false, function() {
                        requestData();
                    });
                }, function() {
                    $scope.data.selectedArray = [];
                });
        } else {
            trsconfirm.alertType('收藏失败', "所选稿件不属于同一栏目", "error", false);
            $scope.data.selectedArray = [];
        }
    }
    /**
     * [queryByDropdown description]根据稿件类型查询
     * @return {[type]} [description] null
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
        $scope.status.params.IsCurrentChnl = !$scope.status.params.IsCurrentChnl;
        requestData();
    };

    /**
     * [copyDraft description]复制稿件
     * @return {[type]} [description] null
     */
    function copyDraft(array) {
        websiteService.batChooseChnl("复制稿件", $stateParams.siteid, function(data) {
            var params = {
                "serviceid": "mlf_websiteoper",
                "methodname": "copyYIQIANFADoc",
                "ChannelId": $stateParams.channelid,
                "MetaDataIds": trsspliceString.spliceString(array, "METADATAID", ","),
                "ChannelIds": data.ChannelIds
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    trsconfirm.alertType("复制稿件成功", "", "success", false, function() {
                        $scope.data.selectedArray = [];
                        requestData();
                    });
                });
        });
    }
    /**
     * [batSign description]多签
     * @return {[type]} [description] null
     */
    function batSign(items) {
        var temp = $filter('pick')(items, $scope.filterChannelId);
        if (temp.length === items.length) {
            websiteService.batChooseChnl("多签", $stateParams.siteid, function(data) {
                var params = {
                    "serviceid": "mlf_websiteoper",
                    "methodname": "transmitDoc",
                    "ChnlDocIds": trsspliceString.spliceString(items, "CHNLDOCID", ","),
                    "ChannelIds": data.ChannelIds,
                    "CurrChnlId": $scope.data.selectedArray[0].CHANNELID,
                    "isLink": data.selectedRadio
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        trsconfirm.alertType("多签成功", "", "success", false, function() {
                            requestData();
                        });
                    }, function() { requestData(); });
            }, { enumValue: { "是": false, "否": true }, label: "是否镜像引用", defaultValue: "否" });
        } else {
            trsconfirm.alertType('多签失败', "所选稿件不属于同一栏目", "error", false);
            $scope.data.selectedArray = [];
        }
    }
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
     * [moveDraft description]移动
     * @return {[type]} [description] null
     */
    function moveDraft(items) {
        var temp = $filter('pick')(items, $scope.filterChannelId);
        if (temp.length === items.length) {
            websiteService.singleChooseChnl("移动稿件", $stateParams.siteid, $stateParams.channelid, function(data) {
                var params = {
                    "serviceid": "mlf_websiteoper",
                    "methodname": "moveYIQIANFADoc",
                    "SrcChannelId": items[0].CHANNELID,
                    "ChnlDocIds": trsspliceString.spliceString(items, "CHNLDOCID", ","),
                    "ToChannelId": data.channelid
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        trsconfirm.alertType("稿件移动成功", "", "success", false, function() {
                            requestData();
                        });
                    });
            });
        } else {
            trsconfirm.alertType("稿件移动失败", "所选稿件不属于同一栏目", "error", false);
            $scope.data.selectedArray = [];
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

    /**
     * [fullTextSearch description]全文检索
     * @return {[type]} [description] null
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
     * [getESSearchParams description]设置ES检索参数
     * @return {[json]} [description] 参数对象
     */
    function getESSearchParams() {
        var esParams = {
            serviceid: "mlf_essearch",
            methodname: "queryForWebSiteSignedDoc",
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
     * [dragoverCallback description]拖拽
     * @return {[type]} [description] null
     */
    $scope.dragoverCallback = function(event, index, external, type) {
        /*console.log(index);
        return index < 51;*/
        /*var flag;
        if (index === 0)
            return true;
        if ($scope.status.dragSelectedItem.DOCORDERPRI === "0") {
            flag = $scope.data.items[index - 1].DOCORDERPRI === "0";
        } else {
            flag = $scope.data.items[index - 1].DOCORDERPRI !== "0";
        }*/
        return true;
    };
    $scope.dragStart = function(event, item, index) {
        $scope.status.dragSelectedItem = item;
        $scope.status.dragSelectedItem.index = index;
    };
    /**
     * [dropCallback description]拖拽
     * @return {[type]} [description] null
     */
    $scope.dropCallback = function(event, index, item, external, type, allowedType) {
        if (item.DOCORDERPRI !== "0") {
            topDrag($scope.status.dragSelectedItem, index);
        } else {
            if (index !== $scope.data.items.length && $scope.data.items[index].DOCORDERPRI !== "0") {
                trsconfirm.alertType("普通稿件不能与置顶稿件混合排序", "", "info", false);
                requestData();
                return;
            }
            commonDrag($scope.status.dragSelectedItem, index);
        }
        return item;
    };
    //置顶拖拽排序
    function topDrag(item, index) {
        if ($scope.data.items[item.index > index ? index : (index - 1)].DOCORDERPRI === "0") {
            trsconfirm.alertType("置顶稿件不能与普通稿件混合排序", "", "info", false);
            requestData();
            return;
        }
        var params = {
            serviceid: "mlf_websiteoper",
            methodname: "setTopDocument",
            ChannelId: parseInt(item.CHANNELID),
            DocumentId: item.METADATAID,
            TargetDocumentId: item.index > index ? $scope.data.items[index].METADATAID : $scope.data.items[index - 1].METADATAID,
            TopFlag: 3,
            Position: item.index > index ? 1 : 0
        };
        trsconfirm.alertType("位置调整", "确定调整位置么？", "info", true, function() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                requestData();
            }, function(data) {

            });
        }, function() {
            requestData();
        });
    }
    //普通拖拽
    function commonDrag(item, trueIndex) {
        $scope.status.orderParams = {
            "serviceid": "mlf_websiteoper",
            "methodname": "sortPositionMetaDatas",
            "ChannelId": $stateParams.channelid,
            "FromChnlDocId": item.CHNLDOCID,
        };
        $scope.status.orderParams.Position = 1;
        if (angular.isDefined($scope.data.items[trueIndex])) {
            $scope.status.orderParams.ToChnlDocId = $scope.data.items[trueIndex].CHNLDOCID;
            trsconfirm.alertType("位置调整", "确定调整位置么？", "info", true, function() {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.orderParams, "post").then(function(data) {
                    requestData();
                }, function(data) {

                });
            }, function() {
                requestData();
            });
        } else {
            $scope.status.orderParams.ToChnlDocId = $scope.data.items[trueIndex - 1].CHNLDOCID;
            trsconfirm.alertType("位置调整", "确定调整位置么？", "info", true, function() {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.orderParams, "post").then(function(data) {
                    $scope.status.orderParams.Position = 0;
                    $scope.status.orderParams.FromChnlDocId = $scope.data.items[$scope.data.items.length - 1].CHNLDOCID;
                    $scope.status.orderParams.ToChnlDocId = $scope.data.items[$scope.data.items.length - 2].CHNLDOCID;
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.orderParams, "post").then(function(data) {
                        requestData();
                    });
                }, function(data) {

                });
            }, function() {
                requestData();
            });
        }
    }
    //h5拖拽结束
    /**
     * [outSending description]外发
     * @return {[type]} [description] null
     */
    $scope.outSending = function(item) {
        editingCenterService.outSending("", function(result) {
            outSendingDraft(result.selectItems, item);
        });
    };
    /**
     * [outSendingDraft description]外发
     * @return {[type]} [description] null
     */
    function outSendingDraft(items, item) {
        var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
        var draftids = trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, 'METADATAID', ",");
        var params = {
            serviceid: "mlf_mailoutgoingOper",
            methodname: "webYiQianFaSendEmail",
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
     * [view description]请求多签稿件
     * @item   [description]请求item参数
     */
    $scope.draftPublish = function(item) {
        editingCenterService.draftPublish(item.CHNLDOCID);
    };

    /**
     * [moreSign description]请求多签稿件
     * @item  {[obj]}  [description]请求item参数
     */
    $scope.moreSign = function(item) {
        signedService.indexSign(item, function() {});
    };
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
                status: 2
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
     * @return flag 若有该类型则返回true
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
     * [hideDraft description：隐藏]
     */
    $scope.hideDraft = function() {
        var params = {
            serviceid: "mlf_websiteoper",
            methodname: "hidden",
            ChnlDocIds: trsspliceString.spliceString($scope.data.selectedArray, "RECID", ","),
            ChannelId: $stateParams.channelid,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("稿件隐藏成功", "", "success", false, function() {
                $scope.data.selectedArray = [];
                requestData();
            });
        }, function() {
            $scope.data.selectedArray = [];
            requestData();
        });
    };
    /**
     * [cancelHideDraft description：取消隐藏]
     */
    $scope.cancelHideDraft = function() {
        var params = {
            serviceid: "mlf_websiteoper",
            methodname: "cancelHidden",
            ChnlDocIds: trsspliceString.spliceString($scope.data.selectedArray, "RECID", ","),
            ChannelId: $stateParams.channelid,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("稿件取消隐藏成功", "", "success", false, function() {
                $scope.data.selectedArray = [];
                requestData();
            });
        }, function() {
            $scope.data.selectedArray = [];
            requestData();
        });
    };
    /**
     * [subjectView description：关注操作弹窗]
     */
    $scope.follow = function() {
        if (!checkOneType($scope.status.draftType.subject)) {
            trsconfirm.alertType("只能关注专题稿", '', "error", false);
            return;
        }
        var params = {
            serviceid: "mlf_tag",
            methodname: "focusonSpecial",
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",")
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function() {
            trsconfirm.alertType("关注成功", "", "success", false, function() {
                requestData();
            });
        });
    };
    /**
     * [checkOneType description：所选稿件是否全为同一类型稿件]
     * @params typeId 稿件ID
     * @return flag 若有其他类型的稿件就返回false
     */
    function checkOneType(typeId) {
        var flag = true;
        for (var i = 0; i < $scope.data.selectedArray.length; i++) {
            if ($scope.data.selectedArray[i].DOCTYPEID != typeId) {
                flag = false;
                break;
            }
        }
        return flag;
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
     * [preview description]稿件预览
     * @return {[type]} [description]null
     */
    $scope.preview = function(item) {
        var params = {
            serviceid: "mlf_website",
            methodname: "getDocPubUrl",
            docid: item.CHNLDOCID,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
            $window.open(data.replace(/"/g, ""));
        });
    };

    // 川报修改(推数据)
    $scope.pushData = function() {
        var params = {
            serviceid: "mlf_websiteexchange",
            methodname: "pushDocs",
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ',')
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
            trsconfirm.alertType("推数据成功", '', "success", false);
            $scope.data.selectedArray = [];
            requestData();
        }, function(data) {
            $scope.data.selectedArray = [];
            requestData();
        });
    };
}
