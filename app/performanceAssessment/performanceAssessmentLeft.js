"use strict";

angular.module('performanceAssessmentLeftModule', []).controller('performanceAssessmentLeftCtrl', ['$scope', '$q', '$location', '$state', '$filter', 'trsHttpService',
    function($scope, $q, $location, $state, $filter, trsHttpService) {
        initStatus();
        initData();

        /**
         * [initStatus description: 初始化状态]
         * @return {[type]} [description]
         */
        function initStatus() {
            $scope.data = {
                newspapers: []
            };
            $scope.status = {
                params: {
                    "serviceid": "mlf_mediasite",
                    "methodname": "queryWebSitesByMediaType",
                    "MediaType": "3"
                },
                selectedChannel: ""
            };
        }

        /**
         * [initData description: 初始化数据]
         * @return {[type]} [description]
         */
        function initData() {
            requestData();
        }

        /**
         * [requestData description: 获取数据]
         * @return {[type]} [description]
         */
        function requestData() {
            initFirstNav()
                // data返回值为：data = Object {item: Object, index: 0}
                .then(function(data) {
                    initSecondNav(data.item, data.index);
                });
        }

        /**
         * [initFirstNav description: 获取一级菜单数据]
         * @return {[type]} [description]
         */
        function initFirstNav() {
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.params, 'get').then(function(data) {
                // 将一级菜单所有数据存入$scope.data.newspapers
                $scope.data.newspapers = data.DATA;
                // deferred.resolve(data.DATA);

                if ($location.search().PaperId !== undefined) {
                    for (var i = 0; i < $scope.data.newspapers.length; i++) {
                        if ($scope.data.newspapers[i].SITEID === $location.search().PaperId) {
                            data.DATA[i].isOpen = true;
                            deferred.resolve({
                                item: data.DATA[i],
                                index: i
                            });
                        }
                    }
                } else {
                    // 默认左侧导航菜单第一栏展开
                    data.DATA[0].isOpen = true;
                    // 声明执行成功，参数传递给回调函数也就是二级菜单
                    deferred.resolve({
                        item: data.DATA[0],
                        index: 0
                    });
                }

            });
            return deferred.promise;
        }

        /**
         * [initSecondNav description: 获取二级菜单数据] SITEID(PaperId)表示一级菜单，CHANNELID(BanMianId)表示二级菜单
         * @param  {[type]} item  [description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        function initSecondNav(item, index) {
            var params = {
                "paperid": item.SITEID,
                "serviceid": "mlf_jxkh",
                "methodname": "getJXKHBMs"
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                // 将一级菜单每条数据存入对应的$scope.data.newspapers[index].channels
                $scope.data.newspapers[index].channels = data;

                // 过滤数组
                // 遍历newspapers每个index下标下的channels这个属性对应的值，再把它的CHANNELID和url的BanMianId对比，
                // 直到找到相等的时候，将对应的$scope.data.newspapers[index].channels赋给selectedItem
                var selectedItem = $filter("filterBy")($scope.data.newspapers[index].channels, ["CHANNELID"], $location.search().BanMianId)[0];
                var secondIndex = $scope.data.newspapers[index].channels.indexOf(selectedItem);

                $scope.status.selectedChannel = $scope.data.newspapers[index].channels[secondIndex];
                // 默认把左侧导航一级菜单的第一栏赋给url
                $state.go('perform.newspaper', {
                    'PaperId': $scope.status.selectedChannel.SITEID,
                    "BanMianId": $scope.status.selectedChannel.CHANNELID
                });
            });
        }

        /**
         * [openSecondNav description: 点击一级菜单后展开二级菜单]
         * @param  {[type]} item  [description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        $scope.openSecondNav = function(item, index) {
            if (item.channels) {
                return;
            }
            getSecondNav(item, index);
        };

        /**
         * [chooseChannels description: 点击二级菜单]
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        $scope.chooseChannels = function(item) {
            $scope.status.selectedChannel = item;
        };

        /**
         * [getSecondNav description: 获取二级菜单数据]
         * @param  {[type]} item  [description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        function getSecondNav(item, index) {
            var params = {
                "paperid": item.SITEID,
                "serviceid": "mlf_jxkh",
                "methodname": "getJXKHBMs"
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                // 将一级菜单每条数据存入对应的$scope.data.newspapers[index].channels
                $scope.data.newspapers[index].channels = data;
            });
        }
    }
]);