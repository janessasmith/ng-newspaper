'use strict'
/**
 *  Module  查看关联多签
 *  CreateBy Ly
 *  2016/3/4
 * Description
 */
angular.module('websiteSelectRelevanceModule', []).controller('websiteSelectRelevanceCtrl', ['$scope', 'trsHttpService', 'item', function($scope, trsHttpService, item) {
	initdata();
	initstatus();
    console.log(item);
    //初始化状态
    function initstatus() {
        $scope.status = {
            lists: [],
        };
    }

    function initdata(callback) {
        var moreSign = {
            serviceid: "mlf_website",
            methodname: "queryTransmitDocs",
            ObjectId: item.CHNLDOCID,
        };
        //数据请求函数
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), moreSign, 'get').then(function(data) {
            if (angular.isFunction(callback)) {
                callback(data);
            } else {
                $scope.status.lists = data;

            }
        });
    }
    $scope.cancel = function() {
        $scope.$close();
    };
}]);
