// "use strict";
// angular.module('editingCenterIWoRouterModule', [
//         "iWoFusionSignRouterModule",
//         "iWoPrivilegeDraftRouterModule",
//         "iWoFusionPendingRouterModule",
//         "iWoDraftBoxRouterModule",
//     ])
//     .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
//         $stateProvider.state('editctr.iWo', {
//             url: '/iWo',
//             views: {
//                 'main@editctr': {
//                     templateUrl: './editingCenter/main_tpl.html',
//                 },
//                 'left@editctr.iWo': {
//                     templateUrl: './editingCenter/iWo/left_tpl.html',
//                     controller: 'iWoLeftCtrl'
//                 },
//                 'footer@editctr.iWo': {
//                     templateUrl: './footer_tpl.html'
//                 }
//             }
//         });
//     }]);
"use strict";
angular.module('editingCenterIWoRouterModule', [
        "iWoFusionSignRouterModule",
        "iWoPrivilegeDraftRouterModule",
        "iWoFusionPendingRouterModule",
        "iWoDraftBoxRouterModule",
    ])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('editctr.iWo', {
            url: '/iWo',
            views: {
                "iwo@editctr": {
                    templateUrl: './editingCenter/iWo/left_tpl.html',
                    controller: 'iWoLeftCtrl'
                }
            }
        });
    }]);
