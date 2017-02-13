/*
    create by BaiZhiming 2016-2-25
*/
'use strict';
angular.module("manageCfg.roleManageMent.permissionAssignment.proRange", ["manageCfg.roleManageMent.permissionAssignment.productAndModule", "manageCfg.roleManageMent.permissionAssignment.SavePerModule"])
    .controller("proRangeCtrl", ["$scope", "$timeout", "$state", "$modal", "$compile", "$element", "trsHttpService", "SweetAlert", "trsconfirm", "permissionAssignmentService", function($scope, $timeout, $state, $modal, $compile, $element, trsHttpService, SweetAlert, trsconfirm, permissionAssignmentService) {
        //声明将要保存权限的数组对象开始
        var selecetedChanls = {};
        //声明将要保存权限的数组对象结束
        initData();
        $scope.productAndModule = function() {
            var productAndModule = $modal.open({
                templateUrl: "./manageConfig/roleManageMent/permissionAssignment/service/productAndModule/productAndModule_tpl.html",
                scope: $scope,
                windowClass: 'manage-authorityAssignment',
                backdrop: false,
                controller: "productAndModuleCtrl"
            });
        };
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
                return !angular.isDefined(node.CHILDREN) || node.CHILDREN.length === 0;
            },
            dirSelectable: true,
            allowDeselect: false
        };

        $scope.cTshowSelected = function(sel) {
            if(sel.ISONLYNODE==="true"){
                return;
            }
            permissionAssignmentService.initGroupRight(sel, $scope.roleData.ROLEID).then(function(data) {
                sel.RIGHTID = data;
                delete $scope.rightClassify;
                $scope.authorSelectedNode = sel;
                if (!angular.isArray($scope.authorSelectedNode.RIGHTVALUE)) {
                    $scope.authorSelectedNode.RIGHTVALUE = $scope.authorSelectedNode.RIGHTVALUE.split("");
                    $scope.authorSelectedNode.HASSED = $scope.authorSelectedNode.RIGHTVALUE.indexOf("1") > -1 ? true : false;
                }
                //将要推送的保存权限对象开始
                var tempId = $scope.authorSelectedNode.OBJID;
                var tempObj = {
                    "ID": parseInt($scope.authorSelectedNode.RIGHTID),
                    "OPRTYPE": 203,
                    "OPRID": parseInt($scope.roleData.ROLEID),
                    "OBJTYPE": parseInt($scope.authorSelectedNode.OBJTYPE),
                    "OBJID": parseInt($scope.authorSelectedNode.OBJID),
                    "NEWVALUE": $scope.authorSelectedNode.RIGHTVALUE
                };

                selecetedChanls[tempId] = tempObj;
                //将要推送的保存权限对象结束
                queryRightClassify(sel.CLASSIFY);
            });
        };
        //状态全选方法结束
        /**
         * [isAuthorized description]判断是否已赋权，渲染左侧树节点
         * @return boolean [description]
         */
        $scope.isAuthorized = function(node) {
            var flag = false;
            if (angular.isDefined(node.RIGHTINDEX)) {
                var rightIndexs = node.RIGHTINDEX.split(",");
                for(var i = 0;i<rightIndexs.length;i++) {
                    if (node.RIGHTVALUE[parseInt(rightIndexs[i].replace(/\"/g, ""))-1] === "1") {
                        flag = true;
                    }
                }
            } 
            return flag;
        };
        //处理节点名称，用于应对不同模块类型节点名称显示
        $scope.getNodeDesc = function(node) {
            return node.MEDIANAME||node.WEBSITENAME||node.CHANNELNAME;
        };
        //保存权限开始
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
                    function() {
                        //selecetedChanls = {};
                        //保存成功后取消选择开始
                        //cancelSelectedNode();
                        //保存成功后取消选择结束
                        //保存成功后关闭原子权限开始
                        //delete $scope.rightClassify;
                        //保存成功后关闭原子权限结束
                    });
            });
        };
        //保存权限结束
        //获取树开始
        function getChannelTree(roleId, callback) {
            var params = {
                "serviceid": "mlf_mediasite",
                "methodname": "queryWebSitesByMediaTypes",
                "RoleId": roleId
            };
            $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.channelTree = data;
                }
            });
        }
        //获取树结束
        //获取权限列表开始
        function queryRightClassify(classify) {
            var params = {
                "serviceid": "mlf_extrole",
                "methodname": "queryRightClassify",
                "Classify": classify
            };
            $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(
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
        //获取权限列表结束
        //初始化全选按钮方法开始
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
        //初始化全选按钮方法结束
        //删除模板结束
        function initData() {
            //获取左侧树开始
            getChannelTree($scope.roleData.ROLEID);
            //获取左侧树结束
            //获取从产品列表得到的产品数据开始
            getProductListData();
            //获取从产品列表得到的产品数据结束
            if ($scope.roleData === undefined) {
                SweetAlert.swal({
                    title: "错误提示",
                    text: "请选择角色！",
                    type: "warning",
                    closeOnConfirm: true,
                    cancelButtonText: "取消",
                });
                $state.go("manageconfig.rolemanage");
            }
            //监控角色切换开始
            $scope.$on("roleData", function(event, data) {
                $scope.roleData = data;
                getChannelTree($scope.roleData.ROLEID);
                delete $scope.rightClassify;
            });
            //监控角色切换结束
            //模板名称字数限制开始
            $scope.tempNameNum = 6;
            //模板名称字数限制结束
        }
        //获取从产品列表得到产品数据开始
        function getProductListData() {
            $scope.moduleName = "产品范围";
            /*$scope.siteDesc = productListData.siteDesc;
            $scope.moduleName = productListData.moduleName;
            $scope.mediaType = productListData.mediaType;
            $scope.siteId = productListData.siteId;
            $scope.classify = productListData.CLASSIFY;
            delete $scope.rightClassify;
            selecetedChanls = {};*/
        }
        //获取从产品列表得到产品数据结束
        //取消选择树节点开始
        function cancelSelectedNode() {
            delete $scope.perSelectedNode;
        }
        //取消选择树节点结束
    }]);
