/**
 *  logManageMentModule
 *
 * Description  管理配置 日志管理 安全日志
 * rebuild:SMG 2016-4-20
 */
"use strict";
angular.module('logManageMentSecurityLogModule', ['logManageMentSecurityLogRouterModule'])
    .controller('logManageMentSecurityLogCtrl', ['$scope', 'trsHttpService', 'initComDataService', 'dateFilter', "trsconfirm",
        function($scope, trsHttpService, initComDataService, dateFilter, trsconfirm) {
            initStatus();
            initData();
            /**
             * [initStatus description] 状态初始化
             */
            function initStatus() {
                $scope.page = {
                    CURRPAGE: 1,
                    PAGESIZE: 20,
                    ITEMCOUNT: '',
                    PAGECOUNT: '',
                };
                $scope.params = {
                    'serviceid': 'mlflog',
                    'modelid': 'mlflogsearch',
                    'type': '5', //安全日志
                    'startpage': $scope.page.CURRPAGE,
                    'pagesize': $scope.page.PAGESIZE,
                    'fileds': 'operator_info;operator_time;operator_ip;operate_desc;department;',
                    // operator_info;media_name;display_name;operator_time;operator_ip;operate_desc
                    'time': '1m',
                    'medianame': '',
                    'searchcontent': '',
                    'strsortmethod': '-operator_time',
                };
                $scope.status = {
                    //下拉框开始
                    timeArray: [],
                    timeSelected: "",
                    //下拉框结束
                    copyCurrPage: '',
                };
                $scope.data = {
                    items: [],
                };
            };
            /**
             * [initData description] 数据初始化
             */
            function initData() {
                initDropDown();
                requestData();
            };
            /**
             * [requestData description] 请求数据
             */
            function requestData() {
                var params = angular.copy($scope.params);
                params.startpage = angular.copy($scope.page.CURRPAGE);
                trsHttpService.httpServer(trsHttpService.getLogManageUrl(), params, 'post').then(function(data) {
                    $scope.data.items = data.CONTENT;
                    $scope.page.ITEMCOUNT = data.TOTALELEMENTS;
                    $scope.page.PAGECOUNT = data.TOTALPAGES;
                })
            };
            /**
             * [initDropDown description] 初始化下拉框
             */
            function initDropDown() {
                //时间
                $scope.status.timeArray = initComDataService.logMgrTime();
                $scope.status.timeSelected = $scope.status.timeArray[1];
            };
            /**
             * [pageChanged description]分页
             * @return {[type]} [description]
             */
            $scope.pageChanged = function() {
                $scope.status.copyCurrPage = $scope.page.CURRPAGE;
                requestData();
            };
            /*跳转指定页面*/
            $scope.jumpToPage = function() {
                if ($scope.status.copyCurrPage > $scope.page.PAGECOUNT) {
                    $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
                }
                $scope.page.CURRPAGE = $scope.status.copyCurrPage;
                requestData();
            };
            /**
             * [selectPageNum description]选择单页分页条数
             * @return {[type]} [description]
             */
            $scope.selectPageNum = function() {
                $scope.params.startpage = $scope.page.CURRPAGE;
                $scope.params.pagesize = $scope.page.PAGESIZE;
                $scope.status.copyCurrPage = 1;
                requestData();
            };
            /**
             * [searchWithKeyword description]条件过滤
             */
            $scope.searchWithKeyword = function(key, value) {
                var param;
                if (key == "time" && value.value == "custom") {
                    if (value.startdate == "" || value.enddate == "") {
                        trsconfirm.alertType('检索失败', '检索时间不能为空', 'error', false);
                        return;
                    }
                    param = [dateFilter(value.startdate, 'yyyy-MM-dd'), dateFilter(value.enddate, 'yyyy-MM-dd')].join(';');
                } else {
                    param = value.value
                }
                $scope.page.CURRPAGE = '1';
                $scope.params[key] = param;
                requestData();
            };
            /**
             * [fullTextSearch description;全文检索]
             * @param  {[type]} ev [description:按下空格也能提交]
             */
            $scope.fullTextSearch = function(ev) {
                if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                    $scope.page.CURRPAGE = 1;
                    requestData();
                }
            };
            /**
             * [refresh description;刷新]
             */
            $scope.refresh = function() {
                $scope.page.CURRPAGE = '1';
                $scope.params.searchcontent = "";
                $scope.params.time = "1m";
                $scope.status.timeSelected = $scope.status.timeArray[1];
                requestData();
            }
        }
    ]);
