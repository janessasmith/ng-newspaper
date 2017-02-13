'use strict';
angular.module('editingCenterModule', [
    'editingCenterRouterModule',
    'editingCenterLeftModule',
    'editingCenterNaviModule',
    'editingCenterAppModule',
    'trsNavLocationModule',
    'trsEditorModule',
    'trsEditorAuthMoule',
    'trsUserSupportModule',
    'ngTagsInput',
    'mgcrea.ngStrap.typeahead',
    'mgcrea.ngStrap.popover',
    'editingCenterIWoModule',
    'editingCenterNewspaperModule',
    'editingCenterWebsiteModule',
    'initSingleSelectionModule',
    'editingCenterServiceModule',
    'editctrInitBtnModule',
    "editctrFilterBtnModule",
    "editLeftRouterModule",
    "editctrSupportCreationModule",
    "editcenterRightsModule",
    "editIsLockModule",
    // 川报修改
    "editingCenterWeiXinModule",
    "editingCenterWeiBoModule"
]).
controller('EditingCenterController', ['$scope', '$state', '$location',
    function($scope, $state, $location) {

    }
]).value('editingMediatype', { //APP：1，网站：2，报纸：3，微信：4，微博：5
    app: 1,
    website: 2,
    newspaper: 3,
    weixin: 4,
    weibo: 5,
});
