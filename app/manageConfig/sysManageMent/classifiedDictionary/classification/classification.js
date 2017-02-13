/*
    Create by Baizm 2015-11-13
*/
"use strict";
angular.module("classficationModule", ["synchronous"])
    .controller("classficationCtrl", ["$scope", "$modal", "$stateParams", 'trsHttpService', 'trsconfirm', '$timeout', function($scope, $modal, $stateParams, trsHttpService, trsconfirm, $timeout) {
        init();
        //树配置开始
        var nodeId = "";
        $scope.showSelected = function(node, $parentNode) {
            //获取当前树的父节点，用于删除开始
            $timeout(function() {
                $parentNode === null ? $scope.parentNode = {
                    CHILDREN: $scope.dataForTheTree
                } : $scope.parentNode = $parentNode;
            }, 100);
            //获取当前树的父节点，用于删除结束
            $scope.params = {
                typeid: "dicttool",
                serviceid: $scope.url,
                modelid: "getNodeInfo",
                nodeId: node.id
            };
            $scope.isRoot = false;
            //trsHttpService.httpServer('/dicttool/' + $scope.url + '/getNodeInfo/', $scope.params, 'get').then(function(data) {
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), $scope.params, 'get').then(function(data) {
                //重置创建文件表单
                $scope.createForm.$setPristine();
                //当点击非叶子节点（文件夹）时出现的页面
                $scope.nodeId = node.id;
                if (node.type === "dir") {
                    //声明文件夹数据对象，为文件夹说明赋值
                    $scope.folder = {};
                    $scope.folder.instruction = data.content.replace(/~/g, "\n");
                    $scope.folder.dictName = data.dictName;
                    $scope.switch = {
                        create: false,
                        folder: true,
                        file: false,
                    };
                } else {
                    $scope.file = {};
                    $scope.file.instruction = data.content.replace(/~/g, "\n");
                    $scope.file.dictName = data.dictName;
                    $scope.switch = {
                        create: false,
                        folder: false,
                        file: true,
                    };
                }
                $scope.instruction = "";
                $scope.dictName = "";
            }, function(data) {});
        };
        $scope.selectRoot = function() {
            $scope.switch = {
                create: false,
                folder: true,
                file: false,
            };
            $scope.isRoot = true;
            $scope.selectedNode = {};
            $scope.folder = {
                instruction: $scope.module,
                dictName: $scope.module
            };
        };
        $scope.showToggle = function(node) {
            // node.CHILDREN = [];
            if (!angular.isDefined(node.CHILDREN)) {
                var params = {
                    typeid: "dicttool",
                    serviceid: $scope.url,
                    modelid: "getChildren",
                    parentId: node.id
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, 'get').then(function(data) {
                    node.CHILDREN = data;
                });
            }
        };

        function init() {
            $scope.params = {
                condition: 'id=area_002001'
            };
            $scope.treeOptions = {
                nodeChildren: "CHILDREN",
                dirSelectable: true,
                allowDeselect: false,
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "rolegrouplabselected"
                },
                isLeaf: function(node) {
                    return node.type == "file";
                }
            };
            //树配置结束
            $scope.module = $stateParams.name;
            getInitTree($stateParams.type);
            $scope.url = $stateParams.type;
        }
        //同步分类到CKM服务器
        $scope.SynchronousData = function() {
            $modal.open({
                templateUrl: "./manageConfig/sysManageMent/classifiedDictionary/classification/synchronous/synchronous_tpl.html",
                scope: $scope,
                windowClass: 'toBeCompiled-synchronousModel-window',
                backdrop: true,
                controller: "synchronousCtrl"
            });
        };
        //搜索方法开始
        $scope.search = function() {
            var params = {
                typeid: "dicttool",
                serviceid: $scope.url,
                modelid: "getAbsolutePathOfNode",
                condition: "dictName=%" + $scope.searchWord + "%"
            };
            if ($scope.searchWord === "" || $scope.searchWord === undefined) {
                getInitTree($scope.url);
            } else {
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, 'get').then(function(data) {
                    //trsHttpService.httpServer('/dicttool/' + $scope.url + '/getAbsolutePathOfNode', params, 'get').then(function(data) {
                    $scope.dataForTheTree = data;
                });
            }
        };
        $scope.deleteNode = function() {
            trsconfirm.alertType("确认删除", "您确定要删除么", "warning", true, function() {
                var params = {
                    typeid: "dicttool",
                    serviceid: $scope.url,
                    modelid: "deleteNode",
                    nodeId: $scope.selectedNode.id
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, 'get').then(function(data) {
                    //trsHttpService.httpServer('/dicttool/' + $scope.url + '/deleteNode', params, 'get').then(function(data) {
                    if ("success" === "success") {
                        var deleteIndex;
                        angular.forEach($scope.parentNode.CHILDREN, function(data, index, array) {
                            if (data.id === $scope.selectedNode.id) {
                                deleteIndex = index;
                            }
                        });
                        $timeout(function() {
                            if ($scope.parentNode instanceof Array) {
                                $scope.parentNode.splice(deleteIndex, 1);
                            } else {
                                $scope.parentNode.CHILDREN.splice(deleteIndex, 1);
                            }
                        }, 100);
                    } else {
                        trsconfirm.alertType("删除失败", data, "warning", false, function() {});
                    }
                });
            });
        };
        $scope.createFileOrFolder = function(type) {
            $scope.switch = {
                create: true,
                folder: false,
                file: false,
            };
            $scope.dictName = "";
            $scope.instruction = "";
            $scope.createType = type;
        };
        //保存新建文件或文件夹
        $scope.saveCreate = function() {
            /*if ($scope.nodeId === undefined) {
                trsconfirm.alertType("请先选择节点", "请先选择节点", "warning", false, function() {});
                return;
            }*/
            var params = {
                "typeid": "dicttool",
                "serviceid": $scope.url,
                "modelid": "addNode",
                "nodeId": $scope.nodeId,
                "dictName": $scope.dictName,
                "content": angular.copy($scope.instruction).replace(/\n/g, "~").replace(/\"/g, "'").replace(/\\/g, "")
            };
            if ($scope.isRoot) {
                params.nodeId = "";
            }
            var newNode = {
                "dictName": $scope.dictName,

            };
            // var url = "/dicttool/" + $scope.url + "/addNode";
            if ($scope.createType === "file") {
                params.type = "file";
                newNode.type = "file";
            } else {
                params.type = "dir";
                newNode.type = "dir";
                newNode.CHILDREN = [];
            }
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, 'get').then(function(data) {
                newNode.id = data;
                if ($scope.isRoot) {
                    $scope.dataForTheTree.push(newNode);
                    $scope.expanded.push(newNode);
                }
                $scope.selectedNode.CHILDREN.push(newNode);
                $scope.expanded.push(newNode);
                $scope.switch = {
                    create: false,
                    folder: true,
                    file: false,
                };
            }, function(data) {});
        };
        //删除文件或文件夹方法开始

        //更改保存地域分类数据
        $scope.saveClassficationData = function(type) {
            if ($scope.nodeId === undefined) {
                trsconfirm.alertType("请先选择节点", "请先选择节点", "warning", false, function() {});
                return;
            }
            var params = {
                "typeid":'dicttool',
                "serviceid":$scope.url,
                "modelid":'update',
                "condition": "id=" + $scope.nodeId,
            };
            if (type === 'file') {
                params.dictName = $scope.file.dictName;
                params.content = angular.copy($scope.file.instruction).replace(/\n/g, "~").replace(/\"/g, "'").replace(/\\/g, "");
            } else {
                params.dictName = $scope.folder.dictName;
                params.content = angular.copy($scope.folder.instruction).replace(/\n/g, "~").replace(/\"/g, "'").replace(/\\/g, "");
            }
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, 'post').then(function(data) {
            //trsHttpService.httpServer('/dicttool/' + $scope.url + '/update', params, 'post').then(function(data) {
                // $scope.content=$scope.dataForTheTree;
                if (data === "success") {
                    $scope.selectedNode.dictName = params.dictName;
                    trsconfirm.alertType("保存成功", data, "success", false, function() {});
                } else {
                    trsconfirm.alertType("保存失败", data, "warning", false, function() {});
                }
            }, function(data) {});

        };

        /*function initSwitch(dataC) {
            //树选中效果重置；
            if ($scope.selectedNode !== undefined) {
                $scope.selectedNode = {};
                $scope.nodeId = null;
            }
            //默认展开效果重置
            $scope.expanded = [];
            //初始化file值
            $scope.file = {};
            //初始化folder值
            $scope.folder = {};
            //初始化create值
            $scope.dictName = "";
            $scope.instruction = "";
            //切换时清空树
            $scope.dataForTheTree = [];
            //还原三个表单验证
            $scope.createForm.$setPristine();
            $scope.folderForm.$setPristine();
            $scope.fileForm.$setPristine();
            //获取请求地址
            $scope.url = dataC.type;
            
            //表单的切换初始化
            if ($scope.nodeId === undefined || $scope.nodeId===null) {
                $scope.switch = {
                    create: false,
                    folder: false,
                    file: false,
                };
            }
            $scope.module = dataC.name;
            getInitTree(dataC.type);
        }*/

        function getInitTree(url) {
            if (!angular.isDefined(url)) {
                return;
            }
            var params = {
                typeid: "dicttool",
                serviceid: url,
                modelid: "getRootLevel",
            };
            trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, 'get').then(function(data) {
                //trsHttpService.httpServer('/dicttool/' + url + '/getRootLevel', "", 'get').then(function(data) {
                $scope.dataForTheTree = data;
                //默认树显示
                $scope.tree = {
                    display: true
                };
                //树的初始化展开
                /*$timeout(function() {
                    $scope.expanded.push($scope.dataForTheTree[0]);
                }, 100);*/
                // $scope.content=$scope.dataForTheTree;
            }, function(data) {
                $scope.dataForTheTree = [];
            });
        }

    }]);
