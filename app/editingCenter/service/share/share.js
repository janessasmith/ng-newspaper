"use strict";
angular.module('shareModule', []).
controller('shareCtrl', shareCtrl);
shareCtrl.inject = ["$scope", "$timeout", "$modalInstance", "trsHttpService", "SweetAlert", "trsResponseHandle", "trsspliceString", "trsconfirm"];

function shareCtrl($scope, $timeout, $modalInstance, trsHttpService, SweetAlert, trsResponseHandle, trsspliceString, trsconfirm) {
    init();
    //弹窗初始化
    $scope.showSelected = function(node) {
        $timeout(function() {
                //此判断如果两次点击同一个树，不重复加载角色列表。
                if ($scope.oldSelectNode !== undefined && node.GROUPID == $scope.oldSelectNode.GROUPID) {
                    return;
                }
                $scope.groupObj = node;
                $scope.oldSelectNode = node;
                $scope.Datas = [];
                $scope.userData = null;
                var params = {
                    "serviceid": "mlf_group",
                    "methodname": "getUsersByGroup",
                    "GroupId": $scope.groupObj.GROUPID
                };
                //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.userDatas = trsResponseHandle.responseHandle(data, false);
                    if (!angular.isDefined(node.CHILDREN) || node.CHILDREN.length === 0) {
                        childrenTree(node, function() {
                            $scope.userDatas = $scope.userDatas.concat(node.CHILDREN);
                        });
                    } else {
                        $scope.userDatas = $scope.userDatas.concat(node.CHILDREN);
                    }
                });
            },
            100);
    };
    $scope.showToggle = function(node) {
        if (node.HASCHILDREN === "true" && (!angular.isDefined(node.CHILDREN)) || node.CHILDREN.length === 0) {
            childrenTree(node, function() {});
        }
    };
    /**
     * [selectedAll description] 全选
     * @return {[type]} [description] null
     */
    $scope.selectedAll = function() {
        angular.forEach($scope.userDatas, function(data, index, array) {
            delete data.selected;
            if (angular.isDefined(data.OBJID)) {
                data.ID = data.OBJID;
                data.DESC = data.GNAME;
                data.OPERTYPE = data.OBJTYPE;
            } else {
                data.DESC = data.USERNAME;
                /*if (angular.isUndefined(data.OBJTYPE)) {
                    data.OPERTYPE = data.TYPE;
                }*/
            }
            $scope.itemsSd = contrast([angular.copy(data)], angular.copy($scope.itemsSd), "ID", "OPERTYPE");
            $scope.userDatas[index].selected = false;
            if ($scope.selectedUser.indexOf(data.ID) < 0) {
                $scope.selectedUser.push(data.ID);
            }
        });
    };
    $scope.close = function() {
        $modalInstance.dismiss();
    };
    //输入过滤器
    $scope.myFilter = function(expected, actual) {
        var flag = true;
        if ($scope.searchWordLeft !== "" && angular.isDefined($scope.searchWordLeft)) {
            if (angular.isDefined(expected.USERNAME)) {
                flag = expected.USERNAME.indexOf($scope.searchWordLeft) >= 0 ? true : false;
            } else {
                flag = expected.GNAME.indexOf($scope.searchWordLeft) >= 0 ? true : false;
            }
        }
        return flag;
    };
    //输入过滤器
    $scope.toRight = function() {
        angular.forEach($scope.userDatas, function(data, index, array) {
            if (angular.isDefined(data.OBJID)) {
                data.ID = data.OBJID;
                data.DESC = data.GNAME;
                data.OPERTYPE = data.OBJTYPE;
            } else {
                data.DESC = data.USERNAME;
                /*if (angular.isUndefined(data.OBJTYPE)) {
                    data.OPERTYPE = data.TYPE;
                }*/
            }
            if (data.selected === true) {
                delete data.selected;
                $scope.itemsSd = contrast([angular.copy(data)], angular.copy($scope.itemsSd), "ID", "OPERTYPE");
                $scope.userDatas[index].selected = false;
                $scope.selectedUser.push(data.ID);
            }
        });
    };
    //双击选择开始
    $scope.directlyToRight = function(user) {
        if (angular.isDefined(user.OBJID)) {
            user.ID = user.OBJID;
            user.DESC = user.GNAME;
            user.OPERTYPE = user.OBJTYPE;
        } else {
            user.DESC = user.USERNAME;
        }
        $scope.selectedUser.push(user.ID);
        $scope.itemsSd = contrast([angular.copy(user)], $scope.itemsSd, "ID", "OPERTYPE");
    };
    //双击选择结束
    //双击取消选择开始
    $scope.directlyToLeft = function(user) {
        removeList([user], $scope.itemsSd, "ID", "OPERTYPE", function(data) {
            $scope.itemsSd = data;
        });
    };
    //双击取消选择结束
    $scope.toLeft = function() {
        var toRemoveList = [];
        angular.forEach($scope.itemsSd, function(data, index, array) {
            if (angular.isDefined(data.selected) && data.selected === true) {
                toRemoveList.push(data);
                $scope.selectedUser.splice($scope.selectedUser.indexOf(data.ID), 1);
            }
        });
        removeList(toRemoveList, $scope.itemsSd, "ID", "OPERTYPE", function(data) {
            $scope.itemsSd = data;
        });
    };
    //提交共享开始
    $scope.shareSubmit = function() {
        var shareToCats = "";
        angular.forEach($scope.mClassSelected, function(value, key) {
            shareToCats += (key + ",");
        });
        var ShareToObjs = "";
        shareToCats = shareToCats.substring(0, shareToCats.length - 1);
        if ($scope.selectedRange === $scope.unifiedFeeds) {
            //统一供稿处理
            ShareToObjs = "[{}]";
        } else if ($scope.selectedRange === $scope.otherShare) {
            ShareToObjs = JSON.stringify(packagingShareObj($scope.itemsSd, []));
        } else if ($scope.selectedRange !== null) {
            var selectedRange = angular.copy($scope.selectedRange);
            selectedRange.OPERIDS = selectedRange.ID;
            delete selectedRange.RANGENAME;
            delete selectedRange.DESC;
            delete selectedRange.ID;
            ShareToObjs = JSON.stringify([selectedRange]);
        }
        if (shareToCats === "") {
            trsconfirm.alertType("共享失败", "请选择稿件分类", "error", false);
        } else if (ShareToObjs === '') {
            trsconfirm.alertType("共享失败", "请选择共享范围", "error", false);
        } else {
            $modalInstance.close({
                "shareToCats": shareToCats,
                "ShareToObjs": ShareToObjs
            });
        }
    };
    //提交共享结束
    //选择分类开始
    $scope.selectMClass = function(item) {
        if (!angular.isDefined($scope.mClassSelected[item.METACATEGORYID])) {
            $scope.mClassSelected[item.METACATEGORYID] = item;
            if ($scope.selectedRange === null) {
                $scope.selectedRange = $scope.unifiedFeeds;
            }
        } else {
            delete $scope.mClassSelected[item.METACATEGORYID];
        }
    };
    //选择范围
    $scope.selectRange = function(range) {
        if ($scope.selectedRange === range) {
            $scope.selectedRange = null;
        } else {
            $scope.selectedRange = range;
        }
    };
    //选择模板开始
    $scope.selectTemplate = function(item) {
        if (angular.isDefined($scope.selectedTemplate) && $scope.selectedTemplate.SHARETEMPLATEID === item.SHARETEMPLATEID) {
            $scope.selectedTemplate = {};
            $scope.itemsSd = [];
        } else {
            $scope.selectedTemplate = item;
            $scope.selectedRange = $scope.otherShare;
            var params = {
                serviceid: "mlf_releaseSource",
                methodname: "getShareObjsByTemplate",
                ShareTemplateId: item.SHARETEMPLATEID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    $scope.itemsSd = data;
                });
        }
    };
    //删除常用模板
    $scope.deleteTemplate = function(item) {
        trsconfirm.confirmModel("您确定要删除?", "您确定要删除?", function() {
            var params = {
                serviceid: "mlf_releaseSource",
                methodname: "delShareTemplate",
                ShareTemplateId: item.SHARETEMPLATEID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    getShareTemplate();
                });
        });
    };
    $scope.saveAsTemplate = function() {
        if (angular.isDefined($scope.itemsSd) && $scope.itemsSd.length !== 0) {
            trsconfirm.typingModel("常用模板名称", angular.isDefined($scope.selectedTemplate) && $scope.selectedTemplate !== {} ? $scope.selectedTemplate.SHARETEMPLATENAME : '', function(data) {
                var params = {
                    serviceid: "mlf_releaseSource",
                    methodname: "saveShareTemplate",
                    ShareTemplateName: data,
                    ShareTemplateId: angular.isDefined($scope.selectedTemplate) && $scope.selectedTemplate !== {} ? parseInt($scope.selectedTemplate.SHARETEMPLATEID) : 0,
                    ShareTemplateValue: JSON.stringify(packagingShareObj($scope.itemsSd, []))
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(data) {
                        trsconfirm.alertType("保存常用模板成功", "", "success", false, function() {
                            getShareTemplate();
                        });
                    });
            });
        } else {
            trsconfirm.alertType("请选择部门或人员", "请选择部门或人员", "warning", false, function() {});
        }
    };
    //获取稿件分类开始
    function getMClassification() {
        var params = {
            serviceid: "mlf_releaseSource",
            methodname: "queryMetaCategorysOfIwo",
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
            .then(function(data) {
                $scope.mClassification = data;
            });
    }
    //获取当前用户的共享模板
    function getShareTemplate() {
        var params = {
            serviceid: "mlf_releaseSource",
            methodname: "queryShareTemplates",
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
            .then(function(data) {
                $scope.shareTemplateList = data;
            });
    }
    //获取稿件分类结束
    function toLeft(item, success) {
        if (item !== "" && item !== undefined) {
            removeList([item], $scope.itemsSd, "ID", "OPERTYPE", function(data) {
                $scope.itemsSd = data;
            });
            success();
        }
        item = "";
    }
    //获取共享范围喀什
    function getRange() {
        var params = {
            serviceid: "mlf_releaseSource",
            methodname: "getShareRange",
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
            .then(function(data) {
                $scope.shareRange = data;
            });
    }
    //组装shareObj
    function packagingShareObj(itemsSd, ShareToObjs) {
        angular.forEach(itemsSd, function(data, index, array) {
            var flag = true;
            angular.forEach(ShareToObjs, function(dataC, indexC, arrayC) {
                if (dataC.OPERTYPE !== undefined && dataC.OPERTYPE === data.OPERTYPE) {
                    flag = false;
                }
            });
            if (flag) {
                ShareToObjs.push({
                    "OPERTYPE": data.OPERTYPE,
                    "OPERIDS": trsspliceString.spliceString(itemsSd, "ID", ",", "OPERTYPE", data.OPERTYPE)
                });
            }
        });
        return ShareToObjs;
    }

    function init() {
        //组织树配置文件
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
                labelSelected: "a8"
            },
            isLeaf: function(node) {
                return node.HASCHILDREN == "false";
            }
        };
        var treeParams = {
            "serviceid": "mlf_group",
            "methodname": "queryGroupTreeWithOutRight"
        };
        //获取没有权限的组织树
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), treeParams, "get").then(function(data) {
            $scope.treedata = [data];
            ExpandedNodes();
        }, function(data) {});
        $scope.itemsSd = [];
        //初始化稿件分类已选数组
        $scope.mClassSelected = {};
        //初始化最近记录限制
        $scope.limitRecordNum = 6;
        //初始化共享范围开始
        $scope.selectedRange = null;
        //已进入选择栏的用户id
        $scope.selectedUser = [];
        //初始化统一供稿标识状态；
        $scope.unifiedFeeds = {
            unifiedFeeds: ""
        };
        //初始化其他共享标识状态
        $scope.otherShare = {
            otherShare: ""
        };
        //获取稿件分类列表
        getMClassification();
        //获取共享模板
        getShareTemplate();
        //获取共享范围
        getRange();
    }

    function childrenTree(node, callback) {
        var paramsT = {
            "serviceid": "mlf_group",
            "methodname": "queryChildGroupsWithOutRight",
            "GroupId": node.GROUPID
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), paramsT, "get").then(function(dataC) {
            node.CHILDREN = dataC.CHILDREN;
            if (angular.isFunction(callback)) {
                callback();
            }
        });
    }
    //对比是否重复开始
    function contrast(array1, array2, attribute, _attribute) {
        angular.forEach(array1, function(data, index, array) {
            var flag = true;
            angular.forEach(array2, function(_data, _index, _array) {
                if (data[attribute] === _data[attribute] && data[_attribute] === _data[_attribute]) {
                    flag = false;
                }
            });
            if (flag) {
                array2.push(data);
            }
        });
        return array2;
    }
    //对比是否重复结束
    function removeList(array1, array2, attribute, _attribute, success) {
        angular.forEach(array1, function(data, index, array) {
            var i = 0;
            while (i < array2.length) {
                if (data[attribute] === array2[i][attribute] && data[_attribute] === array2[i][_attribute]) {
                    array2.splice(i, 1);
                } else {
                    i++;
                }
            }
        });
        success(array2);
    }
    //默认展开树开始
    function ExpandedNodes() {
        $scope.expandedTest = [];
        $scope.expandedTest.push($scope.treedata[0]);
        /*if ($scope.treedata[0].CHILDREN === 0) {
            $scope.selectedNode = $scope.treedata[0];
            getGroupData($scope.selectedNode);
        } else {
            angular.forEach($scope.treedata[0].CHILDREN, function(data, index, array) {
                if (data.ISPATH === "true") {
                    $scope.expandedTest.push(data);
                    if (data.CHILDREN.length !== 0) {
                        selfPath(data);
                    } else {
                        $scope.selectedNode = data;
                        getGroupData($scope.selectedNode);
                    }

                }
            });
        }*/
    }

    function getGroupData(node) {
        $timeout(function() {
                $scope.groupObj = node;
                var params = {
                    "serviceid": "mlf_group",
                    "methodname": "getUsersByGroup",
                    "GroupId": $scope.groupObj.GROUPID
                };
                //trsHttpService.httpServer("./manageConfig/data/roledata_" + $scope.groupObj.id + ".json", params, "get").then(function(data) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.userDatas = data;
                    if (!angular.isDefined($scope.selectedNode.CHILDREN) || $scope.selectedNode.CHILDREN.length === 0) {
                        childrenTree($scope.selectedNode, function() {
                            $scope.userDatas = $scope.userDatas.concat($scope.selectedNode.CHILDREN);
                        });
                    } else {
                        $scope.userDatas = $scope.userDatas.concat($scope.selectedNode.CHILDREN);
                    }
                });
            },
            100);
    }

    function selfPath(data) {
        if (data.CHILDREN[0].ISPATH === "true") {
            if (data.CHILDREN[0].HASCHILDREN === "false" || data.CHILDREN[0].CHILDREN.length === 0) {
                $scope.selectedNode = data.CHILDREN[0];
                getGroupData($scope.selectedNode);
            } else {
                $scope.expandedTest.push(data.CHILDREN[0]);
                selfPath(data.CHILDREN[0]);
            }
        }
    }
    $scope.getSuggestions = function(viewValue) {
        var searchUsers = {
            serviceid: "mlf_extuser",
            methodname: "searchUserOrDept",
            Name: viewValue
        };
        if (viewValue !== '') {
            if ($scope.isRequest) {
                $scope.isRequest = false;
                return [];
            } else {
                return trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), searchUsers, "post").then(function(data) {
                    return data;
                });
            }
        }
    };
    $scope.$watch('searchWord', function(newValue, oldValue, scope) {
        if (angular.isObject(newValue)) {
            var flag = true;
            angular.forEach($scope.itemsSd, function(data, index, array) {
                if (data.ID === newValue.ID) {
                    flag = false;
                }
            });
            if (flag) {
                $scope.isRequest = true;
                newValue.OPERTYPE = newValue.TYPE;
                newValue.DESC = newValue.GNAME || newValue.USERNAME;
                $scope.itemsSd.push(newValue);
            }
            $scope.searchWord = newValue.USERNAME || newValue.GNAME;
        }
    });
}
