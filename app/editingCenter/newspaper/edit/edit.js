/*
author:wang.jiang 2016-1-16
 */
"use strict";
angular.module('editctrNewspaperEditModule', [
        "editctrNewspaperRouterModule",
        "editctrNewspaperTextModule",
        "editctrNewspaperPicModule"
    ])
    .controller('Editctrnewspapereditctrl', ["$scope", "$modal", "$compile", "$state", "$timeout", "$location", "$anchorScroll", '$stateParams', '$validation', "$filter", "trsHttpService", 'initiWoDataService', 'SweetAlert', "initVersionService", "jsonArrayToStringService", "trsResponseHandle", "trsconfirm", "$q", "initSingleSelecet", "iWoService", "myManuscriptService", "editingCenterService", "initeditctrBtnsService", "filterEditctrBtnsService", "initDataNewspaperService",
        function($scope, $modal, $compile, $state, $timeout, $location, $anchorScroll, $stateParams, $validation, $filter, trsHttpService, initiWoDataService, SweetAlert, initVersionService, jsonArrayToStringService, trsResponseHandle, trsconfirm, $q, initSingleSelecet, iWoService, myManuscriptService, editingCenterService, initeditctrBtnsService, filterEditctrBtnsService, initDataNewspaperService) {
            initStatus();
            initData();
            //锚点切换开始
            $scope.goto = function(id) {
                $location.hash(id);
                $anchorScroll();
            };

            function initStatus() {
                $scope.status = {
                    params: {
                        "serviceid": "mlf_paper",
                        "methodname": "queryViewDatas",
                        "MetaDataIds": $stateParams.metadata
                    },
                    data: {
                        meataInfo: {}
                    }
                };
            }

            function initData() {
                initMataData().then(function(data) {
                    //初始化稿件体裁下拉框
                    // $scope.status.data.meataInfo.draftResources = "";
                });
                $scope.list = initDataNewspaperService.initNewspaperNews();
            }

            function initMataData() {
                var deferred = $q.defer();
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.params, "get")
                    .then(function(data) {
                        $scope.status.data.meataInfo = data[0];
                        deferred.resolve();
                    });
                return deferred.promise;
            }

            function save() {
                var deferred = $q.defer();
                $scope.list.DOCRELTIME = $filter('date')(new Date(), "yyyy-MM-dd HH:mm").toString();
                var list = angular.copy($scope.list);
                list.serviceid = "mlf_paper";
                list.methodname = "saveNewsDocument";
                list.ObjectId = $stateParams.metadata;

                //$validation.validate($scope.drafForm.authorForm);
                $validation.validate($scope.newsForm)
                    .success(function() {
                        $scope.newsForm.$setPristine();
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), list, "post").then(function(data) {
                            //保存稿件成功后
                        });
                    });
            }


        }
    ]);
