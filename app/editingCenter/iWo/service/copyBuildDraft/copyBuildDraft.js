/*Create by BaiZhiming 2015-12-2*/
"use strict";
angular.module("copyBuildDraftModule", []).
controller("copyBuildDraftCtrl", ["$scope", '$modalInstance', "trsHttpService", "array", 'trsResponseHandle', 'trsconfirm', "methodname", function($scope, $modalInstance, trsHttpService, array, trsResponseHandle, trsconfirm, methodname) {
    initData();
    initStatus();
    $scope.confirm = function() {
        $scope.status.openBtn = false;
        angular.forEach($scope.draftArray, function(data, index, array) {
            $scope.draftArray[index].CHNLDOCID = parseInt($scope.draftArray[index].CHNLDOCID);
            if ($scope.draftArray[index].MEDIATYPES === undefined) {
                $scope.draftArray[index].MEDIATYPES = 0;
            } else {
                $scope.draftArray[index].MEDIATYPES = $scope.draftArray[index].MEDIATYPES;
            }
        });
        var params = {
            "methodname": methodname,
            "serviceid": "mlf_myrelease",
            "COPYDOCS": JSON.stringify(angular.copy($scope.draftArray))
        };
        $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
            $scope.status.openBtn = true;
            trsResponseHandle.responseHandle(data, false).then(function(data) {
                trsconfirm.alertType("操作成功！", "操作成功！", "success", false, function() {});
                $modalInstance.close("success");
            });
        }, function() {
            $scope.status.openBtn = true;
        });
    };
    $scope.cancel = function() {
        $modalInstance.close("failed");
    };

    function initStatus() {
        $scope.status = {
            openBtn: true
        };
    }

    function initData() {
        trsHttpService.httpServer("./editingCenter/properties/iWoCopyBuildDraft.json", {}, "get").then(function(data) {
            $scope.MEDIATYPES = data.MEDIATYPES;
        }, function(data) {});
        $scope.draftArrayC = array;
        $scope.draftArray = [];
        angular.forEach($scope.draftArrayC, function(data, index, array) {
            $scope.draftArray.push({
                CHNLDOCID: data.CHNLDOCID,
                METADATAID: data.METADATAID,
                OLDTITLE: angular.isDefined(data.TITLE) ? data.TITLE : data.DOCTITLE,
                TITLE: angular.isDefined(data.TITLE) ? data.TITLE : data.DOCTITLE,
                MEDIATYPES: "0"
            });
        });
    }
}]);
