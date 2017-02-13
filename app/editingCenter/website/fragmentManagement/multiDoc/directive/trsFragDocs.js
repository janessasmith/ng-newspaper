/**
 * Created by bzm on 2015/9/8.
 */
'use strict';
angular.module("pieceMgr.multiDocDir", ['pieceMgr.multiDocEdit', 'dndLists']).directive("trsFragDocs", ["$modal", "$timeout", "fragmentService", function($modal, $timeout, fragmentService) {
    return {
        restrict: "E",
        templateUrl: "./editingCenter/website/fragmentManagement/multiDoc/multiDoc_modal.html",
        replace: true,
        scope: {
            jsonObj: "=",
            widgetParams: "=",
            required: "@"
        },
        controller: function($scope, $element) {
            init();
            var addRowOrCol;
            var editJsonNew;
            var docIds = "";
            // var colIndex = "";//声明保存列的下标
            var typeRowOrCols = ""; //声明选取文档是行添加或列添加类型
            //行拖拽初始化开始
            //  getDataJson($scope.widgetId);
            //行拖拽初始化结束
            $scope.addRowOrCols = function(rowIndex) {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/website/fragmentManagement/multiDocList/multiDocList-dir.html",
                    scope: $scope,
                    backdrop: false,
                    keyboard: false,
                    windowClass: "defaultClass",
                    controller: function($scope) {
                        if (rowIndex != "null") {
                            $scope.listShow = $scope.jsonObj[rowIndex];
                            addRowOrCol = $scope.$watch("addRowOrCol", function(newValue, oldValue) {
                                if (newValue !== undefined) {
                                    $scope.jsonObj[rowIndex] = newValue;
                                    $timeout(function() {
                                        //初始化列字数开始
                                        limitSize();
                                        //初始化列字数结束
                                    }, 100);
                                }
                            });
                        } else {
                            addRowOrCol = $scope.$watch("addRowOrCol", function(newValue, oldValue) {
                                if (newValue !== undefined) {
                                    $scope.jsonObj.push(newValue);
                                    $timeout(function() {
                                        //初始化列字数开始
                                        limitSize();
                                        //初始化列字数结束
                                    }, 100);
                                }
                            });
                        }
                    }
                });
            };
            //打开录入模态框结束
            $scope.deleteDoc = function(docid, row, col) {
                if (confirm("确认要删除？")) {
                    $scope.jsonObj[row].splice(col, 1);
                    limitSize();
                    if ($scope.jsonObj[row].length == 0) {
                        $scope.jsonObj.splice(row, 1);
                    }
                }
            };
            $scope.editDoc = function(editJson, row, col) {
                var editDoc = $modal.open({
                    templateUrl: "./editingCenter/website/fragmentManagement/multiDoc/multiDoc_doc_edit_dir.html",
                    scope: $scope,
                    backdrop: false,
                    keyboard: false,
                    windowClass: "defaultClass editDocWin",
                    controller: function($scope) {
                        $scope.editJson = editJson; //JSON.stringify(editJson);
                        $scope.editJsonNew;
                        editJsonNew = $scope.$watch("editJsonNew", function(newValue, olsValue) {
                            if (newValue !== undefined) {
                                $scope.jsonObj[row][col] = $scope.editJsonNew;
                                //初始化列字数开始
                                limitSize();
                                //初始化列字数结束
                            }
                        });
                    }
                });
            };
            //h5拖拽开始
            $scope.dragoverCallback = function(event, index, external, type) {
                $scope.logListEvent('dragged over', event, index, external, type);
                // Disallow dropping in the third row. Could also be done with dnd-disable-if.
                return index < 10;
            };

            $scope.dropCallback = function(event, index, item, external, type, allowedType) {
                $scope.logListEvent('dropped at', event, index, external, type);
                if (external) {
                    if (allowedType === 'colType' && !item.label) return false;
                    if (allowedType === 'rowType' && !angular.isArray(item)) return false;
                }
                $timeout(function() {
                    limitSize();
                });
                return item;
            };

            $scope.logEvent = function(message, event) {
                /*console.log(message, '(triggered by the following', event.type, 'event)');
                console.log(event);*/
            };

            $scope.logListEvent = function(action, event, index, external, type) {
                /*var message = external ? 'External ' : '';
                message += type + ' element is ' + action + ' position ' + index;
                $scope.logEvent(message, event);*/
            };
            //h5拖拽结束
            //工具条函数开始
            $scope.getToolBar = function(state, obj) {
                var tagName = $(obj.target)[0].tagName;
                if (state == "in") {
                    $(obj.target).closest("li").find("div").find("div").show();
                } else if (state == "out") {
                    $(obj.target).closest("li").find("div").find("div").hide();
                }
            };
            //工具条函数结束
            //行列字数自适应开始
            function limitSize() {
                $scope.limit = [];
                angular.forEach($scope.jsonObj, function(data, index, array) {
                    if (data.length == 1) {
                        $scope.limit[index] = 70;
                    } else if (data.length == 2) {
                        $scope.limit[index] = 15;
                    } else if (data.length == 3) {
                        $scope.limit[index] = 8;
                    } else if (data.length == 4) {
                        $scope.limit[index] = 5;
                    } else if (data.length == 5) {
                        $scope.limit[index] = 5;
                    } else if (data.length > 5 && data.length < 8) {
                        $scope.limit[index] = 4;
                    } else if (data.length >= 8) {
                        $scope.limit[index] = 2;
                    }
                });
            }
            //行列字数自适应结束
            function init() {
                //初始化列字数开始
                limitSize();
                //初始化列字数结束
                $scope.nowTime = fragmentService.getNowTime();
            }
        }
    };
}]);
