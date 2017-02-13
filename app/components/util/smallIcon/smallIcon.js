'use strict';
/**
 * Created by bzm on 2015/9/16.
 */
/*
使用说明：
html:
 <small-icon-dir main-icon="item.smallIcon"></small-icon-dir>
 在你的html中，需要使用小图标选择器的位置加入以上代码
 注意：1.其父级元素position为relative.
       2.item.smllIcon为获取图标地址的对象，可以根据自己需要来定义。
controller：
 在你的controller或directive所在的模块给中引入util.smallIcon模块。
 例：
 angular.module("pieceMgr.multiDocList", ["util.smallIcon"])
* */
angular.module("util.smallIcon",[]).
directive("smallIconDir",["trsHttpService",function(trsHttpService){
   return{
       restrict: 'E',
       scope:{
           mainIcon:"="
       },
       reaplace:false,
       templateUrl: './components/util/smallIcon/smallIcon_tpl.html',
       link:function(scope,element,attrs){
           trsHttpService.httpServer("./components/util/smallIcon/smallIcon.json","","get").then(function(data){
                scope.mainIcon = "";
                scope.smallIcons = data;
                scope.firstIcon = data[0];
                scope.show = "smallIcon-hide";
                scope.showIcon = function(){
                    if(scope.show=="smallIcon-hide"){
                        scope.show="smallIcon-show";
                    }else{
                        scope.show="smallIcon-hide";
                    }
                };
                scope.getMainIcon = function(icon){
                    scope.firstIcon = icon;
                    if(icon!=data[0]){
                        scope.mainIcon = icon;
                    }
                };
           });
       }
   };
}]);