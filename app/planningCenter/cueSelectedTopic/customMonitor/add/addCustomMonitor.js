"use strict";
/**
 * customMonitor Module
 *
 * Description 自定义监控-添加
 * Author:fanglijuan 2016-5-11
 */
angular.module('addCustomMonitorModule', [])
    .controller('addCustomMonitorController', ['$scope', '$validation', '$state', '$stateParams', 'trsHttpService', 'trsconfirm', '$q',
        function($scope, $validation, $state, $stateParams, trsHttpService, trsconfirm, $q) {
            initStatus();
            initData();
            /**
             * [initStatus description]初始化状态
             */
            function initStatus() {
                $scope.status = {};
                $scope.data = {};
                $scope.page = {
                    pagesize: 24,
                    startpage: 0,
                };
                $scope.temp = {
                    sourcecontentByType: {},
                    sourceChannels: {}
                };
                initType().then(function(data) {
                    $scope.status.types = data;
                    $scope.temp.selectChannel = $scope.status.types[0];
                    getSourceChannels($scope.temp.selectChannel.SOURCENAME);
                });
            }
            /**
             * [initData description]初始化数据
             */
            function initData() {
                if (!!$stateParams.id) {
                    $scope.status.isAdd = false;
                    var params = {
                        typeid: "widget",
                        serviceid: "custommonitor",
                        modelid: "getmonitorbyid",
                        id: $stateParams.id
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                        delete data.MONITORINFO.RELIABILITY;
                        delete data.MONITORINFO.TABLENAMES;
                        delete data.MONITORINFO.TRSL;
                        delete data.MONITORINFO.USERID;
                        delete data.MONITORINFO.CRTIME;
                        for (var j in data.MONITORINFO) {
                            $scope.data[j.toLowerCase()] = data.MONITORINFO[j];
                        }
                        if ($scope.data.sourcetype === "2") {
                            angular.forEach($scope.data.sourcecontent.split(","), function(data, index, array) {
                                $scope.temp.sourcecontentByType[data] = true;
                            });
                        } else if ($scope.data.sourcetype === "3") {
                            var tempSourceContent = $scope.data.sourcecontent.split("$");
                            for (var k in tempSourceContent) {
                                var tempChannel = tempSourceContent[k].split(",");
                                var uniqueId = tempChannel[0] + "_" + tempChannel[1] + "_" + tempChannel[2];
                                $scope.temp.sourceChannels[uniqueId] = {
                                    SOURCENAME: tempChannel[0],
                                    CHANNEL: tempChannel[1],
                                    SECTION: tempChannel[2],
                                    uniqueId: uniqueId
                                };
                                if (tempChannel[2] === "app" || tempChannel[2] === "website") {
                                    $scope.temp.sourceChannels[uniqueId].desc = tempChannel[1] + "_" + tempChannel[0];
                                } else {
                                    $scope.temp.sourceChannels[uniqueId].desc = tempChannel[0];
                                }
                            }
                        }
                    });
                } else {
                    $scope.status.isAdd = true;
                    $scope.data.sourcetype = "1";
                }
            }
            /**
             * [initType description]初始化类型
             */
            function initType() {
                var deffer = $q.defer();
                var params = {
                    typeid: "widget",
                    serviceid: "custommonitor",
                    modelid: "getsourcename"
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    deffer.resolve(data);
                });
                return deffer.promise;
            }
            $scope.chooseByType = function(type) {
                if ($scope.data.sourcetype !== '2') return;
                $scope.temp.sourcecontentByType[type.SOURCENAME] = $scope.temp.sourcecontentByType[type.SOURCENAME] === true ? undefined : true;
            };
            /**
             * [chooseChannel description]选择栏目
             * @param {[channel]} object     [description]  所选栏目
             */
            $scope.chooseChannel = function(channel) {
                if ($scope.data.sourcetype !== '3') return;
                $scope.status.isSearch = false;
                $scope.searchword = "";
                $scope.temp.selectChannel = channel;
                $scope.page.startpage = 0;
                getSourceChannels($scope.temp.selectChannel.SOURCENAME);
            };
            /**
             * [chooseSourceName description]选择来源
             * @param {[channel]} object     [description]  来源栏目
             */
            $scope.chooseSourceName = function(channel) {
                if ($scope.data.sourcetype !== '3') return;
                if (angular.isDefined($scope.temp.sourceChannels[channel.uniqueId])) {
                    delete $scope.temp.sourceChannels[channel.uniqueId];
                } else {
                    $scope.temp.sourceChannels[channel.uniqueId] = channel;
                }
            };
            /**
             * [getUniqueId description]初始化唯一标识和显示名称
             * @param {[channel]} object     [description]  来源栏目
             */
            $scope.getUniqueId = function(channel) {
                if (channel.SECTION === "website" || channel.SECTION === "app") {
                    channel.desc = channel.CHANNEL;
                    if (channel.SECTION === "app") {
                        channel.desc = channel.desc + "_" + channel.SOURCENAME;
                    }
                } else {
                    channel.desc = channel.SOURCENAME;
                }
                channel.uniqueId = channel.SOURCENAME + "_" + channel.CHANNEL + "_" + channel.SECTION;
            };
            /**
             * [deleteSrcChannel description]删除来源栏目
             * @param {[key]} string     [description]  主键
             */
            $scope.deleteSrcChannel = function(key) {
                delete $scope.temp.sourceChannels[key];
            };
            /**
             * [getSourceChannels description]获取来源栏目
             * @param {[pagesize]} int     [description]  总页数
             */
            function getSourceChannels(sourcename) {
                var params = {
                    typeid: "widget",
                    serviceid: "custommonitor",
                    modelid: "getsourcechannel",
                    pagesize: $scope.page.pagesize,
                    startpage: $scope.page.startpage === 0 ? 0 : $scope.page.startpage - 1,
                    sourcename: sourcename
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get")
                    .then(function(data) {
                        $scope.status.sourceChannels = data;
                        if (sourcename === "zjxz") {
                            data.PAGEITEMS = data.CONTENT;
                        }
                        $scope.page.PAGECOUNT = sourcename === "zjxz" ? data.TOTALPAGES : data.PAGETOTAL;
                        $scope.page.pagesize = sourcename === "zjxz" ? data.SIZE : data.PAGESIZE; //兼容最近选择
                        $scope.page.ITEMCOUNT = sourcename === "zjxz" ? data.TOTALELEMENTS : data.TOTALITEMCOUNT;
                    });
            }
            /**
             * [pageChanged description]页面跳转
             */
            $scope.pageChanged = function() {
                if ($scope.status.isSearch) {
                    $scope.searchChannelsWithoutSetPage();
                } else {
                    getSourceChannels($scope.temp.selectChannel.SOURCENAME);

                }
            };
            /**
             * [cancel description]取消
             */
            $scope.cancel = function() {
                $state.go('plan.custommonitor');
            };
            /**
             * [searchChannels description]搜索栏目
             */
            $scope.searchChannels = function() {
                if ($scope.data.sourcetype !== '3') return;
                $scope.page.startpage = 0;
                searchChannels();

            };
            /**
             * [searchChannels description]搜索栏目不设置首页
             */
            $scope.searchChannelsWithoutSetPage = function() {
                if ($scope.data.sourcetype !== '3') return;
                searchChannels();
            };

            function searchChannels() {
                //$scope.page.startpage = 0;
                //$scope.searchword = angular.isUndefined($scope.searchword) ? "" : $scope.searchword;
                if (angular.isUndefined($scope.searchword) || $scope.searchword === "") {
                    trsconfirm.alertType("检索词不允许为空", "", "warning", false)
                    return;
                }
                $scope.status.isSearch = true;
                var params = {
                    typeid: "widget",
                    serviceid: "custommonitor",
                    modelid: "getsearchresult",
                    pagesize: $scope.page.pagesize,
                    startpage: $scope.page.startpage === 0 ? 0 : $scope.page.startpage - 1,
                    sourcename: $scope.temp.selectChannel.SOURCENAME,
                    searchword: $scope.searchword
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get", false).then(function(data) {
                    $scope.status.sourceChannels = data;
                    if ($scope.temp.selectChannel.SOURCENAME === "zjxz") {
                        data.PAGEITEMS = data.CONTENT;
                    }
                    $scope.page.PAGECOUNT = $scope.temp.selectChannel.SOURCENAME === 'zjxz' ? data.TOTALPAGES : data.PAGETOTAL;
                    $scope.page.pagesize = $scope.temp.selectChannel.SOURCENAME === 'zjxz' ? data.SIZE : data.PAGESIZE;
                    $scope.page.ITEMCOUNT = $scope.temp.selectChannel.SOURCENAME === 'zjxz' ? data.TOTALELEMENTS : data.TOTALITEMCOUNT;
                });
            }
            /**
             * [confirm description]提交
             */
            $scope.confirm = function() {
                $validation.validate($scope.addCusMonForm).success(function() {
                    if (!validateSearchCondition()) {
                        trsconfirm.alertType("请检查检索条件的填写，“全部”或“任意一个”关键词至少填写一项", "", "warning", false);
                        return;
                    }
                    var tempSourcecontent = [],
                        params = angular.copy($scope.data);
                    if (params.sourcetype === '2') {
                        for (var j in $scope.temp.sourcecontentByType) {
                            if ($scope.temp.sourcecontentByType[j]) {
                                tempSourcecontent.push(j);
                            }
                        }
                        if (tempSourcecontent.length === 0) {
                            trsconfirm.alertType("请至少选择一个来源类型", "", "warning", false);
                            return;
                        }
                        params.sourcecontent = tempSourcecontent.join(",");
                    } else if (params.sourcetype === '3') {
                        var sourceChannels = angular.copy($scope.temp.sourceChannels);
                        for (var i in sourceChannels) {
                            delete sourceChannels[i].ID;
                            delete sourceChannels[i].desc;
                            delete sourceChannels[i].uniqueId;
                            tempSourcecontent.push(sourceChannels[i].SOURCENAME + "," + sourceChannels[i].CHANNEL + "," + sourceChannels[i].SECTION);
                        }
                        if (tempSourcecontent.length === 0) {
                            trsconfirm.alertType("请至少选择一个来源栏目", "", "warning", false);
                            return;
                        }
                        params.sourcecontent = tempSourcecontent.join("$");

                    }
                    params.typeid = "widget";
                    params.serviceid = "custommonitor";
                    params.modelid = "addmonitor";
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(
                        function() {
                            trsconfirm.alertType(($scope.status.isAdd ? '新增' : '修改') + "监控成功", "", "success", false, function() {
                                $state.go('plan.custommonitor', "", { reload: true });
                            });
                        }
                    );
                });
            };

            function validateSearchCondition() {
                var flag1, flag2;
                flag1 = flag2 = true;
                if ($scope.data.searchincludeall === "" || typeof $scope.data.searchincludeall !== "string") {
                    delete $scope.data.searchincludeall;
                    flag1 = false;
                }
                if ($scope.data.searchincludeanyone === "" || typeof $scope.data.searchincludeanyone !== "string") {
                    delete $scope.data.searchincludeanyone;
                    flag2 = false;
                }
                if ($scope.data.searchincludenone === "" || typeof $scope.data.searchincludenone !== "string") {
                    delete $scope.data.searchincludenone;
                }
                return flag1 || flag2;
            }
        }
    ]);
