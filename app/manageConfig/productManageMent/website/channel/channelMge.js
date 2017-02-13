'use strict';
angular.module('productManageMentWebsiteChannelModule', [
    'mangeProChannelCtrlModule',
    'productManageMentWebsiteChannelRouterModule',
    'productManageMentWebsiteChannelRecycleBinModule'
]).
controller('productManageMentWebsiteChannelCtrl', ['$scope', '$rootScope', '$q', '$state', '$modal', '$stateParams', 'trsHttpService', 'trsconfirm', 'productMangageMentWebsiteService', 'localStorageService', "globleParamsSet", "websiteService","editingCenterService",function($scope, $rootScope, $q, $state, $modal, $stateParams, trsHttpService, trsconfirm, productMangageMentWebsiteService, localStorageService, globleParamsSet, websiteService,editingCenterService) {
    initStatus();
    initData();
    //获取栏目操作权限开始
    function getChnlRights() {
        productMangageMentWebsiteService.getRight($stateParams.site, "", "websetsite.channel").then(function(data) {
            $scope.status.right = data;
        });
    }
    //获取栏目操作权限结束 
    /**
     * [positionToChannel description]定位到频道
     * @return null [description]
     */
    $scope.positionToSite = function (siteMsg){
        $state.go("manageconfig.productmanage.website.channel",{site:siteMsg.SITEID},{reload:true});
    };
    /**
     * [clickSiteDirected description]点击站点重定向开始
     * @return null [description]
     */
    $scope.clickChnlDirected = function(item) {
        productMangageMentWebsiteService.getCloumnAccessAuthority(item.CHANNELID).then(function(data) {
            //將权限信息存入缓存，用于底部路由区加载使用开始
            localStorageService.remove("rightOperType_channel"); //初始化缓存
            localStorageService.set("rightOperType_channel", {
                type: data.router,
                data: data.data
            });
            $rootScope.$broadcast("expandLeftTree", "channel");
            //將权限信息存入缓存，用于底部路由区加载使用结束
            $state.go("manageconfig.productmanage.website." + data.router, {
                channel: item.CHANNELID,
                parentchnl: item.CHANNELID
            });
        });
    };
    //初始化数据
    function initData() {
        requestData().then(function(data) {
            $scope.websiteItems = data;
            $scope.websiteItems !== "" ? $scope.selectedChannel = $scope.websiteItems[0] : "";
        });
        editingCenterService.getSiteInfo($stateParams.site).then(function(data) {
            $scope.data.siteMsg = data;
        });
    }
    //数据请求函数
    function requestData() {
        var defferd = $q.defer();
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'get').then(function(data) {
            defferd.resolve(data);
        });
        return defferd.promise;
    }
    $scope.btnClick = function(item) {
        $scope.click_btn = item;
    };
    //鼠标移入
    $scope.getInSelectedChl = function(websiteItem) {
        $scope.selectedChannel = websiteItem;
    };
    //搜索
    $scope.searchChannelByName = function() {
        $scope.params.methodname = "queryChannelsBySite";
        $scope.params.ChnlDesc = $scope.searchChlName;
        requestData().then(function(data) {
            $scope.websiteItems = data;
        });
    };

    function initStatus() {
        $scope.params = {
            serviceid: "mlf_websiteconfig",
            methodname: "queryChannelsBySite",
            SiteId: $stateParams.site
        };
        $scope.status = {
            PmmWebsiteChnlSelected: $stateParams.websiteselect,
            right: {}, //栏目列表操作权限
        };
        $scope.data={
            siteMsg:"",
        };
        $scope.selectedChannel = "";
        getChnlRights();
    }
    //删除弹窗
    $scope.delete = function(websiteItem) {
        var deleteParams = {
            serviceid: "mlf_websiteconfig",
            methodname: "deleteChannel",
            ChannelId: websiteItem.CHANNELID,
            TopChannelId: '0'
        };
        trsconfirm.inputModel("确认删除此频道", "输入删除的理由，可选填", function(data) {
            productMangageMentWebsiteService.inputPassword(function(password) {
                deleteParams.PassWord = password;
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), deleteParams, "post")
                    .then(function(data) {
                        $rootScope.$broadcast("leftAddChannel", websiteItem);
                        trsconfirm.alertType("删除频道成功", "", "success", false, function() {
                            requestData().then(function(data) {
                                $scope.websiteItems = data;
                                $scope.websiteItems !== "" ? $scope.selectedChannel = $scope.websiteItems[0] : "";
                            });
                        });
                    });
            });
        });
    };
    //修改弹窗
    $scope.modify = function(websiteItem) {
        var column = {
            title: "修改频道",
            isColumn: false
        };
        $scope.modifyViews(column, function(data) {

        }, websiteItem);
    };
    //新增弹窗
    $scope.add = function() {
        var column = {
            title: "新建频道",
            isColumn: false
        };
        $scope.modifyViews(column, function(data) {

        }, "");
    };
    //发布频道
    $scope.publish = function(websiteItem) {
        websiteService.websitePublish(websiteItem.CHANNELID, "101");
    };
    //删除弹窗方法
    $scope.deleteViews = function(item, successFn) {
        var modalInstance = $modal.open({
            templateUrl: "./manageConfig/productManageMent/website/channel/template/channel_delete_tpl.html",
            windowClass: 'productManageMent-website-channel-delete',
            backdrop: false,
            controller: "channelDeleteCtrl",
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
            controller: "channelModifyCtrl",
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
            $rootScope.$broadcast("leftAddChannel", websiteChannel);
            $scope.params = result;
            $scope.params.serviceid = "mlf_websiteconfig";
            $scope.params.methodname = "saveNewChnl";
            $scope.params.TopChannelId = '0';
            $scope.params.CHNLDATAPATH = result.DATAPATH;
            requestData().then(function() {
                $scope.params = {
                    serviceid: "mlf_websiteconfig",
                    methodname: "queryChannelsBySite",
                    SiteId: $stateParams.site
                };
                requestData().then(function(data) {
                    $scope.websiteItems = data;
                    $scope.websiteItems !== "" ? $scope.selectedChannel = $scope.websiteItems[0] : "";
                    trsconfirm.alertType(column.title + '成功', "", "success", false, function() {});
                });
            });
        });
    };
    //频道预览
    $scope.preview = function(websiteItem) {
        websiteService.websiteChannelPreview(websiteItem);
    };
}]);
