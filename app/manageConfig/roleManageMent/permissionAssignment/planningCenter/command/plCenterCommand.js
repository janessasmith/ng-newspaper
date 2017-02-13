/*
    create by BaiZhiming 2016-4-21
*/
'use strict';
angular.module("manageCfg.roleManageMent.permissionAssignment.plCenterCommandModule", [])
    .controller("plCenterCommandCtrl", ["$scope", "$rootScope", "$modal", "$q", "trsHttpService", "permissionAssignmentService", "trsconfirm", "SweetAlert", function($scope, $rootScope, $modal, $q, trsHttpService, permissionAssignmentService, trsconfirm, SweetAlert) {
        //声明将要保存权限的数组对象开始
        var selecetedChanls = {};
        //声明将要保存权限的数组对象结束
        initStatus();
        initData();
        /**
         * [initStatus description]初始化状态
         */
        function initStatus() {
            $scope.channelTreeOptions = {
                nodeChildren: "CHILDREN",
                injectClasses: {
                    ul: "a1",
                    li: "manage-main-rightDiv-leftDiv-treeLi",
                    liSelected: "a7",
                    iExpanded: "a3", //"manage-main-rightDiv-leftDiv-treeIcon",
                    iCollapsed: "a4", //"manage-main-rightDiv-leftDiv-treeIcon",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "a8"
                },
                isLeaf: function(node) {
                    return angular.isUndefined(node.HASCHILDREN) || node.HASCHILDREN === 'false';
                },
                dirSelectable: true,
                allowDeselect: false
            };
            /**
             * [cTshowSelected description]选择节点
             * @param  {[obj]} node [description] 节点
             */
            $scope.cTshowSelected = function(node) {
                permissionAssignmentService.initGroupRight(node, $scope.roleData.ROLEID).then(function(data) {
                    node.RIGHTID = data;
                    delete $scope.rightClassify;
                    $scope.authorSelectedNode = node;
                    if (!angular.isArray($scope.authorSelectedNode.RIGHTVALUE)) {
                        $scope.authorSelectedNode.RIGHTVALUE = $scope.authorSelectedNode.RIGHTVALUE.split("");
                        $scope.authorSelectedNode.HASSED = $scope.authorSelectedNode.RIGHTVALUE.indexOf("1") > -1 ? true : false;
                    }
                    //将要推送的保存权限对象开始
                    var tempId = $scope.authorSelectedNode.OBJID;
                    var tempObj = {
                        "ID": parseInt($scope.authorSelectedNode.RIGHTID),
                        "OPRTYPE": parseInt($scope.authorSelectedNode.OPRTYPE),
                        "OPRID": parseInt($scope.roleData.ROLEID),
                        "OBJTYPE": parseInt($scope.authorSelectedNode.OBJTYPE),
                        "OBJID": parseInt($scope.authorSelectedNode.OBJID),
                        "NEWVALUE": $scope.authorSelectedNode.RIGHTVALUE
                    };

                    selecetedChanls[tempId] = tempObj;
                    //将要推送的保存权限对象结束
                    queryRightClassify(node.CLASSIFY);
                });
            };
            /**
             *监控左边角色切换
             */
            $scope.$on("roleData", function(event, data) {
                $scope.roleData = data;
                getPlanningCenterProduct($scope.roleData.ROLEID).then(function() {
                    initSelectNode($scope.perSelectedNode);
                    delete $scope.rightClassify;
                });
            });
        }
        /**
         * [initData description]初始化数据
         */
        function initData() {
            //获取树数据
            $scope.moduleName = "协同指挥";
            $scope.channelTree = $rootScope.plCenterRight.treeData[0].CHILDREN;
            initSelectNode($rootScope.plCenterRight.chooseNode);
            delete $rootScope.plCenterRight; //使用完$rootScope.plCenterRight删除防止冗余
        }
        /**
         * [getNodeDesc description]处理树节点显示名称
         * @param  {[obj]} node [description] 节点
         * @return {[string]} desc    [description] 显示名称
         */
        $scope.getNodeDesc = function(node) {
            return node.MODALNAME;
        };
        /**
         * [productAndModule description]打开产品列表
         */
        $scope.productAndModule = function() {
            var productAndModule = $modal.open({
                templateUrl: "./manageConfig/roleManageMent/permissionAssignment/service/productAndModule/productAndModule_tpl.html",
                scope: $scope,
                windowClass: 'manage-authorityAssignment',
                backdrop: false,
                controller: "productAndModuleCtrl"
            });
        };
        /**
         * [initSelectNode description]初始化选中节点
         * @param  {[obj]} node [description] 节点
         */
        function initSelectNode(node) {
            for (var i = 0; i < $scope.channelTree.length; i++) {
                if (node.CLASSIFY === $scope.channelTree[i].CLASSIFY) {
                    $scope.perSelectedNode = $scope.channelTree[i];
                    break;
                }
            }
            $scope.cTshowSelected($scope.perSelectedNode);
        }
        /**
         * [queryRightClassify description]查询节点原子权限
         * @param  {[obj]} node [description] 节点
         */
        function queryRightClassify(classify) {
            var params = {
                "serviceid": "mlf_extrole",
                "methodname": "queryRightClassify",
                "Classify": classify
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(
                function(data) {
                    if ($scope.authorSelectedNode !== undefined) {
                        $scope.rightClassify = data;
                        //初始化全选按钮开始
                        $scope.initSelectAll();
                        //初始化全选按钮结束
                    }
                }
            );
        }
        /**
         * [initSelectAll description]初始化全选按钮
         */
        $scope.initSelectAll = function() {
            $scope.rightClassify.selectAll = true;
            for (var i = 0; i < $scope.rightClassify.CHILDREN.length; i++) {
                $scope.rightClassify.CHILDREN[i].selectAll = true;
                for (var j = 0; j < $scope.rightClassify.CHILDREN[i].CHILDREN.length; j++) {
                    if ($scope.authorSelectedNode.RIGHTVALUE.length === 0 || $scope.authorSelectedNode.RIGHTVALUE[$scope.rightClassify.CHILDREN[i].CHILDREN[j].RIGHTINDEX - 1] == "0") {
                        $scope.rightClassify.CHILDREN[i].selectAll = false;
                    }
                }
                if ($scope.rightClassify.CHILDREN[i].selectAll === false) {
                    $scope.rightClassify.selectAll = false;
                }
            }
        };
        /**
         * [cTshowSelected description]选择节点
         * @param  {[obj]} node [description] 节点
         */
        $scope.cTshowSelected = function(node) {
            permissionAssignmentService.initGroupRight(node, $scope.roleData.ROLEID).then(function(data) {
                node.RIGHTID = data;
                delete $scope.rightClassify;
                $scope.authorSelectedNode = node;
                if (!angular.isArray($scope.authorSelectedNode.RIGHTVALUE)) {
                    $scope.authorSelectedNode.RIGHTVALUE = $scope.authorSelectedNode.RIGHTVALUE.split("");
                    $scope.authorSelectedNode.HASSED = $scope.authorSelectedNode.RIGHTVALUE.indexOf("1") > -1 ? true : false;
                }
                //将要推送的保存权限对象开始
                var tempId = $scope.authorSelectedNode.OBJID;
                var tempObj = {
                    "ID": parseInt($scope.authorSelectedNode.RIGHTID),
                    "OPRTYPE": parseInt($scope.authorSelectedNode.OPRTYPE),
                    "OPRID": parseInt($scope.roleData.ROLEID),
                    "OBJTYPE": parseInt($scope.authorSelectedNode.OBJTYPE),
                    "OBJID": parseInt($scope.authorSelectedNode.OBJID),
                    "NEWVALUE": $scope.authorSelectedNode.RIGHTVALUE
                };

                selecetedChanls[tempId] = tempObj;
                //将要推送的保存权限对象结束
                queryRightClassify(node.CLASSIFY);
            });
        };
        /**
         * [save description]保存群贤
         */
        $scope.save = function() {
            var i = 0,
                postRights = [];
            for (var key in selecetedChanls) {
                postRights.push(angular.copy(selecetedChanls[key]));
                postRights[i].NEWVALUE = angular.isArray(postRights[i].NEWVALUE) ? postRights[i].NEWVALUE.join("") : postRights[i].NEWVALUE;
                i++;
            }
            var postRightsString = JSON.stringify(postRights);
            /*if ($scope.classify !== "iwo") {
                selecetedChanls = {};
            }*/
            var params = {
                "serviceid": "mlf_extrole",
                "methodname": "saveRight",
                "RoleId": $scope.roleData.ROLEID,
                "rights": postRightsString
            };
            if (postRights.length === 0) {
                SweetAlert.swal({
                    title: "提示信息",
                    text: "您未设置过权限",
                    type: "warning",
                    closeOnConfirm: true,
                    cancelButtonText: "确定",
                });
                return;
            }
            $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                trsconfirm.alertType("保存权限成功", "", "success", false,
                    function() {});
            });
        };
        /**
         * [getPlanningCenterProduct description]角色切换时获取权限数据
         * @param  {[string]} roleId [description] 角色Id
         */
        function getPlanningCenterProduct(roleId) {
            var deffer = $q.defer();
            var params = {
                "serviceid": "mlf_extrole",
                "methodname": "queryPlanMediaProduct",
                "RoleId": roleId
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.channelTree = data[0].CHILDREN;
                deffer.resolve();
            });
            return deffer.promise;
        }
    }]);
