/**
 * author:wangjiang \
 * date:215-10-30
 */
/*
html:<editor-dir editor-json="list.fgd_editinfo" show-all-tips="showAllTips" editor-form="newsForm"></editor-dir>
 */
"use strict";
angular.module('trsEditorModule', ["editFlowModule", "editorOtherModule"]).
directive('editorDir', ['$modal', '$location', '$timeout', 'trsHttpService', 'trsconfirm', 'trsResponseHandle', function($modal, $location, $timeout, trsHttpService, trsconfirm, trsResponseHandle) {
    return {
        restrict: 'E',
        templateUrl: "./editingCenter/directive/app/views/editor_tpl.html",
        scope: {
            editorJson: "=",
            showAllTips: "=",
            editorForm: "=",
            metaDataId: "@"
        },
        link: function(scope, iElement, iAttrs) {
            //获得路径
            scope.path = $location.path().split('/').pop();
            $timeout(function() {
                init();
            }, 500);
            scope.editFlow = function() {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/directive/app/views/editor_window_editflow_tpl.html",
                    scope: scope,
                    windowClass: "editor_window_class",
                    dropback: false,
                    controller: "editFlowCtrl",
                });
                modalInstance.result.then(function(result) {
                    scope.editorJson = contrast(result, angular.copy(scope.editorJson), "ID");
                    scope.selected = scope.editorJson[scope.editorJson.length - 1];
                    scope.editIndex = scope.editorJson.length - 1;
                });
            };
            scope.other = function() {
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/directive/app/views/editor_window_other_tpl.html",
                    scope: scope,
                    windowClass: "editor_window_class",
                    dropback: false,
                    controller: "editorOtherCtrl",
                });
                modalInstance.result.then(function(result) {
                    scope.editorJson = contrast(result, angular.copy(scope.editorJson), "ID");
                    scope.selected = scope.editorJson[scope.editorJson.length - 1];
                    scope.editIndex = scope.editorJson.length - 1;
                });
            };
            //编辑流结束
            scope.showEditor = function(index) {
                //scope.currEditInfo= item;
                scope.editIndex = index;
            };
            scope.deleteEditor = function(record) {
                scope.editorJson.splice(record, 1);
                scope.editIndex = scope.editorJson.length - 1;
            };
            scope.select = function(editor) {
                scope.selected = editor;
            };
            //初始化开始
            function init() {
                //初始化显示下标开始
                scope.editIndex = scope.editorJson.length - 1;
                //初始化显示下标结束
                scope.newsForm = scope.editorForm;
                scope.showAllTips = false;
                //获取编辑流信息开始
                //获取编辑流列表开始
                scope.selected = scope.editorJson[scope.editorJson.length - 1];
            }
            //初始化结束
            //对比是否重复开始
            function contrast(array1, array2, attribute) {
                angular.forEach(array1, function(data, index, array) {
                    var flag = true;
                    angular.forEach(array2, function(_data, _index, _array) {
                        if (data[attribute] === _data[attribute]) {
                            flag = false;
                        }
                    });
                    if (flag) {
                        array2.push(data);
                    }
                });
                return array2;
            }
            //对比是否重复结束
        }
    };
}]);
