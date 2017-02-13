'use strict';
angular.module('addRemarkModule', []).
controller('addremarkCtrl', function($scope, $modalInstance, plancenterService, topic) {
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
            initialFrameHeight: 300
        });
    });
    $scope.submit = function() {
        var params = {
            TopicId: topic.TOPICID,
            Remark: ue.getContent(),
            Flag:0
        }; 
        plancenterService.invoke('savePlanTopic', params).then(function(data) {
            $modalInstance.close(data)
        });
    }
});
