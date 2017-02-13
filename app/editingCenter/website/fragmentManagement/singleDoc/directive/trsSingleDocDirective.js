"use strict";
/*
    trsFragSingDoc指令：
    html:<trs-frag-single-doc  json-obj=""></trs-frag-single-doc>，
    css:处于oneImage.css样式表中，
    js:调用MultiDocService服务获取数据，完成单个文档组件的页面替代，调用参数为json-obj，传递一个页面对象
 */

angular.module("pieceMgr.singleDocdir", ["mgcrea.ngStrap.timepicker","mgcrea.ngStrap.datepicker"])
    .directive('trsFragSingleDoc', ['$modal', "$timeout", "fragmentService", "trsSelectDocumentService", "$filter", function($modal, $timeout, fragmentService, trsSelectDocumentService, $filter) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                jsonObj: "=",
                widgetParams: "=",
                index: "@",
                form: "=",
                required: "@"
            },
            templateUrl: './editingCenter/website/fragmentManagement/singleDoc/singleDoc.html',
            controller: function($scope, $element) {


            },
            link: function(scope, element, attrs) {
                init();
                scope.nowTime = fragmentService.getNowTime();
                if (angular.isDefined(scope.jsonObj)) {
                    scope.item = scope.jsonObj;
                    scope.uploaderSrc = scope.item.imgsrc;
                }
                $timeout(function() {
                    scope.callBack = {
                        success: function(file, src) {
                            $timeout(function() {
                                scope.item.imgsrc = src.imgSrc;
                                scope.item.imgName = src.imgName;
                                scope.uploaderSrc = src.imgSrc;
                                scope.uploadInfo = '上传成功';
                                scope.uploadError = '';
                                scope.uploaderSrc = src.imgSrc;
                            });
                        },
                        error: function(file) {
                            scope.uploadInfo = '';
                            scope.uploadError = '上传错误';
                        },
                        file: function(file) {
                            scope.uploadFileName = file.name;
                        },
                        tar: function(file, percentage) {
                            $timeout(function() {
                                scope.tarWidth = {
                                    width: "percentage * 100 + '%'",
                                    height: "20px",
                                    background: "#ccc"
                                };
                            });
                        }
                    };
                }, 100);
                scope.showConSelModal = function() {
                    var relNewsData = [];
                    if (angular.isDefined(scope.item.recid)) {
                        relNewsData.push({
                            TITLE: scope.item.title,
                            HOMETITLE: scope.item.subtitle,
                            TITLECOLOR: scope.item.titlecolor,
                            ABSTRACT: scope.item.abstract,
                            DOCPUBURL: scope.item.url,
                            RECID: scope.item.recid,
                            RELTIME: scope.item.reltime,
                            SOURCE: scope.item.source,
                            AUTHOR: scope.item.author,
                        });
                    }
                    scope.widgetParams.relNewsData = relNewsData;
                    trsSelectDocumentService.trsSelectDocument(scope.widgetParams, function(result) {
                        scope.item.title = result[0].title;
                        scope.item.subtitle = result[0].subtitle;
                        scope.item.titlecolor = result[0].titlecolor;
                        scope.item.abstract = result[0].abstract;
                        scope.item.url = result[0].url;
                        scope.item.recid = result[0].recid;
                        scope.item.reltime = result[0].reltime;
                        scope.item.source = angular.isDefined(result[0].source)?result[0].source:"";
                        scope.item.author = angular.isDefined(result[0].author)?result[0].author:"";
                    });
                };
                scope.shutSingDoc = function() {
                    scope.$parent.closeThisDialog();
                };
                scope.closeSingDoc = function() {
                    scope.$parent.closeThisDialog();
                };
                scope.changeTime = function(time) {
                    time = $filter('date')(time, "yyyy-MM-dd HH:mm").toString();
                    return time;
                };

                function init() {
                    scope.requiredObj = {};
                    for (var i = 0; i < scope.required.split(",").length; i++) {
                        scope.requiredObj[scope.required.split(",")[i].replace(/" "/g,"")] = true;
                    }
                }
            },
        };
    }]);
