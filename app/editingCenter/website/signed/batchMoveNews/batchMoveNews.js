/*
    Create by BaiZhiming 2015-12-17
*/
'use strict';
angular.module("batchMoveNewsModule", [])
    .controller("batchMoveNewsCtrl", ["$scope", "$stateParams", "trsHttpService", "trsconfirm","getWebsiteNameService",function($scope, $stateParams, trsHttpService, trsconfirm,getWebsiteNameService) {
        init();
        $scope.updateSelection = function(item) {
            $scope.selectedRecuGen = item.value;
        };
        //左边树
        $scope.showLeftSelected = function(node) {
            $scope.leftSelected = node;
        };
        //右边树
        $scope.showRightSelected = function(node) {
            $scope.rightSelected = node;
        };
        $scope.confirm = function() {
            isChooseChnl($scope.leftSelected, $scope.rightSelected, function() {
                return;
            });
            if ($scope.leftSelected.CHANNELID === $scope.rightSelected.CHANNELID) {
                trsconfirm.alertType("移入栏目和移出栏目相同", "", "warning", false);
            } else {
                $scope.status.isBusy = true;
                var moveParams = {
                    serviceid: "mlf_website",
                    methodname: "moveChnlDocs",
                    fromChnlId: $scope.leftSelected.CHANNELID,
                    toChnlId: $scope.rightSelected.CHANNELID,
                    Recursion: $scope.selectedRecuGen
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), moveParams, "post")
                    .then(function(data) {
                        trsconfirm.alertType("新闻批量转移成功", "", "success", false);
                        $scope.status.isBusy = false;
                    },function(){
                        $scope.status.isBusy = false;
                    });
            }
        };
        $scope.showToggle = function(node) {
            var childTreeParam = {
                ChannelId: node.CHANNELID,
                serviceid: "mlf_mediasite",
                methodname: "queryClassifyByChnl"
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), childTreeParam, "post")
                .then(function(data) {
                    if (node.CHILDREN.length === 0) {
                        node.CHILDREN = data.CHILDREN;
                    }
                });
        };

        function init() {
            $scope.status = {
                isBusy:false //防止重复提交
            };
            $scope.isAllRoute = {
                'isAllRoute': false,
                'isWebsite': true
            };
            $scope.treeOptions = {
                nodeChildren: "CHILDREN",
                allowDeselect: false,
                dirSelectable: true,
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "a8"
                },
                isLeaf: function(node) {
                    return node.HASCHILDREN == "false";
                }
            };
            //树配置结束
            var params = {
                "serviceid": "mlf_mediasite",
                "methodname": "queryClassifyBySite",
                "SiteId": $stateParams.siteid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.siteRightDesc = data.SITEDESC; //将请求到的树拆分
                $scope.siteLeftDesc = data.SITEDESC;
                $scope.leftTree = data.CHILDREN;
                $scope.rightTree = data.CHILDREN;
                if ($scope.rightTree.length !== 0) {
                    $scope.showRightTree = true;
                }
                if ($scope.leftTree.length !== 0) {
                    $scope.showLeftTree = true;
                }
            });
            $scope.recuGens = [{
                "desc": "是",
                "value": 1
            }, {
                "desc": "否",
                "value": 0
            }];
            $scope.selectedRecuGen = 0;
            getWebsiteNameService.getWebsiteName($stateParams.siteid).then(function(data) {
                $scope.channelName = data.SITEDESC;
            });
        }

        function isChooseChnl(obj, _obj, callback) {
            if (!angular.isDefined(obj) || !angular.isDefined(_obj)) {
                trsconfirm.alertType("请选择移入和移出栏目", "", "warning", false);
                callback();
            }
        }
    }]);
