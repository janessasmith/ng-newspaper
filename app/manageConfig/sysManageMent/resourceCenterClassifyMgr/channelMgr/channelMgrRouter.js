/**
 * Created by ma.rongqin on 2016/2/16.
 */
"use strict";
angular.module('sysmanageSouCenMgrChnnlMgrRouterModule', []).
    config(['$stateProvider', function($stateProvider) {
        $stateProvider.state("manageconfig.sysmanage.soucenclassifymgr.channelmgr.recyclebin", { //回收站
            url: '/channelrecyclebin',
            views: {
                'main@manageconfig.sysmanage': {
                    templateUrl: './manageConfig/sysManageMent/resourceCenterClassifyMgr/channelMgr/recycleBin/recycleBin_tpl.html',
                    controller: 'manConSysSouCenSiteChnnlRecycleCtrl'
                }
            }
        })
    }]);
