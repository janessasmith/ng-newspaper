angular.module('websiteCloudModifyFileModule', [])
    .controller("websiteCloudModifyFileCtrl", ['$scope', "$sce", "$modalInstance", '$validation', 'trsHttpService', 'transmission', function($scope, $sce, $modalInstance, $validation, trsHttpService, transmission) {
        initStatus();
        initData();
        //初始化请求数据
        function initData() {
            getFileContent();
        }
        //初始化状态
        function initStatus() {
            $scope.params = {
                "serviceid": "mlf_websitefile",
                "methodname": "getFileContent",
                "ChannelId": transmission.channelid,
                "FilePath": transmission.file.ABSOLUTENAME,
            }
            $scope.data = {
                name: transmission.file.NAME,
            }
            $scope.status = {
                content: '',
            }
        }
        //获取当前文件的内容
        function getFileContent() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "post").then(function(data) {
                $scope.status.content = data;
            });
        }
        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        //确定
        $scope.confirm = function() {
            $validation.validate($scope.modifyFileForm).success(function() {
                $modalInstance.close($scope.status.content);
            });
        };
    }]);
