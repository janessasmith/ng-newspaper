'use strict';
angular.module('editingCenterLeftModule', ["ui.bootstrap", "treeControl"]).controller('editingCenterNavController', ['$q', "$timeout", '$stateParams', '$window', '$templateCache', "$filter", "$state", "$scope", "$rootScope",
    "trsHttpService", '$location', 'SweetAlert', "globleParamsSet", "trsconfirm", "editingCenterService", "websiteService",
    function($q, $timeout, $stateParams, $window, $templateCache, $filter, $state, $scope, $rootScope, trsHttpService, $location, SweetAlert, globleParamsSet, trsconfirm, editingCenterService, websiteService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.pathes = $location.path()
                .split('/');
            $scope.status = {
                mediaType: {
                    app: "1",
                    website: '2',
                    newspaper: '3',
                    weixin: '4',
                    weibo: '5'
                }, //APP：1，网站：2，报纸：3，微信：4，微博：5
                authority: "", //权限
                tab: {
                    app: {
                        isTabSelect: false,
                    },
                    website: {
                        isTabSelect: false,
                    },
                    iWo: {
                        isTabSelect: false,
                    },
                    newspaper: {
                        isTabSelect: false,
                    },
                    weixin: {
                        isTabSelect: false,
                    },
                    weibo: {
                        isTabSelect: false,
                    }
                },
                more: {
                    moreTabList: [{
                        'name': 'APP',
                        'id': "app"
                    }, {
                        name: '网站',
                        id: 'website'
                    }, {
                        'name': '微博',
                        'id': "weibo"
                    }, {
                        'name': '微信',
                        'id': "weixin"
                    }],
                    moreTabListItem: {
                        'name': '网站',
                        'id': "website"
                    },
                    isMoreTabListShow: false,
                },
            };
            $scope.status.isThisTabShow = $scope.pathes[2] == "website" || $scope.pathes[2] == "iWo" || $scope.pathes[2] == "newspaper" ? "website" : $scope.pathes[2]; //处理刷新问题
            $scope.status.tab[$scope.pathes[2]].isTabSelect = true;
        }

        function initData() {
            queryAllSites();
        }
        $scope.setTabSelected = function(param) {
            $scope.status.tab[param].isTabSelect = true;
            var willgo = 'editctr.' + param;
            if ($state.current.name.indexOf(willgo) >= 0) {
                $state.go($state.current.name, $stateParams, { reload: $state.current.name });
            } else {
                $state.go(willgo);
            }
        };
        /**
         * [queryAllSites description]查询可见产品
         */
        function queryAllSites() {
            editingCenterService.getPermissions().then(function(data) {
                $scope.status.authority = data;
            });
        }
        //左侧导航箭头内的导航
        $scope.setMoreTabRouter = function(position) {
            $scope.status.isThisTabShow = position;
            $scope.setTabSelected(position);
        };
    }
]);
