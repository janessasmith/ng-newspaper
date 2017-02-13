/**
 * Created by zhyp on 2015/9/15.
 */
'use strict';
angular.module("pieceMgr.multiDocListDir", ["util.smallIcon"]).directive("trsFragDoclist", ["$modal", "fragmentService", "trsSelectDocumentService", "$filter", function($modal, fragmentService, trsSelectDocumentService, $filter) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            listShow: "@",
            addRowOrCol: "=",
            widgetParams: "=",
            required: "@"
        },
        templateUrl: "./editingCenter/website/fragmentManagement/multiDocList/multiDocList.html",
        controller: function($scope, $timeout, $element) {
            $scope.addItem = function() {
                if (!$scope.list) {
                    $scope.list = [];
                }
                $scope.list.unshift({});
            };
            $scope.deleteItem = function(record) {
                $scope.list.length && $scope.list.splice(record, 1);
            };
            $scope.cleanInput = function(index) {
                $scope.list[index].title = "";
            };
        },
        link: function(scope, element, attrs, accordionController) {
            init();
            if (scope.listShow !== "") {
                scope.list = JSON.parse(scope.listShow);
            } else {
                scope.list = [];
            }
            scope.contentSel = function() {
                var relNewsData = [];
                angular.forEach(scope.list, function(data, index, array) {
                    if (angular.isDefined(data.isRelNews)) {
                        relNewsData.push({
                            TITLE: data.title,
                            HOMETITLE: data.subtitle,
                            TITLECOLOR: data.titlecolor,
                            ABSTRACT: data.abstract,
                            DOCPUBURL: data.url,
                            RECID: data.recid,
                            RELTIME: data.reltime,
                            SOURCE: data.source,
                            AUTHOR: data.author
                        });
                    }
                });
                scope.widgetParams.relNewsData = relNewsData;
                trsSelectDocumentService.trsSelectDocument(scope.widgetParams, function(result) {
                    var j = 0;
                    while (j < scope.list.length) {
                        var i = 0;
                        var flag = true;
                        if (result.length > 0) {
                            while (i < result.length) {
                                if (scope.list[j].recid === result[i].recid) {
                                    scope.list[j] = result[i];
                                    result.splice(i, 1);
                                    flag = false;
                                } else {
                                    i++;
                                }
                            }
                        }
                        if (flag && angular.isDefined(scope.list[j].recid)) {
                            scope.list.splice(j, 1);
                        } else {
                            j++;
                        }
                    }
                    scope.list = scope.list.concat(result);
                });
            };
            scope.closeUp = function() {
                if (scope.listShow !== "") {
                    scope.list = JSON.parse(scope.listShow);
                }
                setTimeout(function() {
                    scope.$parent.$close();
                }, 500);
            };
            scope.confirm = function() {
                scope.addRowOrCol = scope.list;
                setTimeout(function() {
                    scope.$parent.$close();
                }, 500);
            };
            scope.changeTime = function(time) {
                time = $filter('date')(time, "yyyy-MM-dd HH:mm").toString();
                return time;
            };

            function init() {
                scope.list = scope.jsonObj;
                scope.nowTime = fragmentService.getNowTime();
                scope.requiredObj = {};
                for (var i = 0; i < scope.required.split(",").length; i++) {
                    scope.requiredObj[scope.required.split(",")[i].replace(/" "/g, "")] = true;
                }
            }
        }
    };
}]);
