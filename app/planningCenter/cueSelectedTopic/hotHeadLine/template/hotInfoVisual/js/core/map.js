hotInfoVisual.drawMap = function(mapEle, container, option, parameters, curArea) {
    if (!mapEle) {
        return;
    }
    var mapEleObj = $(mapEle);
    mapEleObj.find(".mark-point-data").remove();
    parameters.typeid = "widget";
    parameters.serviceid = "hotpoint";
    parameters.modelid = "hotpoint";
    $.ajax({
        url: "/wcm/bigdata.do",
        data: parameters,
        dataType: "text",
        success: function(data) {
            var jsonData = JSON.parse(data);
            if (jsonData.ISSUCESS == 'false') {
                console.log("获取‘地图热点’数据失败");
                // return;
            }
            var mapDatas = [];
            var maxData = {
                value: 0
            };
            var minData = {
                value: -1
            };
            var mapAreaNames = hotInfoVisual.mapArea.name[option.mapType];
            if (mapAreaNames) {
                drawMap();
            } else {
                $.getJSON('./data/areaName/' + option.mapType + '.json', function(data) {
                    mapAreaNames = hotInfoVisual.mapArea.name[option.mapType] = data;
                    drawMap();
                });
            }

            function drawMap() {
                for (var key in jsonData) {
                    var tmp = jsonData[key];
                    var hotpointnum = Number(tmp.HOTPOINTNUM);
                    for (var j = 0, jLength = mapAreaNames.length; j < jLength; j++) {
                        var mapAreaName = mapAreaNames[j];
                        if (tmp.AREA == mapAreaName.dictNum) {
                            var mode = {
                                newsListArea: tmp.AREA,
                                name: mapAreaName.dictName,
                                value: Number(hotpointnum),
                                title: tmp.TITLE,
                                titles: tmp.TITLES,
                                taskid: tmp.TASKID,
                                selected: false
                            };
                            if (tmp.CLUSTERNAME) {
                                hotInfoVisual.clusterNames[mapAreaName.dictName] = tmp.CLUSTERNAME;
                            }
                            if (mode.name == curArea.name) {
                                mode.selected = true;
                            }
                            mapDatas.push(mode);
                            if (hotpointnum > maxData.value) {
                                maxData = mode;
                            }
                            if (hotpointnum < minData.value || minData.value == -1) {
                                minData = mode;
                            }
                            break;
                        }
                    }
                }

                // console.log(maxData.name + " " + maxData.value);
                // console.log(minData.name + " " + minData.value);

                container.curHideTooltipEleObj = undefined;
                var mapOption = {
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        backgroundColor: "rgba(0,0,0,0)",
                        padding: 0,
                        formatter: function(params, ticket, callback) {
                            if (container.curHideTooltipEleObj && container.curHideTooltipEleObj.name != params.name) {
                                container.curHideTooltipEleObj.show();
                                container.curHideTooltipEleObj = mapEleObj.find("[name=" + params.name + "]");
                            } else {
                                container.curHideTooltipEleObj = mapEleObj.find("[name=" + params.name + "]");
                            }
                            container.curHideTooltipEleObj.hide();

                            var htmls = tmpHtmls = "<div class='map-hover-tooltip'><ul>";
                            var areaData;
                            for (var i = 0, length = mapDatas.length; i < length; i++) {
                                var tmpData = mapDatas[i];
                                if (params.name == tmpData.name) {
                                    areaData = tmpData;
                                    break;
                                }
                            }
                            if (areaData) {
                                container.top3TitlesHtml = container.top3TitlesHtml || {};
                                var curAreaTitles = container.top3TitlesHtml[areaData.newsListArea];
                                if (curAreaTitles) {
                                    var isLoading = curAreaTitles.isLoading;
                                    var num = 0;
                                    if (isLoading) {
                                        // 等待500毫秒，避免晃动鼠标的时候发多次请求
                                        var waitLoadingTitleInterval = setInterval(function() {
                                            if (!curAreaTitles.isLoading) {
                                                clearInterval(waitLoadingTitleInterval);
                                                curAreaTitles.isLoading = false;
                                                htmls = curAreaTitles.htmls;
                                                callback(ticket, htmls);
                                            }
                                            num++;
                                            if (num > 5) {
                                                clearInterval(waitLoadingTitleInterval);
                                            }
                                        }, 500);
                                    } else {
                                        htmls = curAreaTitles.htmls;
                                        callback(ticket, htmls);
                                    }
                                } else {
                                    container.top3TitlesHtml[areaData.newsListArea] = {
                                        isLoading: true
                                    };
                                    htmls += "<span>数据正在加载中...</span>";
                                    htmls += "</ul></div>";
                                    var parameters = {
                                        area: areaData.newsListArea,
                                        taskid: areaData.taskid,
                                        typeid: "widget",
                                        serviceid: "hotpoint",
                                        modelid: "gettopthree"
                                    };
                                    /*$.get("/widget/hotpoint/gettopthree", {
                                        area: areaData.newsListArea,
                                        taskid: areaData.taskid,
                                        user_id: "admin",
                                        department: "admin"
                                    }, function(titlesData) {*/
                                    $.ajax({
                                        url: "/wcm/bigdata.do",
                                        data: parameters,
                                        dataType: "text",
                                        success: function(titlesData) {
                                            var curAreaTitles = container.top3TitlesHtml[areaData.newsListArea];
                                            curAreaTitles.isLoading = false;
                                            htmls = tmpHtmls;
                                            titlesData = JSON.parse(titlesData);
                                            var titles = titlesData.TITLE || "";
                                            titles = titles.split("$");
                                            for (var j = 0, length = titles.length; j < length; j++) {
                                                var tmpTitle = titles[j] || "";
                                                tmpTitle = tmpTitle.trim();
                                                if (tmpTitle) {
                                                    htmls += "<li><span>" + tmpTitle + "</span></li>";
                                                }
                                            }
                                            htmls += "</ul></div>";
                                            curAreaTitles.htmls = htmls;
                                            callback(ticket, htmls)
                                        }
                                    });
                                    //})
                                }
                            } else {
                                htmls += "<span>暂无数据</span>";
                                htmls += "</ul></div>";
                                callback(ticket, htmls)
                            }
                            return htmls;
                        }
                    },
                    dataRange: {
                        min: minData.value || 0,
                        // min: 0,
                        max: maxData.value || 2500,
                        // max: 2500,
                        orient: 'horizontal',
                        x: 'left',
                        // y: 'bottom',
                        text: ['热度高', '热度低'], // 文本，默认为数值文本
                        calculable: false
                            // color: ['orange', 'yellow'],
                            // splitNumber: 0
                    },
                    series: [{
                        name: '',
                        type: 'map',
                        mapType: option.mapType || "china",
                        roam: false,
                        clickable: true,
                        selectedMode: "single",
                        itemStyle: {
                            normal: {
                                borderColor: '#0096D0',
                                borderWidth: 1,
                                label: {
                                    show: true,
                                    textStyle: {
                                        // color: "#bde6fd"
                                    }
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        // color: "#bde6fd"
                                    }
                                }
                            }
                        },
                        data: mapDatas
                    }]
                };

                if (!container.mapContainer) {
                    container.mapContainer = echarts.init(mapEle);
                } else {
                    container.mapContainer.dispose();
                    container.mapContainer = echarts.init(mapEle);
                }
                // 构造区县级地图数据
                //if (!echarts.util.mapData.params.params[option.mapType]) {
                if (option.mapType == "浙江" || !echarts.util.mapData.params.params[option.mapType]) {
                    var url = "zhejiang";
                    echarts.util.mapData.params.params[option.mapType] = {
                        getGeoJson: function(callback) {
                            $.getJSON('./data/echarts/' + url + '.json', function(data) {
                                // 压缩后的地图数据必须使用 decode 函数转换
                                callback(echarts.util.mapData.params.decode(data));
                            });
                        }
                    };
                }

                container.mapContainer.setOption(mapOption);


                if (option.selectedEventFn) {
                    // 选择浙江省地图中的某个市后执行事件：重新绘制所选择市的地图等数据
                    container.mapContainer.on("mapSelected", option.selectedEventFn);
                }
                container.mapContainer.on("mouseout", function(params) {
                    if (container.curHideTooltipEleObj) {
                        container.curHideTooltipEleObj.show();
                    }
                });

                // 让有数据的区域上显示出数据
                // 延时一定时间，等待地图加载完成
                setTimeout(function() {
                    drawPointData()
                }, 500);

                function drawPointData() {
                    var markPointDataHtmls = [];
                    var mapAreaGeos = hotInfoVisual.mapArea.geo[option.mapType] || [];
                    for (var i = 0, length = mapDatas.length; i < length; i++) {
                        var tmpData = mapDatas[i];
                        for (var j = 0, jLength = mapAreaGeos.length; j < jLength; j++) {
                            var tmpGeo = mapAreaGeos[j];
                            if (tmpData.name.indexOf(tmpGeo.n) > -1) {
                                var location = container.mapContainer.chart.map.getPosByGeo(option.mapType, tmpGeo.g.split(",")) || [];
                                markPointDataHtmls.push("<div class='mark-point-data' ");
                                markPointDataHtmls.push("style='display:none;");
                                markPointDataHtmls.push("left:");
                                markPointDataHtmls.push(location[0]);
                                markPointDataHtmls.push("px;");
                                markPointDataHtmls.push("top:");
                                markPointDataHtmls.push(location[1]);
                                markPointDataHtmls.push("px;' name='");
                                markPointDataHtmls.push(tmpData.name);
                                markPointDataHtmls.push("'>");
                                // var animationDelay = 0.5 + 0.4 * i;
                                var animationDelay = 0;
                                var blueCircleAnimation = "markPointCircleScaleOut 2s ease " + animationDelay + "s 1 normal both";
                                markPointDataHtmls.push("<div class='mark-point-circle-blue' style='animation:");
                                markPointDataHtmls.push(blueCircleAnimation);
                                markPointDataHtmls.push(";-webkit-animation:");
                                markPointDataHtmls.push(blueCircleAnimation);
                                markPointDataHtmls.push(";'></div>");

                                var imgCircleAnimation = "markPointCircleFadeOut 2s ease " + animationDelay + "s 1 normal both";
                                markPointDataHtmls.push("<div class='mark-point-circle-img' style='animation:");
                                markPointDataHtmls.push(imgCircleAnimation);
                                markPointDataHtmls.push(";-webkit-animation:");
                                markPointDataHtmls.push(imgCircleAnimation);
                                markPointDataHtmls.push(";'></div>");

                                var redCircleAnimation = "markPointCirclescaleIn 0.15s ease " + animationDelay + "s 1 normal both";
                                markPointDataHtmls.push("<div class='mark-point-circle-red' style='animation:");
                                markPointDataHtmls.push(redCircleAnimation);
                                markPointDataHtmls.push(";-webkit-animation:");
                                markPointDataHtmls.push(redCircleAnimation);
                                markPointDataHtmls.push(";'></div>");

                                var animationValue = "showMrakPointData 0.5s ease " + (animationDelay + 0.5) + "s 1 normal both";
                                markPointDataHtmls.push("<span style='animation:");
                                markPointDataHtmls.push(animationValue);
                                markPointDataHtmls.push(";-webkit-animation:");
                                markPointDataHtmls.push(animationValue);
                                markPointDataHtmls.push(";'>");
                                markPointDataHtmls.push(tmpData.title);
                                markPointDataHtmls.push("</span>");
                                markPointDataHtmls.push("</div>");
                                break;
                            }
                        }
                    }

                    mapEleObj.append(markPointDataHtmls.join(""));
                    container.markPointEleObjs = mapEleObj.find(".mark-point-data");

                    var num = 0;
                    var showLength = 10;
                    if (container.markPointInterval) {
                        clearInterval(container.markPointInterval);
                    }
                    container.markPointInterval = setInterval(function() {
                        // var startMarkPointEleObj = container.markPointEleObjs[(num - showLength + 1) % showLength];
                        var startMarkPointEleObj = container.markPointEleObjs[(num - showLength) % container.markPointEleObjs.length];
                        if (startMarkPointEleObj) {
                            startMarkPointEleObj.style.display = "none";
                        }

                        // var curMarkPointEleObj = container.markPointEleObjs[num++ % showLength];
                        var curMarkPointEleObj = container.markPointEleObjs[num++ % container.markPointEleObjs.length];
                        if (curMarkPointEleObj) {
                            curMarkPointEleObj.style.display = "block";
                        }
                    }, 1000);

                }
            }
        }
    });
    //$.get("/widget/hotpoint/hotpoint", parameters, function(data) {
    //});
}
