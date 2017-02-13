"use strict";
/**
 *  Module  退稿模板
 *  createBy  CC
 * Description  2016-1-12
 */
angular.module('editNewspaperRejectionModule', []).controller('editNewspaperRejectionCtrl', ['$scope', '$q', '$modalInstance', '$timeout', '$filter', 'initSingleSelecet', 'trsHttpService', "trsconfirm", "params", "editingCenterService", "trsspliceString", "globleParamsSet", function($scope, $q, $modalInstance, $timeout, $filter, initSingleSelecet, trsHttpService, trsconfirm, params, editingCenterService, trsspliceString, globleParamsSet) {
    initStatus();
    initData();

    function initStatus() {
        $scope.params = {
            serviceid: "mlf_paper",
            PaperId: params.PaperId
        };
        $scope.status = {
            selectedUser: "",
            isManusCorrShow: false,
            hasNoManusCorr: false,
            clickCurrItem: "",
            selectedType: "0",
            treeOptions: {
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
            },
            draftFrom: {
                29: "归档稿",
                30: "今日稿",
                31: "待用稿",
                32: "今日稿",
                33: "今日稿",
                34: "上版稿",
                35: "已签稿",
                36: "已签稿",
                37: "已签稿",
                38: "已签稿"
            },
            isRequest: false,
        };
        $scope.data = {
            items: angular.copy(params.item),
            opinion: "",
            rejectionTypes: initSingleSelecet.radioOfRejection(),
            selectedArray: [],
        };
    }

    function initData() {
        getHandlers();
        if ($scope.status.selectedType == 1) {
            getMediaAndPerson();
        }
        if ($scope.data.items.length > 1) {
            $scope.status.selectedType = "2";
        }
    }
    /**
     * [getMediaAndPerson description]获得媒体跟人员列表
     * @return {[type]} [description]
     */
    function getMediaAndPerson() {
        var params = {
            serviceid: "mlf_group",
            methodName: "queryGroupTreeWithMyPath",
        };
        requestData(params).then(function(data) {
            $scope.treedata = [data];
            expandedNodes();
        });
    }
    /**
     * [manuscriptCorrelationData description]获得关联稿件
     * @return {[type]} [description]
     */
    function manuscriptCorrelationData(item) {
        var methodnameObj = {
            29: "queryReleteDocsInGuiDang",
            30: "queryRelateDocsInJinRi",
            31: "queryRelateDocsInDaiYong",
            32: "queryRelateDocsInJinRi",
            33: "queryRelateDocsInJinRi",
            34: "queryRelateDocsInShangBan",
            35: "queryReleteDocsInYiQianFa",
            36: "queryReleteDocsInYiQianFa",
            37: "queryReleteDocsInYiQianFa",
            38: "queryReleteDocsInYiQianFa"
        };
        $scope.params.methodname = methodnameObj[item.DOCSTATUS];
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
            $scope.data.relationDraft = data;
            $scope.status.hasNoManusCorr = data == "" ? true : false;
        });
    }
    /**
     * [requestData description]数据请求函数
     * @param  {[obj]} params [description]请求参数
     * @return {[obj]}        [description]请求返回值
     */
    function requestData(params) {
        var deffered = $q.defer();
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            deffered.resolve(data);
        });
        return deffered.promise;
    }
    //默认展开树开始
    function expandedNodes() {
        $scope.expandedTest = [];
        $scope.expandedTest.push($scope.treedata[0]);
        if ($scope.treedata[0].CHILDREN === 0) {
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
        }
    }
    //获取用户信息
    function getGroupData(node) {
        var params = {
            "serviceid": "mlf_group",
            "methodname": "getUsersByGroup",
            "GroupId": node.GROUPID
        };
        requestData(params).then(function(data) {
            if (data.status !== undefined && data.status == "-1") {
                trsconfirm.alertType("错误提示", "获取用户失败", "warning", false, function() {});
            } else {
                $scope.users = data;
                angular.forEach($scope.users, function(data, index, array) {
                    $scope.users[index].GROUPID = node.GROUPID;
                });
            }
        });
    }
    //获取路径
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
    /**
     * [getHandlers description]获得经手人
     * @return {[type]} [description]
     */
    function getHandlers() {
        if ($scope.status.selectedType == 1) {
            getMediaAndPerson();
        }
        if ($scope.status.selectedType == 0) {
            var editParams = {
                serviceid: "mlf_paper",
                methodname: "queryEditFlowGroupPath",
                MetaDataId: $scope.data.items[0].METADATAID
            };
            requestData(editParams).then(function(data) {
                $scope.editInfos = data;
            });

        }
    }
    $scope.ManusCorrToggle = function(item) {
        if ($scope.status.clickCurrItem == "" || $scope.status.clickCurrItem != item.METADATAID) {
            $scope.status.clickCurrItem = item.METADATAID;
            $scope.status.isManusCorrShow = true;
        } else if ($scope.status.clickCurrItem == item.METADATAID) {
            $scope.status.clickCurrItem = "";
            $scope.status.isManusCorrShow = false;
        }
        $scope.params.SrcDocId = item.METADATAID;
        manuscriptCorrelationData(item);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
    /**
     * [errorMessage description]检测退稿时的操作错误并给出提示
     * @return {[str]} [description]返回提示语
     */
    function errorMessage() {
        var message = "";
        if ($scope.data.items.length === 0) {
            message = "稿件数量为零，请选择稿件后退稿";
        } else if ($scope.status.selectedType != '2' && $scope.status.selectedUser == '') {
            message = "请选择退回人";
        }
        if (message !== "") {
            trsconfirm.alertType('退稿失败', message, "error");
        }
        return message;
    }
    $scope.confirm = function() {
        var message = errorMessage();
        if (message === "") {
            $scope.status.isManusCorrShow = false;
            var rejectionParams = {
                serviceid: "mlf_paper",
                methodname: params.rejecectionMethod,
                userId: $scope.status.selectedUser.ID,
                GroupId: $scope.status.selectedUser.GROUPID,
                RejectionType: $scope.status.selectedType,
                option: $scope.data.opinion,
                metaDataIds: trsspliceString.spliceString($scope.data.items,
                    'METADATAID', ','),
            };
            rejectionParams.SrcBanMianIds = angular.isDefined($scope.data.items[0].CHNLID) ? trsspliceString.spliceString($scope.data.items, "CHNLID", ",") : trsspliceString.spliceString($scope.data.items, "CHANNELID", ",");
            if (parseInt(rejectionParams.RejectionType) == 0) {
                rejectionParams.RejectionType = parseInt(rejectionParams.RejectionType) + 1;
            }
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), rejectionParams, "get").then(function(data) {
                trsconfirm.multiReportsAlert(data, function() {
                    $modalInstance.close('success');
                });
            }, function() {
                $modalInstance.close();
            });
        }
    };
    $scope.showSelected = function(node) {
        getGroupData(node);
        $scope.status.selectedUser = "";
    };
    $scope.userSelect = function(user) {
        $scope.status.selectedUser = user;
    };
    $scope.getEditInfo = function(editInfo) {
        $scope.status.selectedUser = editInfo;
    };
    /**
     * [getSuggestions description]获取suggestion
     * @param  {[str]} viewValue [description]输入框内输入值
     * @return {[type]}           [description]
     */
    $scope.getSuggestions = function(viewValue) {
        var searchUsers = {
            serviceid: "mlf_extuser",
            methodname: "searchUser",
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
    /**
     * [description]Suggestion 监听
     */
    $scope.$watch('searchWord', function(newValue, oldValue, scope) {
        if (angular.isObject(newValue)) {
            $scope.isRequest = true;
            $scope.users = [newValue];
            $scope.searchWord = newValue.USERNAME;
        }
    });
    $scope.selectrejectionType = function(rejectionType) {
        $scope.status.selectedType = rejectionType;
        getHandlers();
        $scope.status.selectedUser = "";
    };
    $scope.singleDel = function(item) {
        $scope.data.items.splice($scope.data.items.indexOf(item), 1);
        var index = indexOf($scope.data.selectedArray, item);
        $scope.data.selectedArray.splice(index, 1);
    };
    /**
     * [addRelationDraft description]添加关联稿件
     */
    $scope.addRelationDraft = function(item) {
        $scope.status.currItem = item;
        var flag = true;
        angular.forEach($scope.data.items, function(value, key) {
            if (item.METADATAID === value.METADATAID) {
                flag = false;
            }
        });
        if (flag === true && parseInt(item.DOCSTATUS) < 35) {
            $scope.data.selectedArray.push(item);
            $scope.data.items.push(item);
        }
        if ($scope.status.selectedType != '1') {
            $scope.status.selectedType = '2';
        }
    };
    /**
     * [indexOf description]自制indexOf，根据数组中唯一值去重
     * @param  {[type]} array [description]去重的数组
     * @param  {[type]} item  [description]单独值
     * @return {[type]}       [description]
     */
    function indexOf(array, item) {
        for (var i = 0; i <= array.length; i++) {
            if (angular.isDefined(array[i])) {
                if (array[i].METADATAID == item.METADATAID) {
                    return i;
                }
            }

        }
    }
    $scope.eliminate = function(elem) {
        if (parseInt(elem.DOCSTATUS) < 35) {
            return elem;
        }
    };
    $scope.selectAll = function() {
        if ($scope.data.selectedArray.length === $scope.data.relationDraft.length) {
            angular.forEach($scope.data.relationDraft, function(value, key) {
                var index = indexOf($scope.data.items, value);
                if (index > -1) {
                    $scope.data.items.splice(index, 1);
                }
            });
            $scope.data.selectedArray = [];
        } else {
            $scope.data.selectedArray = [].concat($scope.data.relationDraft);
            $scope.data.items = $scope.data.items.concat($scope.data.relationDraft);
        }
        $scope.status.selectedType = "2";
    };
    /**
     * [showToggle description]打开下级子组
     * @param  {[type]} node [description]
     * @return {[type]}      [description]
     */
    $scope.showToggle = function(node) {
        childrenTree(node, function() {});
    };
    /**
     * [childrenTree description]获得下一级子组
     * @param  {[obj]}   node     [description]当前组信息
     * @param  {Function} callback [description]回调
     * @return {[type]}            [description]
     */
    function childrenTree(node, callback) {
        if (node.HASCHILDREN == "true" && node.CHILDREN.length === 0) {
            var paramsT = {
                "serviceid": "mlf_group",
                "methodname": "queryChildGroupsWithOutRight",
                "GroupId": node.GROUPID
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", paramsT, "get").then(function(dataC) {
                    node.CHILDREN = dataC.CHILDREN;
                    callback();
                },
                function(dataC) {
                    trsconfirm.alertType('错误提示', '获取子组失败', "error", false);
                });
        }
    }
}]);
