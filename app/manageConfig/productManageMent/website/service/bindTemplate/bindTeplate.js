"use strict";
angular.module('websiteBindTemplateModule', []).
controller('columnChannelOtherViewsCtrl', ['$scope', "$modalInstance", "$stateParams", "trsHttpService", "params", function($scope, $modalInstance, $stateParams, trsHttpService, params) {
    initStatus();
    initData();

    function initStatus() {
        $scope.page = {
            CURRRPAGE: "1",
            PAGESIZE: "10",
        };
        $scope.params = {
            serviceid: "mlf_websiteconfig",
            methodname: "getOptionalTemplates",
            ObjectType: params.ObjectType,
            ObjectId: params.ObjectId,
            TempName: params.TempName,
            TEMPLATETYPE: params.TEMPLATETYPE,
            CurrPage: $scope.page.CURRRPAGE,
            PageSize: $scope.page.PAGESIZE
        };
        $scope.selectedOverviewTemp = {
            TEMPID: "0",
            TEMPNAME: ""
        };
        $scope.status = {
            copyCurrPage: 1,
        };
    }

    function initData() {
        requestData();
    }

    function requestData() {
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "POST").then(function(data) {
            $scope.overviewTemps = data.DATA;
            $scope.page = data.PAGER;
            if (angular.isDefined(params.selectedTemp)) {
                $scope.selectedOverviewTemp = {
                    TEMPID: params.selectedTemp.TEMPID,
                    TEMPNAME: params.selectedTemp.TEMPNAME
                };
            }
        });
    }
    $scope.pageChanged = function() {
        $scope.params.CurrPage = $scope.page.CURRPAGE;
        $scope.status.copyCurrPage = $scope.params.CurrPage;
        requestData();
    };
    $scope.jumpToPage = function() {
        if ($scope.page.PAGECOUNT < $scope.status.copyCurrPage) {
            $scope.status.copyCurrPage = $scope.page.PAGECOUNT;
        }
        $scope.params.CurrPage = $scope.status.copyCurrPage;
        requestData();
    };
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
    $scope.confirm = function() {
        $modalInstance.close($scope.selectedOverviewTemp);
    };
    //点击选择模板
    $scope.selectOverviewTempFn = function(overviewTemp) {
        $scope.selectedOverviewTemp = overviewTemp;
    };
    //点击不选择任何模板
    $scope.selectNotemp = function() {
        $scope.selectedOverviewTemp = $scope.selectedOverviewTemp.TEMPID == 0 ? $scope.overviewTemps[0] : {
            TEMPID: "0",
            TEMPNAME: ""
        };
    };

}]);
