/**
 * Author:CC
 *
 * Time:2016-03-01
 */
"use strict";
angular.module('editNewspapaerUseSignedZPModule', [])
    .controller('editNewspaperUseSignedZPCtrl', ['$scope', '$q', '$modalInstance', '$validation', '$stateParams', '$filter', 'item', 'trsconfirm', 'trsHttpService', 'trsspliceString', 'SweetAlert', 'editingCenterService', function($scope, $q, $modalInstance, $validation, $stateParams, $filter, item, trsconfirm, trsHttpService, trsspliceString, SweetAlert, editingCenterService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.status = {
                option: "",
                selectedDieci: "",
                selectedZhaopai: "",
                isRequeted: false,
            };
            $scope.data = {
                paperMsg: "",
                items: item
            };
        }

        function initData() {
            getDiecis();
            //当前报纸信息
            editingCenterService.getSiteInfo($stateParams.paperid || $scope.data.items[0].SITEID).then(function(data) {
                $scope.data.paperMsg = data;
            });
            //见报日期 只有1篇稿件时为这篇稿件的简报日期 多篇稿件时为今天的后一天
            $scope.data.createDate = $scope.data.items.length > 1 ? new Date().setDate(new Date().getDate() + 1) : $scope.data.items[0].PUBDATE;
        }

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        /**
         * [reponseFilter description]过滤返回的reports
         * @param  {[obj]} elm [description]各个返回的report
         * @return {[null]}     [description]
         */
        $scope.reportsFilter = function(elm) {
            if (angular.isDefined(elm)) {
                return angular.isDefined(elm.RESULT);
            }
        };
        $scope.confirm = function() {
            $scope.status.isRequeted = true;
            $scope.data.createDate = $filter('date')($scope.data.createDate, "yyyy-MM-dd").toString();
            var params = {
                serviceid: "mlf_paper",
                methodname: "doQianFa",
                SrcDocIds: trsspliceString.spliceString(item,
                    'METADATAID', ','),
                banmianid: $scope.status.selectedZhaopai.CHANNELID,
                option: $scope.status.option,
                IsPaiChong: true,
            };
            if ($scope.data.paperMsg.ISDUOJISHEN == 0) {
                params.pubdate = $scope.data.createDate;
            }
            $validation.validate($scope.useSignedZPForm).success(function() {
                if ($scope.status.selectedZhaopai === "") {
                    SweetAlert.swal({
                        title: "警告",
                        text: "请先选择照排版面",
                        type: "warning",
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                        confirmButtonText: "确定"
                    });
                } else {
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        trsconfirm.alertType("签发照排成功", "", "success", false);
                        $modalInstance.close('success');
                    }, function(data) {
                        var temp = $filter('pick')(data.REPORTS, $scope.reportsFilter);
                        var result = {
                            reports: temp,
                            params: params
                        };
                        $modalInstance.close(result);
                    });
                }
            }).error(function() {
                $scope.showAllTips = true;
                trsconfirm.alertType("提交失败", "请输入正确的数据格式", "error", false, function() {});
            });
        };

        //获取叠次列表
        function getDiecis() {
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryDieCis",
                "PaperId": $stateParams.paperid || $scope.data.items[0].SITEID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $scope.data.dieciItems = data;
                $scope.status.selectedDieci = data[0];
                var params = {
                    "serviceid": "mlf_paper",
                    "methodname": "queryZhaoPaiBanMians",
                    "PaperId": $stateParams.paperid || $scope.data.items[0].SITEID,
                    "DieCiId": $scope.status.selectedDieci.CHANNELID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                    $scope.data.zpItems = data;
                    $scope.status.selectedZhaopai = data[0];
                });
            });
        }

        //叠次选择切换相应的照排版面
        $scope.dieciClick = function(curItem, index) {
            $scope.status.selectedZhaopai = "";
            $scope.status.selectedDieci = curItem;
            getZPLayout();
        };

        //根据叠次名获取照排版面列表
        function getZPLayout() {
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryZhaoPaiBanMians",
                "PaperId": $stateParams.paperid || $scope.data.items[0].SITEID,
                "DieCiId": $scope.status.selectedDieci.CHANNELID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                $scope.data.zpItems = data;
            });
        }

        //选择照排版面,获取版面id
        $scope.zhaopaiClick = function(curItem, index) {
            $scope.status.selectedZhaopai = curItem;
        };
    }]);
