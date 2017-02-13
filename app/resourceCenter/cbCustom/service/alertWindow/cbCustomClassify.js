"use strict";
angular.module('cbCustomClassifyModule', [])
    .controller('cbCustomClassifyCtrl', ['$scope', '$modalInstance', '$stateParams', 'trsHttpService', 'transform', 'trsconfirm', function($scope, $modalInstance, $stateParams, trsHttpService, transform, trsconfirm) {
        initStatus();

        function initStatus() {
            $scope.data = {
                // name: angular.isDefined(transform.subitem) && transform.subitem !== "" ? transform.subitem.CATEGORYNAME : transform.item.CATEGORYNAME || "",
                transform: transform,
            };
            if(transform.isAdd===0){
            	$scope.data.name = "";
            }else{
            	if(transform.subitem !== ""){
            		$scope.data.name = transform.subitem.CATEGORYNAME;
            	}else{
            		$scope.data.name = transform.item.CATEGORYNAME;
            	}
            }
        }

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.confirm = function() {
            var params = {
                serviceid: "mlf_metacategory",
                methodname: "saveMetaCategory",
                MetaCategoryName: $scope.data.name,
                MetaCategoryDesc: $scope.data.name,
                ModalId: $scope.data.transform.level == '0' ? $stateParams.modalid : 0,
                ParentId: $scope.data.transform.level == '0' ? 0 : $scope.data.transform.item.METACATEGORYID,
                IsSpecial: $scope.data.transform.item.ISSPECIAL
            };
            if (transform.level === '1') {
                if ($scope.data.transform.subitem === "") {
                    params.MetaCategoryId = 0;
                } else {
                    params.MetaCategoryId = $scope.data.transform.subitem.METACATEGORYID;
                }
            } else if (transform.level === '0') {
                if ($scope.data.transform.item === "") {
                    params.MetaCategoryId = 0;
                } else {
                    params.MetaCategoryId = $scope.data.transform.item.METACATEGORYID;
                }
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $modalInstance.close(data);
                trsconfirm.alertType("新增分类成功", "", "success", false);
            });

        };

        $scope.delete = function() {
            var params = {
                serviceid: "mlf_metacategory",
                methodname: "delMetaCategory",
                MetaCategoryId: transform.subitem === "" ? $scope.data.transform.item.METACATEGORYID : $scope.data.transform.subitem.METACATEGORYID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $modalInstance.close();
                trsconfirm.alertType("删除成功", "", "success", false);
            });
        };
    }]);
