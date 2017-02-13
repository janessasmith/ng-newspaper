"use strict";
angular.module("resourceCenterVideoModule", ["resCenterVideoRouterModule"]).
controller("resourceCenterVideoCtrl", function($scope, $q, $window, $stateParams, trsHttpService, initComDataService, trsspliceString, resCtrModalService, trsconfirm, resourceCenterService) {
    initStatus();
    initData();

    /**
     * [initStatus description] 初始化状态
     * @return {[type]} [description]
     */
    function initStatus() {
        $scope.page = {
            CURRPAGE: 1,
            PAGESIZE: 20,
            PAGECOUNT: 0,
        };

        $scope.status = {
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
        };

        $scope.data = {
            "selectedArray": [],
            "operFlags": []
        };

        $scope.params = {
            "serviceid": "mlf_videoFromMas",
            "methodname": "getAllVideosFromMas",
            "ShareTime": "",
            "MetaCategoryId": $stateParams.cbmediaid,
            "currPage": $scope.page.CURRPAGE,
            "pageSize": $scope.page.PAGESIZE,
            "mediaType":""
        };
    }


    function initData() {
        requestData();
        initOperFlag();
        initDropdown();
    }

    function requestData() {
        var deferred = $q.defer();
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
            $scope.data.items = data.DATA;
            $scope.page = data.PAGER;
            deferred.resolve(data.DATA);
        });
        return deferred.promise;
    }

    /**
     * [initDropdown description] 初始化下拉框
     * @return {[type]} [description]
     */
    function initDropdown() {
        $scope.time = {
            data: initComDataService.timeRange(),
            curValue: initComDataService.timeRange()[5]
        };

        $scope.type = {
            data: initComDataService.videoType(),
            curValue: initComDataService.videoType()[0]
        };
    }

    /**
     * [initOperFlag description] 初始化取签见撤重
     * @return {[type]} [description]
     */
    function initOperFlag() {
        requestData()
            .then(function(data) {
                var ids = trsspliceString.spliceString(data, "METADATAID", ",");
                if (ids !== "") {
                    var params = {
                        serviceid: "mlf_releasesource",
                        methodname: "queryFlag",
                        MetaDataIds: ids
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        $scope.data.operFlags = data;
                    });
                }
            });
    }

    //获取取签见撤重标志
    $scope.showOperFlag = function(id, flagIndex) {
        var temp = queryItemBYID(id);
        if (!!temp) {
            return queryItemBYID(id).OPERFLAG.substr(flagIndex, 1) == "1" ? true : false;
        } else {
            return false;
        }
    };

    function queryItemBYID(id) {
        for (var i in $scope.data.operFlags) {
            if (id == $scope.data.operFlags[i].METADATAID) {
                return $scope.data.operFlags[i];
            }
        }
    }

    /**
     * [selectDoc description] 单选
     * @param  {[type]} item [description] 被选中的元素
     * @return {[type]}      [description]
     */
    $scope.selectDoc = function(item) {
        var index = $scope.data.selectedArray.indexOf(item);
        index < 0 ? $scope.data.selectedArray.push(item) : $scope.data.selectedArray.splice(index, 1);
    };

    /**
     * [queryItemsByDropDown description] 点击下拉框查询列表
     * @param  {[type]} key   [description] 查询参数
     * @param  {[type]} value [description] 查询值
     * @return {[type]}       [description]
     */
    $scope.queryItemsByDropDown = function(key, value) {
        $scope.params[key] = value;
        requestData();
    };

    /**
     * [takeDraft description] 取稿
     * @return {[type]} [description]
     */
    $scope.takeDraft = function() {
        var params = {
            serviceid: "mlf_releasesource",
            methodname: "fetch",
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
        };
        var isOnlyOne = $scope.data.selectedArray.length > 1 ? false : true;
        var modalInstance = resCtrModalService.fullTakeDraft(params, isOnlyOne);
        modalInstance.result.then(function() {
            initOperFlag();
            $scope.data.selectedArray = [];
        }, function() {
            initOperFlag();
            $scope.data.selectedArray = [];
        });
    };

    /**
     * [openReserveDraftModal description] 预留
     * @return {[type]} [description]
     */
    $scope.openReserveDraftModal = function() {
        var resCtrModalServiceModal = resCtrModalService.reserveDraft($scope.data.selectedArray);
        resCtrModalServiceModal.result.then(function(result) {
            delete result.items;
            var params = {
                serviceid: "mlf_releasesource",
                methodname: "delayFetch",
                MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
            };
            params = angular.extend(params, result);
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                trsconfirm.alertType("预留成功!", "", "success", false, function() {
                    initOperFlag();
                    $scope.data.selectedArray = [];
                });
            }, function() {
                initOperFlag();
                $scope.data.selectedArray = [];
            });
        });
    };

    /**
     * [collect description] 收藏
     * @return {[type]} [description]
     */
    $scope.collect = function() {
        var params = {
            serviceid: "mlf_myrelease",
            methodname: "collect",
            MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
            trsconfirm.alertType("收藏成功!", "", "success", false, "");
            $scope.data.selectedArray = [];
        });
    };

    /**
     * [export description] 导出
     * @return {[type]} [description]
     */
    $scope.export = function() {
        var params = {
           serviceid: 'mlf_videoFromMas',
           methodname: 'exportWordFile',
           MetaDataIds: trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ","),
        };
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
           var zipString = data.slice(1,data.length-1);
           $window.open("/wcm/app/file/read_file.jsp?FileName=" + zipString);
        });
    };

    /**
     * [delete description] 删除
     * @return {[type]} [description]
     */
    $scope.delete = function() {
        trsconfirm.confirmModel("删除", "是否从音视频库删除", function() {
            var ids = trsspliceString.spliceString($scope.data.selectedArray, "METADATAID", ",");
            resourceCenterService.deleteRelease(ids).then(function(data) {
                if (data && data.ISSUCCESS == "true") {
                    $scope.data.selectedArray = [];
                    trsconfirm.alertType("删除成功！", "", "success", false, "");
                    $scope.params.currPage = 1;
                    requestData().then(function(data) {
                        $scope.$broadcast("changeDatas", data);
                    });
                }
            });
        });
    };

    /**
     * [viewBigDataInfo description] 点击展示取签见撤重标记
     * @param  {[type]} ChnlDocId  [description]
     * @param  {[type]} showRepeat [description]
     * @return {[type]}            [description]
     */
    $scope.viewBigDataInfo = function(ChnlDocId, showRepeat) {
        var infoModal = resCtrModalService.infoModal(ChnlDocId, showRepeat);
    };
});
