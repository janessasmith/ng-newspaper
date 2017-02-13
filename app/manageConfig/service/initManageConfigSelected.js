'use strict';
/**
 *  Module 初始化 配置管理中的下拉框或单选框
 * Description  
 */
angular.module('initManageConDropDownModule', [])
    .factory('initManageConSelectedService', ['trsHttpService', '$q', function(trsHttpService, $q) {
        return {
            getPartterns: function() {
                var partterns = [{
                    "desc": "一级审核",
                    "value": 0,
                    "isSelected": false
                }, {
                    "desc": "二级审核",
                    "value": 1,
                    "isSelected": false
                }];
                return partterns;
            },
            getAppearances: function() {
                var appearances = [{
                    "desc": "启用",
                    "value": 1,
                    "isSelected": false
                }, {
                    "desc": "停用",
                    "value": 0,
                    "isSelected": false
                }];
                return appearances;
            },
            getGenres: function() {
                var genres = [{
                    "desc": "无",
                    "value": 0,
                    "isSelected": false
                }, {
                    "desc": "方正飞腾",
                    "value": 1,
                    "isSelected": false
                }, {
                    "desc": "Indesign",
                    "value": 2,
                    "isSelected": false
                }];
                return genres;
            },
            //初始化网站站点下所有一级子栏目(频道)
            getWebsiteAllChannels: function(siteId) {
                var deffered = $q.defer();
                var params = {
                    serviceid: "mlf_websiteconfig",
                    methodname: "queryChannelsBySite",
                    SiteId: siteId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    var channelDroplistJson = data;
                    var options = [];
                    for (var key in channelDroplistJson) {
                        options.push({
                            name: channelDroplistJson[key].CHNLDESC,
                            value: channelDroplistJson[key].CHNLORDER
                        });
                    }
                    deffered.resolve(options);
                });
                return deffered.promise;
            },
            //栏目类型
            typeofColumn: function() {
                var columnType = [{
                    name: "只是栏目",
                    value: "0"
                }, {
                    name: "作为标签",
                    value: "24"
                }, {
                    name: "既是栏目又是标签",
                    value: "25"
                }];
                return columnType;
            },
            //网站新建模板下的模板类型
            websiteTempType: function() {
                var websiteTempTypeJsons = [{
                    name: "全部模板",
                    value: "0"
                }, {
                    name: "概览",
                    value: "11"
                }, {
                    name: "细缆",
                    value: "12"
                }, {
                    name: "嵌套",
                    value: "10"
                }];
                return websiteTempTypeJsons;
            },

            //网站新建模板下的模板类型
            tempType: function() {
                var tempTypeJsons = [{
                    name: "概览",
                    value: "1"
                }, {
                    name: "细缆",
                    value: "2"
                }, {
                    name: "嵌套",
                    value: "0"
                }];
                return tempTypeJsons;
            },
            //网站模板管理导入模板ImportMode
            getImportmode: function() {
                var importmode = [{
                    desc: "自动覆盖",
                    value: "1"
                }, {
                    desc: "自动更名",
                    value: "3"
                }, {
                    desc: "提示返回",
                    value: "2"
                }];
                return importmode;
            },
            getPicmode: function() {
                var picmode = [{
                    desc: "自动覆盖",
                    value: "1"
                }, {
                    desc: "自动更名",
                    value: "3"
                }, {
                    desc: "提示返回",
                    value: "2"
                }];
                return picmode;
            },
            //网站文件编码
            fileCompilation: function() {
                var fileCompilationJsons = [{
                    name: "请选择",
                    value: ""
                }, {
                    name: "UTF-8",
                    value: "UTF-8"
                }, {
                    name: "简体中文",
                    value: "GBK"
                }, {
                    name: "英文",
                    value: "iso-8859-1"
                }, {
                    name: "法语",
                    value: "iso-8859-1"
                }, {
                    name: "俄语",
                    value: "windows-1251"
                }, {
                    name: "西班牙语",
                    value: "iso-8859-1"
                }, {
                    name: "阿拉伯语",
                    value: "windows-1256"
                }, {
                    name: "中文繁体",
                    value: "big5"
                }, {
                    name: "葡萄牙语",
                    value: "iso-8859-1"
                }, {
                    name: "德语",
                    value: "iso-8859-1"
                }, {
                    name: "意大利语",
                    value: "iso-8859-1"
                }, {
                    name: "荷兰语",
                    value: "iso-8859-1"
                }, {
                    name: "保加利亚语",
                    value: "windows-1251"
                }, {
                    name: "波兰语",
                    value: "iso-8859-2"
                }, {
                    name: "罗马尼亚语",
                    value: "windows-1250"
                }, {
                    name: "匈牙利语",
                    value: "iso-8859-2"
                }, {
                    name: "捷克语",
                    value: "windows-1250"
                }, {
                    name: "朝鲜语",
                    value: "euc-kr"
                }, {
                    name: "泰国语",
                    value: "windows-874"
                }, {
                    name: "土耳其语",
                    value: "windows-1254"
                }, {
                    name: "越南语",
                    value: "windows-1258"
                }, {
                    name: "蒙古语",
                    value: "windows-1251"
                }, {
                    name: "印尼语",
                    value: "iso-8859-1"
                }, {
                    name: "日语",
                    value: "euc-jp"
                }];
                return fileCompilationJsons;
            },
            //网站敏感词等级
            websiteSensitiveLevel: function() {
                var sensitiveLevelJsons = [{
                    name: "一般",
                    value: "1"
                }, {
                    name: "严重",
                    value: "2"
                }];
                return sensitiveLevelJsons;
            },
            getWebsiteAllColumn: function(chnId) {
                var deffered = $q.defer();
                var params = {
                    serviceid: "mlf_websiteconfig",
                    methodname: "queryChannelsByChannel",
                    ChannelId: chnId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    var channelDroplistJson = data;
                    var options = [];
                    for (var key in channelDroplistJson) {
                        options.push({
                            name: channelDroplistJson[key].CHNLDESC,
                            value: channelDroplistJson[key].CHNLORDER
                        });
                    }
                    deffered.resolve(options);
                });
                return deffered.promise;
            },
        };
    }]);
