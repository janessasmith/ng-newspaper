/**
 * Created by SMG on 2016/3/18.
 * Edit by ma.rongqin on 2016/3/20.
 */
'use strict';
angular.module("printModalModule", ['trsPrintModule'])
    .controller("printModalCtrl", ['$http', '$q', '$scope', '$modalInstance', "$filter", "trsPrintService", 'params', "trsHttpService", "trsspliceString",
        function($http, $q, $scope, $modalInstance, $filter, trsPrintService, params, trsHttpService, trsspliceString) {
            initStatus();
            initData();
            /*初始化状态*/
            function initStatus() {
                $scope.data = {
                    params: params,
                    currUserInfo: ""
                };
                $scope.status = {
                    date: "",
                    today: ""
                }
            }
            /*初始化数据*/
            function initData() {
                getSystemTime();
            }
            $scope.close = function() {
                $modalInstance.dismiss();
            };

            $scope.printConfirm = function() {
                // $q.all({ first: $http.get('json1.txt'), second: $http.get('json2.txt') }).then(function(arr) {
                //     angular.forEach(arr, function(d) {
                //         console.log(d.data);
                //     });
                //     trsPrintService.trsPrintDateList("data");
                // });

                // var params = {
                //     date: $filter('date')($scope.status.date).toString(),
                //     sourceName: $scope.data.params.sourceName
                // }
                // trsPrintService.trsPrintDateList(params);
                // $modalInstance.dismiss();
                requestBasicInfo().then(function(data) {
                    return requestTakeDraftInfo(data.content);
                }).then(function(data) {
                    var params = {
                        date: $filter('date')($scope.status.date).toString(),
                        sourceName: $scope.data.params.sourceName,
                        draftList: data
                    }
                    trsPrintService.trsPrintDateList(params);
                    $modalInstance.dismiss();
                })
            };
            /**
             * [requestBasicInfo description]请求列表基本信息
             */
            function requestBasicInfo() {
                var defer = $q.defer();
                // var params = {
                //     'typeId': "zyzx",
                //     'serviceId': $scope.data.params.channelName,
                //     'modelid': 'print',
                //     'typeName': $scope.data.params.typeName,
                //     'keyword': { 'time': $filter('date')($scope.status.date, "yyyy-MM-dd").toString() + ',' + $filter('date')($scope.status.date, "yyyy-MM-dd").toString() }
                // }
                var params = {
                    serviceid: "mlf_xhsgsource",
                    methodname: "queryXHSGDocs"
                };
                params.keyword = JSON.stringify(params.keyword);
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    defer.resolve(data);
                });
                return defer.promise;
            }
            /**
             * [requestBasicInfo description]请求取稿信息
             */
            function requestTakeDraftInfo(basicInfo) {
                var defer = $q.defer();
                var draftList = angular.copy(basicInfo);
                var params = {
                    'serviceid': 'mlf_bigdataexchange',
                    'methodname': 'queryQUGroupList',
                    'guids': trsspliceString.spliceString(draftList, "ZB_GUID", ",")
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    if (angular.isDefined(data)) {
                        var content = data.DATA;
                        for (var i = 0; i < content.length; i++) {
                            for (var j = 0; j < draftList.length; j++) {
                                if (content[i].GUID == draftList[j].ZB_GUID) {
                                    draftList[j].QULIST = angular.copy(content[i].QULIST);
                                    break;
                                }
                            }
                        }
                    }
                    defer.resolve(draftList);
                });
                return defer.promise;
            }
            /** [getSystemTime  description] 获取系统时间 */
            function getSystemTime() {
                var params = {
                    serviceid: "mlf_fusion",
                    methodname: "getServiceTime"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        $scope.status.today = $scope.status.date = new Date(data.LASTOPERTIME);
                    });
            }
        }
    ]);
