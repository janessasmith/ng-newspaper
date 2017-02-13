"use strict";
angular.module('resourceCenterServiceModule', []).
factory('resourceCenterService', ["trsHttpService", function(trsHttpService) {
    var rooturl = trsHttpService.getBigDataRootUrl();
    var wcmurl = trsHttpService.getWCMRootUrl();
    return {
        getModal:"",//获得各平台的modal值
        // 左侧列表
        getBase: function(extraparams) {
            var params = {
                "serviceid": "navigation",
                "typeid": "zyzx",
                "modelid": "base",
                "parentId": -1,
                "level": 1,
                "excludeId": -1,
                "containParent": true
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        getSingle: function(extraparams) {
            var params = {
                "serviceid": "navigation",
                "typeid": "zyzx",
                "modelid": "single"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        // 共享稿库右侧列表
        queryTongYiGongGao: function(extraparams) {
            var params = {
                "serviceid": "mlf_releaseSource",
                "methodname": "queryTongYiGongGao"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        //共享稿库本媒体稿
        // queryMediaRelease: function(extraparams) {
        //     var params = {
        //         "serviceid": "mlf_releasesource",
        //         "methodname": "queryMediaRelease"
        //     };
        //     params = angular.extend(params, extraparams);
        //     return trsHttpService.httpServer(wcmurl, params, "post");
        // },
        // 获取右侧列表
        getListbyItem: function(extraparams) {
            var params = {
                "modelid": "findFromNavigation",
                "typeid": "zyzx"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        // 未更新条目数
        getPageInfobyItem: function(extraparams) {
            var params = {
                "modelid": "getNumberOfNewRecords",
                "typeid": "zyzx"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        // 收藏 wcm
        collectDocs: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                'serviceid': "mlf_myrelease",
                'methodname': "collect"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        //导出操作
        exportDraft: function(ids) {
            var params = {
                serviceid: 'mlf_exportword',
                methodname: 'exportWordFile',
                MetaDataIds: ids,
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                // window.open(data);
                window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
            });
        },
        //导出 大数据
        exportBigDataDraft: function(ids, channelName, indexName) {
            var params = {
                serviceid: 'mlf_exportword',
                methodname: 'exportBigDataDocs',
                GUIDS: ids,
                CHANNELNAMES: channelName,
                indexName: indexName
            };
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                // window.open(data);
                window.open("/wcm/app/file/read_file.jsp?FileName=" + data);
            });
        },
        // 收藏 大数据
        collectBigDataDocs: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                'serviceid': "mlf_bigdataexchange",
                'methodname': "collect"
            };
            params = angular.extend(params, extraparams)
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        // 加入创作轴
        setCreation: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "methodname": "setBatchCreation",
                "serviceid": "mlf_releasesource"
            }
            params = angular.extend(params, extraparams)
            return trsHttpService.httpServer(wcmurl, params, "post")
        },
        // 加入大数据创作轴
        setBigDataCreation: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "methodname": "batchcreation",
                "serviceid": "mlf_bigdataexchange"
            }
            params = angular.extend(params, extraparams)
            return trsHttpService.httpServer(wcmurl, params, "post")
        },
        // 加入大数据创作轴
        setBigDataBatchCreation: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "methodname": "batchcreation",
                "serviceid": "mlf_bigdataexchange"
            }
            params = angular.extend(params, extraparams)
            return trsHttpService.httpServer(wcmurl, params, "post")
        },
        // 取稿－－共享稿库
        getFetch: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "methodname": "fetch",
                "serviceid": "mlf_releasesource"
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        // 取稿－－大数据
        getBigDataFetch: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "methodname": "fetch",
                "serviceid": "mlf_bigdataexchange"
            }
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        // 预留 wcm
        delayFetch: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "methodname": "delayFetch",
                "serviceid": "mlf_releasesource"
            }
            params = angular.extend(params, extraparams)
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        // 预留 大数据
        delayBigDataFetch: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "methodname": "delay",
                "serviceid": "mlf_bigdataexchange"
            };
            params = angular.extend(params, extraparams)
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        getTags: function(extraparams) {
            var params = {
                "methodname": "queryFlag",
                "serviceid": "mlf_bigdataexchange"
            };
            params = angular.extend(params, extraparams)
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        getWcmTags: function(extraparams) {
            var params = {
                "methodname": "queryFlag",
                "serviceid": "mlf_releasesource"
            };
            params = angular.extend(params, extraparams)
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        getOperTags: function(extraparams) {
            var params = {
                "methodname": "queryOpers",
                "serviceid": "mlf_releasesource"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        // 川报修改
        getCbOperTags: function(extraparams) {
            var params = {
                serviceid: "mlf_xhsgsource",
                methodname: "queryFlagListOfXHSG"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        //川报修改{}
        getCbCustomOperTags: function(extraparams) {
            var params = {
                serviceid: "mlf_cusmodaldoc",
                methodname: "queryFlagListOfCusModalDoc"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        getBigDataOperTags: function(extraparams) {
            var params = {
                "methodname": "queryFlagList",
                "serviceid": "mlf_bigdataexchange"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        // 下拉列表数据
        getListDownData: function(extraparams, menuName, callback) {
            var params = {
                "typeid": "zyzx",
                "modelid": "getSearchMenu"
            };
            params = angular.extend(params, extraparams);
            params.menuName = menuName;
            trsHttpService.httpServer(rooturl, params, "post").then(function(data) {
                if (typeof data == "object") {
                    var content = data.content && data.content[0];
                    angular.forEach(content, function(n, i) {
                        n.name = n.ENNAME;
                        n.value = n.CNNAME;
                    });
                    typeof callback == "function" && callback(content);
                }
            });
        },
        getRetrievalRootList: function(extraparams) {
            var params = {
                typeid: "dicttool",
                modelid: "getRootLevel"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        getRetrievalChildren: function(extraparams) {
            var params = {
                typeid: "dicttool",
                modelid: "getChildren"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        getWechatSearch: function(extraparams) {
            var params = {
                typeid: "zyzx",
                modelid: "getAccount"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        // 共享稿库 稿件详情
        getNewsDoc: function(extraparams) {
            var params = {
                "methodname": "getNewsDoc",
                "serviceid": "mlf_myrelease"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        // 获取表格标题列表
        getSummaryFields: function(tableEnName) {
            var params = {
                "typeid": "zyzx",
                "modelid": "getSummaryFields",
                "serviceid": "person",
                "tableEnName": tableEnName || ""
            };
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        operationSummarys: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "modelid": "operationSummarys",
                "serviceid": "person"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        // wcm删除稿件
        deleteRelease: function(ids) {
            var params = {
                "methodname": "deleteRelease",
                "serviceid": "mlf_releasesource",
                "MetaDataIds": ids
            };
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        // 搜索建议
        getSuggestion: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "modelid": "getSuggestion"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        getEsDataList: function(extraparams) {
            var params = {
                "methodname": "queryForTongYiGongGaoDoc",
                "serviceid": "mlf_essearch"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        getSubscribe: function(methodid, extraparams) {
            var params = {
                "typeid": "zyzx",
                "modelid": methodid,
                "serviceid": "subscript"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        /** [expertSearch 高级检索] channelName允许多值 */
        expertSearch: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "modelid": "expertSearch",
                "serviceid": "iwo"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        /** [subscibeSearch iwo资源 获取条件] */
        subscibeSearch: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "modelid": "subscibeSearch",
                "serviceid": "subscript"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        /** [findSourceById iwo资源 获取条件] */
        findSourceById: function(extraparams) {
            var params = {
                "typeid": "zyzx",
                "modelid": "findSourceById",
                "serviceid": "subscript"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(rooturl, params, "post");
        },
        /** [queryForShareContentDoc 共享稿库 es检索] */
        queryForShareContentDoc: function(extraparams) {
            var params = {
                "methodname": "queryForShareTopicAndArea",
                "serviceid": "mlf_essearch"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        /** [saveMyCustom 设置常用] */
        saveMyCustom: function(extraparams) {
            var params = {
                "methodname": "saveMyCustom",
                "serviceid": "mlf_releasesource"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        /** [queryMyCustoms 查找设置常用的] */
        queryMyCustoms: function(CustomType) {
            var params = {
                "methodname": "queryMyCustoms",
                "serviceid": "mlf_releasesource",
                "CustomType": CustomType || ""
            };
            return trsHttpService.httpServer(wcmurl, params, "post");
        },
        cancleMyCustom: function(extraparams) {
            var params = {
                "methodname": "cancleMyCustom",
                "serviceid": "mlf_releasesource"
            };
            params = angular.extend(params, extraparams);
            return trsHttpService.httpServer(wcmurl, params, "post");
        }
    };
}]);
