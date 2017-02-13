/**
 * createdBy cc 2016-6-28
 * app模块左侧
 */
"use strict";
angular.module('editingCenterAppLeftModule', [])
    .controller('appLeftCtrl', ['$scope', '$state', '$location', '$q', 'editingCenterService', 'editingMediatype', '$filter',
        function($scope, $state, $location, $q, editingCenterService, editingMediatype, $filter) {

            initStatus();
            initData();

            function initStatus() {
                $scope.pathes = $location.path()
                    .split('/');
                $scope.status = {
                    app: {
                        sites: "",
                        selectedSite: "",
                        utilBtns: {}, //按钮工具类
                        mediaType: 1,
                        platformParam: ["waitcompiled", "pending", "signed"],
                        selectedPlatform: $scope.pathes[3] || "waitcompiled", //默认展开平台
                        isDownPicShow: false, //站点列表是否展开
                        isPanelOpen: {
                            0: false
                        },
                        waitcompiled: {
                            channels: "",
                            selectedChnl: "",
                            isSelected: true,
                            isPanelOpen: {
                                0: false
                            }
                        },
                        pending: {
                            channels: "",
                            selectedChnl: "",
                            isSelected: $scope.pathes[3] === 'pending',
                            isPanelOpen: {
                                0: false
                            }
                        },
                        signed: {
                            channels: "",
                            selectedChnl: "",
                            isSelected: $scope.pathes[3] === 'signed',
                            isPanelOpen: {
                                0: false
                            }
                        },
                    },
                };

                $scope.treeOpts = editingCenterService.channelTreeOptions();

            }


            function initData() {
                initAppData();
            }

            function initAppData() {
                initSites().then(function() {
                    initChannel();
                });

            }
            //APP平台切换
            $scope.changeAppPlatform = function(platform) {
                if ($scope.status.app.selectedPlatform === platform) return;
                $scope.status.app.selectedPlatform = platform;
                $scope.status.app[$scope.status.app.selectedPlatform].isSelected = true;
                if (angular.isArray($scope.status.app[platform].channels) && $scope.status.app[platform].channels[0].SITEID === $scope.status.app.selectedSite.SITEID) {
                    routerChange();
                } else {
                    initChannel();
                }
            };
            //初始化站点
            function initSites() {
                var defer = $q.defer();
                editingCenterService.querySitesByMediaType(editingMediatype.app).then(function(data) {
                    $scope.status.app.sites = data.DATA;
                    $scope.status.app.isDownImgShow = data.DATA.length > 1 ? true : false;
                    var filteredSite = $filter('filterBy')(data.DATA, ['SITEID'], $location.search().siteid);
                    $scope.status.app.selectedSite = filteredSite.length > 0 ? filteredSite[0] : data.DATA[0];
                    defer.resolve();
                });
                return defer.promise;
            }
            //初始化栏目
            function initChannel() {
                editingCenterService.queryClassifyBySite($scope.status.app.selectedSite.SITEID, $scope.status.app.platformParam.indexOf($scope.status.app.selectedPlatform) + 1).then(function(data) {
                    $scope.status.app[$scope.status.app.selectedPlatform].channels = data.CHILDREN;
                    $scope.status.app[$scope.status.app.selectedPlatform].selectedChnl = data.CHILDREN[0];
                    routerChange();
                });
            }
            //路由切换
            function routerChange() {
                if (angular.isObject($scope.status.app[$scope.status.app.selectedPlatform].selectedChnl))
                    $state.go('editctr.app.' + $scope.status.app.selectedPlatform, { channelid: $scope.status.app[$scope.status.app.selectedPlatform].selectedChnl.CHANNELID, siteid: $scope.status.app.selectedSite.SITEID });
                else {
                    $state.go('editctr.app.' + $scope.status.app.selectedPlatform + "." + $scope.status.app[$scope.status.app.selectedPlatform].selectedChnl);
                }
            }
            //站点切换
            $scope.setAppSiteSelected = function(site) {
                if ($scope.status.app.selectedSite == site) return;
                $scope.status.app.selectedSite = site;
                initChannel();
            };
            $scope.setAppSelectedChnl = function(item, platform) {
                $scope.status.isMoreIconsShow = "";
                $scope.status.app[platform].selectedChnl = item;
                if (angular.isObject(item))
                    $state.go("editctr.app." + platform, {
                        channelid: item.CHANNELID
                        //siteid: item.SITEID
                    }, { reload: "editctr.app." + platform });
                else {
                    $state.go("editctr.app." + platform + "." + item, {
                        //siteid: $scope.status.app.selectedSite.SITEID
                    }, { reload: "editctr.app." + platform + "." + item });
                }
            };
            /**
             * [getSelectedNode description] 判断栏目树中的栏目是否被选中
             * @return {[type]} [description]
             */
            $scope.getSelectedNode = function() {
                if (angular.isObject($scope.status.app[$scope.status.app.selectedPlatform].selectedChnl)) {
                    return $scope.status.app[$scope.status.app.selectedPlatform].selectedChnl;
                } else {
                    return undefined;
                }
            };
            /**
             * [queryNodeChildren description]查询子节点
             * @param  {[obj]} node     [description]节点信息
             * @param  {[num]} platform [description]平台
             * @return {[type]}          [description]
             */
            $scope.queryNodeChildren = function(node,platform) {
                editingCenterService.queryChildChannel(node, platform).then(function(children) {
                    node.CHILDREN = children;
                });
            };
        }
    ]);
