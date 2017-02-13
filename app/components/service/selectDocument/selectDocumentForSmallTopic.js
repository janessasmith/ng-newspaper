/*
    Create by BaiZhiming 2016-04-12
    小专题专用文档选择器
*/
'use strict';
angular.module("trsSelectDocumentForSTModule", []).controller("trsSelectDocumentForSTCtrl", ["$scope", "$q", "$modalInstance", "params", "trsHttpService", "initSingleSelecet", "trsspliceString", "trsSelectDocumentService", function($scope, $q, $modalInstance, params, trsHttpService, initSingleSelecet, trsspliceString, trsSelectDocumentService) {
    initStatus();
    initData();
    $scope.showSelected = function(node) {
        $scope.status.isChooseSite = false;
        $scope.params.SearchDocId = "";
        $scope.params.SearchTitle = "";
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": 10
        };
        $scope.params.PageSize = $scope.page.PAGESIZE;
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.params.ChannelId = node.CHANNELID; //重置分页
        siteOrChannel();
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get")
            .then(function(data) {
                $scope.items = data.DATA;
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
            });
    };
    $scope.showToggle = function(node) {
        if (angular.isDefined(node.CHILDREN) && node.CHILDREN.length === 0 && node.HASCHILDREN === "true") {
            var childrenTreeParam = {
                serviceid: "mlf_mediasite",
                methodname: "queryClassifyByChnl",
                ChannelId: node.CHANNELID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), childrenTreeParam, "get")
                .then(function(data) {
                    node.CHILDREN = data.CHILDREN;
                });
        }
    };
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        requestDataPromise(true);
    };
    //全选
    $scope.selectAll = function() {
        if (checkSelectedAll()) {
            $scope.selectedArray = [];
        } else {
            $scope.selectedArray = $scope.items.concat($scope.selectedArray);
        }
        if ($scope.selectedArray.length > 10) $scope.selectedArray.length = 10;
        // if (duplChecking($scope.items, $scope.selectedArray)) {
        //     deleteElement($scope.items, $scope.selectedArray);
        // } else {
        //     $scope.selectedArray = $scope.items.concat($scope.selectedArray);
        // }

        // $scope.selectedArray = unique($scope.items, $scope.selectedArray);
        // $scope.selectedArray = $scope.items.concat($scope.selectedArray);
        // if ($scope.selectedArray.length > 10) $scope.selectedArray.length = 10;
    };
    //单选
    $scope.selectDoc = function(item) {
        if (!duplChecking([item], $scope.selectedArray)) {
            $scope.selectedArray.splice(0, 0, angular.copy(item));
        } else {
            deleteElement([item], $scope.selectedArray);
        }
        if ($scope.selectedArray.length > 10) {
            $scope.selectedArray.length = 10;
        }
    };
    //检测选中情况
    $scope.checkChecked = function(item) {
        var flag = false;
        angular.forEach($scope.selectedArray, function(data, index, array) {
            if (item.METADATAID === data.METADATAID || item.RECID === data.RECID) {
                flag = true;
            }
        });
        return flag;
    };
    //检测是否全选
    // $scope.checkSelectedAll = function() {
    //     var i = 0;
    //     var flag = false;
    //     if (angular.isDefined($scope.items) && $scope.items.length !== 0) {
    //         angular.forEach($scope.items, function(data, index, array) {
    //             angular.forEach($scope.selectedArray, function(data_, index_, array_) {
    //                 if (data.RECID === data_.RECID) {
    //                     i++;
    //                 }
    //             });
    //         });
    //         if (i === $scope.items.length) {
    //             flag = true;
    //         }
    //     }
    //     return flag;
    // };
    $scope.checkSelectedAll = function() {
        return checkSelectedAll();
    }

    function checkSelectedAll() {
        var flag = true;
        if ($scope.selectedArray.length == 0 || !angular.isDefined($scope.items)) return false;
        var itemMetadaids = trsspliceString.spliceString($scope.items, "METADATAID", ",").split(",");
        var selectedMetadaids = trsspliceString.spliceString($scope.selectedArray, "METADATAID", ",").split(",");
        for (var i = 0; i < itemMetadaids.length; i++) {
            if (selectedMetadaids.indexOf(itemMetadaids[i]) < 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
    $scope.delSelected = function(item) {
        deleteElement([item], $scope.selectedArray);
    };

    $scope.sureChked = function() {
        var itemMetadaids = trsspliceString.spliceString($scope.selectedArray, "METADATAID", ",");
        trsSelectDocumentService.copyIds(itemMetadaids, function() {
            $modalInstance.close();
        });
        /*var docData = [];
        angular.forEach($scope.selectedArray, function(data, index, array) {
            docData.push({
                title: data.TITLE,
                subtitle: data.HOMETITLE,
                url: data.DOCPUBURL,
                titlecolor: data.TITLECOLOR,
                abstract: data.ABSTRACT,
                isRelNews: true,
                recid: data.RECID,
                reltime: data.RELTIME,
                metadataId: data.METADATAID,
                source: data.source,
                author: data.author
            });
            if (angular.isDefined(params.IsPicDoc)) {
                if (angular.isDefined(data.OUTLINEPICS) && data.OUTLINEPICS !== "") {
                    docData[index].imgsrc = data.OUTLINEPICS.PICSLOGO.split(",")[data.OUTLINEPICS.PICSLOGO.split(",").length - 1];
                    docData[index].imgName = docData[index].imgsrc.split("=")[docData[index].imgsrc.split("=").length - 1];
                } else if (angular.isDefined(data.METALOGOURL) && data.METALOGOURL !== "") {
                    docData[index].imgsrc = data.METALOGOURL.PICSLOGO.split(",")[data.METALOGOURL.PICSLOGO.split(",").length - 1];
                    docData[index].imgName = docData[index].imgsrc.split("=")[docData[index].imgsrc.split("=").length - 1];
                } else {
                    docData[index].imgsrc = "";
                    docData[index].imgName = "";
                }
            }
        });
        $modalInstance.close(docData)
        ;*/
    };
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };

    function initData() {
        $scope.items = [];
        $scope.treeOptions = {
            nodeChildren: "CHILDREN",
            dirSelectable: true,
            allowDeselect: false,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: ""
            },
            isLeaf: function(node) {
                return node.HASCHILDREN === "false";
            }
        };
        var treeParam = {
            serviceid: "mlf_mediasite",
            methodname: "queryClassifyBySite",
            SiteId: params.siteid
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), treeParam, "get")
            .then(function(data) {
                $scope.siteDesc = data.SITEDESC;
                $scope.treeData = data.CHILDREN;
                $scope.selectedNode = $scope.treeData[0];
                $scope.params.ChannelId = $scope.treeData[0].CHANNELID;
                requestDataPromise(true);
            });
        /*
          判断使用metaDataId还是recId  
         */
        if (params.relNewsData.length !== 0) {
            $scope.hasMeta = angular.isDefined(params.relNewsData[0].METADATAID) ? true : false;
        }
        //初始化下拉框
        initDropList();
        $scope.hasMeta = true;
    }

    function initStatus() {
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": 10
        };
        $scope.params = {
            "serviceid": "mlf_metadata",
            "methodname": "queryMetaByChannel",
            "IsPicDoc": angular.isDefined(params.IsPicDoc) ? true : false,
            "PageSize": $scope.page.PAGESIZE,
            "CurrPage": $scope.page.CURRPAGE,
            "IsCurrentChnl": false,
            "ChannelId": "",
            "SearchDocId": "",
            "SearchTitle": ""
        };
        $scope.status = {
            fromFragment: params.position ? false : true,
            isChooseSite: false,
            searchAll: [{
                name: "标题",
                value: "0",
                placeholder: "请输入标题"
            }, {
                name: "ID",
                value: "1",
                placeholder: "请输入稿件ID"
            }],
            searchPosition: {
                0: "SiteId",
                1: "ChannelId"
            },
            SearchValue: ""
        };
        $scope.data = {
            dropDown: {
                'searchAllType': $scope.status.searchAll,
                'searchAllSelected': $scope.status.searchAll[0]
            }
        }
        $scope.selectedArray = params.relNewsData;
        $scope.hasMeta = false;
    }

    function requestDataPromise(callback) {
        var deferred = $q.defer();
        siteOrChannel();
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'get').then(function(data) {
            if (angular.isDefined(callback)) {
                $scope.items = data.DATA;
                $scope.page = data.PAGER;
                angular.isDefined($scope.page) ? "" : $scope.page = {
                    "PAGESIZE": 0,
                    "ITEMCOUNT": 0,
                    "PAGECOUNT": 0
                };
            }
            deferred.resolve();
        });
        return deferred.promise;
    }
    /**
     * [initDropList description] 初始化下拉框
     */
    function initDropList() {
        //ES条件
        $scope.data.dropDown.esAll = initSingleSelecet.iWoEntire();
        $scope.data.dropDown.esSelected = angular.copy($scope.data.dropDown.esAll[0]);
    }
    //查重复
    function duplChecking(items, array) {
        var flag = false;
        angular.forEach(array, function(data, index, array) {
            var attribute = angular.isDefined(data.RECID) ? 'RECID' : 'METADATAID';
            angular.forEach(items, function(_data, _index, _array) {
                if (_data[attribute] === data[attribute]) {
                    flag = true;
                }
            });
        });
        return flag;
    }
    //去重复
    function unique(arr1, arr2) {
        var allArr = arr1.concat(arr2),
            result = [],
            flag = {};
        angular.forEach(allArr, function(data, key) {
            var id = angular.isDefined(data.METADATAID) ? data.METADATAID : data.RECID;
            if (!flag[id]) {
                result.push(data);
                flag[id] = true;
            }
        });
        return result;
    }

    function deleteElement(items, array) {
        angular.forEach(items, function(_data, _index, _array) {
            var attribute = angular.isDefined(_data.METADATAID) ? 'METADATAID' : 'RECID';
            var j = 0;
            while (j < array.length) {
                if (array[j][attribute] === _data[attribute]) {
                    array.splice(j, 1);
                } else {
                    j++;
                }
            }
        });
    }
    /**
     * [chooseSite description;选择整个站点（仅用于检索）]
     */
    $scope.chooseSite = function() {
        $scope.status.isChooseSite = true;
        $scope.params.SearchDocId = "";
        $scope.params.SearchTitle = "";
        requestDataPromise(true);
    };
    /**
     * [fullTextSearch description;全文检索]
     * @param  {[type]} ev [description:按下空格也能提交]
     */
    $scope.fullTextSearch = function(ev) {
        if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
            checkSearchValue();
            $scope.page.CURRPAGE = 1;
            requestDataPromise(true);
        }
    };
    // $scope.status.isChooseSite ? params.siteid : $scope.params.channelId
    // 区分是站点还是栏目的搜索
    function siteOrChannel() {
        if (!$scope.status.isChooseSite) {
            // $scope.params.ChannelId = node.CHANNELID;
            if (angular.isDefined($scope.params.SiteId)) delete $scope.params.SiteId;
        } else {
            $scope.params.SiteId = params.siteid;
            if (angular.isDefined($scope.params.ChannelId)) delete $scope.params.ChannelId;
        };
    };
    //检查输入的关键字是否正确
    function checkSearchValue() {
        if ($scope.data.dropDown.searchAllSelected.value == 1) {
            $scope.params.SearchDocId = angular.copy($scope.status.SearchValue);
            if (angular.isDefined($scope.params.SearchTitle)) delete $scope.params.SearchTitle;
        } else {
            $scope.params.SearchTitle = angular.copy($scope.status.SearchValue);
            if (angular.isDefined($scope.params.SearchDocId)) delete $scope.params.SearchDocId;
        }
    }
}]);
