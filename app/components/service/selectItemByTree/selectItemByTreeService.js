/*
    Create by BaiZhiming 2016-1-18
*/
'use strict';
angular.module("trsSelectItemByTreeModule", ["deptAndUserModule", "selectUserModule", "selectRoleModule", "selectDeptModule","createTaskModule","selectPowerRoleModule"])
    .factory("trsSelectItemByTreeService", ["$modal", function($modal) {
        return {
            getDeptAndUser: function(roleid, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./components/service/selectItemByTree/template/deptAndUser_tpl.html",
                    windowClass: 'manageConfig-privilegedAssignment-window',
                    backdrop: false,
                    controller: "deptAndUserCtrl",
                    resolve: {
                        roleid: function() {
                            return roleid;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            getUser: function(success) {
                var modalInstance = $modal.open({
                    templateUrl: "./components/service/selectItemByTree/template/user_tpl.html",
                    windowClass: 'manageConfig-privilegedAssignment-window',
                    backdrop: false,
                    controller: "selectUserCtrl",
                    /*resolve: {
                        roleid: function() {
                            return roleid;
                        }
                    }*/
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            getRole: function(title, itemsd, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./components/service/selectItemByTree/template/role_tpl.html",
                    windowClass: 'manageConfig-privilegedAssignment-window',
                    backdrop: false,
                    controller: "selectRoleCtrl",
                    resolve: {
                        itemsd: function() {
                            return itemsd;
                        },
                        title: function() {
                            return title;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            getPowerRole: function(title, itemsd, success) {
                var modalInstance = $modal.open({
                    templateUrl: "./components/service/selectItemByTree/template/powerRole_tpl.html",
                    windowClass: 'manageConfig-powerRole-window',
                    backdrop: false,
                    controller: "selectPowerRoleCtrl",
                    resolve: {
                        itemsd: function() {
                            return itemsd;
                        },
                        title: function() {
                            return title;
                        }
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            getDept: function(date,success) {
                var modalInstance = $modal.open({
                    templateUrl: "./components/service/selectItemByTree/template/dept_tpl.html",
                    windowClass: 'manageConfig-privilegedAssignment-window createTopicmodal',
                    backdrop: false,
                    controller: "selectDeptCtrl",
                    resolve: { 
                        crTime:date
                    }
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            createTask: function(success) {
                var modalInstance = $modal.open({
                    templateUrl: "./components/service/selectItemByTree/template/createTask.html",
                    windowClass: 'manageConfig-privilegedAssignment-window ',
                    backdrop: false,
                    controller: "createTaskCtrl",
                    resolve: {}
                });
                modalInstance.result.then(function(result) {
                    success(result);
                });
            },
            setTopic: function(topic) {
                var modalInstance = $modal.open({
                    templateUrl: "./components/service/selectItemByTree/template/setTopic.html",
                    windowClass: 'manageConfig-privilegedAssignment-window createTopicmodal' ,
                    backdrop: false,
                    controller: "setTopicCtrl",
                    resolve: {topic:topic}
                });
                return modalInstance 
            }
        };
    }]);
