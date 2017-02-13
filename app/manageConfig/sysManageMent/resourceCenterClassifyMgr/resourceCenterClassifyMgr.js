/**
 * Created by ma.rongqin on 2016/2/15.
 */
'use strict';
angular.module("manConSysSouCenClassifyMgrModule",[
    "sysmanageSouCenClassifyMgrRouterModule",
    'manConSysSouCenClassifyMgrServiceModule',
    "manConSysSouCenSiteRecycleModule",
    "manConSysSouCenClassifyMgrChnnlMgrModule",
])
    .controller("manConSysSouCenClassifyMgrCtrl",['$scope',"trsHttpService","manConSysSouCenClassifyMgrService","trsconfirm",function($scope,trsHttpService,manConSysSouCenClassifyMgrService,trsconfirm){
        $scope.modifyViews = function(){
            var params = {
                title:"站点管理-修改站点",
                type:"渠道"
            };
            manConSysSouCenClassifyMgrService.modifyViews(params,function(){

            });
        }
        $scope.addViews = function(){
            var params = {
                title:"新增渠道",
                type:"渠道"
            };
            manConSysSouCenClassifyMgrService.modifyViews(params,function(){

            });
        };
        $scope.deleteViews = function(){
            trsconfirm.inputModel("确认删除此渠道", "输入删除的理由，可选填！", function(content) {

            });
        }
    }]);