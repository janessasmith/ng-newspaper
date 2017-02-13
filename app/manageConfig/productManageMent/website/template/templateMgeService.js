"use strict";
angular.module("websiteTemplateServiceCtrlModule", [

    ])
    .controller('websiteTemplateImportTemplateCtrl', ['$scope',"$q","$modalInstance", "$stateParams", "initManageConSelectedService", "trsspliceString", "trsHttpService", "Upload", "trsconfirm", "host", function($scope,$q,$modalInstance, $stateParams, initManageConSelectedService, trsspliceString, trsHttpService, Upload, trsconfirm, host) {
        init();
        initData();
        $scope.upload = function(file) {
            $scope.loadingTempPromise=Upload.upload({
                url: '/wcm/openapi/uploadFile',
                data: {
                    file: file,
                    'SrcFileName': $scope.filename,
                }
            }).then(function(resp) {
                $scope.filesrc = resp.data.imgName;
            }, function(resp) {
            }, function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };

        function initData() {
            initDropDown();
        }

        function init() {
            $scope.trueName = {
                ISIMPORT: "1",
                ISPIC: "1"
            };

        }

        //如果模板同名
        $scope.importmodes = initManageConSelectedService.getImportmode();
        $scope.picmodes = initManageConSelectedService.getPicmode();
        //如果模板同名
        $scope.selectImportmode = function(importmode) {
            $scope.trueName.ISIMPORT = importmode.value;
        };
        //如果zip文件中出现相同图片文件名时：
        $scope.selectPicmode = function(picmode) {
            $scope.trueName.ISPIC = picmode.value;
        };

        //初始化下拉框
        function initDropDown() {
            //初始化文件编码
            $scope.fileCompilationJsons = initManageConSelectedService.fileCompilation();
            $scope.fileCompilation = angular.copy($scope.fileCompilationJsons[0]);
        }
        //文件编码
        /*$scope.queryByFileCompilation = function() {
            $scope.fileCompilation = angular.copy($scope.fileCompilation).value;
        };*/

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            if (!angular.isDefined($scope.filename)) {
                trsconfirm.alertType("请先上传模板", "请先上传模板", "error", false, function() {
                    return;
                });
            }
            var arrayMetaIds = trsspliceString.spliceString($scope.selectedArray, "TEMPID", ',');
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: "importTemplates",
                HostType: host.hostType,
                HostId: host.hostId,
                ImportFile: $scope.filesrc,
                ImportMode: $scope.trueName.ISIMPORT,
                PicMode: $scope.trueName.ISPIC,
                SrcFileName: $scope.filename.name,
                FileEncode: $scope.fileCompilation.value
            };
            // $scope.params.ImportMode = 0;
            // $scope.params.ImportMode = 0;
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                trsconfirm.multiReportsAlert(data,"");
                $modalInstance.close();
            });
        };

    }])
    .controller('websiteTemplatecreateOrEditTemplateCtrl', ['$scope', "$q", "$modal", "$validation", "$stateParams", "$modalInstance", "trsHttpService", "initManageConSelectedService", "trsspliceString", "item", "trsconfirm", "host", function($scope, $q, $modal, $validation, $stateParams, $modalInstance, trsHttpService, initManageConSelectedService, trsspliceString, item, trsconfirm, host) {
        init();
        //模板类型筛选
        $scope.selectedTempType = function() {
            $scope.item.TEMPTYPE = angular.copy($scope.tempType).value;
        };


        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.save = function() {
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: "saveTemplate",
                objectid: $scope.item.TEMPID,
                TEMPNAME: $scope.item.TEMPNAME,
                TEMPDESC: $scope.item.TEMPDESC,
                TEMPEXT: $scope.item.TEMPEXT,
                OUTPUTFILENAME: $scope.item.OUTPUTFILENAME,
                TEMPTEXT: $scope.item.TEMPTEXT,
                TEMPTYPE: $scope.item.TEMPTYPE,
                HostType: host.hostType,
                HostId: host.hostId,
                ROOTID: $stateParams.site
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                .then(function(data) {
                    trsconfirm.alertType("保存成功", "", "success", false, function() {
                        $modalInstance.close("success");
                    });
                });
        };
        //插入碎片
        $scope.insertFragment = function() {
            var modalInstance = $modal.open({
                templateUrl: "./manageConfig/productManageMent/website/template/template/insertFragment_tpl.html",
                scope: $scope,
                windowClass: 'man_produ_insert',
                backdrop: false,
                controller: "websiteTemplateInsertFragmentCtrl"
            });
            modalInstance.result.then(function(result) {
                $scope.item.TEMPTEXT = angular.isDefined($scope.item.TEMPTEXT) ? JSON.stringify($scope.item.TEMPTEXT) + JSON.stringify(result) : JSON.stringify(result);
            });
        };

        //模板校验
        $scope.templateCheck = function() {
            var params = {
                serviceid: "mlf_websiteconfig",
                methodname: "checkTemplateText",
                HostType: 103,
                HostId: $stateParams.site,
                ObjectIds: $scope.item.TEMPID,
                TemplateText: $scope.item.TEMPTEXT,
                TempName: $scope.item.TEMPNAME
            };
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                var modalInstance = $modal.open({
                    templateUrl: "./manageConfig/productManageMent/website/template/template/templateCheck_tpl.html",
                    scope: $scope,
                    windowClass: 'man_produ_templateCheck',
                    backdrop: false,
                    resolve: {
                        data: function() {
                            return data;
                        }
                    },
                    controller: "websiteTemplateTemplateCheckCtrl"
                });

            });
        };
        //编辑时请求原有的数据
        function initEditItem(item) {
            var params = {
                "serviceid": "mlf_websiteconfig",
                "methodname": "findTemplateById",
                "ObjectId": item.TEMPID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $scope.item = data;
            });
        }

        function init() {
            $scope.tempTypeJsons = initManageConSelectedService.tempType();
            if (angular.isDefined(item)) {
                $scope.item = item;
                initEditItem($scope.item);
                angular.forEach($scope.tempTypeJsons, function(data, index, array) {
                    if (data.value === $scope.item.TEMPTYPE) {
                        $scope.tempType = angular.copy($scope.tempTypeJsons[index]);
                    }
                });
            } else {
                $scope.item = {
                    TEMPID: 0,
                    OUTPUTFILENAME: 'index',
                    TEMPEXT: 'htm'
                };
                $scope.tempType = angular.copy($scope.tempTypeJsons[0]);
            }
        }
    }])
    .controller('websiteTemplateSyncTemplateCtrl', ['$scope', "$stateParams", "data", "$modalInstance", "trsHttpService", function($scope, $stateParams, data, $modalInstance, trsHttpService) {
        init();
        $scope.TITLE = data.substr(54, 33);
        // console.log($scope.TITLE)
        function init() {}

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.confirm = function() {
            $modalInstance.close();
        };


    }])
    .controller('websiteTemplateInsertFragmentCtrl', ['$scope', "$modalInstance", "trsHttpService", "$stateParams", "trsspliceString", "initManageConSelectedService", function($scope, $modalInstance, trsHttpService, $stateParams, trsspliceString, initManageConSelectedService) {
        initstatus();
        initData();

        function init() {
            $scope.selectedTEMP = "";
        }
        $scope.selectImportmode = function(item) {
            $scope.selectedTEMP = item;
        };
        //初始化状态
        function initstatus() {
            $scope.page = {
                "CURRPAGE": 1,
                "PAGESIZE": 10
            };
            $scope.copyCurrPage = 1;
            $scope.params = {
                "serviceid": "mlf_widget",
                "methodname": "queryWidgetsBySite",
                "PageSize": $scope.page.PAGESIZE,
                "CurrPage": $scope.page.CURRPAGE,
                "SiteId": $stateParams.site
            };
            $scope.batchOperateBtn = {
                "hoverStatus": "",
                "clickStatus": ""
            };
        }

        //初始化数据
        function initData() {
            requestData();
        }

        //数据请求函数
        function requestData(callback) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
                // console.log($scope.params);
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
            });
        }
        //下一页
        $scope.pageChanged = function() {
            $scope.params.CurrPage =
                $scope.copyCurrPage = $scope.page.CURRPAGE;
            requestData();
        };;
        //跳转到
        $scope.jumpToPage = function() {
            if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
                $scope.copyCurrPage = $scope.page.PAGECOUNT;
            }
            $scope.params.CurrPage = $scope.copyCurrPage;
            requestData();
        };


        //选择单页显示个数
        $scope.selectPageNum = function() {
            $timeout(function() {
                $scope.params.PageSize = $scope.page.PAGESIZE;
                requestData();
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $scope.params.serviceid = "mlf_widget";
            $scope.params.methodname = "queryWidgetIncludeCode";
            $scope.params.WidgetId = $scope.selectedTEMP.TEMPID;
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
                $modalInstance.close(data);
            });
        };



    }]).controller('websiteTemplateTemplateCheckCtrl', ['$scope', "$stateParams", "$modalInstance", "trsspliceString", "data", function($scope, $stateParams, $modalInstance, trsspliceString, data) {
        init();

        function init() {
            $scope.color = data.ISSUCCESS === "true" ? {
                color: "green"
            } : {
                color: "red"
            };
            $scope.TemplateText = data.TITLE;
        }
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $modalInstance.close();
        };

    }]);
