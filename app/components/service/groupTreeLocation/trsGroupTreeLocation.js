"use strict";
/**
 *  Module 组织树定位
 *
 * Description 必须参数：；basicParams:基础参数包括
 */
angular.module("trsGroupTreeLocation", []).
factory("trsGroupTreeLocationService", ["$q", "trsHttpService", function($q, trsHttpService) {
    var treeIndex = 0;
    return {
        /**
         * [groupTreeLocation description]定位组织
         * @param  {[type]} array [description] 定位数组
         * @return {[type]}           [description]
         */
        groupTreeLocation: function(array, tree, selectedNode, expanded, success) {
            var nodeArray = [];
            var treeChildrenArray = [];
            for (var i = 0; i < array.length; i++) {
                var obj = {};
                obj.GROUPID = array[i];
                obj.HASCHILDREN = i === (array.length - 1) ? "false" : "true";
                nodeArray.push(obj);
            }
            treeIndex = 0;
            foreachData(nodeArray, function() {
                var selectedNode;
                treeIndex = 0;
                selectedNode = foreachTree();
                var data = angular.copy(tree);
                success(tree, array, selectedNode);
            });

            function foreachTree(success) {
                var data = treeIndex === 0 ? tree : selectedNode;
                for (var i = 0; i < data.CHILDREN.length; i++) {
                    if (array[treeIndex] === data.CHILDREN[i].GROUPID) {
                        selectedNode = data.CHILDREN[i];
                        selectedNode.CHILDREN = treeChildrenArray[treeIndex];
                        if (treeIndex !== array.length - 1) {
                            expanded.push(selectedNode);
                        }
                        treeIndex++;
                        break;
                    }
                }
                if (treeIndex <= array.length - 1) {
                    foreachTree();
                }
                return selectedNode;
            }

            function foreachData(nodeArray, getDataSuccess) {
                childrenTree(nodeArray[treeIndex], function(data) {
                    treeChildrenArray.push(data);
                    treeIndex++;
                    if (treeIndex === nodeArray.length) {
                        getDataSuccess();
                    } else {
                        foreachData(nodeArray, getDataSuccess);
                    }
                });
            }

            function childrenTree(node, success) {
                var params = {
                    "serviceid": "mlf_group",
                    "methodname": "queryChildGroupsForGroupUserMgr",
                    "GroupId": node.GROUPID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    success(data.CHILDREN);
                });
            }
        }
    };
}]);
