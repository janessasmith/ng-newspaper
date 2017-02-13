/**
 * author:liangyu \
 * date:215-10-30
 */
"use strict";
angular.module('trsEditorAuthMoule', ['mgcrea.ngStrap.typeahead']).
config(['$typeaheadProvider',function($typeaheadProvider) {
    angular.extend($typeaheadProvider.defaults, {
        animation: 'am-fade',
        prefixClass: 'typeahead',
        prefixEvent: '$typeahead',
        placement: 'bottom-left',
        templateUrl: './editingCenter/directive/app/views/suggestion.html',
        trigger: 'focus',
        container: false,
        keyboard: true,
        html: false,
        delay: 0,
        minLength: 1,
        filter: 'bsAsyncFilter',
        limit: 30,
        autoSelect: false,
        comparator: '',
        trimValue: true

    });
}]).
directive('editorAuthDir', ['$timeout', '$typeahead', '$location', '$validation', '$q', 'trsHttpService', 'trsconfirm', function($timeout, $typeahead, $location, $validationProvider, $q, trsHttpService, trsconfirm) {
    return {
        restrict: 'AE',
        scope: {
            tempAuthors: "=author",
            isIconShow:"=formdisabled"
        },
        templateUrl: "./editingCenter/directive/app/views/editor_auth_tpl.html",
        /*scope: {
             //editorJson: '=',
             //authorForm: "="
         },*/
        link: function(scope, iElement, iAttrs) {
            //获得路径
            scope.path = $location.path().split('/').pop();
            //初始化
            initStatus();
            //存储作者信息
            scope.authEdit = function() {
                if (scope.tempAuthors.length === 0 || angular.isDefined(scope.tempAuthors[scope.tempAuthors.length - 1].USERNAME)) {
                    scope.tempAuthor = {
                        ID: "0",
                        TYPE: "22"
                    };
                    scope.tempAuthors.push(scope.tempAuthor);
                    scope.currAuthor = scope.tempAuthor;
                    scope.authorForm.$setPristine();
                }
            };
            scope.authMessage = function(author) {
                $validationProvider.validate(scope.authorForm)
                    .success(function() {
                        scope.currAuthor = author;
                    });

            };
            scope.authDelete = function(record) {
                scope.tempAuthors.splice(record, 1);
                scope.currAuthor = scope.tempAuthors[scope.tempAuthors.length - 1];
            };


            function initStatus() {
                scope.isvalid = false; //表单默认状态 
                $timeout(function() {
                    if (scope.tempAuthors.length === 0 || !angular.isDefined(scope.tempAuthors[0].isCreate)) {
                        if (scope.tempAuthors.length > 0) {
                            scope.currAuthor = scope.tempAuthors[scope.tempAuthors.length - 1];
                        }
                        /*else {
                                                   scope.tempAuthors.push({ ID: "0", TYPE: "22" });
                                                   scope.currAuthor = scope.tempAuthors[0];
                                               }*/
                    } else {
                        getCurrentLoginUser().then(function(data) {
                            scope.currAuthor = data[0];
                            scope.currAuthor.TYPE = "21";
                            scope.tempAuthors[0] = scope.currAuthor;
                        });
                        /*scope.authors.push(scope.currAuthor);*/
                    }
                }, 500);

                /*
                  if(angular.isArray(scope.currauthors)&&scope.currauthors.length>0){
                      scope.authors = [].concat(scope.currauthors);
                  }*/

                //scope.authorIndex = scope.authorJson.length - 1; //初始化显示用户下标
                //初始化检索提示服务开始
                scope.searchParams = {
                    methodname: "queryUsersByName",
                    serviceid: "mlf_extuser",
                    IsSearchAll: true,
                    Name: ""
                };
                //初始化检索提示服务结束
                //初始化表单是否禁用开始
                // scope.disabled = (scope.authorJson[scope.authorIndex].TYPE == "23") ? true : false;
                //初始化表单是否禁用结束
            }

            var promise;
            scope.getSuggestions = function(viewValue) {

                if (promise) {
                    $timeout.cancel(promise);
                    promise = null;
                }

                promise = $timeout(function() {

                    if (viewValue !== "" && !angular.isObject(viewValue)) {
                        scope.searchParams.Name = viewValue;
                        if (angular.isDefined(scope.currAuthor.USERNAME)) {
                            if (scope.confirm) {
                                scope.confirm = false;
                                return [];
                            } else {
                                return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), scope.searchParams, "post").then(function(data) {
                                    angular.forEach(data,function(data_,index,array){
                                        data[index].PINYINNAME = scope.searchParams.Name
                                    });
                                    return data;
                                });
                            }
                        }
                    }
                }, 10);

                return promise;
            };
            scope.$watch("currAuthor.USERNAME", function(newValue, oldValue) {
                if (angular.isObject(newValue)) {
                    var flag = true;
                    angular.forEach(scope.tempAuthors, function(data, index, array) {
                        if (data.ID === newValue.ID) {
                            flag = false;
                            trsconfirm.alertType("请勿重复添加用户", "请勿重复添加用户", "warning", false);
                        }
                    });
                    if (flag) {
                        scope.tempAuthors[scope.tempAuthors.indexOf(scope.currAuthor)] = newValue;
                        scope.currAuthor = newValue;
                        scope.confirm = true;
                    } else {
                        scope.tempAuthors[scope.tempAuthors.indexOf(scope.currAuthor)].USERNAME = "";
                        scope.currAuthor.USERNAME = "";
                        scope.confirm = false;
                    }
                }
            });

            function getCurrentLoginUser() {
                var deferred = $q.defer();
                var userParams = {
                    serviceid: "mlf_extuser",
                    methodname: "findUserInfo"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), userParams, "post").
                then(function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
        }
    };
}]);
