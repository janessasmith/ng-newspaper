 "use strict";
 angular.module('websiteFragmentManagementModule', [
     'pieceMgr.multiDoc',
     'pieceMgr.multiImgs',
     'pieceMgr.widgetMgr',
     'pieceMgr.singleDoc',
     'pieceMgr.singleImage',
     'pieceMgr.multiDocList',
     'fragmentServiceModule',
     "mgcrea.ngStrap.timepicker",
     "mgcrea.ngStrap.datepicker"
 ]).
 controller('websiteFragmentManagementCtrl', fragmentManagement);
 fragmentManagement.$injector = ["$scope", "$modal", "$stateParams", "trsHttpService", "SweetAlert", "initSingleSelecet", "trsconfirm", "fragmentService", "editcenterRightsService"];

 function fragmentManagement($scope, $modal, $stateParams, trsHttpService, SweetAlert, initSingleSelecet, trsconfirm, fragmentService, editcenterRightsService) {
     initStatus();
     initData();
     //下一页
     $scope.pageChanged = function() {
         $scope.params.CurrPage = $scope.page.CURRPAGE;
         $scope.copyCurrPage = $scope.page.CURRPAGE;
         requestData();
     };
     /*跳转指定页面*/
     $scope.jumpToPage = function() {
         if ($scope.copyCurrPage > $scope.page.PAGECOUNT) {
             $scope.copyCurrPage = $scope.page.PAGECOUNT;
         }
         $scope.params.CurrPage = $scope.copyCurrPage;
         requestData();
     };
     //预览碎片
     $scope.preview = function(item) {
         var queryWidgetParams = {
             "serviceid": "mlf_widget",
             "methodname": "findById",
             "ObjectId": item.TEMPID
         };
         trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), queryWidgetParams, "post").then(
             function(data) {
                 var previewParams = {
                     "serviceid": "mlf_widget",
                     "methodname": "templatePreview",
                     "ObjectId": $stateParams.objectid,
                     "TemplateId": $stateParams.tempid,
                     "ObjectType": $stateParams.objecttype,
                     "WidgetId": item.TEMPID,
                     "datajson": JSON.stringify(data.DATAJSON)
                 };
                 trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), previewParams, "post").then(
                     function(data) {
                         window.open(data + "&siteid=" + $stateParams.siteid + "&tempid=" + $stateParams.tempid + "&objectid=" + $stateParams.objectid + "&objecttype=" + $stateParams.objecttype + "&channelid=" + $stateParams.channelid + "&isfragment=" + true + "#widget" + item.TEMPID);
                     });
             });
     };
     //可视化编辑
     //发布碎片
     $scope.publish = function(item) {
         var publishParams = {
             "serviceid": "mlf_widget",
             "methodname": "publish",
             "WidgetId": item.TEMPID
         };
         trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), publishParams, "post").then(
             function(data) {
                 trsconfirm.alertType("发布成功", "", "success", false);
                 requestData();
                 /*trsconfirm.alertType("发布成功","发布成功","success",false);*/
             });
     };
     $scope.visualEditing = function() {
         var params = {
             "serviceid": "mlf_widget",
             "methodname": "templatePreview",
             "ObjectId": $stateParams.objectid,
             "TemplateId": $stateParams.tempid,
             "ObjectType": $stateParams.objecttype
         };
         trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post")
             .then(function(data) {
                 window.open(data + "&siteid=" + $stateParams.siteid + "&tempid=" + $stateParams.tempid + "&objectid=" + $stateParams.objectid + "&objecttype=" + $stateParams.objecttype + "&channelid=" + $stateParams.channelid + "&isfragment=" + true);
             });

     };
     $scope.operateRecord = function() {
         fragmentService.operateRecord($stateParams.tempid);
     };
     //查看历史版本
     $scope.historyVersion = function(item) {
         var widgetParams = {
             siteid: $stateParams.siteid,
             objectid: $stateParams.objectid,
             tempid: $stateParams.tempid,
             objecttype: $stateParams.objecttype,
             widgetid: item.TEMPID
         };
         fragmentService.historyVersion(widgetParams);
     };
     //检索碎片
     $scope.searchWidgets = function() {
         $scope.page.CURRPAGE = 1;
         var params = {
             serviceid: "mlf_widget",
             methodname: "query",
             TempDesc: $scope.widgetDesc,
             PageSize: $scope.page.PAGESIZE,
             CurrPage: $scope.page.CURRPAGE,
             SiteId: $stateParams.siteid,
             templateId : $stateParams.tempid
         };
         $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
             $scope.items = data.DATA;
             $scope.page = data.PAGER;
             $scope.selectedArray = [];
         });
     };
     //初始化状态
     function initStatus() {
         $scope.page = {
             "CURRPAGE": 1,
             "PAGESIZE": 10,
             "ITEMCOUNT": 0
         };
         $scope.params = {
             "serviceid": "mlf_widget",
             "methodname": "query",
             "PageSize": $scope.page.PAGESIZE,
             "CurrPage": $scope.page.CURRPAGE,
             "SiteId": $stateParams.siteid
         };
         $scope.status = {
             batchOperateBtn: {
                 "hoverStatus": "",
                 "clickStatus": ""
             },
             btnRights: {}
         };
         if (angular.isDefined($stateParams.tempid)) {
             $scope.params.TemplateId = $stateParams.tempid;
         }
         $scope.selectedArray = [];
         $scope.copyCurrPage = 1;
     }
     //初始化数据
     function initData() {
         if (angular.isDefined($stateParams.tempid)) {
             requestData();
         }
         editcenterRightsService.initWebsiteListBtnWithoutChn('website.widget', $stateParams.siteid).then(function(rights) {
             $scope.status.btnRights = rights;
         });
     }

     //数据请求函数
     function requestData(callback) {
         $scope.loadingPromise = trsHttpService.httpServer('/wcm/mlfcenter.do', $scope.params, 'get').then(function(data) {
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
         }, function(data) {});
     }
     //点击查看碎片
     $scope.queryWidgetTemplates = function(item) {
         $scope.widgetParams = {
             siteid: $stateParams.siteid,
             objectid: $stateParams.objectid,
             tempid: $stateParams.tempid,
             objecttype: $stateParams.objecttype,
             channelid: $stateParams.channelid
         };
         var showWidget = $modal.open({
             templateUrl: './editingCenter/website/fragmentManagement/widgetMgr/piceMgrngDialog.html',
             scope: $scope,
             windowClass: 'widget',
             backdrop: false,
             controller: function($scope) {
                 $scope.widgetId = item.TEMPID;
             }

         });
     };
 }
