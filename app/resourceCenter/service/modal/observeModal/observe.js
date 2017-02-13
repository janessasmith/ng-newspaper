'use strict';
angular.module('reseourceObserveModule', []).
controller('reseourceObserveCtrl', ["$scope", "$q", "$timeout", "$modalInstance", "$state", "trsHttpService", "trsconfirm", "trsspliceString", "resourceCenterService",function($scope, $q, $timeout, $modalInstance, $state, trsHttpService, trsconfirm, trsspliceString, resourceCenterService) {
    initStatus();
    initData();
    /**
     * [initStatus description]初始化状态
     * @return {[type]} [description]
     */
    function initStatus() {
        $scope.status = {
            treeOptions: {
                nodeChildren: "CHILDREN",
                dirSelectable: true,
                allowDeselect: false,
                injectClasses: {
                    ul: "moveDraftTree-ul",
                    li: "moveDraftTree-li",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "moveDraftTree-label",
                    labelSelected: "rolegrouplabselected"
                },
                isLeaf: function(node) {
                    return node.HASCHILDREN === "false";
                },
            },
            ifExpand: true,
        };
        $scope.data = {
            modalTitle: "川报观察",
            dataForTheTree: "",
            sitedesc: "川报",
        };
    }
    /**
     * [initData description]初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        getTreeData().then(function(data) {
            $scope.data.dataForTheTree = data;
        });
    }
    /**
     * [getTreeData description]获得栏目树
     * @param  {[str]} channelid [description]栏目的id
     * @return {[type]}           [description]
     */
    function getTreeData(channelid) {
        var deffered = $q.defer();
        var params = {
            serviceid: "mlf_extappexchange",
            methodname: "getCGChannels",
            ChannelId: channelid,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            deffered.resolve(data);
        });
        return deffered.promise;
    }
    /**
     * [chooseChannel description]选择栏目
     * @param  {[obj]} node [description]节点信息
     * @return {[type]}      [description]
     */
    $scope.chooseChannel = function(node) {
        $scope.status.selectedChannel = node;
    };
    /**
     * [cancelChannel description]取消选择
     * @return {[type]} [description]
     */
    $scope.cancelChannel = function() {
        $scope.status.selectedChannel = null;
    };
    /**
     * [confirm description]确定按钮
     * @return {[type]} [description]
     */
    $scope.confirm = function() {
        $modalInstance.close($scope.status.selectedChannel);
    };
    /**
     * [cancel description]取消按钮
     * @return {[type]} [description]
     */
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
    /**
     * [showToggle description]展开树请求节点
     * @param  {[obj]} node [description]树结点信息
     * @return {[type]}      [description]
     */
    $scope.showToggle = function(node) {
        if (node.HASCHILDREN === "true") {
            getTreeData(node.CHANNELID).then(function(data) {
                node.CHILDREN = data;
            });
        }
    };
}]);
