/*Create by cc 2016-09-28*/
"use strict";
angular.module("iWoSbumitModule", ['iWoSubmitServiceModule', "mgcrea.ngStrap.timepicker"]).
controller('iWoSubmitCtrl', ['$scope', '$rootScope', '$timeout', '$q', '$filter', '$modalInstance', 'trsHttpService', 'trsResponseHandle', 'SweetAlert', 'trsspliceString', 'trsconfirm', 'selectedArray', 'iWoSbumitService', "methodname", "editingCenterService", "trsColumnTreeLocationService", function($scope, $rootScope, $timeout, $q, $filter, $modalInstance, trsHttpService, trsResponseHandle, SweetAlert, trsspliceString, trsconfirm, selectedArray, iWoSbumitService, methodname, editingCenterService, trsColumnTreeLocationService) {
    initStatus();
    initData();
    //初始化状态函数
    function initStatus() {
        /**
         * [path description]记录选中路径
         * @type {Object}
         */
        $scope.path = {
            newPath: {},
            pathArray: []
        };
        /**
         * [cur description]记录渠道 站点 报纸等当前选中状态
         * @type {Object}
         */
        $scope.cur = {
            medias: iWoSbumitService.initMediaName(),
            currMedia: {},
            currSite: {},
            currChannel: {},
            currDieci: {}
        };
        /**
         * [status description]各类变量整理
         * @type {Object}
         */
        $scope.status = {
            createDate: new Date().setDate(new Date().getDate() + 1), //见报时间
            treeOptions: iWoSbumitService.initTreeOpition(), //网站树配置
            appTreeOptions: iWoSbumitService.initAppTreeOption(), //app树配置
            mediaType: { //渠道分类
                app: "1",
                website: "2",
                newspaper: "3",
                weixin: "4",
                weibo: "5"
            },
            selectedArr: { //各渠道下被选中的集合
                website: {},
                newspaper: {},
                app: {},
                weixin: {}
            },
            accessAuthority: {}, //渠道权限
        };
        $scope.data = {
            newspaper: {
                dieciList: [], //叠次列表
                banmianList: [], //版面列表
            },
            website: {
                columns: [], //栏目
            },
            app: {
                selectedItem: "", //app被选中值
            },
            weixin: {
                selectedItem: "", //微信被选中值
            },
            selectedNode: {}, //树结构上被选中的节点
            typeOfMedia: { //分类渠道,根据渠道的type饭查渠道名称，避免switchCase
                1: "app",
                2: "website",
                3: "newspaper",
                4: "weixin",
                5: "weibo"
            },
        };
    }
    /**
     * [initData description]初始化默认渠道 
     * @return {[type]} [description]
     */
    function initData() {
        getAccessAuthority().then(function() {
            var params = {
                serviceid: "mlf_mediasite",
                methodname: "queryWebSitesByMediaType",
                MediaType: $scope.cur.currMedia.mediaType
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                if (data.length === 0) return;
                var temp = $scope.cur.currMedia.type.replace(/(\w)/, function(v) {
                    return v.toUpperCase();
                }); //首字母大写
                eval("query" + temp + "()");
            });
        });
    }
    //点击一级站点
    $scope.setCurrMedia = function(media, index) {
        $scope.cur.currMedia = media;
        if ($scope.data[$scope.cur.currMedia.type].lists) return; //请求过后退出
        var temp = media.type.replace(/(\w)/, function(v) {
            return v.toUpperCase();
        }); //首字母大写
        eval("query" + temp + "()");
    };
    /**
     * [queryNewspaper description]查询报纸渠道
     * @return {[type]} [description]
     */
    function queryNewspaper() {
        var params = {
            serviceid: "mlf_mediasite",
            methodname: "queryWebSitesByMediaType",
            MediaType: 3,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.newspaper.lists = data.DATA;
            $scope.data.newspaper.selectedItem = data.DATA[0];
            getDieciList($scope.data.newspaper.selectedItem).then(function(data) {
                getBanmianList();
            });
        });
    }
    /**
     * [getDieciList description]获得报纸叠次列表
     * @param  {[obj]} newspaper [description]报纸站点信息
     * @return {[obj]}           [description]promise
     */
    function getDieciList(newspaper) {
        var deferred = $q.defer();
        $scope.data.newspaper.selectedItem = newspaper;
        var params = {
            serviceid: "mlf_paper",
            methodname: "queryDieCis",
            PaperId: $scope.data.newspaper.selectedItem.SITEID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.newspaper.dieciList = data;
            $scope.cur.currDieci = data[0];
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    /**
     * [getBanmianList description]获得版面列表
     * @return {[type]} [description]null
     */
    function getBanmianList() {
        var params = {
            serviceid: "mlf_paper",
            methodname: "queryCaiBianBanMians",
            PaperId: $scope.data.newspaper.selectedItem.SITEID,
            DieCiId: $scope.cur.currDieci.CHANNELID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.newspaper.banmianList = data;
        });
    }
    /**
     * [queryWebsite description]查询网站渠道
     * @return {[type]} [description]
     */
    function queryWebsite() {
        var params = {
            serviceid: "mlf_mediasite",
            methodname: "queryWebSitesByMediaType",
            MediaType: 2,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.website.lists = data.DATA;
            $scope.data.website.selectedItem = data.DATA[0];
            getColumns($scope.data.website.selectedItem, 'website');
        });
    }
    /**
     * [queryApp description]查询app站点
     * @return {[type]} [description]
     */
    function queryApp() {
        var params = {
            serviceid: "mlf_mediasite",
            methodname: "queryWebSitesByMediaType",
            MediaType: 1,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.app.lists = data.DATA;
            $scope.data.app.selectedItem = data.DATA[0];
            getColumns($scope.data.app.selectedItem, 'app');
        });
    }
    /**
     * [queryWeixin description]查询微信列表
     * @return {[type]} [description]
     */
    function queryWeixin() {
        var params = {
            serviceid: "mlf_mediasite",
            methodname: "queryWebSitesByMediaType",
            MediaType: 4,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data.weixin.lists = data.DATA;
        });
    }
    /**
     * [getColumns description]获得栏目
     * @param  {[obj]} site  [description]站点信息
     * @param  {[str]} type  [description]站点渠道
     * @return {[type]}      [description]
     */
    function getColumns(site, type) {
        var deffer = $q.defer();
        var params = {
            serviceid: "mlf_mediasite",
            methodname: "queryClassifyBySite",
            SiteId: site.SITEID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.data[type].columns = data;
            deffer.resolve(data);
        });
        return deffer.promise;
    }
    /**
     * [selectApp description] 选择APP
     * @param  {[type]} site [description] 当前站点
     * @return {[type]}      [description]
     */
    $scope.selectApp = function(site) {
        $scope.data.app.selectedItem = site;
        $scope.data.channelFilterApp = "";
        getColumns(site, 'app');
    };
    /**
     * [selectSite description]点击网站选择栏目
     * @param  {[obj]} site [description]当前站点信息
     * @return {[type]}      [description]
     */
    $scope.selectWebSite = function(site) {
        $scope.data.website.selectedItem = site;
        $scope.data.channelFilter = "";
        getColumns(site, 'website');
    };
    var webPromise;
    var appPromise;
    /**
     *[getSuggestions description]网站渠道查询栏目
     * @param  {[type]}channelname  [description] 输入栏目名称
     * return {[type]}   null  [description]
     */
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
                SiteId: $scope.data.website.selectedItem.SITEID
            };
            return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                .then(function(data) {
                    return data;
                });
        }, 500);
        return webPromise;
    };
    /**
     * [getAppSuggestions description]app查询栏目
     * @param  {[str]} channelName  [description]输入的查询名称
     * @return {[type]}             [description]
     */
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
                SiteId: $scope.data.app.selectedItem.SITEID
            };
            return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                .then(function(data) {
                    return data;
                });
        }, 500);
        return appPromise;
    };
    $scope.$watch("data.webChannelFilter", function(newValue, oldValue) { //监听网站栏目搜索
        if (angular.isObject(newValue)) {
            watchSuggestions(newValue, 'website');
        }
    });
    $scope.$watch("data.appChannelFilter", function(newValue, oldValue) { //监听app栏目搜索
        if (angular.isObject(newValue)) {
            watchSuggestions(newValue, 'app');
        }
    });
    /**
     * [watchSuggestions description]监听suggestion
     * @param  {[obj]} newValue  [description]监听的新信息
     * @param  {[str]} [varname] [description]渠道分类
     * @return {[type]}          [description]
     */
    function watchSuggestions(newValue, type) {
        //初始化树数据
        getColumns($scope.data[type].selectedItem, type);
        //清空树展开
        $scope.data.expandedTest = [];
        //重新定位树展开位置
        trsColumnTreeLocationService.columnTreeLocation(
            newValue.CHANNELID,
            $scope.data[type].columns,
            $scope.data.selectedNode,
            $scope.data.expandedTest,
            function(tree, array) {
                delete $scope.data[type].columns;
                $scope.data[type].columns = tree;
                $scope.status.selectedArr[type][$scope.data[type].selectedItem.SITEID] = array.pop();
                getSelectedChannel(newValue);
            });
    }
    /**
     * [getDieci description]点击获得报纸站点获得该站点叠次
     * @param  {[type]} newspaper [description]
     * @return {[type]}           [description]
     */
    $scope.getDieci = function(newspaper) {
        getDieciList(newspaper).then(function(data) {
            getBanmianList();
        });
    };
    /**
     * [getBanmian description]点击报纸叠次获得该叠次下的版面
     * @param  {[type]} dieci [description]
     * @return {[type]}       [description]
     */
    $scope.getBanmian = function(dieci) {
        $scope.cur.currDieci = dieci;
        getBanmianList();
    };
    /**
     * [selectWeixin description]选择微信栏目
     * @param  {[obj]} item  [description]栏目信息
     * @return {[type]}      [description]
     */
    $scope.selectWeixin = function(item) {
        $scope.data.weixin.selectedItem = item;
        getSelectedChannel($scope.data.weixin.selectedItem);
    };

    function getSelectedChannel(node) {
        var flag = true;
        $scope.cur.currChannel = node;
        $scope.path.newPath = {
            mediaName: $scope.cur.currMedia.mediaName,
            mediaType: $scope.cur.currMedia.mediaType,
            siteName: $scope.data[$scope.cur.currMedia.type].selectedItem.SITEDESC,
            siteId: $scope.data[$scope.cur.currMedia.type].selectedItem.SITEID,
            channelName: $scope.cur.currChannel.CHNLDESC,
            channelId: $scope.cur.currChannel.CHANNELID,
            params: $scope.cur.currMedia.params
        };
        angular.forEach($scope.path.pathArray, function(value, key) {
            if (value.siteId === $scope.path.newPath.siteId) {
                $scope.path.pathArray[key].channelName = $scope.path.newPath.channelName;
                $scope.path.pathArray[key].channelId = $scope.path.newPath.channelId;
                flag = false;
            }
            if (value.channelId === $scope.path.newPath.channelId) {
                flag = false;
            }
        });
        if (flag === true) {
            $scope.path.pathArray.push($scope.path.newPath);
        }
        setSelectedArrFn($scope.path.newPath.mediaType, node.SITEID, node.CHANNELID);
    }
    //点击三级站点或版面
    $scope.getChannel = function(node) {
        $scope.data.channelFilter = "";
        getSelectedChannel(node);
    };
    /**
     * [setSelectedArrFn description]存贮已选中的渠道
     * @param {[num]} type       [description]渠道对应的值
     * @param {[str]} siteId     [description]选中渠道的站点id
     * @param {[str]} channelId  [description]选中渠道的栏目id
     */
    function setSelectedArrFn(type, siteId, channelId) {
        $scope.status.selectedArr[$scope.data.typeOfMedia[type]][siteId] = channelId;
    }
    /**
     * [delSelectedArrFn description]删除已选中渠道的方法
     * @param  {[obj]} item  [description]选中的渠道
     * @return {[type]}      [description]
     */
    function delSelectedArrFn(item) {
        $scope.status.selectedArr[$scope.data.typeOfMedia[item.mediaType]][item.siteId] = null;
    }
    /**
     * [getAccessAuthority description]获得提交中各渠道的权限
     * @return {[type]} [description]
     */
    function getAccessAuthority() {
        var deferred = $q.defer();
        var status = {};
        editingCenterService.getPermissions().then(function(data) {
            status = data;
            loop: for (var i in status) {
                switch (i) {
                    case "weixin":
                        $scope.status.accessAuthority.weixin = true;
                        $scope.cur.currMedia = $scope.cur.medias[3];
                        break;
                    case 'app':
                        $scope.status.accessAuthority.app = true;
                        $scope.cur.currMedia = $scope.cur.medias[2];
                        break;
                    case "website":
                        $scope.status.accessAuthority.website = true;
                        $scope.cur.currMedia = $scope.cur.medias[1];
                        break;
                    case "newspaper":
                        $scope.status.accessAuthority.newspaper = true;
                        $scope.cur.currMedia = $scope.cur.medias[0];
                        break;
                }
            }
            deferred.resolve(status);
        });
        return deferred.promise;
    }
    /**
     * [showToggle description]点击加载树的子节点
     * @param  {[obj]} node  [description]节点信息
     * @return {[type]}      [description]
     */
    $scope.showToggle = function(node) {
        childrenTree(node);
    };
    /**
     * [childrenTree description]获得子节点
     * @param  {[obj]} node  [description]节点信息
     * @return {[type]}      [description]
     */
    function childrenTree(node) {
        var deffer = $q.defer();
        if (node.HASCHILDREN == "true" && (angular.isUndefined(node.CHILDREN) || node.CHILDREN.length === 0)) {
            var params = {
                "serviceid": "mlf_mediasite",
                "methodname": "queryClassifyByChnl",
                "ChannelId": node.CHANNELID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                node.CHILDREN = data.CHILDREN;
                deffer.resolve(data.CHILDREN);
            });
        }
        return deffer.promise;
    }
    //关闭窗口
    $scope.close = function() {
        $modalInstance.dismiss();
    };
    //删除路径
    $scope.deleteTrack = function(index, path) {
        $scope.path.pathArray.splice(index, 1);
        delSelectedArrFn(path);
    };
    //点击确定
    $scope.confirm = function() {
        var typeParams = {
            papers: [],
            webs: [],
            app: [],
            weChat: [],
        };
        var params = {
            serviceid: "mlf_myrelease",
            methodname: methodname,
            ChnlDocIds: trsspliceString.spliceString(selectedArray, "CHNLDOCID", ","),
            MetaDataIds: trsspliceString.spliceString(selectedArray, "METADATAID", ",")
        };
        //根据pathArray区分提交渠道
        angular.forEach($scope.path.pathArray, function(value, key) {
            typeParams[value.params].push(value.channelId);
        });
        for (var i in typeParams) {
            if (angular.isArray(typeParams[i])) {
                typeParams[i] = typeParams[i] + "";
            }
        }
        params = angular.extend(params, typeParams); //合并参数
        if (params.papers.length > 0) {
            params.PaperPubDate = $filter('date')($scope.status.createDate, "yyyy-MM-dd").toString();
        }
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType("提交成功", "", "success", false, function() {
                $modalInstance.close('request');
            });
        }, function() {
            $modalInstance.close('not');
        });
    };
}]);
