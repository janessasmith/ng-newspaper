'use strict';
angular.module("resourceCenterinitComDataModule", []).
factory("initComDataService", function($q,trsHttpService) {
    return {
        timeRange: function(argument) {
            return [{
                name: "全部时间",
                value: "0"
            }, {
                name: "今天",
                value: "0d"
            }, {
                name: "昨天",
                value: "1d"
            }, {
                name: "最近三天",
                value: "2d"
            }, {
                name: "最近半个月",
                value: "15d"
            }, {
                name: "近一个月",
                value: "1m"
            }];
        },
        newsType: function() {
            return [{
                name: "全部稿件",
                value: ""
            }, {
                name: "新闻稿件",
                value: "1"
            }, {
                name: "图集稿件",
                value: "2"
            }]
        },
        picSize: function() {
            return [{
                name: "全部",
                value: ""
            }, {
                name: "特大",
                value: "1"
            }, {
                name: "大",
                value: "2"
            }, {
                name: "中",
                value: "3"
            }, {
                name: "小",
                value: "4"
            }]
        },
        videoType: function() {
            return [{
                name: "全部",
                value: ""
            }, {
                name: "音频",
                value: "A"
            }, {
                name: "视频",
                value: "V"
            }];
        },
        definitionLevel: function() {
            return [{
                name: "全部",
                value: ""
            }, {
                name: "高清",
                value: "1"
            }, {
                name: "普通",
                value: "2"
            }, {
                name: "流畅",
                value: "3"
            }]
        },
        sourceWebsite: function() {
            return [{
                name: "全部稿件",
                value: ""
            }, {
                name: "新浪",
                value: "1"
            }, {
                name: "腾讯",
                value: "2"
            }]
        },
        docType: function() {
            return [{
                name: "全部稿件",
                value: ""
            }, {
                name: "政治新闻",
                value: "1"
            }, {
                name: "经济新闻",
                value: "2"
            }, {
                name: "文化新闻",
                value: "3"
            }, {
                name: "社会新闻",
                value: "4"
            }, {
                name: "生态新闻",
                value: "5"
            }, {
                name: "体育新闻",
                value: "6"
            }, {
                name: "图片新闻",
                value: "7"
            }, {
                name: "言论评论",
                value: "8"
            }]
        },
        newsdocTypes: function() {
            return [{
                name: "稿件类型",
                value: ""
            }, {
                name: "新闻稿件",
                value: "1"
            }, {
                name: "图集稿件",
                value: "2"
            }]
        },
        sourceLevel: function() {
            return [{
                name: "信源等级",
                value: ""
            }, {
                name: "全部",
                value: "0"
            }, {
                name: "顶级",
                value: "1"
            }, {
                name: "高级",
                value: "2"
            }, {
                name: "一般",
                value: "3"
            }]
        },
        layouts: function() {
            return [{
                name: "版面",
                value: ""
            }, {
                name: "全部",
                value: "0"
            }, {
                name: "版面A",
                value: "1"
            }, {
                name: "版面B",
                value: "2"
            }]
        },
        edition: function() {
            return [{
                name: "版次",
                value: ""
            }, {
                name: "1版",
                value: "0"
            }, {
                name: "2版",
                value: "1"
            }, {
                name: "3版",
                value: "2"
            }]
        },
        searchKeyType: function() {
            return [{
                name: "全部",
                value: ""
            }, {
                name: "ID",
                value: "DocID"
            }, {
                name: "创建人",
                value: "Cruser"
            }, {
                name: "标题",
                value: "docTitle"
            }, {
                name: "正文",
                value: "Content"
            }]
        },
        //邮件稿稿件类型
        emailNewsdocTypes: function() {
            return [{
                name: "稿件类型",
                value: "0"
            }, {
                name: "新闻稿件",
                value: "1"
            }, {
                name: "图集稿件",
                value: "2"
            }]
        },
        //排序方式
        shareSort: function() {
            return [{
                name: "排序方式",
                value: ""
            }, {
                name: "时间倒排",
                value: "time"
            }, {
                name: "相关度",
                value: ""
            }]
        },
        //日志管理时间
        logMgrTime: function() {
            return [{
                name: "全部时间",
                value: "all"
            }, {
                name: "近一个月",
                value: "1m"
            }]
        },
        //日志管理类型
        logMgrType: function() {
            return [{
                name: "全部产品",
                value: ""
            }, {
                name: "I我",
                value: "I我"
            }, {
                name: "报纸",
                value: "报纸"
            }, {
                name: "网站",
                value: "网站"
            }]
        },

        //川报修改
        cbDocClassify:function(){
            var deferred = $q.defer();
            var params = {
                serviceid:"mlf_xhsgsource",
                methodname:"queryDocClassifys"
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                var arr = [{
                    name:"全部分类",
                    value:""
                }];
                angular.forEach(data,function(val,key){
                    arr.push({
                        name:val.DOCCLASSIFYNAME,
                        value:val.DOCCLASSIFYID
                    });
                });
                deferred.resolve(arr);
            });
            return deferred.promise;
        }
    }
});
