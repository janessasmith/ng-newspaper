'use strict';
/**
 *  Module
 *
 * Description
 */
angular.module('websiteSignedServiceModule', [
	'websiteSelectRelevanceModule'
	]).factory('signedService', ['$modal', function($modal) {
    return {
        indexSign: function(item, success) {
            var modalInstance = $modal.open({
                templateUrl: "./editingCenter/website/signed/service/moreSign/moreSign_tpl.html",
                windowClass: 'toBeCompiled-directSign-window',
                backdrop: false,
                controller: "websiteSelectRelevanceCtrl",
                resolve: {
                    item: function() {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                success(result);
            });
        }
    };
}]);
