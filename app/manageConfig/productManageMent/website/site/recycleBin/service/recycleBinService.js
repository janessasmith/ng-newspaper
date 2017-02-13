/**
 * Created by MRQ on 2016/1/6.
 */
"use strict";
angular.module("productManageMentwebsiteRecycleBinServiceModule", [
    'productManageMentWebsiteRecycleBinDeleteViewsModule',
    'productManageMentWebsiteRecycleBinReductionViewsModule'
])
    .factory("productManageMentwebsiteRecycleBinWordService", ["$modal", function ($modal) {
        return {
            //É¾³ýµ¯´°
            deleteViews: function (item,successFn) {
                $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/websiteRight/recycleBin/service/delete/recycle_bin_delete_tpl.html",
                    windowClass: 'productManageMent-website-recycle-delete',
                    backdrop: false,
                    controller: "productManageMentWebsiteRecycleDeleteCtrl",
                    resolve: {
                        itemName: function () {
                            return item;
                        },
                        successFn: function () {
                            return successFn;
                        }
                    }
                });
            },
            //»¹Ô­µ¯´°
            reductionViews: function (item,successFn) {
                $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/websiteRight/recycleBin/service/reduction/recycle_bin_reduction_tpl.html",
                    windowClass: 'productManageMent-website-recycle-reduction',
                    backdrop: false,
                    controller: "productManageMentWebsiteRecycleReductionCtrl",
                    resolve: {
                        itemName: function () {
                            return item;
                        },
                        successFn: function () {
                            return successFn;
                        }
                    }
                });
            }
        }
    }]);
