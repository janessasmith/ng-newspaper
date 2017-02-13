/**
 * Author:XCL
 * Time:2016-03-08
 * Description:时间显示转换器
 *             参数：
 *             input:当前对象的毫秒数
 *          
 */
"use strict";
angular.module('trsDateTransformModule', [])
    .filter("trsDateTransform", ["$filter", function($filter) {
        return function(input) {
            var showDate;
            var week = $filter("date")(input, "EEE");
            var time = $filter("date")(input, "HH:mm:ss");
            var now = new Date();
            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(0);
            now.setMilliseconds(0);
            now = now.getTime();
            var interval = (now - input) / 86400000;
            switch (week) {
                case 0:
                    week = "星期天";
                    break;
                case 1:
                    week = "星期一";
                    break;
                case 2:
                    week = "星期二";
                    break;
                case 3:
                    week = "星期三";
                    break;
                case 4:
                    week = "星期四";
                    break;
                case 5:
                    week = "星期五";
                    break;
                case 6:
                    week = "星期六";
                    break;
            }
            if (interval > -1 && interval <= 0) {
                showDate = "今天" + time;
            } else if (interval > 0 && interval <= 1) {
                showDate = "昨天" + time;
            } else if (interval > 1 && interval <= 6) {
                showDate = week + time;
            } else if (interval > 6) {
                showDate = $filter("date")(input, "yy-MM-dd HH:mm:ss");
            }
            return showDate;
        };
    }]);
