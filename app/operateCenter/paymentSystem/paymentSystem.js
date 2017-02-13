"use strict";
/**
 * operateCenterModule Module
 *
 * Description
 */
angular.module('operateCenterPaymentSystemModule', [])
    .controller('operateCenterPaymentSystemCtrl', ['$scope', '$sce', "$interval", function($scope, $sce, $interval) {
        function setIframeHeight(element) {
            var iframe = element[0];
            try {
                element.height(iframe.contentDocument.body.scrollHeight);
                element.css("height", iframe.contentDocument.body.scrollHeight);
            } catch (e) {
                //console.log(e);
            }

        }
        $scope.stSrc = $sce.trustAsResourceUrl("/wcm/stlogin/loginta");
        /*思图iframe设置高度*/
        var $iframe_st_to_OperateCenter = $("#iframe_st_to_OperateCenter");
        setIframeHeight($iframe_st_to_OperateCenter);
        var iframInterval = $interval(function() {
            if (setIframeHeight.length == 1) {
                setIframeHeight($iframe_st_to_OperateCenter);
            }
        }, 2000);
        $scope.$on('$destroy', function() {
            $interval.cancel(iframInterval);
        });
    }]);
