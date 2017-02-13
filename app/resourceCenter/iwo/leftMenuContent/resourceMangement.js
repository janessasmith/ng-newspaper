/** 管理订阅 */
angular.module("resMangementModule", []).
controller("resMangementCtrl", [
    '$scope',
    'resCtrModalService',
    'resourceCenterService',
    'trsspliceString',
    'SweetAlert',
    'trsconfirm',
    '$state',
    function($scope, resCtrModalService, resourceCenterService, trsspliceString, SweetAlert, trsconfirm, $state) {
        /** 新建分组 */
        $scope.selectGroupId = null;
        $scope.resources = [];
        $scope.createModal = function() {
            var takeDraftModal = resCtrModalService.createGroup();
            takeDraftModal.result.then(function(data) {
                if (data.result == "success") {
                    getAllgroup();
                }
            });
        };
        $scope.viewGroup = function(group) {
            $scope.selectGroupId = group.id;
            resourceCenterService.getSubscribe('getGroupChildren', { id: group.id }).then(function(data) {
                if (data.result === 'success') {
                    $scope.resources = data.content;
                }
            }, function() {

            });
        };
        $scope.edit = function(group, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            trsconfirm.typingModel('重命名分组', group.title, function(title) {
                resourceCenterService.getSubscribe('updateGroupName', {
                    id: group.id,
                    title: title
                }).then(function(data) {
                    if (data.result === 'success') {
                        group.title = title;
                    }
                }, function() {

                });
            });
        };
        $scope.renameSource = function(resource, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            trsconfirm.typingModel('重命名资源', resource.title, function(title) {
                resourceCenterService.getSubscribe('updateSourceName', {
                    id: resource.id,
                    parentId: $scope.selectGroupId,
                    title: title
                }).then(function(data) {
                    if (data.result === 'success') {
                        resource.title = title;
                    }
                }, function() {

                });
            });
        };
        $scope.cancel = function(group, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            group.edit = false;
        };
        $scope.save = function(group, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            resourceCenterService.getSubscribe('updateGroup', {
                id: group.id,
                isControl: group.isControl,
                title: group.tempTitle
            }).then(function(data) {
                if (data.result === 'success') {
                    group.title = group.tempTitle;
                    group.edit = false;
                }
            }, function() {

            });
        };
        $scope.upMove = function(item, index, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            resourceCenterService.getSubscribe('moveGroup', {
                id: item.id,
                move: 'up',
                type: item.type
            }).then(function(data) {
                if (data.result === 'success') {
                    swapitems(index - 1, index);
                }
            }, function() {

            });
        };

        $scope.upTopMove = function(group, index, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            resourceCenterService.getSubscribe('moveTop', {
                id: group.id,
                type: group.type
            }).then(function(data) {
                if (data.result === 'success') {
                    moveItemtoTop(index);
                }
            }, function() {

            });
        };

        $scope.downMove = function(group, index, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            resourceCenterService.getSubscribe('moveGroup', {
                id: group.id,
                move: 'down',
                type: group.type
            }).then(function(data) {
                if (data.result === 'success') {
                    swapitems(index, index + 1);
                }
            }, function() {

            });
        };
        $scope.downBottomMove = function(group, index, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            resourceCenterService.getSubscribe('moveDown', {
                id: group.id,
                type: group.type
            }).then(function(data) {
                if (data.result === 'success') {
                    moveItemtoBottom(index);
                }
            }, function() {

            });
        };
        var swapitems = function(idx, secidx) {
            var temp = angular.copy($scope.resources[idx]);
            $scope.resources[idx] = angular.copy($scope.resources[secidx]);
            $scope.resources[secidx] = temp;
        };

        var moveItemtoTop = function(idx) {
            var temp = angular.copy($scope.resources[idx]);
            for (var i = idx; i > 0; i--) {
                $scope.resources[i] = angular.copy($scope.resources[i - 1]);
            }
            $scope.resources[0] = temp;
        };
        var moveItemtoBottom = function(idx) {
            var temp = angular.copy($scope.resources[idx]);
            var max = $scope.resources.length - 1;
            for (var i = idx; i < max; i++) {
                $scope.resources[i] = angular.copy($scope.resources[i + 1]);
            }
            $scope.resources[max] = temp;
        };
        $scope.deleteGroup = function(group, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            SweetAlert.swal({
                title: "删除分组将同时删除分组下所有的订阅，确认删除？",
                showCancelButton: true,
                type: "warning",
                closeOnConfirm: true,
                cancelButtonText: "取消操作",
                confirmButtonText: "确认删除"
            }, function(isConfirm) {
                if (isConfirm) {
                    var ids = trsspliceString.spliceString(group.resourceGroup, 'id', ';', 'isControl', true);
                    resourceCenterService.getSubscribe('deleteGroup', {
                        id: group.id,
                        ids: ids
                    }).then(function(data) {
                        if (data.result === 'success') {
                            getAllgroup();
                        }
                    }, function() {

                    });
                }
            });
        };
        $scope.deleteSource = function(item, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            SweetAlert.swal({
                title: "是否确认删除此条订阅？",
                showCancelButton: true,
                type: "warning",
                closeOnConfirm: true,
                cancelButtonText: "取消操作",
                confirmButtonText: "确认删除"
            }, function(isConfirm) {
                if (isConfirm) {
                    resourceCenterService.cancleMyCustom({
                        CustomId: item.id,
                    });
                    resourceCenterService.getSubscribe('deleteSource', {
                        id: item.id,
                        isControl: item.isControl
                    }).then(function(data) {
                        if (data.result === 'success') {
                            item.isdeleted = true;
                        }
                    }, function() {

                    });
                }
            });
        };

        $scope.moveitemtoGroup = function(item, group) {
            resourceCenterService.getSubscribe('moveGroupTo', {
                id: item.id,
                isControl: item.isControl,
                target_id: group.id
            }).then(function(data) {
                if (data.result === 'success') {
                    item.isdeleted = true;
                }
            }, function() {

            });
        };
        $scope.editSource = function(parentId, item, evt) {
            evt.stopPropagation();
            $state.go("retrieval.subscribe", {
                parentId: parentId,
                sourceId: item.id,
                title: item.title,
                channelType: true
            });
        };
        var init = function() {
            resourceCenterService.getSubscribe('findGroupByUser').then(function(data) {
                if (data.result === 'success') {
                    $scope.defaultId = data.content[0];
                    getAllgroup();
                }
            }, function() {});
        };
        var getAllgroup = function() {
            resourceCenterService.getSubscribe('getGroupRoot').then(function(data) {
                if (data.result === 'success') {
                    $scope.groups = data.content;
                    if ($scope.groups.length > 0) {
                        $scope.viewGroup($scope.groups[0]);
                    } 
                }
            }, function() {});
        };
        init();
    }
]);
