/*create by ma.rongqin 2016.2.29*/
"use strict"
angular.module('editCenWebsiteSigedPushBarModule', [])
    .controller('editCenWebsiteSigedPushBarCtrl', ['$scope', '$modalInstance', "trsHttpService", 'trsconfirm', function($scope, $modalInstance, trsHttpService, trsconfirm) {
        initStatus();
        initDatas();
        //确认
        $scope.confirm = function() {
            if ($scope.selected == '') {
                trsconfirm.alertType("请选择栏目", "", "warning", false);
            } else {
                trsconfirm.confirmModel("推首页", "您确认要推至<span class='text_red'>" + $scope.selected.CHANNELNAME + "</span>首页？", function() {
                    var params = {
                        serviceid: 'mlf_website',
                        methodname: 'pushToHomePage',
                        BFWChannelId: $scope.selected.CHANNELID
                    }
                    $modalInstance.close(params);
                })
            }
        };
        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        function initStatus() {
            $scope.selected = '';
            $scope.params = {
                serviceid: 'mlf_website',
                methodname: 'getBFWChannels'
            };
        };

        function initDatas() {
            requestData();
        }
        //请求北方网数据
        function requestData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
                $scope.datas = data;
            })
        }
        //选择哪一个站点
        $scope.selectChannel = function(item) {
            $scope.selected = angular.copy(item);
        }
    }])
