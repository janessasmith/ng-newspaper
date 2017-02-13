'use strict';
/**
 *  Module  相关联稿件
 *  createBy  ly
 *  2016/3/9
 * Description
 */
angular.module('newspaperDraftCorrelationModule', []).factory('draftCorrela', ["$q", "trsHttpService",
    function($q, trsHttpService) {
        return {
            /*
             *  initDraftCorrela [Description] 初始化相关联稿件  
             *  @Params queryMethodName  服务名
             *  @Params  parerid   站点id
             *  @Params  scrdocid   稿件id
             */
            initDraftCorrela: function(queryMethodName, parerid,scrdocid) {
                var deferred = $q.defer();
                var btnParams = {
                    serviceid: "mlf_paper",
                    methodname: queryMethodName,
                    PaperId: parerid,
                    SrcDocId: scrdocid
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), btnParams, "get").then(function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
        };
    }
]);
