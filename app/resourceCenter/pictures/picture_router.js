"use strict";
angular.module('resCenterPictureRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider.state("resourcectrl.picture.resource", {
    	//川报修改
        url: '/resource?metacid&nodeid&cbpicid',
        views: {
            'resource@resourcectrl.picture': {
                templateUrl: './resourceCenter/pictures/picture_main_tpl.html',
                controller: 'resourceCenterPictureCtrl'
            }
        }
    });
}]);
