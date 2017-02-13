"use strict";
angular.module('newspaperSampleReviewModule', [
    'newspaperSampleReviewRouterModule',
    "editCenNewspaperSampleDetailModule",
    'trsNavLocationModule'
]).
controller('newspaperSampleReviewCtrl', ["$scope", "$q", "$filter", "$timeout", "$stateParams", "trsHttpService", "trsspliceString", "trsconfirm", "trsPrintService", "initSingleSelecet", "editcenterRightsService", "editingCenterService", 'editNewspaperService',
    function($scope, $q, $filter, $timeout, $stateParams, trsHttpService, trsspliceString, trsconfirm, trsPrintService, initSingleSelecet, editcenterRightsService, editingCenterService, editNewspaperService) {
        initStatus();
        initData();
        //初始化状态
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 10
            };
            $scope.status = {
                isSigned: true, //已签
                isUnSigned: true, //未签
                isReviewed: false, //已评审
                isUnReviewed: false, //未评审
                noSignCount: 0,
                batchOperateBtn: {
                    "hoverStatus": "",
                    "clickStatus": ""
                },

            };
            $scope.params = {
                "serviceid": "mlf_paper",
                "methodname": "queryComposePageInfos",
                "PaperId": $stateParams.paperid,
                "DieCi": "",
                "ViewStatusForQianFa": "",
                "ViewStatusForShenHe": "",
                "PubDate": ""
            };
            $scope.data = {
                selectedItem: {},
                selectedDieCiArray: [],
                selectedArray: [],
                items: [],
                DieCiArray: [],
                time: {
                    today: "",
                    queryTime: ""
                },
                queryTimeOper: {
                    add: "后一天",
                    today: "今天",
                    minus: "前一天"
                }
            };
            $scope.$watch('pubDate', function(newValue, oldValue) {
                if (($scope.pubDate != "") && (newValue != oldValue)) {
                    $scope.data.time.queryTime = $scope.params.PubDate = $filter('date')(newValue, "yyyy-MM-dd").toString();;
                    requestData();
                }
            });
            queryBySingleSelect();

        }

        //初始化数据
        function initData() {
            queryDieCiByPaperId();
            //默认请求当天数据
            getSystemTime().then(function(today) {
                var defaultDate;
                if (new Date().getHours() < 12) {
                    defaultDate = today;
                } else {
                    var timeStamp = new Date(today);
                    var timeStampAfter = timeStamp.setDate(timeStamp.getDate() + 1);
                    defaultDate = $filter('date')(timeStampAfter, "yyyy-MM-dd").toString();
                }
                $scope.data.time.queryTime = $scope.params.PubDate = defaultDate;
                requestData();
            });
            //按钮权限
            editcenterRightsService.initNewspaperListBtn("paper.dysy", $stateParams.paperid).then(function(data) {
                $scope.status.btnRights = data;
            });
            //当前报纸信息
            editingCenterService.getSiteInfo($stateParams.paperid).then(function(data) {
                $scope.data.paperMsg = data;
            });
        }

        /**
         * [requestData description]数据请求函数
         */
        function requestData() {
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.data.items = data;
            });

        }
        /**
         * [promptRequest description]请求成功
         * @param {[obj]} params [description] 请求参数
         * @param {[string]} info [description] 提示信息
         */
        function promptRequest(params, info) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                trsconfirm.alertType(info, "", "success", false, function() {
                    requestData();
                })
            })
        }
        /**
         * [getSystemTime description]查询当前系统时间
         */
        function getSystemTime() {
            var deferred = $q.defer();
            var params = {
                serviceid: "mlf_fusion",
                methodname: "getServiceTime"
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.time.today = $filter('limitTo')(data.LASTOPERTIME, 10).toString();
                $scope.data.time.queryTime = $filter('limitTo')(data.LASTOPERTIME, 10).toString();
                $scope.pubDate = "";
                deferred.resolve($scope.data.time.today);
            })
            return deferred.promise;
        }
        /**
         * [queryDieCiByPaperId description]前一天，后一天，今天
         * @param {[obj]} params [description] 操作
         */
        $scope.queryTime = function(oper) {
                var date = angular.copy($scope.data.time.queryTime);
                var operTime = -1;
                if (oper == $scope.data.queryTimeOper.add || oper == $scope.data.queryTimeOper.minus) {
                    operTime = oper == $scope.data.queryTimeOper.minus ? operTime : 1
                    var timeStamp = new Date($scope.data.time.queryTime);
                    var timeStampAfter = timeStamp.setDate(timeStamp.getDate() + operTime);
                    $scope.data.time.queryTime = date = $filter('date')(timeStampAfter, "yyyy-MM-dd").toString();
                    $scope.pubDate = ""
                } else if (oper == $scope.data.queryTimeOper.today) {
                    getSystemTime().then(function(time) {
                        return time
                    }).then(function(data) {
                        $scope.params.PubDate = data;
                        requestData();
                    })
                }
                if (oper != $scope.data.queryTimeOper.today) {
                    $scope.params.PubDate = date;
                    requestData();
                }
            }
            /**
             * [queryDieCiByPaperId description]按照叠次查询列表
             * @return {[type]} [description]
             */
        function queryDieCiByPaperId() {
            var params = {
                serviceid: "mlf_paper",
                methodname: "queryDieCis",
                PaperId: $stateParams.paperid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                if (data.length < 1) return;
                $scope.data.DieCiArray = data;
                angular.forEach(data, function(value, key) {
                    $scope.data.selectedDieCiArray.push(value);
                });
            });
        }
        /**
         * [queryBySingleSelect description]checkbox触发列表
         * @param {[string]} key [description] 参数
         * @return {[type]} [description]
         */
        $scope.queryBySingleSelect = function(key) {
            $scope.status[key] = !$scope.status[key];
            queryBySingleSelect();
            requestData();
        };
        /**
         * [queryBySingleSelect description]未签、已签、评审、未评审
         */
        function queryBySingleSelect() {
            $scope.params.ViewStatusForQianFa = $scope.status.isSigned && $scope.status.isUnSigned ? "-1" : ($scope.status.isSigned ? "1" : "2");
            $scope.params.ViewStatusForShenHe = $scope.status.isReviewed && $scope.status.isUnReviewed ? "-1" : ($scope.status.isReviewed ? "3" : "4");
            if (!$scope.status.isSigned && !$scope.status.isUnSigned) {
                delete $scope.params.ViewStatusForQianFa
            }
            if (!$scope.status.isReviewed && !$scope.status.isUnReviewed) {
                delete $scope.params.ViewStatusForShenHe
            }
        }
        /**
         * [setSelectedDieCi description] 选择叠次
         * @param {[type]} item [description] 叠次对象
         */
        $scope.setSelectedDieCi = function(item) {
            var index = $scope.data.selectedDieCiArray.indexOf(item);
            if (index > -1) $scope.data.selectedDieCiArray.splice(index, 1);
            else {
                $scope.data.selectedDieCiArray.push(item);
            }
            $scope.params.DieCi = trsspliceString.spliceString($scope.data.selectedDieCiArray, 'CHANNELID', ",");
            requestData();
        };
        /**
         * [singleSelecte description]单选
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        $scope.singleSelecte = function(item) {
            var index = $scope.data.selectedArray.indexOf(item);
            if (index > -1) $scope.data.selectedArray.splice(index, 1);
            else {
                $scope.data.selectedArray.push(item);
            }
        };
        // /**
        //  * [outSending description] 邮件外发
        //  * @param {[type]} item [description] 
        //  */
        // $scope.outSending = function() {
        //     editingCenterService.outSending("", function(result) {
        //         outSendingDraft(result.selectItems);
        //     });
        // };
        // /**
        //  * [outSendingDraft description] 邮件外发方法
        //  * @param {[obj]} items [description] 选中的要外发的邮箱
        //  */
        // function outSendingDraft(items) {
        //     var userids = trsspliceString.spliceString(items, 'EMAIL', ",");
        //     var draftids = trsspliceString.spliceString($scope.data.selectedArray, 'METADATAID', ",");
        //     var params = {
        //         serviceid: "mlf_mailoutgoingOper",
        //         methodname: "paperDaYangShenYueSendEmail",
        //         Emails: userids,
        //         MetaDataIds: draftids
        //     };
        //     promptRequest(params, '邮件外发成功');
        // }
        // /**
        //  * [exportDraft description] 导出稿件
        //  */
        // $scope.exportDraft = function() {
        //     editingCenterService.exportDraft(trsspliceString.spliceString($scope.data.selectedArray,
        //         'METADATAID', ','));
        // };
        /**
         * [refresh description] 刷新
         */
        $scope.refresh = function() {
            requestData();
        };
        // /**
        //  * [printBtn description] 批量打印功能
        //  */
        // $scope.printBtn = function() {
        //     var metaDataIds = [];
        //     for (var i = 0; i < $scope.data.selectedArray.length; i++) {
        //         var selectType = [$scope.data.selectedArray[i]];
        //         if (selectType.length) {
        //             metaDataIds.push(trsspliceString.spliceString(selectType,
        //                 'METADATAID', ','));
        //         }
        //     }
        //     var params = {
        //         serviceid: "mlf_paper",
        //         methodname: "queryViewDatas",
        //         MetaDataIds: metaDataIds.join(",")
        //     };
        //     trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
        //         trsPrintService.trsPrintDocument(data);
        //     });
        // };
        /**
         * [enforcedUlock description] 强制解锁
         */
        $scope.enforcedUlock = function() {
                trsconfirm.confirmModel("强制解锁", "确定要强制解锁版面", function() {
                    var params = {
                        serviceid: "mlf_paper",
                        methodname: "stopDaYangCompose",
                        ComposeIds: trsspliceString.spliceString($scope.data.selectedArray, 'COMPOSEPAGEINFOID', ","),
                        PaperId: $stateParams.paperid
                    }
                    promptRequest(params, '强制解锁成功');
                })
            }
            /**
             * [processRecordingView description] 流程记录窗口
             * @param {[obj]} item [description] 当前条目
             */
        $scope.processRecordingView = function(item) {
            editNewspaperService.processRecording(item.FLOWRECORD);
        }
    }
]);
