/*
	Created by BaiZhiming 2015-10-20 10:30
*/
'use strict';
angular.module("manageCfg.roleManageMent.editOrCreateRoleRouter",[]).config(['$stateProvider',function($stateProvider){
	$stateProvider
	.state('manageconfig.rolemanage.editorcreaterole.changegroup',{
			url:'/changegroup',
			views:{
				'roleChildren':{
					templateUrl:'./manageConfig/roleManageMent/editOrCreateRole/changeGroup/changeGroup_tpl.html',
					controller:'changeGroupCtrl'
				}
			}
		});
	/*.state('manageconfig.rolemanage.editorcreaterole.copyauthority',{
			url:'/copyauthority',
			views:{
				'roleChildren':{
					templateUrl:'./manageConfig/roleManageMent/editOrCreateRole/copyAuthority/copyAuthority_tpl.html',
					controller:'copyAuthorityCtrl'
				}
			}
		})*///废弃
}]);