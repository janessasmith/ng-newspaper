"use strict";
angular.module('toBeCompiledalertViewModule', []).
factory('alertView', ['$modal', function($modal) {
    return {
        view: function(title, placeholder, confirmCallback) {
            $modal.open({
                templateUrl: "./editingCenter/app/toBeCompiled/alertViews/review/toBeCompiled_review_tpl.html",
                windowClass: 'toBeCompiled-review-window',
                backdrop: false,
                controller: "toBeCompiledReviewCtrl",
                resolve: {
                    title: function() {
                        return title;
                    },
                    placeholder: function() {
                        return placeholder;
                    }
                }

            }, function(isConfirm) {
                if (isConfirm) {
                    confirmCallback();
                } else {}
            });
        },
        signed: function(title, content) {
            $modal.open({
                templateUrl: "./editingCenter/app/toBeCompiled/alertViews/sign/directSign/toBeCompiled_directSign_tpl.html",
                windowClass: 'toBeCompiled-directSign-window',
                backdrop: false,
                controller: "toBeCompiledDirectSignCtrl",
                resolve: {
                    title: function() {
                        return title;
                    },
                    content: function() {
                        return content;
                    }
                }
            });
        }
    };
}]);
