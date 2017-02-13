/*
	create by BaiZhiming 2016-2-26
*/
'use strict';
angular.module("manageCfg.roleManageMent.permissionAssignment.serviceModule", [])
    .factory("permissionAssignmentService", ["$q", "trsHttpService", function($q, trsHttpService) {
        return {
            initGroupRight: function(node, roleid) {
                var deferred = $q.defer();
                if (node.RIGHTID === "0") {
                    var params = {
                        serviceid: "mlf_extrole",
                        methodname: "initGroupRight",
                        ObjId: node.OBJID,
                        ObjType: node.OBJTYPE,
                        OprId: roleid,
                        OprType: "203"
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                        .then(function(data) {
                            deferred.resolve(data.replace(/\"/g,""));
                        });
                } else {
                    deferred.resolve(node.RIGHTID);
                }
                return deferred.promise;
            }
        };
    }]);
