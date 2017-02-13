'use strict';
/**
 *  Module 热搜词排行榜
 *  creatBy  Ly   2016/3/7
 * Description
 */
angular.module('rankingListServiceModele', []).factory('rankingList', function() {
    return {
        tabTitle: function() {
            var tabTitle = [{
                name: "网易",
                value: 0
            }, {
                name: "新浪",
                value: 1
            }, {
                name: "腾讯",
                value: 2
            }, {
                name: "搜狐",
                value: 3
            }, {
                name: "凤凰",
                value: 4
            }, {
                name: "中国搜索",
                value: 5,
                showReadingCurve: false, //显示阅读曲线
                showClick: false //显示点击数
            }, {
                name: "人民网",
                value: 6,
                showReadingCurve: false,
                showClick: false //显示点击数
            }];
            return tabTitle;
        },
        childTitle: function() {
            var childTitle = {
                0: [{
                    "CHANNEL": "推荐",
                    "CATEGORY": "推荐"
                }, {
                    "CHANNEL": "全站-24小时点击排行",
                    "CATEGORY": "全站"
                }, {
                    "CHANNEL": "新闻-24小时点击排行",
                    "CATEGORY": "新闻"
                }, {
                    "CHANNEL": "娱乐-24小时点击排行",
                    "CATEGORY": "娱乐"
                }, {
                    "CHANNEL": "财经-24小时点击排行",
                    "CATEGORY": "财经"
                }, {
                    "CHANNEL": "科技-24小时点击排行",
                    "CATEGORY": "科技"
                }, {
                    "CHANNEL": "汽车-24小时点击排行",
                    "CATEGORY": "汽车"
                }, {
                    "CHANNEL": "女人-24小时点击排行",
                    "CATEGORY": "女人"
                }, {
                    "CHANNEL": "房产-24小时点击排行",
                    "CATEGORY": "房产"
                }, {
                    "CHANNEL": "读书-24小时点击排行",
                    "CATEGORY": "读书"
                }, {
                    "CHANNEL": "游戏-24小时点击排行",
                    "CATEGORY": "游戏"
                }, {
                    "CHANNEL": "公益-24小时点击排行",
                    "CATEGORY": "公益"
                }, {
                    "CHANNEL": "校园-24小时点击排行",
                    "CATEGORY": "校园"
                }, {
                    "CHANNEL": "传媒-24小时点击排行",
                    "CATEGORY": "传媒"
                }],
                1: [{
                    "CHANNEL": "推荐",
                    "CATEGORY": "推荐"
                }, {
                    "CHANNEL": "点击量排行-国内",
                    "CATEGORY": "国内"
                }, {
                    "CHANNEL": "点击量排行-国际",
                    "CATEGORY": "国际"
                }, {
                    "CHANNEL": "点击量排行-社会新闻",
                    "CATEGORY": "社会新闻"
                }, {
                    "CHANNEL": "点击量排行-体育新闻",
                    "CATEGORY": "体育新闻"
                }, {
                    "CHANNEL": "点击量排行-财经新闻",
                    "CATEGORY": "财经新闻"
                }, {
                    "CHANNEL": "点击量排行-娱乐新闻",
                    "CATEGORY": "娱乐新闻"
                }, {
                    "CHANNEL": "点击量排行-科技新闻",
                    "CATEGORY": "科技新闻"
                }, {
                    "CHANNEL": "点击量排行-军事新闻",
                    "CATEGORY": "军事新闻"
                }],
                2: [{
                    "CHANNEL": "推荐",
                    "CATEGORY": "推荐"
                }, {
                    "CHANNEL": "国内新闻",
                    "CATEGORY": "国内新闻"
                }, {
                    "CHANNEL": "国际新闻",
                    "CATEGORY": "国际新闻"
                }, {
                    "CHANNEL": "社会新闻",
                    "CATEGORY": "社会新闻"
                }, {
                    "CHANNEL": "娱乐新闻",
                    "CATEGORY": "娱乐新闻"
                }, {
                    "CHANNEL": "体育新闻",
                    "CATEGORY": "体育新闻"
                }, {
                    "CHANNEL": "财经新闻",
                    "CATEGORY": "财经新闻"
                }, {
                    "CHANNEL": "科技新闻",
                    "CATEGORY": "科技新闻"
                }],
                3: [{
                    "CHANNEL": "推荐",
                    "CATEGORY": "推荐"
                }, {
                    "CHANNEL": "首页-12小时全站热评TOP20",
                    "CATEGORY": "首页"
                }, {
                    "CHANNEL": "新闻-新闻热评排行榜",
                    "CATEGORY": "新闻"
                }, {
                    "CHANNEL": "财经-财经热评排行榜",
                    "CATEGORY": "财经"
                }, {
                    "CHANNEL": "娱乐-娱乐热评排行榜",
                    "CATEGORY": "娱乐"
                }, {
                    "CHANNEL": "体育-体育热评排行榜",
                    "CATEGORY": "体育"
                }, {
                    "CHANNEL": "时尚-时尚热评排行榜",
                    "CATEGORY": "时尚"
                }, {
                    "CHANNEL": "IT数码-IT热评排行榜",
                    "CATEGORY": "IT数码"
                }],
                4: [{
                    "CHANNEL": "推荐",
                    "CATEGORY": "推荐"
                }, {
                    "CHANNEL": "资讯-点击排行",
                    "CATEGORY": "资讯"
                }, {
                    "CHANNEL": "军事-点击排行",
                    "CATEGORY": "军事"
                }, {
                    "CHANNEL": "体育-点击排行",
                    "CATEGORY": "体育"
                }, {
                    "CHANNEL": "财经-点击排行",
                    "CATEGORY": "财经"
                }, {
                    "CHANNEL": "娱乐-点击排行",
                    "CATEGORY": "娱乐"
                }, ],
                5: [{
                    "CHANNEL": "推荐",
                    "CATEGORY": "推荐"
                }, {
                    "CHANNEL": "国内",
                    "CATEGORY": "国内"
                }, {
                    "CHANNEL": "国际",
                    "CATEGORY": "国际"
                }, {
                    "CHANNEL": "财经",
                    "CATEGORY": "财经"
                }, {
                    "CHANNEL": "科技",
                    "CATEGORY": "科技"
                }, {
                    "CHANNEL": "体育",
                    "CATEGORY": "体育"
                }, {
                    "CHANNEL": "娱乐",
                    "CATEGORY": "娱乐"
                }, {
                    "CHANNEL": "军事",
                    "CATEGORY": "军事"
                }, {
                    "CHANNEL": "法治",
                    "CATEGORY": "法治"
                }],
                6: [{
                    "CHANNEL": "推荐",
                    "CATEGORY": "推荐"
                }, /*{
                    "CHANNEL": "每日新闻排行",
                    "CATEGORY": "每日新闻排行"
                },*/ {
                    "CHANNEL": "总榜",
                    "CATEGORY": "总榜"
                }, {
                    "CHANNEL": "时政",
                    "CATEGORY": "时政"
                }, {
                    "CHANNEL": "国际",
                    "CATEGORY": "国际"
                }, {
                    "CHANNEL": "军事",
                    "CATEGORY": "军事"
                }, {
                    "CHANNEL": "经济",
                    "CATEGORY": "经济"
                }, {
                    "CHANNEL": "文化",
                    "CATEGORY": "文化"
                }, {
                    "CHANNEL": "教育",
                    "CATEGORY": "教育"
                }, {
                    "CHANNEL": "健康",
                    "CATEGORY": "健康"
                }, {
                    "CHANNEL": "社会",
                    "CATEGORY": "社会"
                }, {
                    "CHANNEL": "科技",
                    "CATEGORY": "科技"
                }, {
                    "CHANNEL": "体育",
                    "CATEGORY": "体育"
                }, {
                    "CHANNEL": "旅游",
                    "CATEGORY": "旅游"
                }]
            };
            return childTitle;
        },
        sinaTitle: function() {
            var sinaTitle = [{
                title: "点击量排行"
            }, {
                title: "分享数排行"
            }, {
                title: "评论数排行"
            }, ];
            return sinaTitle;
        },
        sinaChildTitle: function() {
            var sinaChildTitle = {
                1: [{
                    "CHANNEL": "推荐",
                    "CATEGORY": "推荐"
                }, {
                    "CHANNEL": "点击量排行-国内",
                    "CATEGORY": "国内"
                }, {
                    "CHANNEL": "点击量排行-国际",
                    "CATEGORY": "国际"
                }, {
                    "CHANNEL": "点击量排行-社会新闻",
                    "CATEGORY": "社会新闻"
                }, {
                    "CHANNEL": "点击量排行-体育新闻",
                    "CATEGORY": "体育新闻"
                }, {
                    "CHANNEL": "点击量排行-财经新闻",
                    "CATEGORY": "财经新闻"
                }, {
                    "CHANNEL": "点击量排行-娱乐新闻",
                    "CATEGORY": "娱乐新闻"
                }, {
                    "CHANNEL": "点击量排行-科技新闻",
                    "CATEGORY": "科技新闻"
                }, {
                    "CHANNEL": "点击量排行-军事新闻",
                    "CATEGORY": "军事新闻"
                }],
                2: [{
                    "CHANNEL": "推荐",
                    "CATEGORY": "推荐"
                }, {
                    "CHANNEL": "分享数排行-国内",
                    "CATEGORY": "国内"
                }, {
                    "CHANNEL": "分享数排行-国际",
                    "CATEGORY": "国际"
                }, {
                    "CHANNEL": "分享数排行-社会新闻",
                    "CATEGORY": "社会新闻"
                }, {
                    "CHANNEL": "分享数排行-体育新闻",
                    "CATEGORY": "体育新闻"
                }, {
                    "CHANNEL": "分享数排行-财经新闻",
                    "CATEGORY": "财经新闻"
                }, {
                    "CHANNEL": "点击量排行-娱乐新闻",
                    "CATEGORY": "娱乐新闻"
                }, {
                    "CHANNEL": "分享数排行-科技新闻",
                    "CATEGORY": "科技新闻"
                }, {
                    "CHANNEL": "分享数排行-军事新闻",
                    "CATEGORY": "军事新闻"
                }],
                3: [{
                    "CHANNEL": "推荐",
                    "CATEGORY": "推荐"
                }, {
                    "CHANNEL": "评论数排行-国内",
                    "CATEGORY": "国内"
                }, {
                    "CHANNEL": "评论数排行-国际",
                    "CATEGORY": "国际"
                }, {
                    "CHANNEL": "评论数排行-社会新闻",
                    "CATEGORY": "社会新闻"
                }, {
                    "CHANNEL": "评论数排行-体育新闻",
                    "CATEGORY": "体育新闻"
                }, {
                    "CHANNEL": "评论数排行-财经新闻",
                    "CATEGORY": "财经新闻"
                }, {
                    "CHANNEL": "评论数排行-娱乐新闻",
                    "CATEGORY": "娱乐新闻"
                }, {
                    "CHANNEL": "评论数排行-科技新闻",
                    "CATEGORY": "科技新闻"
                }, {
                    "CHANNEL": "评论数排行-军事新闻",
                    "CATEGORY": "军事新闻"
                }]
            };
            return sinaChildTitle;
        },
        initOption: function() {
            var option = {
                title: {
                    text: '',
                    subtext: '',
                    textAlign: 'left',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['阅读曲线']
                },
                dataZoom: [{
                    type: 'slider',
                    show: true,
                    start: 0,
                    end: 100,
                    handleSize: 8
                }, {
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    type: 'slider',
                    show: true,
                }],
                toolbox: {
                    show: false,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: false,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: false
                        },
                        saveAsImage: {
                            show: false
                        }
                    }
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    boundaryGap: true,
                    show: false,
                    axisLine: {
                        lineStyle: { color: '#C5E1F3' }
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name: '热度',
                    show: false,
                    axisLabel: {
                        formatter: '{value} '
                    }
                }],
                series: [{
                    name: '热度',
                    show: false,
                    type: 'line',
                }]
            };
            return option;
        }
    };
});
