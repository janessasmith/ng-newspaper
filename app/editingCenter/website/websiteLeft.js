    "use strict";
    angular.module('websiteLeftModule', []).controller('websiteLeftCtrl', ['$scope', '$q', '$location', '$state', '$filter', 'editingCenterService', 'trsHttpService', 'websiteService', 'globleParamsSet', 'editingMediatype',
        function($scope, $q, $location, $state, $filter, editingCenterService, trsHttpService, websiteService, globleParamsSet, editingMediatype) {
            initStatus();
            initData();

            function initStatus() {
                $scope.router = $location.path().split('/');
                $scope.status = {
                    sites: [],
                    selectedSite: {},
                    utilBtns: {}, //按钮工具类
                    widgets: "",
                    selectedWidget: "",
                    platformParam: ["waitcompiled", "pending", "signed"],
                    selectedPlatform: $scope.router[3] || "waitcompiled", //默认展开平台
                    isFragOpen: false, //碎片化管理是否打开
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
                        isSelected: $scope.router[3] === 'pending',
                        isPanelOpen: {
                            0: false
                        }
                    },
                    signed: {
                        channels: "",
                        selectedChnl: "",
                        isSelected: $scope.router[3] === 'signed',
                        isPanelOpen: {
                            0: false
                        }
                    },
                    channelTreeOptions: editingCenterService.channelTreeOptions(),

                };
            }

            function initData() {
                initSites()
                .then(function() {    
                    return queryChannels();
                })     
                .then(function() {
                    queryWebsiteUtilBtns();
                    getWebSiteAccessAuthority();
                    if ($scope.router.length === 3) {
                        $state.go('editctr.website.' + $scope.status.selectedPlatform, { channelid: $scope.status[$scope.status.selectedPlatform].selectedChnl.CHANNELID, siteid: $scope.status.selectedSite.SITEID });
                    }
                });
            }
            //查询栏目
            function queryChannels() {
                var defer = $q.defer();
                if (angular.isDefined($scope.status[$scope.status.selectedPlatform]) && $scope.status[$scope.status.selectedPlatform].channels.lenth > 0) {
                    defer.resolve();
                } else {
                    var platform = $scope.status.platformParam.indexOf($scope.status.selectedPlatform) + 1;
                    queryChannelsWithoutPlat(platform).then(function(channels) {
                        defer.resolve();
                    });
                    /*editingCenterService.queryChannelsBySiteid($scope.status.selectedSite.SITEID, platform).then(function(channels) {
                        $scope.status[$scope.status.selectedPlatform].channels = channels;
                        var routerChannelId = $location.search().channelid;
                        $scope.status[$scope.status.selectedPlatform].selectedChnl = (routerChannelId && $location.search().siteid === $scope.status.selectedSite.SITEID) ? $filter('filterBy')(channels, ['CHANNELID'], routerChannelId)[0] : channels[0];
                        defer.resolve();
                    });*/
                }
                return defer.promise;
            }

            function queryChannelsWithoutPlat(platform) {
                var deffer_ = $q.defer();
                editingCenterService.queryChannelsBySiteid($scope.status.selectedSite.SITEID, platform).then(function(data) {
                    $scope.status[$scope.status.selectedPlatform].channels = data.CHILDREN;
                    var routerChannelId = $location.search().channelid;
                    $scope.status[$scope.status.selectedPlatform].selectedChnl = (routerChannelId && $location.search().siteid === $scope.status.selectedSite.SITEID) ? $filter('filterBy')(data.CHILDREN, ['CHANNELID'], routerChannelId)[0] : data.CHILDREN[0];
                    deffer_.resolve(data);
                });
                return deffer_.promise;
            }
            /**
             * [getSelectedNode description] 判断栏目树中的栏目是否被选中
             * @return {[type]} [description]
             */
            $scope.getSelectedNode = function() {
                if (angular.isObject($scope.status[$scope.status.selectedPlatform].selectedChnl)) {
                    return $scope.status[$scope.status.selectedPlatform].selectedChnl;
                } else {
                    return undefined;
                }
            };
            //查询子节点
            $scope.queryNodeChildren = function(node) {
                var platform = $scope.status.platformParam.indexOf($scope.status.selectedPlatform) + 1;
                editingCenterService.queryChildChannel(node, platform).then(function(children) {
                    node.CHILDREN = children;
                });
            };
            /**
             * [setWebSelectedChnl description]设置网站当前选中的栏目
             * @param {[type]} item     [description]  被点击对象
             * @param {[type]} platform [description] 平台：待编，待审，已签发
             */
            $scope.setWebSelectedChnl = function(item, platform) {
                $scope.status[platform].selectedChnl = item;
                if (angular.isObject(item))
                    $state.go("editctr.website." + platform, {
                        channelid: item.CHANNELID,
                    });
                else {
                    $state.go("editctr.website." + platform + "." + item);
                }
            };
            /**
             * [queryWebsiteUtilBtns description]查询预览、碎片化、专题等按钮
             * @return {[type]} [description]
             */
            function queryWebsiteUtilBtns() {
                var params = {
                    serviceid: "mlf_website",
                    methodname: "queryMarksOfChnlBySite",
                    SiteId: $scope.status.selectedSite.SITEID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    angular.forEach(data, function(value, key) {
                        $scope.status.utilBtns[key] = [];
                        $scope.status.utilBtnsFragment = data;
                        for (var i in value) {
                            $scope.status.utilBtns[key].push(value[i].CHANNELID || value[i].SITEID);
                        }
                    });
                });
            }
            /**
             * [channelPreview description]网站栏目预览
             * @param  {[obj]} chl [description]当前栏目信息
             * @return {[type]}     [description]null
             */
            $scope.websiteChannelPreview = function(chl) {
                websiteService.websiteChannelPreview(chl);
                window.event.stopPropagation();
            };
            /**
             * [websiteVisualize description] 专题
             * @param  {[type]} node [description] 栏目
             * @return {[type]}      [description]
             */
            $scope.websiteVisualize = function(node) {
                $state.go("editctr.website.visualize", { channelid: node.CHANNELID });
                window.event.stopPropagation();
            };
            //文件夹管理
            $scope.websiteCloud = function(node, platform) {
                $scope.setWebSelectedChnl(node, platform);
                $state.go("editctr.website." + platform + ".cloud", { channelid: node.CHANNELID });
                window.event.stopPropagation();
            };
            //网站平台切换
            $scope.changeWebPlatform = function(platform) {
                if ($scope.status.selectedPlatform === platform) return;
                $scope.status.selectedPlatform = platform;
                $scope.status[$scope.status.selectedPlatform].isSelected = true;
                if (!$scope.status[platform].channels) {
                    queryChannelsWithoutPlat($scope.status.platformParam.indexOf($scope.status.selectedPlatform) + 1).then(function(channels) {
                        $state.go("editctr.website." + platform, {
                            channelid: $scope.status[platform].selectedChnl.CHANNELID
                        });
                    });
                } else {
                    if (angular.isObject($scope.status[platform].selectedChnl))
                        $state.go("editctr.website." + platform, {
                            channelid: $scope.status[platform].selectedChnl.CHANNELID
                        });
                    else {
                        $state.go("editctr.website." + platform + "." + $scope.status[platform].selectedChnl);
                    }
                }

            };
            /**
             * [setWebSiteSelected description]网站站点切换
             * @param {[type]} site [description]  被选中站点
             */
            $scope.setWebSiteSelected = function(site) {

                if ($scope.status.selectedSite === site) return;
                $scope.status.selectedSite = site;
                getWebSiteAccessAuthority();
                queryChannelsWithoutPlat($scope.status.platformParam.indexOf($scope.status.selectedPlatform) + 1)
                    .then(function(data) {
                        queryWebsiteUtilBtns();
                        if (data.HASCHILDREN === "false") {
                            $scope.status[$scope.status.selectedPlatform].channels = [];
                            return;
                        }
                        $scope.status[$scope.status.selectedPlatform].channels = data.CHILDREN;
                        $scope.status[$scope.status.selectedPlatform].selectedChnl = data.CHILDREN[0];
                        $state.go($state.$current, {
                            siteid: site.SITEID,
                            channelid: data.CHILDREN[0].CHANNELID,
                        });
                    });
                /*queryChannels().then(function(data) {

                });*/
            };

            /**
             * [getIwoAccessAuthority description]获取网站权限
             * @return {[type]} [description] promise
             */
            function getWebSiteAccessAuthority() {
                var params = {
                    serviceid: "mlf_metadataright",
                    methodname: "queryWebSiteOperTypesBySiteId",
                    SiteId: $scope.status.selectedSite.SITEID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        $scope.status.websiteAccessAuthority = globleParamsSet.handlePermissionData(data);
                    });
            }
            /**
             * [websiteFragment description]已签稿的碎片化管理
             * @param  {[type]} node  [description]
             * @param  {[type]} event [description]
             * @return {[type]}       [description]
             */
            $scope.websiteFragment = function(node) {
                $scope.setWebSelectedChnl(node, 'signed');
                var key = node.CHANNELID ? "CHANNELID" : "SITEID",
                    value = node.CHANNELID || node.SITEID;
                var widget = $filter('filterBy')($scope.status.utilBtnsFragment.WIDGET, [key], value)[0];
                $state.go("editctr.website.signed.fragmentManagement", { tempid: widget.TEMPID, objectid: widget.OBJECTID, objecttype: widget.OBJECTTYPE, siteid: node.SITEID, channelid: node.CHANNELID }, { reload: "editctr.website.signed.fragmentManagement" });
                window.event.stopPropagation();
            };
            //初始化站点
            function initSites() {
                var defer = $q.defer();
                editingCenterService.querySitesByMediaType(editingMediatype.website).then(function(data) {
                    $scope.status.sites = data.DATA;
                    $scope.status.isDownImgShow = data.DATA.length > 1 ? true : false;
                    var filteredSite = $filter('filterBy')(data.DATA, ['SITEID'], $location.search().siteid);
                    $scope.status.selectedSite = filteredSite.length > 0 ? filteredSite[0] : data.DATA[0];
                    defer.resolve();
                });
                return defer.promise;
            }
        }
    ]);
