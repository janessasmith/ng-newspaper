"use strict";
angular.module('rankingListModule', [
        "mgcrea.ngStrap.affix",
        "rankingListServiceModele",
        'planRankListModule',
        'weChatPostListModule'
    ])
    .controller('rankingListController', ['$scope', '$q', 'trsHttpService', 'randomTxtList', '$filter', 'rankingList', '$timeout',
        function($scope, $q, trsHttpService, randomTxtList, $filter, rankingList, $timeout) {
            initData();
            initStatus();
            //初始化状态
            function initStatus() {
                $scope.status = {
                    extraInfoShow: false,
                    //初始化标题
                    rankingTitle: rankingList.tabTitle(),
                    //初始化TAB
                    rankingTabs: "网易",
                    //新浪初始化标题
                    rankingSinaTitle: rankingList.sinaTitle(),
                    //初始化小图长宽高度
                    initSmallRankingwidth: {
                        height: '30px',
                        width: '100px'
                    },
                    //初始化大图长宽
                    initBigRankingwidth: {
                        height: '240px',
                        width: '1000px'
                    },
                    //初始化热度曲线
                    readCurve: '',
                    //初始化人物榜单TAB
                    figureListTab: [],
                    //初始化任务榜单详情
                    figureListDetail: [],
                    //初始化新浪右侧标签点击
                    ranklistRigthBth: rankingList.sinaChildTitle(),
                    //初始化媒体
                    SRCNAME: [],
                    //初始化微信tab按钮
                    weChatTab: [],
                    //初始化微信对象
                    weChatObj: {
                        time: $filter('date')(new Date(), "yyyy-MM-dd"),
                        name: '',
                    },
                    //初始化微信列表
                    weChatlist: [],
                    jumpToPageNum: 1,
                    curchannelName: "推荐",
                    sinaAcitve: rankingList.sinaTitle()[0],
                };
                $scope.data = {
                    //初始化门户列表
                    rankingTabList: rankingList.childTitle(),
                    //初始化门户数字
                    rankingTabListNum: [],
                    //初始化门户频道
                    rankingChannel: '',
                    //分页参数
                    ITEMCOUNT: '',
                };
                $scope.page = {
                    "startpage": 1,
                    "PAGESIZE": 10
                };
                $scope.params = {
                    pagesize: $scope.page.PAGESIZE,
                    startpage: $scope.page.startpage,

                };
                initranking();
                //初始化人物榜单
            }
            //初始化数
            function initData() {
                //初始化门户排行榜
                figureRankingList();
                //初始化微信排行榜
                // weChatTab();


            }
            /**
             * [ initranking description] 初始化门户列表
             *
             */
            function initranking() {
                $scope.data.rankingTabListNum = $scope.data.rankingTabList[0];
                ranklistListDetail($scope.data.rankingTabListNum[0].CHANNEL);
            }
            /**
             * [ ranklistDetail description] 门户详情排行榜
             * @params rankingTitle   [description]标签名称obj 
             */
            $scope.titletab = function(rankingTitle) {
                $scope.status.rankingTabs = rankingTitle.name;
                $scope.status.showReadingCurve = rankingTitle.showReadingCurve; //是否显示阅读曲线
                $scope.status.showClick = rankingTitle.showClick; //是否显示点击数
                $scope.status.sinaStatus.channel = '推荐';
                $scope.page.startpage = 1;
                $scope.status.jumpToPageNum = 1;
                $scope.data.rankingTabListNum = $scope.data.rankingTabList[rankingTitle.value];
                ranklistListDetail($scope.data.rankingTabList[rankingTitle.value][0].CHANNEL).then(
                    function(data) {
                        if (data.sitename === "新浪") {
                            $scope.status.sinaStatus = {
                                channel: "推荐",
                                name: "推荐",
                            };
                        }
                    });
            };
            /**
             * [ranklistDetail description] 门户详情排行榜
             * @params channel   [description]站点名称，使用URLEncoder，比如%E5%86%9B%E4%BA%8B
             */
            $scope.ranklistTab = function(channel) {
                $scope.page.startpage = 1;
                $scope.status.jumpToPageNum = 1;
                if ($scope.status.rankingTabs == '新浪') {
                    $scope.status.curchannelName = channel.CATEGORY != '推荐' ? $scope.status.sinaAcitve.title + '-' + channel.CATEGORY : "推荐";
                }
                var params = $scope.status.rankingTabs == '新浪' ? $scope.status.curchannelName : channel.CHANNEL;
                ranklistListDetail(params);
                $scope.status.sinaStatus = {
                    channel: channel.CATEGORY
                };
            };
            /*
             *[titletab description] 门户排行榜Tab按钮
             *@params SinaTitle   [description]站点名称，使用URLEncoder，比如%E5%86%9B%E4%BA%8B
             */
            $scope.sinaNewsRanking = function(SinaTitle, index) {
                $scope.status.sinaAcitve = SinaTitle;
                var channel = "";
                var type = "";
                var rankTab = index + 1;
                // $scope.data.rankingTabListNum = [];
                switch (index) {
                    case 0:
                        // $scope.data.rankingTabListNum = angular.copy($scope.status.ranklistRigthBth[rankTab]);
                        if ($scope.status.curchannelName != '推荐') {
                            channel = '点击量排行' + '-' + $scope.status.curchannelName.split('-').pop();
                        } else {
                            channel = "推荐";
                        }
                        type = "点击量排行";
                        $scope.status.sinaStatus.name = "阅读数";
                        break;
                    case 1:
                        // $scope.data.rankingTabListNum = angular.copy($scope.status.ranklistRigthBth[rankTab]);
                        if ($scope.status.curchannelName != '推荐') {
                            channel = '分享数排行' + '-' + $scope.status.curchannelName.split('-').pop();
                        } else {
                            channel = "推荐";
                        }
                        type = "分享数排行";
                        $scope.status.sinaStatus.name = "分享数";
                        break;
                    case 2:
                        // $scope.data.rankingTabListNum = angular.copy($scope.status.ranklistRigthBth[rankTab]);
                        if ($scope.status.curchannelName != '推荐') {
                            channel = '评论数排行' + '-' + $scope.status.curchannelName.split('-').pop();
                        } else {
                            channel = "推荐";
                        }
                        type = "评论数排行";
                        $scope.status.sinaStatus.name = "评论数";
                        break;
                }
                ranklistListDetail(channel, type).then(function(data) {
                    $scope.status.sinaStatus.type = data.type;
                });
            };
            /**
             * [ranklistDetail description] 门户详情排行榜
             * @params channel   [description]站点名称，使用URLEncoder，比如%E5%86%9B%E4%BA%8B
             */
            function ranklistListDetail(channel, type) {
                $scope.status.sinaStatus = {
                    channel: channel
                };
                var defer = $q.defer();
                var ranking = {
                    typeid: "widget",
                    serviceid: "portallist2",
                    modelid: "getinfolist",
                    sitename: $scope.status.rankingTabs,
                    channel: channel,
                    type: type,
                    pagesize: $scope.page.PAGESIZE,
                    page_no: $scope.page.startpage - 1,
                };

                if ($scope.status.rankingTabs == "新浪" && ranking.type === undefined) {
                    ranking.type = angular.isDefined($scope.status.sinaAcitve) ? $scope.status.sinaAcitve.title : "点击量排行";
                    defer.resolve(ranking);
                } else {
                    ranking.type = type;
                }
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), ranking, "get").then(function(data) {
                    $scope.data.ranklistLists = data.CONTENT.RESULT.CONTENT;
                    $scope.data.ranklistLists.name = angular.copy(data.CONTENT.RESULT.CONTENT[0].ORDERNAME);
                    mediaReplace(data.CONTENT.RESULT.CONTENT);
                    $scope.page = {
                        startpage: data.CONTENT.RESULT.NUMBER + 1,
                        PAGESIZE: data.CONTENT.RESULT.SIZE,
                        ITEMCOUNT: data.CONTENT.RESULT.TOTALELEMENTS,
                        PAGECOUNT: data.CONTENT.RESULT.TOTALPAGES
                    };

                });
                return defer.promise;
            }
            /**
             * [pageChanged description]分页请求
             * @return {[type]} [description]
             */
            $scope.pageChanged = function() {
                $scope.status.jumpToPageNum = $scope.page.startpage;
                $scope.params.page_no = $scope.page.startpage - 1;
                ranklistListDetail($scope.status.sinaStatus.channel);
            };
            $scope.jumpToPage = function() {
                if ($scope.status.jumpToPageNum > $scope.page.PAGECOUNT) {
                    $scope.status.jumpToPageNum = $scope.page.PAGECOUNT;
                }
                $scope.params.page_no = $scope.status.jumpToPageNum - 1;
                ranklistListDetail($scope.status.sinaStatus.channel);
            };
            /*
             *[  mediaReplace description] 门户排行榜媒体下去掉括号
             *@params item   [description]媒体名称
             */
            function mediaReplace(item) {
                $scope.status.SRCNAME = [];
                var objNull = "";
                for (var i = 0; i < item.length; i++) {
                    if (item[i].SRCNAME === null || item[i].SRCNAME === '') {
                        $scope.status.SRCNAME.push(objNull);
                    } else {
                        var media = item[i].SRCNAME.replace('\(', '');
                        media = media.replace('\)', '');
                        $scope.status.SRCNAME.push(media);
                    }
                }
            }
            /*
             *[  readCurve description] 门户排行榜阅读曲线
             *@params item   [description]标题名称
             */
            $scope.readCurve = function(item) {
                $scope.status.readCurve = (($scope.status.readCurve == item) ? '' : item);
            };

            /*
             *[  readCurve description] 人物榜单
             *
             */
            function figureRankingList() {
                var ranking = {
                    typeid: "widget",
                    serviceid: "figurerank",
                    modelid: "channel",
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), ranking, "get").then(function(data) {
                    $scope.data.figureListTab = data;
                    figureRankingdetail(data[0]);
                });
            }
            /*
             *[  readCurve description] 人物榜单
             *@params channel   [description]标题名称
             */
            function figureRankingdetail(channel) {
                var ranking = {
                    typeid: "widget",
                    serviceid: "figurerank",
                    modelid: "content",
                    channel: channel
                };
                $scope.loadingPromise = trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), ranking, "get").then(function(data) {
                    $scope.data.figureListDetail = data;
                });
            }
            /*
             *changeFigureTab[ description] 人物排行榜Tab按钮
             *@params channel   [description]标题名称
             */
            $scope.changeFigureTab = function(channel) {
                figureRankingdetail(channel);
            };
            /*
             *plancenterdetail[ description] 人物排行榜弹出
             *@params channel   [description]url名称
             */
            $scope.plancenterdetail = function(item) {
                window.open(item.URLNAME);
            };

            /*
             *WeChatTab [ description] 微信榜单TAB按钮
             */
            // function weChatTab() {
            //     var weChat = {
            //         typeid: "widget",
            //         serviceid: "hotpointcluster",
            //         modelid: "allfields",
            //     };
            //     trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), weChat, "get").then(function(data) {
            //         $scope.status.weChatTab = data;
            //         $scope.status.weChatObj.name=angular.copy(data[0].ID);
            //         weChatList(data[0].ID, $scope.status.weChatObj.time);
            //     });
            // }
            /*
             *WeChatList [ description] 微信榜单列表
             *@params field [description] 分类id
             *@params loadtime [description] 日期，yyyy-MM-dd格式
             */
            function weChatList(field, loadtime) {
                var chatList = {
                    typeid: "widget",
                    serviceid: "wechatranklist",
                    modelid: "getwechatlist",
                    field: field,
                    loadtime: loadtime,
                };
                trsHttpService.httpServer(trsHttpService.getBigDataRootUrl(), chatList, "get").then(function(data) {
                    $scope.status.weChatlist = data;
                });
            }
            /*
             *weChatChange [ description] 单击TAB按钮 切换数据
             */
            $scope.weChatChange = function(item) {
                $scope.status.weChatObj.time = $filter('date')($scope.status.weChatObj.time, "yyyy-MM-dd");
                $scope.status.weChatObj.name = angular.copy(item.ID);
                //weChatList(item.ID, $scope.status.weChatObj.time);
            };
            /*
             *监听微信时间 请求数据
             */
            $scope.$watch('status.weChatObj.time', function(newValue, oldValue) {
                if ($scope.status.weChatObj.time !== "") {
                    $scope.status.weChatObj.time = $filter('date')(newValue, "yyyy-MM-dd").toString();
                    //weChatList($scope.status.weChatObj.name, $scope.status.weChatObj.time);
                }
            });


        }
    ]);
