"use strict";
angular.module('groupUserRightsModule', []).factory('groupUserRightsService', ['$q', 'trsHttpService', function($q, trsHttpService) {
    /**
     * [getBtnRights description]根据权限名称归类权限对象
     * @param  {[type]} params [description]各渠道权限请求参数
     * @return {[obj]}        [description]处理过的权限对象集合
     */
    function getBtnRights(params) {
        var defferd = $q.defer();
        var btnRights = {};
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            angular.forEach(data, function(value, key) {
                if (value.OPERNAME) {
                    btnRights[value.OPERNAME] = value;
                } else {
                    btnRights[value.split('.').pop()] = value;
                }
                defferd.resolve(btnRights);
            });
        });
        return defferd.promise;
    }
    return {
        /**
         * [initWebsiteListBtn description]组织用户管理权限
         * @param  {[str]} OperType   [description]权限类型
         * @param  {[str]} groupid    [description]组织ID
         * @return {[obj]}            [description]返还的权限位
         */
        initBtnRights: function(OperType, groupid) {
            var defferd = $q.defer();
            var btnParams = {
                'serviceid': "mlf_metadataright",
                'methodname': "queryGroupOperKey",
                'GroupId': groupid,
                'OperType': OperType
            };
            getBtnRights(btnParams).then(function(rights) {
                defferd.resolve(rights);
            });
            return defferd.promise;
        },
        /**
         * [initWebsiteListBtn description]所有用户管理权限
         * @param  {[str]} Classify   [description]权限类型
         * @return {[obj]}            [description]返还的权限位
         */
        initUserBtnRights: function(Classify) {
            var defferd = $q.defer();
            var params = {
                serviceid: "mlf_metadataright",
                methodname:"queryOperKeysOfNormalModal",
                ModalName: "用户管理",
                Classify: Classify,
            };
            getBtnRights(params).then(function(rights) {
                defferd.resolve(rights);
            });
            return defferd.promise;
        },
    };
}]);
