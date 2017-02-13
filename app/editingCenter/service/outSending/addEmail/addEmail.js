/**
 * Created by 马荣钦 on 2016/2/2.
 */
"use strict";
angular.module('editOutSendingAddModule',[])
    .controller("editOutSendingAddCtrl",["$scope","$modalInstance","$validation","params","trsconfirm",function($scope,$modalInstance,$validation,params,trsconfirm){
        //关闭窗口
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $validation.validate($scope.outSendingAddForm).success(function() {
                $modalInstance.close({
                    email:$scope.email,
                    emailDesc:$scope.desc
                });
            });
        };
    }]);