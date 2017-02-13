/**
 * websitePermissionAssignment Module
 *
 * Description 网站权限分配
 * Author:SMG 2016-6-7
 */
'use strict';
angular.module("websitePermissionAssignment", ["manageCfg.roleManageMent.permissionAssignment.productAndModule", "manageCfg.roleManageMent.permissionAssignment.SavePerModule"])
    .controller("websitePermissionAssignmentCtrl", ["$scope", "$timeout", "$state", "$modal", "$compile", "$element", "$q", "localStorageService", "trsHttpService", "SweetAlert", "trsconfirm", "permissionAssignmentService",
        function($scope, $timeout, $state, $modal, $compile, $element, $q, localStorageService, trsHttpService, SweetAlert, trsconfirm, permissionAssignmentService) {
            //声明将要保存权限的数组对象开始
            var selecetedChanls = {};
            //声明将要保存权限的数组对象结束
            initStatus();
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
                    return node.HASCHILDREN === "false";
                },
                dirSelectable: true,
                allowDeselect: false,
            };
            //展开树操作
            $scope.showToggle = function(node) {
                if (angular.isDefined(node.CHILDREN) && node.HASCHILDREN === "true" && node.CHILDREN.length === 0) {
                    var params = {
                        serviceid: "mlf_website",
                        methodname: "queryChildChannels",
                        ChannelId: node.CHANNELID,
                        RoleId: $scope.roleData.ROLEID
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                        .then(function(data) {
                            node.CHILDREN = data.CHILDREN;
                        });
                }
            };
            /**
             * [isAuthorized description]判断是否已赋权，渲染左侧树节点
             * @return boolean [description]
             */
            $scope.isAuthorized = function(node) {
                var flag = false;
                if (angular.isDefined(node.RIGHTINDEX)) {
                    var rightIndexs = node.RIGHTINDEX.split(",");
                    for (var i = 0; i < rightIndexs.length; i++) {
                        if (node.RIGHTVALUE[parseInt(rightIndexs[i].replace(/\"/g, "")) - 1] === "1") {
                            flag = true;
                        }
                    }
                }
                return flag;
            };
            $scope.cTshowSelected = function(sel) {
                permissionAssignmentService.initGroupRight(sel, $scope.roleData.ROLEID).then(function(data) {
                    sel.RIGHTID = data; //data;
                    delete $scope.rightClassify;
                    //模板选项恢复默认开始
                    if (angular.isDefined($scope.templateList)) $scope.selectTemplate = $scope.templateList[0];
                    //模板选项恢复默认结束
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
                    queryRightClassify($scope.classify, sel);
                    updateBatPermissionAssignment();
                });

            };
            //批量授权开始
            $scope.batPermissionAssignment = function(node) {
                if (angular.isUndefined($scope.perSelectedNode.CHANNELID)) {
                    trsconfirm.alertType("站点不允许批量授权", "", "warning", false);
                    return;
                }
                if (angular.isUndefined($scope.rightClassify)) {
                    trsconfirm.alertType("请先选择要授权的节点", "", "warning", false);
                    return;
                }
                if (angular.isDefined($scope.batSetChanls[node.OBJID])) {
                    delete $scope.batSetChanls[node.OBJID];
                    return;
                }
                $scope.batSetChanls[$scope.authorSelectedNode.OBJID] = {
                    ID: parseInt($scope.authorSelectedNode.RIGHTID),
                    OPRTYPE: 203,
                    OPRID: parseInt($scope.roleData.ROLEID),
                    OBJTYPE: parseInt($scope.authorSelectedNode.OBJTYPE),
                    OBJID: parseInt($scope.authorSelectedNode.OBJID),
                    NEWVALUE: $scope.authorSelectedNode.RIGHTVALUE
                };
                permissionAssignmentService.initGroupRight(node, $scope.roleData.ROLEID).then(function(data) {
                    $scope.batSetObj = {
                        ID: parseInt(data),
                        OPRTYPE: 203,
                        OPRID: parseInt($scope.roleData.ROLEID),
                        OBJTYPE: parseInt(node.OBJTYPE),
                        OBJID: parseInt(node.OBJID),
                        NEWVALUE: $scope.authorSelectedNode.RIGHTVALUE
                    };
                    updateBatPermissionAssignment();
                    $scope.batSetChanls[node.OBJID] = $scope.batSetObj;
                });
            };
            //批量授权结束
            //监控授权操作给批量对象赋值
            $scope.$watch("authorSelectedNode.RIGHTVALUE", function(newValue, oldValue) {
                updateBatPermissionAssignment();
            });
            //监控授权操作给批量对象赋值
            //更新批量授权开始
            function updateBatPermissionAssignment() {
                for (var i in $scope.batSetChanls) {
                    $scope.batSetChanls[i].NEWVALUE = $scope.authorSelectedNode.RIGHTVALUE;
                }
            }
            //更新批量授权结束
            //处理节点名称，用于应对不同模块类型节点名称显示
            $scope.getNodeDesc = function(node) {
                return angular.isDefined(node.MODALDESC) ? node.MODALDESC : (angular.isDefined(node.SITEDESC) ? node.SITEDESC : node.CHNLDESC);
            };
            $scope.SavePermissions = function() {
                var savePermissions = $modal.open({
                    templateUrl: "./manageConfig/roleManageMent/permissionAssignment/service/SavePerModule/SavePerModule.html",
                    scope: $scope,
                    windowClass: 'manageSavePerTemp',
                    backdrop: false,
                    controller: "SavePerModuleController"
                });
            };
            //保存权限开始
            $scope.save = function() {
                if ($scope.status.isToChildren) {
                    toChildrenSave();
                } else {
                    commonSave();
                }
            };
            //普通保存权限
            function commonSave() {
                var i = 0,
                    postRights = [];
                concatPermission();
                for (var key in selecetedChanls) {
                    postRights.push(angular.copy(selecetedChanls[key]));
                    postRights[i].NEWVALUE = angular.isArray(postRights[i].NEWVALUE) ? postRights[i].NEWVALUE.join("") : postRights[i].NEWVALUE;
                    i++;
                }
                var postRightsString = JSON.stringify(postRights);
                var params = {
                    "serviceid": "mlf_extrole",
                    "methodname": "saveRight",
                    "RoleId": $scope.roleData.ROLEID,
                    "IsSynchronize": "false",
                    "rights": postRightsString
                };
                if (postRights.length === 0) {
                    trsconfirm.alertType("您尚未设置权限", "您尚未设置权限", "error", false);
                    return;
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("保存权限成功", "", "success", false);
                    $scope.batSetChanls = {};
                    delete $scope.authorSelectedNode;
                    delete $scope.rightClassify;
                    getChannelTree($scope.siteId, $scope.roleData.ROLEID);
                });
            }
            //递归保存权限
            function toChildrenSave() {
                if (angular.isUndefined($scope.perSelectedNode.CHANNELID)) {
                    trsconfirm.alertType("站点不能对子节点进行权限传递", "", "warning", false);
                    return;
                }
                var params = {
                    "serviceid": "mlf_extrole",
                    "methodname": "saveRight",
                    "RoleId": $scope.roleData.ROLEID,
                    "IsSynchronize": "true",
                    "rights": JSON.stringify([{
                        "ID": parseInt($scope.perSelectedNode.RIGHTID),
                        "OPRTYPE": 203,
                        "OPRID": parseInt($scope.roleData.ROLEID),
                        "OBJTYPE": parseInt($scope.perSelectedNode.OBJTYPE),
                        "OBJID": parseInt($scope.perSelectedNode.OBJID),
                        "NEWVALUE": angular.isArray($scope.perSelectedNode.RIGHTVALUE) ? $scope.perSelectedNode.RIGHTVALUE.join("") : $scope.perSelectedNode.RIGHTVALUE
                    }])
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    trsconfirm.alertType("保存权限成功", "", "success", false);
                    $scope.batSetChanls = {};
                    delete $scope.perSelectedNode;
                    delete $scope.rightClassify;
                    getChannelTree($scope.siteId, $scope.roleData.ROLEID);
                });
            }
            //合并批量授权和普通授权开始
            function concatPermission() {
                for (var i in $scope.batSetChanls) {
                    selecetedChanls[i] = $scope.batSetChanls[i];
                }
            }
            //合并批量授权和普通授权结束
            //保存权限结束
            //获取树开始
            function getChannelTree(siteId, roleId, callback) {
                var params = {
                    "serviceid": "mlf_website",
                    "methodname": "queryChannelTree",
                    "SiteId": siteId,
                    "RoleId": roleId
                };
                $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
                    if (angular.isFunction(callback)) {
                        callback(data);
                    } else {
                        $scope.channelTree = data;
                        $scope.perSelectedNode = $scope.channelTree[0];
                        $scope.cTshowSelected($scope.channelTree[0]);
                        $scope.expandedNodes = [$scope.channelTree[0]];
                    }
                });
            }
            //获取树结束
            //获取权限列表开始
            function queryRightClassify(classify, node) {
                var params = {
                    "serviceid": "mlf_extrole",
                    "methodname": "queryRightClassify",
                    "Classify": classify
                };
                if (!angular.isDefined(node.CHANNELID)) {
                    params.Classify = "website";
                }
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
            //获取权限模板列表开始
            function loadPerTemplate() {
                var paramsTemp = {
                    "serviceid": "mlf_righttemplate",
                    "methodname": "queryRightTemplate",
                };
                $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", paramsTemp, "get").then(function(data) {
                    $scope.templateList = data;
                    $scope.templateList.splice(0, 0, {
                        "RIGHTTEMPLATENAME": "原子权限模板"
                    });
                }, function(data) {

                });
            }
            //获取权限模板列表结束
            //初始化权限模板列表开始
            $timeout(function() {
                //$scope.selectTemplate = $scope.templateList[0];
                $scope.ifSelected = false;
                $scope.ifSelect = function() {
                    if (!$scope.ifSelected) {
                        $scope.ifSelected = true;
                    } else {
                        $scope.ifSelected = false;
                    }
                };
            }, 500);
            //初始化权限模板列表结束
            //选择模板开始
            $scope.selectTemplateFn = function(index) {
                if ($scope.authorSelectedNode === undefined) {
                    SweetAlert.swal({
                        title: "提示信息",
                        text: "请选择栏目",
                        type: "warning",
                        closeOnConfirm: true,
                        cancelButtonText: "确定",
                    });
                    $scope.ifSelected = false;
                    return;
                }
                $scope.selectTemplate = $scope.templateList[index];
                if (!angular.isArray($scope.selectTemplate.NEWVALUE) && $scope.selectTemplate.NEWVALUE !== undefined) {
                    $scope.authorSelectedNode.RIGHTVALUE = $scope.selectTemplate.NEWVALUE.split("");
                    $scope.authorSelectedNode.HASSED = $scope.authorSelectedNode.RIGHTVALUE.indexOf("1") > -1 ? true : false;

                    var tempObj = {
                        "ID": parseInt($scope.authorSelectedNode.RIGHTID),
                        "OPRTYPE": 203,
                        "OPRID": parseInt($scope.roleData.ROLEID),
                        "OBJTYPE": parseInt($scope.authorSelectedNode.OBJTYPE),
                        "OBJID": parseInt($scope.authorSelectedNode.OBJID),
                        "NEWVALUE": $scope.authorSelectedNode.RIGHTVALUE
                    };
                    selecetedChanls[$scope.authorSelectedNode.OBJID] = tempObj;
                    //全选按钮初始化开始

                    $scope.initSelectAll();
                    //全选按钮初始化结束
                }
                $scope.ifSelected = false;
            };
            //选择模板结束
            //删除模板开始
            $scope.deleteTemplate = function(index) {
                var params = {
                    "serviceid": "mlf_righttemplate",
                    "methodname": "deleteRightTemplate",
                    "tempId": $scope.templateList[index].RIGHTTEMPLATEID
                };
                SweetAlert.swal({
                    title: "你确定删除模板" + $scope.templateList[index].RIGHTTEMPLATENAME + "么？",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: true
                }, function(isConfirm) {
                    if (isConfirm) {
                        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                            if (data.status == "-1") {
                                SweetAlert.swal({
                                    title: "提示信息",
                                    text: data.message,
                                    type: "warning",
                                    closeOnConfirm: true,
                                    cancelButtonText: "确定",
                                });
                                return;
                            }
                            $scope.templateList.splice(index, 1);
                            $scope.ifSelected = false;
                        }, function(data) {
                            SweetAlert.swal({
                                title: "请求失败",
                                text: "请检查网络",
                                type: "warning",
                                closeOnConfirm: true,
                                cancelButtonText: "确定",
                            });
                        });
                    }

                });
            };
            //删除模板结束
            function initData() {
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
                //监控左边选择角色是否变动
                $scope.$on("roleData", function(event, roleData) {
                    $scope.roleData = roleData;
                    selecetedChanls = {};
                    $scope.batSetChanls = {};
                    //$scope.selectTemplate = $scope.templateList[0];
                    getChannelTree($scope.siteId, $scope.roleData.ROLEID);
                    delete $scope.rightClassify;
                });
                //监控保存模板是否成功开始
                $scope.$on("savaPerSuccess", function(event, data) {
                    loadPerTemplate();
                });
                //监控保存模版是否成功结束
                //模板名称字数限制开始
                $scope.tempNameNum = 6;
                //模板名称字数限制结束
                //批量设置权限对象初始化开始
                $scope.batSetChanls = {};
                //批量设置权限对象初始化结束
                $scope.batSetObj = {};
            }
            //获取从产品列表得到产品数据开始
            function getProductListData() {
                var productListData = localStorageService.get("setEditingCenterPermission");
                $scope.siteDesc = productListData.siteDesc;
                $scope.moduleName = productListData.moduleName;
                $scope.mediaType = productListData.mediaType;
                $scope.siteId = productListData.siteId;
                $scope.classify = productListData.CLASSIFY;
                delete $scope.rightClassify;
                selecetedChanls = {};
                getChannelTree($scope.siteId, $scope.roleData.ROLEID);
                $scope.isPaper = true;
            }
            //获取从产品列表得到产品数据结束
            //取消选择树节点开始
            function cancelSelectedNode() {
                delete $scope.perSelectedNode;
            }
            //取消选择树节点结束
            //初始化状态
            function initStatus() {
                $scope.status = {
                    isToChildren: false //是否向子栏目传递权限
                };
            }
            //设置是否向子传递权限
            $scope.setToChildren = function() {
                $scope.status.isToChildren = !$scope.status.isToChildren;
            };
        }
    ]);
