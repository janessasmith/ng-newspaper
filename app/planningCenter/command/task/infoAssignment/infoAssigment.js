"use strict";
angular.module('infoAssignmentModule', [])
    .controller('infoAssignmentCtrl', function($scope, $state, $location, dateFilter, trsspliceString, plancenterService, planCtrModalService) {
        var vm = $scope.vm = {
            pageParams: {
                PageId: 1,
                jumptoPage: 1
            },
            pager: {
                CURRPAGE: 1,
                PAGESIZE: 2
            }
        };
        var init = function() {
            $scope.infotype = ['已读', '未读', '接受', '转发'];
            getPlanInfo();
            $scope.$watch("$parent.initStatus.rwzl.ggxx", function(newV, oldV) {
                getInfAssignRights();
            });
        };
        var getPlanInfo = function() {
            plancenterService.infoinvoke('queryOwnerPlanInformations', vm.pageParams).then(function(res) {
                vm.infos = res.DATA;
                vm.pager = res.PAGER;
            });
        };

        $scope.createNewinfo = function() {
            var createModal = planCtrModalService.createInfo(function(info) {
                plancenterService.infoinvoke('saveInformation', info).then(function(data) {
                    getPlanInfo();
                });

            });
        };
        $scope.viewInfo = function(info) {
            var viewInfoModal = planCtrModalService.viewInfo(info);
        };

        $scope.pageChanged = function() {
            vm.pageParams.jumptoPage = vm.pageParams.PageId = vm.pager.CURRPAGE;
            getPlanInfo();
        };
        $scope.jumptoPage = function() {
            vm.pageParams.PageId = vm.pageParams.jumptoPage;
            getPlanInfo();
        }

        $scope.toggleTask = function(info) {
            info.ischecked = !info.ischecked;
        };
        init();
        //获取信息指派权限
        function getInfAssignRights() {
            $scope.rights = angular.isUndefined($scope.$parent.initStatus.rwzl) ? undefined : $scope.$parent.initStatus.rwzl.ggxx;
        }
    }).controller('infoViewCtrl', function($scope, $state, $location, trsspliceString, plancenterService, planCtrModalService, localStorageService) {
        var vm = $scope.vm = {
            pageParams: {
                PageId: 1,
                jumptoPage: 1
            },
            pager: {
                CURRPAGE: 1,
                PAGESIZE: 2
            }
        };
        var nearlytime = localStorageService.get('infonearlytime', new Date().getTime());
        localStorageService.set('infonearlytime', new Date().getTime());
        var init = function() {
            $scope.infotype = ['已读', '未读', '接受', '转发'];
            getPlanInfo();
        };
        var getPlanInfo = function() {
            plancenterService.infoinvoke('queryPlanInformations', vm.pageParams).then(function(res) {
                vm.infos = res.DATA;
                vm.pager = res.PAGER;
            });
        };
        $scope.checkunread = function(info) {
            return new Date(info.CRTIME).getTime() > nearlytime;
        }
        $scope.viewInfo = function(info) {
            var viewInfoModal = planCtrModalService.viewInfo(info);
        };

        $scope.pageChanged = function() {
            vm.pageParams.jumptoPage = vm.pageParams.PageId = vm.pager.CURRPAGE;
            getPlanInfo();
        };
        $scope.jumptoPage = function() {
            vm.pageParams.PageId = vm.pageParams.jumptoPage;
            getPlanInfo();
        }
        init();
    }).controller('infoTypeCtrl', function($scope, $state, $location, trsspliceString, plancenterService, planCtrModalService, trsconfirm, SweetAlert) {
        var vm = $scope.vm = {
            pageParams: {
                PageId: 1,
                jumptoPage: 1
            },
            pager: {
                CURRPAGE: 1,
                PAGESIZE: 2
            },
            isAllchecked: false,
        };
        var init = function() {
            $scope.infotype = ['已读', '未读', '接受', '转发'];
            getInfoTypes();
        };
        var getInfoTypes = function() {
            plancenterService.infoinvoke('queryInfoTypes', vm.pageParams).then(function(res) {
                vm.infoTypes = res;
                //vm.pager = res.PAGER;
            });
        }

        var refreshInfowithMsg = function(msg) {
            SweetAlert.swal(msg, "", "success");
            getInfoTypes();
        }


        $scope.createNewinfoType = function() {
            planCtrModalService.createInfoType().result.then(function(result) {
                if (result.ISSUCCESS === 'true') {
                    refreshInfowithMsg('新建消息成功');
                }
            });
        }

        $scope.deleteInfoType = function() {
            var selIfotypes = trsspliceString.where(vm.infoTypes, { ischecked: true });
            if (selIfotypes.length === 0) {
                trsconfirm.alertType("请先选择要删除的信息类型", "", "error", false, "");
                return false;
            }
            var ids = trsspliceString.getValuesBykey(selIfotypes, 'INFORTYPEID').join(',');
            trsconfirm.alert({
                title: "确定要删除这些类型",
                type: 'warning',
                closeOnConfirm: false,
            }, function(isConfirm) {
                if (isConfirm) {
                    plancenterService.infoinvoke('delInfoTypes', { TypeIds: ids }).then(function(data) {
                        if (data.ISSUCCESS === 'true') {
                            refreshInfowithMsg('删除类型成功！');
                        }
                    });
                }
            });
        }
        $scope.deleteInfoTypeById = function(id) {
            trsconfirm.alert({
                title: "确定要删除此类型",
                type: 'warning',
                closeOnConfirm: false,
            }, function(isConfirm) {
                if (isConfirm) {
                    plancenterService.infoinvoke('delInfoTypes', { TypeIds: id }).then(function(data) {
                        if (data.ISSUCCESS === 'true') {
                            refreshInfowithMsg('删除类型成功！');
                        }
                    });
                }
            });

        }
        $scope.toggleAllcheck = function(isAllchecked) {
            vm.isAllchecked = !isAllchecked;
            angular.forEach(vm.infoTypes, function(item) {
                item.ischecked = vm.isAllchecked;
            });
        }

        $scope.toggleInfoType = function(infotype) {
            var ischecked = infotype.ischecked = !infotype.ischecked;
            if (ischecked) {
                var lengthOfchecked = trsspliceString.filterArr(vm.infoTypes, '', 'ischecked', true).length;
                if (lengthOfchecked === vm.infoTypes.length) {
                    vm.isAllchecked = true;
                }
            } else {
                vm.isAllchecked = false;
            };
        }
        init();
    });
