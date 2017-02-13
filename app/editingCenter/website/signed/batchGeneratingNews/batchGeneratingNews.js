/*create by BaiZhiming 2015-12-14*/
"use strict";
angular.module("batchGeneratingModule", [])
    .controller("batchGeneratingCtrl", ["$scope", "$timeout", "$stateParams", "$filter", "trsHttpService", "trsconfirm", "getWebsiteNameService", function($scope, $timeout, $stateParams, $filter, trsHttpService, trsconfirm, getWebsiteNameService) {
        init();
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
        $scope.confirm = function() {
            if (angular.isDefined($scope.genParams.ChannelId)) {
                if (parseInt($scope.genParams.EndDocId) < parseInt($scope.genParams.BeginDocId)) {
                    trsconfirm.alertType("操作失败", "", "warning", false);
                } else {
                    $scope.genParams.serviceid = "mlf_website";
                    $scope.genParams.methodname = "batchUpdateDocs";
                    $scope.genParams.StartDocPubTime = $filter("date")($scope.genParams.StartDocPubTime, "yyyy-MM-dd hh:mm");
                    $scope.genParams.EndDocPubTime = $filter("date")($scope.genParams.EndDocPubTime, "yyyy-MM-dd hh:mm");
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.genParams, "post")
                        .then(function(data) {
                            trsconfirm.alertType("操作成功", "", "success", false);
                        });
                }
            } else {
                trsconfirm.alertType("请先选择栏目", "", "warning", false);
            }
        };

        function init() {
            $scope.isReadonly = true;
            $scope.websiteTemplate = {
                name: "请选择模板",
                value: 0
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
                $scope.siteDesc = data.SITEDESC; //将请求到的树拆分
                $scope.dataForTheTree = data.CHILDREN;
                if ($scope.dataForTheTree.length !== 0) {
                    $scope.showTree = true;
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
            $scope.genParams = {
                StartDocPubTime: angular.copy(new Date()),
                EndDocPubTime: angular.copy(new Date()),
                Recursion: false
            };
        }
        //稿源
        function template(node) {
            var params = {
                "serviceid": "mlf_websiteconfig",
                "methodname": "getOptionalTemplates",
                "ObjectType": "101",
                "ObjectId": node.CHANNELID,
                "TEMPLATETYPE": "2",
                "DocTemp": true
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                var templateJson = data.DATA;
                var channel = [];
                channel.push({
                    name: '请选择模板',
                    value: '',
                });
                for (var key in templateJson) {
                    channel.push({
                        name: templateJson[key].TEMPNAME,
                        value: templateJson[key].TEMPID,
                    });
                    if (templateJson[key].DEFAULTTEMP == 1) {
                        $scope.websiteTemplate = {
                            name: templateJson[key].TEMPNAME,
                            value: templateJson[key].TEMPID
                        };
                    }
                }
                $scope.templateJson = channel;
                $scope.genParams.TempId = $scope.websiteTemplate.value;
            });
        }
        /**
         * [getSuggestions description]作者suggestion
         * @param  {[type]} viewValue [description]
         * @return {[type]}           [description]
         */
        $scope.getSuggestions = function(viewValue) {
            var params = {
                serviceid: "mlf_extuser",
                methodname: "queryUsersByName",
                IsSearchAll: true,
                Name: viewValue
            };
            if (viewValue !== '') {
                if ($scope.isRequest) {
                    $scope.isRequest = false;
                    return [];
                } else {
                    return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        return data;
                    });
                }
            }
        };


        $scope.cleanTime = function() {
            $scope.genParams.StartDocPubTime="";
            $scope.genParams.EndDocPubTime="";
        };
        /**
         * [description]
         * @param  {[type]} newValue  [description]
         * @param  {[type]} oldValue) {                       if (angular.isObject(newValue)) {                $scope.isRequest [description]
         * @return {[type]}           [description]
         */
        $scope.$watch('userName', function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
                $scope.isRequest = true;
                $scope.genParams.CrUser = newValue.UNAME;
                $scope.userName = newValue.USERNAME;
            }
        });
        $scope.selectNode = function(node) {
            $scope.genParams.ChannelId = node.CHANNELID;
            $scope.websiteTemplate = {
                name: "请选择模板",
                value: 0
            };
            template(node);
        };
    }]);
