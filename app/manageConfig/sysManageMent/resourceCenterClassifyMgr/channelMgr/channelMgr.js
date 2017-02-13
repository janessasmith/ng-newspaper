/**
 * Created by ma.rongqin on 2016/2/16.
 */
angular.module("manConSysSouCenClassifyMgrChnnlMgrModule",[
    'sysmanageSouCenMgrChnnlMgrRouterModule',
    'manConSysSouCenSiteChnnlRecycleModule'
])
    .controller("manConSysSouCenClassifyMgrChnnlMgrCtrl",["$scope","trsHttpService","manConSysSouCenClassifyMgrService","trsconfirm",function($scope,trsHttpService,manConSysSouCenClassifyMgrService,trsconfirm){
        $scope.modifyViews = function(){
            var params = {
                title:"修改分类",
                type:"分类"
            };
            manConSysSouCenClassifyMgrService.modifyViews(params,function(){

            });
        }
        $scope.addViews = function(){
            var params = {
                title:"新增分类",
                type:"分类"
            };
            manConSysSouCenClassifyMgrService.modifyViews(params,function(){

            });
        };
        $scope.deleteViews = function(){
            trsconfirm.inputModel("确认删除此分类", "输入删除的理由，可选填！", function(content) {

            });
        }
    }]);