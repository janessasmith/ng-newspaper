"use strict";
angular.module('components.service', [
    'components.service.loginServiceModule',
    'storageLIstenerModule',
    'trsspliceStringModule',
    'trsngsweetalert',
    'trsResponseHandleModule',
    'trsSelectItemByTreeModule',
    "trsSelectDocumentModule",
    "trsPicturePreviewModule",
    "trsColumnTreeLocation",
    "trsGroupTreeLocation",
    "treeServiceModule",
    "trsLunarDateModule",
    "trsUploadAudioVideoModule",
]).factory('globleParamsSet', ["$window", "trsHttpService", "trsconfirm", function($window, trsHttpService, trsconfirm) {
    return {
        getPageSize: function() {
            var defaultPageSize = 50;
            return defaultPageSize;
        },
        setResourceCenterPageSize: 20,
        digitalNewspaper: "http://10.100.60.22:7001/login.jsp",
        handlePermissionData: function(_processedData) {
            var processedData = {};
            angular.forEach(_processedData, function(data, index, array) {
                var dataArray = data.split(".");
                if (angular.isDefined(processedData[dataArray[1]])) {
                    processedData[dataArray[1]][dataArray[2]] = true;
                } else {
                    processedData[dataArray[1]] = {};
                    processedData[dataArray[1]][dataArray[2]] = true;
                }
            });
            return processedData;
        },
        /**
         * [asaveVersionIntervaltime description]编辑器保存本地版本间隔时间
         * @param  {[type]} chl [description]
         * @return {[type]}     [description]
         */
        asaveVersionIntervaltime: function() {
            return 120000; //三分钟
        },
        /**
         * [arrayContrast description]数组对比合并
         * @param  {[array]} array1 [description] 数组1
         * @param  {[array]} array2 [description] 数组2
         * @param  {[string]} attribute [description] 对比属性1
         * @param  {[string]} _attribute [description] 对比属性2
         * @return {[array]}  [description] 合并后的数组
         */
        arrayContrast: function(array1, array2, attribute, _attribute) {
            angular.forEach(array1, function(data, index, array) {
                var flag = true;
                angular.forEach(array2, function(_data, _index, _array) {
                    if (data[attribute] === _data[attribute] && data[_attribute] === _data[_attribute]) {
                        flag = false;
                    }
                });
                if (flag) {
                    array2.push(data);
                }
            });
            return array2;
        },
        /**
         * [contrastAfExclArray description]对比后剔除数组开始
         * @param  {[array]} array1 [description] 数组1
         * @param  {[array]} array2 [description] 数组2
         * @param  {[string]} attribute [description] 数组1对比属性
         * @param  {[string]} _attribute [description] 数组2对比属性
         * @param  {[Fn]} success [description] 回调函数
         * @return {[null]}  [description]
         */
        contrastAfExclArray: function(array1, array2, attribute, _attribute, success) {
            angular.forEach(array1, function(data, index, array) {
                var i = 0;
                while (i < array2.length) {
                    if (data[attribute] === array2[i][attribute] && data[_attribute] === array2[i][_attribute]) {
                        array2.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            });
            success(array2);
        },
        /**
         * [getBigFaceContent description]获取用于大花脸比对的正文
         * @param  {[array]} htmlContent [description] 数组1
         * @return {[string]}  [description] 处理过后的正文
         */
        getBigFaceContent: function(htmlContent) {
            var dom = document.createElement("div");
            dom.innerHTML = htmlContent;
            $(dom).find("ol").each(function(index) {
                $(this).find("li").each(function(_index) {
                    $(this).html((_index + 1) + "." + $(this).html());
                });
            });
            htmlContent = dom.innerHTML;
            htmlContent = htmlContent.replace(/<\/p>/g, '\n')
                .replace(/<(p|div)[^>]*>/ig, '')
                .replace(/<br\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/&nbsp;/g, '\u3000')
                .replace(/\u0020/g, '\u3000')
                .replace(/\n+/g, "\n");
            if (htmlContent[htmlContent.length - 1] === "\n") { //去掉文章末尾的换行
                htmlContent = htmlContent.substring(0, htmlContent.length - 1);
            }
            return htmlContent;
        }
    }

}]);
