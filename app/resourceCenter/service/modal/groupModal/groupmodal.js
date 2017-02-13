angular.module("showGroupModule", []).controller("showGroupCtrl", ['$scope', '$state', '$modalInstance', 'resourceCenterService', 'editValues', 'SweetAlert', 'trsconfirm',
    function($scope, $state, $modalInstance, resourceCenterService, editValues, SweetAlert, trsconfirm) {

        initStatus();
        /** [initStatus 初始化] */
        function initStatus() {
            $scope.editValues = editValues;
            $scope.groupName = editValues.title;
            $scope.curGroup = {
                id: editValues.sourceId
            };
            $scope.status = {
                showCreateGroup: false
            }
            initData();
        }
        /** [initData 初始化数据] */
        function initData() {
            checkDefault();
        }
        /** [checkDefault 判断是否有默认组] */
        function checkDefault() {
            resourceCenterService.getSubscribe('findGroupByUser').then(function(data) {
                if (data.result === 'success') {
                    $scope.defaultId = data.content[0];
                    loadGroup();
                }
            });
        }
        /** [loadGroup 加载分组] */
        function loadGroup() {
            resourceCenterService.getSubscribe('getGroupAndChildren').then(function(data) {
                if (data.result === 'success') {
                    $scope.groups = data.content;
                    angular.forEach(data.content, function(value, key) {
                        if (value.id == editValues.parentId) {
                            $scope.parentGroup = value;
                            return;
                        }
                    });
                }
            });
        }
        /** [close 关闭] */
        $scope.close = function() {
            $modalInstance.dismiss();
        };
        /** [save 保存] */
        $scope.save = function() {

            if ($scope.groupName && $scope.curGroup.id) {
                if ($scope.curGroup.resourceGroup) {
                    save();
                } else {
                    edit($scope.curGroup.id);
                }
            } else {
                trsconfirm.alertType("请确保信息输入选择完整！", "", "error", false, "");
            }
        };
        /** [save 保存] */
        function save() {
            $modalInstance.close({
                title: $scope.groupName,
                parentId: $scope.curGroup.id,
                sourceId: $scope.editValues.sourceId,
                preParentId: $scope.editValues.parentId
            });
        }
        /** [edit 修改] */
        function edit(id) {
            if (!editValues.sourceId) {
                SweetAlert.swal({
                    title: "是否确定覆盖此条订阅",
                    showCancelButton: true,
                    type: "warning",
                    closeOnConfirm: true,
                    cancelButtonText: "取消",
                    confirmButtonText: "确定"
                }, function(isConfirm) {
                    if (isConfirm) {
                        getGroupItemInfo(id, function(data) {
                            $modalInstance.close({
                                title: $scope.groupName,
                                parentId: $scope.parentGroup.id,
                                sourceId: $scope.curGroup.id,
                                preParentId: $scope.parentGroup.id,
                                tableName: data.content[0].tableName
                            });
                        });
                    }
                });
            } else {
                getGroupItemInfo(id, function(data) {
                    $modalInstance.close({
                        title: $scope.groupName,
                        parentId: $scope.parentGroup.id,
                        sourceId: editValues.sourceId,
                        preParentId: editValues.parentId,
                        tableName: data.content[0].tableName
                    });
                });
            }
        }
        /** [selectCurItem 选中订阅] */
        $scope.selectCurItem = function(item, parent, temp) {
            if (!temp) {
                $scope.curGroup = item;
                $scope.groupName = item.title;
                $scope.parentGroup = parent;
            }
        };
        /** [getGroupItemInfo 获取订阅信息] */
        function getGroupItemInfo(id, callback) {
            resourceCenterService.findSourceById({
                sourceId: id
            }).then(function(data) {
                typeof callback == "function" && callback(data);
            });
        }
        /** [setCurGroup 选择当前分组] */
        $scope.setCurGroup = function(group) {
            group.open = !group.open;
            $scope.curGroup = group;
        };
        /** [addNewItem 添加新增订阅] */
        $scope.addNewItem = function() {
            if (!$scope.newGroupName) {
                trsconfirm.alertType("请填写订阅名称！", "", "error", false, "");
                return false;
            }
            resourceCenterService.getSubscribe('addGroup', {
                title: $scope.newGroupName
            }).then(function(data) {
                $scope.newGroupName = "";
                $scope.status.showCreateGroup = false;
                checkDefault();
            });
        };
    }
]);