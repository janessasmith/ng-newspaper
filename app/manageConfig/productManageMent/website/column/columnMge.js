/*
 Create by smg  2015-12-23
 */
"use strict";
angular.module("productManageMentWebsiteColumnModule", [
        'mangeProColumnCtrlModule',
        "websiteServiceModule",
        'productManageMentWebsiteColumnRecycleBinModule',
        'productManageMentWebsiteColumnRouterModule'
    ])
    .controller("productManageMentWebsiteColumnCtrl", ['$scope', '$rootScope', '$q', '$state', '$modal', '$stateParams', 'trsHttpService', "websiteService", "trsconfirm", "productMangageMentWebsiteService", "localStorageService", function($scope, $rootScope, $q, $state, $modal, $stateParams, trsHttpService, websiteService, trsconfirm, productMangageMentWebsiteService, localStorageService) {
        initStatus();
        initData();
        /**
         * [getChannelPath description]获得栏目的全路径
         * @return {[type]} [description]
         */
        function getChannelPath() {
            var params = {
                "serviceid": "mlf_mediasite",
                "methodname": "getChannelIdPath",
                "ChannelId": $stateParams.channel,
                "Burster": ">"
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.channelPath = data;
                if (data.length > 0) {
                    $scope.data.siteName = data[0].SITENAME;
                    $scope.data.siteId = data[0].SITEID;
                }
            });
        }
        /**
         * [positionToChannel description]定位到站点
         * @return {[type]} [description]
         */
        $scope.positionToSite = function() {
            $state.go("manageconfig.productmanage.website.channel", { site: $scope.data.siteId }, { reload: true });
        };
        /**
         * [positionToChannel description]定位到频道
         * @return {[type]} [description]
         */
        $scope.positionToChannel = function(chnnel) {
            $state.go("manageconfig.productmanage.website.column", { site: $scope.data.siteId, channel: chnnel.CHANNELID }, { reload: true });
        };
        //初始化数据
        //获取栏目操作权限开始
        function getChnlRights() {
            productMangageMentWebsiteService.getRight("", $stateParams.parentchnl, "websetchannel.channel").then(function(data) {
                $scope.status.right = data;
            });
        }
        /**
         * [clickSiteDirected description]点击站点重定向开始
         * @return null [description]
         */
        $scope.clickChnlDirected = function(item) {
            productMangageMentWebsiteService.getCloumnAccessAuthority($stateParams.parentchnl).then(function(data) {
                //將权限信息存入缓存，用于底部路由区加载使用开始
                localStorageService.set("rightOperType", {
                    type: data.router,
                    data: data.data
                });
                $rootScope.$broadcast("expandLeftTree", "column");
                //將权限信息存入缓存，用于底部路由区加载使用结束
                $state.go("manageconfig.productmanage.website.column", {
                    channel: item.CHANNELID,
                    parentchnl: $stateParams.parentchnl
                });
            });
        };
        //获取栏目操作权限结束
        function initData() {
            requestData().then(function(data) {
                $scope.websiteItems = data;
                $scope.websiteItems !== "" ? $scope.selectedColumn = $scope.websiteItems[0] : "";
                initChannel();
            });
            getChannelPath();
        }
        //数据请求函数
        function requestData() {
            var defferd = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                defferd.resolve(data);
            });
            return defferd.promise;
        }
        $scope.enderInColumn = function(websiteItem) {
            $scope.selectedColumn = websiteItem;
        };
        //搜索栏目
        $scope.searchColumn = function() {
            $scope.params.serviceid = "mlf_websiteconfig";
            $scope.params.methodname = "queryChannelsByChannel";
            $scope.params.ChannelId = $stateParams.channel;
            $scope.params.ChnlDesc = $scope.searchColumnByName;
            requestData().then(function(data) {
                $scope.websiteItems = data;
            });
        };
        //鼠标移入
        $scope.getInSelectedChl = function(websiteItem) {
            $scope.selectedColumn = websiteItem;
        };

        function initStatus() {
            $scope.status = {
                PmmWebsiteChnlSelected: $stateParams.websiteselect,
                right: {}
            };
            $scope.params = {
                serviceid: "mlf_websiteconfig",
                methodname: "queryChannelsByChannel",
                ChannelId: $stateParams.channel
            };
            $scope.data = {
                channelPath: "",
            };
            $scope.superiorChn = $stateParams.channel;
            getChnlRights();
        }

        function initChannel() {
            $scope.params.serviceid = "mlf_mediasite";
            $scope.params.methodname = "getBroChannels";
            $scope.params.ChannelId = $stateParams.channel;
            requestData().then(function(data) {
                $scope.channels = data;
                var array = $scope.channels.pop();
                $scope.channels.unshift(array);
            });
        }
        //栏目移动弹窗
        $scope.moveViews = function() {
            productMangageMentWebsiteService.singleChooseChnl("移动栏目", $stateParams.site, $scope.selectedColumn.CHANNELID, function(data) {
                delete $scope.params.ChannelId;
                if (angular.isDefined(data.CHANNELID)) {
                    $scope.params.ChannelId = data.CHANNELID;
                    $scope.targetDesc = data.CHNLDESC;
                } else {
                    $scope.targetDesc = data.SITEDESC;
                }
                $scope.params.SiteId = $stateParams.site;
                $scope.params.serviceid = "mlf_websiteconfig";
                $scope.params.methodname = "moveToBaseChannel";
                $scope.params.FromChnlId = $scope.selectedColumn.CHANNELID;
                $scope.params.TopChannelId = $stateParams.parentchnl;
                requestData().then(function(data) {
                    $rootScope.$broadcast("leftAddColum", true);
                    trsconfirm.alertType("栏目移动成功", "该栏目成功移动到" + $scope.targetDesc, "success", false, function() {
                        $scope.params.serviceid = "mlf_websiteconfig";
                        $scope.params.methodname = "queryChannelsByChannel";
                        $scope.params.ChannelId = $stateParams.channel;
                        requestData().then(function(data) {
                            $scope.websiteItems = data;
                        });
                    });
                });
            });
        };
        //删除弹窗
        $scope.delete = function(websiteColumn) {
            var deleteParams = {
                serviceid: "mlf_websiteconfig",
                methodname: "deleteChannel",
                ChannelId: websiteColumn.CHANNELID,
                TopChannelId: $stateParams.parentchnl
            };
            trsconfirm.inputModel("确认删除此栏目", "输入删除的理由，可选填", function(data) {
                productMangageMentWebsiteService.inputPassword(function(password) {
                    deleteParams.PassWord = password;
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), deleteParams, "post")
                        .then(function(data) {
                            trsconfirm.alertType("删除成功", "删除站点成功", "success", false, function() {
                                $rootScope.$broadcast("leftAddColum", websiteColumn);
                                requestData().then(function(data) {
                                    $scope.websiteItems = data;
                                    $scope.selectedColumn = $scope.websiteItems[0];
                                });
                            });
                        });
                });
            });
        };
        //修改弹窗
        $scope.modify = function(websiteChannel) {
            var column = {
                title: "修改栏目",
                isColumn: true
            };
            $scope.modifyViews(column, function(data) {}, websiteChannel);
        };
        //新增弹窗
        $scope.add = function() {
            var column = {
                title: "新增栏目",
                isColumn: true
            };
            $scope.modifyViews(column, function(data) {}, "");
        };
        //发布频道
        $scope.publish = function(websiteItem) {
            websiteService.websitePublish(websiteItem.CHANNELID, "101");
        };
        //删除弹窗方法
        $scope.deleteViews = function(item, successFn) {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/website/column/template/column_delete_tpl.html",
                windowClass: 'productManageMent-website-column-delete',
                backdrop: false,
                controller: "columnDeleteCtrl",
                resolve: {
                    item: function() {
                        return item;
                    },
                    successFn: function() {
                        return successFn;
                    }
                }
            });
            return modalInstance.result.then(function(result) {});
        };
        //修改弹窗方法
        $scope.modifyViews = function(column, successFn, websiteChannel) {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/website/channel/template/channel_modify_tpl.html",
                windowClass: 'productManageMent-website-channel-modify',
                backdrop: false,
                controller: "columnModifyCtrl",
                resolve: {
                    column: function() {
                        return column;
                    },
                    successFn: function() {
                        return successFn;
                    },
                    websiteChannel: function() {
                        return websiteChannel;
                    }
                }
            });
            return modalInstance.result.then(function(result) {
                $scope.params = result;
                $scope.params.serviceid = "mlf_websiteconfig";
                $scope.params.methodname = "saveNewChnl";
                $scope.params.TopChannelId = $stateParams.parentchnl;
                $scope.params.CHNLDATAPATH = result.DATAPATH;
                requestData().then(function(data) {
                    $rootScope.$broadcast("leftAddColum", websiteChannel);
                    $scope.params = {
                        serviceid: "mlf_websiteconfig",
                        methodname: "queryChannelsByChannel",
                        ChannelId: $stateParams.channel
                    };
                    requestData().then(function(data) {
                        $scope.websiteItems = data;
                        $scope.websiteItems !== "" ? $scope.selectedChannel = $scope.websiteItems[0] : "";
                        trsconfirm.alertType(column.title, column.title + '成功', "success", false, function() {});
                    });
                });
            });
        };
        //频道预览
        $scope.preview = function(websiteItem) {
            websiteService.websiteChannelPreview(websiteItem);
        };
    }]);
