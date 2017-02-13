(function() {
    "use strict";
    angular.module('editingCenterNaviModule', ['duScroll'])
        .controller('EditingCenterNaviCtrl', ['$scope', '$state', '$filter', '$location', '$q', 'trsHttpService',
            function($scope, $state, $filter, $location, $q, trsHttpService) {
                initStatus();
                initData();

                function initStatus() {
                    $scope.router = $location.path().split('/');
                    $scope.data = {
                        products: [
                            { name: '网站', mediaType: 2, router: 'website' },
                            { name: '报纸', mediaType: 3, router: 'newspaper' },
                            { name: 'APP', mediaType: 1, router: 'app' }, 
                            // { name: '微博', mediaType: 1, router: 'weibo' }
                        ],
                        website: {
                            sites: [],
                        },
                        newspaper: {
                            sites: []
                        },
                        app: {
                            sites: []
                        },
                        weibo: {
                            sites: []
                        }
                    };
                    $scope.status = {
                        mediaType: { //APP：1，网站：2，报纸：3，微信：4，微博：5
                            1: 'apps',
                            2: 'websites',
                            3: 'newspapers',
                            4: 'weixins',
                            5: 'weiboes'
                        },
                        currProduct: $filter('filterBy')($scope.data.products, ['router'], $scope.router[2])[0] || $scope.data.products[0],
                        currNavi: '',
                        productsListShow: false,
                        path: $location.path().split('/')[2],
                    };
                }

                function initData() {
                    queryWebsites().then(function() {
                        $scope.status.currNavi = $scope.status.path == 'iWo' ? "" :$filter('filterBy')($scope.data[$scope.status.currProduct.router].sites, ['SITEID'], $location.search().siteid || $location.search().paperid)[0];
                    });
                }

                //选择产品
                $scope.setCurrProduct = function(product) {
                    $scope.status.currProduct = product;
                    $scope.status.productsListShow = false;
                    if ($scope.data[$scope.status.currProduct.router].sites.length > 0) {
                        //已经请求过
                    } else {
                        //未请求过
                        queryWebsites();

                    }
                };
                //设置当前网站
                $scope.setCurrSite = function(site) {
                    $scope.status.currNavi = site;
                    $state.go('editctr.' + $scope.status.currProduct.router, { siteid: site.SITEID, paperid: site.SITEID });
                };

                //查询APP,网站，报纸站点
                function queryWebsites() {
                    var params = {
                        serviceid: "mlf_mediasite",
                        methodname: "queryWebSitesByMediaType",
                        MediaType: $scope.status.currProduct.mediaType,
                    };
                    var defer = $q.defer();
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                        $scope.data[$scope.status.currProduct.router].sites = data.DATA;
                        defer.resolve();
                    });
                    return defer.promise;
                }
                $scope.siteScroll = function() {
                    $("#siteNavi").mCustomScrollbar("scrollTo", "right");
                };
            }
        ]);

}());
