/**
 * Created by MRQ on 2016/1/12.
 */
"use strict";
angular.module('cancelSignedModule', [])
    .controller('cancelSignedCtrl', ['$scope', "$location", "$modalInstance", "$validation", "$filter", "params", "trsspliceString", "trsHttpService", "trsconfirm", function($scope, $location, $modalInstance, $validation, $filter, params, trsspliceString, trsHttpService, trsconfirm) {
        initStatus();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $validation.validate($scope.cancelSignedForm).success(function() {
                if ($scope.items.length > 0) {
                    var transferData = {
                        "items": $scope.items,
                        "opinion": $scope.opinion,
                        "SrcDocIds": trsspliceString.spliceString($scope.items, "METADATAID", ",")
                    };
                    transferData.SrcBanMianIds = angular.isDefined($scope.items[0].CHNLID) ? trsspliceString.spliceString($scope.items, "CHNLID", ",") : trsspliceString.spliceString($scope.items, "CHANNELID", ",");
                    $modalInstance.close(transferData);
                } else {
                    trsconfirm.alertType("请选择稿件", "请选择稿件", "warning", false, function() {});
                }
            });
        };
        $scope.delete = function(item) {
            $scope.items.splice($scope.items.indexOf(item), 1);
        };

        function initStatus() {
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
                newspaperType: $location.path().split('/')[3],
            };
            $scope.title = params.title;
            $scope.opinionTit = params.opinionTit;
            $scope.items = params.items;
            $scope.isManusCorrShow = false;
            $scope.hasNoManusCorr = false;
            $scope.clickCurrItem = "";
            $scope.params = {
                serviceid: "mlf_paper",
                PaperId: params.PaperId,
                SrcDocId: params.SrcDocId
            };
        }
        /**
         * [manuscriptCorrelationData description]查询关联稿件方法
         * @param  {[type]} item [description]稿件信息
         * @return {[type]}      [description]
         */
        function manuscriptCorrelationData(item) {
            var methodnameObj = {
                29: "queryReleteDocsInGuiDang",
                30: "queryRelateDocsInJinRi",
                31: "queryRelateDocsInDaiYong",
                32: "queryRelateDocsInJinRi",
                33: "queryRelateDocsInJinRi",
                34: "queryRelateDocsInShangBan",
                35: "queryReleteDocsInYiQianFa",
                36: "queryReleteDocsInYiQianFa",
                37: "queryReleteDocsInYiQianFa",
                38: "queryReleteDocsInYiQianFa"
            };
            $scope.params.methodname = methodnameObj[item.DOCSTATUS];
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.relationDraft = data;
                $scope.hasNoManusCorr = data == "" ? true : false;
            });
        }
        /**
         * [ManusCorrToggle description]点击关联稿件
         * @param {[type]} item [description]稿件信息
         */
        $scope.ManusCorrToggle = function(item) {
            if ($scope.clickCurrItem == "" || $scope.clickCurrItem != item.METADATAID) {
                $scope.isManusCorrShow = true;
                $scope.clickCurrItem = item.METADATAID;
            } else if ($scope.clickCurrItem == item.METADATAID) {
                $scope.isManusCorrShow = false;
                $scope.clickCurrItem = "";
            }
            $scope.params.SrcDocId = item.METADATAID;
            manuscriptCorrelationData(item);
        };

        //选择相关联的稿件
        $scope.chooseRelatedDraft = function(item) {
            $scope.selectedRelatedDraft = item;
            $scope.items = $filter('unique')($scope.items.concat(item), 'METADATAID');
        };
    }]);
