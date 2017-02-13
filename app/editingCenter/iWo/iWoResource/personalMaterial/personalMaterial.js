/*create by ma.rongqin 2016.3.1*/
"use strict";
angular.module('editIWoPersonalMaterialModule', [])
    .controller('editIWoPersonalMaterialCtrl', ['$scope', 'trsHttpService', 'initVersionService', "trsconfirm", "trsspliceString", "alterModule", function($scope, trsHttpService, initVersionService, trsconfirm, trsspliceString, alterModule) {
        initStatus();
        initData();

        function initStatus() {
            $scope.data = {
                selectedArray: [],
                creationAxisItems: "",
                itemsLen: 0
            };
            $scope.status = {
                showDeleteId: "",
                noMoreMessage: "",
                batchOperateBtn: {
                    clickStatus: "",
                    hoverStatus: ""
                },
                support: {
                    content: "" //提交给辅助写作的纯文本
                },
                page: {
                    creationAxis: {
                        CURRPAGE: 1,
                        PAGESIZE: 10,
                    }
                },
                message: {
                    creationAxisHasNoMore: false,
                }
            };
        };

        function initData() {
            queryCreationAxis(false);
        };
        /**
         * [queryCreationAxis description:查询创作轴]
         * @param  {Boolean} isGetMore [description：判断是否加载跟多]
         */
        function queryCreationAxis(isGetMore) {
            var params = {
                serviceid: "mlf_releasesource",
                methodname: "queryCreations",
                pagesize: $scope.status.page.creationAxis.PAGESIZE,
                currpage: $scope.status.page.creationAxis.CURRPAGE,
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                if (!!isGetMore)
                    $scope.data.creationAxisItems = $scope.data.creationAxisItems.concat(initVersionService.getDayContent(data.DATA, true));
                else {
                    $scope.data.creationAxisItems = initVersionService.getDayContent(data.DATA, true);
                    $scope.status.page.creationAxis = data.PAGER;
                }
                initItemsLen();
            });
        }
        /**
         * [getMoreCreationAxis description：初始化条目个数]
         */
        function initItemsLen() {
            $scope.data.itemsLen = 0;
            angular.forEach($scope.data.creationAxisItems, function(value, key) {
                $scope.data.itemsLen += value.times.length;
            });
        }
        /**
         * [getMoreCreationAxis description：加载更多的创作轴]
         */
        $scope.getMoreCreationAxis = function() {
            if ($scope.status.page.creationAxis.CURRPAGE + 1 > $scope.status.page.creationAxis.PAGECOUNT) {
                $scope.status.message.creationAxisHasNoMore = true;
                return;
            }
            $scope.status.page.creationAxis.CURRPAGE += 1;
            queryCreationAxis(true);
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
        };
        /**
         * [selectAll description:全选]
         */
        $scope.selectAll = function() {
            if ($scope.data.selectedArray.length != $scope.data.itemsLen) {
                $scope.data.selectedArray = [];
                angular.forEach($scope.data.creationAxisItems, function(value, key) {
                    $scope.data.selectedArray = $scope.data.selectedArray.concat(value.times)
                });
            } else {
                $scope.data.selectedArray = [];
            }
        };
        /**
         * [selectAll description:删除操作]
         * @param  {[obj]} item [description]单条创作轴数据
         */
        $scope.creationOpen = function(ceratiid) {
            console.log(ceratiid);
            if (ceratiid.value.CREATIONTYPE == "1") {
                alterModule.creationDetail(ceratiid.value.CREATIONID);
            }
        };

        function includeTime(items, item) {
            for (var i = 0, length = items.length; i < length; i++) {
                var tmpItem = items[i];

                if (tmpItem.CREATIONID == item.CREATIONID) {
                    return true;
                }
            }
            return false;
        }

        function removeItems(selectedItems) {
            var items = $scope.data.creationAxisItems;

            for (var i = items.length - 1; i >= 0; i--) {
                var times = items[i].times;

                for (var j = times.length - 1; j >= 0; j--) {
                    var item = times[j];

                    if (includeTime(selectedItems, item.value)) {
                        times.splice(j, 1);
                    }
                }

                if (times.length == 0) {
                    items.splice(i, 1);
                }
            }
            initItemsLen();
        }

        $scope.deleteItems = function(item) {
                trsconfirm.confirmModel("删除创作轴", "确认删除所选的创作轴", function() {
                    var selectedItems;
                    if (!item) {
                        selectedItems = selectedValueArray();
                    } else {
                        selectedItems = [item.value];
                    }
                    var params = {
                        "serviceid": "mlf_releasesource",
                        "methodname": "deleteCreation",
                        "CreationIds": trsspliceString.spliceString(selectedItems, 'CREATIONID', ","),
                    }

                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        //queryCreationAxis(false);
                        //
                        removeItems(selectedItems);
                        $scope.data.selectedArray = [];
                    })
                })
            }
            /**
             * [promptRequest description]具体操作数据请求成功后刷新列表
             * @param  {[obj]} params [description]请求参数
             * @param  {[string]} info   [description]提示语
             * @return {[type]}        [description]
             */
        function promptRequest(params, info) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType(info, "", "success", false, function() {
                    queryCreationAxis(false);
                });
            });
        }
        /**
         * [selectAll description:把所选条目的value拼成一个数组]
         */
        function selectedValueArray() {
            var arr = []
            angular.forEach($scope.data.selectedArray, function(data, key) {
                arr.push(angular.copy(data.value))
            });
            return arr;
        }
        /**
         * [clearDeleteBtn description:鼠标移出之后清除删除按钮]
         */
        $scope.clearDeleteBtn = function() {
            $scope.status.showDeleteId = '';
        }
    }]);
