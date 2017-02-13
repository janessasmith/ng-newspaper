/**
 * [togglePanel description]切换panel展开关闭
 * @param  {[type]} panel [description] 被点击的panel
 * @return {[type]}       [description] null
 */
"use strict";
angular.module("weChatPostListModule", [])
    .controller("weChatPostListCtrl", ["$scope", "$q", "trsHttpService", function($scope, $q, trsHttpService) {
        initStatus();
        initData();
        /**
         * [initStatus description]初始化状态
         */
        function initStatus() {
            $scope.status = {
                //初始化小图长宽高度
                initSmallRankingwidth: {
                    height: '30px',
                    width: '100px'
                },
                //初始化大图长宽
                initBigRankingwidth: {
                    height: '240px',
                    width: '1000px'
                },
                //初始化热度曲线
                readCurve: '',
            };
            $scope.data = {};
            $scope.page = {};
        }
        /**
         * [initStatus description]初始化数据
         */
        function initData() {
            //初始化获取一级标签数据
            getWetChaTtitletab().then(function() {
                //初始化获取二级标签数据
                $scope.weChatTitletab($scope.status.rankingTitle[0]);
            });
        }
        /**
         * [getWetChaTtitletab description]获取一级标签
         * 
         */
        function getWetChaTtitletab() {
            var deffer = $q.defer();
            var params = {
                typeid: "widget",
                serviceid: "wechatranklist",
                modelid: "getfieldlist"
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, 'get').then(function(data) {
                $scope.status.rankingTitle = [];
                for (var i in data) {
                    $scope.status.rankingTitle.push({ name: i, value: data[i] });
                }
                deffer.resolve(data);
            });
            return deffer.promise;
        }
        /*
         *[  readCurve description] 门户排行榜阅读曲线
         *@params item   [description]标题名称
         */
        $scope.readCurve = function(item) {
            $scope.status.readCurve = (($scope.status.readCurve == item) ? '' : item);
        };
        /**
         * [titletab description]选择一级标签，获取二级标签列表
         * 
         */
        $scope.weChatTitletab = function(title) {
            var params = {
                typeid: "widget",
                serviceid: "wechatranklist",
                modelid: "getfieldlist",
                wxbd_id: title.value
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get")
                .then(function(data) {
                    $scope.data.rankingTabListNum = data;
                    $scope.weChatRanklistTab(data[0]);
                });
        };
        $scope.weChatRanklistTab = function(rankingTabList) {
            var params = {
                typeid: "widget",
                serviceid: "wechatranklist",
                modelid: "getranklist",
                wxbd_id: rankingTabList.ID
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get")
                .then(function(data) {
                    $scope.data.ranklistLists = data;
                });
        };
        /**
         * [ranklistTab description]选择二级标签
         * 
         */
        $scope.ranklistTab = function() {};
    }]);
