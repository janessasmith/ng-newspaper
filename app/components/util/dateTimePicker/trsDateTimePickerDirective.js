"use strict";
/*
   trsDateTimePicker指令:
    html:<trs-date-time-picker></trs-date-time-picker>,
    css处于oneImage.css样式表中，
    js:调用datepiceerService服务，用于定时发布组件的页面替代与逻辑处理
    参数：language选择器显示语言，简体中文为:"zh-CN"，英文为："en"，
          position选择器的展示位置，使用方式为：top-left、top-right、bottom-left、bottom-right,
          weekstart为展示的星期开始数，若要从星期六开始则填写6即可,
          还有参数timeObj，接收后台返回的时间数据；参数available接收input框的是否可点击，与定时发布的checkbox点击关联起来
 */
angular.module('pieceMgr.dateTimepicker', [])
    .directive('trsDateTimePicker', ['$timeout', '$filter', function($timeout, $filter) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                timeObj: "=",
                available: "="
            },
            templateUrl: './components/util/dateTimePicker/dateTimePicker.html', //定时发布碎片
            link: function(scope, element, attr) {
                var dateInput = element[0].children[0];
                scope.datepickerToggle = false;
                var datepicker = jQuery(dateInput).datetimepicker({
                    language: attr.language,
                    weekStart: attr.weekstart,
                    todayBtn: 1,
                    autoclose: true,
                    todayHighlight: 1,
                    startView: 2,
                    format: 'yyyy-mm-dd hh:ii',
                    pickerPosition: attr.position
                });
            }
        };
    }]);
