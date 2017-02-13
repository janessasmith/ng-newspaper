/**
 * Created by MRQ on 2016/2/15.
 */
angular.module("manConSysSouCenSiteRecycleModule",[])
    .controller("manConSysSouCenSiteRecycleCtrl",["$scope","manConSysSouCenClassifyMgrService",'trsHttpService','trsconfirm',function($scope,manConSysSouCenClassifyMgrService,trsHttpService,trsconfirm){
        initStatus();
        function initStatus(){
            $scope.selectedSite = {
                SITENAME:"假的试一试"
            }
        }
        //还原弹窗
        $scope.reductionViews = function(siteid) {
            manConSysSouCenClassifyMgrService.recycleReductionViews({
                title: "“" + $scope.selectedSite.SITENAME + "”",
                content: "您确定要还原此渠道"
            }, function() {
                //var reSiteParams = {
                //    serviceid: "mlf_websiteconfig",
                //    methodname: "restoreSites",
                //    ObjectIds: siteid,
                //    RestoreAll: false
                //};
                //trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), reSiteParams, "post")
                //    .then(function(data) {
                //        trsconfirm.alertType("还原成功", "还原成功", "success", false, function() {
                //            initData();
                //            $state.transitionTo($state.current, $stateParams, {
                //                reload: true
                //            });
                //        });
                //    });
                console.log("确认还原")
            });
        };
        //删除弹窗
        $scope.deleteViews = function(siteid) {
            manConSysSouCenClassifyMgrService.recycleDeleteViews({
                title: "“" + $scope.selectedSite.SITENAME + "”",
                content: "您确定要彻底删除此渠道"
            }, function() {
                //var deleteParams = {
                //    serviceid: "mlf_websiteconfig",
                //    methodname: "RemoveSites",
                //    SiteIds: siteid
                //};
                //trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), deleteParams, "post")
                //    .then(function(data) {
                //        trsconfirm.alertType("删除成功", "删除成功", "success", false, function() {
                //            initData();
                //        });
                //    });
                console.log("确认删除")
            });
        };
    }]);