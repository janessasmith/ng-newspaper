/**
 * Author:XCL
 *
 * Time:2016-01-24
 */
"use strict";
angular.module('resourceCenterDetailModule', [])
    .controller('resourceCenterDetailCtrl', ['$scope', '$location', '$q', '$sce', '$stateParams', '$window', 'trsHttpService', 'resourceCenterService', 'editNewspaperService', 'trsconfirm', 'resCtrModalService', 'storageListenerService', "trsPrintService", function($scope, $location, $q, $sce, $stateParams, $window, trsHttpService, resourceCenterService, editNewspaperService, trsconfirm, resCtrModalService, storageListenerService, trsPrintService) {
        var serviceid, guid = $stateParams.guid,
            channelName = $stateParams.channel;
        initStatus();
        initData();

        function initStatus() {
            //判断是否有频道名称
            if ($stateParams.channel) {
                serviceid = $stateParams.service;
            } else {
                serviceid = 'jtcpg';
            }
            $scope.params = {
                "serviceid": serviceid,
                "modelid": "detailData",
                "guid": guid,
                "channelName": channelName,
                "typeid": "zyzx",
                "indexName": $stateParams.indexname,
            };
            $scope.status = {
                "currSite": "",
                "firstRelatedManuscriptKey": "",
                "initBtn": true,
                "isAllManuShow": false,
                "isExtraFieldsShow": false,
                "isReprintShow": false,
                "isEnterWebsite": false,
                "isEnterApp": false,
                // 川报修改
                "methodname":{
                    1:"getNewsXHSG",
                    2:"getPicXHSG"
                },
                //川报修改{}
                "customMethodname":{
                    1:"getNewsCusModalDoc",
                    2:"getPicCusModalDoc"
                }
            };
            $scope.status.isProducttype = angular.isDefined($stateParams.indexname) ? true : false;
            $scope.relatedManuscripts = [];
            // 川报修改
            $scope.data = {
                printResult:[]
            };
        }

        //初始化数据
        function initData() {
            // if (channelName == "gxgk") {
            //     resourceCenterService.getNewsDoc({
            //         "MetaDataId": guid
            //     }).then(function(item) {
            //         var arr = [];
            //         for (var name in item.METALOGOURL) {
            //             var imgs = item.METALOGOURL[name].split(",");
            //             for (var i = 0; i < imgs.length; i++) {
            //                 arr.push(imgs[i]);
            //             }
            //         }
            //         $scope.detailInfos = {
            //             "DOCTITLE": item.TITLE,
            //             "DOCAUTHOR": item.SIGNATUREAUTHOR,
            //             "ZB_SOURCE_SITE": item.NEWSSOURCES,
            //             "ZB_KEYWORDS5_CHAR": item.KEYWORDS,
            //             "DOCPUBTIME": item.CRTIME,
            //             "CONTENT": item.CONTENT,
            //             "ImgsUrl": arr,
            //             "HTMLCONTENT": item.HTMLCONTENT
            //         };
            //         $scope.isGxgkContent = angular.isDefined($scope.detailInfos.HTMLCONTENT) ? true : false;
            //         $scope.detailInfos.HTMLCONTENT = $sce.trustAsHtml($scope.detailInfos.HTMLCONTENT);
            //     });
            // } else {
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                if (data && data.content) {
                    var areaname = $location.search().areaname;
                    //当稿件来自新华社稿时将图片放在文字上方
                    changePicPosition(data);

                    $scope.items = data.summary_info.hybaseField;
                    // $scope.indexName = data.summary_info.indexName;
                    $scope.detailIndexname = data.summary_info.indexName;
                    $scope.detailInfos = data.content[0];
                    $scope.detailInfos.CONTENT = data.content[0] && $sce.trustAsHtml(data.content[0].CONTENT);
                    $scope.detailInfos.ZB_AREA_LIST_CN = $scope.detailInfos.ZB_AREA_LIST_CN.replace(/;/g, " ");
                    if (angular.isDefined(areaname)) {
                        $scope.detailInfos.ZB_AREA_LIST_CN = $sce.trustAsHtml($scope.detailInfos.ZB_AREA_LIST_CN.replace(new RegExp(areaname, "g"), "<font color='red'>" + areaname + "</font>"));
                    }
                    $scope.keywords = data.content[0].ZB_KEYWORDS5_CHAR;
                    document.title = data.content[0].DOCTITLE;
                    startSimilarSearch();
                }
            });
            //}
            // 川报修改
            //初始化取签见撤重
            //if (angular.isDefined($stateParams.guid)) {
            initQqjccInfos();
            //}
            //显示川报新华社稿详情
            if (angular.isDefined($stateParams.xhsgsourceid)) {
                initCbDetail();
            }
            //川报修改
            //显示川报自定义稿件详情
            else if(angular.isDefined($stateParams.customid)){
                initCbCustomDetail();
            }

            //成品稿、网站、微信、app稿件显示栏目和源地址字段
            showExtraFields();
            //网站，APP显示转载地址
            showReprint();
            //进入了网站
            showEnterWebsite();
            //进入了APP
            showEnterApp();
        }
        //当稿件来自新华社稿时将图片放在文字上方
        function changePicPosition(data) {
            if (data.content[0] && $stateParams.channel == "xhsg") {
                var img = "",
                    content = angular.copy(data.content[0].CONTENT);
                data.content[0].CONTENT = data.content[0].CONTENT.substring(0, data.content[0].CONTENT.indexOf('<div align="center"><img'));
                img = content.substring(content.indexOf('<div align="center"><img'));
                data.content[0].CONTENT = img + data.content[0].CONTENT;
            }
        }
        //开启相似查询方法
        function startSimilarSearch() {
            var params = {
                "guid": guid,
                "modelid": "start",
                "serviceId": "detailData",
                "keywords": $scope.keywords,
                "typeid": "zyzx",
                "INDEXNAME": $stateParams.indexname
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                var searchId = data.searchId;
                fetchSimilarResults(searchId);
                //获取相似查询结果
                // var params = {
                //     "modelid": "fetch",
                //     "searchId": data.searchId,
                //     "typeid": "zyzx",
                //     "serviceId": "detailData",
                //     "guid": guid,
                //     "keywords": $scope.keywords
                // };
                // trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                //     if (data.isDone === true) {
                //         $scope.relatedManuscripts = data.result;
                //         var arr = [];
                //         angular.forEach(data.result, function(value, key) {
                //             if (angular.isDefined(value.resultSize) && value.resultSize !== 0) {
                //                 arr.push(value);
                //             } else {
                //                 return;
                //             }
                //             $scope.status.isAllManuShow = data.result.indexOf(key).resultSize !== 0 ? true : false;
                //         });
                //         $scope.status.firstRelatedManuscriptKey = arr[0].key;
                //         getRelatedManuscript();
                //     } else {
                //         console.log(false);
                //     }
                // });
            });
        }

        //获取相似查询结果的方法
        function fetchSimilarResults(id) {
            var params = {
                "modelid": "fetch",
                "searchId": id,
                "typeid": "zyzx",
                "serviceId": "detailData",
                "guid": guid,
                "keywords": $scope.keywords
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                $scope.relatedManuscripts = $scope.relatedManuscripts.concat(data.result);
                if (data.isDone === false) {
                    fetchSimilarResults(id);
                } else {
                    var arr = [];
                    angular.forEach($scope.relatedManuscripts, function(value, key) {
                        if (angular.isDefined(value.resultSize) && value.resultSize !== 0) {
                            arr.push(value);
                        } else {
                            return;
                        }
                        $scope.status.isAllManuShow = data.result.indexOf(key).resultSize !== 0 ? true : false;
                    });
                    $scope.status.firstRelatedManuscriptKey = arr[0].key;
                    getRelatedManuscript();
                }
            });
        }

        //显示相关稿件内容
        $scope.showRelatedManuscript = function(item) {
            var params = {
                "modelid": "findFromNavigation",
                "typeid": "zyzx",
                "serviceid": item,
                "channelName": item,
                //"typeName": "field",
                "pageSize": 6,
                "pageNum": 1,
                "keyword": {
                    'detail': $scope.keywords,
                    'guid': $stateParams.guid
                }
            };
            //JSON.stringify:将json对象转换成字符串
            params.keyword = JSON.stringify(params.keyword);
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                $scope.relatedManuLists = data.content;
                $scope.indexname = data.summary_info.indexName;
            });
        };

        //初始化相关稿件内容方法
        function getRelatedManuscript() {
            var params = {
                "modelid": "findFromNavigation",
                "typeid": "zyzx",
                "serviceid": $scope.status.firstRelatedManuscriptKey,
                "channelName": $scope.status.firstRelatedManuscriptKey,
                "pageSize": 6,
                "pageNum": 1,
                "keyword": {
                    'detail': $scope.keywords,
                    'guid': $stateParams.guid
                }
            };
            //JSON.stringify:将json对象转换成字符串
            params.keyword = JSON.stringify(params.keyword);
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                $scope.relatedManuLists = data.content;
                $scope.indexname = data.summary_info.indexName;
            });
        }

        //初始化取签见撤重信息
        function initQqjccInfos() {
            var params = {
                "serviceid": "mlf_bigdataexchange",
                "methodname": "queryFlagList",
                "guid": $stateParams.guid
            };
            // 川报修改
            var cbParams = {
                "serviceid": "mlf_xhsgsource",
                "methodname": "queryFlagListOfXHSG",
                "XHSGSourceId": $stateParams.xhsgsourceid
            };
            // 川报修改{}
            var cbCustomParams = {
                "serviceid": "mlf_cusmodaldoc",
                "methodname": "queryFlagListOfCusModalDoc",
                "CusModalDocId": $stateParams.customid
            };
            if (angular.isDefined($stateParams.xhsgsourceid)) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), cbParams, "post").then(function(data) {
                    $scope.qqjccInfos = data;
                });
            }
            //川报修改{}
            else if(angular.isDefined($stateParams.customid)){
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), cbCustomParams, "post").then(function(data) {
                    $scope.qqjccInfos = data;
                });
            }
            else {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    $scope.qqjccInfos = data;
                });
            }
        }

        //资源中心的成品稿、网站、微信、app,策划中心的近期政策、网站监控、微信监控、app监控,稿件显示栏目和源地址字段
        function showExtraFields() {
            var firstFiledOfIndexname = "";
            if (angular.isDefined($stateParams.indexname)) {
                firstFiledOfIndexname = $stateParams.indexname.split("_")[0];
            }
            if (channelName == "jtcpg" || channelName == "wz" || channelName == "wx" || channelName == "app" || firstFiledOfIndexname == "website" || firstFiledOfIndexname == "weixin" || firstFiledOfIndexname == "app") {
                $scope.status.isExtraFieldsShow = true;
            } else {
                $scope.status.isExtraFieldsShow = false;
            }
        }
        //网站、app,显示该字段
        function showReprint() {
            var firstFiledOfIndexname = "";
            if (angular.isDefined($stateParams.indexname)) {
                firstFiledOfIndexname = $stateParams.indexname.split("_")[0];
            }
            if (channelName == "wz" || channelName == "app" || firstFiledOfIndexname == "website" || firstFiledOfIndexname == "app") {
                $scope.status.isReprintShow = true;
            } else {
                $scope.status.isReprintShow = false;
            }
        }
        //网站显示该字段
        function showEnterWebsite() {
            var firstFiledOfIndexname = "";
            if (angular.isDefined($stateParams.indexname)) {
                firstFiledOfIndexname = $stateParams.indexname.split("_")[0];
            }
            if (channelName == "wz" || firstFiledOfIndexname == "website") {
                $scope.status.isEnterWebsite = true;
            } else {
                $scope.status.isEnterWebsite = false;
            }
        }
        //APP显示该字段
        function showEnterApp() {
            var firstFiledOfIndexname = "";
            if (angular.isDefined($stateParams.indexname)) {
                firstFiledOfIndexname = $stateParams.indexname.split("_")[0];
            }
            if (channelName == "app" || firstFiledOfIndexname == "app") {
                $scope.status.isEnterApp = true;
            } else {
                $scope.status.isEnterApp = false;
            }
        }

        //川报修改
        function initCbDetail() {
            var xhsgType = $stateParams.xhsgtype;
            var xhsgmethod;
            if (xhsgType == 1) {
                xhsgmethod = "getNewsXHSG";
            } else if (xhsgType == 2) {
                xhsgmethod = "getPicXHSG";
            }
            var params = {
                serviceid: "mlf_xhsgsource",
                methodname: xhsgmethod,
                XHSGSourceId: $stateParams.xhsgsourceid
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.detailInfos = data;
            });
        }

        //川报修改{}
        function initCbCustomDetail(){
            var xhsgType = $stateParams.xhsgtype;
            var xhsgmethod;
            if (xhsgType == 1) {
                xhsgmethod = "getNewsCusModalDoc";
            } else if (xhsgType == 2) {
                xhsgmethod = "getPicCusModalDoc";
            }
            var params = {
                serviceid: "mlf_cusmodaldoc",
                methodname: xhsgmethod,
                CusModalDocId: $stateParams.customid   
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.detailInfos = data;
            });
        }

        // 收藏
        $scope.collect = function() {
            var params = {
                serviceid: "mlf_bigdataexchange",
                methodname: "collect",
                guid: $stateParams.guid,
                // channelName: $stateParams.channel,
                indexname: $scope.detailIndexname,
            };
            // 川报修改
            var cbParams = {
                serviceid: "mlf_xhsgoper",
                methodname: "collects",
                XHSGIds: $stateParams.xhsgsourceid
            };
            //川报修改{}
            var cbCustomParams = {
                serviceid: "mlf_cusmodaldocoper",
                methodname: "collects",
                CusModalDocIds: $stateParams.customid
            };
            params.channelName = angular.isDefined($stateParams.channel) ? $stateParams.channel : "iwo";
            // 川报修改
            if (angular.isDefined($stateParams.xhsgsourceid)) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), cbParams, "post").then(function(data) {
                    trsconfirm.alertType("收藏成功!", "", "success", false, "");
                });
            }
            //川报修改{}
            else if(angular.isDefined($stateParams.customid)){
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), cbCustomParams, "post").then(function(data) {
                    trsconfirm.alertType("收藏成功!", "", "success", false, "");
                });
            }
            else {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("收藏成功!", "", "success", false, "");
                });
            }
        };

        //创作轴
        $scope.creationAxis = function() {
            var params = {
                serviceid: "mlf_bigdataexchange",
                methodname: "batchcreation",
                guid: $stateParams.guid,
                indexname: $scope.detailIndexname
            };
            // 川报修改
            var cbParams = {
                serviceid: "mlf_xhsgoper",
                methodname: "creations",
                XHSGIds: $stateParams.xhsgsourceid
            };
            //川报修改{}
            var cbCustomParams = {
                serviceid: "mlf_cusmodaldocoper",
                methodname: "creations",
                CusModalDocIds: $stateParams.customid
            };
            params.channelName = angular.isDefined($stateParams.channel) ? $stateParams.channel : "iwo";
            // 川报修改
            //$scope.loadingPromise = angular.isDefined($stateParams.xhsgsourceid) ? resourceCenterService.setBigDataCreation(cbParams) : resourceCenterService.setBigDataCreation(params);
            if(angular.isDefined($stateParams.xhsgsourceid)){
                $scope.loadingPromise = resourceCenterService.setBigDataCreation(cbParams);
            }else if(angular.isDefined($stateParams.customid)){
                $scope.loadingPromise = resourceCenterService.setBigDataCreation(cbCustomParams);
            }else{
                $scope.loadingPromise = resourceCenterService.setBigDataCreation(params);
            }
            $scope.loadingPromise.then(function(data) {
                trsconfirm.alertType("该稿件已成功加入创作轴!", "", "success", false);
            });
        };

        // 取稿
        $scope.openTakeDraftModal = function() {
            var params = {
                serviceid: "mlf_bigdataexchange",
                methodname: "fetch",
                guid: $stateParams.guid,
                indexname: $scope.detailIndexname,
                channelName: angular.isDefined($stateParams.channel) ? $stateParams.channel : "iwo"
            };
            // 川报修改
            var cbParams = {
                serviceid: "mlf_xhsgoper",
                methodname: "fetchXHSG",
                XHSGSourceIds: $stateParams.xhsgsourceid
            };
            //川报修改{}
            var cbCustomParams = {
                serviceid: "mlf_cusmodaldocoper",
                methodname: "fetchCusModalDoc",
                CusModalDocIds: $stateParams.customid
            };
            // 川报修改
            //var modalInstance = angular.isDefined($stateParams.xhsgsourceid) ? resCtrModalService.fullTakeDraft(cbParams, true) : resCtrModalService.fullTakeDraft(params, true);
            var modalInstance;
            if(angular.isDefined($stateParams.xhsgsourceid)){
                modalInstance = resCtrModalService.fullTakeDraft(cbParams, true);
            }else if(angular.isDefined($stateParams.customid)){
                modalInstance = resCtrModalService.fullTakeDraft(cbCustomParams, true);
            }else{
                modalInstance = resCtrModalService.fullTakeDraft(params, true);
            }
            modalInstance.result.then(function() {
                storageListenerService.addListenerToResource("takeDraft");
                $window.close();
            });
        };
        //打印
        $scope.printBtn = function() {
            // 川报修改
            if (angular.isDefined($stateParams.xhsgsourceid)) {
                var params = {
                    "serviceid": "mlf_xhsgsource",
                    "methodname": $scope.status.methodname[$stateParams.xhsgtype],
                    "XHSGSourceId": $stateParams.xhsgsourceid
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    var result = data;
                    //data.VERSION = version;
                    data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
                    $scope.data.printResult.push(result);
                    // if ($scope.data.printResult.length == $scope.data.selectedArray.length) {
                    //     trsPrintService.trsPrintShare($scope.data.printResult);
                    //     $scope.data.printResult = [];
                    // }
                    trsPrintService.trsPrintShare($scope.data.printResult);
                });
            }
            //川报修改{} 
            else if(angular.isDefined($stateParams.customid)){
                var cbCustomParams = {
                    "serviceid": "mlf_cusmodaldoc",
                    "methodname": $scope.status.customMethodname[$stateParams.xhsgtype],
                    "CusModalDocId": $stateParams.customid
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), cbCustomParams, "post").then(function(data) {
                    var result = data;
                    data.HANGCOUNT = Math.ceil(data.DOCWORDSCOUNT / 27);
                    $scope.data.printResult.push(result);
                    trsPrintService.trsPrintShare($scope.data.printResult);
                });
            }
             else {
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "post").then(function(data) {
                    trsPrintService.trsPrintBigData(data);
                });
            }
        };
        //关闭
        $scope.close = function() {
            $window.close();
        };

    }]);
