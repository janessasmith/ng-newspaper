/**
 * createdBy SMG 2016-7-14
 * weibo模块左侧
 */
"use strict";
angular.module('editingCenterWeiBoLeftModule', [])
    .controller('weiboLeftCtrl', ['$scope', '$q', '$state', '$stateParams', '$location', '$modal', 'trsHttpService', 'editingCenterWeiBoService', 'trsconfirm',
        function($scope, $q, $state, $stateParams, $location, $modal, trsHttpService, editingCenterWeiBoService, trsconfirm) {
            initStatus();
            initData();

            function initStatus() {
                $scope.router = $location.path().split('/');
                $scope.status = {
                    selectedItem: $scope.router[3] || "",
                    channels: [],
                    selectedChnl: {},
                    weibo: {
                        isdownPicShow: false
                    }
                };
            }

            function initData() {
                initWeiBoAccounts();
            }

            /**
             * [setWeiBoSelectedItem description] 选择左侧栏
             * @param {[type]} item [description]
             */
            $scope.setWeiBoSelectedItem = function(item) {
                $scope.status.selectedItem = item;
                $state.go('editctr.weibo.' + $scope.status.selectedItem, { fctype: $scope.status.weiboAccessAuthority.FACHUDEPINGLUN, sdtype: $scope.status.weiboAccessAuthority.SHOUDAODEPINGLUN, atwopltype: $scope.status.weiboAccessAuthority.ATWODEPINGLUN, atwotype: $scope.status.weiboAccessAuthority.ATWODEWEIBO });
            };

            /**
             * [initWeiBoChnl description] 初始化左侧栏
             * @return {[type]} [description]
             */
            function initWeiBoAccounts() {
                var params = {
                    serviceid: "mlf_mediasite",
                    methodname: "queryWebSitesByMediaType",
                    SiteId: "",
                    MediaType: 5
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get")
                    .then(function(data) {
                        $scope.status.channels = data.DATA;
                        $scope.status.selectedChnl = data.DATA[0];
                        getWeiBoAccessAuthority().then(function() {
                            autoRouter();
                        });
                    });
            }
            /**
             * [getWeiBoAccessAuthority description] 获取微博的权限
             * @return {[type]} [description] promise
             */
            function getWeiBoAccessAuthority() {
                var deffer = $q.defer();
                var params = {
                    serviceid: "mlf_metadataright",
                    methodname: "queryCanOperOfMicroblog",
                    MicroBlogId: $scope.status.selectedChnl.ACCOUNTID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                    deffer.resolve(data);
                    $scope.status.weiboAccessAuthority = data;
                });
                return deffer.promise;
            }

            //选择微博渠道的栏目
            $scope.setWeiboSelected = function(channel) {
                if ($scope.status.selectedChnl === channel) return;
                $scope.status.selectedChnl = channel;
                getWeiBoAccessAuthority().then(function() {
                    autoRouter();
                });
            };
            /**
             * [autoRouter description] 获取平台权限，并自动跳转到有权限的平台
             * @return {[type]} [description] promise
             */
            function autoRouter() {
                var authority = $scope.status.weiboAccessAuthority;
                for (var i in authority) {
                    var router = editingCenterWeiBoService.autoRouter()[i];
                    $state.go("editctr.weibo." + router, { accountid: $scope.status.selectedChnl.ACCOUNTID }, { reload: "editctr.weibo." + router });
                    $scope.status.selectedItem = router;
                    break;
                }
            }

            /**
             * [bindWeibo description] 绑定微博
             * @return {[type]} [description]
             */
            $scope.bindWeibo = function(ev) {
                ev.stopPropagation();
                var modalInstance = $modal.open({
                    templateUrl: "./editingCenter/weibo/service/bindWeiboWin/bindWeiboWin_tpl.html",
                    controller: "editctrBindWeiboCtrl",
                    windowClass: "editctrBindWeiboClass"
                });
                modalInstance.result.then(function() {

                });
            };

            /**
             * [chooseDropdown description] 选择下拉
             * @param  {[type]} ev [description]
             * @return {[type]}    [description]
             */
            $scope.chooseDropdown = function(ev) {
                ev.stopPropagation();
                $scope.status.weibo.isdownPicShow = !$scope.status.weibo.isdownPicShow;
            };

            /**
             * [unbindWeibo description] 解绑微博
             * @return {[type]} [description]
             */
            $scope.unbindWeibo = function() {
                trsconfirm.confirmModel('解绑', '确认解绑微博', function() {
                    unbindWeiboFn();
                });
            };

            function unbindWeiboFn(){
                var params = {
                    methodname:"deleteToJson",
                    serviceid:"wcm61_scmaccount",
                    objectIds:$scope.status.selectedChnl.ACCOUNTID
                };
                trsHttpService.httpServer("/wcm/rbcenter.do", params, "post").then(function(data) {
                    initWeiBoAccounts();
                });
            }
        }
    ]);
