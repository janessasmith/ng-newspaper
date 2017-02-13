/*
    Create by CC 2016-01-20
*/
'use strict';
angular.module("getWebsiteNameModule", ["batChooseChnlModule", "singleChooseChnlModule", "stickModule", "contentExpansionModule"]).
factory("getWebsiteNameService", ["$q","trsHttpService", function($q,trsHttpService) {
    return {
        getWebsiteName: function(siteid) {
            var channelParams = {
                serviceid: "mlf_websiteoper",
                methodname: "querySiteNameBySite",
                ObjectId: siteid
            };
            var deffered=$q.defer(); 
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), channelParams, "get").then(function(data) {
                deffered.resolve(data);
            });
            return deffered.promise;
        }
    };
}]);
