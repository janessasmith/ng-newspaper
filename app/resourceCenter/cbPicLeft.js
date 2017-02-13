"use strict";
angular.module('cbPicLeftModule', [])
    .controller('cbPicLeftCtrl', ['$scope', '$stateParams', '$q', '$state', '$location', 'trsHttpService', function($scope, $stateParams, $q, $state, $location, trsHttpService) {
        initStatus();
        initData();

        function initStatus() {
            $scope.status = {
                isdataLoaded: false,
            };
        }

        function initData() {
            initFirstColumn();
            initSecondColumn();
        }

        //初始化一级栏目
        function initFirstColumn() {
            var deferred = $q.defer();
            var params = {
                serviceid: "mlf_releaseSource",
                methodname: "queryMetaCategorysByModalId",
                Modalid: 37
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $scope.status.isdataLoaded = true;
                $scope.leftList = data;
                $scope.leftList[0].isOpen = true;
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        //初始化二级栏目
        function initSecondColumn() {
            initFirstColumn()
                .then(function(data) {
                    var id = data[0].METACATEGORYID;
                    var params = {
                        serviceid: "mlf_releaseSource",
                        methodname: "queryMetaCategorysOfResource",
                        MetaCategoryId: id
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        $scope.secondCur = data[0].METACATEGORYID;
                        $scope.subitems = data;
                    });

                });
        }

        //切换二级栏目
        $scope.loadSubItem = function(item) {
            $scope.firstCur = item.METACATEGORYID;
            var params = {
                serviceid: "mlf_releaseSource",
                methodname: "queryMetaCategorysOfResource",
                MetaCategoryId: item.METACATEGORYID
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                $scope.subitems = data;
            });
        };

        //选择二级栏目切换右侧内容
        $scope.getDraft = function(subitem) {
            //图片库和音视频库左侧导航暂定为一样的
            var path = $location.path();
            var pathArr = path.split("/");
            var id = subitem.METACATEGORYID;
            $scope.secondCur = subitem.METACATEGORYID;
            if (pathArr[2] == 'picture') {
                $state.go('resourcectrl.picture.resource', {
                    cbpicid: id
                });
            }else if(pathArr[2] == 'video'){
                $state.go('resourcectrl.video.resource', {
                    cbmediaid: id
                });
            }
        };
    }]);
