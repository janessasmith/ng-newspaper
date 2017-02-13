/*
    Create by BaiZhiming 2015-12-15
*/
'use strict';
angular.module("batChooseChnlModule", [])
    .controller("batChooseChnlCtrl", ["$scope", "$timeout", "$modalInstance", "trsHttpService", "chnlParams", "trsspliceString", function($scope, $timeout, $modalInstance, trsHttpService, chnlParams, trsspliceString) {
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
                    "methodname": "queryClassifyByName",
                    "ChannelName": viewValue,
                    "SiteId": chnlParams.siteid
                };
                return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), searchParams, "post")
                    .then(function(data) {
                        return data;
                    });
            }, 10);
            return promise;
        };
        //监控SUGGESTION
        $scope.$watch("searchChannel", function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
                chongFPush($scope.selectedChannels, newValue);
                $scope.searchChannel = "";
            }
        });
        //判断是否选中
        $scope.ifSelected = function(node) { //CHANNELID
            var flag = false;
            for (var i = 0; i < $scope.selectedChannels.length; i++) {
                if (node.CHANNELID === $scope.selectedChannels[i].CHANNELID) {
                    $scope.selectedChannels[i].selected = true;
                    node.selected = true;
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        //判断是否选中
        $scope.chooseChannel = function(node) {
            node.selected = node.selected === undefined || node.selected === false ? true : false;
            if (node.selected) {
                $scope.selectedChannels.push(node);
            } else {
                cannelChannel(node);
            }
        };
        $scope.cancelChannel = function(channel) {
            cannelChannel(channel);
        };
        $scope.isChecked = function(node) {
            var flag = false;
            angular.forEach($scope.selectedChannels, function(data, index, array) {
                if (data.CHANNELID === node.CHANNELID) {
                    flag = true;
                }
            });
            return flag;
        };
        $scope.confirm = function() {
            $modalInstance.close({
                ChannelIds: trsspliceString.spliceString($scope.selectedChannels, "CHANNELID", ","),
                selectedRadio: $scope.selectedRedio
            });
        };
        //点击单选框
        $scope.chooseRadio = function(value) {
            $scope.selectedRedio = value;
        };
        //单选框是否选中
        $scope.radioIsChecked = function(value) {
            return $scope.selectedRedio === value;
        };

        function init() {
            //模态框标题初始化
            $scope.modalTitle = chnlParams.modalTitle;
            //初始化选中栏目集合
            $scope.selectedChannels = [];
            //初始化附件单选框
            $scope.radio = chnlParams.radio;
            //初始化单选框选中状态
            if (angular.isDefined(chnlParams.radio) && angular.isDefined(chnlParams.radio.defaultValue))
                $scope.selectedRedio = chnlParams.radio.enumValue[chnlParams.radio.defaultValue];
            //树配置开始
            $scope.treeOptions = {
                nodeChildren: "CHILDREN",
                dirSelectable: true,
                allowDeselect: false,
                injectClasses: {
                    ul: "copyDraftTree-ul",
                    li: "copyDraftTree-li",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "copyDraftTree-label",
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
                "SiteId": chnlParams.siteid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.SITEDESC = data.SITEDESC;
                $scope.dataForTheTree = data.CHILDREN;
            });
            $scope.status = {
                ifExpand: true
            };
        }

        function cannelChannel(channel) {
            angular.forEach($scope.selectedChannels, function(data, index, array) {
                if (data.CHANNELID === channel.CHANNELID) {
                    $scope.selectedChannels[index].selected = false;
                    $scope.selectedChannels.splice(index, 1);
                }
            });
        }

        //防止重复推送开始
        function chongFPush(array, data) {
            var flagR = true;
            angular.forEach(array, function(dataC, index, array) {
                if (dataC.CHANNELID == data.CHANNELID) {
                    flagR = false;
                    return;
                }
            });
            if (flagR === true) {
                array.push(data);
            }
        }
    }]);
