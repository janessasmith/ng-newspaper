"use strict";
angular.module('resourceDirectiveModule', ['ui.bootstrap.datepicker']).directive('previewTitle', ['$window', function($window) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            titleText: '=',
            targetUrl: '@',
            summaryText: '=',
            adjustPosition: "@",
            notRead: "@",
        },
        template: '<div class="preview-title" ng-mouseenter="mouseenter($event)" ng-mouseleave="mousleave()"><a class="limita" data-ng-bind-html="titleText"  ng-click="openTarget()" ng-class="{\'not-read\':notRead==0}"></a>' +
            '<div class="panel panel-info extra-info" ng-if="extraInfoShow" ng-style="panelpostion"> ' +
            '<div class="panel-heading" data-ng-bind-html="titleText"></div>' +
            '<div class="panel-body"><span class="text-red">摘要：</span>{{summaryText||noSummaryText}}</div><div class="arrow"><div></div></div>',

        controller: function($scope, $element, $attrs) {

            $scope.noSummaryText = $attrs.noSummaryText ? $attrs.noSummaryText : '';
            $scope.extraInfoShow = false;
            $scope.openTarget = function() {
                if ($scope.notRead || $scope.notRead == '') {
                    $scope.notRead = 1;
                }
                if ($scope.targetUrl) {
                    $window.open($scope.targetUrl);
                }
            };

            $scope.mousleave = function() {
                $scope.extraInfoShow = false;
            };
        },
        link: function(scope, element, attrs, ctrl) {
            var windowHt = $window.outerHeight,
                elemTp = angular.element(element).offset().top,
                elemHt = scope.summaryText && scope.summaryText.length / 27 * 21 + 50;
            scope.mouseenter = function($event) {
                if (scope.adjustPosition == "true") {
                    if (windowHt - elemTp > elemHt) {
                        scope.panelpostion = {
                            left: $event.offsetX
                        };
                    } else {
                        scope.panelpostion = {
                            left: $event.offsetX,
                            top: -elemHt
                        };
                    }
                } else {
                    scope.panelpostion = {
                        left: $event.offsetX
                    };
                }

                scope.extraInfoShow = true;
            };
        }
    };
}]).directive('customSelect', ["trsconfirm", function(trsconfirm) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            callback: "&",
            options: "=",
            selectedOption: "=",
            selectcustom: "=",
            label: "@",
            callbackWithoutCompareTime: "&",
            isWithoutCompareTime: "="
        },
        templateUrl: "./resourceCenter/directive/resourceDirectiveModule/coustomSelect.html",
        controller: function($scope, $element, $timeout) {
            $scope.showcustom = false;
            $scope.selectcustom = false;
            $scope.setSelected = function(option) {
                $scope.label = null;
                $scope.selectedOption = option;
                $scope.selectcustom = false;
                $timeout(function() {
                    $scope.callback();
                });
            };
            $scope.customOption = {
                name: '自定义',
                value: 'custom'
            };
            $scope.time = {
                startdate: new Date(),
                enddate: new Date()
            };
            $scope.selectCustomOption = function() {
                $scope.showcustom = true;
                $scope.label = '选择时间范围';
            };
            $scope.setCustomOption = function() {
                $scope.label = null;
                $scope.customOption.startdate = $scope.time.startdate;
                $scope.customOption.enddate = $scope.time.enddate;
                $scope.selectedOption = $scope.customOption;
                $scope.showcustom = false;
                if (angular.isDefined($scope.selectcustom)) {
                    $scope.selectcustom = true;
                }
                if ($scope.isWithoutCompareTime) {
                    $timeout(function() {
                        $scope.callbackWithoutCompareTime();
                    });
                } else {
                    if ($scope.customOption.startdate.getTime() > $scope.customOption.enddate.getTime()) {
                        trsconfirm.alertType('检索失败', '开始时间不能大于结束时间', "error", false);
                    } else {
                        $timeout(function() {
                            $scope.callback();
                        });
                    }
                }

            };
            $scope.toggled = function(open) {
                if (open) {
                    $scope.showcustom = false;
                }
            };
            $scope.format = 'yyyy/MM/dd';
            $scope.openStart = function() {
                $scope.start.open = true;
            };
            $scope.openEnd = function() {
                $scope.end.open = true;
            };
            $scope.start = {
                open: false,
            };
            $scope.end = {
                open: false,
            };
            $scope.dateOptions = {
                startingDay: 6,
                showWeeks: false
            };

            $scope.buttonwidth = function() {
                var width = $scope.selectcustom ? $scope.time.startdate && $scope.time.enddate ? 185 : 145 : 136;
                return {
                    width: width + 'px'
                };
            };
        }
    };
}]).directive('previewTitleOnce', ['$window', function($window) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            titleText: '@ ',
            targetUrl: '@',
            summaryText: '@',
            adjustPosition: "@",
            notRead: "@",
        },
        template: '<div class="preview-title" ><a class="limita" bindonce bo-html="titleText"  ng-click="openTarget()" bo-class="{\'not-read\':notRead==0}"></a>' +
            '<div class="panel panel-info extra-info hidden" bindonce="panelpostion"  bo-style="panelpostion"> ' +
            '<div class="panel-heading" bindonce bo-html="titleText"></div>' +
            '<div class="panel-body"><span class="text-red">摘要：</span><span bindonce bo-text="summaryText"></div><div class="arrow"><div></div></div>',

        controller: function($scope, $element, $attrs) {
            $scope.summaryText = $scope.summaryText == 'undefined' ? '' : $scope.summaryText;
            $scope.noSummaryText = $attrs.noSummaryText ? $attrs.noSummaryText : '';
            $scope.extraInfoShow = false;
            $scope.openTarget = function() {
                if ($scope.notRead || $scope.notRead == '') {
                    $scope.notRead = 1;
                }
                if ($scope.targetUrl) {
                    $window.open($scope.targetUrl);
                }
            };
            $element.bind('mouseleave', function() {
                $element.find('.extra-info')['addClass']('hidden');
            })

        },
        link: function(scope, element, attrs, ctrl) {
            var windowHt = $window.outerHeight,
                elemTp = angular.element(element).offset().top,
                elemHt = scope.summaryText && scope.summaryText.length / 27 * 21 + 50;
            element.bind('mouseenter', function(event) {
                if (scope.adjustPosition == "true") {
                    if (windowHt - elemTp > elemHt) {
                        scope.panelpostion = {
                            left: event.offsetX
                        };
                    } else {
                        scope.panelpostion = {
                            left: event.offsetX,
                            top: -elemHt
                        };
                    }
                } else {
                    scope.panelpostion = {
                        left: event.offsetX
                    };
                }
                element.find('.extra-info')['removeClass']('hidden');
            })

        }
    };
}])
