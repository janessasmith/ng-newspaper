"use strict";
angular.module('inviteJoinGroupModule', []).controller('InviteJoinGroupCtrl', ['$scope', '$modalInstance', '$validation', 'trsHttpService', 'trsspliceString', 'IMWCMService', 'params', function($scope, $modalInstance, $validation, trsHttpService, tsrsspliceString, IMWCMService, params) {
    initStatus();
    initData();

    function initStatus() {
        $scope.data = {
            friendList: [],
            selectedFriends: [],
            searchUserName: "",
            originalId: [],
            isGroup: params.isGroup,
        };
        $scope.status = {
            currTalkTo: "",
            groupName: "",
        };
    }

    function initData() {
        IMWCMService.getFriendList().then(function(data) {
            $scope.data.friendList = data;
            //将当前聊天人物先加入群聊
            selectCurrTalker()
        });
    }
    /**
     * [selectCurrTalker description]默认将当前聊天人加入群组
     */
    function selectCurrTalker() {
        if (!params.isGroup) {
            for (var i = 0; i < $scope.data.friendList.length; i++) {
                if ($scope.data.friendList[i].FRIENDID == params.currTalkTo.FRIENDID) {
                    $scope.data.selectedFriends.push($scope.data.friendList[i]);
                    break;
                }
            }
        } else {
            for (var j = 0; j < params.currMembers.length; j++) {
                for (var k = 0; k < $scope.data.friendList.length; k++) {
                    if (params.currMembers[j].member == $scope.data.friendList[k].FRIENDID) {
                        $scope.data.originalId.push(params.currMembers[j].member);
                        break;
                    }
                }
            }
        }
    }
    /**
     * [inviteJoinGroup description]
     * @param  {[type]} friend [description]当前对象
     * @param  {[type]} isSearch [description]是否启用检索
     * @return {[type]}        [description]
     */
    $scope.inviteJoinGroup = function(friend, isSearch) {
        $scope.status.currTalkTo = friend;
        var index = $scope.data.selectedFriends.indexOf(friend);
        if (isSearch) $scope.data.searchUserName = "";
        if ($scope.data.originalId.indexOf(friend.FRIENDID) > -1) return;
        if (index < 0) {
            $scope.data.selectedFriends.push(friend);
        } else {
            $scope.data.selectedFriends.splice(index, 1);
        }
    };
    /**
     * [removeSelectedUser description]从群组中删除用户
     * @param  {[obj]} friend [description]传入的当前用户
     * @return {[type]}        [description]
     */
    $scope.removeSelectedUser = function(friend) {
        $scope.data.selectedFriends.splice($scope.data.selectedFriends.indexOf(friend), 1);
    }
    $scope.submmit = function() {
        $validation.validate($scope.imJoinGroupForm).success(function() {
            // $modalInstance.close(trsspliceString.spliceString($scope.data.selectedFriends, "FRIENDID", ","));
            var result = {
                selectedArray: $scope.data.selectedFriends,
                groupName: $scope.status.groupName,
            }
            $modalInstance.close(result);
        });
    }
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
    /**
     * [hasInGroup description]用于在html中显示是否该成员已在群组中
     * @param  {[obj]} friend [description]传入的当前用户
     * @return {[type]}        [description]
     */
    $scope.hasInGroup = function(friend) {
        if ($scope.data.selectedFriends.indexOf(friend) > -1 || $scope.data.originalId.indexOf(friend.FRIENDID) > -1) {
            return true;
        } else {
            return false;
        }
    }
}]);
