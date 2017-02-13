"use strict";
/*
    wordNum指令：
    html:<trs-word-num num-obj=""></trs-word-num>，
    css:处于oneImage.css样式表中，
    js:完成字数组件的页面替代与逻辑处理，调用参数为页面对象的标题或摘要属性，如：item.title
 */
angular.module('util.trsWordNum', [])
    .directive('trsWordNum', function() {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                oneImageWordNum: "@numObj"
            },
            controller: function($scope, $element) {
                $scope.$watch('oneImageWordNum', function() {
                    //去除首尾空格
                    $scope.oneImageWordNum=$scope.oneImageWordNum.replace(/(^\s*)|(\s*$)/g,"");
                    //去除空格
                    // $scope.oneImageWordNum = $scope.oneImageWordNum.replace(/\s+/g, "");
                    var len = $scope.oneImageWordNum.length;
                    $scope.oneImageWordNumTrue = len;
                });

            },
            template: '<div style="width:18px" ng-bind="oneImageWordNumTrue" class="wordNum"></div>',

        };
    });
