"use strict";
angular.module('websitetoBeCompiledRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('editctr.website.waitcompiled', {
            url: '/waitcompiled?channelid',
            views: {
                "main@editctr": {
                    templateUrl: "./editingCenter/website/toBeCompiled/main_tpl.html",
                    controller: "websitetoBeCompiledCtrl"
                }
            }
        }).state('editctr.website.waitcompiled.timingSign', {
            url: '/timingSign',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/website/toBeCompiled/timingSign/timingSign_tpl.html',
                    controller: 'editCompileWebsiteTimingSignController'
                }
            }
        }).state('editctr.website.waitcompiled.recycle', {
            url: '/recycle',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/website/toBeCompiled/recycle/main_draft_tpl.html',
                    controller: 'editCompileWebsiteRecycleController'
                }
            }
        }).state('websitenews', {
            url: "/websitenews?channelid&chnldocid&metadataid&siteid&status",
            views: {
                '': {
                    templateUrl: './editingCenter/website/toBeCompiled/news/website_toBeCompiled_news.html',
                    controller: "editingCenterWebsiteNewsCtrl"
                }
            }
        }).state('websiteatlas', {
            url: "/websiteatlas?channelid&chnldocid&metadataid&siteid&status",
            views: {
                '': {
                    templateUrl: './editingCenter/website/toBeCompiled/atlas/atlas_tpl.html',
                    controller: "editingCenterWebsiteAtlasCtrl"
                }
            }
        }).state('websitelinkdoc', {
            url: "/websitelinkdoc?channelid&chnldocid&metadataid&siteid&status",
            views: {
                '': {
                    templateUrl: './editingCenter/website/toBeCompiled/linkDoc/linkDoc_tpl.html',
                    controller: "editingCenterWebsiteLinkDocCtrl"
                }
            }
        }).state('websitesubject', {
            url: "/websitesubject?channelid&chnldocid&metadataid&siteid&status",
            views: {
                '': {
                    templateUrl: './editingCenter/website/toBeCompiled/subject/subject_tpl.html',
                    controller: "editingCenterWebsiteSubjectCtrl"
                }
            }
        }).state('websiteowner', {
            url: "/websiteowner",
            views: {
                '': {
                    templateUrl: './editingCenter/website/toBeCompiled/owner/owner_tpl.html',
                    controller: "editingCenterWebsiteOwnerCtrl"
                }
            }
        }).state('editctr.website.waitcompiled.cloud', {
            url: '/cloud',
            views: {
                'main@editctr.website': {
                    templateUrl: './editingCenter/website/cloud/cloud_tpl.html',
                    controller: 'websiteMlfCloudCtrl'
                }
            }
        });
    }]);
