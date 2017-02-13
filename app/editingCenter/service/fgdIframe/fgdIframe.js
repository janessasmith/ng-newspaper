"use strict";
angular.module('fgdIframeModule', []).
controller('EditingFgdIframeCtrl', fgdIframeCtrl);
fgdIframeCtrl.$inject = ["$scope", "$validation", "$sce", "$location", '$state', "$window", "trsHttpService", "trsspliceString", "trsconfirm"];

function fgdIframeCtrl($scope, $validation, $sce, $location, $state, $window, trsHttpService, trsspliceString, trsconfirm) {
    initStatus();
    initData();
    $scope.confirm = function() {
        $validation.validate($scope.draftForm.authorForm).success(function() {
            var fgdParams = angular.copy($scope.status.data.list);
            fgdParams.serviceid = "mlf_appfgd";
            fgdParams.methodname = "saveExtraFGD";
            fgdParams.FGD_EDITINFO = JSON.stringify(fgdParams.FGD_EDITINFO);
            fgdParams.FGD_AUTHINFO = JSON.stringify(fgdParams.FGD_AUTHINFO);
            fgdParams.DOCGENRE = JSON.stringify(fgdParams.DOCGENRE);
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), fgdParams, "post").then(function(data) {
                trsconfirm.alertType('', "保存成功！", "success", false, function() {
                    //console.log($window.opener)
                    /*  if ($window.opener.fgdCallback) {
                          $window.opener.fgdCallback(data.FGDID);
                      }*/
                    /*  $state.go($state.$current, {
                          fgdid: data.FGDID
                      });*/
                    $scope.targetUrl = $sce.trustAsResourceUrl("http://adminbeta.zjol.com.cn/api/mlf/mlf_page#" + data.FGDID);
                });
            });

        });
    };
    $scope.cancel = function() {
        $window.close();
    };

    function initStatus() {
        $scope.status = {
            params: {
                serviceid: "mlf_appfgd",
                methodname: "queryExtraFGD",
                newsId: $location.search().newsId || 0,
                authorIds: $location.search().authorIds || 0,
                fgdId: $location.search().fgdid || 0,
            },
            data: {
                list: {
                    ISNOPAYMENT: 0
                },
                docgenres: []
            }
        };
    }
    $scope.updateCKSelection = function(list) {
        $scope.status.data.list.ISNOPAYMENT = $scope.status.data.list.ISNOPAYMENT == 0 ? 1 : 0;
    };

    function initData() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.params, "get").then(function(data) {
            $scope.status.data.list = data;
            initDocGener();
        });
    }
    //初始化稿件体裁
    function initDocGener() {
        trsHttpService.httpServer("./editingCenter/properties/metadataEnum.json", "", "get").then(function(data) {
            //初始化页面参数
            angular.forEach(data.DocGenre, function(item, index) {
                $scope.status.data.docgenres.push({
                    value: item.value,
                    name: item.name
                });
            });
            $scope.status.data.DOCGENRE = angular.copy($scope.status.data.docgenres[0]);
        });
    }

}
