angular.module('editingCenterWebsiteOwnerModule', [])
    .controller('editingCenterWebsiteOwnerCtrl', ['$scope', '$q', 'trsHttpService', 'globleParamsSet', function($scope, $q, trsHttpService, globleParamsSet) {
        initStatus();
        initData();
        /**
         * [initStatus description:初始化状态]
         */
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                // "PAGESIZE": globleParamsSet.getPageSize(),
                "PAGESIZE": 20,
                "ITEMCOUNT": 0,
                "PAGECOUNT": 1
            };
            $scope.ownerParams = {
                "serviceid": "mlf_website",
                "methodname": "queryAllOwners",
            };
            $scope.draftParams = {
                "serviceid": "mlf_website",
                "methodname": "queryDocsByOwner",
                "OwnerId": "",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
            }
            $scope.status = {
                'search': {
                    'TRUENAME': '',
                },
                'currOwnerId': '',
                'currOwnerName': '',
                'copyCurrPage': 1,
                'position': {
                    '1': 0,
                    '3': 0,
                    '15': 0,
                    '2': 1,
                    '10': 2,
                }
            };
            $scope.data = {
                'ownerItems': [],
            };
        }
        /**
         * [initData description:初始化请求数据]
         */
        function initData() {
            requestOwnerList().then(function() {
                requestDraftList($scope.status.currOwnerId);
            });
        }

        /**
         * [pageChanged description] 下一页
         */
        $scope.pageChanged = function() {
            $scope.draftParams.CurrPage = $scope.page.CURRPAGE;
            $scope.status.copyCurrPage = $scope.page.CURRPAGE;
            requestDraftList($scope.status.currOwnerId);
        };
        /**
         * [jumpToPage description] 跳转到指定页面
         */
        $scope.jumpToPage = function() {
            if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.draftParams.CurrPage = $scope.status.copyCurrPage;
            $scope.page.CURRPAGE = $scope.draftParams.CurrPage;
            requestDraftList($scope.status.currOwnerId);
        };
        /**
         * [requestOwnerList description:请求左侧归属人列表]
         */
        function requestOwnerList() {
            var defer = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.ownerParams, 'post').then(function(data) {
                $scope.data.ownerItems = data;
                $scope.status.currOwnerId = $scope.data.ownerItems[0].USERID;
                $scope.status.currOwnerName = $scope.data.ownerItems[0].TRUENAME;
                defer.resolve();
            })
            return defer.promise;
        }
        /**
         * [requestOwnerList description:请求左侧归属人列表]
         */
        function requestDraftList(ownerId) {
            $scope.draftParams.OwnerId = ownerId;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.draftParams, 'post').then(function(data) {
                $scope.data.draftItems = data.DATA;
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
            })
        }
        /**
         * [chooseOwner description:选择归属人]
         */
        $scope.chooseOwner = function(item) {
            if ($scope.status.currOwnerId == item.USERID) return;
            $scope.status.currOwnerId = item.USERID;
            $scope.status.currOwnerName = item.TRUENAME;
            requestDraftList($scope.status.currOwnerId);
        }
    }]);
