/*
    Create by CC 2016-1-25
*/
'use strict';
angular.module("manageConfigSingleChooseChnlModule", [])
    .controller("manageConfigsingleChooseChnlCtrl", ["$scope", "$modalInstance", "trsHttpService", "draftParams", "trsspliceString", "trsconfirm", function($scope, $modalInstance, trsHttpService, draftParams, trsspliceString, trsconfirm) {
        init();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
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
        $scope.getSuggestionsSc = function(viewValue) {
            var searchParams = {
                "serviceid": "mlf_mediasite",
                "methodname": "queryClassifyByName",
                "ChannelName": viewValue,
                "SiteId": draftParams.siteid
            };
            return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), searchParams, "post")
                .then(function(data) {
                    return data;
                });
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
        $scope.cancelChannel = function(channel) {
            cannelChannel(channel);
        };
        $scope.confirm = function() {
            if (angular.isDefined($scope.selectedNode) && $scope.selectedNode !== null) {
                $modalInstance.close($scope.selectedNode);
            } else {
                trsconfirm.alertType("请选择栏目或者站点", "请选择栏目或站点", "warning", false);
            }
        };

        function init() {
            //弹窗标题
            $scope.modalTitle = draftParams.modalTitle;
            $scope.channelid = draftParams.channelid;
            //树配置开始
            $scope.treeOptions = {
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
                }
            };
            //树配置结束
            var params = {
                "serviceid": "mlf_mediasite",
                "methodname": "queryClassifyBySiteoutRight",
                "SiteId": draftParams.siteid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.dataForTheTree = [data];
                $scope.selectedNode = $scope.dataForTheTree[0];
            });
        }
        $scope.isChecked = function(node) {
            if (angular.isDefined($scope.selectedChannel)) {
                var flag = false;
                if ($scope.selectedChannel.CHANNELID === node.CHANNELID) {
                    flag = true;
                }
                return flag;
            }
        };

        function cannelChannel() {
            $scope.selectedChannel = null;
        }
    }]);
