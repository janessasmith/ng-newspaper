"use strict";
/**
 *  Module 取稿模块，
 *
 * Description 必须参数：items:已选文档列表；basicParams:基础参数包括channelname,nodeid,typename
 * ModifyBy cc 2016-10-19
 */
angular.module('takeDraftModule', []).controller('fullTakeDraftCtrl', ['$scope', '$q', '$filter', '$timeout', '$window', '$state', '$modalInstance', 'trsspliceString', 'trsHttpService', 'basicParams', 'isOnlyOne', 'trsconfirm', 'editingCenterService', "trsColumnTreeLocationService",
    function($scope, $q, $filter, $timeout, $window, $state, $modalInstance, trsspliceString, trsHttpService, basicParams, isOnlyOne, trsconfirm, editingCenterService, trsColumnTreeLocationService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.status = {
                mediasArray: [{
                    mediaName: "I我",
                    mediaValue: "iwo",
                }, {
                    mediaName: "纸媒",
                    mediaValue: "newspaper",
                }, {
                    mediaName: "网站",
                    mediaValue: "website",
                }, {
                    mediaName: "APP",
                    mediaValue: "app"
                }, {
                    mediaName: "微信",
                    mediaValue: "weixin"
                }, {
                    mediaName: "微博",
                    mediaValue: "weibo"
                }],
                selectedMedia: {},
                isTitleMoreShow: false,
                iwo: {
                    selectedItem: {
                        key: "iwo",
                        value: "i我",
                        type: "iwo"
                    }
                },
                staticMediaType: {
                    app: 1,
                    website: 2,
                    newspaper: 3,
                    weixin: 4,
                    weibo: 5
                },
                editParams: {
                    metadataid: "",
                    chnldocid: "",
                    status: 0,
                    siteid: "",
                    channelid: "",
                    doctype: 0,  //app状态 
                    platform: 0, //微信状态
                },
                editState: {
                    iwo: {
                        1: "iwonews",
                        2: "iwoatlas",
                    },
                    Paper: {
                        1: "newspapertext",
                        2: "newspaperpic",

                    },
                    Web: {
                        1: "websitenews",
                        2: "websiteatlas",
                    },
                    Wechat: {
                        1: "wxnews",
                        2: "wxnews"
                    },
                    App:{
                        1:"appnews",
                        2:"appatlas"
                    },
                },
                accessAuthority: {
                    iwo: true,
                    app: false,
                    website: false,
                    newspaper: false,
                    weixin: false,
                    weibo: false,
                },

            };
            $scope.data = {
                isOnlyOne: "",
                selectedChannel: [],
                newspaper: {
                    paper: {
                        items: [],
                        selectedItem: {},
                    },
                    dieci: {
                        selectedItem: {},
                    },
                    banmian: {
                        selectedItem: {},
                    },
                    PaperPubDate: ""
                },
                website: {
                    items: [],
                    selectedItem: {},
                    selectedNode: {},
                },
                app: {
                    items: [],
                    selectedItem: {},
                    selectedNode: {},
                    type: {
                        normal: "频道",
                        local: "地市"
                    }
                },
                weixin: {
                    items: [],
                    selectedItem: "",
                },
                weibo: {
                    items: [],
                    selectedItem: "",
                },
                result: {
                    toMy: false,
                    Web: [],
                    Paper: [],
                    App: [],
                },
            };
            //网站树配置开始
            $scope.websiteTreeOptions = {
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
                    return node.HASCHILDREN === "false"; //node.CHILDREN == undefined && node.CHANNELID != undefined;
                }
            };
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

        function initData() {
            $scope.status.selectedMedia = $scope.status.mediasArray[0];
            $scope.data.isOnlyOne = isOnlyOne;
            getSystemTime();
            getAccessAuthority();
        }
        //关闭窗口
        $scope.close = function() {
            $modalInstance.dismiss();
        };
        /**
         * [showToggle description]展开子树
         * @param  {[obj]} node  [description]节点信息
         * @return {[type]}      [description]
         */
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
        /**
         * [getSystemTime description]查询当前系统时间
         */
        function getSystemTime() {
            var params = {
                serviceid: "mlf_fusion",
                methodname: "getServiceTime"
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                var timeStamp = (data.LASTOPERTIME).replace(/-/g, "/");
                var PaperPubDate = new Date(Date.parse(timeStamp));
                PaperPubDate = PaperPubDate.setDate(PaperPubDate.getDate() + 1);
                $scope.data.newspaper.PaperPubDate = PaperPubDate; //PaperPubDate.getFullYear() + "-" + (PaperPubDate.getMonth() + 1) + "-" + (PaperPubDate.getDate()+1);//$filter('date')(timeStampAfter, "yyyy-MM-dd").toString();
            });
        }
        /**
         * [setCurrMedia description]点击渠道加载对应数据
         * @param {[type]} item [description]
         */
        $scope.setCurrMedia = function(item) {
            $scope.status.selectedMedia = item;
            var temp = item.mediaValue.replace(/(\w)/, function(v) {
                return v.toUpperCase();
            }); //首字母大写
            eval("query" + temp + "()");
            //if (item.mediaValue === "newspaper" && $scope.data.newspaper.paper.items.length === 0) queryNewspaper();
        };

        function queryIwo() {}
        /**
         * [queryNewspaper description]获取报纸列表
         * @return {[type]} [description]
         */
        function queryNewspaper() {
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryPagers"
            };
            if ($scope.data.newspaper.paper.items.length > 0) return;
            $scope.loadingNewspaper = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.newspaper.paper.items = data;
                queryNewspaperDieci(data[0]);

            });
        }

        /**
         * [queryNewspaperDieci description] 查询制定报纸叠次
         * @param  {[type]} item [description] 报纸
         * @return {[type]}      [description]
         */
        $scope.queryNewspaperDieci = function(item) {
            queryNewspaperDieci(item);
        };
        /**
         * [queryNewspaperDieci description] 查询制定报纸叠次具体方法
         * @param  {[type]} item [description] 报纸
         * @return {[type]}      [description]
         */
        function queryNewspaperDieci(item) {
            $scope.data.newspaper.paper.selectedItem = item;
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryDieCis",
                "PaperId": item.SITEID
            };
            if (!!item.CHILDREN) {
                $scope.data.newspaper.dieci.selectedItem = item.CHILDREN[0];
                return;
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                item.CHILDREN = data;
                $scope.data.newspaper.dieci.selectedItem = data[0];
                queryNewspaperBanmian($scope.data.newspaper.dieci.selectedItem);
            });
        }
        /**
         *[getSuggestions description]搜索栏目
         * @param  {[type]}channelname  [description] 输入栏目名称
         * return {[type]}   null  [description]
         */
        var webPromise;
        var appPromise;
        $scope.getWebSuggestions = function(channelName) {
            if (channelName === "")
                return;
            if (webPromise) {
                $timeout.cancel(webPromise);
                webPromise = null;
            }
            webPromise = $timeout(function() {
                var params = {
                    serviceid: "mlf_mediasite",
                    methodname: "queryRightClassifyByName",
                    ChannelName: channelName,
                };
                params.SiteId = $scope.data[$scope.status.selectedMedia.mediaValue].selectedItem.SITEID;
                return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                    .then(function(data) {
                        return data;
                    });
            }, 500);
            return webPromise;
        };
        $scope.getAppSuggestions = function(channelName) {
            if (channelName === "")
                return;
            if (appPromise) {
                $timeout.cancel(appPromise);
                appPromise = null;
            }
            appPromise = $timeout(function() {
                var params = {
                    serviceid: "mlf_mediasite",
                    methodname: "queryRightClassifyByName",
                    ChannelName: channelName,
                };
                params.SiteId = $scope.data[$scope.status.selectedMedia.mediaValue].selectedItem.SITEID;
                return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                    .then(function(data) {
                        return data;
                    });
            }, 500);
            return appPromise;
        };
        $scope.$watch("data.webChannelFilter", function(newValue, oldValue) {
            watchSuggestion(newValue);
        });
        $scope.$watch("data.appChannelFilter", function(newValue, oldValue) {
            watchSuggestion(newValue);
        });
        /**
         * [watchSuggestion description]监听suggestion
         * @param  {[obj]} newValue  [description]获得的新值
         * @return {[type]}          [description]
         */
        function watchSuggestion(newValue) {
            if (angular.isObject(newValue)) {
                //初始化树数据
                queryWebsiteTreeBySiteid();
                //清空树展开
                $scope.webExpandedTest = [];
                //重新定位树展开位置
                //getPositionData(newValue.CHANNELID);
                trsColumnTreeLocationService.columnTreeLocation(
                    newValue.CHANNELID,
                    $scope.data[$scope.status.selectedMedia.mediaValue].selectedItem.TREE,
                    $scope.data[$scope.status.selectedMedia.mediaValue].selectedNode,
                    $scope.webExpandedTest,
                    function(tree, array, selectedNode) {
                        delete $scope.data[$scope.status.selectedMedia.mediaValue].selectedItem.TREE;
                        $scope.data[$scope.status.selectedMedia.mediaValue].selectedItem.TREE = tree;
                        $scope.data[$scope.status.selectedMedia.mediaValue].selectedNode = selectedNode;
                        var type=$scope.status.selectedMedia.mediaValue==='website'?'Web':"App";
                        $scope.addSiteToSelectedChnl($scope.data[$scope.status.selectedMedia.mediaValue].selectedNode,type);
                    });
            }
        }
        /**
         * [queryNewspaperBanmian description] 查询报纸的版面
         * @param  {[type]} item [description] 叠次
         * @return {[type]}      [description]
         */
        $scope.queryNewspaperBanmian = function(item) {
            queryNewspaperBanmian(item);
        };
        /**
         * [queryNewspaperBanmian description] 查询报纸的版面具体方法
         * @param  {[type]} item [description] 叠次
         * @return {[type]}      [description]
         */
        function queryNewspaperBanmian(item) {
            $scope.data.newspaper.dieci.selectedItem = item;
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryCaiBianBanMians",
                "PaperId": $scope.data.newspaper.paper.selectedItem.SITEID,
                "DieCiId": item.CHANNELID
            };
            if (!!item.CHILDREN) {
                return;
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                item.CHILDREN = data;
            });
        }
        /**
         * [setNewspaperBanmianStatus description]报纸栏目选择后加入到已选 
         * @param {[type]} item [description]
         */
        $scope.setNewspaperBanmianStatus = function(item) {
            $scope.data.newspaper.banmian.selectedItem = item;
            var site = $scope.data.newspaper.paper.selectedItem;
            var newspaperPath = $scope.status.mediasArray[1].mediaName + ">" + site.SITEDESC + ">" + $scope.data.newspaper.dieci.selectedItem.CHNLDESC + ">" + item.CHNLDESC;
            var newspaperSelected = {
                key: site.SITEID,
                value: newspaperPath,
                type: "Paper",
                id: item.CHANNELID
            };
            refreshSelectedChnl(newspaperSelected, item.CHANNELID);
        };

        $scope.queryTreeBySite = function(item) {
            $scope.data.website.selectedItem = item[0].CHILDREN;
            queryTreeBySite();
        };

        function queryTreeBySite() {
            var params = {
                'serviceid': "mlf_websiteconfig",
                'methodname': "queryClassifyBySite",
                'SiteId': $scope.data.website.selectedItem.SITEID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                $scope.data.website.treeData = [data];
            });
        }
        /**
         * [changeRadioStatus description]切换iwo取稿到个人稿库选中状态并加入到已选集合
         * @return {[type]} [description]
         */
        $scope.changeRadioStatus = function() {
            var index = $scope.data.selectedChannel.indexOf($scope.status.iwo.selectedItem);
            if (index < 0) {
                $scope.data.selectedChannel.push($scope.status.iwo.selectedItem);
            } else {
                return;
            }
            $scope.data.result.toMy = !$scope.data.result.toMy;
        };
        $scope.determineItemInSelectedChnl = function(key) {
            return queryIndexInSelectedChnl(key) > -1 ? true : false;
        };
        /**
         * [queryIndexInSelectedChnl description]按照key 查询已选结合中下标[{key:'',value:''}]
         * @param  {[type]} key [description] key
         * @return {[type]}     [description]
         */
        function queryIndexInSelectedChnl(key) {
            for (var i in $scope.data.selectedChannel) {
                if ($scope.data.selectedChannel[i].key == key) return i;
            }
            return -1;
        }
        /**
         * [refreshSelectedChnl description]更新已选栏目，寻找该KEY，如果找到则替换value,没有找到则加入,同时更新对应渠道ID
         * @param  {[type]} value [description] value
         */
        function refreshSelectedChnl(item, id) {

            /*// var typeIndex = queryIndexInSelectedChnl(item.key);
        // var resultIndex = $scope.data.result[item.type].indexOf(id);
       //f (index > -1) {
            //$scope.data.selectedChannel.splice(index, 1);
            // $scope.data.result[item.type].splice(resultIndex, 1);
        } else {
            //$scope.data.selectedChannel.splice(typeIndex, 1);
            $scope.data.selectedChannel.push(item);
            $scope.data.website.items.push(item);
            //$scope.data.result[item.type].push(id);
        }*/
            /*********************************YOU*************************************/
            // var index = queryIndexInSelectedChnl(item.key),
            //     idIndex = $scope.data.result[item.type].indexOf(id);
            // if (index > -1) {
            //     if ($scope.data.selectedChannel[index].value == item.value) {
            //         $scope.data.selectedChannel.splice(index, 1);
            //         $scope.data.result[item.type].splice(idIndex, 1);
            //     } else {
            //         $scope.data.selectedChannel[index].value = item.value;
            //         $scope.data.result[item.type][idIndex] = id;
            //     }
            // } else {
            //     $scope.data.selectedChannel.push(item);
            //     $scope.data.result[item.type].push(id);

            // }
            var index = queryIndexInSelectedChnl(item.key),
                idIndex = $scope.data.result[item.type].indexOf(id);
            if (index > -1) {
                if ($scope.data.selectedChannel[index].value == item.value) return;
                $scope.data.selectedChannel[index].value = item.value;
                $scope.data.selectedChannel[index].id = item.id;
                // $scope.data.result[item.type][idIndex] = id;
            } else {
                $scope.data.selectedChannel.push(item);
                // $scope.data.result[item.type].push(id);

            }
            // updateResult(item, id);
        }
        /**
         * [updateResult description] 更新已选的ID
         * @param  {[type]} item [description] item.type是哪个平台
         * @param  {[type]} id   [description] 已选栏目ID
         */
        function updateResult(item, id) {
            var ids = $scope.data.result[item.type];
            var index = ids.indexOf(id);
            if (index > -1)
                ids.splice(index, 1);
            else {
                ids.push(id);
            }
        }
        /**
         * [removeIwoChanel description]从已选结集合中删除改对象
         * @param  {[type]} index [description] 在结合中的下标
         * @return {[type]}       [description]
         */
        $scope.removeIwoChanel = function(index) {
            if ($scope.data.selectedChannel[index].key == "iwo") $scope.data.result.toMy = false;
            $scope.data.selectedChannel.splice(index, 1);

        };


        /**
         * [queryWebsite description]查询网站站点列表
         * @return {[type]} [description]
         */
        function queryWebsite() {
            if ($scope.data.website.items.length > 0) return;
            var params = {
                serviceid: 'mlf_mediasite',
                methodname: 'queryWebSitesByMediaType',
                MediaType: $scope.status.staticMediaType.website,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $scope.data.website.items = data.DATA;
                $scope.data.website.selectedItem = data.DATA[0];
                setSelectedWebsite(data.DATA[0]);
            });
        }
        /**
         * [setSelectedWebsite description]选择网站内的站点
         * @param {[type]} item [description]
         */
        $scope.setSelectedWebsite = function(item) {
            setSelectedWebsite(item);
        };
        /**
         * [setSelectedWebsite description]选择网站内的站点实体方法
         * @param {[type]} item [description]
         */
        function setSelectedWebsite(item) {
            $scope.data.website.selectedItem = item;
            queryWebsiteTreeBySiteid();
        }
        /**
         * [queryWebsiteTreeBySiteid description]查询当前已选站点的栏目树
         * @return {[type]} [description]
         */
        function queryWebsiteTreeBySiteid() {
            if (!!$scope.data[$scope.status.selectedMedia.mediaValue].selectedItem.TREE) return;
            var params = {
                'serviceid': "mlf_mediasite",
                'methodname': "queryClassifyBySite",
                'SiteId': $scope.data[$scope.status.selectedMedia.mediaValue].selectedItem.SITEID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                $scope.data[$scope.status.selectedMedia.mediaValue].selectedItem.TREE = data;
            });
        }
        /**
         * [addWebSiteToSelectedChnl description]点击网站栏目节点，刷新已选栏目集合
         * @param {[type]} node [description]
         */
        $scope.addSiteToSelectedChnl = function(node, type) {
            if (!node.CHNLDESC) return false;
            //$scope.data.website.selectedNode[node.SITEID] = node;
            var nodePath = {
                key: node.SITEID,
                // value: $scope.status.mediasArray[2].mediaName + ">" + $scope.data.website.selectedItem.SITEDESC + ">" + node.CHNLDESC,
                type: type,
                id: node.CHANNELID
            };
            var siteNmae = type === 'Web' ? $scope.status.mediasArray[2].mediaName : $scope.status.mediasArray[3].mediaName;
            var chanName = type === 'Web' ? $scope.data.website.selectedItem.SITEDESC : $scope.data.app.selectedItem.SITEDESC;
            nodePath.value = siteNmae + ">" + chanName + ">" + node.CHNLDESC;
            refreshSelectedChnl(nodePath, node.CHANNELID);
        };
        /**
         * [queryApp description]查询APP栏目树，并构造左侧列表
         * @return {[type]} [description]
         */
        function queryApp() {
            var params = {
                serviceid: "mlf_mediasite",
                methodname: "queryWebSitesByMediaType",
                MediaType: 1,
            };
            if ($scope.data.app.items.length > 0) return;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.app.items = data.DATA;
                if (data.DATA.length > 0) {
                    $scope.data.app.selectedItem = data.DATA[0];
                    queryAppChannelsBySite(data.DATA[0]);
                }
            });
        }
        /**
         * [queryAppChannelsBySite description]查询app的栏目
         * @param  {[obj]} site  [description]站点信息
         * @return {[type]}      [description]
         */
        function queryAppChannelsBySite(site) {
            if ($scope.data.app.selectedItem.TREE) return;
            var params = {
                serviceid: "mlf_mediasite",
                methodname: "queryClassifyBySite",
                siteid: site.SITEID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                $scope.data.app.selectedItem.TREE = data;
            });
        }
        /**
         * [setAppSelectedItem description]左侧切换
         * @param {[type]} item [description]
         */
        $scope.setAppSelectedItem = function(item) {
            $scope.data.app.selectedItem = item;
            queryAppChannelsBySite(item);

        };
        /**
         * [queryWeibo description]查询微信
         * @return {[type]} [description]
         */
        function queryWeixin() {
            if ($scope.data.weixin.items.length > 0) return;
            var params = {
                serviceid: "mlf_mediasite",
                methodname: "queryWebSitesByMediaType",
                MediaType: 4,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.weixin.items = data.DATA;
            });
        }
        /**
         * [setSelectedWeixin description]选择微信站点
         * @param {[type]} item [description]
         */
        $scope.setSelectedWeixin = function(item) {
            $scope.data.weixin.selectedItem = item;
            var weixinSelected = {
                id: item.CHANNELID,
                value: "微信>" + item.CHNLDESC,
                type: "Wechat",
            };
            $scope.data.selectedChannel.push(weixinSelected);
            $scope.data.selectedChannel = $filter('unique')($scope.data.selectedChannel, 'id');
        };
        /**
         * [queryWeibo description]查询微博栏目 
         * @return {[type]} [description]
         */
        function queryWeibo() {
            if ($scope.data.weibo.items.length > 0) return;
            var params = {
                serviceid: "mlf_mediasite",
                methodname: "queryWebSitesByMediaType",
                MediaType: 5,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.weibo.items = data.DATA;
            });
        }
        /**
         * [setSelectedWeibo description]选择微博栏目
         * @param {[type]} item [description]
         */
        $scope.setSelectedWeibo = function(item) {
            $scope.data.weibo.selectedItem = item;
            var weiboSelected = {
                id: item.ACCOUNTID,
                value: "微博>" + item.ACCOUNTNAME,
                type: "Weibo",
            };
            $scope.data.selectedChannel.push(weiboSelected);
            $scope.data.selectedChannel = $filter('unique')($scope.data.selectedChannel, 'id');
        };
        $scope.editLater = function() {
            saveDraft().then(function() {
                $scope.loadingPromise = trsconfirm.alertType("取稿成功！", "", "success", false, function() {
                    $modalInstance.close();
                });
            });
        };
        $scope.editNow = function() {
            saveDraft().then(function(data) {
                setEditParams(data);
                previewNewspaper(data);
                /*if ($scope.data.selectedChannel[0].type === "Paper") previewNewspaper();
                $state.go($scope.status.editState[$scope.data.selectedChannel[0].type], $scope.dtatus.editParams);*/
            });

        };

        function setEditParams(data) {
            $scope.status.editParams.chnldocid = data.REPORTS[0].CHNLDOCID;
            $scope.status.editParams.channelid = $scope.data.selectedChannel[0].type == "Web" ? $scope.data.website.selectedNode.CHANNELID : 0;
            // $scope.status.editParams.channelid = $scope.data.selectedChannel[0].type == "Web" ? $scope.data.website.selectedNode[$scope.data.selectedChannel[0].key].CHANNELID : 0;
            $scope.status.editParams.metadataid = data.REPORTS[0].METADATAID;
            $scope.status.editParams.metadata = data.REPORTS[0].METADATAID;
            $scope.status.editParams.siteid = $scope.data.selectedChannel[0].key;
            $scope.status.editParams.paperid = $scope.data.selectedChannel[0].key;
        }

        function previewNewspaper(result) {
            var params = {
                serviceid: "mlf_paperset",
                methodname: "findPaperById",
                SiteId: $scope.data.newspaper.paper.selectedItem.SITEID
            };
            if (!$scope.data.newspaper.paper.selectedItem.SITEID) {
                $window.open($state.href($scope.status.editState[$scope.data.selectedChannel[0].type][result.REPORTS[0].DOCTYPE], $scope.status.editParams), '_blank');

                //$state.go($scope.status.editState[$scope.data.selectedChannel[0].type][result.REPORTS[0].DOCTYPE], $scope.status.editParams);
                $modalInstance.close();
            } else {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.status.editParams.newspapertype = data.ISDUOJISHEN == '0' ? 2 : 1;
                    $window.open($state.href($scope.status.editState[$scope.data.selectedChannel[0].type][result.REPORTS[0].DOCTYPE], $scope.status.editParams), '_blank');
                    //$state.go($scope.status.editState[$scope.data.selectedChannel[0].type][result.REPORTS[0].DOCTYPE], $scope.status.editParams);
                    $modalInstance.close();
                });
            }
        }
        //保存
        function saveDraft() {
            var deferred = $q.defer();
            var pubDate = new Date($scope.data.newspaper.PaperPubDate);
            pubDate = pubDate.getFullYear() + "-" + (pubDate.getMonth() + 1) + "-" + pubDate.getDate();
            var params = {
                'PaperPubDate': pubDate
            };
            params = angular.extend(params, basicParams);
            params = angular.extend(params, arrangeParams());
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                deferred.resolve(data);
            }, function() {
                $modalInstance.dismiss();
            });
            return deferred.promise;
        }
        //把选择数组转换成参数
        function arrangeParams() {
            var params = {
                "ToMy": false,
                "Paper": [],
                "Web": [],
                "App": [],
                "Wechat": [],
                'Weibo': [],
            };
            angular.forEach($scope.data.selectedChannel, function(value, key) {
                if (value.type == 'iwo') {
                    params.ToMy = true;
                } else {
                    params[value.type].push(value.id);
                }
            });
            for (var i in params) {
                if (angular.isArray(params[i])) params[i] = params[i] + "";
            }
            return params;
        }
    }
]);
