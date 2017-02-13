'use strict';
angular.module('editingCenterCompiledRouterModule', []).
config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('editctr.app.waitcompiled', {
        url: '/waitcompiled?channelid',
        views: {
            'main@editctr': {
                templateUrl: './editingCenter/app/toBeCompiled/main_tpl.html',
                controller: 'editCompileController'
            }
        }
    }).
    state('editctr.app.waitcompiled.recycle', {
            url: '/recycle',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/app/toBeCompiled/recycle/main_draft_tpl.html',
                    controller: 'editCompileRecycleController'
                }
            }
        }).state('editctr.app.waitcompiled.timingsign', {
            url: '/timingsign',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/app/toBeCompiled/timingSign/timingSign_tpl.html',
                    controller: 'editCompileTimingSignController'
                }
            }
        }).state('appatlas', {
            url: '/appatlas?channelid&chnldocid&siteid&metadataid&platform&doctype',
            views: {
                '': {
                    templateUrl: './editingCenter/app/toBeCompiled/atlas/editCenter_atlas.html',
                    controller: 'EditCenterAtlasController'
                }
            }
        })
        .state('appnews', {
            url: '/appnews?channelid&chnldocid&siteid&metadataid&platform&doctype',
            views: {
                '': {
                    templateUrl: './editingCenter/app/toBeCompiled/news/editCenter_news.html',
                    controller: 'EditingCenterNewsController'
                }
            }
        })
        .state('appsubject', {
            url: '/appsubject?channelid&chnldocid&siteid&metadataid&platform&doctype',
            views: {
                '': {
                    templateUrl: './editingCenter/app/toBeCompiled/subject/editCenter_subject.html',
                    controller: 'EditingCenterSubjectController'

                }
            }
        })
        .state('appwebsite', {
            url: "/appwebsite?channelid&chnldocid&siteid&metadataid&platform&doctype",
            views: {
                '': {
                    templateUrl: "./editingCenter/app/toBeCompiled/website/editCenter_website.html",
                    controller: "EditingCenterAddWebsiteController"
                }
            }
        });
}]);
