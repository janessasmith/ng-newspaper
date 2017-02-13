"use strict";
/*
    status表示稿件类型,0标识个人稿库,1表示已收稿库
 */
angular.module('iWoPersonalManuscriptRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('editctr.iWo.personalManuscript', {
                url: "/personalManuscript",
                views: {
                    "main@editctr": {
                        templateUrl: "./editingCenter/iWo/myManuscript/personalManuscript/personal_manuscript_tpl.html",
                        controller: "iWopersonalManuscriptCtrl"
                    }
                }
            }).state('iwonews', {
                url: "/iwonews?chnldocid&metadataid&status",
                views: {
                    '': {
                        templateUrl: './editingCenter/iWo/myManuscript/personalManuscript/news/personalManuscript_news_tpl.html',
                        controller: 'iWoPersonalNewsController',
                    }
                }
            })
            .state('iwoatlas', {
                url: '/iwoatlas?metadataid&chnldocid&status',
                views: {
                    '': {
                        templateUrl: './editingCenter/iWo/myManuscript/personalManuscript/iWoatlas/iWo_atlas.html',
                        controller: 'iWoAtlasController'
                    }
                }
            });
    }]);
