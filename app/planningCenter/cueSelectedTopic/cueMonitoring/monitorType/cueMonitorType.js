/**
 * Author:XCL
 *
 * Time:2016-02-16
 */
"use strict";
angular.module('planCueMonitorTypeModule', ['planCueMonitorTypeCustomModule'])
    .controller('cueMonitorTypeCtrl', ['$scope', '$modalInstance', '$modal', 'addedFixedMonitors', function($scope, $modalInstance, $modal, addedFixedMonitors) {
        initStatus();
        init();

        function initStatus(){
            $scope.status = {
                "isExisted":{}
            };
        }

        function init(){
            getExistedMonitors();
        }

        //判断已存在的监控
        function getExistedMonitors(){
            angular.forEach(addedFixedMonitors,function(value,key){
                $scope.status.isExisted[value.MONITORTYPE] = value.MONITORTYPE;
            });
        }
    
        //取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        //根据不同的渠道显示不同的配置
        $scope.showConfig = function(item, configTitle, monitorname) {
            var transformData = {
                "MONITORTYPE": item,
                "CONFIGTITLE": configTitle,
                "MONITORNAME": monitorname
            };
            var modalInstance = $modal.open({
                templateUrl: "./planningCenter/cueSelectedTopic/cueMonitoring/config/cueMonitorConfig_tpl.html",
                windowClass: "cue-monitor-config-window",
                controller: "cueMonitorConfigCtrl",
                resolve: {
                    transformData: function() {
                        return transformData;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                $modalInstance.close(result);
            });
        };
    }]);
