'use strict';
angular.module("resourceCenterLeftModule", []).
controller("resourceCenterLeftCtrl", function($scope, $state, $timeout, resourceCenterService, trsHttpService, leftService, trsconfirm, cbCustomService) {
    var applyType = leftService.getCurChannel(),
        channelName = leftService.resNavValue[applyType];
    var typeName = leftService.getParamValue('typename');
    var modalid = leftService.getParamValue('modalid');
    var nodeid = leftService.getParamValue("nodeid");
    var nodename = leftService.getParamValue("nodename");
    var contentType;
    var currHref = window.location.href;
    var timeFirst = null; //一级分类定时器
    var timeSecond = null; //二级分类定时器
    initStatus();
    /** [initStatus 初始化状态] */
    function initStatus() {
        $scope.curdictNum = nodeid;
        $scope.setUsual = false;
        $scope.leftList = [];
        $scope.isdataLoaded = false;

        $scope.isCbLeft = false;


        $scope.isShowPreview = currHref.indexOf('digital/preview') < 0 ? false : true;
        $scope.isArea = typeName == "area" ? true : false;
        $scope.isSzb = typeName == 'szb' ? true : false;
        contentType = {
            "73": 1,
            "37": 2,
            "38": 3,
            "39": 4
        };
        setCurLeftTemplate();
        loadData();
    }
    /** [loadData 加载数据] */
    function loadData() {
        //川报修改(为了图片库和共享稿库的三级导航统一)
        if (channelName == "gxgk" || channelName == "tpg") {
            queryMyCustoms(function(data) {
                $scope.customList = data && data.DATA;
                $scope.extraShow = modalid == 37 ? true : false;
                loadWCMData();
            });
        }
        // 川报修改
        else if (channelName == "xhsg") {
            $scope.isCbLeft = true;
            cbXlfl();

        } else {
            $scope.extraShow = false;
            $scope.isCbLeft = false;
            loadBigData();
        }
    }

    // 川报修改
    function cbXlfl() {
        var params = {
            "serviceid": "mlf_xhsgsource",
            "methodname": "queryLineClassifys"
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.cbLeft = [{
                LINECLASSFYID: "",
                LINECLASSFYNAME: "全部线路"
            }];
            $scope.cbLeft = $scope.cbLeft.concat(data);
            $scope.isdataLoaded = true;
            var arr = [];
            angular.forEach($scope.cbLeft, function(value, key) {
                arr.push(value);
            });
            $scope.cbLeftCur = arr[0].LINECLASSFYID;
        });
    }
    // 川报修改
    $scope.changeMainLists = function(source) {
        var id = source.LINECLASSFYID;
        $scope.cbLeftCur = source.LINECLASSFYID;
        $state.go("resourcectrl.xinhua.resource", {
            id: id
        });
    };

    /** 加载父级列表 */
    function loadWCMData() {
        $scope.isdataLoaded = false;
        if (typeName) {
            loadBigData();
        } else {
            if (modalid) {
                var params = {
                    serviceid: "mlf_releaseSource",
                    methodname: "queryMetaCategorysByModalId",
                    Modalid: modalid
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        $scope.leftList = data;
                        $scope.isdataLoaded = true;
                        if (data.length && angular.isArray(data)) {
                            $scope.leftList[0].isOpen = true;
                            loadWCMSubData(data[0], true);
                        }
                    });
            }
        }
    };
    /** 加载子集数据wcm */
    function loadWCMSubData(item, temp) {
        if (item.CHILDREN) return false;
        var params = {
            serviceid: "mlf_releaseSource",
            methodname: "queryMetaCategorysOfResource",
            MetaCategoryId: item.METACATEGORYID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
            .then(function(data) {
                if (data.length) {
                    item.CHILDREN = data;
                    if (temp) {
                        var rd = Math.random(0, 1) * 100;
                        $state.go($state.current.name, {
                            typename: typeName,
                            modalid: modalid,
                            nodeid: nodeid || data[0].METACATEGORYID,
                            nodename: nodename || data[0].CATEGORYNAME
                        });
                        $scope.curdictNum = nodeid || data[0].METACATEGORYID;
                    }
                }
            });
    }
    /** 加载一级数据big data */
    function loadBigData() {
        $scope.isdataLoaded = false;
        if (typeName == "area") {
            loadFormatArea();
        } else {

            resourceCenterService.getBase({
                channelName: channelName,
                typeName: typeName,
                containParent: false,
                level: typeName == 'szb' ? 1 : 2
            }).then(function(data) {
                if (data && angular.isArray(data) && data.length) {
                    var nodeId;
                    angular.forEach(data, function(n, i) {
                        n.CATEGORYNAME = n.dictName;
                        n.isOpen = false;
                        //"全部文字"改为"------【全部文字】------"  且加底色
                        //"全部图片"改为"------【全部图片】------"  且加底色
                        if (n.id == 'navigation_001014' || n.id == 'navigation_001015') {
                            n.CATEGORYNAME = '-------【' + n.CATEGORYNAME + '】-------';
                            n.all_font_color = 'all_font_color';
                        }
                    });
                    $scope.leftList = data;
                    $scope.isdataLoaded = true;
                    $scope.curdictNum = "";

                    if (data[0].hasChildren == "true" && data[0].CHILDREN) {
                        nodeId = data[0].CHILDREN[0].id;
                        data[0].isOpen = true;
                    } else {
                        //新华社稿默认选中【通稿新闻路线】
                        if (data[1] && data[1].id == 'navigation_001011') {
                            nodeId = nodeId || data[1].id;
                            nodename = nodename || data[1].dictName;
                        } else {
                            nodeId = data[0].id;
                        }
                    }

                    var rd = Math.random(0, 1) * 100;
                    var url = $state.current.name == "resourcectrl.digital.preview" ? "resourcectrl.digital.resource" : $state.current.name;
                    $state.go(url, {
                        typename: typeName,
                        modalid: modalid,
                        nodeid: nodeid || nodeId,
                        nodename: nodename || data[0].dictName
                    });
                    $timeout(function() {
                        $scope.curdictNum = nodeid || nodeId;
                    });
                }
            });
        }
    }
    /** 加载子集 big data */
    function loadSubBigData(item) {
        if (item.hasChildren == "true" && !item.CHILDREN) {
            resourceCenterService.getBase({
                channelName: channelName,
                typeName: typeName,
                containParent: false,
                parentId: item.id
            }).then(function(data) {
                if (angular.isArray(data) && data.length) {
                    item.CHILDREN = data;
                    angular.forEach(data, function(n, i) {
                        n.CATEGORYNAME = n.dictName;
                    });
                    var curItem = item.CHILDREN[0];
                    var rd = Math.random(0, 1) * 100;
                    $scope.curdictNum = curItem.id;
                    var url = $state.current.name;
                    if ($scope.isShowPreview && url == 'resourcectrl.digital.resource') url = 'resourcectrl.digital.preview';
                    // if (url.split('.').length == 4 && (url.split('.')[3] == 'detail')) url = url.substring(0, url.lastIndexOf('.'));
                    $state.go(url, {
                        typename: typeName,
                        modalid: modalid,
                        nodeid: curItem.id,
                        nodename: curItem.dictName
                    });
                }
            });
        }
    }
    /** 加载区域 */
    function loadFormatArea() {
        var zheAreaparams = {
            "typeName": "area",
            "parentId": "area_001020"
        };
        var areaparams = {
            "typeName": "area",
            "parentId": "area_001",
            "excludeId": 'area_001020'
        };
        var extraAreaparams = {
            "typeName": "area",
            "excludeId": 'area_001'
        };

        function loadZhe(obj) {
            // obj.containParent = false;
            obj.channelName = channelName;
            resourceCenterService.getBase(obj)
                .then(function(data) {
                    if (data && angular.isArray(data) && data.length) {
                        angular.forEach(data, function(n, i) {
                            n.CATEGORYNAME = n.dictName;
                        });

                        $scope.isdataLoaded = true;
                        data[0].isOpen = true;
                        $scope.leftList = data;

                        if (data[0].CHILDREN && !nodeid) {
                            var curItem = data[0].CHILDREN[0];
                            var rd = Math.random(0, 1) * 100;
                            $scope.curdictNum = curItem.id;
                            $state.go($state.current.name, {
                                typename: typeName,
                                modalid: modalid,
                                nodeid: curItem.id,
                                nodename: curItem.dictName
                            });
                            //川报修改()
                            if (channelName == "gxgk" || channelName == "tpg") {
                                var ct = contentType[modalid];
                                angular.forEach($scope.customList, function(m, j) {
                                    angular.forEach(data[0].CHILDREN, function(value, key) {
                                        if ((m.CUSTOMTYPE == ct) && (value.METACATEGORYID == m.CUSTOMID || value.id == m.CUSTOMID)) {
                                            value.custom = true;
                                        }
                                    });
                                });
                            }
                        }

                        loadAreaParams(areaparams);
                    }
                });
        }

        function loadAreaParams(obj) {

            obj.channelName = channelName;
            resourceCenterService.getBase(obj)
                .then(function(data) {
                    if (data && angular.isArray(data) && data.length) {
                        data[0].CATEGORYNAME = "全国";
                        $scope.leftList.push(data[0]);
                        loadExtra(extraAreaparams);
                        if ((channelName == "gxgk" || channelName == "tpg") && data[0].CHILDREN) {
                            var ct = contentType[modalid];
                            angular.forEach($scope.customList, function(m, j) {
                                angular.forEach(data[0].CHILDREN, function(value, key) {
                                    if ((m.CUSTOMTYPE == ct) && (value.METACATEGORYID == m.CUSTOMID || value.id == m.CUSTOMID)) {
                                        value.custom = true;
                                    }
                                });
                            });
                        }
                    }
                });
        }

        function loadExtra(obj) {

            obj.channelName = channelName;
            resourceCenterService.getBase(obj)
                .then(function(data) {
                    if (data && angular.isArray(data) && data.length) {
                        angular.forEach(data, function(n, i) {
                            n.CATEGORYNAME = n.dictName;
                        })
                        $scope.leftList.push({
                            CATEGORYNAME: "海外",
                            CHILDREN: data
                        });
                        //川报修改()
                        if ((channelName == "gxgk" || channelName == "tpg") && data[0].CHILDREN) {
                            var ct = contentType[modalid];
                            angular.forEach($scope.customList, function(m, j) {
                                angular.forEach(data[0].CHILDREN, function(value, key) {
                                    if ((m.CUSTOMTYPE == ct) && (value.METACATEGORYID == m.CUSTOMID || value.id == m.CUSTOMID)) {
                                        value.custom = true;
                                    }
                                });
                            });
                        }
                    }
                });
        }
        return function() {
            loadZhe(zheAreaparams);
        }();
    }
    /** 选择当前左侧的模版 */
    function setCurLeftTemplate() {
        var tpl3Array = ['website', 'weixin', 'weibo'];
        $scope.curTpl = channelName == "iwo" ? "tpl1" : tpl3Array.indexOf(typeName) < 0 ? "tpl2" : "tpl3";
        $scope.isdigitaltpl = channelName == "szb" ? true : false;
        $scope.setUsual = (channelName == "gxgk"); //可以设置常用的栏目
    }
    /** [queryMyCustoms 查找已设置常用的] */
    function queryMyCustoms(callback) {
        var ct = contentType[modalid];
        resourceCenterService.queryMyCustoms(ct).then(function(data) {
            typeof callback == "function" && callback(data);
        });
    }
    /** [checkCustom 判断是否常用] */
    function checkCustom(item) {
        var ct = contentType[modalid];
        (channelName == "gxgk") && angular.forEach($scope.customList, function(m, j) {
            if ((m.CUSTOMTYPE == ct) && (item.METACATEGORYID == m.CUSTOMID || item.id == m.CUSTOMID)) {
                item.custom = true;
            }
        });
    };
    $scope.checkPreview = function() {
        var isShowPreview = leftService.getParamValue('isShowPreview');
        return isShowPreview == 1;
    }
    $scope.checkCustom = checkCustom;
    /** 点击选中左侧列表条目 */
    $scope.selectThisPanel = function(id) {
        $scope.curdictNum = id;
    };
    /** 点击item加载右侧列表数据 */
    $scope.getDraft = function(subitem, evt, reset, parentItem) {
        timeSecond = $timeout(function() {
            var nodeId, url;
            var rd = Math.random(0, 1) * 100;
            if (channelName == "gxgk" && !typeName) {
                nodeId = subitem.METACATEGORYID;
                if (nodeId == 31) {
                    url = "resourcectrl.share.email";
                } else {
                    if ($state.current.name.indexOf("email") > -1) {
                        url = $state.current.name.replace(".email", "") + ".resource";
                    } else {
                        //url = $state.current.name;
                        url = "resourcectrl.share.resource";
                    }
                }
            }
            //川报修改() 
            else if (channelName == "tpg") {
                url = "resourcectrl.picture.resource";
            } else {
                nodeId = subitem.id;
                url = $state.current.name;
            }
            if (url.split('.').length == 4 && (url.split('.')[3] == 'detail')) url = url.substring(0, url.lastIndexOf('.'));
            //川报修改()
            if (channelName == "tpg") {
                $state.go(url, {
                    cbpicid: nodeId
                });
            } else {
                $state.go(url, {
                    typename: typeName,
                    modalid: modalid,
                    nodeid: nodeId,
                    nodename: subitem.dictName || subitem.CATEGORYNAME,
                    change: rd
                });
            }

            $scope.curdictNum = nodeId;
            $scope.curSubitem = "";
            resetAll(subitem);
            if (parentItem) {
                parentItem.arrowBtn = 'arrowBtnActive';
            }
            $scope.leftList.chnlid = subitem.id;

            evt.stopPropagation();
        }, 300);
    };
    /** [changeIsShowPreview 切换列表tab] */
    $scope.changeIsShowPreview = function(isshowPreview) {
        // $state.go($state.current.name, {
        //     typename: typeName,
        //     nodeid: $scope.curdictNum,
        //     nodename: leftService.getParamValue("nodename"),
        //     isShowPreview: isshowPreview
        // });
        $scope.isShowPreview = isshowPreview == 0 ? false : true;
        var router = isshowPreview == 0 ? 'resourcectrl.digital.resource' : 'resourcectrl.digital.preview';
        if ($scope.curdictNum == 'navigation_005001') {
            loadSubBigData($scope.leftList[0]);
            $scope.leftList[0].isOpen = "true";
        } else {
            $state.go(router, {
                typename: typeName,
                nodeid: $scope.curdictNum,
                nodename: leftService.getParamValue("nodename"),
            });
        }
        // loadSubBigData(item)
    };
    /** 点击节点展开列表 */
    $scope.loadSubItem = function(item, event) {
        timeFirst = $timeout(function() {
            var nodeId = item.id || item.METACATEGORYID,
                nodeName = item.dictName || item.CATEGORYNAME;
            var rd = Math.random(0, 1) * 100;
            //川报修改()
            if (item.hasChildren != "false" && (channelName == "gxgk" || channelName == "tpk")) {
                loadWCMSubData(item);
            }
            if (item.hasChildren == "true" && typeName == 'szb') {
                loadSubBigData(item);
                return;
            }
            if (!nodeId || (channelName == "gxgk" && !typeName)) {
                return false;
            }
            $state.go($state.current.name, {
                typename: typeName,
                modalid: modalid,
                nodeid: nodeId,
                nodename: nodeName,
                change: rd
            });
            $scope.curdictNum = nodeId;
            event.stopPropagation();
        }, 300);
    };
    /** [setUsualItem 设置常用] */
    $scope.setUsualItem = function(item, temp, evt) {
        var ct = contentType[modalid],
            custom = item.CATEGORYNAME || item.dictName,
            customId = item.METACATEGORYID || item.id;
        if (temp) {
            resourceCenterService.cancleMyCustom({
                CustomId: customId,
                CustomType: ct
            }).then(function(data) {
                item.custom = false;
            });
        } else {
            resourceCenterService.saveMyCustom({
                Custom: custom,
                CustomId: customId,
                CustomType: ct
            }).then(function(data) {
                if (data) {
                    item.custom = true;
                }
            });
        }
        evt.stopPropagation();
    };
    /** [cancelUsualItem 取消常用设置] */
    // $scope.cancelUsualItem = function(item) {
    //     var ct = contentType[modalid];
    //     resourceCenterService.cancleMyCustom({
    //         CustomId: item.METACATEGORYID || item.id,
    //         CustomType: ct
    //     }).then(function(data) {
    //         item.custom = false;
    //     });
    // };
    /** [loadLeafArea 加载省市县] */
    $scope.loadLeafArea = function(item, evet, type) {

        !$scope.area && ($scope.area = {});
        if (item.children) {
            $scope.area[type] = item.children;
            if (type == "first") {
                $scope.area.second = [];
                $scope.area.third = [];
                $scope.curSubitem = item;
            } else if (type == "second") {
                $scope.third = [];
            }
        } else {
            item.hasChildren && resourceCenterService.getBase({
                channelName: channelName,
                typeName: typeName,
                parentId: item.id,
                level: 1,
                containParent: false
            }).then(function(data) {
                if (angular.isArray(data)) {
                    $scope.area[type] = data;
                    item.children = data;
                } else {
                    item.children = [];
                }
                if (type == "first") {
                    $scope.area.second = [];
                    $scope.area.third = [];
                    $scope.curSubitem = item;
                } else if (type == "second") {
                    $scope.third = [];
                }
            });
        }
        reset(item);
        if (item.show == "" || item.show == undefined) {
            //item.arrowBtn = "";
            item.show = "show";
        } else {
            //item.arrowBtn = "arrowBtnActive";
            item.show = "";
        }
        //resetAll(item);
        //event.stopPropagation();
        event.stopPropagation();
    };

    function resetAll(item) {
        var leftList = $scope.leftList;
        for (var i = 0; i < leftList.length; i++) {
            var items = leftList[i];
            if (items.CHILDREN) {
                for (var j = 0; j < items.CHILDREN.length; j++) {
                    var chnl = items.CHILDREN[j];
                    if (item.id != chnl.id) {
                        chnl.arrowBtn = "";
                        chnl.show = "";
                    }
                }
            }
        }
    }

    function reset(item) {
        var leftList = $scope.leftList;
        for (var i = 0; i < leftList.length; i++) {
            var items = leftList[i];
            for (var j = 0; j < items.CHILDREN.length; j++) {
                var chnl = items.CHILDREN[j];
                if (item.id != chnl.id) {
                    chnl.show = "";
                }
            }

        }
    }

    /**
     * [addClass description] 新增分类
     * @param {[type]} item    [description] 一级栏目
     * @param {[type]} level   [description] 栏目层级；0-一级,1-二级
     * @param {[type]} subitem [description] 二级栏目
     */
    $scope.addClass = function(item, level, subitem) {
        var transformData = {
            //isAdd是否是新增：0为新增
            isAdd: 0,
            item: item,
            level: level,
            subitem: subitem
        };
        cbCustomService.cbCustomClassify(transformData, function(data) {
            loadWCMData();
        });
    };

    /**
     * [editClass description] 修改分类
     * @param  {[type]} item    [description] 一级栏目
     * @param  {[type]} level   [description] 栏目层级：0-一级,1-二级
     * @param  {[type]} subitem [description] 二级栏目
     * @param  {[type]} e       [description] event对象
     * @return {[type]}         [description]
     */
    $scope.editClass = function(item, level, subitem, e) {
        clearTimeout(timeFirst);
        clearTimeout(timeSecond);
        e.stopPropagation();
        var transformData = {
            //isAdd是否是新增：1为修改
            isAdd: 1,
            item: item,
            level: level,
            subitem: subitem
        };
        cbCustomService.cbCustomClassify(transformData, function(data) {
            loadWCMData();
        });
    };

}).factory("leftService", function($state, $stateParams) {
    var service = {
        getCurChannel: function() {
            var states = $state.current.name.split(".");
            return states[1];
        },
        resNavValue: {
            iwo: "iwo",
            share: "gxgk",
            xinhua: "xhsg",
            stock: "jtcpg",
            picture: "tpg",
            video: "ypg",
            website: "wz",
            wechat: "wx",
            app: "app",
            weibo: "wb",
            digital: "szb"
        },
        getParamValue: function(name) {
            return $stateParams[name];
        }
    }
    return service;
});
