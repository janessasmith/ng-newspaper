/*
author:wang.jiang 2016-1-16
newspapertype:0-待用稿
              1-今日稿
              2-上版稿
              目的是区分上班，退稿等操作不同平台下的请求方法
 */
"use strict";
angular.module('editctrNewspaperRouterModule', []).
config(["$stateProvider", function($stateProvider) {
    $stateProvider
        .state("newspaperpic", {
            url: "/newspaperpic?metadata&paperid&newspapertype&isfusion",
            views: {
                '': {
                    templateUrl: './editingCenter/newspaper/edit/picDraft/editPic_tpl.html',
                    controller: 'EditctrNewspaperPicCtrl'
                }
            }
        }).state("newspapertext", {
            url: "/newspapertext?metadata&paperid&newspapertype&isfusion",
            views: {
                '': {
                    templateUrl: './editingCenter/newspaper/edit/textDraft/editText_tpl.html',
                    controller: 'EditctrNewspaperTextCtrl'
                }
            }
        });
}]);
