"use strict";
/**
 * customMonitor Module
 *
 * Description 自定义监控
 * Author:SMG 2016-5-11
 */
angular.module('customMonitorModule', ['customPreviewModule', 'addCustomMonitorModule', 'customMonitorModuleRouter', "planCenCustomMonitorServiceModule"])
    .controller('customMonitorController', ['$scope', '$sce', '$q', '$filter', 'trsHttpService', 'trsconfirm',
        function($scope, $sce, $q, $filter, trsHttpService, trsconfirm) {
            initStatus();
            initData();
            /**
             * [initStatus description]初始化状态
             */
            function initStatus() {
                $scope.status = {
                    hoverStatus: "",
                };
                $scope.data = {
                    monitors: [] //监控集合
                };
                $scope.page = {
                    pagesize: 10
                };
            }
            /**
             * [initData description]初始化数据
             */
            function initData() {
                requestData();
            }
            /**
             * [requestData description]请求监控列表
             */
            function requestData() {
                getMonitorIds().then(function(data) {
                    $scope.data.monitors = data;
                    angular.forEach($scope.data.monitors, function(data, index, array) {
                        getMonitorById($scope.data.monitors[index].ID).then(function(data) {
                            $scope.data.monitors[index].title = data.TITLE;
                        });
                        $scope.getLatestArticles($scope.data.monitors[index]);
                    });
                });
            }
            /**
             * [getMonitors description]获取监控ID
             * @return {[monitors]} obj [description] 监控ID集合
             */
            function getMonitorIds() {
                var deffer = $q.defer();
                var params = {
                    typeid: "widget",
                    serviceid: "monitorsearch",
                    modelid: "getmonitorinfoid"
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(
                    function(data) {
                        deffer.resolve(data);
                    });
                return deffer.promise;
            }
            /**
             * [getLatestArticles description]获取最近新闻
             * @param {[monitor]} obj [description] 监控对象
             */
            $scope.getLatestArticles = function(monitor) {
                var params = {
                    typeid: "widget",
                    serviceid: "monitorsearch",
                    modelid: "getnewlist",
                    pagesize: $scope.page.pagesize,
                    startpage: angular.isDefined(monitor.latestArticle) && monitor.latestArticle.startpage > 0 ? (monitor.latestArticle.startpage - 1) : 0,
                    ID: monitor.ID,
                    timetype: 1
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(
                    function(data) {
                        monitor.isInLatestArticles = true; // 是否正在查看最近文章
                        monitor.latestArticle.items = data.ITEMS;
                        if (angular.isUndefined(monitor.latestArticle.startpage)) monitor.latestArticle.startpage = 0;
                        monitor.latestArticle.ITEMCOUNT = data.TOTALNUMS;
                        monitor.latestArticle.PAGECOUNT = Math.ceil(data.TOTALNUMS / $scope.page.pagesize);

                    },
                    function() {

                    });
            };
            /**
             * [trustTitle description]信任标题HTML
             * @param {[itme]} obj [description] 新闻记录
             */
            $scope.trustTitle = function(item) {
                item.DOCTITLE = $sce.trustAsHtml(item.DOCTITLE);
                //itme.DOCPUBTIME = $filter('date')(itme.DOCPUBTIME, "yyyy-MM-dd").toString();
                var theDate = new Date(Date.parse(item.DOCPUBTIME));
                var date = new Date();
                if (theDate.getDate() === date.getDate()) {
                    //item.DOCPUBTIME = "今天" + theDate.getHours() + ":" + theDate.getMinutes() + ":" + theDate.getSeconds();
                }
            };
            /**
             * [pageChanged description]页面跳转
             * @param {[monitor]} obj [description] 监控
             */
            $scope.pageChanged = function(monitor) {
                if (monitor.isInLatestArticles) {
                    $scope.getLatestArticles(monitor);
                } else {
                    $scope.getHottestArticle(monitor);
                }
            };
            /**
             * [jumpToPage description]跳到指定页
             * @param {[monitor]} obj [description] 监控
             */
            $scope.jumpToPage = function(monitor) {
                var willgo = monitor.isInLatestArticles ? monitor.latestArticle.willgo : monitor.hottestArticle.willgo;
                var pageCount = monitor.isInLatestArticles ? monitor.latestArticle.PAGECOUNT : monitor.hottestArticle.PAGECOUNT;
                if (pageCount < parseInt(willgo)) {
                    trsconfirm.alertType("超过了最大页数", "", "warning", false);
                    return;
                }
                if (monitor.isInLatestArticles) {
                    monitor.latestArticle.startpage = angular.copy(willgo);
                    $scope.getLatestArticles(monitor);
                } else {
                    monitor.hottestArticle.startpage = angular.copy(willgo);
                    $scope.getHottestArticle(monitor);
                }
            };
            /**
             * [getHottestArticle description]信任标题HTML
             * @param {[monitor]} obj [description] 监控
             */
            $scope.getHottestArticle = function(monitor) {
                var params = {
                    typeid: "widget",
                    serviceid: "monitorsearch",
                    modelid: "gethotlist",
                    pagesize: $scope.page.pagesize,
                    startpage: angular.isDefined(monitor.hottestArticle.startpage) && monitor.hottestArticle.startpage > 0 ? (monitor.hottestArticle.startpage - 1) : 0,
                    ID: monitor.ID
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(
                    function(data) {
                        monitor.isInLatestArticles = false;
                        monitor.hottestArticle.items = data.CONTENT;
                        if (angular.isUndefined(monitor.hottestArticle.startpage)) monitor.hottestArticle.startpage = 0;
                        monitor.hottestArticle.ITEMCOUNT = data.TOTALELEMENTS;
                        monitor.hottestArticle.PAGECOUNT = data.TOTALPAGES;
                    },
                    function() {

                    });
            };
            /**
             * [getMonitorById description]获取监控标题
             * @param {[id]} string [description] 监控ID
             */
            function getMonitorById(id) {
                var deffer = $q.defer();
                var params = {
                    typeid: "widget",
                    serviceid: "custommonitor",
                    modelid: "getmonitortitlebyid",
                    id: id
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                    deffer.resolve(data);
                });
                return deffer.promise;
            }
            /**
             * [setPageSize description]设置每页大小
             * @param {[pagesize]} int [description] 每页显示条数
             */
            $scope.setPageSize = function(pagesize) {
                $scope.page.pagesize = pagesize;
                requestData();
            };
            /**
             * [showTitle description]鼠标移入显示标题详情
             * @param {[event]} event [description] 事件
             */
            $scope.showTitle = function(item, ev, popupwidth) {
                if (document.body.offsetWidth - ev.clientX > popupwidth) {
                    item.panelpostion = {
                        left: ev.offsetX
                    };
                } else {
                    item.panelpostion = {
                        left: 100
                    };
                }
                item.isShowTitle = true;
            };
            /**
             * [deleteMonitor description]删除监控
             * @param {[monitor]} obj [description] 监控对象
             */
            $scope.deleteMonitor = function(monitor) {
                var params = {
                    typeid: "widget",
                    serviceid: "custommonitor",
                    modelid: "deletemonitorinfobyid",
                    id: monitor.ID
                };
                trsconfirm.confirmModel("删除监控", "请确认是否要删除该监控", function() {
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
                        trsconfirm.alertType('删除监控成功', '', 'success', false, function() {
                            requestData();
                        });
                    });
                });
            };
        }
    ]);
