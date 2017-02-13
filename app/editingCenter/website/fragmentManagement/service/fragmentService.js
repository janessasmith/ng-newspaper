/**
 * Created by bzm on 2016/01/04.
 */
'use strict';
angular.module("fragmentServiceModule", ["operateRecordModule","historyVersionModule"]).factory("fragmentService", ["$modal", function($modal) {
    return {
        getNowTime: function() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes();
            return currentdate;
        },
        operateRecord: function(tempId) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/website/fragmentManagement/service/operateRecord/operateRecord_tpl.html",
                windowClass: 'operateRecord-window',
                backdrop: false,
                controller: "operateRecordCtrl",
                resolve: {
                    params: function() {
                        return {
                            tempId: tempId
                        };
                    }
                }
            });
            modalInstance.result.then(function(result) {});
        },
        historyVersion: function(widgetParams) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/website/fragmentManagement/service/historyVersion/historyVersion_tpl.html",
                windowClass: 'historyVersion-window',
                backdrop: false,
                controller: "historyVersionCtrl",
                resolve: {
                    widgetParams: function() {
                        return widgetParams;
                    }
                }
            });
            modalInstance.result.then(function(result) {});
        }
    };
}]);
