"use strict";
angular.module('taskAssignmentModule', [])
    .controller('taskAssignmentCtrl', function($scope, $state, $location, trsspliceString, plancenterService, planCtrModalService, trsSelectItemByTreeService, trsconfirm) {
        var vm = $scope.vm = {
            pageParams: {
                PageId: 1,
                jumptoPage: 1
            },
            pager: {
                CURRPAGE: 1,
                PAGESIZE: 2
            }
        };
        var init = function() {
            $scope.tasktype = ['已读', '未读', '接受', '转发'];
            getPlanTask();
            $scope.$watch("$parent.initStatus.rwzl.rwzp", function(newV, oldV) {
                getTaskAssignRights();
            });
        };
        var getPlanTask = function() {
            plancenterService.taskinvoke('queryOwnerPlanTasks', vm.pageParams).then(function(res) {
                vm.tasks = res.DATA;
                vm.pager = res.PAGER;
            });
        };

        $scope.createNewTask = function() {
            var createModal = trsSelectItemByTreeService.createTask(function(task) {
                plancenterService.taskinvoke('savePlanTask', task).then(function(data) {
                    getPlanTask();
                });

            });
        };

        $scope.viewTask = function(task) {
            if (!$scope.rights.chakantask) {
                trsconfirm.alertType("您没有查看权限", "", "error", false);
                return;
            }
            var viewTaskModal = planCtrModalService.assignTask(task);
        }
        $scope.pageChanged = function() {
            vm.pageParams.jumptoPage = vm.pageParams.PageId = vm.pager.CURRPAGE;
            getPlanTask();
        };
        $scope.jumptoPage = function() {
            vm.pageParams.PageId = vm.pageParams.jumptoPage;
            getPlanTask();
        }
        $scope.toggleTask = function(task) {
            task.ischecked = !task.ischecked;
        };
        init();
        //获取任务指派权限
        function getTaskAssignRights() {
            $scope.rights = $scope.$parent.initStatus.rwzl.rwzp;
        }
    }).controller('taskViewCtrl', function($scope, $state, $location, trsspliceString, plancenterService, planCtrModalService, trsSelectItemByTreeService) {
        var vm = $scope.vm = {
            pageParams: {
                PageId: 1,
                jumptoPage: 1
            },
            pager: {
                CURRPAGE: 1,
                PAGESIZE: 2
            }
        };
        var init = function() {
            $scope.tasktype = ['已读', '未读', '接受', '转发'];
            getPlanTask();
            $scope.$watch("$parent.initStatus.rwzl.rwck", function(newV, oldV) {
                getTaskViewRights();
            });
        };
        var getPlanTask = function() {
            plancenterService.taskinvoke('queryPlanTasks', vm.pageParams).then(function(res) {
                vm.tasks = res.DATA;
                vm.pager = res.PAGER;
            });
        };

        $scope.pageChanged = function() {
            vm.pageParams.jumptoPage = vm.pageParams.PageId = vm.pager.CURRPAGE;
            getPlanTask();
        };
        $scope.jumptoPage = function() {
            vm.pageParams.PageId = vm.pageParams.jumptoPage;
            getPlanTask();
        };
        $scope.viewTask = function(task) {
            var viewTaskModal = planCtrModalService.viewTask(task);
            viewTaskModal.result.then(function(result) {
                task.TASKTYPE = result.type;
            });
        }
        init();
        //获取任务查看权限
        function getTaskViewRights() {
            $scope.rights = $scope.$parent.initStatus.rwzl.rwck;
        }
    });
