angular.module("planCtrModalModule", ["reportModule", "pickReportsModule", "reportDetailsModule", "replyReportModule", "plancenterTaskModule","createInfoModule","plancenterInfoModule","addRemarkModule","infotypeModule"]).factory("planCtrModalService", function($modal) {
    return {

        addRemark: function(topic) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/addRemark/addRemark.html",
                windowClass: "common-modal",
                backdrop: false,
                resolve: {
                    topic: function() {
                        return topic;
                    }
                },
                size:'full',
                controller: "addremarkCtrl"
            });
            return modalInstance;
        },
        // 新增报题
        createReport: function(topic) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/createReport/createReport.html",
                windowClass: "plancenter-create-report common-modal",
                backdrop: false,
                resolve: {
                    topic: function() {
                        return topic;
                    }
                },
                size:'full',
                controller: "createReportCtrl"
            });
            return modalInstance;
        },
        // 编辑报题
        editReport: function(report, topicName) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/createReport/createReport.html",
                windowClass: "plancenter-create-report common-modal",
                backdrop: false,
                resolve: {
                    report: function() {
                        return report;
                    },
                    topicName: function() {
                        return topicName;
                    }
                },
                controller: "editReportCtrl"
            });
            return modalInstance;
        },
        selectBestReports: function(topic, reports) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/checkSelectConfirm/checkSelectConfirm_tpl.html",
                windowClass: "confirm-report-modal common-modal",
                backdrop: false,
                size: 'lg',
                resolve: {
                    topic: function() {
                        return topic;
                    },
                    reports: function() {
                        return reports;
                    }
                },
                controller: "confirmPickReportsCtrl"
            });
            return modalInstance;
        },
        reportDetails: function(report) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/reportTitleDetail/reportTitleDetail_tpl.html",
                windowClass: "detail-modal common-modal",
                backdrop: false,
                size: 'lg',
                resolve: {
                    report: function() {
                        return report;
                    }
                },
                controller: "reportDetailsCtrl"
            });
            return modalInstance;
        },
        replyReport: function(report) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/replyReport/replyReport.html",
                windowClass: "reply-modal common-modal",
                backdrop: false,
                size: 'lg',
                resolve: {
                    report: function() {
                        return report;
                    }
                },
               
                controller: "replyReportCtrl"
            });
            return modalInstance;
        },
        assignTask: function(task) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/task/taskAssign.html",
                windowClass: "task-modal common-modal",
                backdrop: false,
                resolve: {
                    task: function() {
                        return task;
                    }
                },
                controller: "taskAssignCtrl"
            });
            return modalInstance;
        },
        viewTask: function(task) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/task/viewTask.html",
                windowClass: "task-modal common-modal",
                backdrop: false,
                resolve: {
                    task: function() {
                        return task;
                    }
                },
                controller: "viewTaskCtrl"
            });
            return modalInstance;
        },
        createInfo: function(success) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/createInfo/createInfo.html",
                windowClass: 'common-modal info-modal',
                size:'lg',
                backdrop: false,
                controller: "createInfoCtrl",
                resolve: {}
            });
            modalInstance.result.then(function(result) {
                success(result);
            });
        },
        createInfoType: function(success) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/createInfoType/createInfoType.html",
                windowClass: 'common-modal', 
                backdrop: false,
                controller: "createInfotypeCtrl",
                resolve: {}
            });
            return modalInstance; 
        },
        viewInfo: function(info) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/command/service/modal/info/infoView.html",
                windowClass: "infoview-modal common-modal",
                backdrop: false,
                resolve: {
                    info: function() {
                        return info;
                    }
                },
                controller: "infoViewModalCtrl"
            });
            return modalInstance;
        }
    }
});
