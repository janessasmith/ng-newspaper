"use strict";
angular.module('draftlistModule', []).
controller('draftlistCtrl', draftlistCtrl);
draftlistCtrl.$inject = ["$scope", "$modalInstance", "$compile", "$validation", "draftListParams", "trsHttpService", "trsspliceString"];

function draftlistCtrl($scope, $modalInstance, $compile, $validation, draftListParams, trsHttpService, trsspliceString) {
    init();
    $scope.confirm = function() {
        $validation.validate($scope.draftForm.authorForm).success(function() {
            var fgdParams = draftListParams.params;
            //处理发稿单作者信息空数据提交问题
            if (angular.isDefined($scope.list.fgd_authinfo[0]) && (!angular.isDefined($scope.list.fgd_authinfo[0].USERNAME) || $scope.list.fgd_authinfo[0].USERNAME === "")) {
                $scope.list.fgd_authinfo = [];
            }
            //处理发稿单作者信息空数据提交问题
            fgdParams.fgd_editinfo = JSON.stringify(angular.copy($scope.list.fgd_editinfo));
            fgdParams.fgd_authinfo = JSON.stringify(angular.copy($scope.list.fgd_authinfo));
            fgdParams.chnlDocIds = trsspliceString.spliceString(draftListParams.array, "CHNLDOCID", ",");
            fgdParams.MetaDataIds = trsspliceString.spliceString(draftListParams.array, "METADATAID", ",");
            fgdParams.DocGenre = JSON.stringify($scope.list.DocGenre);
            fgdParams.ISNOPAYMENT = $scope.list.ISNOPAYMENT;
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), fgdParams, "post").
            then(function(data) {
                $modalInstance.close("success");
            });
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };

    function init() {
        trsHttpService.httpServer("./editingCenter/properties/metadataEnum.json", "", "get").then(function(data) {
            //初始化页面参数
            $scope.DOCGENRE = data.DocGenre;
            if (draftListParams.array.length === 1) {
                $scope.metaDataId = draftListParams.array[0].METADATAID;
                var params = {
                    serviceid: "mlf_appfgd",
                    methodname: "queryFgdByMetaDataId",
                    MetaDataId: draftListParams.array[0].METADATAID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
                    .then(function(fgd_data) {
                        $scope.list = {
                            "DocGenre":fgd_data.DOCGENRE,
                            "fgd_editinfo":fgd_data.FGD_EDITINFO,
                            "fgd_authinfo":fgd_data.FGD_AUTHINFO,
                            "ISNOPAYMENT":fgd_data.ISNOPAYMENT
                        };
                        loadDirective();
                    });
            } else {
                $scope.list = {
                    "DocGenre": angular.copy($scope.DOCGENRE[0]),
                    "fgd_editinfo": [],
                    "fgd_authinfo": [],
                    "ISNOPAYMENT": "1",
                };
                loadDirective();
            }
        });

        function loadDirective() {
            var draftList = '<editor-dir meta-data-id="{{metaDataId}}" editor-json="list.fgd_editinfo"></editor-dir>' +
                '<editor-auth-dir author="list.fgd_authinfo"></editor-auth-dir>';
            draftList = $compile(draftList)($scope);
            $($(angular.element(document)).find('editor')).append(draftList);
        }
    }
}
