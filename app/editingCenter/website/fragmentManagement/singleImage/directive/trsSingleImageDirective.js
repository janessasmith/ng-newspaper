 "use strict";
 /*oneimage指令:
    html:<div>
      <trs-single-img></trs-single-img>
    </div>,
    css:.oneImage_popup_fa,.oneImage_son,.oneImage_popup_content等，处于oneImage.css样式表内，
    js:效果为替代单个图片组件的的主要页面结构*/
 angular.module("pieceMgr.singleImgdir", ["pieceMgr.dateTimepicker", "pieceMgr.imgUpload"])
     .directive('trsSingleImg', ['$modal', '$timeout', 'fragmentService', "trsSelectDocumentService", "$filter", function($modal, $timeout, fragmentService, trsSelectDocumentService, $filter) {
         return {
             restrict: 'E',
             replace: true,
             transclude: true,
             scope: {
                 jsonObj: "=",
                 singleImageForm: "=",
                 widgetParams: "=",
                 index: "@",
                 required: "@"
             },
             templateUrl: './editingCenter/website/fragmentManagement/singleImage/singleImage.html',

             controller: function($scope, $element, $http) {

             },
             link: function(scope, element, attr) {
                 init();
                 scope.nowTime = fragmentService.getNowTime();
                 if (angular.isDefined(scope.jsonObj)) {
                     scope.item = scope.jsonObj;
                     scope.uploaderSrc = scope.item.imgsrc;
                 } else {
                     scope.item = {
                         title: "",
                         imgsrc: "",
                         imgName: ""
                     };
                 }
                 $timeout(function() {
                     scope.callBack = {
                         success: function(file, src) {
                             $timeout(function() {
                                 scope.item.imgsrc = src.imgSrc;
                                 scope.item.imgName = src.imgName;
                                 scope.uploaderSrc = src.imgSrc;
                                 if (scope.percentage === 100) {
                                     scope.uploaderSuccess = true;
                                 }
                             });
                         },
                         error: function(file) {},
                         file: function(file, uploader) {
                             $timeout(function() {
                                 scope.uploaderSuccess = false;
                                 scope.uploadFileName = file.name;
                                 uploader.upload();
                             });
                         },
                         tar: function(file, percentage) {
                             scope.percentage = percentage * 100;
                         },
                         comp: function() {

                         }
                     };
                 });
                 scope.showConSelModal = function() {
                     var relNewsData = [];
                     if (angular.isDefined(scope.item.recid)) {
                         relNewsData.push({
                             TITLE: scope.item.title,
                             HOMETITLE: scope.item.subtitle,
                             TITLECOLOR: scope.item.titlecolor,
                             ABSTRACT: scope.item.abstract,
                             DOCPUBURL: scope.item.url,
                             RECID: scope.item.recid,
                             RELTIME: scope.item.reltime,
                             SOURCE: scope.item.source,
                             AUTHOR: scope.item.author
                         });
                     }
                     scope.widgetParams.relNewsData = relNewsData;
                     scope.widgetParams.IsPicDoc = true;
                     trsSelectDocumentService.trsSelectDocument(scope.widgetParams, function(result) {
                         scope.item.title = result[0].title;
                         scope.item.subtitle = result[0].subtitle;
                         scope.item.titlecolor = result[0].titlecolor;
                         scope.item.abstract = result[0].abstract;
                         scope.item.url = result[0].url;
                         scope.item.recid = result[0].recid;
                         scope.item.reltime = result[0].reltime;
                         scope.item.imgsrc = result[0].imgsrc;
                         scope.item.imgName = result[0].imgName;
                         scope.item.source = angular.isDefined(result[0].source) ? result[0].source : "";
                         scope.item.author = angular.isDefined(result[0].author) ? result[0].author : "";
                     });
                 };
                 scope.changeTime = function(time) {
                     time = $filter('date')(time, "yyyy-MM-dd HH:mm").toString();
                     return time;
                 };
                 scope.modifyImg = function() {
                     var modalInstance = $modal.open({
                         template: '<iframe src="/wcm/app/photo/photo_compress_mlf.jsp?photo=..%2F..%2Ffile%2Fread_image.jsp%3FFileName%3D' + scope.item.imgName + '&index=' + 0 + '" width="1210px" height="600px"></iframe>',
                         windowClass: 'photoCropCtrl',
                         backdrop: false,
                         controller: "trsPhotoCropCtrl",
                         resolve: {
                             params: function() {
                                 return;
                             }
                         }
                     });
                     window.editCallback = fragmentImgeditCallback;
                 };
                 /**
                  * [uploaderImgeditCallback description]图片修改回掉函数
                  * @param  {[type]} params [description]
                  * @return {[type]}        [description]
                  */
                 function fragmentImgeditCallback(params) {
                     scope.item.imgName = params.imageName;
                     scope.uploaderSrc = scope.item.imgsrc = "/wcm/file/read_image.jsp?FileName=" + params.imageName + "&r=" + new Date().getTime();
                     editPhotoCallback();
                 }

                 function init() {
                     scope.requiredObj = {};
                     for (var i = 0; i < scope.required.split(",").length; i++) {
                         scope.requiredObj[scope.required.split(",")[i].replace(/ /g, "")] = true;
                     }
                 }
             }
         };
     }]);
