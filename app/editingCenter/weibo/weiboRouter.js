"use strict";
angular.module('weiboRouterModule', []).config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('editctr.weibo', {
            url: "/weibo?accountid",
            views: {
                'weibo@editctr': {
                    templateUrl: './editingCenter/weibo/left_tpl.html',
                    controller: 'weiboLeftCtrl',
                }
            }
        })
        .state('editctr.weibo.tobecompiled', {
            url: '/tobecompiled',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/weibo/toBeCompiled/toBeCompiled_tpl.html',
                    controller: 'weiboToBeCompiledCtrl',
                }
            }
        }).state('editctr.weibo.pending', {
            url: '/pending',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/weibo/pending/pending_tpl.html',
                    controller: 'weiboPendingCtrl',
                }
            }
        }).state('editctr.weibo.signed', {
            url: '/signed',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/weibo/signed/signed_tpl.html',
                    controller: 'weiboSignedCtrl',
                }
            }
        }).state('editctr.weibo.timingsigned', {
            url: '/timingsigned',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/weibo/timingSigned/timingSigned_tpl.html',
                    controller: 'weiboTimingSignedCtrl',
                }
            }
        }).state('editctr.weibo.myweibo', {
            url: '/myweibo',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/weibo/myWeibo/myWeibo_tpl.html',
                    controller: 'weiboMyWeiBoCtrl',
                }
            }
        }).state('editctr.weibo.attention', {
            url: '/attention',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/weibo/attention/attention_tpl.html',
                    controller: 'weiboAttentionCtrl',
                }
            }
        }).state('editctr.weibo.comment', {
            url: '/comment?sdtype&fctype',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/weibo/comment/comment_tpl.html',
                    controller: "weiboCommentCtrl",
                }
            }
        }).state('editctr.weibo.collect', {
            url: '/collect',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/weibo/collect/collect_tpl.html',
                    controller: 'weiboCollectCtrl',
                }
            }
        }).state('editctr.weibo.me', {
            url: '/me?atwotype&atwopltype',
            views: {
                'main@editctr': {
                    templateUrl: './editingCenter/weibo/me/me_tpl.html',
                    controller: 'weiboMeCtrl',
                }
            }
        });
}]);
