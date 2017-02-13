/*
 created by zhyp on 2015.12.16
 description:用于二级导航切换时选中状态
*/
"use strict";
angular.module('resCenterSubTabModule', []).controller('resCenterSubTabCtrl', ["$scope", "$state", "$stateParams", "trsHttpService", "leftService", "$timeout", "$rootScope", "$q", "$modal", "cbCustomService", "resourceCenterService", function($scope, $state, $stateParams, trsHttpService, leftService, $timeout, $rootScope, $q, $modal, cbCustomService, resourceCenterService) {
    var typeName = leftService.getParamValue('typename');
    var channelName = leftService.getCurChannel();
    initStatus();
    initData();
    //  鼠标移到'更多'
    var mouseleave = true;
    $scope.moreMouseenter = function() {
        mouseleave = false;
        $scope.isShowMoreList = true;
    };

    $scope.moreMouseleave = function() {
        mouseleave = true;
        $timeout(function() {
            mouseleave && ($scope.isShowMoreList = false);
        }, 1000);
    };

    //切换状态
    $scope.changeType = function(item, router, temp) {
        if (temp == true) {
            var url = item.MODALNAME == "我的订阅" ? "resourcectrl.iwo.resource" : "retrieval.resmanage";
            $state.go(url, {
                typename: item.MODALID
            });
        } else {
            //共享稿库地域分类临时兼容开始
            var curUrl = window.location.href;
            var url;
            url = curUrl.indexOf("resourcectrl/share/") >= 0 && (item.MODALDESC === "地域分类" || item.MODALDESC === "主题分类") ? (router + ".resource1") : (router + ".resource");
            //共享稿库地域分类临时兼容结束
            $state.transitionTo(url, {
                typename: item.TYPENAME,
                modalid: item.MODALID,
                nodeid: "",
            }, { reload: router });
        }
    };

    //川报修改
    $scope.cbXlfl = function() {
        var params = {
            "serviceid": "mlf_xhsgsource",
            "methodname": "queryLineClassifys"
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $scope.cbLeft = data;
        });
    };

    //切换路由，并获取节点下数据
    $scope.goTo = function(item) {
        // 川报修改
        resourceCenterService.getModal = item.MODALID; //使用服务存储不同模块的MODALID
        if (item.MODALDESC == "add") {
            addCustom();
        } else if ($scope.data.fixedArr.indexOf(item.MODALDESC) < 0 && item.MODALDESC != "add") {
            changeCustomModule(item);
        } else {
            loadSubData(item);
        }
    };

    //川报修改{}
    function changeCustomModule(item) {
        item.isActive = true;
        $state.go("resourcectrl.custom.resource", {
            desc: item.MODALDESC,
            customid: item.MODALID
        });
    }

    //川报修改{}
    // if($scope.data.fixedArr.indexOf(item.MODALDESC)<0){
    //     $state.go(url, {
    //             desc:modaldesc,
    //             customid:modalid
    //         });
    // }

    //川报修改
    //添加自定义分类稿库
    function addCustom() {
        cbCustomService.cbCustomWindow("", initData);
    }

    //川报修改
    $scope.edit = function(item) {
        var unableEdit = ["share", "xinhua", "picture", "video"];
        if (unableEdit.indexOf(item.MODALDESC) < 0) {
            cbCustomService.cbCustomWindow(item, initData);
        }
        // item.isActive = true;
    };

    //初始化二级导航条数据
    function initData() {
        var moduleParams = {
            serviceid: "mlf_releasesource",
            methodname: "queryModals",
            ModalName: "MODAL_RESOURCE"
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), moduleParams, "get")
            .then(function(data) {
                var arr = [];
                //川报修改
                var arrAdd = [{
                    MODALDESC: "add",
                    MODALNAME: "",
                }];
                var curItem;
                var channelName = leftService.getCurChannel();
                angular.forEach(data, function(n, index, array) {
                    //川报修改{}
                    var fixedArr = ["share", "xinhua", "picture", "video", "liveshow"];
                    n.router = fixedArr.indexOf(n.MODALDESC) < 0 ? "resourcectrl.custom" : "resourcectrl." + n.MODALDESC;
                    //n.router = "resourcectrl." + n.MODALDESC;

                    arr.push(n);
                    if (n.MODALDESC == channelName || n.MODALDESC == $state.params.desc) {
                        n.isActive = true;
                        curItem = n;
                    } else {
                        if (n.MODALDESC == "liveshow" && channelName == 'reply' || channelName == 'hoster') { //专门为直播模块处理
                            n.isActive = true;
                        } else {
                            n.isActive = false;
                        }
                    }
                });
                //川报修改
                var arrNew = arr.concat(arrAdd);
                //川报修改
                $scope.items = arrNew;
                if (curItem) {
                    resourceCenterService.getModal = curItem.MODALID; //使用服务存储不同模块的MODALID
                }
                curItem && loadSubData(curItem);
            });
    }

    function loadSubData(item) {
        //川报修改(为了图片库和音视频库的二级导航与共享稿库的二级导航一致。共享稿库的MODALID为22,图片库为24,音视频库为25)
        if (item.MODALID == 24 || item.MODALID == 25) {
            item.MODALID = 22;
        }
        var moduleChlidrenParams = {
            serviceid: "mlf_releasesource",
            methodname: "queryModals",
            Modalid: item.MODALID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), moduleChlidrenParams, "post")
            .then(function(data) {
                var tname, modalid, /*临时兼容*/ modaldesc;
                angular.forEach(data, function(n, i) {
                    if (n.TYPENAME && typeName == n.TYPENAME || (n.MODALID == "74" && $state.current.name == "retrieval.resmanage")) {
                        n.focused = true;
                        tname = n.TYPENAME;
                        modalid = n.MODALID;
                        /*临时兼容*/
                        modaldesc = n.MODALDESC;
                    } else {
                        n.focused = false;
                    }
                });

                if (data.length && angular.isArray(data) && $state.current.name != "retrieval.subscribe") {
                    if (!tname) {
                        tname = data[0].TYPENAME;
                        data[0].focused = true;
                    }
                    modalid = modalid || data[0].MODALID;

                }
                item.childrenModule = data;
                /*临时兼容*/
                var myUrl = window.location.href;
                var url = item.router + ".resource";
                /*临时兼容*/
                if (myUrl.indexOf("resourcectrl/share") > 0 && modaldesc === "地域分类") {
                    url = item.router + ".resource1";
                }
                /*数字报预览显示临时兼容*/
                if (myUrl.indexOf('digital/preview') > 0) {
                    url = item.router + ".preview";
                }
                if (item.MODALDESC == "iwo") {
                    if ($state.current.name != "retrieval.resmanage" && $state.current.name != "retrieval.subscribe") {
                        $state.go(url, {
                            typename: modalid,
                            modalid: modalid,
                        });
                    } else {
                        $state.go($state.current.name, {
                            typename: modalid,
                            modalid: modalid,
                        });
                    }
                } else {
                    $state.go(url, {
                        typename: tname,
                        modalid: modalid,
                    });
                }
                // 川报修改
                if (item.MODALDESC == "xinhua") {
                    initCbLeft().then(function(data) {
                        var arr = [{
                            LINECLASSFYID: "",
                            LINECLASSFYNAME: "全部线路"
                        }];
                        angular.forEach(data, function(value, index) {
                            arr.push(value);
                        });
                        var id = arr[0].LINECLASSFYID;
                        $state.go(url, {
                            id: id
                        });
                    });
                }
                // 川报修改()
                if (item.MODALDESC == "picture") {
                    initCbPicLeft().then(function(data) {
                        var arr = [];
                        angular.forEach(data, function(value, index) {
                            arr.push(value);
                        });
                        var id = arr[0].METACATEGORYID;
                        $state.go(url, {
                            cbpicid: id
                        });
                    });
                }
                //川报修改
                if (item.MODALDESC == "video") {
                    initCbPicLeft().then(function(data) {
                        var arr = [];
                        angular.forEach(data, function(value, index) {
                            arr.push(value);
                        });
                        var id = arr[0].METACATEGORYID;
                        $state.go(url, {
                            cbmediaid: id
                        });
                    });
                }
            });
    }

    function initStatus() {
        $scope.status = {

        };
        $rootScope.$watch("status.resourceCenterAccesses", function(nvl, ovl) {
            $scope.status.resourceCenterAccesses = nvl;
        });
        //川报修改{}
        $scope.data = {
            fixedArr: ["share", "xinhua", "picture", "video", "add", "liveshow"]
        };
    }

    // 川报修改
    function initCbLeft() {
        var deferred = $q.defer();
        var params = {
            "serviceid": "mlf_xhsgsource",
            "methodname": "queryLineClassifys"
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    //川报修改()
    function initCbPicLeft() {
        //console.log($stateParams);
        var deferred = $q.defer();
        var params = {
            serviceid: "mlf_releaseSource",
            methodname: "queryMetaCategorysByModalId",
            Modalid: 37
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            var id = data[0].METACATEGORYID;
            var params = {
                serviceid: "mlf_releaseSource",
                methodname: "queryMetaCategorysOfResource",
                MetaCategoryId: id
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                deferred.resolve(data);
            });
        });
        return deferred.promise;
    }
}]);
