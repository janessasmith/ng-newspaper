"use strict";
angular.module('editcenterRightsModule', []).factory('editcenterRightsService', ['$q', 'trsHttpService', function($q, trsHttpService) {
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
                btnRights[value.OPERNAME] = value;
                defferd.resolve(btnRights);
            });
        });
        return defferd.promise;
    }
    return {
        /**
         * [initWebsiteListBtn description]网站待编，待审，已签发权限
         * @param  {[str]} methodname [description]网站下各渠道的权限名
         * @param  {[str]} channelid  [description]所属的栏目ID
         * @return {[obj]}            [description]返还的权限位
         */
        initWebsiteListBtn: function(methodname, channelid) {
            var defferd = $q.defer();
            var btnParams = {
                'serviceid': "mlf_metadataright",
                'methodname': 'queryOperRightByDocStatus',
                'ChannelId': channelid,
                'StatusType': methodname
            };
            getBtnRights(btnParams).then(function(rights) {
                defferd.resolve(rights);
            });
            return defferd.promise;
        },
        /**
         * [initWebsiteListBtnWithoutChn description]网站定时签发，废稿，撤稿全选
         * @param  {[str]} methodname [description]网站下各渠道的权限名
         * @param  {[str]} siteid     [description]所属的频道ID
         * @return {[obj]}            [description]返还的权限位
         */
        initWebsiteListBtnWithoutChn: function(methodname, siteid) {
            var defferd = $q.defer();
            var btnParams = {
                serviceid: "mlf_metadataright",
                methodname: "queryOperKeyByBaseChannel",
                SiteId: siteid,
                Classify: methodname
            };
            getBtnRights(btnParams).then(function(rights) {
                defferd.resolve(rights);
            });
            return defferd.promise;
        },
        /**
         * [initIwoListBtn description]Iwo下权限
         * @param  {[str]} ModalName [description]Iwo下各渠道的权限名
         * @return {[obj]}           [description]Iwo下渠道的权限
         */
        initIwoListBtn: function(ModalName) {
            var deferred = $q.defer();
            var btnParams = {
                'serviceid': "mlf_metadataright",
                'methodname': 'findMyOperRightByModal',
                'ModalName': ModalName,
            };
            getBtnRights(btnParams).then(function(rights) {
                deferred.resolve(rights);
            });
            return deferred.promise;
        },
        /**
         * [initNewspaperListBtn description]报纸下权限
         * @param  {[str]} methodname [description]报纸名
         * @param  {[str]} siteId     [description]报纸的站点ID
         * @return {[obj]}            [description]返回的报纸权限
         */
        initNewspaperListBtn: function(methodname, siteId) {
            var deferred = $q.defer();
            var btnParams = {
                'serviceid': "mlf_metadataright",
                'methodname': 'queryPaperOperRightOfModal',
                'ModalName': methodname,
                'SiteId': siteId
            };
            getBtnRights(btnParams).then(function(rights) {
                deferred.resolve(rights);
            });
            return deferred.promise;
        },
        /**
         * [getRightsofBigFace description]获得查看痕迹按钮权限
         * @param  {[type]} siteid   [description]站点ID
         * @param  {[type]} Classify [description]分类
         * @return {[type]}          [description]
         */
        getRightsofBigFace: function(siteid, Classify) {
            var deferred = $q.defer();
            var btnParams = {
                serviceid: "mlf_metadataright",
                methodname: "queryOperKeyByBaseChannel",
                SiteId: siteid,
                Classify: Classify,
            };
            getBtnRights(btnParams).then(function(rights) {
                deferred.resolve(rights);
            });
            return deferred.promise;
        },
        /**
         * [initWeixinListBtn description]初始化微信平台按钮权限
         * @param  {[str]} classify  [description]平台种类
         * @param  {[num]} channelid [description]栏目ID
         * @return {[obj]}           [description]微信平台权限集合
         */
        initWeixinListBtn: function(classify, channelid) {
            var deferred = $q.defer();
            var btnParams = {
                'serviceid': "mlf_metadataright",
                'methodname': "queryOperKeyByBaseChannel",
                'Classify': classify,
                'ChannelId': channelid
            };
            getBtnRights(btnParams).then(function(rights) {
                deferred.resolve(rights);
            });
            return deferred.promise;
        },
        /**
         * [initAppListBtn description]初始化APP渠道列表按钮权限
         * @param  {[str]} classify  [description]平台分类
         * @param  {[num]} channelid [description]该栏目的ID
         * @return {[type]}           [description]
         */
        initAppListBtn: function(classify, channelid) {
            var deferred = $q.defer();
            var btnParams = {
                'serviceid': "mlf_metadataright",
                'methodname': "queryOperKeyByBaseChannel",
                'Classify': classify,
                'ChannelId': channelid
            };
            getBtnRights(btnParams).then(function(rights) {
                deferred.resolve(rights);
            });
            return deferred.promise;
        },
        /**
         * [initAppListBtnWithoutChn description]查询APP渠道下没有栏目的列表权限
         * @param  {[str]} methodname [description]要调用的方法
         * @param  {[num]} siteid     [description]站点ID
         * @return {[type]}            [description]
         */
        initAppListBtnWithoutChn: function(methodname, siteid) {
            var defferd = $q.defer();
            var btnParams = {
                serviceid: "mlf_metadataright",
                methodname: "queryOperKeyByBaseChannel",
                SiteId: siteid,
                Classify: methodname
            };
            getBtnRights(btnParams).then(function(rights) {
                defferd.resolve(rights);
            });
            return defferd.promise;
        },
    };
}]);
