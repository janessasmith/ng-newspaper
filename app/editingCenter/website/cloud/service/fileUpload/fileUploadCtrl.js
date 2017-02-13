'use strict';
/**
 *  Module
 *
 * Description
 */
angular.module('flieUploadCtrlModule', []).controller('flieUploadCtrl', ['$scope', '$filter', '$validation', 'Upload', 'pathArray', 'templateOnly', 'currItems', 'trsconfirm', '$stateParams', "$window", "trsHttpService", "$modalInstance", 'trsspliceString',
    function($scope, $filter, $validation, Upload, pathArray, templateOnly, currItems, trsconfirm, $stateParams, $window, trsHttpService, $modalInstance, trsspliceString) {
        initstatus();

        function initstatus() {
            $scope.status = {
                isUploaderFile: '',
                showFiles: [],
                ATTACHFILE: [],
                WCMFILENAMES: [],
                file: [],
                templateOnly: templateOnly,
                successUpload: 0,
            };
            $scope.data = {
                items: currItems,
            }
        }
        /**********************************************附件上传开始**********************************************/
        /**
         * [selectFiles description]选择文件
         * @param  {[type]} files    [description]所有文件
         * @param  {[type]} file     [description]
         * @param  {[type]} newFiles [description]新增的文件
         * @return {[type]}          [description]
         */
        $scope.selectFiles = function(files, file, newFiles) {
            $scope.status.isUploaderFile = true;
            // angular.forEach(newFiles, function(value, key) {
            //     if ($scope.status.templateOnly) {
            //         if(value.name.substr(value.name.lastIndexOf('.')+1).toLowerCase!='zip'){

            //         }
            //     }
            //     $scope.status.showFiles.push({
            //         SRCFILE: newFiles[key].name,
            //         APPDESC: newFiles[key].name,
            //         FILEINFO: "等待上传",
            //         FILE: newFiles[key],
            //     });
            // });
            var notZipOnly = false;
            for (var i = 0; i < newFiles.length; i++) {
                if ($scope.status.templateOnly) {
                    if (newFiles[i].name.substr(newFiles[i].name.lastIndexOf('.') + 1).toLowerCase() != 'zip') {
                        notZipOnly = true;
                        continue;
                    }
                }
                $scope.status.showFiles.push({
                    SRCFILE: newFiles[i].name,
                    APPDESC: newFiles[i].name,
                    FILEINFO: "等待上传",
                    FILE: newFiles[i],
                });
            }
            if ($scope.status.templateOnly && notZipOnly) trsconfirm.alertType('只能上传zip', '', 'warning', false);
            // if ($scope.status.templateOnly && notZipOnly && newFiles.length == 1) trsconfirm.alertType('只能上传zip', '', 'warning', false);
            // if ($scope.status.templateOnly && (newFiles.length > 1 || $scope.status.showFiles.length > 1)) {
            //     $scope.status.showFiles.length = 1;
            //     trsconfirm.alertType('一个只能上传一个模板', '', 'warning', false);
            // }
        };
        /**
         * [getAttachFile description]为ATTACHFILE重新复制，可更改
         * @return {[type]} [description]null
         */
        function saveAttachFile() {
            $scope.status.ATTACHFILE = [];
            $scope.status.WCMFILENAMES = [];
            angular.forEach($scope.status.showFiles, function(value, key) {
                if (value.FILEINFO === '上传成功') {
                    delete value.FILE;
                    $scope.status.ATTACHFILE = $scope.status.ATTACHFILE.concat(value.SRCFILE);
                    $scope.status.WCMFILENAMES = $scope.status.WCMFILENAMES.concat(value.APPFILE);
                }
            });
        }

        function reWriteAttachFile(data) {
            $scope.status.showFiles = angular.copy(data.ATTACHFILE);
            angular.forEach($scope.status.showFiles, function(value, key) {
                value.FILEINFO = "上传成功";
            });
        }
        /**
         * [fileSubmit description]附件提交
         * @return {[type]} [description]
         */
        $scope.fileSubmit = function() {
            $validation.validate($scope.cloudFileUpload).success(function() {
                if ($scope.status.showFiles) {
                    if (isSameName()) return;
                    angular.forEach($scope.status.showFiles, function(file, key) {
                        if (file.FILEINFO === '等待上传') {
                            Upload.upload({
                                url: "/wcm/openapi/uploadFile",
                                data: {
                                    file: file.FILE
                                },
                            }).then(function(resp) {
                                if (resp.data.success) {
                                    $scope.status.WCMFILENAMES = [];
                                    file.FILEINFO = '上传成功';
                                    file.APPFILE = resp.data.imgName;
                                    $scope.status.WCMFILENAMES = resp.data.imgName;
                                    $scope.status.successUpload++;
                                } else {
                                    file.FILEINFO = resp.data.error;
                                }
                            }, function(resp) {

                            }, function(evt) {
                                // file.progressPercentage = parseInt(100.0 * evt.loaded / evt.total) + '%';
                                file.FILEINFO = "上传中";
                            });
                            $scope.status.isUploaderFile = false;
                        }
                    });
                } else {
                    trsconfirm.saveModel("附件上传失败", "附件填写有误", "error");
                }
            });
        };
        /**
         * [isSameName description]判断是否重名
         */
        function isSameName() {
            var data = {
                ISSUCCESS: "false",
                REPORTS: [],
                TITLE: "文件上传",
            };
            // { TITLE: "收藏稿件", ISSUCCESS: "false", TYPE: "5", DETAIL: "专题稿件【cs】不能收藏" }
            angular.forEach($scope.status.showFiles, function(file, key) {
                angular.forEach($scope.data.items, function(item, index) {
                    if (item.ISDIRECTORY == "false" && item.NAME == file.APPDESC) {
                        data.REPORTS.push({
                            'TITLE': '上传文件',
                            'ISSUCCESS': 'false',
                            'TYPE': '5',
                            'DETAIL': '文件名【' + file.APPDESC + "】已存在！"
                        });
                    }
                })
            });
            if (data.REPORTS.length > 0) {
                trsconfirm.multiReportsAlert(data, "");
                return true;
            } else {
                return false;
            }
        }
        /**
         * [removeCurFile description]移除当前附件
         * @param  {[obj]} file  [description]被选中的附件
         * @param  {[num]} index [description]附件下标
         * @return {[type]}       [description]
         */
        $scope.removeCurFile = function(file, index) {
            $scope.status.showFiles.splice($scope.status.showFiles.indexOf(file), 1);
        };

        $scope.confirm = function() {
            if ($scope.status.WCMFILENAMES.length > 0) {
                //如果有正在上传的就禁止确定
                if (isUploading()) return;
                saveAttachFile();
                // var path=pathArray.pathArray.length>1?pathArray.pathArray.join('/')+'/':'/';
                var fileUploadParams = {
                    "serviceid": "mlf_websitefile",
                    "methodname": "saveFile",
                    "SiteId": $stateParams.siteid,
                    "ChannelId": $stateParams.channelid,
                    "SrcFileNames": $scope.status.ATTACHFILE.join(','),
                    'WCMFileNames': $scope.status.WCMFILENAMES.join(','),
                    "ParentPathName": pathArray.pathArray,
                };
                var templateOnlyParams = {
                    "serviceid": "mlf_websitefile",
                    "methodname": "importTemplate",
                    "ChannelId": $stateParams.channelid,
                    "FilePath": pathArray.pathArray,
                    "FileName": $scope.status.WCMFILENAMES.join(','),
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.templateOnly ? templateOnlyParams : fileUploadParams, 'get').then(function(url) {
                    $modalInstance.close("success");
                });
            } else {
                trsconfirm.alertType("请上传文件", "", "warning", false, function() {});
            }
        };
        /**
         * [isUploading description]检查是否有正在上传的
         */
        function isUploading() {
            var flag = false;
            for (var i = 0; i < $scope.status.showFiles.length; i++) {
                if ($scope.status.showFiles[i].FILEINFO == "上传中") {
                    flag = true;
                    return flag;
                }
            }
            return flag;
        };

        $scope.cancel = function() {
            $modalInstance.close();
        };
    }
]);
