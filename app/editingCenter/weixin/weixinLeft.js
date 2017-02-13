"use strict";
angular.module('weixinLeftModule', []).
controller('WeiXinLeftCtrl', ['$scope', '$location', '$state', 'trsHttpService', '$stateParams', '$q', '$filter', function($scope, $location, $state, trsHttpService, $stateParams, $q, $filter) {
    initStatus();
    initData();

    function initStatus() {
        $scope.pathes = $location.path().split('/');
        $scope.status = {
            weixin: {
                selectedItem: $scope.pathes[3] || "tobecompiled",
                isdownPicShow: false,
                selectedChnl: "",
                channels: ""
            }
        };
    }

    function initData() {
        queryWeixinChnls().then(function() {
            getWeixinAccessAuthority();
        }).then(function() {
            initWeiXinChnl();
        });
    }

    //查询微信栏目
    function queryWeixinChnls() {
        var defer = $q.defer();
        var params = {
            "serviceid": "mlf_mediasite",
            "methodname": "queryWebSitesByMediaType",
            "MediaType": '4'
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.status.weixin.channels = data.DATA;
            var filteredChnl = $filter('filterBy')(data.DATA, ['CHANNELID'], $location.search().channelid);
            $scope.status.weixin.selectedChnl = filteredChnl.length > 0 ? filteredChnl[0] : data.DATA[0];
            defer.resolve();
        });
        return defer.promise;
    }

    /**
     * [setWeixinItem description] 选择左侧栏
     * @param {[type]} item [description]
     */
    $scope.setWeixinItem = function(item) {
        $scope.status.weixin.selectedItem = item;
        $state.go('editctr.weixin.' + item, { channelid: $scope.status.weixin.selectedChnl.CHANNELID });
    };

    /**
     * [initWeiXinChnl description] 初始化左侧栏
     * @return {[type]} [description]
     */
    function initWeiXinChnl() {
        $state.go('editctr.weixin.' + $scope.status.weixin.selectedItem, { channelid: $scope.status.weixin.selectedChnl.CHANNELID });
    }

    /**
     * [getWeixinAccessAuthority description] 获取微信权限
     * @return {[type]} [description]
     */
    function getWeixinAccessAuthority() {
        var defer = $q.defer();
        var params = {
            serviceid: "mlf_metadataright",
            methodname: "queryCanOperOfWeChat",
            WeChatId: $scope.status.weixin.selectedChnl.CHANNELID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(rights) {
            $scope.status.weixinAccessAuthority = rights;
            defer.resolve();
        });
        return defer.promise;
    }

    //选择微信渠道的栏目
    $scope.setWeixinSelected = function(channel) {
        $scope.status.weixin.selectedChnl = channel;
        getWeixinAccessAuthority().then(function() {
            $state.go('editctr.weixin.' + $scope.status.weixin.selectedItem, { channelid: $scope.status.weixin.selectedChnl.CHANNELID });
        });
    };


}]);
