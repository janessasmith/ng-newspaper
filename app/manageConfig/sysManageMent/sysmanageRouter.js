"use strict";
angular.module('sysmanageRouterModule', []).
config(['$stateProvider', function($stateProvider) {
    $stateProvider.state("manageconfig.sysmanage.classifieddictionary", { //分类词典
        url: '/classifieddictionary',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/classifiedDictionary/main_tpl.html',
                controller: 'cDMainCtrl'
            }
        }
    }).state("manageconfig.sysmanage.sensitiveword", { //敏感词
        url: '/sensitiveword',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/sensitiveWord/sensitiveWordMge_tpl.html',
                controller: "sysManageMentSensitiveWordCtrl"
            }
        }
    }).state("manageconfig.sysmanage.soucenclassifymgr", { //资源中心分类管理
        url: '/soucenclassifymgr',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/resourceCenterClassifyMgr/resourceCenterClassifyMgr_tpl.html',
                controller: "manConSysSouCenClassifyMgrCtrl"
            }
        }
    }).state("manageconfig.sysmanage.emailconfig", { //邮件设置
        url: '/emailconfig',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/emailConfig/emailConfig_tpl.html',
                controller: 'manageSysManageEmailConfigCtrl'
            }
        }
    }).state("manageconfig.sysmanage.smsgatewayconfig", { //短信网关设置
        url: '/smsgatewayconfig',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/SMSGatewayConfig/SMSGatewayConfig_tpl.html',
                controller: 'manageSysManageSMSGatewayConfigCtrl'
            }
        }
    }).state("manageconfig.sysmanage.sourcemanage", { //来源管理
        url: '/sourcemanage',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/sourceManage/sourceManage_tpl.html',
                controller: 'manageSysManageSourceManageCtrl'
            }
        }
    }).state("manageconfig.sysmanage.plandispatch", { //计划调度
        url: '/plandispatch',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/planDispatch/planDispatch_tpl.html',
                controller: 'manageSysManagePlanDispatchCtrl'
            }
        }
    }).state("manageconfig.sysmanage.hotwordsmanage", { //热词管理
        url: '/hotwordsmanage',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/hotWordsManage/hotWordsManage_tpl.html',
                controller: 'manageSysManageHotWordsManageCtrl'
            }
        }
    }).state("manageconfig.sysmanage.statusmanage", { //状态管理
        url: '/statusmanage',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/statusManage/statusManage_tpl.html',
                controller: 'manageSysManageStatusManageCtrl'
            }
        }
    }).state("manageconfig.sysmanage.releasecomponentmanage", { //发布组件管理
        url: '/releasecomponentmanage',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/releaseComponentManage/releaseComponentManage_tpl.html',
                controller: 'manageSysManageReleaseComponentManageCtrl'
            }
        }
    }).state("manageconfig.sysmanage.smstempconfig", { //短信模板设置
        url: '/smstempconfig',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/SMSTempConfig/SMSTempConfig_tpl.html',
                controller: 'manageSysManageSMSTempConfigCtrl'
            }
        }
    }).state("manageconfig.sysmanage.emailtempconfig", { //邮件模板设置
        url: '/emailtempconfig',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/emailTempConfig/emailTempConfig_tpl.html',
                controller: 'manageSysManageEmailTempConfigCtrl'
            }
        }
    }).state("manageconfig.sysmanage.otherconfiguration", { //其他配置
        url: '/otherconfiguration',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/otherConfiguration/otherConfiguration_tpl.html',
                controller: 'manageSysManageOtherConfigurationCtrl'
            }
        }
    }).state("manageconfig.sysmanage.systemfield", { //系统字段
        url: '/systemfield',
        views: {
            'main@manageconfig.sysmanage': {
                templateUrl: './manageConfig/sysManageMent/systemField/systemField_tpl.html',
                controller: 'manageSysManageSystemFieldCtrl'
            }
        }
    })
}]);
