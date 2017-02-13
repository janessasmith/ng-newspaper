"use strict";
angular.module('trsMasonryModule', [])
    .directive('trsMasonry', ["$timeout", "trsspliceString", "trsHttpService", "resCtrModalService", function($timeout, trsspliceString, trsHttpService, resCtrModalService) {
        return {
            restrict: "EA",
            templateUrl: "./components/util/trsMasonry/trs_masonry_tpl.html",
            scope: {
                datas: "=",
                selectedArray: "=",
            },
            controller: function($scope) {
                $scope.data = {
                    operFlags: [],
                };
                $timeout(function() {
                    initOperFlag($scope.datas);
                    /**
                     * [selectDoc description]选择图片
                     * @param  {[obj]} item [description]图片对象
                     * @return {[type]}      [description]
                     */
                    $scope.selectDoc = function(item) {
                        var index = $scope.selectedArray.indexOf(item);
                        index < 0 ? $scope.selectedArray.push(item) : $scope.selectedArray.splice(index, 1);
                    };
                    /**
                     * [initOperFlag description]初始化标记
                     * @return {[type]} [description]
                     */
                    function initOperFlag(data) {
                        var ids = trsspliceString.spliceString(data, "METADATAID", ",");
                        var params = {
                            serviceid: "mlf_releasesource",
                            methodname: "queryFlag",
                            MetaDataIds: ids
                        };
                        if (ids !== "") {
                            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                                $scope.data.operFlags = data;
                            });
                        }
                    }
                    $scope.showOperFlag = function(id, flagIndex) {
                        var temp = queryItemBYID(id);
                        if (!!temp) {
                            return queryItemBYID(id).OPERFLAG.substr(flagIndex, 1) == "1" ? true : false;
                        } else {
                            return false;
                        }
                    };
                    //注意METADATAID
                    function queryItemBYID(id) {
                        for (var i in $scope.data.operFlags) {
                            if (id == $scope.data.operFlags[i].METADATAID) {
                                return $scope.data.operFlags[i];
                            }
                        }
                    }
                    /**
                     * [viewBigDataInfo description]弹出标记框
                     * @param  {[type]} ChnlDocId  [description]
                     * @param  {[type]} showRepeat [description]
                     * @return {[type]}            [description]
                     */
                    $scope.viewBigDataInfo = function(ChnlDocId, showRepeat) {
                        var infoModal = resCtrModalService.infoModal(ChnlDocId, showRepeat);
                    };

                    /**
                     * [description]监听标记
                     * @param  {[type]} e         [description]
                     * @param  {[type]}[description]
                     * @return {[type]}           [description]
                     */
                    $scope.$on("requestDatas", function(e, newvalue) {
                        initOperFlag(newvalue);
                    });

                });
            },
            link: function(scope, element, attrs, controller) {
                masonry();
                /**
                 * [description]监听控制器列表请求
                 * @param  {[type]} e         [description]
                 * @param  {[type]} newvalue  [description]广播过来的值
                 * @return {[type]}           [description]
                 */
                scope.$on("changeDatas", function(e, newvalue) {
                    $timeout(function() {
                        scope.datas = newvalue;
                        masonry();
                    });
                });
                /**
                 * [masonry description]图片瀑布流
                 * @return {[type]} [description]
                 */
                function masonry() {
                    var imgFlow = element[0].childNodes[0];
                    require(["masonry"], function(masonry) {
                        var waterfall = new masonry(element[0].childNodes[0], {
                            itemSelector: '.img-box',
                            columnWidth: 200,
                            gutter: 20
                        });
                        require(["imagesload"], function(imagesload) {
                            imagesload(imgFlow).on('progress', function() {
                                waterfall.layout();
                            });
                        });
                    });
                }
            }
        };
    }]);
