"use strict";
angular.module('editCenIwoCustomServiceModule', []).
factory('editCenIwoCustomService', ["trsHttpService", "$q", function(trsHttpService, $q) {
    var rooturl = trsHttpService.getBigDataRootUrl();
    var wcmurl = trsHttpService.getWCMRootUrl();
    return {
        //导出 媒立方
        exportDraft: function(ids) {
            var params = {
                serviceid: 'mlf_exportword',
                methodname: 'exportWordFile',
                MetaDataIds: ids,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                // window.open(data);
                window.open("/wcm/app/file/read_file.jsp?FileName="+data);
            });
        },
        //导出 大数据
        exportBigDataDraft: function(ids, channelName, indexName) {
            var params = {
                serviceid: 'mlf_exportword',
                methodname: 'exportBigDataDocs',
                GUIDS: ids,
                CHANNELNAMES: channelName,
                indexName: indexName
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                // window.open(data);
                window.open("/wcm/app/file/read_file.jsp?FileName="+data);
            })
        }
        
    };
}])
