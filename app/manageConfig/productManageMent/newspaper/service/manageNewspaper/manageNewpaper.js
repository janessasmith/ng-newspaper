"use strict";
angular.module('manageconfigManageNewsModule', [])
    .controller('manageNewsCtrl', ['$scope', 'selectedItem', '$q', '$modalInstance', '$timeout', "$validation", 'trsHttpService', "initManageConSelectedService", "trsconfirm", function($scope, selectedItem, $q, $modalInstance, $timeout, $validation, trsHttpService, initManageConSelectedService, trsconfirm) {
        initStatus();
        initData();

        function initStatus() {
            $scope.params = {
                serviceid: "mlf_paperset",
                methodname: "findPaperById"
            };
            $scope.partterns = initManageConSelectedService.getPartterns();
            $scope.appearances = initManageConSelectedService.getAppearances();
            $scope.genres = initManageConSelectedService.getGenres();
            $scope.newspaper = {
                DISPLAYFGDLIST: 0,
                CHECKFGDATTRIBUTE: 0,
                ISDUOJISHEN: 1,
                ISZHAOPAI: 0,
                DATAPATH: 1,
                INCLUDEDIECI: 0,
                LIMITEDAENUMBER: 0,
                REPEATUSETIME: 0,
                CKMSIMDAYRANGE: 0,
            };
        }

        function initData() {
            selectedItem !== "" ? requestData() : "";
            selectedItem !== "" ? $scope.paperTtile = '编辑报纸' : $scope.paperTtile = '新建报纸';
        }

        function requestData() {
            $scope.params.SiteId = selectedItem.SITEID;
            var deferred = $q.defer();
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, "get").then(function(data) {
                $scope.newspaper = data;
                deferred.resolve();
            });
            return deferred.promise;
        }
        //审核模式
        $scope.selectPattern = function(pattern) {
            $scope.newspaper.ISDUOJISHEN = pattern.value;
        };
        //照排版面
        $scope.selectAppearance = function(appearance) {
            $scope.newspaper.ISZHAOPAI = appearance.value;
        };
        //招牌类型
        $scope.selectGenre = function(genre) {
            $scope.newspaper.DATAPATH = genre.value;
        };
        /**
         * [isSelectedCheckbox description]是否选中单选框
         * @param  {[type]}  key [description]属性值
         * @return {Boolean}     [description]
         */
        $scope.isSelectedCheckbox = function(key) {
            $scope.newspaper[key] = $scope.newspaper[key] == 1 ? 0 : 1;
        };
        $scope.close = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $validation.validate($scope.manageNewsform).success(function() {
                $scope.params.methodname = "savePaper";
                $scope.params.ObjectId = selectedItem.SITEID;
                $scope.params.SITENAME = $scope.newspaper.SITENAME;
                $scope.params.SITEDESC = $scope.newspaper.SITEDESC;
                $scope.params.WEBHTTP = $scope.newspaper.WEBHTTP;
                $scope.params.ISDUOJISHEN = $scope.newspaper.ISDUOJISHEN;
                $scope.params.ISZHAOPAI = $scope.newspaper.ISZHAOPAI;
                $scope.params.DATAPATH = $scope.newspaper.DATAPATH;
                $scope.params.DISPLAYFGDLIST = $scope.newspaper.DISPLAYFGDLIST;
                $scope.params.CHECKFGDATTRIBUTE = $scope.newspaper.CHECKFGDATTRIBUTE;
                $scope.params.LIMITEDAENUMBER = $scope.newspaper.LIMITEDAENUMBER === '' ? 0 : $scope.newspaper.LIMITEDAENUMBER;
                $scope.params.INCLUDEDIECI = $scope.newspaper.INCLUDEDIECI;
                $scope.params.REPEATUSETIME = $scope.newspaper.REPEATUSETIME === '' ? 0 : $scope.newspaper.REPEATUSETIME;
                $scope.params.CKMSIMDAYRANGE = $scope.newspaper.CKMSIMDAYRANGE === '' ? 0 : $scope.newspaper.CKMSIMDAYRANGE;
                requestData().then(function(data) {
                    $modalInstance.close("success");
                });
            }).error(function() {
                $scope.showAllTips = true;
                trsconfirm.alertType("提交失败", "请检查表单", "info", false, function() {});
            });
        };
    }]);
