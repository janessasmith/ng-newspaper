/*create by ma.rongqin 2016.3.3*/
"use strict";
angular.module('editCenNewspaperSampleDetailModule', [])
    .controller('editCenNewspaperSampleDetailCtrl', ['$scope', '$sce', '$stateParams', 'trsHttpService', 'editNewspaperService', "trsconfirm", function($scope, $sce, $stateParams, trsHttpService, editNewspaperService, trsconfirm) {
        initStatus();
        initData();

        function initStatus() {
            $scope.status = {
                composeId: $stateParams.composeId,
                params: {
                    "serviceid": "mlf_paper",
                    "methodname": "findComposePageById",
                    "ComposeId": $stateParams.composeId
                },
                btnGroup: [{
                        activeWord: "放大",
                        functionName: "enlargeFn",
                        img: 'dy1'
                    }, {
                        activeWord: "缩小",
                        functionName: "narrowFn",
                        img: 'dy2'
                    },
                    // {
                    //     activeWord: "移动",
                    //     functionName: "moveFn",
                    //     img: 'dy3'
                    // }, 
                    {
                        activeWord: "文本评签意见",
                        functionName: "textDesignationFn",
                        img: 'dy4'
                    },
                    // {
                    //     activeWord: "画笔",
                    //     functionName: "paintBrushFn",
                    //     img: 'dy5'
                    // }, {
                    //     activeWord: "文字",
                    //     functionName: "wordsFn",
                    //     img: 'dy6'
                    // }, {
                    //     activeWord: "撤销编辑",
                    //     functionName: "cancelEditFn",
                    //     img: 'dy7'
                    // }, {
                    //     activeWord: "保存",
                    //     functionName: "saveFn",
                    //     img: 'dy8'
                    // }, 
                    {
                        activeWord: "流程版本",
                        functionName: "versionFn",
                        img: 'dy9'
                    }
                ],
                imgWidth: 100,
                btnStatus: {
                    isVersionShow: false
                },
                currActiveBtn: "",
            };
            $scope.data = {
                versionItems: [],
                voiceObj: {},
            };
            $scope.page = {
                CURRPAGE: 1,
                PAGESIZE: 20,
                ITEMCOUNT: 0,
                PAGECOUNT: 1,
            };
        }

        function initData() {
            requestData();
        }
        /**
         * [requestVersion description]请求流程版本
         */
        function requestVersion() {
            var params = {
                "serviceid": "mlf_paper",
                "methodname": "queryDaYangReviews",
                "ComposeId": $stateParams.composeId,
                "CurrPage": $scope.page.CURRPAGE,
                "PageSize": $scope.page.PAGESIZE,
            }
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                $scope.data.versionItems = $scope.data.versionItems.concat(data.DATA);
                !!data.PAGER ? $scope.page = data.PAGER : $scope.page.ITEMCOUNT = 0;
                angular.forEach(data.DATA, function(value, key) {
                    if (value.REVIEWTYPE == '2') {
                        requestVoice(value.REVIEWCONTENT);
                    };
                });
            })

        }
        /**
         * [loadMore description]加载更多评论
         */
        $scope.loadMore = function() {
            if ($scope.page.CURRPAGE * $scope.page.PAGESIZE >= $scope.page.ITEMCOUNT) return;
            $scope.page.CURRPAGE++;
            requestVersion();
        };
        /**
         * [requestData description]请求该大样数据
         */
        function requestData() {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), $scope.status.params, 'get').then(function(data) {
                $scope.data.items = data;
            })
        }
        /**
         * [promptRequest description]具体操作数据请求成功后刷新列表
         * @param  {[obj]} params [description]请求参数
         * @param  {[string]} info   [description]提示语
         * @return {[type]}        [description]
         */
        function promptRequest(params, info, callback) {
            trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                trsconfirm.alertType(info, "", "success", false, function() {
                    if (angular.isFunction(callback)) {
                        callback();
                    } else {
                        requestData();
                    }
                });
            });
        }
        /**
         * [enterOperationBtn description]进入操作按钮
         * @param {[string]} currBtn [description] 当前移过的按钮
         */
        $scope.enterOperationBtn = function(currBtn) {
            $scope.status.currActiveBtn = currBtn;
        };
        /**
         * [leaveOperationBtn description]离开操作按钮
         */
        $scope.leaveOperationBtn = function() {
            $scope.status.currActiveBtn = "";
        };
        /**
         * [closePage description]关闭当前页面
         */
        $scope.closePage = function() {
            window.close();
        };
        /**
         * [functionOrientation description]按钮函数定向
         * @param {[string]} word [description] 操作
         */
        $scope.functionOrientation = function(funname) {
            eval("$scope." + funname + "()");
        };
        /**
         * [enlargeFn description]放大
         */
        $scope.enlargeFn = function() {
            if ($scope.status.imgWidth == 400) {
                trsconfirm.alertType("已缩放至最大", "", "warning", false);
            } else {
                $scope.status.imgWidth += 10;
            }
        };
        /**
         * [narrowFn description]缩小
         */
        $scope.narrowFn = function() {
            if ($scope.status.imgWidth == 10) {
                trsconfirm.alertType("已缩放至最小", "", "warning", false);
            } else {
                $scope.status.imgWidth -= 10;
            }
        };
        /**
         * [moveFn description]移动
         */
        $scope.moveFn = function() {
            console.log("移动");
        };
        /**
         * [textDesignationFn description]文本评签意见
         */
        $scope.textDesignationFn = function() {
            editNewspaperService.textDesignation(function(result) {
                var params = {
                    "serviceid": "mlf_paper",
                    "methodname": "reviewDaYang",
                    "DyFileName": $scope.data.items.DYFILEPATH,
                    "ComposeId": $scope.data.items.COMPOSEPAGEINFOID,
                    "ReviewContent": result.content,
                    "ReviewRect": "1,2,3,4"
                }
                promptRequest(params, "评审成功", function() {
                    $scope.page.CURRPAGE = 1;
                    $scope.data.versionItems = [];
                    requestVersion();
                })
            })
        };
        /**
         * [paintBrushFn description]画笔
         */
        $scope.paintBrushFn = function() {
            console.log("画笔");
        };
        /**
         * [wordsFn description]文字
         */
        $scope.wordsFn = function() {
            console.log("文字");
        };
        /**
         * [cancelEditFn description]撤销编辑
         */
        $scope.cancelEditFn = function() {
            console.log("撤销编辑");
        };
        /**
         * [saveFn description]保存
         */
        $scope.saveFn = function() {
            console.log("保存");
        };
        /**
         * [saveFn description]流程版本
         */
        $scope.versionFn = function() {
            if (!$scope.status.btnStatus.isVersionShow) {
                requestVersion();
            }
            $scope.status.btnStatus.isVersionShow = !$scope.status.btnStatus.isVersionShow;
            $scope.page.CURRPAGE = 1;
            $scope.data.versionItems = [];
        };
        /**
         * [requestVoice description]请求音频文件
         */
        function requestVoice(id) {
            trsHttpService.httpServer(window.location.origin + '/mas/openapi/pages.do', {
                'method': 'prePlay',
                'appKey': 'TRSWCM7',
                'json': { "masId": id, "isLive": "false", "player": "HTML5" },
            }, 'get').then(function(data) {
                $scope.data.voiceObj[id] = data.streamsMap.l.httpURL;
            });
        }
        /**
         * [trustUrl description]信任url
         */
        $scope.trustUrl = $sce.trustAsResourceUrl;
    }]);
