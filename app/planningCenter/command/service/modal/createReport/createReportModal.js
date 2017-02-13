'use strict';
angular.module('reportModule', []).
controller('createReportCtrl', function($scope, $modalInstance, plancenterService, topic) {
    var ue;
    $scope.title = topic.CONTENT;
    $scope.close = function() {
        $modalInstance.dismiss();
    };
    LazyLoad.js(["./lib/ueditor2/ueditor.config.js?v=6.0", "./lib/ueditor2/ueditor.all.js?v=6.0"], function() {
         ue = UE.getEditor('reportEditer', {
            toolbars: [
                ['bold', 'italic', 'underline', 'strikethrough', '|', 'forecolor', 'fontsize','insertimage']
            ],
            zIndex: 2000,
            initialFrameHeight: 100
        });
    });
    $scope.submit = function() {
        var params = {
            TopicId: topic.TOPICID,
            Content: ue.getContent(),
            ReportId: 0
        };
        plancenterService.invoke('savePlanReport', params).then(
            function(data) {
                $modalInstance.close(data)
            });
    }
}).controller('editReportCtrl', function($scope, $modalInstance, plancenterService, report, topicName) {
    $scope.title = topicName;
    $scope.content = report.CONTENT;
    $scope.close = function() {
        $modalInstance.dismiss();
    };
    $scope.submit = function() {
        var params = {
            TopicId: report.TOPICID,
            Content: $scope.content,
            ReportId: report.REPORTID
        };
        plancenterService.invoke('savePlanReport', params).then(
            function(data) {
                $modalInstance.close(data)
            });
    }
});