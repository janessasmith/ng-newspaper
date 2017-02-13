"use strict";
/**
 * Created by MRQ on 2016/1/18.
 */
angular.module("reserveModalModule", []).controller("reserveModalCtrl", ['$scope', '$q', '$modalInstance', '$timeout', 'trsHttpService', 'trsconfirm', 'items', '$filter', 'editingCenterService', 'trsColumnTreeLocationService',
    function($scope, $q, $modalInstance, $timeout, trsHttpService, trsconfirm, items, $filter, editingCenterService, trsColumnTreeLocationService) {
        var selectChanel = {},
            ChnlDocIds = "";
        var now = new Date();
        $scope.PaperPubDate = now.setDate(now.getDate() + 1);
        $scope.selectChanel = selectChanel;
        $scope.Delay = 1;
        //初始化数据
        initStatus();
        initData();

        // 切换tab选型卡
        $scope.setCurrMedia = function(media) {
            $scope.currMedia = media;
        };

        //关闭窗口
        $scope.close = function() {
            $modalInstance.dismiss();
        };
        //关闭窗口
        $scope.confirm = function() {
            $modalInstance.dismiss();
        };

        $scope.changeRadioStatus = function() {
            // selectChanel.ToMy.isShow = !selectChanel.ToMy.isShow;
            selectChanel.ToMy = {
                isShow: true,
                label: $scope.mediasArray[0].mediaName
            };
        };
        $scope.changeSingleRadio = function(node) {
            selectChanel.Web = {
                label: $scope.mediasArray[2].mediaName + ">" + $scope.selectCollect.websiteSiteItem.SITEDESC + ">" + node.CHNLDESC,
                isShow: true,
                item: node
            };
        };
        $scope.selectPaperItem = function(item, index) {
            $scope.selectCollect.selectCaiBian = index;
            selectChanel.Paper = {
                label: $scope.mediasArray[1].mediaName + ">" + $scope.NewspaperData[$scope.selectCollect.selectNewspaper].SITEDESC + ">" + $scope.NewspaperDieCiData[$scope.selectCollect.selectDieCi].CHNLDESC + ">" + item.CHNLDESC,
                isShow: true,
                item: item
            };
        };
        $scope.chooseChannel = function(node) {
            $scope.slectedChannel = node;
        };
        //初始化数据
        function initData() {
            requestWebsiteSite();
            requestNewspaper();
            getAccessAuthority();
        }

        function initStatus() {
            //当前选项卡
            $scope.currMedia = 1;
            //标题列表是否出现
            $scope.isTitleMoreShow = false;
            $scope.status = {
                accessAuthority: {
                    iwo: true,
                    app: false,
                    website: false,
                    newspaper: false
                },
            };
            //选项卡初始化
            $scope.mediasArray = [{
                    mediaName: "I我",
                    mediaType: 1,
                    mediaValue: "iwo"
                }, {
                    mediaName: "纸媒",
                    mediaType: 2,
                    mediaValue: "newspaper",
                }, {
                    mediaName: "网站",
                    mediaType: 3,
                    mediaValue: "website"
                }
                // , {
                //     mediaName: "APP",
                //     mediaType: 4
                // }
            ];
            $scope.websiteSiteParams = {
                serviceid: 'mlf_mediasite',
                methodname: 'queryWebSitesByMediaType',
                MediaType: 2
            };
            $scope.webExpandedTest = [];
            $scope.NewspaperParams = {
                "serviceid": "mlf_paper",
                "methodname": "queryPagers"
            };
            $scope.selectCollect = {
                'websiteSite': '',
                'selectNewspaper': 0,
                'selectDieCi': 0,
                "selectCaiBian": ''
            };

            var channel = "",
                depart = "",
                totalWords = 0,
                docIds = "",
                title = ""
            angular.forEach(items, function(n, i) {
                channel += "," + n.DOCCHANNEL;
                depart += "," + n.ZB_SOURCE_SITE;
                docIds += "," + n.ZB_GUID;
                totalWords += Number(n.TXS);
                n.DOCTITLE = n.DOCTITLE || n.TITLE; //共享稿库和其他几个列表返回字段不同
            });
            title = items.length > 1 ? "多篇提交" : items[0].DOCTITLE;

            $scope.selectDocsInfo = {
                channel: channel.substr(1),
                depart: depart.substr(1),
                size: items.length,
                totalWords: totalWords,
                title: title,
                items: items
            };
            ChnlDocIds = docIds.substr(1);
            // selectChanel.Paper = {};
            // selectChanel.Web = {};
            // selectChanel.APP = {};
            // selectChanel.ToMy = {
            //     isShow: false
            // };
        }
        /**
         * [getAccessAuthority description]判断渠道下权限
         * @return {[type]} [description]
         */
        function getAccessAuthority() {
            var deferred = $q.defer();
            editingCenterService.getPermissions().then(function(data) {
                loop: for (var i in data) {
                    $scope.status.accessAuthority[i] = true;
                }
                deferred.resolve($scope.status.accessAuthority);
            });
            return deferred.promise;
        }
        $scope.sendTimeSigned = function() {
            var timeSigned = $filter('date')($scope.PaperPubDate, "yyyy-MM-dd").toString();
            $modalInstance.close(timeSigned);
        };
        /**
         *[getSuggestions description]搜索栏目
         * @param  {[type]}channelname  [description] 输入栏目名称
         * return {[type]}   null  [description]
         */
        var promise;
        $scope.getSuggestions = function(channelName) {
            if (channelName === "")
                return;
            if (promise) {
                $timeout.cancel(promise);
                promise = null;
            }
            promise = $timeout(function() {
                var params = {
                    serviceid: "mlf_mediasite",
                    methodname: "queryRightClassifyByName",
                    ChannelName: channelName,
                    SiteId: $scope.selectCollect.websiteSite
                };
                return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                    .then(function(data) {
                        return data;
                    });
            }, 500);
            return promise;
        };
        $scope.$watch("data.channelFilter", function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
                trsColumnTreeLocationService.columnTreeLocation(
                    newValue.CHANNELID,
                    $scope.websiteTreeData,
                    $scope.selectedNode,
                    $scope.webExpandedTest,
                    function(tree, array, selectedNode) {
                        $scope.selectedNode = selectedNode;
                        $scope.showSelected($scope.selectedNode);
                    });
            }
        });
        //树配置开始
        $scope.treeOptions = {
            nodeChildren: "CHILDREN",
            dirSelectable: true,
            allowDeselect: false,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "take-draft-tree-label-sel"
            },
            isLeaf: function(node) {
                return node.CHILDREN == undefined;
            }
        };
        //折叠时触发函数
        $scope.showToggle = function(node) {
            if (node.HASCHILDREN === "false" || (angular.isDefined(node.CHILDREN) && node.CHILDREN.length > 0))
                return;
            var params = {
                serviceid: "mlf_mediasite",
                methodname: "queryClassifyByChnl",
                ChannelId: node.CHANNELID,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                .then(function(data) {
                    node.CHILDREN = data.CHILDREN;
                });
        };
        //选中时触发函数
        $scope.showSelected = function(node) {
            if (!node.CHNLDESC) return false;
            selectChanel.Web = {
                label: $scope.mediasArray[2].mediaName + ">" + $scope.selectCollect.websiteSiteItem.SITEDESC + ">" + (node.CHNLDESC || node.SITEDESC),
                isShow: true,
                item: node
            };
        };
        //请求网站站点列表
        function requestWebsiteSite(callback) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.websiteSiteParams, 'post').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.websiteSiteData = data.DATA;
                    $scope.selectCollect.websiteSite = $scope.websiteSiteData[0].SITEID;
                    $scope.selectCollect.websiteSiteItem = $scope.websiteSiteData[0];
                    requestWebTree($scope.selectCollect.websiteSite);
                }
            });
        }
        //请求网站的树
        $scope.requestWebsiteTree = function(item) {
            if ($scope.selectCollect.websiteSite != item.SITEID) {
                $scope.selectCollect.websiteSite = item.SITEID;
                $scope.selectCollect.websiteSiteItem = item;
                requestWebTree(item.SITEID);
            }
        };

        function requestWebTree(siteId, callback) {
            var params = {
                'serviceid': "mlf_websiteconfig",
                'methodname': "queryClassifyBySite",
                'SiteId': siteId
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.websiteTreeData = data;
                    //ExpandedNodes($scope.webExpandedTest, $scope.websiteTreeData);
                }
            });
        }
        //展开的树
        function ExpandedNodes(expandedTest, dataForTheTree) {
            expandedTest = [];
            expandedTest.push(dataForTheTree[0]);
        }
        //请求媒体列表
        function requestNewspaper(callback) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.NewspaperParams, 'post').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.NewspaperData = data;
                    requestNewspaperDieCi($scope.NewspaperData[0].SITEID)
                }
            });
        }
        //请求叠次报纸
        $scope.requestNewspaperDieCi = function(siteId, index) {
            if ($scope.selectCollect.selectNewspaper != index) {
                $scope.selectCollect.selectNewspaper = index;
                $scope.selectCollect.selectDieCi = 0;
                requestNewspaperDieCi(siteId);
            }
        };

        function requestNewspaperDieCi(siteId, callback) {
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryDieCis",
                "PaperId": siteId
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.NewspaperDieCiData = data;
                    requestNewspaperCaiBianFn(siteId, $scope.NewspaperDieCiData[0] && $scope.NewspaperDieCiData[0].CHANNELID)
                }
            });
        }
        //请求采编版面列表
        $scope.requestNewspaperCaiBian = function(siteId, channelId, index) {
            $scope.selectCollect.selectDieCi = index;
            requestNewspaperCaiBianFn(siteId, channelId);
        };

        function requestNewspaperCaiBianFn(siteId, channelId) {
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryCaiBianBanMians",
                "PaperId": siteId,
                "DieCiId": channelId
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                if (data.length < 1) {
                    $scope.NewspaperCaiBianData = 0;
                } else {
                    $scope.NewspaperCaiBianData = data;
                    $scope.selectCollect.selectCaiBian = '';
                }
            });
        }
        //判断值的有效性
        function RegData(sendObj) {
            var delay = /^[1-9]\d*$/; //正整数
            if (sendObj.Delay && delay.test(sendObj.Delay)) {
                return true;
            }
        }

        // 确定
        $scope.sendInfo = function() {

            var sendObj = {};
            for (var name in selectChanel) {
                if (selectChanel[name].isShow) {
                    if (name == "ToMy") {
                        sendObj[name] = true;
                    } else if (name == "Paper") {
                        sendObj[name] = selectChanel[name].item.CHANNELID;
                        sendObj.PaperPubDate = $scope.PaperPubDate && $filter('date')($scope.PaperPubDate, "yyyy-MM-dd").toString();
                    } else if (name == "Web") {
                        sendObj[name] = selectChanel[name].item.CHANNELID;
                    }
                }
            }
            sendObj.items = items;
            sendObj.Delay = $scope.Delay;
            if (RegData(sendObj)) {
                $modalInstance.close(sendObj);
            }
        };

        $scope.removeChannel = function(item) {
            item.isShow = false;
        };

        //是否选了渠道
        $scope.hasSelected = function() {
            var sendObj = {};
            for (var name in selectChanel) {
                if (selectChanel[name].isShow) {
                    if (name == "ToMy") {
                        sendObj[name] = true;
                    } else if (name == "Paper") {
                        sendObj[name] = selectChanel[name].item.CHANNELID;
                        sendObj.PaperPubDate = $scope.PaperPubDate && $filter('date')($scope.PaperPubDate, "yyyy-MM-dd").toString();
                    } else if (name == "Web") {
                        sendObj[name] = selectChanel[name].item.CHANNELID;
                    }
                }
            }
            var empty = true;
            for (var i in sendObj) {
                empty = false;
                break;
            }
            return empty;
        };
    }
]);
