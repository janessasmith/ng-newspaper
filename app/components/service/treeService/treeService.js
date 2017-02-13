"use strict";
/*
请求各种树的数据
 */
angular.module("treeServiceModule", [])
    .factory("treeService", ["$q", "trsHttpService", function($q, trsHttpService) {
        return {
            /**
             * [queryGroupTreeForGroupUserMgr description]用户管理树
             * @param  {[string]} roleid   [description]角色Id非必传
             * @return {[object]}        [description]
             */
            queryGroupTreeForGroupUserMgr: function(roleId) {
                var deffer = $q.defer();
                var params = {
                    serviceid: "mlf_group",
                    methodname: "queryGroupTreeForGroupUserMgr",
                    RoleId: roleId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                    .then(function(data) {
                        deffer.resolve(data);
                    });
                return deffer.promise;
            },
            /**
             * [queryChildGroupsForGroupUserMgr description]用户管理树异步查询子节点
             * @param  {[string]} roleid   [description]角色Id非必传
             * @param  {[string]} GroupId   [description]组织Id必传
             * @return {[object]}        [description]
             */
            queryChildGroupsForGroupUserMgr: function(roleId, groupId) {
                var deffer = $q.defer();
                var params = {
                    serviceid: "mlf_group",
                    methodname: "queryChildGroupsForGroupUserMgr",
                    GroupId: groupId,
                    RoleId: roleId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                    .then(function(data) {
                        deffer.resolve(data);
                    });
                return deffer.promise;
            },
            /**
             * [queryGroupTreeWithSecondRight description]获得带权限的树
             * @return {[type]} [description]
             */
            queryGroupTreeWithSecondRight: function() {
                var deffered = $q.defer();
                var params = {
                    serviceid: "mlf_group",
                    methodname: "queryGroupTreeWithSecondRight",
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    deffered.resolve(data);
                });
                return deffered.promise;
            },
            /**
             * [queryChildGroupsWithSecondRight description]获得带权限树的子组织
             * @param  {[num]} groupId [description]组织ID
             * @return {[null]}         [description]
             */
            queryChildGroupsWithSecondRight: function(groupId) {
                var deffered = $q.defer();
                var params = {
                    "serviceid": "mlf_group",
                    "methodname": "queryChildGroupsWithSecondRight",
                    "GroupId": groupId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    deffered.resolve(data);
                });
                return deffered.promise;
            }
        };
    }]);
