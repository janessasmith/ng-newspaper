/*
    create by BaiZhiming  2016-2-24
*/
'use strict';
angular.module("trsPermissionAssignmentDirectve", [])
    .directive("perssionAssignment", [
        function() {
            return {
                restrict: 'E',
                scope: {
                    "rightClassify": "=",
                    "authorSelectedNode": "=",
                    "initSelectAll": "&",
                    "classify": "@",
                    "moduleName": "@",
                    "pages": "=",
                    "pageIds": "="
                },
                replace: true,
                templateUrl: "./manageConfig/roleManageMent/directive/permissionAssignment/template/permissionAssignment_tpl.html",
                link: function(scope, element, attrs, ctrl) {
                    //状态全选方法开始
                    scope.statuSelectAll = function(status, index) {
                        if (!status.selectAll) {
                            scope.rightClassify.CHILDREN[index].selectAll = true;
                            for (var i = 0; i < status.CHILDREN.length; i++) {
                                scope.authorSelectedNode.RIGHTVALUE[status.CHILDREN[i].RIGHTINDEX - 1] = "1";
                            }
                        } else {
                            scope.rightClassify.CHILDREN[index].selectAll = false;
                            for (var i = 0; i < status.CHILDREN.length; i++) {
                                scope.authorSelectedNode.RIGHTVALUE[status.CHILDREN[i].RIGHTINDEX - 1] = "0";
                            }
                        }
                        scope.initSelectAll();
                    };
                    //状态全选方法结束
                    scope.chooseRight = function(rightindex) {
                        scope.authorSelectedNode.RIGHTVALUE[rightindex] = scope.authorSelectedNode.RIGHTVALUE[rightindex] === '1' ? '0' : '1';
                        scope.changeSelectAll();
                    };
                    //点击选择权限后检测是否为全选开始
                    scope.changeSelectAll = function() {
                        scope.initSelectAll();
                    };
                    //点击选择权限后检测是否为全选结束
                    //栏目全选方法开始
                    scope.channelSelectAll = function() {
                        if (!scope.rightClassify.selectAll) {
                            for (var i = 0; i < scope.rightClassify.CHILDREN.length; i++) {
                                scope.rightClassify.CHILDREN[i].selectAll = true;
                                for (var j = 0; j < scope.rightClassify.CHILDREN[i].CHILDREN.length; j++) {
                                    scope.authorSelectedNode.RIGHTVALUE[scope.rightClassify.CHILDREN[i].CHILDREN[j].RIGHTINDEX - 1] = "1";
                                }
                            }
                            scope.rightClassify.selectAll = true;
                        } else {
                            for (var i = 0; i < scope.rightClassify.CHILDREN.length; i++) {
                                scope.rightClassify.CHILDREN[i].selectAll = false;
                                for (var j = 0; j < scope.rightClassify.CHILDREN[i].CHILDREN.length; j++) {
                                    scope.authorSelectedNode.RIGHTVALUE[scope.rightClassify.CHILDREN[i].CHILDREN[j].RIGHTINDEX - 1] = "0";
                                }
                            }
                            scope.rightClassify.selectAll = false;
                        }
                        scope.initSelectAll();
                    };
                    //栏目全选方法结束
                    //选择报纸版面函数开始
                    scope.choosePage = function(right) {
                        if (!scope.checkPageSelected(right).flag) {
                            scope.pageIds.push(right.CHANNELID);
                        } else {
                            scope.pageIds.splice(scope.checkPageSelected(right).index, 1);
                        }
                    };
                    //选择报纸版面函数结束
                    //检查版面是否选中开始
                    scope.checkPageSelected = function(right) {
                        var flag = false;
                        var index;
                        angular.forEach(scope.pageIds, function(data, _index, array) {
                            if (right.CHANNELID === data) {
                                flag = true;
                                index = _index;
                            }
                        });
                        right.selected = flag ? true : false;
                        return { flag: flag, index: index };
                    };
                    //检查版面是否选中结束
                    //报纸叠次全选开始
                    scope.stackTimeSelectAll = function(stackTime) {
                        if (stackTime.selected) {
                            var i = 0;
                            while (i < scope.pageIds.length) {
                                var flag = true;
                                for (var j = 0; j < stackTime.BM.length; j++) {
                                    if (scope.pageIds[i] === stackTime.BM[j].CHANNELID) {
                                        scope.pageIds.splice(i, 1);
                                        flag = false;
                                    }
                                }
                                if (flag) {
                                    i++;
                                }
                            }
                        } else {
                            scope.pageIds = scope.pageIds.concat(scope.checkStackTimeSelectAll(stackTime).uncheckedPage);
                        }
                    };
                    //报纸叠次全选结束
                    //检查报纸叠次全选开始
                    scope.checkStackTimeSelectAll = function(stackTime) {
                        var flag = true;
                        var uncheckedPage = [];
                        angular.forEach(stackTime.BM, function(data, index, array) {
                            if (!data.selected) {
                                flag = false;
                                uncheckedPage.push(data.CHANNELID);
                            }
                        });
                        stackTime.selected = flag ? true : false;
                        return { "flag": flag, "uncheckedPage": uncheckedPage };
                    };
                    //检查报纸叠次全选结束
                    //点击文字选择权限
                    scope.spanSelectRight = function(rightIndex) {
                        scope.authorSelectedNode.RIGHTVALUE[rightIndex] = scope.authorSelectedNode.RIGHTVALUE[rightIndex] === '1' ? '0' : '1';
                        scope.changeSelectAll();
                    };
                    //版面全选开始
                    scope.pageSelectAll = function(pageValue) {
                        if (!scope.checkPageSelectAll(pageValue)) {
                            angular.forEach(pageValue, function(data, index, array) {
                                if (!data.selected) {
                                    scope.stackTimeSelectAll(data);
                                }
                            });
                        } else {
                            angular.forEach(pageValue, function(data, index, array) {
                                if (!data.selected) {
                                    scope.stackTimeSelectAll(data);
                                }
                                scope.stackTimeSelectAll(data);
                            });
                        }
                    };
                    //版面全选结束
                    //检查全选版面开始
                    scope.checkPageSelectAll = function(pageValue) {
                        var flag = true;
                        angular.forEach(pageValue, function(data, index, array) {
                            if (!data.selected) {
                                flag = false;
                            }
                        });
                        return flag;
                    };
                    //检查全选版面结束
                }
            };
        }
    ]);
