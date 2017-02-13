"use strict";
angular.module('trsngsweetalert', ["ngSanitize"]).
factory('trsconfirm', ['$modal', 'SweetAlert', function($modal, SweetAlert) {
        return {
            warnSweetAlert: function(title, content, confirm) {
                return SweetAlert.swal({
                    title: title,
                    text: "<div style='display: block !important;'class='sa-icon sa-warning pulseWarning'><span class='sa-body pulseWarningIns'></span><span class='sa-dot pulseWarningIns'></span></div>" + content,
                    html: true,
                    customClass: 'fragment',
                    showCancelButton: true,
                    confirmButtonColor: "#1ABA9E",
                    confirmButtonText: "发送",
                    cancelButtonColor: "#4496D2",
                    cancelButtonText: "取消",
                }, function(isConfirm) {
                    if (isConfirm) {
                        confirm();
                    } else {

                    }
                });
            }, //sweetalert提示框type类型改变
            //type :  success:成功   error:失败  info:提示   warning:警告
            alertType: function(title, content, type, isButtonShow, confirm, cancel) {
                return SweetAlert.swal({
                    title: title,
                    text: content,
                    type: type,
                    showCancelButton: isButtonShow,
                    confirmButtonColor: "#1ABA9E",
                    confirmButtonText: "确定",
                    cancelButtonColor: "#4496D2",
                    cancelButtonText: "取消",
                }, function(isConfirm) {
                    if (isConfirm && angular.isFunction(confirm)) {
                        confirm();
                    } else if (!isConfirm && angular.isFunction(cancel)) {
                        cancel();
                    }
                });
            },
            alert: function(opt, arg2, type) {
                var params;
                var options = {
                    title: '',
                    text: '',
                    type: type,
                    showCancelButton: true,
                    confirmButtonColor: "#1ABA9E",
                    confirmButtonText: "确定",
                    cancelButtonColor: "#4496D2",
                    cancelButtonText: "取消",
                };
                if (typeof opt === 'string') {
                    options.title = opt;
                } else if (typeof opt === 'object') {
                    options = angular.extend(options, opt);
                }
                return SweetAlert.swal(options, function(isConfirm) {
                    arg2(isConfirm);
                });
            },
            //敏感词管理
            sensitiveWords: function(isNeed, confirm, cancel) {
                confirm(); //该功能原为浙报准备，对于川报来说，现已废弃
                // if (!isNeed) {
                //     return SweetAlert.swal({
                //         title: "请确认是否包含涉密信息",
                //         text: "",
                //         type: "warning",
                //         showCancelButton: true,
                //         confirmButtonColor: "#1ABA9E",
                //         confirmButtonText: "否",
                //         cancelButtonColor: "#4496D2",
                //         cancelButtonText: "是",
                //     }, function(isConfirm) {
                //         if (isConfirm) {
                //             confirm();
                //         } else {}
                //     });
                // } else {
                //     confirm();
                // }
            },
            //input模块
            inputModel: function(title, placeholder, confirm, content) {
                return $modal.open({
                    templateUrl: "./components/service/sweetalert/view/review_tpl.html",
                    windowClass: 'toBeCompiled-review-window',
                    backdrop: false,
                    controller: "reviewCtrl",
                    resolve: {
                        title: function() {
                            return title;
                        },
                        placeholder: function() {
                            return placeholder;
                        },
                        callback: function() {
                            return confirm;
                        },
                        content: function() {
                            return content;
                        },
                    }
                });
            }, //提示框模块
            confirmModel: function(title, content, confirm) {
                return $modal.open({
                    templateUrl: "./components/service/sweetalert/view/directSign_tpl.html",
                    windowClass: 'toBeCompiled-directSign-window',
                    backdrop: false,
                    controller: "directSignCtrl",
                    resolve: {
                        title: function() {
                            return title;
                        },
                        content: function() {
                            return content;
                        },
                        callback: function() {
                            return confirm;
                        }
                    }
                });
            },
            selectedModel: function(title, recordNum, confirm, forbArray) {
                return $modal.open({
                    templateUrl: "./components/service/sweetalert/view/dropDown_tpl.html",
                    windowClass: 'toBeCompiled-directSign-window',
                    backdrop: false,
                    controller: "dropDownList",
                    resolve: {
                        title: function() {
                            return title;
                        },
                        recordNum: function() {
                            return recordNum;
                        },
                        callback: function() {
                            return confirm;
                        },
                        forbArray: function() {
                            return forbArray;
                        }
                    }
                });
            },
            //展示页模块
            showModel: function(title, content) {
                return $modal.open({
                    templateUrl: "./components/service/sweetalert/view/show_tpl.html",
                    windowClass: 'toBeCompiled-directSign-window',
                    backdrop: false,
                    controller: "showCtrl",
                    resolve: {
                        title: function() {
                            return title;
                        },
                        content: function() {
                            return content;
                        },
                    }
                });
            },
            //保存模板提示
            //type :  success:成功   error:失败  info:提示   warning:警告
            saveModel: function(title, content, type) {
                return SweetAlert.swal({
                    title: title,
                    text: content,
                    type: type,
                    timer: 1500,
                    showConfirmButton: false
                });
            },
            //带一条输入框的模块
            typingModel: function(title, content, callback) {
                return $modal.open({
                    templateUrl: "./components/service/sweetalert/view/typing_tpl.html",
                    windowClass: 'toBeCompiled-typing-window',
                    backdrop: false,
                    controller: "typingCtrl",
                    resolve: {
                        transmission: function() {
                            return {
                                title: title,
                                content: content,
                                callback: callback
                            };
                        }
                    }
                });
            },
            // 取稿
            takeDraft: function(items) {
                var modalInstance = $modal.open({
                    templateUrl: "./resourceCenter/service/modal/takeDraftModal/takeDraftModal.html",
                    windowClass: "resource-take-draft",
                    backdrop: false,
                    resolve: {
                        items: function() {
                            return items;
                        }
                    },
                    controller: "takeDraftCtrl"
                });
                return modalInstance;
            },
            //多条返回信息提示框
            multiReportsAlert: function(data, callback) {
                var modalInstance = $modal.open({
                    templateUrl: "./components/service/sweetalert/view/multiReportsAlert_tpl.html",
                    windowClass: "multi-reports-alert-window",
                    controller: "multiReportsAlertCtrl",
                    // backdrop:true,
                    // animation:false,
                    resolve: {
                        data: function() {
                            return data;
                        }
                    }
                });
                modalInstance.result.then(function() {
                    if (angular.isFunction(callback)) {
                        callback();
                    }
                });
            }
        };
    }])
    .controller("reviewCtrl", ['$scope', 'title', 'placeholder', 'callback', 'SweetAlert', '$validation', '$timeout', 'content', function($scope, title, placeholder, callback, SweetAlert, $validation, $timeout, content) {
        if (angular.isDefined(content)) {
            $scope.content = content;
        }
        $scope.cancel = function() {
            $scope.$close();
        };
        $timeout(function() {
            $scope.confirm = function() {
                $validation.validate($scope.infoForm).success(function() {
                    callback($scope.content);
                    $scope.$close();
                });
            };
        });
        $scope.title = title;
        $scope.placeholder = placeholder;
    }])
    .controller("showCtrl", ['$scope', 'title', 'content', function($scope, title, content) {
        $scope.cancel = function() {
            $scope.$close();
        };
        $scope.title = title;
        $scope.content = content;

    }])
    .controller('directSignCtrl', ['$scope', "$sce", 'title', 'content', 'callback', function($scope, $sce, title, content, callback) {
        $scope.cancel = function() {
            $scope.$close();
        };
        $scope.isConfirm = function() {
            callback();
            $scope.$close();
        };
        $scope.title = title;
        $scope.content = content;
    }])
    .controller('dropDownList', ['$scope', 'title', 'recordNum', 'callback', 'forbArray', function($scope, title, recordNum, callback, forbArray) {

        $scope.dropLists = [];
        $scope.selectedPosition = "-1";
        if (angular.isArray(forbArray)) {
            $scope.forbArray = forbArray;
        }
        for (var i = 0; i < recordNum; i++) {
            var temp = i + 1;
            if ($scope.selectedPosition === "-1") $scope.selectedPosition = $scope.forbArray.indexOf(temp) > -1 ? $scope.selectedPosition : temp + "";
            $scope.dropLists.push(temp);
        }
        $scope.cancel = function() {
            $scope.$close();
        };
        $scope.isConfirm = function() {
            callback($scope.selectedPosition);
            $scope.$close();
        };
        $scope.title = title;
    }])
    .controller("typingCtrl", ['$scope', "$modalInstance", '$validation', 'transmission', function($scope, $modalInstance, $validation, transmission) {
        initData();
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
        $scope.confirm = function() {
            $validation.validate($scope.typingForm).success(function() {
                transmission.callback($scope.content);
                $modalInstance.dismiss();
            });
        };

        function initData() {
            $scope.title = transmission.title;
            $scope.content = transmission.content;
        }

    }]).controller("takeDraftCtrl", ['$scope', '$state', '$modalInstance', '$timeout', 'trsHttpService', 'trsconfirm', 'items', '$filter',
        function($scope, $state, $modalInstance, $timeout, trsHttpService, trsconfirm, items, $filter) {
            var selectChanel = {},
                ChnlDocIds = "",
                itemLength = items.length;
            $scope.selectChanel = selectChanel;
            //初始化数据
            initStatus();
            initData();

            // 切换tab选型卡
            $scope.setCurrMedia = function(media) {
                $scope.currMedia = media;
            };

            //关闭窗口
            $scope.close = function() {
                $modalInstance.dismiss();
            };
            // i 我
            $scope.changeRadioStatus = function() {
                    selectChanel.ToMy.isShow = !selectChanel.ToMy.isShow;
                    selectChanel.ToMy.label = $scope.mediasArray[0].mediaName;
                    setDirectEditDisabled();
                }
                // 网站
            $scope.changeSingleRadio = function(node) {
                    selectChanel.Web = {
                        label: $scope.mediasArray[2].mediaName + ">" + $scope.selectCollect.websiteSiteItem.SITENAME + ">" + node.CHNLNAME,
                        isShow: true,
                        item: node
                    }
                    setDirectEditDisabled();
                }
                // 纸媒
            $scope.selectPaperItem = function(item) {
                    selectChanel.Paper = {
                        label: $scope.mediasArray[1].mediaName + ">" + $scope.NewspaperData[$scope.selectCollect.selectNewspaper].SITENAME + ">" + $scope.NewspaperDieCiData[$scope.selectCollect.selectDieCi].CHNLNAME + ">" + item.CHNLNAME,
                        isShow: true,
                        item: item
                    }
                    setDirectEditDisabled();
                }
                //初始化数据
            function initData() {
                requestWebsiteSite();
                requestNewspaper();
            }

            function initStatus() {

                //当前选项卡
                $scope.currMedia = 1;
                //标题列表是否出现
                $scope.isTitleMoreShow = false;
                //直接编辑
                $scope.directDisabled = true;
                // 初始化纸媒时间
                $scope.PaperPubDate = new Date();

                $scope.mediasArray = [{
                    mediaName: "I我",
                    mediaType: 1
                }, {
                    mediaName: "纸媒",
                    mediaType: 2
                }, {
                    mediaName: "网站",
                    mediaType: 3
                }, {
                    mediaName: "APP",
                    mediaType: 4
                }];
                $scope.websiteSiteParams = {
                    'serviceid': "mlf_websiteconfig",
                    'methodname': "queryWebSites"
                };
                $scope.webExpandedTest = [];
                $scope.NewspaperParams = {
                    "serviceid": "mlf_paperset",
                    "methodname": "queryPagers"
                };
                $scope.selectCollect = {
                    'websiteSite': '',
                    'selectNewspaper': 0,
                    'selectDieCi': 0
                };
                var channel = "",
                    depart = "",
                    totalWords = 0,
                    docIds = "";
                angular.forEach(items, function(n, i) {
                    channel += "," + n.DOCCHANNEL;
                    depart += "," + n.ZB_SOURCE_SITE;
                    docIds += "," + n.ZB_GUID;
                    totalWords += Number(n.TXS);
                    n.DOCTITLE = n.DOCTITLE || n.TITLE; //共享稿库和其他几个列表返回字段不同
                });
                $scope.selectDocsInfo = {
                        channel: channel.substr(1),
                        depart: depart.substr(1),
                        size: items.length,
                        totalWords: totalWords,
                        items: items
                    }
                    // ChnlDocIds = docIds.substr(1);

                selectChanel.Paper = {};
                selectChanel.Web = {};
                selectChanel.APP = {};
                selectChanel.ToMy = {
                    isShow: false
                };
            }

            $scope.sendTimeSigned = function() {
                var timeSigned = $filter('date')($scope.PaperPubDate, "yyyy-MM-dd").toString();
                $modalInstance.close(timeSigned);
            };


            //树配置开始
            $scope.treeOptions = {
                nodeChildren: "CHILDREN",
                dirSelectable: true,
                allowDeselect: false,
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "take-draft-tree-label-sel"
                },
                isLeaf: function(node) {
                    return node.CHILDREN == undefined;
                }
            };
            //折叠时触发函数
            $scope.showToggle = function(node) {

            };
            //选中时触发函数
            $scope.showSelected = function(node) {

            };
            //请求网站站点列表
            function requestWebsiteSite(callback) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.websiteSiteParams, 'post').then(function(data) {
                    if (angular.isFunction(callback)) {
                        callback(data);
                    } else {
                        $scope.websiteSiteData = data.DATA;
                        $scope.selectCollect.websiteSite = $scope.websiteSiteData[0].SITEID;
                        $scope.selectCollect.websiteSiteItem = $scope.websiteSiteData[0];
                        requestWebTree($scope.selectCollect.websiteSite);
                    }
                });
            }
            //请求网站的树
            $scope.requestWebsiteTree = function(item) {
                if ($scope.selectCollect.websiteSite != item.SITEID) {
                    $scope.selectCollect.websiteSite = item.SITEID;
                    $scope.selectCollect.websiteSiteItem = item;
                    requestWebTree(item.siteId);
                }
            };

            function requestWebTree(siteId, callback) {
                var params = {
                    'serviceid': "mlf_websiteconfig",
                    'methodname': "queryClassifyBySite",
                    'SiteId': siteId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                    if (angular.isFunction(callback)) {
                        callback(data);
                    } else {
                        $scope.websiteTreeData = [data];
                        ExpandedNodes($scope.webExpandedTest, $scope.websiteTreeData);
                    }
                });
            }
            //展开的树
            function ExpandedNodes(expandedTest, dataForTheTree) {
                expandedTest = [];
                expandedTest.push(dataForTheTree[0]);
            }
            //请求媒体列表
            function requestNewspaper(callback) {
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.NewspaperParams, 'post').then(function(data) {
                    if (angular.isFunction(callback)) {
                        callback(data);
                    } else {
                        $scope.NewspaperData = data.DATA;
                        requestNewspaperDieCi($scope.NewspaperData[0].SITEID)
                    }
                });
            }
            //请求叠次报纸
            $scope.requestNewspaperDieCi = function(siteId, index) {
                if ($scope.selectCollect.selectNewspaper != index) {
                    $scope.selectCollect.selectNewspaper = index;
                    $scope.selectCollect.selectDieCi = 0;
                    requestNewspaperDieCi(siteId);
                }
            };

            function requestNewspaperDieCi(siteId, callback) {
                var params = {
                    "serviceid": "mlf_paperset",
                    "methodname": "queryDieCis",
                    "PaperId": siteId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                    if (angular.isFunction(callback)) {
                        callback(data);
                    } else {
                        $scope.NewspaperDieCiData = data;
                        if (data && data[0]) {
                            requestNewspaperCaiBianFn(siteId, $scope.NewspaperDieCiData[0].CHANNELID)
                        }
                    }
                });
            }
            //请求采编版面列表
            $scope.requestNewspaperCaiBian = function(siteId, channelId, index) {
                $scope.selectCollect.selectDieCi = index;
                requestNewspaperCaiBianFn(siteId, channelId)
            };

            function requestNewspaperCaiBianFn(siteId, channelId) {
                var params = {
                    "serviceid": "mlf_paper",
                    "methodname": "queryCaiBianBanMians",
                    "PaperId": siteId,
                    "DieCiId": channelId
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'post').then(function(data) {
                    if (data.length < 1) {
                        $scope.NewspaperCaiBianData = 0;
                    } else {
                        $scope.NewspaperCaiBianData = data;
                    }
                });
            }

            // 直接编辑
            $scope.directEdit = function() {
                if (!$scope.directDisabled) {
                    var sendObj = {};
                    for (var name in selectChanel) {
                        if (selectChanel[name].isShow) {
                            if (name == "ToMy") {
                                sendObj[name] = true;
                            } else if (name == "Paper") {
                                sendObj[name] = selectChanel[name].item.CHANNELID;
                                sendObj.PaperPubDate = $scope.PaperPubDate && $filter('date')($scope.PaperPubDate, "yyyy-MM-dd").toString();
                            } else if (name == "Web") {
                                sendObj[name] = selectChanel[name].item.CHANNELID;
                            }
                        }
                    }
                    sendObj.items = items;
                    sendObj.btnOp = 1;
                    $modalInstance.close(sendObj);
                }
            }

            // 稍后编辑
            $scope.sendInfo = function() {
                    var sendObj = {};
                    for (var name in selectChanel) {
                        if (selectChanel[name].isShow) {
                            if (name == "ToMy") {
                                sendObj[name] = true;
                            } else if (name == "Paper") {
                                sendObj[name] = selectChanel[name].item.CHANNELID;
                                sendObj.PaperPubDate = $scope.PaperPubDate && $filter('date')($scope.PaperPubDate, "yyyy-MM-dd").toString();
                            } else if (name == "Web") {
                                sendObj[name] = selectChanel[name].item.CHANNELID;
                            }
                        }
                    }
                    sendObj.items = items;
                    sendObj.btnOp = 2;
                    $modalInstance.close(sendObj);
                }
                // 移除选中的渠道
            $scope.removeChannel = function(item) {
                    item.isShow = false;
                    setDirectEditDisabled();
                }
                // 单稿件单渠道可直接编辑
            function setDirectEditDisabled() {
                var channelConut = 0;
                for (var name in selectChanel) {
                    if (selectChanel[name].isShow) {
                        channelConut++;
                    }
                }
                if (itemLength == 1 && channelConut == 1 || selectChanel.APP.isShow == true) {
                    $scope.directDisabled = false;
                } else {
                    $scope.directDisabled = true;
                }
            }
        }
    ]).controller('multiReportsAlertCtrl', ['$scope', '$modalInstance', '$timeout', 'data', function($scope, $modalInstance, $timeout, data) {
        if (data.ISSUCCESS == 'false' && data.TITLE == '签发照排') {
            $timeout(function() {
                $modalInstance.close();
            }, 6000);
        }
        $scope.status = {
            "issuccess": data.ISSUCCESS,
            "title": data.TITLE
        };

        $scope.reports = {
            "success": [],
            "fail": []
        };

        if ($scope.status.issuccess == "false") {
            angular.forEach(data.REPORTS, function(value, key) {
                if (value.ISSUCCESS == "true") {
                    $scope.reports.success.push(value.DETAIL);
                } else {
                    $scope.reports.fail.push(value.DETAIL);
                }
            });
        } else {
            angular.forEach(data.REPORTS, function(value, key) {
                $scope.reports.success.push(value.DETAIL);
            });
        }

        $scope.cancel = function() {
            $modalInstance.close();
        };
    }]);
