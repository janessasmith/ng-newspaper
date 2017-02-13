"use strict";
angular.module('editNewspaperLeftrModule', []).controller('editNewspaperLeftCtrl', ['$q', "$timeout", "$state", "$scope", '$filter', "trsHttpService", '$location', 'SweetAlert', 'editLeftRouterService', 'globleParamsSet', 'editingCenterService', 'editingMediatype',
    function($q, $timeout, $state, $scope, $filter, trsHttpService, $location, SweetAlert, editLeftRouterService, globleParamsSet, editingCenterService, editingMediatype) {
        /* if (pathes.length === 3) {
             $state.go("editctr.newspaper.personalManuscript");
             return;
         }*/
        initStatus();
        initData();

        function initStatus() {
            $scope.router = $location.path().split('/');
            $scope.status = {
                paperid: $location.search().paperid,
                selectedChannl: $scope.router[3] || "",
                rightsLibrary: { 'JINRI': 'todaysDraft', 'DAIYONG': 'standbyDraft', 'SHANGBAN': 'pageDraft', 'YIQIAN': 'signedDraft', 'DAYANGSHENYUE': 'sampleReview', 'GUIDANG': 'archiveDraft' },
                newspaper: {
                    sites: []
                }
            };
        }

        function initData() {

            initSites().then(function() {
                getPaperAccessAuthority();
            });
        }
        //初始化站点
        function initSites() {
            var defer = $q.defer();
            editingCenterService.querySitesByMediaType(editingMediatype.newspaper).then(function(data) {
                $scope.status.newspaper.sites = data.DATA;
                $scope.status.newspaper.isDownImgShow = data.DATA.length > 1 ? true : false;
                var filteredSite = $filter('filterBy')(data.DATA, ['SITEID'], $location.search().paperid);
                $scope.status.newspaper.selectedSite = filteredSite.length > 0 ? filteredSite[0] : data.DATA[0];
                defer.resolve();
            });
            return defer.promise;
        }
        //获取报纸权限开始
        function getPaperAccessAuthority(paperid) {
            var deffered = $q.defer();
            var params = {
                serviceid: "mlf_metadataright",
                methodname: "queryCanOperOfPaper",
                Classify: "paper",
                PaperSiteId: $scope.status.newspaper.selectedSite.SITEID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(rights) {
                $scope.status.paperAccessAuthority = rights;
                for (var right in $scope.status.rightsLibrary) {
                    if (rights[right] === 'true') {
                        $scope.status.selectedChannl =  $scope.status.rightsLibrary[right];
                        $state.go('editctr.newspaper.' + $scope.status.selectedChannl, { paperid: $scope.status.newspaper.selectedSite.SITEID });
                        return;
                    }
                }
            });
        }
        //选中当前栏目
        $scope.setCurrChannel = function(channelName) {
            $scope.status.selectedChannl = channelName;
            $state.go('editctr.newspaper.' + channelName, { paperid: $scope.status.newspaper.selectedSite.SITEID });
        };
        // 数字报检查
        $scope.digitalNewspapercheck = function() {
            window.open(globleParamsSet.digitalNewspaper);
        };
        //站点切换
        $scope.setPaperSiteSelected = function(site) {
            if ($scope.status.newspaper.selectedSite === site) return;
            $scope.status.newspaper.selectedSite = site;
            getPaperAccessAuthority($scope.status.newspaper.selectedSite.SITEID);
        };
    }
]);
