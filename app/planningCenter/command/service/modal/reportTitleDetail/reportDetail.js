'use strict';
angular.module('reportDetailsModule', []).
controller('reportDetailsCtrl', function($scope, $modalInstance,Upload, trsspliceString,planCtrModalService, plancenterService, report) {
    $scope.report = report;
    $scope.content = report.CONTENT;
    $scope.pagestatus = 'details';
    $scope.editing = false;
    refreshReply();

    function refreshReply() {
        plancenterService.invoke('getPlanReport', { ReportId: report.REPORTID }).then(function(data) {
            $scope.replies = data.REPORT_REPLIESINFO;
        });
    }
    $scope.close = function() {
        $modalInstance.dismiss();
    };

    $scope.modifyStatus = function(status) {
        $scope.pagestatus = status;
    };
    $scope.editReport = function() {
        $scope.editing = true;
    }
    $scope.saveReport = function(status) {
        var params = {
            TopicId: $scope.report.TOPICID,
            Content: $scope.content,
            ReportId: $scope.report.REPORTID
        };
        plancenterService.invoke('savePlanReport', params)
            .then(function(data) {
                report.CONTENT = $scope.content;
                $scope.editing = false;
            });
    };

    $scope.replyReport = function() {
        var fileIds = trsspliceString.spliceString($scope.files, 'imgName', ',');
        plancenterService.invoke('savePlanReplies', { ReportId: $scope.report.REPORTID, AddContent: $scope.addContent, ReplyId: 0, Appendix: fileIds }).then(function(data) {
            $scope.pagestatus = 'details';
            refreshReply();
        });
    };

    $scope.files = [];
    $scope.upload = function(files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                Upload.upload({
                    url: '/wcm/openapi/uploadImage',
                    data: { file: files[i] }
                }).then(function(resp, data) {
                    $scope.files.push(resp.data);
                }, function(resp) {
                });
            }
        }
    };
})
