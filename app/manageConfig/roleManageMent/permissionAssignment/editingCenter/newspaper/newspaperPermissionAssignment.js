/**
 * newspaperPermissionAssignment Module
 *
 * Description 报纸权限分配
 * Author:SMG 2016-6-7
 */
'use strict';
angular.module("newspaperPermissionAssignment", ["manageCfg.roleManageMent.permissionAssignment.productAndModule", "manageCfg.roleManageMent.permissionAssignment.SavePerModule"])
    .controller("newspaperPermissionAssignmentCtrl", ["$scope", "$timeout", "$state", "$modal", "$compile", "$element", "$q", "localStorageService", "trsHttpService", "SweetAlert", "trsconfirm", "permissionAssignmentService",
        function($scope, $timeout, $state, $modal, $compile, $element, $q, localStorageService, trsHttpService, SweetAlert, trsconfirm, permissionAssignmentService) {
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
                    return node.HASCHILDREN === "false";
                },
                dirSelectable: true,
                allowDeselect: false,
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
                    $scope.selectTemplate = $scope.templateList[0];
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
                    $scope.isPaper = true;
                    var paperRightParams = {
                        serviceid: "mlf_paperset",
                        methodname: "queryPaperRightClassify",
                        SiteId: $scope.siteId,
                        RoleId: $scope.roleData.ROLEID
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), paperRightParams, "post")
                        .then(function(data) {
                            $scope.pageIds = data.BMIDS === "" ? [] : data.BMIDS.split(",");
                        });
                });

            };
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
                var i = 0,
                    postRights = [];
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
                    "rights": postRightsString
                };
                if (postRights.length === 0) {
                    trsconfirm.alertType("您尚未设置权限", "您尚未设置权限", "error", false);
                    return;
                }
                $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                    var setBelongBanMianParams = { //分配版面参数开始
                        serviceid: "mlf_paperset",
                        methodname: "setBelongBanMian",
                        RoleId: $scope.roleData.ROLEID,
                        SiteId: $scope.siteId,
                        ChannelIds: $scope.pageIds.join(",")
                    };
                    if (false && ($scope.pageIds.length === 0 && $scope.isAuthorized($scope.perSelectedNode))) { //暂时禁止版面过滤
                        trsconfirm.alertType("请选择版面", "请选择版面", "error", false);
                    } else {
                        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), setBelongBanMianParams, "post").then(function(data) {
                            //保存成功后取消选择开始
                            //
                            //cancelSelectedNode();
                            //保存成功后取消选择结束
                            //保存成功后关闭原子权限开始
                            //delete $scope.rightClassify;
                            //保存成功后关闭原子权限结束
                            //清空原子权限数据开始
                            //selecetedChanls = {};
                            //清空原子权限数据结束
                            trsconfirm.alertType("保存权限成功", "", "success", false);
                        });
                    }
                    return;
                    trsconfirm.alertType("保存权限成功", "", "success", false);
                });
            };
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
                    }
                });
            }
            //获取树结束
            //获取报纸的树开始
            function getPaperChannelTree(siteId, roleId) {
                var deffer = $q.defer();
                getChannelTree(siteId, roleId, function(data) {
                    //如果是报纸的话，需要拆解点击产品得到的树
                    $scope.channelTree = angular.copy(data);
                    delete $scope.channelTree[0].CHILDREN;
                    $scope.channelTree[0].HASCHILDREN = "false";
                    //构造采编版面列表
                    var params = {
                        serviceid: "mlf_mediasite",
                        methodname: "getPaperChannelTree",
                        PaperId: $scope.siteId
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                        .then(function(data) {
                            $scope.pages = data;
                            deffer.resolve(data);
                        });
                });
                return deffer.promise;
            }
            //获取报纸的树结束
            //获取权限列表开始
            function queryRightClassify(classify, node) {
                var params = {
                    "serviceid": "mlf_extrole",
                    "methodname": "queryRightClassify",
                    "Classify": classify,
                    "SiteId": $scope.siteId
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
                $scope.selectTemplate = $scope.templateList[0];
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
                        $scope.loadingPromise = trsHttpService.httpServer("/wcm/mlfcenter.do", params, "get").then(function(data) {
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
                    $scope.selectTemplate = $scope.templateList[0];
                    getPaperChannelTree($scope.siteId, $scope.roleData.ROLEID).then(function(data) {
                        $scope.cTshowSelected($scope.channelTree[0]);
                        $scope.perSelectedNode = $scope.channelTree[0];
                    });
                    $scope.isPaper = true; //加载报纸原子权限模板标识
                    delete $scope.rightClassify;
                });
                //监控左边选择角色是否变动
                //获取原子权限模板开始
                loadPerTemplate();
                //获取原子权限模板结束
                //监控保存模板是否成功开始
                $scope.$on("savaPerSuccess", function(event, data) {
                    loadPerTemplate();
                });
                //监控保存模版是否成功结束
                //模板名称字数限制开始
                $scope.tempNameNum = 6;
                //模板名称字数限制结束
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
                getPaperChannelTree($scope.siteId, $scope.roleData.ROLEID).then(function(data) {
                    $scope.perSelectedNode = $scope.channelTree[0];
                    $scope.cTshowSelected($scope.channelTree[0]);
                });
            }
            //获取从产品列表得到产品数据结束
            //取消选择树节点开始
            function cancelSelectedNode() {
                delete $scope.perSelectedNode;
            }
            //取消选择树节点结束
        }
    ]);
