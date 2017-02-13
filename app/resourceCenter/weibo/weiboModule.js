angular.module('resCenWeiboModule', ['resCtrModalModule'])
    .controller('resCenWeiboMainCtrl', ['$scope', '$q', '$state', '$location', '$modal', 'trsHttpService', 'resCtrModalService', 'initComDataService', 'resourceCenterService', 'trsspliceString', 'trsconfirm', 'leftService', '$interval', 'fgDelegate', 'dateFilter',

        function($scope, $q, $state, $location, $modal, trsHttpService, resCtrModalService, initComDataService, resourceCenterService, trsspliceString, trsconfirm, leftService, $interval, fgDelegate, dateFilter) {
            var listparams = {};
            var typeName = leftService.getParamValue('typename');
            var nodeId = leftService.getParamValue('nodeid');
            var nodename = leftService.getParamValue('nodename');
            var channel = leftService.getCurChannel();
            var channelName = leftService.resNavValue[channel];
            var vm = $scope.vm = {};
            vm.loadingBusy = false;
            vm.channelName = channelName;
            vm.typeName = typeName;
            vm.contents = [];
            vm.isAllchecked = false;
            vm.numberOfNewDocs = 0;
            vm.page = {
                totalNum: 0,
                pagenumber: 1,
                pagesize: 10
            };
            $scope.opDisabled = true;

            listparams = {
                "serviceid": channelName,
                "channelName": channelName,
                "typeName": typeName,
                "nodeId": nodeId,
            };

            function initStatus() {
                $scope.status = {
                    position: {
                        iwo: '0',
                        newspaper: '1',
                        website: '2'
                    }
                };
                var timer = $interval(function() {
                    if (!vm.page.maxId) return;
                    var params = {
                        "serviceid": channelName,
                        channelName: channelName,
                        typeName: typeName,
                        nodeId: nodeId,
                        maxId: vm.maxId
                    };
                    resourceCenterService.getPageInfobyItem(params).then(function(data) {
                        vm.numberOfNewDocs = data.number;
                    }, function() {
                        console.log("Get UnreadNumber Failed");
                    });
                }, 1000 * 60);

                $scope.$on("$destroy", function() {
                    $interval.cancel(timer);
                });

                resourceCenterService.getListDownData(angular.copy(listparams), "time", function(data) {
                    vm.time = {
                        data: data,
                        curValue: data[0]
                    }
                });
                resourceCenterService.getListDownData(angular.copy(listparams), "sourcelevel", function(data) {
                    vm.sourcelevel = {
                        data: data,
                        curValue: data[0]
                    };
                });

                resourceCenterService.getListDownData(angular.copy(listparams), "menuscriptType", function(data) {
                    $scope.docTypes = data;
                    vm.docType = $scope.docTypes[0];
                })

            }

            var getListbyItem = function(params, pageNum, pageSize) {
                vm.loadingBusy = true;
                var params = angular.copy(preparams);
                vm.jumpToPageNum = params.pageNum = vm.page.pagenumber = pageNum ? pageNum : vm.page.pagenumber;
                params.pageSize = vm.page.pagesize = pageSize ? pageSize : vm.page.pagesize;
                var keyword = {};
                keyword.keywords = vm.filterKeyWord ? vm.filterKeyWord : "";
                keyword.sourcelevel = vm.sourcelevel && vm.sourcelevel.curValue.value;
                keyword.time = vm.time ? vm.time.curValue.value == "custom" ? [dateFilter(vm.time.curValue.startdate, 'yyyy-MM-dd'), dateFilter(vm.time.curValue.enddate, 'yyyy-MM-dd')].join(',') : vm.time.curValue.value : "";
                params.keyword = JSON.stringify(keyword);
                $scope.loadingPromise = resourceCenterService.getListbyItem(params).then(function(data) {
                    if (data.content) {
                        vm.contents = vm.contents.concat(data.content);
                        vm.page = angular.extend(vm.page, data.summary_info);
                        vm.tableheaders = vm.page.hybaseField;
                        vm.loadingBusy = false;
                        if (vm.contents.length > 0) {
                            getTags(vm.contents);
                        }
                    }
                    $scope.$watch('$last', function() {
                        fgDelegate.getFlow('weiboGird').itemsChanged();
                    });
                }, function() {
                    console.log("Get Navigation Failed");
                });
            }

            var getTags = function(contents) {
                    var docIds = trsspliceString.getArrayString(contents, 'ZB_GUID', ',');
                    var params = {
                        channelName: channelName,
                        typeName: typeName,
                        nodeId: nodeId,
                        guids: docIds
                    };
                    resourceCenterService.getTags(params).then(function(data) {
                        angular.forEach(contents, function(content) {
                            var id = content.ZB_GUID;
                            angular.forEach(data, function(item) {
                                if (item.GUID == id) {
                                    content.QU = item.OPERFLAG.substr(0, 1) == 1 ? true : false;
                                    content.QIAN = item.OPERFLAG.substr(1, 1) == 1 ? true : false;
                                    content.JIAN = item.OPERFLAG.substr(2, 1) == 1 ? true : false;
                                    content.CHE = item.OPERFLAG.substr(3, 1) == 1 ? true : false;
                                    content.CHONG = item.OPERFLAG.substr(4, 1) == 1 ? true : false;
                                }
                            });
                        });
                    });
                }
                // 下拉
            $scope.selectPageNum = function() {
                vm.page.pagesize = vm.pagesize;
                $scope.pageChanged();
            }

            $scope.pageChanged = function() {
                getListbyItem(listparams, vm.page.pagenumber, vm.page.pagesize);
            }

            $scope.jumpToPage = function() {
                vm.jumpToPageNum = parseInt(vm.jumpToPageNum);
                if (vm.jumpToPageNum > parseInt(vm.page.totalPage)) {
                    vm.jumpToPageNum = vm.page.totalPage;
                }
                getListbyItem(listparams, vm.jumpToPageNum, vm.page.pagesize);
            }


            $scope.toggleSelectAll = function(isAllchecked) {
                vm.isAllchecked = !isAllchecked;
                angular.forEach(vm.contents, function(item) {
                    item.ischecked = vm.isAllchecked;
                });

                setOpDisabled();
            }

            $scope.toggleContent = function(content) {
                var ischecked = content.ischecked = !content.ischecked;
                if (ischecked) {
                    var lengthOfchecked = trsspliceString.filter(vm.contents, 'ZB_GUID', 'ischecked', true).length;
                    if (lengthOfchecked === vm.contents.length) {
                        vm.isAllchecked = true;
                    }
                } else {
                    vm.isAllchecked = false;
                };

                setOpDisabled();
            }




            // 取稿
            $scope.openTakeDraftModal = function() {
                var selectItems = trsspliceString.filterArr(angular.copy(vm.contents), 'ZB_GUID', 'ischecked', true);
                if (!selectItems.length) {
                    trsconfirm.alertType("", "请选择稿件！", "error", false);
                    return false;
                }

                addItemsToDraft(selectItems);
            };
            $scope.openItemTakeDraftModal = function(item) {
                var items = [item];
                addItemsToDraft(items);
            };

            var addItemsToDraft = function(items) {

                var takeDraftModal = resCtrModalService.takeDraft(items);
                takeDraftModal.result.then(function(result) {

                    var MetaDataIds = "",
                        op = result.btnOp,
                        doctype = "",
                        position = "",
                        siteid = result.siteid;
                    doctype = getDirectEditRouter(result).doctype;
                    position = getDirectEditRouter(result).position;
                    var metadataids = trsspliceString.spliceString(result.items, 'ZB_GUID', ',');
                    var params = {
                        "channelName": channelName,
                        "typeName": typeName,
                        "nodeId": nodeId,
                        "guid": metadataids,
                        "indexName": vm.page.indexName,
                        "ToMy": result.ToMy,
                        "App": result.App,
                        "Web": result.Web,
                        "Paper": result.Paper,
                        "PaperPubDate": result.PaperPubDate,
                        "SourceName": "资源中心-微博-" + nodename
                    };
                    resourceCenterService.getBigDataFetch(params).then(function(data) {

                        if (op == 1) {
                            var chnldocid = data.REPORTS[0].CHNLDOCID,
                                metadataid = data.REPORTS[0].METADATAID;
                            getDirectEditParams(position, chnldocid, metadataid, siteid, result).then(function(params) {
                                var url = $state.href(doctype, params);
                                window.open(url, '_blank');
                            });
                        } else {
                            trsconfirm.alertType("", "取稿成功!", "success", false);
                        }
                    });
                });
            };
            //获取取稿时直接编辑的路由
            function getDirectEditRouter(result) {
                if (Boolean(result.ToMy)) {
                    return {
                        position: $scope.status.position.iwo,
                        doctype: result.items[0].DOCTYPEID == 2 ? "iwoatlas" : "iwonews"
                    }
                } else if (Boolean(result.Paper)) {
                    return {
                        position: $scope.status.position.newspaper,
                        doctype: result.items[0].DOCTYPEID == 2 ? "newspaperpic" : "newspapertext"
                    }
                } else if (Boolean(result.Web)) {
                    return {
                        position: $scope.status.position.website,
                        doctype: result.items[0].DOCTYPEID == 2 ? "websiteatlas" : "websitenews"
                    }
                }
            }
            //获取取稿时直接编辑传的参数
            function getDirectEditParams(position, chnldocid, metadataid, siteid, result) {
                var deferred = $q.defer();
                var paperParams = {
                    serviceid: "mlf_paperset",
                    methodname: "findPaperById",
                    SiteId: siteid || 115
                }
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), paperParams, 'post').then(function(data) {
                    switch (position) {
                        case $scope.status.position.iwo:
                            deferred.resolve({
                                chnldocid: chnldocid,
                                status: 0,
                                metadataid: metadataid
                            });
                            break;
                        case $scope.status.position.newspaper:
                            deferred.resolve({
                                metadata: metadataid,
                                paperid: siteid,
                                newspapertype: data.ISDUOJISHEN == '0' ? 2 : 1
                            });
                            break;
                        case $scope.status.position.website:
                            deferred.resolve({
                                chnldocid: chnldocid,
                                channelid: result.Web,
                                status: 0,
                                metadataid: metadataid,
                                siteid: siteid
                            });
                            break;
                    }
                });
                return deferred.promise;
            }
            //创作轴
            $scope.CreationAxis = function() {
                var docIds = trsspliceString.spliceString(vm.contents, 'ZB_GUID', ',', 'ischecked', true);
                if (!docIds.length) {
                    trsconfirm.alertType("", "请选择稿件！", "error", false);
                    return false;
                }

                addcontentToCreationAxis(docIds);
            };
            $scope.addweiboToCreationAxis = function(id) {
                addcontentToCreationAxis(id);
            }

            var addcontentToCreationAxis = function(id) {
                var param = {
                    channelName: channelName,
                    typeName: typeName,
                    nodeId: nodeId,
                    "indexName": vm.page.indexName,
                    guid: id
                }
                resourceCenterService.setBigDataCreation(param).then(function(data) {
                    trsconfirm.alertType("", "该稿件已成功加入创作轴!", "success", false);
                }, function(msg) {
                    trsconfirm.alertType("", "加入创作轴失败!", "error", false);
                })
            }

            // 收藏
            $scope.collect = function() {
                var docIds = trsspliceString.spliceString(vm.contents, 'ZB_GUID', ',', 'ischecked', true);
                if (!docIds.length) {
                    trsconfirm.alertType("", "请选择稿件！", "error", false);
                    return false;
                }
                var params = {
                    channelName: channelName,
                    typeName: typeName,
                    nodeId: nodeId,
                    "indexName": vm.page.indexName,
                    guid: docIds
                };
                resourceCenterService.collectBigDataDocs(params).then(function(data) {
                    trsconfirm.alertType("", "稿件已成功收藏!", "success", false);
                }, function() {
                    trsconfirm.alertType("", "稿件收藏失败!", "error", false);
                });
            };
            /** 导出 */
            $scope.export = function() {
                var ids = trsspliceString.spliceString(vm.contents, 'ZB_GUID', ',', 'ischecked', true);
                if (!ids.length) {
                    trsconfirm.alertType("", "请选择稿件！", "error", false);
                    return false;
                }
                resourceCenterService.exportBigDataDraft(ids, channelName, vm.page.indexName)
            };
            // 预留
            $scope.openReserveDraftModal = function() {
                var selectItems = trsspliceString.filterArr(angular.copy(vm.contents), 'ZB_GUID', 'ischecked', true);
                if (!selectItems.length) {
                    trsconfirm.alertType("", "请选择稿件！", "error", false);
                    return false;
                }
                var resCtrModalServiceModal = resCtrModalService.reserveDraft(selectItems);

                resCtrModalServiceModal.result.then(function(result) {
                    var metadataids = trsspliceString.spliceString(result.items, 'ZB_GUID', ',');
                    var params = {
                        channelName: channelName,
                        typeName: typeName,
                        nodeId: nodeId,
                        guid: metadataids,
                        "indexName": vm.page.indexName,
                        ToMy: result.ToMy,
                        Delay: result.Delay,
                        "SourceName": "资源中心-微博-" + nodename
                    };
                    resourceCenterService.delayBigDataFetch(params).then(function(data) {
                        trsconfirm.alertType("", "预留成功!", "success", false);
                    }, function(err) {
                        trsconfirm.alertType("", "预留失败!", "error", false);
                    });

                });
            }
            $scope.viewBigDataInfo = function(ChnlDocId, showRepeat) { 
                var infoModal = resCtrModalService.bigDataInfoModal(ChnlDocId, showRepeat);
            };

            $scope.searchWithKeyword = function() {
                getListbyItem(listparams, vm.jumpToPageNum, vm.page.pagesize);
            }

            $scope.refreshList = function() {
                vm.numberOfNewDocs = 0;
                vm.contents = [];
                getListbyItem(listparams, 1, vm.page.pagesize);
            };

            $scope.checkfieldname = function(fieldname) {
                return fieldname != 'DOCTITLE' && fieldname != 'doctype' && fieldname != 'IR_ABSTRACT';
            };

            $scope.setColumns = function() {
                var saveIds = [],
                    deleteIds = [];
                angular.forEach(vm.fields, function(n, i) {
                    if (n.isSelect == 1 && n.isChecked == false) {
                        deleteIds.push(n.id);
                    }
                    if (n.isSelect == 0 && n.isChecked == true) {
                        saveIds.push(n.id);
                    }
                });
                // 提交设置字段
                resourceCenterService.operationSummarys({
                    "saveIds": saveIds.join(","),
                    "deleteIds": deleteIds.join(","),
                    "tableEnName": vm.page.indexName
                }).then(function(data) {
                    if (data.result == "success") {
                        getListbyItem(listparams);
                    }
                });
            };
            $scope.loadMore = function() {
                getListbyItem(listparams, ++vm.page.pagenumber, vm.page.pagesize);
            };
            function setOpDisabled() {
                var docIds = trsspliceString.spliceString(vm.contents, 'ZB_GUID', ',', 'ischecked', true);
                $scope.opDisabled = docIds.length ? false : true;
            };

            if (nodeId) {
                initStatus();
                $scope.pageChanged();
            }
        }
    ]);
