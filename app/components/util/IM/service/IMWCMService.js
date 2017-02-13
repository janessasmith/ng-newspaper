'use strict';
angular.module('IMWCMServiceModule', []).factory('IMWCMService', ['$q', 'trsHttpService', function($q, trsHttpService) {

    return {
        /**
         * 获取用户的好友列表
         */
        getFriendList: function() {
            var params = {
                serviceid: "mlf_yuncloud",
                methodname: "getUserFriendsList",
            };
            var defer = $q.defer();
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {

                /*$scope.data.friendList = data;
                if (item) {
                    angular.forEach($scope.data.friendList, function(data, index) {
                        if (data.FRINEDID == item.USERID) {
                            $scope.data.friendList.splice(index, 1);
                            $scope.data.friendList.unshift(data);
                            $scope.status.currTalkTo = data;
                        }
                    });
                    talkToFriend($scope.status.currTalkTo);
                }*/
                defer.resolve(data);
            });
            return defer.promise;
        }

    };
}])
