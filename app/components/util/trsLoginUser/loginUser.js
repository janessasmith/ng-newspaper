"use strict";
/* ************* name ***************
// Readme: <trs-login-user></trs-login-user>
// Data: 2016/1/14 14:36:25 
*******************************************/
angular.module('util.trsLoginUserModule', [])
    .directive('trsLoginUser', ["trsHttpService", "$compile", "$timeout", "localStorageService", "$state", "$popover", function(trsHttpService, $compile, $timeout, localStorageService, $state, $popover) {
        return {
            restrict: 'EA',
            scope: {
                user: "=",
                img: "=",
            },
            templateUrl: './components/util/trsLoginUser/loginUser_tpl.html',
            //template: '<a class="userName" ui-sref="myzone.personalinfo" href="javascript:;"><img src="./editingCenter/app/images/user_icon.png" class="edi_usr">{{user}} 欢迎你！</a>',
            link: function($scope, iElement, iAttrs) {
                $timeout(function() {
                    initStatus();
                    var dataGroup = null;
                    var $popoverUser = iElement.find('.popoverUser');
                    var params = {
                        serviceid: "mlf_extuser",
                        methodname: "queryGroups"
                    };
                    if (dataGroup === null) {
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                            $scope.dataUser = data;
                            dataGroup = data;
                        });
                    }
                    $scope.loginUserGroup = function() {
                        $scope.isPopoverShow = true;
                    };
                    $scope.loginUserLeave = function() {
                        $scope.isPopoverShow = false;
                    };
                    // $popover(iElement, {
                    //     "tooltip-trigger": "mouseenter",
                    //     "placement": "bottom",
                    //     "contentTemplate": './components/util/trsLoginUser/loginUser_tpl.html',
                    //     "trigger": 'hover'
                    // });

                    $scope.userGroup = function(item) {
                        var params = {
                            serviceid: "mlf_extuser",
                            methodname: "initGroupForLoginUser",
                            GroupId: item.GROUPID,
                            GroupPath: item.GROUPPATH
                        };
                        if ($scope.status.curGroupId !== item.GROUPID) {
                            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(
                                function(data) {
                                    if (data.replace(/\"/g, "") === "true") {
                                        var userData = localStorageService.get("mlfCachedUser");
                                        userData.GroupId = item.GROUPID;
                                        localStorageService.set("mlfCachedUser", userData);
                                        $state.go("editctr.iWo.personalManuscript", "", { reload: true });
                                    }
                                }
                            );
                        }
                    };

                    function initStatus() {
                        $scope.status = {
                            curGroupId: ""
                        };
                        $scope.status.curGroupId = localStorageService.get("mlfCachedUser").GroupId;
                    }
                });

            }
        };
    }]);
