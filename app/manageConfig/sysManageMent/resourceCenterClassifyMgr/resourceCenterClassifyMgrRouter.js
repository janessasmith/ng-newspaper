/**
 * Created by ma.rongqin on 2016/2/15.
 */
"use strict";
angular.module('sysmanageSouCenClassifyMgrRouterModule', []).
    config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("manageconfig.sysmanage.soucenclassifymgr.recyclebin", { //回收站
            url: '/siterecyclebin',
            views: {
                'main@manageconfig.sysmanage': {
                    templateUrl: './manageConfig/sysManageMent/resourceCenterClassifyMgr/recycleBin/recycleBin_tpl.html',
                    controller: 'manConSysSouCenSiteRecycleCtrl'
                }
            }
        })
        .state("manageconfig.sysmanage.soucenclassifymgr.channelmgr", { //栏目管理
            url: '/sitechannelmgr',
            views: {
                'main@manageconfig.sysmanage': {
                    templateUrl: './manageConfig/sysManageMent/resourceCenterClassifyMgr/channelMgr/channelMgr_tpl.html',
                    controller: 'manConSysSouCenClassifyMgrChnnlMgrCtrl'
                }
            }
        })
        
    }]);
