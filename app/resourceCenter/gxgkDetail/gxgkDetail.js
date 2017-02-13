/**
 * Author:XCL
 * 
 * Time:2016-03-20
 */
"use strict";
angular.module('resourceCenterGxgkDetailModule', [])
    .controller('resourceCenterGxgkDetailCtrl', ['$scope', '$q', '$state', '$stateParams', '$window', 'trsHttpService', 'trsconfirm', 'resourceCenterService', 'resCtrModalService', 'localStorageService', 'storageListenerService', 'trsPrintService', function($scope, $q, $state, $stateParams, $window, trsHttpService, trsconfirm, resourceCenterService, resCtrModalService, localStorageService, storageListenerService, trsPrintService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                "serviceid": "mlf_myrelease",
                // "methodname": "getNewsDoc",
                //"MetaDataId": $stateParams.metadataid
            };
            $scope.status = {
                methodname: {
                    1: "getNewsShareDoc",
                    2: "getPicsShareDoc"
                },
                previewMetadataid: [],
                previewMethodname: [],
                //是否选中
                ischoose: {
                    mark: false,
                    key: ''
                },
                methodnameMapping: {
                    "getNewsShareDoc": 1,
                    "getPicsShareDoc": 2
                },
                sourcename: "",
                selectArrayIdCache: localStorageService.get('newspaperPreviewSelectArray') || [],
            };
            $scope.data = {
                printResult: [],
                typeOfAttachmentArr: [],
            }
        }

        function initData() {
            requestData($stateParams.metadataid, $scope.status.methodname[$stateParams.type]);
            getCurPageIdsByCache();
            initQqjccInfos();
            //川报修改
            isCbPic();
        }

        function requestData(metadataid, methodname) {
            $scope.params.methodname = methodname;
            $scope.params.MetaDataId = metadataid;
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                document.title = data.TITLE;
                $scope.gxgkDetails = data;
                $scope.status.sourcename = data.SOURCENAME;
                getAttachFileType(data.ATTACHFILE);
                getAttachFileType(data.SPECIALFILE);
                isMark(data.METADATAID);
            });
        }

        //关闭
        $scope.close = function() {
            $window.close();
        };

        //收藏
        $scope.collect = function() {
            var params = {
                "serviceid": "mlf_myrelease",
                "methodname": "collect",
                "MetaDataIds": $stateParams.metadataid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType("收藏成功!", "", "success", false, "");
            });
        };

        //创作轴
        $scope.creationAxis = function() {
            var params = {
                "serviceid": "mlf_releaseSource",
                "methodname": "setCreation",
                "MetaDataId": $stateParams.metadataid
            };
            resourceCenterService.setBigDataCreation(params).then(function(data) {
                trsconfirm.alertType("该稿件已成功加入创作轴!", "", "success", false);
            });
        };

        // 取稿
        $scope.openTakeDraftModal = function() {
            var params = {
                serviceid: "mlf_releasesource",
                methodname: "fetch",
                MetaDataIds: $stateParams.metadataid,
                SourceName: "资源中心-共享稿库-" + $scope.status.sourcename
                    // nodename: $stateParams.nodename,
                    // nodeId: $scope.nodeId,
            };
            var modalInstance = resCtrModalService.fullTakeDraft(params, true);
            modalInstance.result.then(function() {
                storageListenerService.addListenerToResource("takeDraft");
                $window.close();
            });
        };
        /**
         * [printBtn description：打印]
         */
        $scope.printBtn = function() {
            requestPrintVersion($stateParams.metadataid).then(function(data) {
                requestPrintData(data);
            });
        };
        /**
         * [requestPrintVersion description：打印请求流程]
         */
        function requestPrintVersion(item) {
            var deferred = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), { serviceid: "mlf_metadatalog", methodname: "query", MetaDataId: item }, 'get').then(function(data) {
                deferred.resolve(data.DATA);
            });
            return deferred.promise;
        }
        /**
         * [requestPrintVersion description：打印请求详情]
         */
        function requestPrintData(version) {
            var params = {
                "serviceid": "mlf_myrelease",
                "methodname": $scope.status.methodname[$stateParams.type],
                "MetaDataId": $stateParams.metadataid
            };
            $scope.data.printResult = [];
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                var result = data;
                data.VERSION = version;
                data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
                $scope.data.printResult.push(result);
                trsPrintService.trsPrintShare($scope.data.printResult);
            });
        }
        // //选择
        // $scope.select = function(){
        //     //console.log($scope.status.previewMetadataid);
        //     var selectedDoc = $scope.status.previewMetadataid.indexOf($scope.gxgkDetails.METADATAID);

        // };

        //从缓存中获取当前页的所有metadataids
        function getCurPageIdsByCache() {
            $scope.status.previewMetadataid = localStorageService.get('resCtrGxgkDetailIdCache');
            $scope.status.previewMethodname = localStorageService.get('resCtrGxgkDetailMethodnameCache');
            if ($scope.status.selectArrayIdCache = localStorageService.get('newspaperPreviewSelectArray') === null) {
                localStorageService.set('newspaperPreviewSelectArray', []);
                $scope.status.selectArrayIdCache = localStorageService.get('newspaperPreviewSelectArray');
            } else {
                $scope.status.selectArrayIdCache = localStorageService.get('newspaperPreviewSelectArray');
            }
        }
        //选择按钮
        $scope.select = function() {
            var selectCurrentr = angular.copy($scope.gxgkDetails.METADATAID);
            $scope.status.selectArrayIdCache = localStorageService.get('newspaperPreviewSelectArray');
            if ($scope.status.selectArrayIdCache === null || $scope.status.selectArrayIdCache === undefined || $scope.status.selectArrayIdCache === '') {
                localStorageService.set('newspaperPreviewSelectArray', [selectCurrentr]);
                $scope.status.selectArrayIdCache = [selectCurrentr];
                isMark(selectCurrentr);
            }
            if (($scope.status.selectArrayIdCache.indexOf(selectCurrentr)) > -1) {
                $scope.status.selectArrayIdCache.splice($scope.status.selectArrayIdCache.indexOf(selectCurrentr), 1);
                localStorageService.set('newspaperPreviewSelectArray', $scope.status.selectArrayIdCache);
            } else {
                $scope.status.selectArrayIdCache.push(selectCurrentr);
                localStorageService.set('newspaperPreviewSelectArray', $scope.status.selectArrayIdCache);
            }
            isMark(selectCurrentr);
        };
        //是否打标记
        function isMark(metadata) {
            if ($scope.status.selectArrayIdCache === "" || $scope.status.selectArrayIdCache === null)
                return;
            if ($scope.status.selectArrayIdCache.indexOf(metadata) < 0 || $scope.status.selectArrayIdCache.indexOf(metadata) === undefined) {
                $scope.status.ischoose.mark = false;
            } else {
                $scope.status.ischoose.mark = true;
            }
        }
        //上一页
        $scope.prevPage = function() {
            if (($scope.status.previewMetadataid.indexOf($scope.gxgkDetails.METADATAID) - 1 < 0)) {
                trsconfirm.alertType("您当前处于第一页", "", "warning", false, "");
                return;
            }
            var metadataid = $scope.status.previewMetadataid[($scope.status.previewMetadataid.indexOf($scope.gxgkDetails.METADATAID)) - 1];
            var methodname = $scope.status.previewMethodname[($scope.status.previewMetadataid.indexOf($scope.gxgkDetails.METADATAID)) - 1];
            //requestData(metadataid,methodname);
            $state.go("resourcegxgkdetail", {
                metadataid: metadataid,
                type: $scope.status.methodnameMapping[methodname]
            });
        };

        //下一页
        $scope.nextPage = function() {
            if (($scope.status.previewMetadataid.indexOf($scope.gxgkDetails.METADATAID)) + 1 === $scope.status.previewMetadataid.length) {
                trsconfirm.alertType("您当前处于末页", "", "warning", false, "");
                return;
            }
            var metadataid = $scope.status.previewMetadataid[($scope.status.previewMetadataid.indexOf($scope.gxgkDetails.METADATAID)) + 1];
            var methodname = $scope.status.previewMethodname[($scope.status.previewMetadataid.indexOf($scope.gxgkDetails.METADATAID)) + 1];

            //requestData(metadataid,methodname);            
            $state.go("resourcegxgkdetail", {
                metadataid: metadataid,
                type: $scope.status.methodnameMapping[methodname]
            });
        };

        //初始化取签见撤重信息
        function initQqjccInfos() {
            var params = {
                "serviceid": "mlf_releasesource",
                "methodname": "queryOpers",
                "MetaDataId": $stateParams.metadataid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $scope.qqjccInfos = data;
            });
        }


        //川报修改
        function isCbPic() {
            if (angular.isDefined($stateParams.iscbpic) && $stateParams.iscbpic == 1) {
                $scope.isCbPic = true;
            } else {
                $scope.isCbPic = false;
            }
        }

        /**
         * [getAttachFileType description]获取附件后缀
         * @param  {[obj]} params [description]请求参数
         * @return {[obj]}        [description]请求返回值
         */
        function getAttachFileType(data) {
            angular.forEach(data, function(value, key) {
                var attachmentType = value.APPFILE.split(".");
                var length = value.APPFILE.split(".").length;
                $scope.data.typeOfAttachmentArr.push(attachmentType[length - 1]);
            });
        }
    }]);
