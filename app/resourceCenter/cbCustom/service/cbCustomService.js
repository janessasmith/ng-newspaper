"use strict";
angular.module('cbCustomServiceModule', [])
    .factory('cbCustomService', ['$modal', function($modal) {
        return {
            cbCustomWindow: function(item,callback) {
                var modalInstance = $modal.open({
                    templateUrl: "./resourceCenter/cbCustom/service/alertWindow/cbCustomWindow_tpl.html",
                    windowClass: "cb-custom-window",
                    controller: "cbCustomWindowCtrl",
                    resolve: {
                        transform: function() {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function(data) {
                    callback();
                });
            },
            cbCustomClassify:function(transform,callback){
                var modalInstance = $modal.open({
                    templateUrl: "./resourceCenter/cbCustom/service/alertWindow/cbCustomClassify_tpl.html",
                    windowClass: "cb-custom-window",
                    controller: "cbCustomClassifyCtrl",
                    resolve:{
                        transform:function(){
                            return transform;
                        }
                    }
                });
                modalInstance.result.then(function(data){
                    callback(data);
                });    
            }
        };
    }]);
