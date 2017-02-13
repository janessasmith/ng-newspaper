/*Create by BaiZhiming 2015-12-03*/
"use strict";
angular.module("editingCenterServiceModule", ["shareModule", "draftlistModule", "signedRankModule", "fgdIframeModule", "editOutSendingModule", "draftImportModule"])
    .factory("editingCenterService", ['$modal', "$location", '$filter', '$window', '$stateParams', '$q', 'trsHttpService', 'initVersionService', 'trsspliceString', 'trsconfirm', 'SweetAlert', 'storageListenerService',
        function($modal, $location, $filter, $window, $stateParams, $q, trsHttpService, initVersionService, trsspliceString, trsconfirm, SweetAlert, storageListenerService) {
            return {
                share: function(success) {
                    var modalInstance = $modal.open({
                        templateUrl: "./editingCenter/service/share/share_tpl.html",
                        windowClass: 'toBeCompiled-Share-window',
                        backdrop: false,
                        controller: "shareCtrl",
                        /*resolve: {
                            shareParams: function() {
                                return {
                                    "serviceid": shareServiceid,
                                    "methodname": shareMethodname
                                };
                            }
                        }*/
                    });
                    modalInstance.result.then(function(result) {
                        success(result);
                    });
                },
                draftList: function(array, params, success) {
                    var modalInstance = $modal.open({
                        templateUrl: "./editingCenter/service/draftlist/draftlist_tpl.html",
                        windowClass: 'toBeCompiled-draftlist-window',
                        backdrop: false,
                        controller: "draftlistCtrl",
                        resolve: {
                            draftListParams: function() {
                                return {
                                    "array": array,
                                    "params": params
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function(result) {
                        if (result === "success") {
                            success();
                        }
                    });
                },
                rank: function(channelid, item, params, success) {
                    var modalInstance = $modal.open({
                        templateUrl: "./editingCenter/service/rank/signed_rank_tpl.html",
                        windowClass: "signed-rank-window",
                        backdrop: false,
                        controller: "signedRankCtrl",
                        resolve: {
                            rankParams: function() {
                                return {
                                    "channelid": channelid,
                                    "item": item,
                                    "params": params
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function(result) {
                        if (result === "success") {
                            success();
                        }
                    });
                },
                //外发
                outSending: function(transData, successFn) {
                    var modalInstance = $modal.open({
                        templateUrl: "./editingCenter/service/outSending/outSending.html",
                        windowClass: 'edit-outSending-window',
                        backdrop: false,
                        controller: "editOutSendingCtrl",
                        resolve: {
                            params: function() {
                                return transData;
                            }
                        }
                    });
                    modalInstance.result.then(function(result) {
                        successFn(result);
                    });
                },
                /**
                 * [exportDraft description]导出
                 *ids: 稿件MetaDataIds组成的字符串
                 */
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
                /**
                 * [getEditVersionTime description]获得编辑页面的流程版本和操作日志
                 * @param  {[type]} MetaDataId [description]稿件ID
                 * @param  {[type]} page       [description]操作日志分页信息
                 * @param  {[type]} copyarray  [description]上次的日志信息
                 * @return {[type]}            [description]
                 */
                getEditVersionTime: function(MetaDataId, page, copyarray) {
                    var deferred = $q.defer();
                    var params = {
                        serviceid: "mlf_extversion",
                        methodname: "queryVersions",
                        MetaDataId: MetaDataId,
                        CURRPAGE: page.CURRPAGE,
                        PAGESIZE: page.PAGESIZE
                    };
                    var version = {
                        versionTime: [],
                        operationLog: [],
                        operationLogTitle: "",
                        page: "",
                        copyArray: copyarray,
                        group: [],
                        lastVersionid: "",
                        trench: $location.path().split('/')[1],
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        if (data) {
                            var exttype = [];
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].EXTTYPE == '流程版本') {
                                    exttype.push(data[i]);
                                }
                            }
                            version.lastVersionid = exttype.length > 0 ? exttype.shift().OBJECTVERSIONID : "";
                            if (version.trench === 'iwonews' || version.trench === 'iwoatlas') {
                                version.versionTime = initVersionService.getDayContent(data);
                            } else {
                                version.copyVersionTime = $filter('groupBy')(data, 'MEDIATYPENAME');
                                for (var j in version.copyVersionTime) {
                                    version.versionTime[j] = [];
                                    version.versionTime[j] = version.versionTime[j].concat(initVersionService.getDayContent(version.copyVersionTime[j]));
                                }
                            }
                        }
                        params.serviceid = "mlf_metadatalog";
                        params.methodname = "query";
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                            if (data.DATA) {
                                version.copyArray = $filter('unique')(version.copyArray.concat(data.DATA), 'METADATALOGID');
                                version.group = $filter('groupBy')(version.copyArray, "MEDIATYPEDESC");
                                for (var i in version.group) {
                                    version.operationLog[i] = [];
                                    version.operationLog[i] = version.operationLog[i].concat(initVersionService.getDayContent(version.group[i]));
                                }
                                version.operationLogTitle = angular.isDefined(data.DATA[0]) ? data.DATA[0].TITLE : "";
                                !!data.PAGER ? version.page = data.PAGER : version.page.ITEMCOUNT = 0;
                                return deferred.resolve(version);
                            }
                        });
                    });
                    return deferred.promise;
                },
                /**
                 * [getVersionTime description]获得稿件的操作日历，流程版本，复制稿日志
                 * @param  {[obj]}  item         [description]稿件的信息
                 * @param  {Boolean} hasCopyDraft [description]是否展示复制稿
                 * @return {[type]}               [description]
                 */
                getVersionTime: function(item, hasCopyDraft) {
                    var incomingData = {
                        hasCopyDraft: hasCopyDraft,
                        MetaDataId: item.METADATAID || item.DOCID
                    };
                    var modalInstance = $modal.open({
                        templateUrl: "./editingCenter/service/versionTime/versionTimeModal/versionTime.html",
                        windowClass: 'editCompiledobjTime',
                        backdrop: false,
                        resolve: {
                            incomingData: function() {
                                return incomingData;
                            }
                        },
                        controller: "editiWoObjTimeCtrl"
                    });
                },
                getComment: function(id, currPage) {
                    var defer = $q.defer();
                    var returnParams = {
                        comment: [],
                        voiceObj: {},
                        hasMore: '',
                    };
                    var params = {
                        serviceid: 'mlf_comment',
                        methodname: 'queryComments',
                        CURRPAGE: currPage,
                        MetaDataId: id,
                        PAGESIZE: 20,
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                        if (angular.isDefined(data.DATA)) {
                            data.DATA.reverse();
                            returnParams.comment = initVersionService.getDayContent(data.DATA);
                            returnParams.hasMore = data.PAGER.ITEMCOUNT > currPage * params.PAGESIZE ? true : false;
                            angular.forEach(data.DATA, function(value, key) {
                                if (value.COMMTYPE == '2') {
                                    trsHttpService.httpServer(window.location.origin + '/mas/openapi/pages.do', {
                                        'method': 'prePlay',
                                        'appKey': 'TRSWCM7',
                                        'json': { "masId": value.COMMENT, "isLive": "false", "player": "HTML5" },
                                    }, 'get').then(function(voiceData) {
                                        returnParams.voiceObj[value.COMMENT] = voiceData.streamsMap.l.httpURL;
                                    });
                                }
                                if (key + 1 == data.DATA.length) defer.resolve(returnParams);
                            });
                        }
                    });
                    return defer.promise;
                },
                /**
                 * [draftTimeSinged description]稿件定时签发功能
                 * @param  {[obj]} params [description]数据集合
                 * @return {[obj]}        [description]promise返回值
                 */
                draftTimeSinged: function(params) {
                    var deferred = $q.defer();
                    var modalInstance = $modal.open({
                        templateUrl: "./editingCenter/app/toBeCompiled/alertViews/sign/timingSign/toBeCompiled_timingSign_tpl.html",
                        windowClass: 'timing-sign',
                        backdrop: false,
                        resolve: {
                            params: function() {
                                return params;
                            }
                        },
                        controller: "toBeCompiledTimingSignCtrl"
                    });
                    modalInstance.result.then(function(result) {
                        var timeParams = {
                            // serviceid: "mlf_websiteoper",
                            methodname: params.methodname,
                            ChnlDocIds: trsspliceString.spliceString(params.selectedArray,
                                "CHNLDOCID", ','),
                            ObjectIds: trsspliceString.spliceString(params.selectedArray,
                                "METADATAID", ','),
                            MetaDataIds: trsspliceString.spliceString(params.selectedArray,
                                "METADATAID", ','),
                            ScheduleTime: result
                        };
                        timeParams.serviceid = angular.isDefined(params.serviceid) ? params.serviceid : "mlf_websiteoper";
                        trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), timeParams, "post")
                            .then(function(data) {
                                deferred.resolve(result);
                            }, function() {
                                deferred.reject(result);
                            });
                    });
                    return deferred.promise;
                },
                /**
                 * [getKeywordsOrAbstract description] 提取关键字和摘要
                 * @param  {[type]} type    [description] 类型area(表示地域标引),field(领域标引),keywords(关键词抽取)，abstract(摘要)
                 * @param  {[type]} content [description] 正文
                 * @return {[type]}         [description]
                 */
                getKeywordsOrAbstract: function(type, content) {
                    var deferred = $q.defer();
                    if (!content) deferred.reject("正文为空");
                    var params = {
                        serviceid: "mlf_bigdataexchange",
                        methodname: "getKeywords",
                        markType: type || "keywords",
                        markContent: content,
                        //needStop:false,//敏感词
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                /**
                 * [editUploaderImg description]编辑图片
                 * @return {[type]} [description]
                 */
                editUploaderImg: function(uploadImg, success) {
                    var multiImgsUploader = $modal.open({
                        templateUrl: "./editingCenter/service/editUploadImg/editImage.html",
                        resolve: {
                            uploadImg: function() {
                                return uploadImg;
                            }
                        },
                        windowClass: 'multiImgsUploader',
                        backdrop: false,
                        controller: "editImageCtrl"
                    });
                    multiImgsUploader.result.then(function(result) {
                        success(result);
                    });
                },
                /**
                 * [getPermissions description]获得用户在渠道下的权限
                 * @return {[type]} [description]
                 */
                getPermissions: function() {
                    var deferred = $q.defer();
                    var params = {
                        serviceid: "mlf_mediasite",
                        methodname: "queryAllSites"
                    };
                    var status = {};
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "post").then(function(data) {
                        for (var index = 0; index < data.length; index++) {
                            var type = data[index]["MEDIATYPE"];
                            switch (type) {
                                case "1":
                                    status.app = {
                                        isAccessAuthority: true
                                    };
                                    break;
                                case "2":
                                    status.website = {
                                        isAccessAuthority: true
                                    };
                                    break;
                                case "3":
                                    status.newspaper = {
                                        isAccessAuthority: true
                                    };
                                    break;
                                case "4":
                                    status.weixin = {
                                        isAccessAuthority: true
                                    };
                                    break;
                                case "5":
                                    status.weibo = {
                                        isAccessAuthority: true
                                    };
                                    break;
                            }
                        }
                        deferred.resolve(status);
                    });
                    return deferred.promise;
                },
                /**
                 * [closeWinow description]关闭页面服务
                 * @param  {Boolean} isDirty        [description]表单是否遭到改动
                 * @param  {Boolean} isChangeEditor [description]编辑器是否遭到改动
                 * @return {[type]}                 [description]null
                 */
                closeWinow: function(isDirty, isChangeEditor) {
                    var deferred = $q.defer();
                    if (isDirty || isChangeEditor) {
                        SweetAlert.swal({
                            title: "您还未保存已填写的内容",
                            showCancelButton: true,
                            type: "error",
                            closeOnConfirm: false,
                            closeOnCancel: false,
                            cancelButtonText: "放弃保存",
                            confirmButtonText: "保存关闭",
                        }, function(isConfirm) {
                            if (isConfirm) {
                                deferred.resolve();
                            } else {
                                deferred.reject();
                            }
                        });
                    } else {
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                /**
                 * [imageUpload description]图集稿图片批量上传
                 * @param  {[fun]} success [description]上传成功后的回调
                 * @return {[type]}         [description]
                 */
                imageUpload: function(success) {
                    var modalInstance = $modal.open({
                        templateUrl: "./editingCenter/service/editUploadImg/multiImageUploader.html",
                        windowClass: 'multiImgsUploader',
                        backdrop: false,
                        controller: "multiImgsUpladerCtrl"
                    });
                    modalInstance.result.then(function(result) {
                        success(result);
                    });
                },
                /**
                 * [checkSaveError description]检查保存时填写错误的地方
                 * @param  {[obj]} form [description]需要检查的表单
                 * @return {[type]}      [description]
                 */
                checkSaveError: function(form) {
                    for (var key in form.$error) {
                        document.getElementsByName(key)[0].focus();
                    }
                },
                /**
                 * [draftPublish description]稿件预览
                 * @param  {[type]} channelid  [description]稿件所在的栏目ID
                 * @param  {[type]} metadataid [description]稿件的ID
                 * @return {[type]}            [description]
                 */
                draftPublish: function(chnldocid) {
                    var view = {
                        serviceid: "mlf_metadatacenter",
                        methodname: "preview",
                        ObjectId: chnldocid
                    };
                    trsHttpService.httpServer("/wcm/mlfcenter.do", view, "post").then(function(data) {
                        $window.open(data.URLS);
                    });
                },
                //按照平台查询站点下的栏目
                queryChannelsBySiteid: function(siteid, platform) {
                    var params = {
                        serviceid: "mlf_mediasite",
                        methodname: "queryClassifyBySite",
                        SiteId: siteid,
                        platform: platform,
                    };

                    var defer = $q.defer();
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                        defer.resolve(data);
                    });
                    return defer.promise;
                },
                //按照栏目ID遍历栏目树中的栏目
                queryChnlFromTree: function(chnlTree, channelid) {
                    var deferred = $q.defer();
                    if (!angular.isArray(chnlTree) || angular.isUndefined(channelid)) deferred.reject(chnlTree);
                    var iterator = function(hnlTree, channelid) {
                        for (var i in chnlTree) {
                            if (chnlTree[i].CHANNELID === channelid) {
                                deferred.resolve(chnlTree[i]);
                                return;
                            } else if (chnlTree[i].HASCHILDREN && angular.isArray(chnlTree[i].CHILDREN)) {
                                deferred.resolve(iterator(chnlTree[i].CHILDREN, channelid));
                            }
                        }
                    };
                    return deferred.promise;
                },
                /**
                 * [getSiteInfo description]根据站点id查询站点详细信息
                 * @param  {[type]} siteid [description]
                 * @return {[type]}        [description]
                 */
                getSiteInfo: function(siteid) {
                    var channelParams = {
                        serviceid: "mlf_websiteoper",
                        methodname: "querySiteNameBySite",
                        ObjectId: siteid
                    };
                    var deffered = $q.defer();
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), channelParams, "get").then(function(data) {
                        deffered.resolve(data);
                    });
                    return deffered.promise;

                },
                //栏目树初始化参数
                channelTreeOptions: function() {
                    return {
                        nodeChildren: "CHILDREN",
                        allowDeselect: false,
                        dirSelectable: true,
                        injectClasses: {},
                        templateUrl: '../app/components/htmlTemplates/treeTemplate.html',
                        isLeaf: function(node) {
                            return node.HASCHILDREN == 'false';
                        }
                    };
                },
                //查询平台下的栏目子节点
                queryChildChannel: function(node, type) {
                    var params = {
                        serviceid: "mlf_mediasite",
                        methodname: "queryClassifyByChnl",
                        channelid: node.CHANNELID,
                        platform: type,
                    };
                    var defer = $q.defer();
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        defer.resolve(data.CHILDREN);
                    });
                    return defer.promise;
                },
                /**
                 * [getChannelDetail description]获得栏目的具体信息
                 * @param  {[num]} channelid [description]栏目ID
                 * @return {[obj]}           [description]栏目具体信息
                 */
                getChannelDetail: function(channelid) {
                    var deferred = $q.defer();
                    var params = {
                        serviceid: "mlf_website",
                        methodname: "queryChannelById",
                        ObjectId: $stateParams.channelid,
                    };
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                /**
                 * [checkoutDraft description]稿件敏感词查询
                 * @param  {[str]} content [description]稿件正文
                 * @return {[type]}         [description]
                 */
                checkoutDraft: function(content) {
                    var deffered = $q.defer();
                    var params = {
                        typeid: "zyzx",
                        eventid: "ckmMark",
                        serviceid: "mark",
                        markType: "col",
                        markContent: content,
                        needStop: true,
                    };
                    trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                        deffered.resolve(data);
                    });
                    return deffered.promise;
                },
                /**
                 * [draftImport description]导入稿件
                 * @param  {[null]} null [description]栏目ID
                 * @return {[null]}           [description]null
                 */
                draftImport: function(serviceid, methodname, channelid, success) {
                    var modalInstance = $modal.open({
                        templateUrl: "./editingCenter/service/draftImport/draftImport_tpl.html",
                        windowClass: 'editctrDraftImport',
                        backdrop: false,
                        controller: "draftImportCtrl",
                        resolve: {
                            params: function() {
                                return {
                                    serviceid: serviceid,
                                    methodname: methodname,
                                    channelid: channelid
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function(result) {
                        success(result);
                    });
                },
                //按照渠道查询站点
                querySitesByMediaType: function(mediaType) {
                    var params = {
                        serviceid: "mlf_mediasite",
                        methodname: "queryWebSitesByMediaType",
                        MediaType: mediaType, //APP：1，网站：2，报纸：3，微信：4，微博：5
                        SiteId: ""
                    };
                    var defer = $q.defer();
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                        defer.resolve(data);
                    });
                    return defer.promise;
                },
                queryClassifyBySite: function(siteid, platform) {
                    var params = {
                        serviceid: "mlf_mediasite",
                        methodname: "queryClassifyBySite",
                        siteid: siteid,
                        platform: platform
                    };
                    var defer = $q.defer();
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                        defer.resolve(data);
                    });
                    return defer.promise;
                }
            };
        }
    ]);
