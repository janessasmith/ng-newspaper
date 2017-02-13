'use strict';
angular.module('replyReportModule', []).
controller('replyReportCtrl', function($scope, $modalInstance,trsspliceString, Upload, plancenterService, report) {
    var ue;
    $scope.report = report; 
    $scope.submit = function() {
        var fileIds=trsspliceString.spliceString($scope.files,'imgName',',');
        plancenterService.invoke('savePlanReplies', { ReportId: report.REPORTID,ParentId:0, AddContent: ue.getContent(), ReplyId: 0 ,Appendix:fileIds}).then(function(data) {
            $modalInstance.close(data);
        });
    };
    $scope.close = function() {
        $modalInstance.dismiss();
    };
    LazyLoad.js(["./lib/ueditor2/ueditor.config.js?v=6.0", "./lib/ueditor2/ueditor.all.js?v=6.0"], function() {
         ue = UE.getEditor('replyEditer', {
            toolbars: [
                ['bold', 'italic', 'underline', 'strikethrough', '|', 'forecolor', 'fontsize', 'insertimage','attachment'
                ]
            ],
            zIndex: 2000,
            initialFrameHeight: 100
        });
    });
})
