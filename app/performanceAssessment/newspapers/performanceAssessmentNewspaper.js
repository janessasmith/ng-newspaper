"use strict";

angular.module('performanceAssessmentNewspaperModule', [
    'performanceAssessmentNewspaperRouterModule'
]).
controller('performanceAssessmentNewspaperCtrl', ['$scope', "trsHttpService", "$stateParams", "$state", "$q", "$location", "initSingleSelecet", "trsconfirm",
    function($scope, trsHttpService, $stateParams, $state, $q, $location, initSingleSelecet, trsconfirm) {
        initStatus();
        initData();

        /**
         * [initStatus description: 初始化状态]
         * @return {[type]} [description]
         */
        function initStatus() {
            $scope.data = {
                // 初始化列表
                items: [],
                // 初始化复选框
                selectedArray: [],
                // 初始化按钮
                disableCP: false,
                disableZP: false
            };

            /**
             * [page description: 分页]
             * @type {Object}
             */
            $scope.page = {
                // "ITEMCOUNT": 100,
                // "PAGECOUNT": 1,
                "CURRPAGE": 1,
                "PAGESIZE": 10
            };
            $scope.status = {
                batchOperateBtn: {
                    'hoverStatus': "",
                    'clickStatus': ""
                },
                // 分页跳转当前页
                jumpCurrPage: 1,
                params: {
                    "PaperId": $stateParams.PaperId,
                    "BanMianId": $stateParams.BanMianId,
                    "PubTime": "",
                    "DocType": "",
                    "serviceid": "mlf_jxkh",
                    "methodname": "queryJXKHDocs",

                    "PageSize": $scope.page.PAGESIZE,
                    "CurrPage": $scope.page.CURRPAGE
                }
            };
        }

        /**
         * [initData description: 初始化数据]
         * @return {[type]} [description]
         */
        function initData() {
            requestData();
            initDropDown();
        }

        /**
         * [requestData description: 获取数据]
         * @return {[type]} [description]
         */
        function requestData() {
            var params = $scope.status.params;
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $scope.data.items = data.DATA;

                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";

                $scope.data.selectedArray = [];
            });
        }

        /**
         * [initDropDown description: 初始化下拉框]
         * @return {[type]} [description]
         */
        function initDropDown() {
            // 初始化稿件类型
            $scope.performDocStatusName = initSingleSelecet.docType();
            $scope.performDocStatusSelected = angular.copy($scope.performDocStatusName[0]);

            // 初始化稿件时间
            $scope.performTimeStatus = initSingleSelecet.timeType();
            $scope.performTimeStatusSelected = angular.copy($scope.performTimeStatus[0]);

            // 分页pageer显示的最大个数
            $scope.maxSize = 6;
        }

        /**
         * [queryByDropdown description: 筛选条件触发后请求数据]
         * @param  {[type]} key   [description: 请求对象参数key]
         * @param  {[type]} value [description: 请求对象值]
         */
        $scope.queryByDropdown = function(key, value) {
            $scope.status.params[key] = value;
            // $scope.status.params.CurrPage = $scope.status.copyCurrPage = $scope.page.CURRPAGE = "1";
            requestData();
        }

        /**
         * [checkSingle description: 单选]
         * @param  {[type]} val [description: 单个对象]
         */
        $scope.checkSingle = function(val) {
            if ($scope.data.selectedArray.indexOf(val) < 0) {
                // 向数组末尾添加元素
                $scope.data.selectedArray.push(val);
            } else {
                // 从已有的数组显示选取的元素
                $scope.data.selectedArray.splice($scope.data.selectedArray.indexOf(val), 1);
            }
        }

        /**
         * [checkAll description: 全选]
         * @return {[type]} [description]
         */
        $scope.checkAll = function() {
            $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : [].concat($scope.data.items);
        }

        /**
         * [pageChanged description: 分页 下一页]
         * @return {[type]} [description]
         */
        $scope.pageChanged = function() {
            $scope.status.params.CurrPage = $scope.page.CURRPAGE;
            $scope.status.jumpCurrPage = $scope.page.CURRPAGE;
            requestData();
        }

        /**
         * [jumpToPage description: 跳转指定页面]
         * @return {[type]} [description]
         */
        $scope.jumpToPage = function() {
            $scope.status.params.CurrPage = $scope.status.jumpCurrPage;
            $scope.page.CURRPAGE = $scope.status.jumpCurrPage;
            requestData();
        }

        /**
         * [batchSave description: 批量保存]
         * @return {[type]} [description]
         */
        $scope.batchSave = function() {
            $scope.status.batchOperateBtn.clickStatus = "batchSave";
            var saveSelectedArray = [];
            // 初评
            if ($scope.data.disableZP) {
                angular.forEach($scope.data.selectedArray, function(data, index) {
                    saveSelectedArray[index] = {
                        "Title": data.TITLE,
                        "MLFDocId": data.METADATAID,
                        "Author": data.TRUEAUTHOR,
                        // 初评
                        "CPScore": data.CPSCORE,
                        // 报纸媒体类型为3
                        "MediaType": 3,
                        "Remarks": data.REMARKS,
                        "SiteId": $stateParams.PaperId,
                        "ChannelId": $stateParams.BanMianId,
                        "PubTime": data.PUBDATE.substring(0, 10)
                    }
                });

                // 初评绩效参数
                var batchSaveCPParams = {
                    "serviceid": "mlf_jxkh",
                    "methodname": "saveCPJXKHs",
                    "ArrayJXKH": JSON.stringify(saveSelectedArray)
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), batchSaveCPParams, "post").then(function(data) {
                    trsconfirm.alertType("批量初评保存成功", "", "success", false, function() {
                        requestData();
                    });
                });
            }
            // 终评
            else if ($scope.data.disableCP) {
                angular.forEach($scope.data.selectedArray, function(data, index) {
                    saveSelectedArray[index] = {
                        "Title": data.TITLE,
                        "MLFDocId": data.METADATAID,
                        "Author": data.TRUEAUTHOR,
                        // 终评
                        "ZPScore": data.ZPSCORE,
                        // 报纸媒体类型为3
                        "MediaType": 3,
                        "Remarks": data.REMARKS,
                        "SiteId": $stateParams.PaperId,
                        "ChannelId": $stateParams.BanMianId,
                        "PubTime": data.PUBDATE.substring(0, 10)
                    }
                });
                // 终评绩效参数
                var batchSaveZPParams = {
                    "serviceid": "mlf_jxkh",
                    "methodname": "saveZPJXKHs",
                    "ArrayJXKH": JSON.stringify(saveSelectedArray)
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), batchSaveZPParams, "post").then(function(data) {
                    trsconfirm.alertType("批量终评保存成功", "", "success", false, function() {
                        requestData();
                    });
                });
            } else if ($scope.data.disableCP && $scope.data.disableZP) {
                trsconfirm.alertType("请填写初评/终评数额", "", "error", false, function() {

                });
            }
        }

        /**
         * [save description: 保存单条数据]
         * @param  {[type]} item [description]
         */
        $scope.save = function(item) {
            if ($scope.data.disableZP) {
                var params = {
                    "serviceid": "mlf_jxkh",
                    "methodname": "saveCPJXKH",

                    "Title": item.TITLE,
                    "MLFDocId": item.METADATAID,
                    "Author": item.TRUEAUTHOR,
                    "CPScore": item.CPSCORE,
                    "MediaType": 3, // 报纸媒体类型为3
                    "Remarks": item.REMARKS,
                    "SiteId": $stateParams.PaperId,
                    "ChannelId": $stateParams.BanMianId,
                    "PubTime": item.PUBDATE.substring(0, 10)
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'POST').then(function(data) {
                    trsconfirm.alertType("保存初评成功", "", "success", false, function() {
                        requestData();
                    });

                });
            }
            if ($scope.data.disableCP) {
                var params = {
                    "serviceid": "mlf_jxkh",
                    "methodname": "saveZPJXKH",

                    "Title": item.TITLE,
                    "MLFDocId": item.METADATAID,
                    "Author": item.TRUEAUTHOR,
                    "ZPScore": item.ZPSCORE,
                    "MediaType": 3, // 报纸媒体类型为3
                    "Remarks": item.REMARKS,
                    "SiteId": $stateParams.PaperId,
                    "ChannelId": $stateParams.BanMianId,
                    "PubTime": item.PUBDATE.substring(0, 10)
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'POST').then(function(data) {
                    trsconfirm.alertType("保存终评成功", "", "success", false, function() {
                        requestData();
                    });
                });
            }
            if ($scope.data.disableCP && $scope.data.disableZP) {
                trsconfirm.alertType("请填写初评/终评数额", "", "error", false, function() {

                });
            }
        }

        /**
         * [validCP description: 初评数额验证]
         * @param  {[type]} item [description]
         * @param  {[type]} num  [description]
         * @return {[type]}      [description]
         */
        $scope.validCP = function(item, num) {
            if (num !== "") {
                $scope.data.disableZP = true;
                var regExp = new RegExp(/^(0|[1-9][0-9]?|100)$/);
                if (!regExp.test(num.toString())) {
                    item.invalidCP = true;
                    $scope.invalid = true;
                } else {
                    item.invalidCP = false;
                    $scope.invalid = false;
                }
            } else {
                item.invalidCP = false;
                $scope.invalid = false;
            }
        };
        
        /**
         * [validZP description: 终评数额验证]
         * @param  {[type]} item [description]
         * @param  {[type]} num  [description]
         * @return {[type]}      [description]
         */
        $scope.validZP = function(item, num) {
            if (num !== "") {
                $scope.data.disableCP = true;
                var regExp = new RegExp(/^(0|[1-9][0-9]?|100)$/);
                if (!regExp.test(num.toString())) {
                    item.invalidZP = true;
                    $scope.invalid = true;
                } else {
                    item.invalidZP = false;
                    $scope.invalid = false;
                }
            } else {
                item.invalidZP = false;
                $scope.invalid = false;
            }
        };

        /**
         * [refresh description: 刷新]
         * @return {[type]} [description]
         */
        $scope.refresh = function() {
            // $scope.status.params.CurrPage = 1;
            // requestData();
            $state.go('perform.newspaper', { PaperId: $stateParams.PaperId, BanMianId: $stateParams.BanMianId }, { reload: true });
        }
    }
]);
