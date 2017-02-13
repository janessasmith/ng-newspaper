// "use strict";
// angular.module('editingCenterLeftNewspaperModule', []).controller('editNewspaperLeftCtrl', ['$q', "$timeout", "$state", "$scope",
//     "trsHttpService", '$location', 'SweetAlert', 'editLeftRouterService',
//     function($q, $timeout, $state, $scope, trsHttpService, $location, SweetAlert, editLeftRouterService) {
//         initStatus();
//         initData();

//         function initStatus() {
//             $scope.status = {
//                 isNewsPaperShow: false,
//                 newsPaperSelected: "",
//                 newspaperChnlSelected: "",
//             };
//             $scope.data = {
//                 paperSite: ""
//             };
//             $scope.params = {
//                 serviceid: "mlf_paper",
//                 methodname: "queryWebSitesByMediaType",
//                 MediaType: '3', //APP：1，网站：2，报纸：3，微信：4，微博：5
//                 SiteId: ""
//             };
//         }

//         function initData() {}
//         //报纸初始化
//         function initNewspaper() {
//             var params = {
//                 "serviceid": "mlf_paper",
//                 "methodname": "queryPagers",
//                 'Status':0
//             };
//             trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get')
//                 .then(function(data) {
//                     $scope.data.paperSite = data;
//                     $scope.status.paperSiteSelected = $scope.status.paperSiteSelected ? $scope.status.paperSiteSelected : $scope.data.PaperSite[0];
//                 });
//         }
//         $scope.setNewspaperSelectedChnl = function(param) {
//             $scope.newspaperChnlSelected = param;
//         };
//         $scope.setPaperSiteSelected = function(site) {
//             if ($scope.status.paperSiteSelected === site) return;
//             $scope.status.paperSiteSelected = site;
//             $scope.params.SiteId = site.SITEID;
//             gotoDefaultPapersite();
//             var param = {
//                 siteid: site.SITEID,
//                 channelid: $location.search().channelid || $scope.status.webChannels[0].CHANNELID
//             };
//             $state.transitionTo($state.current, param);

//         };
//         //报纸默认跳转
//         function gotoDefaultPapersite() {
//             // $scope.params.SiteId = $scope.paperSiteSelected;
//             var params = {
//                 serviceid: "mlf_paper",
//                 methodname: "queryPagers",
//                 paperid: $scope.params.SiteId,
//             };
//             trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get')
//                 .then(function(data) {
//                 });
//         }
//     }
// ]);
