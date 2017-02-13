'use strict';
/**
 *  Module editIsLock 编辑按钮是否加锁
 *
 * Description  Ly 
 *
 * Time:2016/3/28
 */
angular.module('editIsLockModule', []).factory('editIsLock', ['$q', 'trsHttpService', function($q, trsHttpService) {
    return {
        //判断是否加锁
        isLock: function(item) {
            var defer = $q.defer();
            var params = {
                "serviceid": "mlf_metadata",
                "methodname": "checkLock",
                'MetaDataId': item.METADATAID,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                defer.resolve(data);
            });
            return defer.promise;
        },
        //是否强制解锁
        forceDeblocking: function(item) {
            var defer = $q.defer();
            var params = {
                "serviceid": "mlf_metadata",
                "methodname": "forcedUnLockMetaData",
                'MetaDataId': item.METADATAID,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                defer.resolve(data);
            });
            return defer.promise;
        },
        //正常解锁
        normalLock: function(metadata) {
            var defer = $q.defer();
            var params = {
                "serviceid": "mlf_metadata",
                "methodname": "unLock",
                'MetaDataId': metadata,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                defer.resolve(data);
            });
            return defer.promise;
        },
        //锁定稿件
        lockDraft: function(metadata) {
            var params = {
                "serviceid": "mlf_metadata",
                "methodname": "lockDoc",
                'DocId': metadata,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                
            });
        }
    };
}]);
