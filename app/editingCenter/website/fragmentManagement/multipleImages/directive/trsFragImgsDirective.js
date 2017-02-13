/**
 * Created by zhyp on 2015/9/06.
 */
"use strict";
angular.module("pieceMgr.multiImgsDir", ['util.colorPicker'])
    .directive("trsFragImgs", ["$modal", "$filter", "trsSelectDocumentService", "fragmentService", function($modal, $filter, trsSelectDocumentService, fragmentService) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: './editingCenter/website/fragmentManagement/multipleImages/mImages.html',
            transclude: true,
            scope: {
                jsonObj: "=",
                widgetParams: "=",
                index: "@",
                required: "@"
            },
            controller: function($scope, $timeout, $element) {
                // 新增条目
                $scope.addItem = function() {
                    if (!$scope.list) {
                        $scope.list = [];
                    }
                    $scope.list.unshift({});
                };
                // 删除条目
                $scope.deleteItem = function(record) {
                    $scope.list.length && $scope.list.splice(record, 1);
                };
                // 清空标题
                $scope.cleanInput = function(index) {
                    $scope.list[index].title = "";
                };
                // 关闭弹框
                $scope.closeUp = function() {
                    $scope.$parent.$close();
                };
                //h5拖拽开始
                $scope.dragoverCallback = function(event, index, external, type) {
                    // Disallow dropping in the third row. Could also be done with dnd-disable-if.
                    return index < 10;
                };

                $scope.dropCallback = function(event, index, item, external, type, allowedType) {
                    if (external) {
                        if (allowedType === 'colType' && !item.label) return false;
                        if (allowedType === 'rowType' && !angular.isArray(item)) return false;
                    }
                    return item;
                };
                $scope.dragStart = function() {
                    angular.forEach($scope.list, function(data, index, array) {
                        $scope.list[index].showMe = false;
                    });
                };
                $scope.dragMoved = function(index) {
                    $scope.list.splice(index, 1);
                    angular.forEach($scope.list, function(data, index, array) {
                        $scope.list[index].$$hashKey = index;
                    });
                };
                //h5拖拽结束
            },
            link: function(scope, element, attrs, accordionController) {
                init();
                scope.showDocSel = function() {
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
                                CRTIME: data.crtime,
                                SOURCE: data.source,
                                AUTHOR: data.author,
                                METALOGOURL: {
                                    PICSLOGO: data.imgsrc
                                }
                            });
                        }
                    });
                    scope.widgetParams.relNewsData = relNewsData;
                    scope.widgetParams.IsPicDoc = true;
                    trsSelectDocumentService.trsSelectDocument(scope.widgetParams, function(result) {
                        if (scope.list.length === 1 && angular.isUndefined(scope.list[0].title) && angular.isUndefined(scope.list[0].imgsrc)) {
                            scope.list.splice(0, 1);
                        }
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
                        angular.forEach(result, function(data, index, array) {
                            scope.list.push(data);
                        });
                    });
                };
                scope.changeTime = function(time) {
                    time = $filter('date')(time, "yyyy-MM-dd HH:mm").toString();
                    return time;
                };

                function init() {
                    scope.list = scope.jsonObj;
                    scope.nowTime = fragmentService.getNowTime();
                }
            }
        };
    }]).directive("expander", ["$timeout", "$modal", function($timeout, $modal) {
        /** 
         手风琴 <expader>，有一个属性 ver 用来传入子模版
        **/
        return {
            restrict: 'EA',
            replace: true,
            link: function(scope, element, attrs, accordionController, $timeout) {
                init();
                $timeout(function() {
                    scope.callBack = {
                        success: function(file, src) {
                            $timeout(function() {
                                scope.item.imgsrc = src.imgSrc;
                                scope.item.imgName = src.imgName;
                                scope.uploaderSrc = src.imgSrc;
                                scope.uploaderSuccess = true;
                            });
                        },
                        error: function(file) {},
                        file: function(file, uploader) {
                            $timeout(function() {
                                scope.uploaderSuccess = false;
                                scope.uploadFileName = file.name;
                                uploader.upload();
                            });
                        },
                        tar: function(file, percentage) {},
                        comp: function() {

                        }
                    };
                });
                var path = attrs.ver;
                var index = attrs.index;
                scope.getContentUrl = function() {
                    return ' ./editingCenter/website/fragmentManagement/' + path + '.html';
                };
                scope.item.showMe = angular.isUndefined(scope.item.showMe) || scope.item.showMe === true ? true : false;
                scope.toggle = function toggle() {
                    scope.item.showMe = !scope.item.showMe;
                };

                function init() {
                    scope.requiredObj = {};
                    for (var i = 0; i < scope.required.split(",").length; i++) {
                        scope.requiredObj[scope.required.split(",")[i].replace(/ /g, "")] = true;
                    }
                }
                scope.modifyImg = function() {
                    var modalInstance = $modal.open({
                        template: '<iframe src="/wcm/app/photo/photo_compress_mlf.jsp?photo=..%2F..%2Ffile%2Fread_image.jsp%3FFileName%3D' + scope.item.imgName + '&index=' + 0 + '" width="1210px" height="600px"></iframe>',
                        windowClass: 'photoCropCtrl',
                        backdrop: false,
                        controller: "trsPhotoCropCtrl",
                        resolve: {
                            params: function() {
                                return;
                            }
                        }
                    });
                    window.editCallback = fragmentMultipleImgesitCallback;
                };

                function fragmentMultipleImgesitCallback(params) {
                    scope.item.imgName = params.imageName;
                    scope.uploaderSrc = scope.item.imgsrc = "/wcm/file/read_image.jsp?FileName=" + params.imageName + "&r=" + new Date().getTime();
                    editPhotoCallback();
                }
            },
            template: '<li ng-include="getContentUrl()" class="liChild"></li>'
        };
    }]);
