/**
 * Created by 马荣钦 on 2016/2/1.
 */
"use strict";
angular.module("myZoneProInfoInfoRouterModule",[])
    .config(["$stateProvider",function($stateProvider){
        $stateProvider.state('myzone.personalinfo.info.modify',{
            url:'/proinfomodifyinfo',
            views:{
                'main@myzone.personalinfo':{
                    templateUrl:"./myZone/personalInfo/info/modifyProInfo/modifyProInfo.html",
                    controller:"myZoneProInfoModifyCtrl"
                }
            }
        })
    }]);