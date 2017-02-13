/**
 * Created by ma.rongqin on 2016/2/15.
 */
angular.module("manConSysSouCenClassifyModifyModule",[])
    .controller('manConSysSouCenClassifyModifyCtrl',["$scope","$modalInstance","trsconfirm","params",function($scope,$modalInstance,trsconfirm,params){
        initStatus()

        function initStatus(){
            $scope.title = params.title;
            $scope.type = params.type;
        }

        //关闭窗口
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        //确定
        $scope.confirm = function(){
            $modalInstance.dismiss();
        }
    }]);