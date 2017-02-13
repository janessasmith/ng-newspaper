'use strict';
/**
 *  Module  配置管理初始化数据
 *
 * Description
 */
angular.module('initAllocationDataModule', [])
    .factory('initAllocationDataService', [function() {
        return {
            initAllocation: function() {
                var list = {
                    "ISCREATEXIAOYANG": false, // 是否生成小样文件 
                    "SPACENUMTYPE": 43, // 43无空格，44两个全角空格，45四个半角空格
                    "ISADDTITLEINXIAOYANG": false, //标题是否加入正文 
                    "XIAOYANGFILEPATHFORWIN":"", // 小样文件路径 (Windows)
                    "PAGETEMPLATEPATH": "", // 版心文件路径 
                    "XIAOYANGFILEPATH": "", // 小样文件路径 
                    "FITFILEBAKPATH": "", // 飞腾副本备份路径 
                    "FITFILEPATH": "", // 飞腾文件路径 
                    "COLORIMAGEXIAOYANGPATH": "", // 彩色图片照排路径 
                    "COLORIMAGEXIAOYANGPATHFORWIN":"", // 彩色图片照排路径(Windows)
                    "DAYANGMONITORPATH": "", // 大样文件路径
                    "DAYANGMONITORPATHFORWIN":"", // 大样文件路径//大样监控目录(Windows)
                    "GRAYIMAGEXIAOYANGPATH": "", // 灰色图片照排路径 
                    "GRAYIMAGEXIAOYANGPATHFORWIN":"", // 灰色图片照排路径 (Windows)
                    "CHANGLIUMONITORPATH": "", // 畅流监控目录 
                    "ADFILEPATH": "", // 广告传版目录 
                    "DPI": "240", // 照排图片的打印精度 
                    "ISCREATEPS": false, // 是否生成ps 
                    "ISCREATEPDF": false, // 是否生成pdf 
                    "ISCOPYPSTOCL": false, // 是否将ps文件复制到畅流监控目录 
                    "ISCOPYVFTTOCL": false, // 是否将vft文件复制到畅流监控目录 
                    "ISCOPYPDFTOCL": false, // 是否将pdf文件复制到畅流监控目录 
                    "ISCOPYICONPICTOCL": false, // 是否将版面图标文件复制到畅流监控目录 
                    "ISCOPYBRIEFPICTOCL": false, // 是否将版面简图文件复制到畅流监控目录 
                    "ISCOPYACTUALPICTOCL": false, // 是否将版面真图文件复制到畅流监控目录 
                    "ISCREATEPAGEICONPIC": false, // 是否生成版面图标 
                    "ICONPICINFO": // 生成版面图标参数值  
                    {
                        "MAXWIDTH": "", // 最大宽度   
                        "MAXHEIGHT": "1024", // 最大高度   
                        "QUALITY": "0", // 图像质量   
                        "DPI": "2048" // dpi精度  
                    },
                    "ISCREATEPAGEBRIEFPIC": true, // 是否生成版面简图 
                    "BRIEFPICINFO": {
                        "MAXWIDTH": "",
                        "MAXHEIGHT": "1024",
                        "QUALITY": "0",
                        "DPI": "2048"
                    },
                    "ISCREATEPAGEACTUALPIC": true, // 是否生成版面真图 
                    "ACTUALPICINFO": {
                        "MAXWIDTH": "",
                        "MAXHEIGHT": "1024",
                        "QUALITY": "0",
                        "DPI": "2048"
                    },
                    "SIGNUSES": // 签样者 
                        [],
                    "EDITORS": // 版面编辑 
                        []
                };
                return list;
            },
            initAllocationSelect: function() {
                var list = [{
                    name: "无空格",
                    value: "43"
                }, {
                    name: "两个全角空格",
                    value: "44"
                }, {
                    name: "四个半角空格",
                    value: "45"
                }];

                return list;
            },
            chooseImages: function() {
                var images = [{
                    "desc": '最高',
                    'value': 0,
                    'isSelected': false
                }, {
                    "desc": '非常好',
                    'value': 1,
                    'isSelected': false
                }, {
                    "desc": '较好',
                    'value': 2,
                    'isSelected': false
                }, {
                    "desc": '一般',
                    'value': 3,
                    'isSelected': false
                }, {
                    "desc": '最低',
                    'value': 4,
                    'isSelected': false
                }];
                return images;
            },
            //川报修改
            initCbData:function(){
                var cbList = {
                    "authorizedItems":[]
                };
                return cbList;
            }
        };
    }]);
