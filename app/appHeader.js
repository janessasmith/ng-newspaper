'use strict';
angular.module('headModule', [])
    .controller('HeaderController', ['$scope', '$interval', '$rootScope', '$state', '$location', '$window', '$q', 'localStorageService', "trsHttpService", 'trsconfirm', 'loginService',
        function($scope, $interval, $rootScope, $state, $location, $window, $q, localStorageService, trsHttpService, trsconfirm, loginService) {
            initStatus();
            initData();

            function initStatus() {
                $scope.data = {
                    user: {}
                };
                $scope.status = {
                    isUnreadIconShow: false
                };
                $scope.currModule = $location.path().split("/")[1];
                // console.log($scope.currModule);
                $scope.headTab = {
                    'plan': false,
                    'editctr': false,
                    'manageconfig': false,
                    'resourcectrl': false,
                    'operatecenter': false,
                    'retrieval': false,
                    'visualizationcenter': false,

                    'perform': false,   // added
                }
                $scope.headTab[$scope.currModule] = true;
                getResourceCenterAccess();
                $scope.headParams = {
                    serviceid: 'mlf_extuser',
                    methodname: 'getUserHead',
                };
                $scope.headPic = '';
                //初始化一级模块访问权限开始
                getBasicAccess();
                // if (angular.isDefined($rootScope.status) && angular.isDefined($rootScope.status.basicAccess)) {
                //     $scope.status.basicAccess = $rootScope.status.basicAccess;
                // } else {
                //     getBasicAccess();
                // }
            }

            function initData() {
                loginService.getCurrLoginUser().then(function(data) {
                    $scope.data.user = data;
                });
                getUnreadCounts();
                // $scope.promise = $interval(getUnreadCounts, 10000);
                // $rootScope.$on("isUnreadEvent", function(event, data) {
                //     $scope.status.isUnreadIconShow = data == "0" ? false : true;
                // });
                //trsHttpService.httpServer(trsHttpService.getWCMRootUrl(),{},"post")
                headPortrait();
            }

            /**
             * [getWarningTone description] 获取新稿件提示音
             * @return {[type]} [description]
             */
            // function getWarningTone() {
            //     getUnreadCounts().then(function(data) {
            //         var audio = $window.document.createElement("audio");
            //         var header = $window.document.getElementById("header");
            //         var existAudio = header.getElementsByTagName("audio");
            //         if (data === true) {
            //             if(existAudio.length>0){
            //                 for(var i = 0; i<existAudio.length;i++){
            //                     header.removeChild(existAudio[i]);
            //                 }
            //             }
            //             header.appendChild(audio);
            //             audio.src = "./music/warningTone.mp3";
            //             audio.autoplay = "autoplay";
            //         }
            //     });
            // }

            /**
             * [setMediaCloud description]设置平台种类
             * @param {[str]} type [description]平台种类
             */
            $scope.setMediaCloud = function(type) {
                localStorageService.set("mediacloud", type);
                $window.open('/mediacloud');
            };
            $scope.logout = function() {
                loginService.logout().then(function() {
                    localStorageService.remove("currLoginUser");
                    $state.go("login");
                }, function(data) {
                    trsconfirm.alertType('退出异常！', data.msg, "warning", false);
                });
            };

            function getUnreadCounts() {
                var deferred = $q.defer();
                var params = {
                    "serviceid": "mlf_releasesource",
                    "methodname": "queryReceivedReleaseUnreadCount"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                    $rootScope.isUnreadIconShow = data.replace(/\"/g, "") == "0" ? false : true;
                    // $scope.$emit("isUnreadEvent", data.replace(/\"/g, ""));
                    deferred.resolve($rootScope.isUnreadIconShow);
                });
                return deferred.promise;
            }
            //获取头像
            function headPortrait() {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.headParams, "get").then(function(data) {
                    $scope.headPic = data.USERHEAD[0].PERPICURL == '' ? './editngCenter/app/images/user_icon.jpg' : data.USERHEAD[0].PERPICURL;
                });
            }
            //资源中心访问控制
            function getResourceCenterAccess() {
                var params = {
                    serviceid: "mlf_metadataright",
                    methodname: "queryOperTypesBySourceModal",
                    Classify: "source"
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                    .then(function(data) {
                        data.push("share");
                        var resourceCenterAccesses = {};
                        for (var i = 0; i < data.length; i++) {
                            resourceCenterAccesses[data[i]] = true;
                        }
                        $rootScope.status = angular.isDefined($rootScope.status) ? $rootScope.status : {};
                        $rootScope.status.resourceCenterAccesses = resourceCenterAccesses;
                        $scope.status.resourceCenterAccess = data[0];
                    });
            }
            //进入资源中心
            $scope.goToResourceCenter = function() {
                $state.go("resourcectrl." + $scope.status.resourceCenterAccess, "", { reload: true });
            };
            $rootScope.$on('updateHeadPortrait', function(event, data) {
                headPortrait();
            });

            /**
             * 进入绩效考核模块
             * @return {[type]} [description]
             */
            $scope.goToPerformAssess = function() {
                $state.go("perform", '', { reload: true });
            };

            /**
             * [getBasicAccess description：获取一级模块访问权限
             * @param  {[null]}  [description]
             * @return {[null]}  [description]
             */
            function getBasicAccess() {
                var params = {
                    serviceid: "mlf_metadataright",
                    methodname: "queryMlfChildModalsWithRight",
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                    .then(function(data) {
                        var basicAccess = {};
                        for (var i = 0; i < data.length; i++) {
                            basicAccess[data[i]] = true;
                        }

                        // added
                        basicAccess["perform"] = true;




                        if (angular.isDefined($rootScope.status)) {
                            $rootScope.status.basicAccess = basicAccess;
                            $scope.status.basicAccess = basicAccess;
                        } else {
                            $rootScope.status = {
                                basicAccess: basicAccess
                            };
                            $scope.status.basicAccess = basicAccess;
                        }
                    });
            }
        }
    ]);
/**
 * html: <media-header></media-header>
 */
