/*
    Author:XCL
    Time:2016-01-07
*/

"use strict";
angular.module("PlanCueMonitorConfigModule", [])
    .controller("cueMonitorConfigCtrl", ["$scope", "$modalInstance", "$timeout", "trsHttpService", "transformData", function($scope, $modalInstance, $timeout, trsHttpService, transformData) {
        initStatus();
        init();

        function initStatus() {
            $scope.status = {
                "configTitle": transformData.CONFIGTITLE,
                "monitorType": transformData.MONITORTYPE,
                "monitorName": transformData.MONITORNAME,
                "id": transformData.ID,
                "channel": transformData.CHANNAL,
                "isShowSimSitePanel": false,
                "isAddDisabled": true,
                "isSameSite": true,
                // "isBlur":false,
                // "isFocus":false
            };

            $scope.data = {
                "monitorSource": "",
                "similarSites": [],
                "monitorItems": [],
                "monitorPlaceholder":{
                    "website":"请输入网站名称...",
                    "app":"请输入APP名称...",
                    "weixin":"请输入微信公众号名称...",
                    "epaper":"请输入纸媒名称...",
                    "weibo":"请输入微博账号名称...",
                    "discuz":"请输入论坛名称..."
                }
            };     
        }

        function init() {
            initExistedItems();
            initConfigTitle();
            initPlaceholder(transformData.MONITORTYPE);
        }

        function initExistedItems() {
            // angular.isDefined(transformData.CHANNAL) ? $scope.data.monitorItems = $scope.status.channel.split(";") : $scope.data.monitorItems = [];
            $scope.data.monitorItems = angular.isDefined(transformData.CHANNAL) ? $scope.status.channel.split(";") : [];
        }

        function initConfigTitle() {
            if (angular.isUndefined(transformData.CONFIGTITLE)) {
                $scope.status.configTitle = transformData.MONITORNAME + "配置";
            } else {
                $scope.status.configTitle = transformData.CONFIGTITLE;
            }
        }

        function initPlaceholder(type){   
            $scope.data.placeholder = $scope.data.monitorPlaceholder[type];
        }

        //搜索相关站点
        $scope.searchSameSite = function() {
            var params = {
                "serviceid": "multichannal",
                "modelid": "search",
                "site_name": $scope.data.monitorSource,
                "monitor_type": $scope.status.monitorType
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                if (angular.isUndefined(data.CONTENT)) return;
                $scope.data.similarSites = data.CONTENT.RESULT;
                if ($scope.data.similarSites.length === 0) {
                    $scope.status.isShowSimSitePanel = false;
                } else {
                    $scope.status.isShowSimSitePanel = true;
                }
            });
        };

        //选择相关站点
        $scope.chooseSimSite = function(curSite) {
            $scope.data.monitorSource = curSite;
            $scope.status.isSameSite = $scope.data.monitorItems.indexOf($scope.data.monitorSource) > -1 ? true : false;
            $scope.status.isShowSimSitePanel = false;
            $scope.status.isAddDisabled = true;
        };

        //添加相关站点
        $scope.add = function(ev) {
            if ($scope.status.isAddDisabled) {
                if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                    $scope.data.monitorItems.push($scope.data.monitorSource);
                    $scope.data.monitorSource = "";
                }
                $scope.status.isAddDisabled = false;
            }
        };

        //删除相关站点
        $scope.delete = function(item) {
            $scope.data.monitorItems.splice($scope.data.monitorItems.indexOf(item), 1);
        };

        //修改或者保存
        $scope.saveOrUpdate = function() {
            //如果当前监控存在，执行修改方法
            if (angular.isDefined($scope.status.id)) {
                update();
            } else {
                //不存在当前监控，执行新建保存方法
                save();
            }
        };

        //修改方法
        function update() {
            var params = {
                "serviceid": "multichannal",
                "modelid": "update",
                "monitor_name": $scope.status.monitorName,
                "channel": $scope.data.monitorItems.join(";"),
                "id": $scope.status.id
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                $modalInstance.close(data);
            });
        }

        //保存方法
        function save() {
            var params = {
                "serviceid": "multichannal",
                "modelid": "save",
                "monitor_name": $scope.status.monitorName,
                "channel": $scope.data.monitorItems.join(";"),
                "monitor_type": $scope.status.monitorType
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                $modalInstance.close(data);
            });
        }

        //取消或者关闭
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        //input框按下向下键,选择相关站点
        // $scope.downwardChoose = function(ev){
        //     if($scope.status.isShowSimSitePanel === true && ev.keyCode == 40){
        //         $scope.isBlur = true;
        //         console.log($scope.isBlur);
        //         $scope.isFocus = true;
        //     }
        // };

        //点击input框之外的地方以消失相关站点的面板
        $scope.clickToCancelPanel = function(){
            $scope.status.isShowSimSitePanel = false;
        };

    }]);
