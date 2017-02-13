"use strict";
//采编中心 iwo左侧
angular.module('iWoLeftModule', []).controller('iWoLeftCtrl', ['$scope', '$state', '$location', '$q', 'trsHttpService',
    function($scope, $state, $location, $q, trsHttpService) {
        initStatus();
        if ($scope.pathes.length === 3)
            $state.go("editctr.iWo.personalManuscript");
        initData();
        function initStatus() {
            $scope.pathes = $location.path()
                .split('/');
            $scope.status = {
                iwoAccessAuthority: "",
                isMyManuscriptShow: true,
                selectedItem: $scope.pathes[3] || "personalManuscript",
                isUsualOpened: $location.search().customid ? true : false,
                authority: {},
                customItems: [],
            };
        }

        function initData() {
            getIwoAuthority();
            requestCustomList();
        }
        /**
         * [iwoCustomRouter description]iwo常用资源自定义路由
         * @param  {[object]} item  [description]当前条目
         */
        $scope.iwoCustomRouter = function(item) {
            var router = item.CUSTOM == "邮件稿" ? "editctr.iWo.emaildraft" : "editctr.iWo.custom";
            $state.go(router, {
                'customid': item.CUSTOMID,
                'customtype': item.CUSTOMTYPE,
                'mycustomid': item.MYCUSTOMID
            });
        };
        /**
         * [getIwoAccessAuthority description]获取IWO的访问权限
         * @return {[type]} [description] promise
         */
        function getIwoAuthority() {
            var params = {
                serviceid: "mlf_metadataright",
                methodname: "queryCanOperIWOModals",
                classify: "iwo"
            };
            var defer = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.status.authority = data;
                defer.resolve();
            });
            return defer.promise;
        }
        $scope.setIWoSelectedChnl = function(item) {
            $scope.status.selectedItem = item;
        };
        /**
         * [requestCustomList description:初始化自定义列表]
         */
        function requestCustomList() {
            var params = {
                serviceid: 'mlf_releasesource',
                methodname: 'queryMyCustoms'
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $scope.status.customItems = data.DATA;
            });
        }
    }
]);
