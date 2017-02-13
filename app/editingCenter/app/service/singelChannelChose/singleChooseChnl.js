/*
    Create by CC 2016-07-16
*/
'use strict';
angular.module("appSingleChooseChnlModule", [])
    .controller("appSingleChooseChnlCtrl", ["$scope", "$timeout", "$modalInstance", "trsHttpService", "draftParams", "trsspliceString", "trsconfirm", "editingCenterAppService", function($scope, $timeout, $modalInstance, trsHttpService, draftParams, trsspliceString, trsconfirm, editingCenterAppService) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化状态
         * @return {[type]} [description]
         */
        function initStatus() {
            $scope.status = {
                treeOptions: {
                    nodeChildren: "CHILDREN",
                    dirSelectable: true,
                    allowDeselect: false,
                    injectClasses: {
                        ul: "moveDraftTree-ul",
                        li: "moveDraftTree-li",
                        liSelected: "a7",
                        iExpanded: "a3",
                        iCollapsed: "a4",
                        iLeaf: "a5",
                        label: "moveDraftTree-label",
                        labelSelected: "rolegrouplabselected"
                    },
                    isLeaf: function(node) {
                        return node.HASCHILDREN === "false";
                    },
                },
                ifExpand: true
            };
            $scope.data = {
                modalTitle: draftParams.modalTitle,
                channelid: draftParams.channelid,
            };
        }
        /**
         * [initData description]初始化数据
         * @return {[type]} [description]
         */
        function initData() {
            var params = {
                "serviceid": "mlf_mediasite",
                "methodname": "queryClassifyBySite",
                "SiteId": draftParams.siteid,
                "platform": draftParams.platform,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.SITEDESC = data.SITEDESC;
                $scope.dataForTheTree = data.CHILDREN;
            });
        }
        var promise;
        $scope.getSuggestionsSc = function(viewValue) {
            if (promise) {
                $timeout.cancel(promise);
                promise = null;
            }
            promise = $timeout(function() {
                var searchParams = {
                    "serviceid": "mlf_mediasite",
                    "methodname": "queryRightClassifyByName",
                    "ChannelName": viewValue,
                    "SiteId": draftParams.siteid
                };
                return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), searchParams, "post")
                    .then(function(data) {
                        return data;
                    });
            }, 100);
            return promise;
        };
        //监控SUGGESTION
        $scope.$watch("searchChannel", function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
                $scope.selectedChannel = newValue;
                $scope.searchChannel = "";
            }
        });
        $scope.chooseChannel = function(node) {
            if (angular.isDefined($scope.selectedChannel) && $scope.selectedChannel != null) {
                if ($scope.selectedChannel.CHANNELID === node.CHANNELID) {
                    $scope.selectedChannel = null;
                } else {
                    $scope.selectedChannel = node;
                }
            } else {
                $scope.selectedChannel = node;
            }
        };
        /**
         * [cancelChannel description]取消选择
         * @return {[type]} [description]
         */
        $scope.cancelChannel = function() {
            $scope.selectedChannel = null;
        };
        $scope.confirm = function() {
            if (angular.isDefined($scope.selectedChannel) && $scope.selectedChannel !== null) {
                $modalInstance.close({
                    channelid: $scope.selectedChannel.CHANNELID
                });
            } else {
                trsconfirm.alertType("请选择栏目", "请选择栏目", "warning", false);
            }
        };
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        /**
         * [showToggle description]展开树请求节点
         * @param  {[obj]} node [description]
         * @return {[type]}      [description]
         */
        $scope.showToggle = function(node) {
            if (node.HASCHILDREN === "true" && node.CHILDREN.length === 0) {
                var params = {
                    "serviceid": "mlf_mediasite",
                    "methodname": "queryClassifyByChnl",
                    "ChannelId": node.CHANNELID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                    node.CHILDREN = data.CHILDREN;
                });
            }
        };
    }]);
