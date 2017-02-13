$(function() {
    if (window.frameElement) {
        var height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        window.frameElement.style.height = height + 'px';
        window.frameElement.style.overflow = 'hidden';
    } else {
        var containerEleObj = $("#container");
        var containerWidth = 1100;
        var offsetWidth = document.body.offsetWidth;
        if (offsetWidth < containerWidth) {
            containerEleObj.css({
                width: containerWidth + "px",
                "transform": "scale(" + offsetWidth / containerWidth + ")",
                "-webkit-transform": "scale(" + offsetWidth / containerWidth + ")",
                "transform-origin": "left top",
                "-webkit-transform-origin": "left top"
            });
        } else {
            containerEleObj.css({
                width: containerWidth + "px",
                left: "50%",
                "margin-left": -containerWidth / 2 + "px"
            });
        }
    }


    hotInfoVisual.quanQuoPanel = {
        tag: "quanGuo",
        cluser: "country",
        time: hotInfoVisual.time.curTime,
        curPage: {
            index: 0
        },
        srcArea: {
            id: "001",
            name: "全国"
        },
        curArea: {
            id: "001",
            name: "全国"
        },
        container: {
            mapContainer: "",
            chartContainer: ""
        },
        // 仅全国面板使用
        loadDaysList: [{
            //     desc: "七日",
            //     value: 7
            // }, {
            desc: "3日",
            value: 3
        }, {
            desc: "1日",
            value: 1
        }],
        mapOption: {
            mapType: "china",
            selectedMode: '',
            // 点击地图的某个区域时要执行的逻辑处理
            selectedEventFn: function(param) {
                var selected = param.target;
                if (hotInfoVisual.quanQuoPanel.curArea.name == selected) {
                    // 取消选择
                    hotInfoVisual.quanQuoPanel.curArea.id = hotInfoVisual.quanQuoPanel.srcArea.id;
                    hotInfoVisual.quanQuoPanel.curArea.name = hotInfoVisual.quanQuoPanel.srcArea.name;
                    drawNewsList(hotInfoVisual.quanQuoPanel);
                    return;
                }
                var mapAreaNames = hotInfoVisual.mapArea.name[hotInfoVisual.quanQuoPanel.mapOption.mapType] || [];
                for (var i = 0, length = mapAreaNames.length; i < length; i++) {
                    var mapAreaName = mapAreaNames[i];
                    if (mapAreaName.dictName == selected) {
                        // 重新加载热点信息列表中的数据
                        hotInfoVisual.quanQuoPanel.curArea.id = mapAreaName.dictNum;
                        hotInfoVisual.quanQuoPanel.curArea.name = selected;
                        drawNewsList(hotInfoVisual.quanQuoPanel);
                        break;
                    }
                }
            }
        },
        // 全国、杭州市面板使用
        categories: [{
            id: 0,
            name: "全部"
        }, {
            id: "001",
            name: "政治"
        }, {
            id: "002",
            name: "经济"
        }, {
            id: "003",
            name: "司法"
        }, {
            id: "004",
            name: "军事"
        }, {
            id: "005",
            name: "社会"
        }, {
            id: "006",
            name: "地产"
        }, {
            id: "007",
            name: "科技"
        }, {
            id: "008",
            name: "人文"
        }, {
            id: "009",
            name: "体育"
        }, {
            id: "010",
            name: "教育"
        }, {
            id: "011",
            name: "生活"
        }, {
            id: "012",
            name: "健康"
        }]
    }
    hotInfoVisual.quanQuoPanel.curSelectedCatetory = $.extend(true, {}, hotInfoVisual.quanQuoPanel.categories[0]);
    hotInfoVisual.quanQuoPanel.curSelectedLoadDays = $.extend(true, {}, hotInfoVisual.quanQuoPanel.loadDaysList[hotInfoVisual.quanQuoPanel.loadDaysList.length - 1]);

    // 为了数据调试，暂时将默认日期由当前日期设置为2016-02-24
    // hotInfoVisual.time.update(hotInfoVisual.quanQuoPanel.time, new Date("2016-02-24"));

    hotInfoVisual.zheJiangPanel = $.extend(true, {}, hotInfoVisual.quanQuoPanel, {
        tag: "zheJiang",
        cluser: "provice",
        srcArea: {
            id: "001020",
            name: "浙江"
        },
        curArea: {
            id: "001020",
            name: "浙江"
        },
        mapOption: {
            mapType: "浙江",
            selectedMode: 'single',
            curSelectedMode: "杭州市",
            selectedEventFn: function(param) {
                var selected = param.target;
                if (hotInfoVisual.zheJiangPanel.curArea.name == selected) {
                    // 取消选择
                    hotInfoVisual.zheJiangPanel.curArea.id = hotInfoVisual.zheJiangPanel.srcArea.id;
                    hotInfoVisual.zheJiangPanel.curArea.name = hotInfoVisual.zheJiangPanel.srcArea.name;
                    drawNewsList(hotInfoVisual.zheJiangPanel);
                    return;
                }
                var mapAreaNames = hotInfoVisual.mapArea.name[hotInfoVisual.zheJiangPanel.mapOption.mapType] || [];
                for (var i = 0, length = mapAreaNames.length; i < length; i++) {
                    var mapAreaName = mapAreaNames[i];
                    if (mapAreaName.dictName == selected) {
                        hotInfoVisual.zheJiangPanel.curArea.id = mapAreaName.dictNum;
                        hotInfoVisual.zheJiangPanel.curArea.name = selected;
                        drawNewsList(hotInfoVisual.zheJiangPanel);
                        break;
                    }
                }
                // var selected = param.target;
                // hotInfoVisual.hangZhouPanel.area = selected;
                hotInfoVisual.hangZhouPanel.mapOption.mapType = selected;
                var clusterName = hotInfoVisual.clusterNames[selected];
                // if (clusterName) {
                hotInfoVisual.hangZhouPanel.cluser = clusterName;
                // initPanel(hotInfoVisual.hangZhouPanel);
                // }
            }
        }
    });
    hotInfoVisual.hangZhouPanel = $.extend(true, {}, hotInfoVisual.quanQuoPanel, {
        tag: "hangZhou",
        cluser: "area_001020005",
        srcArea: {
            id: "",
            name: "杭州市"
        },
        curArea: {
            id: "",
            name: "杭州市"
        },
        mapOption: {
            mapType: "杭州市",
            selectedMode: '',
            selectedEventFn: function(param) {
                var selected = param.target;
                if (hotInfoVisual.hangZhouPanel.curArea.name == selected) {
                    // 取消选择
                    hotInfoVisual.hangZhouPanel.curArea.id = hotInfoVisual.hangZhouPanel.srcArea.id;
                    hotInfoVisual.hangZhouPanel.curArea.name = hotInfoVisual.hangZhouPanel.srcArea.name;
                    drawNewsList(hotInfoVisual.hangZhouPanel);
                    return;
                }
                var mapAreaNames = hotInfoVisual.mapArea.name[hotInfoVisual.hangZhouPanel.mapOption.mapType] || [];
                for (var i = 0, length = mapAreaNames.length; i < length; i++) {
                    var mapAreaName = mapAreaNames[i];
                    if (mapAreaName.dictName == selected) {
                        hotInfoVisual.hangZhouPanel.curArea.id = mapAreaName.dictNum;
                        hotInfoVisual.hangZhouPanel.curArea.name = selected;
                        drawNewsList(hotInfoVisual.hangZhouPanel);
                        break;
                    }
                }
            }
        }
    });


    function initPanel(curPanelObj) {
        var categoryEleObj = $("#" + curPanelObj.tag + "Category");
        if (categoryEleObj.length > 0) {
            hotInfoVisual.drawCategory(categoryEleObj, curPanelObj.categories, curPanelObj.curSelectedCatetory, function() {
                dealPanelData(curPanelObj);
            });
        }
        var dateTimePicker = $("#" + curPanelObj.tag + "DateTimePicker");
        dateTimePicker.val(hotInfoVisual.time.toDayString(curPanelObj.time, "-"));
        hotInfoVisual.initTimePicker(dateTimePicker, curPanelObj.tag, curPanelObj.time, function() {
            dealPanelData(curPanelObj);
        });
        var loadDaysEleObj = $("#" + curPanelObj.tag + "TimeBtn");
        if (loadDaysEleObj.length > 0) {
            hotInfoVisual.drawLoadDaysList(loadDaysEleObj, curPanelObj.loadDaysList, curPanelObj.curSelectedLoadDays, function() {
                dealPanelData(curPanelObj);
            });
        }
        dealPanelData(curPanelObj);
    }

    function drawMap(curPanelObj) {
        var mapParameters = {
            cluster_name: curPanelObj.cluser + "_" + curPanelObj.curSelectedLoadDays.value,
            loaddate: hotInfoVisual.time.toDayString(curPanelObj.time, "-"),
            user_id: "admin",
            department: "admin"
        }
        if (curPanelObj.curSelectedCatetory.id) {
            // 选择全部时不能传该参数
            mapParameters.field = curPanelObj.curSelectedCatetory.id;
        }
        mapParameters.field = "000";
        var mapContainer = document.getElementById(curPanelObj.tag + "MapContainer");
        hotInfoVisual.drawMap(mapContainer, curPanelObj.container, curPanelObj.mapOption, mapParameters, curPanelObj.curArea);
    }

    function drawNewsList(curPanelObj) {

        var newsContainer = $("#" + curPanelObj.tag + "NewsContainer");
        var newsPage = $("#" + curPanelObj.tag + "NewsPage");
        var newsAreaNameContainer = $("#" + curPanelObj.tag + "NewsAreaName");
        hotInfoVisual.drawNewsList(newsContainer, newsPage, curPanelObj, newsAreaNameContainer);
    }

    function dealPanelData(curPanelObj) {
        $("." + curPanelObj.tag + "CurTime").html(hotInfoVisual.time.toDayString(curPanelObj.time));
        var areaEleObj = $("." + curPanelObj.tag + "Area");
        areaEleObj.html(curPanelObj.srcArea.name);
        areaEleObj.parent().unbind("click");
        areaEleObj.parent().bind("click", function() {
            curPanelObj.curArea.id = curPanelObj.srcArea.id;
            curPanelObj.curArea.name = curPanelObj.srcArea.name;
            drawMap(curPanelObj);
            drawNewsList(curPanelObj);
        });
        var sTime = hotInfoVisual.time.toDayString(curPanelObj.time, "-");

        drawMap(curPanelObj);
        drawNewsList(curPanelObj);

        var chartParameters = {
            // cluster_name: curPanelObj.cluser,
            cluster_name: curPanelObj.cluser + "_" + curPanelObj.curSelectedLoadDays.value,
            loaddate: sTime,
            area: curPanelObj.curArea.id,
            startpage: 0,
            pagesize: 3,
            user_id: "admin",
            department: "admin"
        }
        if (curPanelObj.curSelectedCatetory.id) {
            chartParameters.field = curPanelObj.curSelectedCatetory.id;
        }
        chartParameters.field = "000";
        var chartContainer = document.getElementById(curPanelObj.tag + "TendencyChartContainer");
        hotInfoVisual.drawChart(chartContainer, curPanelObj.container, curPanelObj.time, chartParameters);

        var provinceParameters = {
            // cluster_name: curPanelObj.cluser,
            cluster_name: curPanelObj.cluser + "_" + curPanelObj.curSelectedLoadDays.value,
            loaddate: sTime,
            user_id: "admin",
            department: "admin"
        }
        if (curPanelObj.curSelectedCatetory.id) {
            provinceParameters.field = curPanelObj.curSelectedCatetory.id;
        }
        provinceParameters.field = "000";
        var newsContainer = $("#" + curPanelObj.tag + "NewsContainer");
        var newsPage = $("#" + curPanelObj.tag + "NewsPage");
        var newsAreaNameContainer = $("#" + curPanelObj.tag + "NewsAreaName");
        var cur = curPanelObj.tag === "zheJiang" ? hotInfoVisual.zheJiangPanel : hotInfoVisual.quanQuoPanel
        hotInfoVisual.drawProvinceList($("#" + curPanelObj.tag + "ProvinceListItems"), provinceParameters, cur, newsContainer, newsPage, newsAreaNameContainer);
    }
    initPanel(hotInfoVisual.quanQuoPanel);
    initPanel(hotInfoVisual.zheJiangPanel);
    // initPanel(hotInfoVisual.hangZhouPanel);
});
