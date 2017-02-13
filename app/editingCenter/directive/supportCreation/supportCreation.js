"use strict";
/**
 *  Module
 *
 * Description 辅助写作模块
 * Author: wang.jiang 2016-2-17
 */
angular.module('editctrSupportCreationModule', [
        'supportCreationAlertDetailModule',
    ])
    .directive('supportCreation', ['$timeout', 'trsHttpService', 'initVersionService', 'alterModule', function($timeout, trsHttpService, initVersionService, alterModule) {
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                content: "=",
                notAllowDragPic: "@"
            }, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            templateUrl: './editingCenter/directive/supportCreation/template/support_creation_tpl.html',
            replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {
                init();

                function init() {
                    $scope.status = {
                        noMoreMessage: "",
                        creationAxisItems: [],
                        subjectItems: [],
                        indexname: "",
                        backmeanu: {
                            params: "",
                            items: [],
                            page: "",
                            modelid: "backmeanuScripts",
                            selectedName: [],
                            selectedOrganization: [],
                            selectedPlace: [],
                            selectedKeyWords: [],
                            selectedNameLen: '',
                            selectedOrganizationLen: '',
                            selectedPlaceLen: '',
                            selectedKeyWordsLen: '',
                        },

                        isSelectedName: false,
                        isSelectedOrganization: false,
                        isSelectedPlace: false,
                        isSelectedKeyWords: false,
                        page: {
                            subject: {
                                CURRPAGE: 1,
                                PAGESIZE: 5,
                                PAGECOUNT: ""
                            },
                            backmeanu: {
                                CURRPAGE: 1,
                                PAGESIZE: 5,
                                PAGECOUNT: ""
                            },
                            creationAxis: {
                                CURRPAGE: 1,
                                PAGESIZE: 10,
                                PAGECOUNT: ""
                            },
                            itemCount: "",
                        },
                        message: {
                            creationAxisHasNoMore: true,
                            subjectHasNoMore: true,
                            backmeanuHasNoMore: true,
                        }
                    };
                    queryCreationAxis(false);
                }

                $scope.$watch('content', function(newvalue, oldvalue) {
                    if (newvalue !== "") {
                        querySubject(false);
                        queryBackmeanuParams(false);
                        queryBackmeanu(false);
                    }
                });

                /**
                 * [queryCreationAxis description:查询创作轴]
                 * @param  {Boolean} isGetMore [description：判断是否加载跟多]
                 */
                function queryCreationAxis(isGetMore) {
                    var params = {
                        serviceid: "mlf_releasesource",
                        methodname: "queryCreations",
                        pagesize: $scope.status.page.creationAxis.PAGESIZE,
                        currpage: $scope.status.page.creationAxis.CURRPAGE,
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        if (!data.DATA) return;
                        if (!!isGetMore)
                            $scope.status.creationAxisItems = $scope.status.creationAxisItems.concat(initVersionService.getDayContent(data.DATA, true));
                        else {
                            $scope.status.creationAxisItems = initVersionService.getDayContent(data.DATA, true);
                        }

                        $scope.status.page.creationAxis = data.PAGER;
                        $scope.status.message.creationAxisHasNoMore = data.PAGER.CURRPAGE >= data.PAGER.PAGECOUNT;
                    });
                }
                /**
                 * [querySubject description:查询主题延展]
                 * @param  {Boolean} isGetMore [description：判断是否加载跟多]
                 */
                function querySubject(isGetMore) {
                    var params = {
                        typeid: "zyzx",
                        serviceid: "write",
                        modelid: "pageSubjectExtension",
                        content: $scope.content,
                        pageSize: $scope.status.page.subject.PAGESIZE,
                        pageNum: $scope.status.page.subject.CURRPAGE
                    };
                    $scope.loadingSubject = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                        if (data.result === "fail" || data === "") return;
                        if (!!isGetMore)
                            $scope.status.subjectItems = $scope.status.subjectItems.concat(data.content);
                        else {
                            $scope.status.subjectItems = data.content;
                        }

                        $scope.status.indexname = data.summary_info.indexName;
                        $scope.status.page.subject = data.summary_info;
                        $scope.status.message.subjectHasNoMore = data.summary_info.CURRPAGE >= data.summary_info.PAGECOUNT;
                    });
                }
                /**
                 * [queryBackmeanu description：获取稿件背景 by content]
                 * @param  {Boolean} isGetMore [description：判断是初始化还是加载更多，加载跟多则拼接数组]
                 * @return {[type]}            [description]
                 */
                function queryBackmeanu(isGetMore) {
                    var params = {
                        typeid: "zyzx",
                        serviceid: "write",
                        modelid: $scope.status.backmeanu.modelid,
                        content: $scope.content,
                        pageSize: $scope.status.page.backmeanu.PAGESIZE,
                        pageNum: $scope.status.page.backmeanu.CURRPAGE,
                        name: $scope.status.backmeanu.selectedName.join(","),
                        place: $scope.status.backmeanu.selectedPlace.join(","),
                        organization: $scope.status.backmeanu.selectedOrganization.join(","),
                        keyWords: $scope.status.backmeanu.selectedKeyWords.join(",")
                    };
                    $scope.loadingSubject = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                        if (data === "" || data.result === "fail") return;
                        if (!!isGetMore) {
                            $scope.status.backmeanu.items = data.content;

                        } else {
                            $scope.status.backmeanu.items = data.content;
                        }
                        $scope.status.page.backmeanu = data.summary_info;
                        $scope.status.message.backmeanuHasNoMore = data.summary_info.CURRPAGE >= data.summary_info.PAGECOUNT;
                    });
                }

                //获取三维背景
                function queryBackmeanuParams() {
                    var params = {
                        typeid: "zyzx",
                        serviceid: "write",
                        modelid: "backWordsExtract",
                        content: $scope.content
                    };
                    //获取人名、地名、机构
                    $scope.Backmeanu = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                        if (data === "" || data.result === "fail") return;
                        initBackMeanu();
                        initBackMeanuPush(data);
                        initBackMeanuLen();

                    });
                }
                //获取人名、地名、机构、关键词
                function initBackMeanuPush(data) {
                    $scope.status.backmeanu.params = data.content[0];
                    $scope.status.backmeanu.selectedName.push(data.content[0].name.length > 0 ? data.content[0].name[0] : "");
                    $scope.status.backmeanu.selectedOrganization.push(data.content[0].organization.length > 0 ? data.content[0].organization[0] : "");
                    $scope.status.backmeanu.selectedPlace.push(data.content[0].place.length > 0 ? data.content[0].place[0] : "");
                    $scope.status.backmeanu.selectedKeyWords.push(data.content[0].keyWords.length > 0 ? data.content[0].keyWords[0] : "");
                }
                //初始化人名 机构 地名
                function initBackMeanu() {
                    $scope.status.backmeanu.selectedName = [];
                    $scope.status.backmeanu.selectedOrganization = [];
                    $scope.status.backmeanu.selectedPlace = [];
                    $scope.status.backmeanu.selectedKeyWords = [];
                }
                //初始化稿件背景长度
                function initBackMeanuLen() {
                    $scope.status.backmeanu.selectedNameLen = $scope.status.backmeanu.params.name.length;
                    $scope.status.backmeanu.selectedOrganizationLen = $scope.status.backmeanu.params.organization.length;
                    $scope.status.backmeanu.selectedPlaceLen = $scope.status.backmeanu.params.place.length;
                    $scope.status.backmeanu.selectedKeyWordsLen = $scope.status.backmeanu.params.keyWords.length;
                }
                //显示所有
                $scope.showList = function() {
                    $scope.status.isSelectedName = !$scope.status.isSelectedName;
                };

                $scope.createDate = function(_sDate) {
                    return new Date(_sDate);
                };
                //加载更多主题背景
                $scope.getMoreSub = function() {
                    if ($scope.status.page.subject.CURRPAGE >= $scope.status.page.subject.PAGECOUNT) {
                        return;
                    }
                    $scope.status.page.subject.CURRPAGE += 1;
                    querySubject(true);
                };
                //加载更多稿件背景
                $scope.getMoreBack = function() {
                    if ($scope.status.page.backmeanu.CURRPAGE >= $scope.status.page.backmeanu.PAGECOUNT) {
                        return;
                    }
                    $scope.status.page.backmeanu.CURRPAGE += 1;
                    queryBackmeanu(true);
                };
                /**
                 * [getMoreCreationAxis description：加载更多的创作轴]
                 */
                $scope.getMoreCreationAxis = function() {
                    if ($scope.status.page.creationAxis.CURRPAGE >= $scope.status.page.creationAxis.PAGECOUNT) {
                        return;
                    }
                    $scope.status.page.creationAxis.CURRPAGE += 1;
                    queryCreationAxis(true);
                };
                /**
                 * [updateSelectedItems description：更新选中的对象,并按照筛选条件加载稿件背景]
                 * @param  {[type]} item      [description：被点击的对象]
                 * @param  {[type]} itemsName [description：该对象所在集合]
                 */

                $scope.updateSelectedItems = function(item, itemsName) {
                    var index = $scope.status.backmeanu[itemsName].indexOf(item);
                    if (index > -1) {
                        $scope.status.backmeanu[itemsName].splice(index, 1);
                    } else {
                        $scope.status.backmeanu[itemsName].push(item);
                    }
                    $scope.status.backmeanu.modelid = "searchBybackWords";
                    queryBackmeanu();
                };
                /**
                 * [updateSelectedItems description：打开新窗口]
                 * @param  {[type]} item      [description：被点击的对象]
                 * @param  {[type]} indexname      [description：当前对象名称（因为在不同的表，所以单独处理）]
                 */
                $scope.windowOpen = function(item, indexname) {
                    alterModule.alterDeatil(item, indexname);
                };
                /**
                 * [updateSelectedItems description：创作轴新窗口]
                 * @param  {[type]} CreationId      [description：被点击的对象]
                 */
                $scope.creationOpen = function(ceratiid) {
                    alterModule.creationDetail(ceratiid.value.CREATIONID);
                };

                /**
                 * 拖动开始时，记录信息
                 * @param  {[type]} item [description]
                 * @return {[type]}      [description]
                 */
                $scope.dragStart = function(item) {
                    return item;
                };
                /**
                 * 拖动开始时，记录信息，报纸编辑页专用，替换CREATIONTYPE
                 * @param  {[type]} item [description]
                 * @return {[type]}      [description]
                 */
                $scope.fakeDragStart = function(item) {
                    var fakeItem = angular.copy(item);
                    fakeItem.value.CREATIONTYPE = '2';
                    return fakeItem;
                };
            }
        };
    }])
    .directive('plancenterMoreinfos', ['$timeout', 'trsHttpService', 'initVersionService', 'alterModule', function($timeout, trsHttpService, initVersionService, alterModule) {
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                content: "=",
                notAllowDragPic: "@"
            }, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            templateUrl: './editingCenter/directive/supportCreation/template/plancenter_moreinfos.html',
            replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {
                init();

                function init() {
                    $scope.status = {
                        noMoreMessage: "",
                        creationAxisItems: [],
                        subjectItems: [],
                        indexname: "",
                        backmeanu: {
                            params: "",
                            items: [],
                            page: "",
                            modelid: "backmeanuScripts",
                            selectedName: [],
                            selectedOrganization: [],
                            selectedPlace: [],
                            selectedKeyWords: [],
                            selectedNameLen: '',
                            selectedOrganizationLen: '',
                            selectedPlaceLen: '',
                            selectedKeyWordsLen: '',
                        },

                        isSelectedName: false,
                        isSelectedOrganization: false,
                        isSelectedPlace: false,
                        isSelectedKeyWords: false,
                        page: {
                            subject: {
                                CURRPAGE: 1,
                                PAGESIZE: 5,
                                PAGECOUNT: ""
                            },
                            backmeanu: {
                                CURRPAGE: 1,
                                PAGESIZE: 5,
                                PAGECOUNT: ""
                            },
                            creationAxis: {
                                CURRPAGE: 1,
                                PAGESIZE: 10,
                                PAGECOUNT: ""
                            },
                            itemCount: "",
                        },
                        message: {
                            creationAxisHasNoMore: true,
                            subjectHasNoMore: true,
                            backmeanuHasNoMore: true,
                        }
                    };
                    queryCreationAxis(false);
                }

                $scope.$watch('content', function(newvalue, oldvalue) {
                    if (newvalue !== "") {
                        querySubject(false);
                        queryBackmeanuParams(false);
                        queryBackmeanu(false);
                    }
                });

                /**
                 * [queryCreationAxis description:查询创作轴]
                 * @param  {Boolean} isGetMore [description：判断是否加载跟多]
                 */
                function queryCreationAxis(isGetMore) {
                    var params = {
                        serviceid: "mlf_releasesource",
                        methodname: "queryCreations",
                        pagesize: $scope.status.page.creationAxis.PAGESIZE,
                        currpage: $scope.status.page.creationAxis.CURRPAGE,
                    };
                    $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        if (!data.DATA) return;
                        if (!!isGetMore)
                            $scope.status.creationAxisItems = $scope.status.creationAxisItems.concat(initVersionService.getDayContent(data.DATA, true));
                        else {
                            $scope.status.creationAxisItems = initVersionService.getDayContent(data.DATA, true);
                        }

                        $scope.status.page.creationAxis = data.PAGER;
                        $scope.status.message.creationAxisHasNoMore = data.PAGER.CURRPAGE >= data.PAGER.PAGECOUNT;
                    });
                }
                /**
                 * [querySubject description:查询主题延展]
                 * @param  {Boolean} isGetMore [description：判断是否加载跟多]
                 */
                function querySubject(isGetMore) {
                    var params = {
                        typeid: "zyzx",
                        serviceid: "write",
                        modelid: "pageSubjectExtension",
                        content: $scope.content,
                        pageSize: $scope.status.page.subject.PAGESIZE,
                        pageNum: $scope.status.page.subject.CURRPAGE
                    };
                    $scope.loadingSubject = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                        if (data.result === "fail" || data === "") return;
                        if (!!isGetMore)
                            $scope.status.subjectItems = $scope.status.subjectItems.concat(data.content);
                        else {
                            $scope.status.subjectItems = data.content;
                        }

                        $scope.status.indexname = data.summary_info.indexName;
                        $scope.status.page.subject = data.summary_info;
                        $scope.status.message.subjectHasNoMore = data.summary_info.CURRPAGE >= data.summary_info.PAGECOUNT;
                    });
                }
                /**
                 * [queryBackmeanu description：获取稿件背景 by content]
                 * @param  {Boolean} isGetMore [description：判断是初始化还是加载更多，加载跟多则拼接数组]
                 * @return {[type]}            [description]
                 */
                function queryBackmeanu(isGetMore) {
                    var params = {
                        typeid: "zyzx",
                        serviceid: "write",
                        modelid: $scope.status.backmeanu.modelid,
                        content: $scope.content,
                        pageSize: $scope.status.page.backmeanu.PAGESIZE,
                        pageNum: $scope.status.page.backmeanu.CURRPAGE,
                        name: $scope.status.backmeanu.selectedName.join(","),
                        place: $scope.status.backmeanu.selectedPlace.join(","),
                        organization: $scope.status.backmeanu.selectedOrganization.join(","),
                        keyWords: $scope.status.backmeanu.selectedKeyWords.join(",")
                    };
                    $scope.loadingSubject = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                        if (data === "" || data.result === "fail") return;
                        if (!!isGetMore) {
                            $scope.status.backmeanu.items = data.content;

                        } else {
                            $scope.status.backmeanu.items = data.content;
                        }
                        $scope.status.page.backmeanu = data.summary_info;
                        $scope.status.message.backmeanuHasNoMore = data.summary_info.CURRPAGE >= data.summary_info.PAGECOUNT;
                    });
                }

                //获取三维背景
                function queryBackmeanuParams() {
                    var params = {
                        typeid: "zyzx",
                        serviceid: "write",
                        modelid: "backWordsExtract",
                        content: $scope.content
                    };
                    //获取人名、地名、机构
                    $scope.Backmeanu = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), params, "post").then(function(data) {
                        if (data === "" || data.result === "fail") return;
                        initBackMeanu();
                        initBackMeanuPush(data);
                        initBackMeanuLen();

                    });
                }
                //获取人名、地名、机构、关键词
                function initBackMeanuPush(data) {
                    $scope.status.backmeanu.params = data.content[0];
                    $scope.status.backmeanu.selectedName.push(data.content[0].name.length > 0 ? data.content[0].name[0] : "");
                    $scope.status.backmeanu.selectedOrganization.push(data.content[0].organization.length > 0 ? data.content[0].organization[0] : "");
                    $scope.status.backmeanu.selectedPlace.push(data.content[0].place.length > 0 ? data.content[0].place[0] : "");
                    $scope.status.backmeanu.selectedKeyWords.push(data.content[0].keyWords.length > 0 ? data.content[0].keyWords[0] : "");
                }
                //初始化人名 机构 地名
                function initBackMeanu() {
                    $scope.status.backmeanu.selectedName = [];
                    $scope.status.backmeanu.selectedOrganization = [];
                    $scope.status.backmeanu.selectedPlace = [];
                    $scope.status.backmeanu.selectedKeyWords = [];
                }
                //初始化稿件背景长度
                function initBackMeanuLen() {
                    $scope.status.backmeanu.selectedNameLen = $scope.status.backmeanu.params.name.length;
                    $scope.status.backmeanu.selectedOrganizationLen = $scope.status.backmeanu.params.organization.length;
                    $scope.status.backmeanu.selectedPlaceLen = $scope.status.backmeanu.params.place.length;
                    $scope.status.backmeanu.selectedKeyWordsLen = $scope.status.backmeanu.params.keyWords.length;
                }
                //显示所有
                $scope.showList = function() {
                    $scope.status.isSelectedName = !$scope.status.isSelectedName;
                };

                $scope.createDate = function(_sDate) {
                    return new Date(_sDate);
                };
                //加载更多主题背景
                $scope.getMoreSub = function() {
                    if ($scope.status.page.subject.CURRPAGE >= $scope.status.page.subject.PAGECOUNT) {
                        return;
                    }
                    $scope.status.page.subject.CURRPAGE += 1;
                    querySubject(true);
                };
                //加载更多稿件背景
                $scope.getMoreBack = function() {
                    if ($scope.status.page.backmeanu.CURRPAGE >= $scope.status.page.backmeanu.PAGECOUNT) {
                        return;
                    }
                    $scope.status.page.backmeanu.CURRPAGE += 1;
                    queryBackmeanu(true);
                };
                /**
                 * [getMoreCreationAxis description：加载更多的创作轴]
                 */
                $scope.getMoreCreationAxis = function() {
                    if ($scope.status.page.creationAxis.CURRPAGE >= $scope.status.page.creationAxis.PAGECOUNT) {
                        return;
                    }
                    $scope.status.page.creationAxis.CURRPAGE += 1;
                    queryCreationAxis(true);
                };
                /**
                 * [updateSelectedItems description：更新选中的对象,并按照筛选条件加载稿件背景]
                 * @param  {[type]} item      [description：被点击的对象]
                 * @param  {[type]} itemsName [description：该对象所在集合]
                 */

                $scope.updateSelectedItems = function(item, itemsName) {
                    var index = $scope.status.backmeanu[itemsName].indexOf(item);
                    if (index > -1) {
                        $scope.status.backmeanu[itemsName].splice(index, 1);
                    } else {
                        $scope.status.backmeanu[itemsName].push(item);
                    }
                    $scope.status.backmeanu.modelid = "searchBybackWords";
                    queryBackmeanu();
                };
                /**
                 * [updateSelectedItems description：打开新窗口]
                 * @param  {[type]} item      [description：被点击的对象]
                 * @param  {[type]} indexname      [description：当前对象名称（因为在不同的表，所以单独处理）]
                 */
                $scope.windowOpen = function(item, indexname) {
                    alterModule.alterDeatil(item, indexname);
                };
                /**
                 * [updateSelectedItems description：创作轴新窗口]
                 * @param  {[type]} CreationId      [description：被点击的对象]
                 */
                $scope.creationOpen = function(ceratiid) {
                    alterModule.creationDetail(ceratiid.value.CREATIONID);
                };

                /**
                 * 拖动开始时，记录信息
                 * @param  {[type]} item [description]
                 * @return {[type]}      [description]
                 */
                $scope.dragStart = function(item) {
                    return item;
                };
                /**
                 * 拖动开始时，记录信息，报纸编辑页专用，替换CREATIONTYPE
                 * @param  {[type]} item [description]
                 * @return {[type]}      [description]
                 */
                $scope.fakeDragStart = function(item) {
                    var fakeItem = angular.copy(item);
                    fakeItem.value.CREATIONTYPE = '2';
                    return fakeItem;
                };
            }
        };
    }]);
