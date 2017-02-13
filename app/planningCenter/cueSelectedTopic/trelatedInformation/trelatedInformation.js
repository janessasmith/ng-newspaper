"use strict";
/**
 *  Module   事件相关信息获取接口详情
 *  Ly
 * Description
 */
angular.module('planCenterTrelatedinformationModule', []).controller('planCenterTrelatedinformationCtrl', ['$scope', 'trsHttpService', '$stateParams', '$q', function($scope, trsHttpService, $stateParams, $q) {
    initStatus();

    function initStatus() {
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": 10
        };
        $scope.params = {
            "typeid": "event",
            "eventid":11,
            "serviceid": "eventrelatedinformation",
            "modelid": "eventrelatedinformationlist",
            "type": "eventList",
            "entity_type": $stateParams.type,
            "entity_word": $stateParams.keyword,
            "pageno": $scope.page.CURRPAGE,
        };
        trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, "get").then(function(data) {
            $scope.items = data.PAGEDLIST.PAGEITEMS;
            $scope.page = {
                "CURRPAGE": data.PAGEDLIST.STEP,
                "PAGESIZE": data.PAGEDLIST.PAGESIZE,
                "ITEMCOUNT": data.PAGEDLIST.TOTALITEMCOUNT,
                "PAGECOUNT": data.PAGEDLIST.TOTALPAGECOUNT
            };
               $scope.indexname=data.CONTENT.INDEXNAME;
        });

    }


    //下一页
    $scope.pageChanged = function() {
        $scope.params.pageno = $scope.page.CURRPAGE - 1;
        $scope.params.NEXTPAGE = $scope.page.PAGESIZE;
        requestData($scope.params).then(function(data) {
            $scope.items = data.PAGEDLIST.PAGEITEMS;
        });
    };
    $scope.$watch("page.CURRPAGE", function(newValue){
        if(newValue > 0){
            $scope.jumpToPageNum = newValue;
        }
    });
    /*跳转指定页面*/
    $scope.jumpToPage = function() {
        if ($scope.jumpToPageNum > $scope.page.PAGECOUNT) {
            $scope.page.pageno = $scope.page.PAGECOUNT;
            $scope.jumpToPageNum = $scope.page.pageno;
        }
        $scope.params.pageno = $scope.jumpToPageNum;
        
        requestData($scope.params).then(function(data) {
            $scope.items = data.PAGEDLIST.PAGEITEMS;
        });
        $scope.selectedArray = [];
    };

    function requestData(params) {
        var deferred = $q.defer();
        trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "get").then(function(data) {
            deferred.resolve(data);
        });
        return deferred.promise;
    }
}]);
