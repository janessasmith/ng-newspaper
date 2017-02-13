/**
    Author:SMG
    Time:2016-04-18
**/
"use strict";
angular.module('websiteMlfCloudModule', [
    'folderServiceModule',
    'editWebsiteCloudCopyModule',
    'websiteCloudModifyFileModule',
    'websiteCloudCreateFileModule',
]).
controller('websiteMlfCloudCtrl', websiteFolderCtrl);
websiteFolderCtrl.$injector = ["$scope", "$stateParams", "$timeout", "$modal", "$window", "$q", "trsHttpService", "trsconfirm", "globleParamsSet", "trsspliceString", "newFileUpload", "editcenterRightsService"];

function websiteFolderCtrl($scope, $stateParams, $timeout, $modal, $window, $q, trsHttpService, trsconfirm, globleParamsSet, trsspliceString, newFileUpload, editcenterRightsService) {

    initStatus();
    initData();
    /**
     * [initStatus description]初始化状态
     * @return {[type]} [description] null
     */
    function initStatus() {
        $scope.page = {
            "CURRPAGE": 1,
            "PAGESIZE": globleParamsSet.setResourceCenterPageSize,
            "ITEMCOUNT": 0,
            "PAGECOUNT": 0
        };
        $scope.data = {
            items: [],
            selectedArray: [],
            fileName: [],
            currChnnl: '',
        };
        $scope.status = {
            batchOperateBtn: {
                "hoverStatus": "",
                "clickStatus": ""
            },
            FileType: {

            },
            isFolder: true,
            count: {
                file: "",
                folder: "",
            },
            currHoverItem: "",
            pathArray: [],
            fileType: ['css', 'doc', 'docx', 'shtml', 'html', 'jpg', 'js', 'png', 'ppt', 'rar', 'txt', 'xls', 'xml', 'zip', 'xlsx', 'htm', 'pptx', 'bmp', 'exe', 'flv', 'gif', 'mp3', 'mr', 'pdf', 'swf', 'wav'],
            canModify: ['html', 'shtml', 'xml', 'htm', 'js', 'css', 'txt'],
            btnRights: {},
        };
        $scope.params = {
            "serviceid": "mlf_websitefile",
            "methodname": "queryFiles",
            // "SiteId": $stateParams.siteid,
            "ChannelId": $stateParams.channelid,
            "ParentPathName": "/"
        };
    }

    /**
     * [initData description]初始化数据
     * @return {[type]} [description] null
     */
    function initData() {
        requestData();
        //查询栏目名称
        getChannelName();
        //查询权限
        editcenterRightsService.initWebsiteListBtn('websetchannel.file', $stateParams.channelid).then(function(rights) {
            $scope.status.btnRights = rights;
        });
    }
    //根据栏目ID查询栏目名称
    function getChannelName() {
        var params = {
            serviceid: "mlf_website",
            methodname: 'queryChannelById',
            ObjectId: $stateParams.channelid,
        }
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
            $scope.data.currChnnl = data;
        })
    }
    //请求数据
    function requestData() {
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.params, 'post').then(function(data) {
            $scope.data.items = data;
            !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = "0";
            $scope.data.selectedArray = [];
            storeName($scope.data.items);
            fileCount($scope.data.items);
            previewPath();
        });
    }
    //全选
    $scope.selectAll = function() {
        $scope.data.selectedArray = $scope.data.selectedArray.length == $scope.data.items.length ? [] : []
            .concat($scope.data.items);
    };
    //单选
    $scope.selectDoc = function(item) {
        var index = $scope.data.selectedArray.indexOf(item);
        if (index < 0) {
            $scope.data.selectedArray.push(item);
        } else {
            $scope.data.selectedArray.splice(index, 1);
        }
    };
    /**
     * [storeName description]存储所有文件名
     */
    function storeName(content) {
        $scope.data.fileName = [];
        angular.forEach(content, function(value, key) {
            $scope.data.fileName.push(value.NAME);
        });
    }
    /**
     * [differenceType description]区分文件类型
     * @return {[type]} [description] null
     */
    $scope.differenceType = function(item) {
        var type = item.NAME.substring(item.NAME.lastIndexOf('.') + 1).toLowerCase();
        return $scope.status.fileType.indexOf(type) > -1 ? type : 'default';
    };
    /**
     * [previewPath description]预览路径
     */
    function previewPath() {
        $scope.status.pathArray = [];
        if ($scope.params.ParentPathName == "/") {
            $scope.status.pathArray.push("根目录");
            return;
        }
        var pathArray = $scope.params.ParentPathName.split("/");
        angular.forEach(pathArray, function(value, key) {
            key == 0 ? $scope.status.pathArray.push("根目录") : $scope.status.pathArray.push(value);
        });
    }
    /**
     * [pathJump description]用路径来跳转
     * @param  {[number]} index [description]当前所选路径在数组中的下标
     */
    $scope.pathJump = function(index) {
        if (index == 0) {
            $scope.params.ParentPathName = "/";
        } else {
            $scope.status.pathArray.shift();
            var parentPath = $scope.status.pathArray.slice(0, index);
            $scope.params.ParentPathName = "/" + parentPath.join("/");
        }
        requestData();
    }

    /**
     * [promptRequest description]具体操作数据请求成功后刷新列表
     * @param  {[obj]} params [description]请求参数
     * @param  {[string]} info   [description]提示语
     * @return {[type]}        [description]
     */
    function promptRequest(params, info) {
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            trsconfirm.alertType(info, "", "success", false, function() {
                requestData();
            });
        }, function() {
            requestData();
        });
    };
    /**
     * [unifyRequest description]统一操作请求后刷列表
     * @param  {[obj]} params [description]请求参数
     */
    function unifyRequest(params) {
        $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
            $timeout(requestData(), 300);
        });
    }
    /**
     * [fileCount description]文件和目录的数量
     */
    function fileCount(items) {
        var allLength = items.length,
            fileLength = 0;
        angular.forEach(items, function(value, key) {
            if (value.ISDIRECTORY == 'true') fileLength += 1;
        });
        $scope.status.count.file = fileLength;
        $scope.status.count.folder = allLength - fileLength;
    };
    /**
     * [newFolder description]新建目录
     */
    $scope.newFolder = function() {
        typingModel("新建目录", "", "", function(data) {
            var params = {
                'serviceid': "mlf_websitefile",
                'methodname': "createDir",
                'ChannelId': $stateParams.channelid,
                'ParentPathName': $scope.params.ParentPathName,
                'PathName': data
            }
            for (var i = 0; i < $scope.data.items.length; i++) {
                if ($scope.data.items[i].ISDIRECTORY == 'true' && $scope.data.items[i].NAME == data) {
                    trsconfirm.alertType('该目录名已存在', '', 'error', false);
                    return;
                }
            }
            unifyRequest(params);
        });
    };
    /**
     * [modifyFolderFile description]修改文件或目录名
     * @params item [obj] 当前所选文件或目录
     */
    $scope.modifyFolderFile = function(item) {
        var fileName = item.ISDIRECTORY == 'false' ? item.NAME.substring(0, item.NAME.lastIndexOf('.')) : item.NAME,
            type = item.ISDIRECTORY == 'false' ? item.NAME.substring(item.NAME.lastIndexOf('.')) : '';
        typingModel("重命名", fileName, type, function(name) {
            for (var i = 0; i < $scope.data.items.length; i++) {
                if ($scope.data.items[i].NAME == name + type && $scope.data.items[i].ISDIRECTORY == item.ISDIRECTORY && item.NAME != name + type) {
                    trsconfirm.alertType('文件名或目录名已存在', '', 'error', false);
                    return;
                }
            }
            var params = {
                'serviceid': "mlf_websitefile",
                'methodname': "rename",
                'ChannelId': $stateParams.channelid,
                'SrcPathName': item.ABSOLUTENAME,
                'NewName': name + type,
            };
            unifyRequest(params);
        });
    };
    /**
     * [deleteFolderFile description]修改文件或目录名
     * @params item [obj] 当前所选文件或目录
     */
    $scope.deleteFolderFile = function(item) {
        trsconfirm.confirmModel("删除", "您确认删除所选文件/目录", function() {
            var params = {
                'serviceid': "mlf_websitefile",
                'methodname': "remove",
                'ChannelId': $stateParams.channelid,
                'PathNames': trsspliceString.spliceString(item ? [item] : $scope.data.selectedArray, "ABSOLUTENAME", ','),
            };
            // unifyRequest(params);
            $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $timeout(requestData(), 300);
            }, function() {
                $timeout(requestData(), 300);
            });
        })
    };
    /**
     * [nextFolder description]点击目录进入下一级目录
     * @params item [obj] 当前所选目录
     */
    $scope.nextFolder = function(item) {
        $scope.params.ParentPathName = item.ABSOLUTENAME;
        requestData();
    };
    /**
     * [returnFolder description]点击返回上一级
     */
    $scope.returnFolder = function() {
        if ($scope.params.ParentPathName == "/") return;
        $scope.params.ParentPathName = $scope.params.ParentPathName.substring(0, $scope.params.ParentPathName.lastIndexOf("/"));
        if ($scope.params.ParentPathName == "") $scope.params.ParentPathName = "/";
        requestData();
    };
    /**
     * [typingModel description]新建/修改弹窗
     * @params title [string] 弹窗名
     * @params content [string] 内容主体
     * @params callback [fn] 成功后的方法
     */
    function typingModel(title, content, type, successFn) {
        var modalInstance = $modal.open({
            templateUrl: "./editingCenter/website/cloud/alertViews/newFile/newFile_tpl.html",
            windowClass: 'toBeCompiled-typing-window',
            backdrop: false,
            controller: "websiteCloudNewFileCtrl",
            resolve: {
                transmission: function() {
                    return {
                        title: title,
                        content: content,
                        type: type,
                    };
                }
            }
        });
        modalInstance.result.then(function(result) {
            successFn(result);
        });
    };
    /**
     * [preview description]预览
     * @params item [obj] 当前所选目录或文件
     */
    $scope.preview = function(item) {
        var params = {
            "serviceid": "mlf_websitefile",
            "methodname": "getURL",
            "ChannelId": $stateParams.channelid,
            "PathName": item.ABSOLUTENAME,
        }
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(url) {
            $window.open(url.replace(/"/g, ""));
        })
    };
    /**
     * [release description]发布
     * @params item [obj] 当前所选目录或文件
     */
    $scope.release = function(item) {
        var params = {
            'serviceid': "mlf_websitefile",
            'methodname': "publish",
            'ChannelId': $stateParams.channelid,
            'PathName': item.ABSOLUTENAME,
        };
        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(url) {
            copyModel(url.replace(/"/g, ""));
        })
    };
    /**
     * [copyModel description]复制弹框
     * @params url [string] 当前所选文件的目录
     * @params success [function] 成功后执行的回调
     */
    function copyModel(url, success) {
        var modalInstance = $modal.open({
            templateUrl: "./editingCenter/website/cloud/alertViews/copy/copy_tpl.html",
            windowClass: 'toBeCompiled-review-window',
            backdrop: false,
            controller: "editWebsiteCloudCopyCtrl",
            resolve: {
                copyParams: function() {
                    return {
                        url: url
                    };
                }
            }
        });
        modalInstance.result.then(function(result) {
            success(result);
        });
    }
    /**
     * [fileUpload description] 文件上传
     * @return {[type]} [description]
     */
    $scope.fileUpload = function() {
        newFileUpload.flieUpload($scope.params.ParentPathName, false, $scope.data.items, function() {
            requestData();
        });
    };
    /**
     * [templateUpload description] 上传模板
     * @return {[type]} [description]
     */
    $scope.templateUpload = function() {
        newFileUpload.flieUpload($scope.params.ParentPathName, true, $scope.data.items, function() {
            requestData();
        });
    };
    /**
     * [filesizeDisplay description]文件大小展示
     * @params filesize [obj] 当前所选目录或文件的大小
     */
    $scope.filesizeDisplay = function(filesize) {
        return filesize < 700 ? filesize + "KB" : (Number(filesize) / 1024).toFixed(1) + 'MB';
    };
    /**
     * [modifyFileOnline description]在线修改文件
     * @param  {[obj]} item [description]当前所选文件
     */
    $scope.modifyFileOnline = function(item) {
        modifyFileModel(item, $stateParams.channelid, function(result) {
            var params = {
                serviceid: "mlf_websitefile",
                methodname: "writeFileContent",
                ChannelId: $stateParams.channelid,
                FilePath: item.ABSOLUTENAME,
                FileContent: result,
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function() {
                trsconfirm.alertType('修改成功', '', 'success', false);
            });
        })
    };
    /**
     * [modifyFileModel description]在线修改文件弹窗
     * @param  {[obj]} item [description]当前所选文件
     */
    function modifyFileModel(file, channelid, success) {
        var modalInstance = $modal.open({
            templateUrl: "./editingCenter/website/cloud/alertViews/modifyFile/modifyFile_tpl.html",
            windowClass: 'eidt-website-cloud-modify',
            backdrop: false,
            controller: "websiteCloudModifyFileCtrl",
            resolve: {
                transmission: function() {
                    return {
                        file: file,
                        channelid: channelid,
                    };
                }
            }
        });
        modalInstance.result.then(function(result) {
            success(result);
        });
    };
    /**
     * [refresh description]在线修改文件弹窗
     */
    $scope.refresh = function() {
        requestData();
    };
    /**
     * [newFile description]新增文件
     */
    $scope.newFile = function() {
        createFileModel(function(result) {
            for (var i = 0; i < $scope.data.items.length; i++) {
                if ($scope.data.items[i].NAME == result && $scope.data.items[i].ISDIRECTORY == 'false') {
                    trsconfirm.alertType('文件名已存在', '', 'error', false);
                    return;
                }
            }
            var params = {
                'serviceid': 'mlf_websitefile',
                'methodname': 'createFile',
                'ChannelId': $stateParams.channelid,
                'PathName': $scope.params.ParentPathName,
                'FileName': result,

            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function() {
                requestData();
            })
        })
    };
    /**
     * [modifyFileModel description]在线修改文件弹窗
     * @param  {[obj]} item [description]当前所选文件
     */
    function createFileModel(success) {
        var modalInstance = $modal.open({
            templateUrl: "./editingCenter/website/cloud/alertViews/createFile/createFile_tpl.html",
            windowClass: 'eidt-website-cloud-create',
            backdrop: false,
            controller: "websiteCloudCreateFileCtrl",
        });
        modalInstance.result.then(function(result) {
            success(result);
        });
    };
}
