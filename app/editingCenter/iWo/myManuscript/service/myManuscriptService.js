/*
    Create by Baizhiming 2015-11-30
*/
"use strict";
angular.module("myManuscriptService", ["iWoDraftModule", "iWoSbumitModule", "copyBuildDraftModule", "getDraftModule", "iWoRejectionModule"]).
factory("myManuscriptService", ["$modal", "$q", function($modal, $q) {
    return {
        draft: function(title,array, success, fail, methodname, returnArray) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/iWo/myManuscript/service/draft/draft_tpl.html",
                windowClass: 'myManuscript-draft',
                backdrop: false,
                controller: "iWoDraftCtrl",
                resolve: {
                    incomeData: function() {
                        var incomeData = {
                            title: title,
                            array: array,
                            methodname: methodname
                        };
                        return incomeData;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                if (result === 'success') {
                    success();
                } else if (angular.isObject(result)) {
                    returnArray(result);
                } else if (result === 'fail') {
                    fail();
                }

            });
        },
        submit: function(selectedArray, success, fail, methodname) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/iWo/myManuscript/service/submit/submit_tpl.html",
                windowClass: "myManuscript-submit",
                backdrop: false,
                resolve: {
                    selectedArray: function() {
                        return selectedArray;
                    },
                    methodname: function() {
                        return methodname;
                    }
                },
                controller: "iWoSubmitCtrl"
            });
            modalInstance.result.then(function(result) {
                result === 'request' ? success() : fail();
            });
        },
        getDraft: function(array, serviceid, methodname, darftservice, success, returnArray) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/iWo/myManuscript/service/getDraft/getDraft_tpl.html",
                windowClass: 'toBeCompiled-getDraft',
                backdrop: false,
                controller: "getDraftCtrl",
                resolve: {
                    params: function() {
                        var params = {
                            "serviceid": serviceid,
                            "methodname": methodname,
                            "array": array,
                            "darftservice": darftservice
                        };
                        return params;
                    },
                    success: function() {
                        return success;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                if (result === 'success') {
                    success();
                } else if (angular.isObject(result)) {
                    returnArray(result);
                }
            });
        },
        rejection: function(selectedArray, success, error) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/iWo/myManuscript/service/rejection/rejection.html",
                windowClass: "myManuscript-rejection",
                backdrop: false,
                resolve: {
                    selectedArray: function() {
                        return selectedArray;
                    }
                },
                controller: "iWoRejectionCtrl"
            });
            modalInstance.result.then(function(result) {
                if (result === "success") {
                    success();
                } else if (result === "error") {
                    error();
                }
            });
        },
        outSending: function() {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/iWo/myManuscript/service/outSending/outSending_tpl.html",
                windowClass: 'myManuscript-outSending',
                backdrop: false,
                controller: "iWoOutSendingCtrl",
                resolve: {

                }
            });
            modalInstance.result.then(function(result) {

            });
        }
    };
}]);
