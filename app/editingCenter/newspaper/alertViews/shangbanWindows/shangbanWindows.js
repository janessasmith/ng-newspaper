/**
 * Author:XCL
 *
 * Time:2016-01-11
 */
"use strict";
angular.module('ediCtrNewspaperShangbanModule', [])
    .controller('ediCtrNewspaperShangbanCtrl', ['$scope', "$timeout", "$modalInstance", '$validation', "$stateParams", "$filter", "trsHttpService", "transferData", "trsspliceString", "trsconfirm", "SweetAlert", function($scope, $timeout, $modalInstance, $validation, $stateParams, $filter, trsHttpService, transferData, trsspliceString, trsconfirm, SweetAlert) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                "serviceid": "mlf_paper"
            };
            $scope.status = {
                draftFrom: {
                    29: "归档稿",
                    30: "今日稿",
                    31: "待用稿",
                    32: "今日稿",
                    33: "今日稿",
                    34: "上版稿",
                    35: "已签稿",
                    36: "已签稿",
                    37: "已签稿",
                    38: "已签稿"
                },
                isRequeted: false,
            };
            $scope.title = transferData.title;
            $scope.opinionTit = transferData.opinionTit;
            $scope.items = transferData.selectedArr;
            $scope.choosedManuCount = transferData.selectedArr.length;
            $scope.isShowDate = transferData.isShowDate;
            $scope.relatedContent = false;
            $scope.selectedDieci = "";
            $scope.selectedCaibian = "";
            $scope.manuInfos = {
                caibian: "",
                dieci: ""
            };
            $scope.isManusCorrShow = false;
            $scope.hasNoManusCorr = false;
            $scope.clickCurrItem = "";
            $scope.params = {
                serviceid: "mlf_paper",
                PaperId: transferData.PaperId || transferData.selectedArr[0].SITEID,
                SrcDocId: transferData.SrcDocId
            };
        }

        function initData() {
            //获取当前日期的后一天
            //Date():返回当日的时间和日期
            //getDate():从Date对象返回一个月中的某一天(1 ~ 31)
            //setDate():设置Date对象中月的某一天
            getDiecis();
            getSelectedManuDetail();
            getPubDate();
        }

        function getPubDate() {
            $scope.status.date = angular.isDefined($scope.items[0].PUBDATE) && $scope.items.length > 4 ? $scope.items[0].PUBDATE : new Date().setDate(new Date().getDate() + 1);
        }

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        //显示稿件关联方法
        function manuscriptCorrelationData(item) {
            var methodnameObj = {
                "29": "queryReleteDocsInGuiDang",
                "30": "queryRelateDocsInJinRi",
                "31": "queryRelateDocsInDaiYong",
                "32": "queryRelateDocsInJinRi",
                "33": "queryRelateDocsInJinRi",
                "34": "queryRelateDocsInShangBan"
            };
            $scope.params.methodname = methodnameObj[item.DOCSTATUS];
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.relationDraft = data;
                $scope.hasNoManusCorr = data == "" ? true : false;
            });
        }
        //显示稿件关联
        $scope.ManusCorrToggle = function(id, item) {
            $scope.selectedItem = item;
            if ($scope.clickCurrItem == "" || $scope.clickCurrItem != id) {
                $scope.isManusCorrShow = true;
                $scope.clickCurrItem = id;
            } else if ($scope.clickCurrItem == id) {
                $scope.isManusCorrShow = false;
                $scope.clickCurrItem = "";
            }
            $scope.params.SrcDocId = id;
            manuscriptCorrelationData(item);
        };
        //显示相关关联
        //$scope.showRelate = function(item) {
        //    if ($scope.relatedContent === false) {
        //        $scope.params.methodname = transferData.relatedManuMethod;
        //        $scope.params.PaperId = $stateParams.paperid;
        //        $scope.params.SrcDocId = item.METADATAID;
        //        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'get').then(function(data) {
        //            if (data === "") {
        //                $scope.noRelatedManu = true;
        //            } else {
        //                $scope.noRelatedManu = false;
        //                $scope.relatedManus = data;
        //            }
        //        });
        //    }
        //    $scope.relatedContent = !$scope.relatedContent;
        //};

        //删除
        $scope.singleDel = function(curItem) {
            $scope.items.splice(curItem, 1);
            $scope.choosedManuCount = $scope.items.length;
            if ($scope.items.length === 0) {
                SweetAlert.swal({
                    title: "警告",
                    text: "已选稿件为空",
                    type: "warning",
                    closeOnConfirm: true,
                    confirmButtonText: "关闭",
                });
            }
        };

        //获取叠次列表
        function getDiecis() {
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryDieCis",
                "PaperId": $stateParams.paperid || transferData.selectedArr[0].SITEID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $scope.dieciItems = data;
            });
        }

        //确定
        $scope.confirm = function() {
            $scope.status.isRequeted = true;
            var dateStr = $filter('date')($scope.status.date, "yyyy-MM-dd").toString();
            var option = $scope.option;
            var returnData = {
                "srcdocids": trsspliceString.spliceString($scope.items, 'METADATAID', ','),
                "dateStr": dateStr,
                "option": option,
                "banmianid": $scope.selectedCaibian
            };
            returnData.SrcBanMianIds = angular.isDefined($scope.items[0].CHNLID) ? trsspliceString.spliceString($scope.items, "CHNLID", ",") : trsspliceString.spliceString($scope.items, "CHANNELID", ","),
                $validation.validate($scope.shangbanForm).success(function() {
                    if ($scope.selectedCaibian === "") {
                        SweetAlert.swal({
                            title: "警告",
                            text: "请先选择采编版面",
                            type: "warning",
                            closeOnConfirm: true,
                            cancelButtonText: "取消",
                            confirmButtonText: "确定"
                        });
                    } else {
                        $modalInstance.close(returnData);
                        $scope.items = "";
                    }
                }).error(function() {
                    $scope.showAllTips = true;
                    trsconfirm.alertType("提交失败", "请输入正确的数据格式", "error", false, function() {});
                });
        };

        //叠次选择切换相应的采编版面
        $scope.dieciClick = function(curItem) {
            $scope.manuInfos.caibian = "";
            $scope.selectedCaibian = "";
            $scope.dieciSelected = curItem;
            $scope.manuInfos.dieci = "";
            var dieciStr = trsspliceString.spliceString($scope.dieciItems, 'CHANNELID', ',');
            var dieciArray = dieciStr.split(",");
            $scope.selectedDieci = dieciArray[curItem];
            getCBLayout();
        };

        //选择采编版面,获取版面id
        $scope.caibianClick = function(curItem, index) {
            $scope.caibianSelected = curItem;
            $scope.manuInfos.caibian = "";
            var caibianStr = trsspliceString.spliceString($scope.cbItems, 'CHANNELID', ',');
            var caibianArray = caibianStr.split(",");
            $scope.selectedCaibian = caibianArray[index];
        };

        //获取已选稿件详情
        function getSelectedManuDetail() {
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryViewDatas",
                "MetaDataIds": $scope.items[0].METADATAID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $scope.manuInfos.dieci = data[0];
                $scope.manuInfos.caibian = data[0];
                $scope.selectedCaibian = data[0].CHANNELID;
                var params = {
                    "serviceid": "mlf_paper",
                    "methodname": "queryCaiBianBanMians",
                    "PaperId": $stateParams.paperid || transferData.selectedArr[0].SITEID,
                    "DieCiId": data[0].DIECIID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                    $scope.cbItems = data;
                    // initCBLayout();

                    //                     
                    $timeout(function() {
                        $('.selectedItem')[0].scrollIntoView();
                    });
                });
            });
        }

        //根据叠次名获取采编版面列表
        function getCBLayout() {
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryCaiBianBanMians",
                "PaperId": $stateParams.paperid || transferData.selectedArr[0].SITEID,
                "DieCiId": $scope.selectedDieci
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $scope.cbItems = data;
            });
        }

        //选择相关联的稿件
        $scope.chooseRelatedDraft = function(item) {
            $scope.selectedRelatedDraft = item;
            $scope.items = $filter('unique')($scope.items.concat(item), 'METADATAID');
        };

        //根据叠次名称初始化采编版面列表
        // function initCBLayout() {
        //     var params = {
        //         "serviceid": "mlf_paper",
        //         "methodname": "queryCaiBianBanMians",
        //         "PaperId": $stateParams.paperid,
        //         "DieCiId": $scope.manuInfos.DIECIID
        //     };
        //     trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
        //         $scope.cbItems = data;
        //     });
        // }
    }]);
