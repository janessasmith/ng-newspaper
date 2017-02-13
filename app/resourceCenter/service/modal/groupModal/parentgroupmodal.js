angular.module("showPGroupModule", []).controller("showPGroupCtrl", ['$scope', '$state', '$modalInstance', 'resourceCenterService', 'selectedSource', 'SweetAlert', 'trsconfirm', 'resCtrModalService', 'trsHttpService',
    function($scope, $state, $modalInstance, resourceCenterService, selectedSource, SweetAlert, trsconfirm, resCtrModalService, trsHttpService) {
        initStatus();
        initData();
        /** [initStatus 初始化] */
        function initStatus() {
            var title = "";
            if (selectedSource.items.length == 1) {
                title = initTitle(selectedSource.items[0]);
            }
            $scope.basicParams = {
                title: selectedSource.title || title
            }
            $scope.status = {
                curGroup: selectedSource.parentId ? {
                    id: selectedSource.parentId
                } : "",
                hasSaved: false
            }
        }
        /** [initData 初始化数据] */
        function initData() {
            checkDefault();
        }

        function initTitle(item) {
            var title = item.SOURCENAME;
            if (item.SECTION == "app" || item.SECTION == "website") {
                title += "|" + item.CHANNEL;
            } else if (item.SECTION == "weixin") {
                title += "(微信)";
            }
            return title;
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
                }
            });
        }
        /** [formatDocChannel 格式化docChannel] */
        function formatDocChannel(item) {
            var docChannel;
            if (item.CHANNELNAME == "xhsg") {
                docChannel = item.CHANNEL;
            } else if (item.CHANNELNAME == "wx" || item.CHANNELNAME == "szb") {
                docChannel = item.SOURCENAME;
                (selectedSource.sourceType == "jtcpg" && item.CHANNELNAME == "wx") && (docChannel += "公众号");
            } else if (item.CHANNELNAME == "app" || item.CHANNELNAME == "wz") {
                docChannel = item.SOURCENAME + ":" + item.CHANNEL;
            }
            return docChannel;
        }
        /** [formatAddSourceData 格式化添加订阅的参数] */
        function formatAddSourceData(item, parentId) {
            var sendObj = {
                serviceid: "subscript",
                modelid: "addSubscript",
                typeid: "zyzx",
                tableName: "test",
                description: "desp",
                title: $scope.basicParams.title,
                parentId: parentId,
                condition: JSON.stringify(item.items),
                channelType: item.sourceType
            }
            return sendObj;
        }
        /** [formatEditSourceData description:格式化编辑信息] */
        function formatEditSourceData(item, parentId) {
            var sendObj = {
                serviceid: "subscript",
                modelid: "updateSub",
                typeid: "zyzx",
                tableName: "test",
                description: "desp",
                title: $scope.basicParams.title,
                parentId: item.parentId,
                sourceId: item.sourceId,
                targetId: parentId,
                condition: JSON.stringify(item.items),
                channelType: item.sourceType
            }
            return sendObj;
        }
        /** [addNewGroup 新建分组] */
        $scope.addNewGroup = function() {
            var takeDraftModal = resCtrModalService.createGroup(true);
            takeDraftModal.result.then(function(data) {
                if (data.result == "success") {
                    checkDefault();
                }
            });
        };
        /** [close 关闭窗体] */
        $scope.close = function() {
            $modalInstance.dismiss($scope.status.hasSaved);
        };
        /** [selectGroup 选择分组] */
        $scope.selectGroup = function() {
            if ($scope.basicParams.title && $scope.status.curGroup) {
                var params;
                if (selectedSource.sourceId) {
                    params = formatEditSourceData(selectedSource, $scope.status.curGroup.id);
                } else {
                    params = formatAddSourceData(selectedSource, $scope.status.curGroup.id);
                }
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                    if (data.result == "success") {
                        $scope.status.hasSaved = true;
                        SweetAlert.swal({
                            title: "订阅添加成功",
                            showCancelButton: true,
                            type: "success",
                            closeOnConfirm: true,
                            cancelButtonText: "返回新增订阅",
                            confirmButtonText: "查看此条订阅"
                        }, function(isConfirm) {
                            if (isConfirm) {
                                $state.go("resourcectrl.iwo.resource", {
                                    modalid: 73,
                                    typename: 73,
                                    nodeid: data.content[0]
                                });
                                $modalInstance.close();
                            } else {
                                $modalInstance.close($scope.status.hasSaved);
                            }
                        });
                    }
                });
            } else {
                SweetAlert.swal({
                    title: "提示",
                    text: "请确保输入完整",
                    type: "warning",
                    closeOnConfirm: true,
                    cancelButtonText: "确定",
                });
            }
        };
        /** [setCurtGroup 设置当前分组] */
        $scope.setCurtGroup = function(group) {
            $scope.status.curGroup = group;
        }
    }
]);