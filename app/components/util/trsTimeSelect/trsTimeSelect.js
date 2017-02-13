"use strict";
/**
 * createdBy cc 2016-6-24
 * 时间选择器
 * options,selectedOption,label,callback为下拉组件原有参数
 * fromdate,untildate为自定义的开始时间与结束时间
 * 功能为下拉组件基础上增加自定义时间功能
 */
angular.module('trsTimeSelectModule', []).
directive('trsTimeSelect', ['$location', "$q", '$filter', 'trsHttpService', '$stateParams', '$state', '$timeout', 'trsconfirm', function($location, $q, $filter, trsHttpService, $stateParams, $state, $timeout, trsconfirm) {
    return {
        restrict: 'EA',
        templateUrl: "./components/util/trsTimeSelect/trsTimeSelect_tpl.html",
        scope: {
            options: "=",
            selectedOption: "=",
            label: "@",
            callback: "&",
            fromdate: "=",
            untildate: "="
        },
        link: function(scope, iElement, iAttrs) {
            scope.status = {
                isCustom: false,
            };
            scope.data = {
                fromDate:new Date(),
                untilDate:new Date()
            };
            scope.setSelected = function(option) {
                scope.label = null;
                scope.selectedOption = option;
                $timeout(function() {
                    scope.callback();
                });
            };
            /**
             * [setCustomOption description]自定义时间检索
             */
            scope.setCustomOption = function() {
                scope.customTimeStartTime = $filter('date')(scope.data.fromDate, "yy-MM-dd").toString();
                scope.customTimeEndTime = $filter('date')(scope.data.untilDate, "yy-MM-dd").toString();
                scope.fromdate = scope.data.fromDate = $filter('date')(scope.data.fromDate, "yyyy-MM-dd").toString();
                scope.untildate = scope.data.untilDate = $filter('date')(scope.data.untilDate, "yyyy-MM-dd").toString();
                scope.customTime = scope.customTimeStartTime + '~' + scope.customTimeEndTime;
                scope.status.isCustom = false;
                scope.selectedOption = {
                    name: "自定义",
                    value: scope.data.fromDate + ',' + scope.data.untilDate
                };
                $timeout(function() {
                    if (new Date(scope.data.fromDate).getTime() <= new Date(scope.data.untilDate).getTime()) {
                        scope.callback();
                    } else {
                        trsconfirm.alertType('时间检索失败', '开始时间不能大于结束时间', "error", false);
                    }
                });
            }
        }
    };
}]);
