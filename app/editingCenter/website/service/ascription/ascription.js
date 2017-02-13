angular.module('editWebsteAscriptionViewModule', [])
    .controller('editWebsteAscriptionViewCtrl', ['$scope', "$modalInstance", "trsHttpService", "trsconfirm", "params", function($scope, $modalInstance, trsHttpService, trsconfirm, params) {
        initStatus();
        initData();
        /*初始化状态*/
        function initStatus() {
            $scope.params = {
                serviceid: "mlf_website",
                methodname: "queryAllOwners",
            };
            $scope.currDraftParams = {
                serviceid: "mlf_website",
                methodname: "queryOwnersByDocId",
                DocId: params.metadataId,
            }
            $scope.status = {
                search: {
                    TRUENAME: '',
                },
            };
            $scope.data = {
                items: "",
                selectedArray: [],
                metadataId: params.metadataId,
            };
        }
        /*初始化请求数据*/
        function initData() {
            requestData();
            if (angular.isDefined(params.metadataId)) getCurrDraftTag();
        }
        /*请求所有关注的专题及其标签*/
        function requestData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
                $scope.data.items = data;
            })
        }
        /*请求当前稿件的标签*/
        function getCurrDraftTag() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.currDraftParams, 'post').then(function(data) {
                angular.forEach(data, function(value, key) {
                    $scope.data.selectedArray.push(value.OWNERID);
                });
            })
        }
        /*取消关闭弹窗*/
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        /*单选*/
        $scope.singleSelect = function(item) {
            var index = $scope.data.selectedArray.indexOf(item.USERID);
            if (index < 0) {
                $scope.data.selectedArray.push(item.USERID);
            } else {
                $scope.data.selectedArray.splice(index, 1);
            }
        };
        /*确定*/
        $scope.confirm = function() {
            var result = {
                selectedArray: $scope.data.selectedArray,
            };
            $modalInstance.close(result);
        };
    }])
