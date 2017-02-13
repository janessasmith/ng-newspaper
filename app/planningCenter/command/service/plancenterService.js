"use strict";
angular.module('plancenterServiceModule', []).
factory('plancenterService', ["trsHttpService", function(trsHttpService) {
    var rooturl = trsHttpService.getBigDataRootUrl();
    var wcmurl = trsHttpService.getWCMRootUrl();
    return {
        getReportList: function(id, extraparams) {
            var params = {
                "methodname": "queryDatasOfBTHZ",
                "serviceid": "mlf_report",
                TopicId: id
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        getTopicList: function(extraparams) {
            var params = {
                "methodname": "querySummaryReport",
                "serviceid": "mlf_report"
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },

        getDailyscribe: function(extraparams) {
            var params = {
                "methodname": "queryTodayFeatured",
                "serviceid": "mlf_report"
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        getDailyBestReport: function(id, extraparams) {
            var params = {
                "methodname": "queryDatasOfMRJX",
                "serviceid": "mlf_report",
                TopicId: id
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        getPlanTask:function(extraparams){//额外加入task
            var params ={
                "methodname":"queryOwnerPlanTasks",
                "serviceid":"mlf_task"
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        taskinvoke:function(methodname,extraparams){//额外加入task
            var params ={
                "methodname":methodname,
                "serviceid":"mlf_task"
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        getPlanInfo:function(extraparams){//额外加入info
            var params ={
                "methodname":"queryOwnerPlanInformations",
                "serviceid":"mlf_task"
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        infoinvoke:function(methodname,extraparams){//额外加入info
            var params ={
                "methodname":methodname,
                "serviceid":"mlf_task"
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        invoke: function(methodname, extraparams) {
            var params = {
                "methodname": methodname,
                "serviceid": "mlf_report"
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        getFileType: function(fileName) {
            var typejson = { 'jpg': 'img', 'gif': 'img', 'pdf': 'pdf', 'doc': 'word' };
            var lastfix = fileName.substr(fileName.lastIndexOf('.') + 1);
            return typejson[lastfix];
        }
    };
}])
