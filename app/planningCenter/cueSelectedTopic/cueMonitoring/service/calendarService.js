"use strict";
angular.module('calendarServiceModule', ["calendarTplModule"]).factory('calendarService', ['$modal', function($modal) {
    return {
        calendar: function(event,success) {
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/service/calendar.html",
                windowClass: 'calendarModal',
                backdrop: false,
                resolve: {
                    event: function() {
                        return event;
                    }
                },
                controller: "calendarCtrl"
            });
            modalInstance.result.then(function(result) {
                success(result);
            });
        }
    };
}]);
