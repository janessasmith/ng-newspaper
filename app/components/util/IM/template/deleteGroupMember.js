/*create by ma.rongqin 2016.6.22*/
angular.module('IMDeleteGroupMemberModule', [])
    .controller('IMDeleteGroupMemberCtrl', ['$scope', '$modalInstance', 'params', 'trsHttpService', 'trsspliceString', 'trsconfirm', function($scope, $modalInstance, params, trsHttpService, trsspliceString, trsconfirm) {
        initStatus();
        initData();
        /*初始化状态*/
        function initStatus() {
            $scope.data = {
                currGroup: params.currTalkTo,
                currMembers: params.currMembers,
                user: params.user,
                deleteMember: [],
                head: {},
            };
            $scope.headParams = {
                serviceid: "mlf_extuser",
                methodname: "getUserIdHeadPic",
                UserIds: "",
            }
        };
        /*初始化数据*/
        function initData() {
            requestHead();
        }
        /*请求头像*/
        function requestHead() {
            $scope.headParams.UserIds = trsspliceString.spliceString($scope.data.currMembers, "member", ",");
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.headParams, "post").then(function(data) {
                // './editngCenter/app/images/user_icon.jpg'
                angular.forEach(data, function(value, key) {
                    $scope.data.head[value.USERID] = value.PERPICURL || '/components/util/IM/images/user_icon.jpg';
                });
            });
        }
        /*确定*/
        $scope.confirm = function() {
            var result = {
                deleteMember: $scope.data.deleteMember,
            }
            $modalInstance.close(result);
        };
        /*取消*/
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        /*点击后踢除群组成员*/
        $scope.deleteMember = function(friend) {
            $scope.data.currMembers.splice($scope.data.currMembers.indexOf(friend), 1);
            $scope.data.deleteMember.push(friend);
        };
        /*点击后退出群组*/
        $scope.quitGroup = function() {
            trsconfirm.confirmModel('退出', '确认退出', function() {
                $modalInstance.close('quit');
            })
        }
    }])
