'use strict';
angular.module('plancenterTaskModule', []).controller('taskAssignCtrl', function($scope, $modalInstance, $state, $location, task,plancenterService) {
    $scope.task = task;
    $scope.logs=[];
    $scope.taskstatus={
        1:'已读',
        10:'新增',
        11:'接受',
        12:'转发',
    }

    plancenterService.taskinvoke('getPlanTask', { TaskId: task.TASKID }).then(function(res) {
        $scope.logs=res.PLANTASKLOGS[0].DATA;
    });
    $scope.close = function() {
        $modalInstance.dismiss();
    };
}).controller('viewTaskCtrl', function($scope, $modalInstance, $state, $location, trsHttpService, plancenterService, task) {
    var redirectId = null;
    $scope.task = task;
    $scope.logs=[];
    $scope.taskstatus={
        1:'已读',
        10:'新增',
        11:'接受',
        12:'转发',
    }
    $scope.toRedirect = false;
    $scope.searchWord = '';
    $scope.checkKeyword = '';
    $scope.close = function() {
        if (task.TASKTYPE == 2) {
            $modalInstance.close({ type: 1 });
        } else {
            $modalInstance.dismiss();
        }
    };
    plancenterService.taskinvoke('getPlanTask', { TaskId: task.TASKID }).then(function(res) {
        $scope.logs=res.PLANTASKLOGS[0].DATA;
    });
    $scope.revice = function() {
        plancenterService.taskinvoke('acceptPlanTask', { TaskId: task.TASKID }).then(function(res) {
            $modalInstance.close({ type: 3 });
        });
    };
    $scope.redirect = function() {
        $scope.toRedirect = true;
    };
    $scope.cancelRedirect = function() {
        $scope.toRedirect = false;
    };
    $scope.doRedirect = function() {
        plancenterService.taskinvoke('forwardPlanTask', { TaskId: task.TASKID, UserId: redirectId }).then(function(res) {
            $modalInstance.close({ type: 4 });
        });
    };
    $scope.checkRedirect=function(){
        return redirectId===undefined ||redirectId=== null;
    }
    $scope.getSuggestions = function(viewValue) {
        if (viewValue !== '' && checkValue(viewValue)) {
            var searchUsers = {
                serviceid: "mlf_extuser",
                methodname: "queryUsersByName",
                Name: viewValue
            };
            if ($scope.isRequest) {
                $scope.isRequest = false;
                return [];
            } else {
                return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), searchUsers, "post").then(function(data) {
                    return data;
                });
            }
        }
    };

    var checkValue = function(newValue) {
        if ($scope.checkKeyword == $scope.searchWord) {
            return false;
        } else if (angular.isObject(newValue)) {
            redirectId = newValue.ID;
            $scope.checkKeyword = $scope.searchWord = newValue.SUGGESTION;
            return false;
        } else {
            $scope.checkKeyword = $scope.searchWord
            return true;
        }
    } 
});
