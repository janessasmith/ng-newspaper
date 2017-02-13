"use strict";
angular.module('toBeCompiledhandelPicModule', []).
factory('handlePicService', ['$timeout', 'SweetAlert', function($timeout, SweetAlert) {
    return {
        handlePic: function(list, checkFocusImage, listPics, checkFigureImage) {
            var flag = true;
            //处理不传图的情况开始
            if (list.ISFOCUSIMAGE === '0') {
                list.FOCUSIMAGE = [];
            }
            if (list.LISTSTYLE === '2') {
                list.LISTPICS = [];
            }
            if (list.ISSELECTFIGURE === '0') {
                list.FIGURE = [];
            }
            if (angular.isDefined(list.DOC_PICTURELIST)) {
                if (list.DOC_PICTURELIST.length === 0) {
                    list.DOC_PICTURELIST = [];
                }
            }
            //处理不传图的情况结束
            //处理焦点图
            if (list.ISFOCUSIMAGE === '1') {
                if (list.FOCUSIMAGE[0].APPDESC === "") {
                    checkFocusImage.desc = 'has-error';
                    flag = false;
                    SweetAlert.swal({
                        title: '图片上传提示',
                        text: '焦点图请输入描述',
                        type: 'warning',
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                    });
                } else {
                    checkFocusImage.desc = '';
                }
                if (list.FOCUSIMAGE[0].APPFILE === "") {
                    checkFocusImage.fileName = "has-error";
                    flag = false;
                    SweetAlert.swal({
                        title: '图片上传提示',
                        text: '焦点图请上传图片',
                        type: 'warning',
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                    });
                } else {
                    checkFocusImage.fileName = "";
                }
            }
            //处理焦点图结束
            //处理列表图
            if (list.LISTSTYLE === "0") {
                list.LISTPICS.length = 1;
                if (list.LISTPICS[0].APPFILE === "") {
                    listPics[0].fileName = "has-error";
                    flag = false;
                    SweetAlert.swal({
                        title: '图片上传提示',
                        text: '列表样式请上传图片',
                        type: 'warning',
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                    });
                } else {
                    listPics[0].fileName = "";
                }
            }
            if (list.LISTSTYLE === '1') {
                var k = 0;
                var kArray = [];
                for (var i = 0; i < list.LISTPICS.length; i++) {
                    if (list.LISTPICS[i].APPFILE === "") {
                        k++;
                        kArray.push(i);
                    }
                }
                if (k > 1) {
                    flag = false;
                }
                if (k <= 1) {
                    angular.forEach(listPics, function(data, index) {
                        listPics[index].fileName = "";
                    });
                    if (k === 1) {
                        for (var j = 0; j < list.LISTPICS.length; j++) {
                            if (list.LISTPICS[j].APPFILE === "") {
                                list.LISTPICS.splice(j, 1);
                            }
                        }
                    }
                } else {
                    flag = false;
                    SweetAlert.swal({
                        title: '图片上传提示',
                        text: '列表样式请上传2-3张图片',
                        type: 'warning',
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                    });
                }
                if (k === 2) {
                    listPics[1].fileName = "has-error";
                    listPics[2].fileName = "has-error";
                }
                if (k === 3) {
                    listPics[0].fileName = "has-error";
                    listPics[1].fileName = "has-error";
                    listPics[2].fileName = "has-error";
                }
            }
            if (list.ISSELECTFIGURE === '1') {
                if (list.FIGURE[0].APPFILE === "") {
                    checkFigureImage.fileName = "has-error";
                    flag = false;
                    SweetAlert.swal({
                        title: '图片上传提示',
                        text: '题图请上传图片',
                        type: 'warning',
                        closeOnConfirm: true,
                        cancelButtonText: "取消",
                    });
                } else {
                    checkFigureImage.fileName = "";
                }
            }
            //处理列表图结束
            //处理各类图片多余的属性开始
            angular.forEach(list.FOCUSIMAGE, function(data, index) {
                if (data.APPFILE === "") {
                    delete data.PERPICURL;
                    delete data.PICURL;
                }
            });
            angular.forEach(list.LISTPICS, function(data, index) {
                if (data.PERPICURL) {
                    delete data.PERPICURL;
                    delete data.PICURL;
                }
            });
            angular.forEach(list.FIGURE, function(data, index) {
                if (data.PERPICURL) {
                    delete data.PERPICURL;
                    delete data.PICURL;
                }
            });
            angular.forEach(list.DOC_PICTURELIST, function(data, index) {
                delete data.PERPICURL;
            });
            //处理各类图片多余的属性结束
            return {
                flag: flag,
                list: list
            };
        }
    };
}]);
