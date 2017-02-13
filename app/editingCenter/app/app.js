"use strict";
angular.module('editingCenterAppModule', [
	'editingCenterAppLeftModule',
    'editingCenterAppRouterModule',
    'editingCenterCompiledModule',
    'editingCenterPendingModule',
    'editingCenterSignedModule',
    'util.trsTimeline',
    'versionModule',
    'editingCenterObjTimeModule',
    'editingCenterAppServiceModule',
    'initAddMetaDataModule',
    "appPreviewRouterModule",
    "editAppPushWinModule"
])
  .controller('EditingCenterAppController', [function () {}]);
