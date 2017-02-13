'use strict';
angular.module("cDMainRouterMoudle",[]).
config(['$stateProvider',function ($stateProvider) {
	$stateProvider.state("manageconfig.sysmanage.classifieddictionary.classification", {
        url:'/classification?type&name',
        views:{
            'main@manageconfig.sysmanage.classifieddictionary':{  
                templateUrl:'./manageConfig/sysManageMent/classifiedDictionary/classification/classification_tpl.html',
                controller:'classficationCtrl'
            }
        }
    }).
	state("manageconfig.sysmanage.classifieddictionary.ckm", {
        url:'/ckm',
        views:{
            'main@manageconfig.sysmanage.classifieddictionary':{  
                templateUrl:'./manageConfig/sysManageMent/classifiedDictionary/CKM/main_tpl.html',
                controller:'ckmCtrl'
            }
        }
    });/*.
	state("manageconfig.sysmanage.classifieddictionary.regionalclassification", {
        url:'/regionalclassification',
        views:{
            'main@manageconfig.sysmanage.classifieddictionary':{  
                templateUrl:'./manageConfig/sysManageMent/classifieddictionary/RegionalClassification/regionalclassification_tpl.html',
                controller:'regionalclassificationCtrl'
            }
        }
    });*/
}]);