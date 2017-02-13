"use strict";
angular.module('iWoShareInventoryModule', [])
    .controller('iWoShareInventoryCtrl', ['$scope', 'initSingleSelecet', "$stateParams", 'trsHttpService', "SweetAlert", "trsconfirm", "$document", "$popover", "initVersionService", "$modal", "trsspliceString", "$timeout", "trsResponseHandle", "iWoListBtnService", "resCtrModalService", "resourceCenterService", "iWoService", function($scope, initSingleSelecet, $stateParams, trsHttpService, SweetAlert, trsconfirm, $document, $popover, initVersionService, $modal, trsspliceString, $timeout, trsResponseHandle, iWoListBtnService, resCtrModalService, resourceCenterService, iWoService) {
        $scope.iWoEntireJsons = initSingleSelecet.iWoEntire();
        initStatus();
        initData();
        //数据请求函数
        //数据请求函数
        function requestData(callback) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
                if (angular.isFunction(callback)) {
                    callback(data);
                } else {
                    $scope.items = data.DATA;
                    $scope.page = data.PAGER;
                    angular.isDefined($scope.page) ? $scope.page.PAGESIZE =
                        $scope.page.PAGESIZE.toString() : $scope.page = {
                            "PAGESIZE": 0,
                            "ITEMCOUNT": 0,
                            "PAGECOUNT": 0
                        };
                }
                $scope.selectedArray = [];
                $scope.preview = ['iWoNewsPreview', 'iWoAtlasPreview'];
            });
        }
        //下一页
        $scope.pageChanged = function() {
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scope.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };
        //跳转指定页面
        $scope.jumpToPage = function() {
            if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.params.CurrPage = $scope.copyCurrPage;
            requestData();
            $scope.selectedArray = [];
        };
        //全选
        $scope.selectAll = function() {
            $scope.selectedArray = $scope.selectedArray.length == $scope.items.length ? [] : [].concat($scope.items);
            cancelBatchOperate();
        };
        //单选
        $scope.selectDoc = function(item) {
            if ($scope.selectedArray.indexOf(item) < 0) {
                $scope.selectedArray.push(item);
            } else {
                $scope.selectedArray.splice($scope.selectedArray.indexOf(item), 1);
            }
            cancelBatchOperate();
        };
        //取消批量操作的样式
        function cancelBatchOperate() {
            if ($scope.selectedArray.length === 0) {
                $scope.batchOperateBtn = {
                    "hoverStatus": "",
                    "clickStatus": ""
                };
            }
        }
        //共享
        $scope.share = function() {
            $scope.shareSelectedArray = $scope.selectedArray;
            share();
        };
        //初始化数据
        function initData() {
            requestData();
            $scope.iWoEntireJsons = initSingleSelecet.iWoEntire();
            $scope.iWoEntire = angular.copy($scope.iWoEntireJsons[0]);

            $scope.docTypeJsons = initSingleSelecet.iWoDocType();
            $scope.docType = angular.copy($scope.docTypeJsons[0]);

            $scope.iWoSourceJsons = initSingleSelecet.iWoSource();
            $scope.iWoSource = angular.copy($scope.iWoSourceJsons[0]);

            $scope.timeTypeJsons = initSingleSelecet.timeType();
            $scope.timeType = angular.copy($scope.timeTypeJsons[0]);
        }
        //初始化状态
        function initStatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 10
            };
            $scope.params = {
                "serviceid": "mlf_releaseSource",
                "methodname": "queryTongYiGongGao",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
            };
            $scope.selectedArray = [];
            $scope.siteid = $stateParams.siteid;
            $scope.channelid = $stateParams.channelid;
            $scope.batchOperateBtn = {
                "hoverStatus": "",
                "clickStatus": ""
            };
            iWoListBtnService.initListBtn('iwo.sharedoc').then(function(data) {
                $scope.btnRights = data;
            });
            $scope.copyCurrPage = 1;
        }
        //提示框
        function sweetAlert(title, text, type) {
            SweetAlert.swal({
                title: title,
                text: text,
                type: type,
                closeOnConfirm: true,
                cancelButtonText: "取消"
            });
        }
        //选择单页显示个数
        $scope.selectPageNum = function() {
            $scope.params.PageSize = $scope.page.PAGESIZE;
            $scope.params.CurrPage = $scope.page.CURRPAGE;
            $scopa.copyCurrPage = 1;
            requestData();
        };
        //取稿
        $scope.getDraft = function() {
            $scope.batchOperateBtn.clickStatus = 'draft';
            var MetaDataIds = trsspliceString.filterArr($scope.selectedArray,
                'METADATAID', ',');
            var MetaDataId = trsspliceString.spliceString($scope.selectedArray,
                'METADATAID', ',');
            console.log(MetaDataId);
            if (!MetaDataIds.length) {
                trsconfirm.alertType("", "请选择稿件！", "error", false);
                return false;
            }
            var takeDraftModal = resCtrModalService.takeDraft(MetaDataIds);
            takeDraftModal.result.then(function(result) {
                var op = result.btnOp;
                result.MetaDataIds = MetaDataId;
                delete result.items;
                delete result.btnOp;

                resourceCenterService.getFetch(result).then(function(data) {
                    if (op == 1) {
                        var chnldocid = data.REPORTS[0].CHNLDOCID,
                            metadataid = data.REPORTS[0].METADATAID;
                        var url = $state.href("iwonews", {
                            chnldocid: chnldocid,
                            status: 0,
                            metadataid: metadataid
                        });
                        window.open(url);
                    } else {
                        trsconfirm.alertType("", "取稿成功!", "success", false);
                    }
                });
            });
        };
        //导出
        $scope.batchExport = function() {
            $scope.batchOperateBtn.clickStatus = "batchExport";
            iWoService.exportDraft(trsspliceString.spliceString($scope.selectedArray,
                "METADATAID", ','));
        };
        //外发
        $scope.batchOutgoing = function() {
            $scope.batchOperateBtn.clickStatus = "batchOutgoing";
        };

        ////流程版本时间与操作日志
        //$scope.showVersionTime = function(MetaDataId) {
        //  $scope.params.serviceid = "mlf_extversion";
        //  $scope.params.methodname = "queryAppVersions";
        //  $scope.params.MetaDataId = MetaDataId;
        //  requestData(function(data) {
        //      $scope.versionTime = initVersionService.getDayContent(data);
        //      $scope.params.serviceid = "mlf_metadata";
        //      $scope.params.methodname = "query";
        //      requestData(function(data) {
        //          $scope.operationLog = initVersionService.getDayContent(data);
        //      });
        //  });
        //  $modal.open({
        //      templateUrl: "./editingCenter/app/service/versionTime/objTime.html",
        //      scope: $scope,
        //      windowClass: 'editCompiledobjTime',
        //      backdrop: false,
        //      controller: "editCompiledobjTimeCtrl"
        //  });
        //};
        ////发稿单
        //$scope.draftlist = function() {
        //  $modal.open({
        //      templateUrl: "./editingCenter/app/toBeCompiled/alertViews/draftlist/toBeCompiled_draftlist_tpl.html",
        //      scope: $scope,
        //      windowClass: 'toBeCompiled-draftlist-window',
        //      backdrop: false,
        //      controller: "toBeCompiledDraftlistCtrl"
        //  });
        //};
        //
        //function share() {
        //  $modal.open({
        //      templateUrl: "./editingCenter/app/service/share/share_tpl.html",
        //      scope: $scope,
        //      windowClass: 'toBeCompiled-Share-window',
        //      backdrop: false,
        //      controller: "toBeCompiledShareCtrl"
        //  });
        //}
        ////分页请求数据
        //function request(param) {
        //  trsHttpService.httpServer("/wcm/mlfcenter.do", param, "get").then(function(data) {
        //      $scope.items = data.DATA;
        //      $scope.page = data.PAGER;
        //      $scope.page.PAGESIZE = $scope.page.PAGESIZE.toString();
        //  }, function(data) {
        //      //分页请求错误；
        //  });
        //}

        //下拉框单选

        //搜索
        $scope.fullTextSearch = function(ev) {
            var searchParams = {
                PAGESIZE: $scope.page.PAGESIZE + "",
                PAGEINDEX: '1',
                searchFields: [{
                    keywords: $scope.keywords,
                }]
            };
            var params = {
                'serviceid': "mlf_essearch",
                'methodname': "queryForIwo",
                'searchParams': searchParams
            };
            if ((angular.isDefined(ev) && ev.keyCode == 13) || angular.isUndefined(ev)) {
                trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                    $scope.items = data.DATA;
                    $scope.page = data.PAGER;
                });
            }
        };
    }]);
