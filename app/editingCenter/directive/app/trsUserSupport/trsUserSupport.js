angular.module('trsUserSupportModule', [])
    .directive("trsUserSupport", ['$compile', "trsHttpService","$timeout", function($compile, trsHttpService,$timeout) {
        return {
            restrict: "A",
            scope: {
                params:"="
            },
            //templateUrl: "./editingCenter/directive/app/trsUserSupport/trsUserSupport_tpl.html",
            link: function(scope, iElement, iAttrs) {
                scope.options = {};
                var searchObj; //声明输入参数
                //scope.userList.isNameshow = false;
                scope.iElementValue = false;
                var el = $compile("<div ng-show='iElementValue' ng-include=\"'./editingCenter/directive/app/trsUserSupport/trsUserSupport_tpl.html'\"></div>")(scope);
                $(el).insertBefore(iElement);
                scope.selectOption = function(option) {
                    scope.$emit("option", option);
                    scope.options.indexOf(option) < 0 ? scope.options.push(option) : '';
                    scope.iElementValue = false;
                }
                /*iElement.bind('focus', function() {
                    scope.userList.isNameshow = true;
                });*/
                iElement.bind('keyup', function() {
                    scope.iElementValue = true;
                    for(var obj in scope.params){
                        if(scope.params[obj]==""){
                           searchObj = obj
                        }
                    }
                    scope.params[searchObj] = iElement.context.value;
                    trsHttpService.httpServer("/wcm/mlfcenter.do", scope.params, "post").then(function(data) {
                        scope.options = data;
                    }, function(data) {})
                })
                iElement.bind("blur",function(){
                    $timeout(function(){
                        scope.iElementValue = false;
                    },500)
                })
            }
        }
    }])
