'use strict';
/**
 *  Module  单选框的数据
 *
 * Description
 * auth  ly
 */
angular.module('initSingleSelectionModule', []).factory('initSingleSelecet', ['trsHttpService', '$q', function(trsHttpService, $q) {
    return {
        //文档状态
        docStatus: function() {
            var singleJsons = [{
                name: "全部状态",
                value: ""
            }, {
                name: "待编",
                value: "1"
            }, {
                name: "退稿",
                value: "3"
            }];
            return singleJsons;
        },
        //文档类型
        docType: function() {
            var docTypeJsons = [{
                name: "稿件类型",
                value: ""
            }, {
                name: "新闻",
                value: "1"
            }, {
                name: "图集",
                value: "2"
            }, {
                name: "专题",
                value: "3"
            }, {
                name: "网页",
                value: "4"
            }];
            return docTypeJsons;
        },
        //版面类型
        pageType: function() {
            var pageTypeJsons = [{
                name: "所有版面",
                value: ""
            }, {
                name: "社会要闻",
                value: "1"
            }, {
                name: "社会1版",
                value: "2"
            }, {
                name: "社会2版",
                value: "3"
            }, {
                name: "社会3版",
                value: "4"
            }];
            return pageTypeJsons;
        },
        //全部时间
        timeType: function() {
            var timeTypeJsons = [{
                name: "全部时间",
                value: "0"
            }, {
                name: "最近一天",
                value: "0d"
            }, {
                name: "最近三天",
                value: "2d"
            }, {
                name: "近一个月",
                value: "1m"
            }];
            return timeTypeJsons;
        },
        //创建时间
        createTime: function() {
            var timeTypeJsons = [{
                name: "创建时间",
                value: ""
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
                name: "近一个月",
                value: "1m"
            }];
            return timeTypeJsons;
        },
        //i我最后版本时间
        iWoOperTime: function() {
            var operTimeJsons = [{
                name: "全部时间",
                value: ""
            }, {
                name: "最近一天",
                value: "0d"
            }, {
                name: "最近三天",
                value: "2d"
            }, {
                name: "近一个月",
                value: "1m"
            }];
            return operTimeJsons;
        },
        //结束时间
        EndtimeType: function() {
            var endTimeTypeJsons = [{
                name: "最后版本时间",
                value: ""
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
                name: "近一个月",
                value: "1m"
            }];
            return endTimeTypeJsons;
        },
        //删除时间
        delletetimeType: function() {
            var endTimeTypeJsons = [{
                name: "最后删除时间",
                value: "0"
            }, {
                name: "今天",
                value: "0D"
            }, {
                name: "昨天",
                value: "1D"
            }, {
                name: "最近三天",
                value: "2D"
            }, {
                name: "近一个月",
                value: "1M"
            }];
            return endTimeTypeJsons;
        },
        //选择日期
        chooseTimeType: function() {
            var endTimeTypeJsons = [{
                name: "全部时间",
                value: ""
            }, {
                name: "最近一天",
                value: "0d"
            }, {
                name: "最近三天",
                value: "2d"
            }, {
                name: "近一个月",
                value: "1m"
            }];
            return endTimeTypeJsons;
        },
        //I我类型
        iWoDocStatus: function() {
            var docStatusJsons = [{
                name: "全部状态",
                value: ""
            }, {
                name: "状态1",
                value: "1"
            }, {
                name: "状态2",
                value: "2"
            }];
            return docStatusJsons;
        },
        //I我状态
        iWoDocType: function() {
            var docTypeJsons = [{
                name: "稿件类型",
                value: ""
            }, {
                name: "新闻",
                value: "1"
            }, {
                name: "图集",
                value: "2"
            }];
            return docTypeJsons;
        },
        //iWo已收稿库状态
        iWoReceiveDocStatus: function() {
            var receiveDocStatus = [{
                name: "全部状态",
                value: ""
            }, {
                name: "待审",
                value: "2"
            }, {
                name: "退稿",
                value: "3"
            }, {
                name: "回收",
                value: "1030"
            }, {
                name: "取稿",
                value: "1033"
            }, {
                name: "特取",
                value: "1031"
            }];
            return receiveDocStatus;
        },
        //I我渠道
        iWoChannel: function() {
            var docTypeJsons = [{
                name: "全部渠道",
                value: ""
            }, {
                name: "渠道1",
                value: "1"
            }, {
                name: "渠道2",
                value: "2"
            }];
            return docTypeJsons;
        },
        //I我全部
        iWoEntire: function() {
            var iWoEntireJsons = [{
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
            }];
            return iWoEntireJsons;
        },
        //I我来源
        iWoSource: function() {
            var iWoSourceJsons = [{
                name: "来源",
                value: ""
            }, {
                name: "来源1",
                value: "1"
            }, {
                name: "来源2",
                value: "2"
            }, {
                name: "来源3",
                value: "3"
            }, {
                name: "来源4",
                value: "4"
            }];
            return iWoSourceJsons;
        },
        //I我收藏
        iWoCollect: function() {
            var iWoEntireJsons = [{
                name: "全部收藏时间",
                value: ""
            }, {
                name: "最近一天",
                value: "0d"
            }, {
                name: "最近三天",
                value: "2d"
            }, {
                name: "近一个月",
                value: "1m"
            }];
            return iWoEntireJsons;
        },
        //I我常用资源自定义时间筛选
        iWoCustomQueryTime: function() {
            var timeTypeJsons = [{
                name: "全部时间",
                value: ""
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
                name: "近一个月",
                value: "1m"
            }];
            return timeTypeJsons;
        },
        //I我常用资源自定义类型筛选
        iWoCustomQueryType: function() {
            var docTypeJsons = [{
                name: "全部稿件",
                value: ""
            }, {
                name: "新闻稿件",
                value: "1"
            }, {
                name: "图集稿件",
                value: "2"
            }];
            return docTypeJsons;
        },
        //I我常用资源自定义稿件种类筛选
        iWoCustomQueryNewsType: function() {
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
            }];
        },
        //I我废稿箱查询时间
        iWoDraftBoxQueryTime: function() {
            var timeTypeJsons = [{
                name: "全部时间",
                value: ""
            }, {
                name: "最近一天",
                value: "0d"
            }, {
                name: "最近三天",
                value: "2d"
            }, {
                name: "近一个月",
                value: "1m"
            }];
            return timeTypeJsons;
        },
        //I我收藏创建时间
        iWoCollectCreatTime: function() {
            var timeTypeJsons = [{
                name: "全部创建时间",
                value: ""
            }, {
                name: "最近一天",
                value: "0d"
            }, {
                name: "最近三天",
                value: "2d"
            }, {
                name: "近一个月",
                value: "1m"
            }];
            return timeTypeJsons;
        },
        //I我类别
        iWoCategory: function() {
            var iWoCategoryJsons = [{
                name: "类别筛选",
                value: ""
            }, {
                name: "新闻",
                value: "1"
            }, {
                name: "稿件",
                value: "2"
            }, {
                name: "专题",
                value: "3"
            }];
            return iWoCategoryJsons;
        },
        //筛选时间
        iWoFilterTime: function() {
            var iWoFilterTimeJsons = [{
                name: "全部时间",
                value: "0"
            }, {
                name: "今天",
                value: "0D"
            }, {
                name: "昨天",
                value: "1D"
            }, {
                name: "最近三天",
                value: "2D"
            }, {
                name: "近一个月",
                value: "1M"
            }];
            return iWoFilterTimeJsons;
        },
        //文档类型D
        websiteCancelDraftDocType: function() {
            var docTypeJsons = [{
                name: "稿件类型",
                value: ""
            }, {
                name: "新闻",
                value: "1"
            }, {
                name: "图集",
                value: "2"
            }];
            return docTypeJsons;
        },
        //报纸版面
        newspaperPage: function() {
            var newspaperPageJsons = [{
                name: "所有版面",
                value: ""
            }, {
                name: "新闻要闻",
                value: "1"
            }, {
                name: "社会1版",
                value: "2"
            }, {
                name: "社会2版",
                value: "3"
            }, {
                name: "经济一版",
                value: "4"
            }, {
                name: "。。。。",
                value: "5"
            }];
            return newspaperPageJsons;
        },
        //报纸状态
        newspaperState: function() {
            var newspaperStateJsons = [{
                name: "所有状态",
                value: ""
            }, {
                name: "待处理",
                value: "1"
            }, {
                name: "草稿",
                value: "2"
            }, {
                name: "退稿",
                value: "3"
            }];
            return newspaperStateJsons;
        },
        //报刊管理状态
        newspaperManageState: function() {
            var newspaperManageStateJsons = [{
                name: "全部状态",
                value: ""
            }, {
                name: "启用",
                value: "0"
            }, {
                name: "停用",
                value: "-1"
            }];
            return newspaperManageStateJsons;
        },
        //报纸类型
        newspaperType: function() {
            var newspaperTypeJsons = [{
                name: "稿件类型",
                value: ""
            }, {
                name: "新闻",
                value: "1"
            }, {
                name: "专题",
                value: "2"
            }, {
                name: "图集",
                value: "3"
            }];
            return newspaperTypeJsons;
        },
        //报纸类型
        newspaperDraftType: function() {
            var newspaperDraftTypeJsons = [{
                name: "稿件类型",
                value: ""
            }, {
                name: "新闻",
                value: "1"
            }, {
                name: "图集",
                value: "2"
            }];
            return newspaperDraftTypeJsons;
        },
        //报纸时间
        newspaperDraftTime: function() {
            var newspaperDraftTimeJsons = [{
                name: "全部时间",
                value: ""
            }, {
                name: "最近一天",
                value: "0d"
            }, {
                name: "最近三天",
                value: "2d"
            }, {
                name: "近一个月",
                value: "1m"
            }];
            return newspaperDraftTimeJsons;
        },
        //报纸已签稿状态
        newspaperSignedStatus: function() {
            var newspaperSignedStatusJsons = [{
                name: "所有状态",
                value: ""
            }, {
                name: "已签稿",
                value: "35"
            }, {
                name: "已见报",
                value: "38"
            }, {
                name: "飞腾上版",
                value: "36"
            }, {
                name: "飞腾撤稿",
                value: "37"
            }];
            return newspaperSignedStatusJsons;
        },
        //渠道类型
        channelStatus: function() {
            var deferred = $q.defer();
            var params = {
                "serviceid": "mlf_releaseSource",
                "methodname": "queryAllMediaType",
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                var newspaperTypeJsons = data;
                var channel = [];
                for (var key in newspaperTypeJsons) {
                    channel.push({
                        name: newspaperTypeJsons[key].MEDIATYPE,
                        value: newspaperTypeJsons[key].SITEID
                    });
                }
                deferred.resolve(channel);
            });
            return deferred.promise;
        },
        getChannelList: function() {
            var deferred = $q.defer();
            trsHttpService.httpServer("./editingCenter/properties/iWoSingleRadioData.json", {}, "get").then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getDieciData: function(parerId, isInManageConfig) {
            var deffered = $q.defer();
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryDieCis",
                "PaperId": parerId,
            };
            if(isInManageConfig){
                params.serviceid = "mlf_paperset";
            }
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                var dieciDroplistJson = data;
                var options = [];
                for (var key in dieciDroplistJson) {
                    options.push({
                        name: dieciDroplistJson[key].CHNLDESC,
                        value: dieciDroplistJson[key].CHANNELID
                    });
                }
                deffered.resolve(options);
            });
            return deffered.promise;
        },
        //分页类型
        getPageCount: function() {
            var pageCountJsons = [{
                name: "20",
                value: 20
            }, {
                name: "50",
                value: 50
            }, {
                name: "100",
                value: 100
            }];
            return pageCountJsons;
        },
        //网站稿件来源
        websiteSource: function() {
            var deferred = $q.defer();
            var params = {
                "serviceid": "mlf_website",
                "methodname": "getReleaseSource",
            };
            trsHttpService.httpServer("/wcm/mlfcenter.do", params, "post").then(function(data) {
                var SourceJson = data;
                var channel = [];
                for (var key in SourceJson) {
                    channel.push({
                        name: SourceJson[key].SRCNAME,
                        value: SourceJson[key].SOURCEID
                    });
                }
                deferred.resolve(channel);
            });
            return deferred.promise;
        },
        websiteDocType: function() {
            var docTypeJsons = [{
                name: "稿件类型",
                value: ""
            }, {
                name: "新闻",
                value: "1"
            }, {
                name: "图集",
                value: "2"
            }, {
                name: "专题",
                value: "3"
            }, {
                name: "链接",
                value: "4"
            }];
            return docTypeJsons;
        },
        //叠次
        dieciSource: function() {
            var dieciJsons = [{
                "name": "全部叠次",
                "value": ""
            }, {
                "name": "A叠",
                "value": "0"
            }, {
                "name": "B叠",
                "value": "1"
            }];
            return dieciJsons;
        },
        //照排版面状态
        ZPLayoutStatus: function() {
            var ZPLayoutStatusJsons = [{
                name: "全部状态",
                value: ""
            }, {
                name: "启用",
                value: "0"
            }, {
                name: "停用",
                value: "-1"
            }];
            return ZPLayoutStatusJsons;
        },
        //退稿单选
        radioOfRejection: function() {
            var rejectionJsons = [{
                name: "退回经手人",
                value: '0'
            }, {
                name: "退回其他人",
                value: '1'
            }, {
                name: "退回原稿库",
                value: '2'
            }];
            return rejectionJsons;
        },

        //今日稿状态
        todayManuStatus: function() {
            var todayManuStatusJsons = [{
                name: "所有状态",
                value: ''
            }, {
                name: "今日稿",
                value: '30'
            }, {
                name: "撤稿",
                value: '32'
            }, {
                name: "取消签发",
                value: "33"
            }];
            return todayManuStatusJsons;
        },

        //排序方式
        sortType: function() {
            var sortTypeJsons = [{
                name: "排序方式",
                value: ""
            }, {
                name: "时间倒排",
                value: "time"
            }, {
                name: "相关度",
                value: ""
            }];
            return sortTypeJsons;
        },
        //媒体类型
        mediaType: function(){
            var mediaTypeJsons = [{
                name: "媒体类型",
                value: ""
            },{
                name: "app",
                value: "1"
            }, {
                name: "网站",
                value: "2"
            }, {
                name: "报纸",
                value: "3"
            }, {
                name: "微信",
                value: "4"
            }, {
                name: "微博",
                value: "5"
            }];
            return mediaTypeJsons;
        }
    };
}]);
