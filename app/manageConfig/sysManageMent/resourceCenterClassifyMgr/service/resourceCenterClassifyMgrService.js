/**
 * Created by ma.rongqin on 2016/2/15.
 */
'use strict';
angular.module("manConSysSouCenClassifyMgrServiceModule",[
    'manConSysSouCenClassifyModifyModule',
    "manConSysSouCenRecycleDeleteModule",
    "manConSysSouCenRecycleReductionModule"
])
    .factory("manConSysSouCenClassifyMgrService", ["$modal", "$q", 'trsHttpService', function($modal, $q, trsHttpService) {
        return {
            //修改
            modifyViews: function(transferData,successFn) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/sysManageMent/resourceCenterClassifyMgr/alertViews/modify/modify_tpl.html",
                    windowClass: 'manCon-sys-souCenClassify-modify',
                    backdrop: false,
                    controller: "manConSysSouCenClassifyModifyCtrl",
                    resolve: {
                        params: function() {
                            return transferData;
                        }
                    }
                });
                return modalInstance.result.then(function(result) {
                    successFn(result);
                });
            },
            //回收站删除弹窗
            recycleDeleteViews: function (item,successFn) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/sysManageMent/resourceCenterClassifyMgr/alertViews/recycleDelete/recycleDelete_tpl.html",
                    windowClass: 'manCon-sys-souCen-recycle-delete',
                    backdrop: false,
                    controller: "manConSysSouCenRecycleDeleteCtrl",
                    resolve: {
                        params: function () {
                            return item;
                        }
                    }
                });
                return modalInstance.result.then(function() {
                    successFn();
                });
            },
            //回收站还原弹窗
            recycleReductionViews: function (item,successFn) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/sysManageMent/resourceCenterClassifyMgr/alertViews/recycleReduction/recycleReduction_tpl.html",
                    windowClass: 'manCon-sys-souCen-recycle-reduction',
                    backdrop: false,
                    controller: "manConSysSouCenRecycleReductionCtrl",
                    resolve: {
                        params: function () {
                            return item;
                        }
                    }
                });
                return modalInstance.result.then(function() {
                    successFn();
                });
            }
        };
    }]);