/*
    Create by BaiZhiming 2015-12-16
*/
'use strict';
angular.module("singleChooseChnlModule", [])
    .controller("singleChooseChnlCtrl", ["$scope", "$timeout", "$modalInstance", "trsHttpService", "draftParams", "trsspliceString", "trsconfirm", function($scope, $timeout, $modalInstance, trsHttpService, draftParams, trsspliceString, trsconfirm) {
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
            if (node.CHANNELID == $scope.channelid) {
                return;
            }
            if (angular.isDefined($scope.selectedChannel) && $scope.selectedChannel != null) {
                if ($scope.selectedChannel.CHANNELID === node.CHANNELID) {
                    $scope.selectedChannel = null;
                } else {
                    $scope.selectedChannel = node;
                }
            } else {
                $scope.selectedChannel = node;
            }
            /*node.isSelected = node.isSelected === true ? false : true;
            console.log(node.isSelected);
            if (node.isSelected) {
                $scope.selectedChannel = node;
            } else {
                $scope.selectedChannel = null;
            }*/
            /*if (event.target.checked) {
                $scope.selectedChannel = node;
            }*/
        };
        $scope.cancelChannel = function(channel) {
            cannelChannel(channel);
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
                "methodname": "queryClassifyBySite",
                "SiteId": draftParams.siteid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.SITEDESC = data.SITEDESC;
                $scope.dataForTheTree = data.CHILDREN;
            });
            $scope.status = {
                ifExpand: true
            };
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
            /*angular.forEach($scope.selectedChannels, function(data, index, array) {
                if (data.CHANNELID === channel.CHANNELID) {
                    $scope.selectedChannels[index].selected = false; 
                    $scope.selectedChannels.splice(index, 1);
                }
            });*/
            $scope.selectedChannel = null;
        }
    }]);
