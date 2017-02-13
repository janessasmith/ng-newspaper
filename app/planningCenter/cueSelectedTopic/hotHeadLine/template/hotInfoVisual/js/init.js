(function() {
    var hotPonitStatus; //热点分布搜索状态区分 1为精确 0为疑似
    var hotInfoVisual = {};
    window.hotInfoVisual = hotInfoVisual;

    var date = new Date();
    hotInfoVisual.time = {
        curTime: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds()
        }
    };

    hotInfoVisual.time.toDayString = function(timeObj, separator) {
        var spt = separator ? separator : ".";
        var month = timeObj.month < 10 ? "0" + timeObj.month : timeObj.month;
        var day = timeObj.day < 10 ? "0" + timeObj.day : timeObj.day;
        return timeObj.year + spt + month + spt + day;
    }
    hotInfoVisual.time.toDayNoYearString = function(timeObj, separator) {
        var spt = separator ? separator : ".";
        var month = timeObj.month < 10 ? "0" + timeObj.month : timeObj.month;
        var day = timeObj.day < 10 ? "0" + timeObj.day : timeObj.day;
        return month + spt + day;
    }
    hotInfoVisual.time.update = function(timeObj, newTime) {
        if (!newTime) {
            newTime = new Date();
        }
        timeObj.year = newTime.getFullYear();
        timeObj.month = newTime.getMonth() + 1;
        timeObj.day = newTime.getDate();
        timeObj.hours = newTime.getHours();
        timeObj.minutes = newTime.getMinutes();
        timeObj.seconds = newTime.getSeconds();
    }
    hotInfoVisual.drawCategory = function(container, categories, curSelectedCatetory, eventFn) {
        var htmls = [];
        for (var i = 0, length = categories.length; i < length; i++) {
            htmls.push("<div class='item'>");
            htmls.push("<span>");
            htmls.push(categories[i].name);
            htmls.push("</span>");
            htmls.push("</div>");
        }
        container.empty().append(htmls.join(""));
        var itemEles = container.find(".item");
        itemEles.each(function(index, element) {
            var curElement = $(element);
            var category = categories[index];
            curElement.data('category', category);
            if (curSelectedCatetory.id == category.id) {
                curElement.addClass('selected');
            }
            curElement.bind('click', function(e) {
                var currentTarget = $(e.currentTarget);
                var currentTargetCategory = currentTarget.data('category');
                if (currentTargetCategory.id == curSelectedCatetory.id) {
                    return;
                } else {
                    curSelectedCatetory = $.extend(true, curSelectedCatetory, currentTargetCategory);
                    itemEles.removeClass("selected");
                    currentTarget.addClass('selected');
                    if (eventFn) {
                        eventFn();
                    }
                }
            })
        });
    }
    hotInfoVisual.initTimePicker = function(container, tag, curTimeObj, callback) {
        container.calendar({
            controlId: "calendar_" + tag, // 弹出的日期控件ID，默认: $(this).attr("id") + "Calendar"
            speed: 100, // 三种预定速度之一的字符串("slow", "normal", or "fast")或表示动画时长的毫秒数值(如：1000),默认：200
            complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true
            readonly: true, // 目标对象是否设为只读，默认：true
            upperLimit: new Date(), // 日期上限，默认：NaN(不限制)
            // lowerLimit: new Date("2011/01/01"), // 日期下限，默认：NaN(不限制)
            callback: function() { // 点击选择日期后的回调函数
                // alert("您选择的日期是：" + $("#txtBeginDate").val());
                var newTimes = container.val().split("-");
                curTimeObj.year = Number(newTimes[0]);
                curTimeObj.month = Number(newTimes[1]);
                curTimeObj.day = Number(newTimes[2]);
                if (callback) {
                    callback();
                }
            }
        });
    }
    hotInfoVisual.drawNewsList = function(newsListContainer, pagesContainer, curPanelObj, newsAreaNameContainer, curPage) {
        if (newsListContainer.length <= 0) {
            return;
        }
        if (curPage) {
            curPanelObj.curPage.index = curPage.index;
        } else {
            curPanelObj.curPage.index = 0;
        }
        var parameters = {
            // cluster_name: curPanelObj.cluser,
            // cluster_name: curPanelObj.cluser + "_" + curPanelObj.curSelectedLoadDays.value,
            loaddate: hotInfoVisual.time.toDayString(curPanelObj.time, "-"),
            // area: curPanelObj.curArea.id,
            // loaddays: curPanelObj.curSelectedLoadDays.value,
            startpage: curPanelObj.curPage.index,
            pagesize: 10,
            user_id: "admin",
            department: "admin"
        }
        if (curPanelObj.tag == 'zheJiang' && curPanelObj.cluser.indexOf('_') > -1) {
            parameters.cluster_name = curPanelObj.cluser;
        } else {
            parameters.cluster_name = curPanelObj.cluser + "_" + curPanelObj.curSelectedLoadDays.value;
        }
        if (curPanelObj.curSelectedCatetory.id) {
            parameters.field = curPanelObj.curSelectedCatetory.id;
        }
        parameters.field = "000";

        var areaEleObj = $("." + curPanelObj.tag + "Area");
        if (curPanelObj.curArea.id == curPanelObj.srcArea.id) {
            areaEleObj.addClass("scope-selected");
        } else {
            areaEleObj.removeClass("scope-selected");
        }

        newsListContainer.empty();
        pagesContainer.hide();
        parameters.startpage = curPanelObj.curPage.index;
        parameters.area = curPanelObj.curArea.id;
        if (curPanelObj.tag !== "zheJiang") {
            newsAreaNameContainer.empty().html(curPanelObj.curArea.name + "热点");
        } else {
            if (hotPonitStatus === undefined) {
                $("#accuracy").addClass('active');
                hotPonitStatus = 1;
            }
            parameters.subjectarea = hotPonitStatus;
            newsAreaNameContainer.empty().html("<button id='accuracy'>" + curPanelObj.curArea.name + "热点</button>&nbsp;<button id='seemingly'>疑似" + curPanelObj.curArea.name + "热点</button>");
            if(hotPonitStatus===1){
                $("#accuracy").addClass('active');
                $("#seemingly").removeClass('active');
            }else{
                $("#seemingly").addClass('active');
                $("#accuracy").removeClass('active');
            }
            $("#accuracy").bind("click", function() {
                hotPonitStatus = 1;
                hotInfoVisual.drawNewsList(newsListContainer, pagesContainer, curPanelObj, newsAreaNameContainer);
            });
            $("#seemingly").bind("click", function() {
                hotPonitStatus = 0;
                hotInfoVisual.drawNewsList(newsListContainer, pagesContainer, curPanelObj, newsAreaNameContainer);
            });
        }
        parameters.typeid = "widget";
        parameters.serviceid = "hotpoint";
        parameters.modelid = "hotnewslist";
        $.ajax({
            url: "/wcm/bigdata.do",
            data: parameters,
            dataType: "text",
            success: function(data) {
                var jsonData = JSON.parse(data);
                if (jsonData.ISSUCESS == 'false') {
                    console.log("获取‘热点文档列表’数据失败");
                    return;
                }
                var newsDatas = jsonData.CONTENT;
                if (!newsDatas) {
                    return;
                }
                var listHtmls = [];
                for (var i = 0, length = newsDatas.length; i < length && i < 10; i++) {
                    var newsData = newsDatas[i];
                    if (i % 2 == 0) {
                        listHtmls.push('<div class="news-item news-bg-blue">');
                    } else {
                        listHtmls.push('<div class="news-item">');
                    }
                    listHtmls.push('<div class="news-content">');
                    listHtmls.push('<a target="_blank" title="');
                    listHtmls.push(newsData.TITLE);
                    listHtmls.push('" href="/mediacube/#/resourcedetail?guid=');
                    listHtmls.push(newsData.GUID);
                    listHtmls.push('&indexname=');
                    listHtmls.push(newsData.TABLENAME);
                    listHtmls.push('&areaname=');
                    listHtmls.push(curPanelObj.curArea.name);
                    listHtmls.push('">');
                    listHtmls.push(newsData.TITLE);
                    listHtmls.push('</a>');
                    listHtmls.push('</div>');
                    listHtmls.push('<div class="news-visits">');
                    listHtmls.push('<span>');
                    var visits = newsData.CLUSTERNUMS || 1;
                    if (visits >= 10000) {
                        visits = visits / 10000;
                        visits = visits.toFixed('1') + "万";
                    }
                    listHtmls.push(visits);
                    listHtmls.push('</span>');
                    listHtmls.push('</div>');
                    listHtmls.push('</div>');
                }
                newsListContainer.empty();
                newsListContainer.append(listHtmls.join(""));

                // 分页处理
                // http://jqpaginator.keenwon.com/
                if (jsonData.TOTALPAGES == 0) {
                    pagesContainer.hide();
                    return;
                } else {
                    pagesContainer.show();
                }
                if (curPanelObj.curPage.init) {
                    pagesContainer.jqPaginator('option', {
                        currentPage: curPanelObj.curPage.index + 1,
                        // totalCounts: jsonData.TOTALELEMENTS,
                        totalPages: jsonData.TOTALPAGES
                    });
                } else {
                    curPanelObj.curPage.init = true;
                    pagesContainer.jqPaginator({
                        currentPage: curPanelObj.curPage.index + 1,
                        totalPages: jsonData.TOTALPAGES,
                        // totalCounts: jsonData.TOTALELEMENTS,
                        // pageSize: 10,
                        visiblePages: 17,
                        activeClass: "news-page-selected",
                        prev: "<div class='news-page-btn news-page-change'><span>&lt;</span></div>",
                        next: "<div class='news-page-btn news-page-change'><span>&gt;</span></div>",
                        page: "<div class='news-page-btn'><span>{{page}}</span></div>",
                        onPageChange: function(num, type) {
                            if (curPanelObj.curPage.index == --num) {
                                return;
                            }
                            curPanelObj.curPage.index = num;
                            hotInfoVisual.drawNewsList(newsListContainer, pagesContainer, curPanelObj, newsAreaNameContainer, curPanelObj.curPage);
                        }
                    });
                }
            }
        });
        //$.get("/widget/hotpoint/hotnewslist", parameters, function(data) {
        //});
    }
    hotInfoVisual.drawProvinceList = function(container, parameters, curPanelObj, newsListContainer, pagesContainer, newsAreaNameContainer) {
        if (container.length <= 0) {
            return;
        }
        container.empty();
        //$.get("/widget/hotpoint/countryhotpoint", parameters, function(data) {
        parameters.typeid = "widget";
        parameters.serviceid = "hotpoint";
        parameters.modelid = "countryhotpoint";
        $.ajax({
            url: "/wcm/bigdata.do",
            data: parameters,
            dataType: "text",
            success: function(data) {
                var jsonData = JSON.parse(data);
                if (jsonData.ISSUCESS == 'false') {
                    console.log("获取‘地域统计——全国区域热点排行’数据失败");
                    return;
                }
                var listHtmls = [];
                for (var i = 0, length = jsonData.length; i < length && i < 10; i++) {
                    var province = jsonData[i];
                    listHtmls.push('<div class="province-list-item">');
                    listHtmls.push('<div>');
                    listHtmls.push('<span>');
                    listHtmls.push(i + 1);
                    listHtmls.push('</span>');
                    listHtmls.push('</div>');
                    listHtmls.push('<div areaname="' + province.AREANAME + '" area="' + province.AREA + '" class="province-list-item-bg ' + (curPanelObj.tag === 'zheJiang' ? 'zhejiang' : 'quanguo') + '">');
                    listHtmls.push('<span>');
                    listHtmls.push(province.AREANAME);
                    listHtmls.push('</span>');
                    listHtmls.push('</div>');
                    listHtmls.push('<div>');
                    listHtmls.push('<span>');
                    var visits = province.HOTNUM || 1;
                    if (visits >= 10000) {
                        visits = visits / 10000;
                        visits = visits.toFixed('1') + "万";
                    }
                    listHtmls.push(visits);
                    listHtmls.push('</span>');
                    listHtmls.push('</div>');
                    listHtmls.push('</div>');
                }
                container.append(listHtmls.join(""));
                var className = curPanelObj.tag === "zheJiang" ? "zhejiang" : "quanguo";
                $("." + className).each(function(index) {
                    $(this).bind("click", function() {
                        curPanelObj.curArea.id = $(this).attr("area");
                        curPanelObj.curArea.name = $(this).attr("areaname");
                        hotInfoVisual.drawNewsList(newsListContainer, pagesContainer, curPanelObj, newsAreaNameContainer)
                    });
                });
            }
        });
        // var jsonData = hotInfoVisual.quanQuoPanel.provinceList;
        //});
    }

    hotInfoVisual.drawLoadDaysList = function(container, loadDaysList, curLoadDays, callback) {
        var htmls = [];
        for (var i = 0, length = loadDaysList.length; i < length; i++) {
            htmls.push("<div>");
            htmls.push("<span>");
            htmls.push(loadDaysList[i].desc);
            htmls.push("</span>");
            htmls.push("</div>");
        }
        container.empty().append(htmls.join(""));
        var itemEles = container.find("div");
        itemEles.each(function(index, element) {
            var curElement = $(element);
            var loadDay = loadDaysList[index];
            curElement.data('loadDay', loadDay);
            if (curLoadDays.value == loadDay.value) {
                curElement.addClass('time-btn-selected');
            }
            curElement.bind('click', function(e) {
                var currentTarget = $(e.currentTarget);
                var currentTargetLoadDays = currentTarget.data('loadDay');
                if (currentTargetLoadDays.value == curLoadDays.value) {
                    return;
                } else {
                    // curLoadDays = currentTargetLoadDays;
                    $.extend(true, curLoadDays, currentTargetLoadDays);
                    itemEles.removeClass("time-btn-selected");
                    currentTarget.addClass('time-btn-selected');
                    if (callback) {
                        callback();
                    }
                }
            })
        });
    }

    // 将地图区域名称与cluster的对应关系记录下来
    hotInfoVisual.clusterNames = {
        "丽水市": "area_001020001",
        "台州市": "area_001020002",
        "嘉兴市": "area_001020003",
        "宁波市": "area_001020004",
        "杭州市": "area_001020005",
        "温州市": "area_001020006",
        "湖州市": "area_001020007",
        "绍兴市": "area_001020008",
        "舟山市": "area_001020009",
        "衢州市": "area_001020010",
        "金华市": "area_001020011"
    }

    // 地图各区域的名称及地理坐标
    hotInfoVisual.mapArea = {
        name: {},
        geo: {}
    };

    hotInfoVisual.mapArea.name.china = [
        { "dictName": "上海", "dictNum": "001001" },
        { "dictName": "云南", "dictNum": "001002" },
        { "dictName": "内蒙古", "dictNum": "001003" },
        { "dictName": "北京", "dictNum": "001004" },
        { "dictName": "台湾", "dictNum": "001005" },
        { "dictName": "吉林", "dictNum": "001006" },
        { "dictName": "四川", "dictNum": "001007" },
        { "dictName": "天津", "dictNum": "001008" },
        { "dictName": "宁夏", "dictNum": "001009" },
        { "dictName": "安徽", "dictNum": "001010" },
        { "dictName": "山东", "dictNum": "001011" },
        { "dictName": "山西", "dictNum": "001012" },
        { "dictName": "广东", "dictNum": "001013" },
        { "dictName": "广西", "dictNum": "001014" },
        { "dictName": "新疆", "dictNum": "001015" },
        { "dictName": "江苏", "dictNum": "001016" },
        { "dictName": "江西", "dictNum": "001017" },
        { "dictName": "河北", "dictNum": "001018" },
        { "dictName": "河南", "dictNum": "001019" },
        { "dictName": "浙江", "dictNum": "001020" },
        { "dictName": "海南", "dictNum": "001021" },
        { "dictName": "湖北", "dictNum": "001022" },
        { "dictName": "湖南", "dictNum": "001023" },
        { "dictName": "澳门", "dictNum": "001024" },
        { "dictName": "甘肃", "dictNum": "001025" },
        { "dictName": "福建", "dictNum": "001026" },
        { "dictName": "西藏", "dictNum": "001027" },
        { "dictName": "贵州", "dictNum": "001028" },
        { "dictName": "辽宁", "dictNum": "001029" },
        { "dictName": "重庆", "dictNum": "001030" },
        { "dictName": "陕西", "dictNum": "001031" },
        { "dictName": "青海", "dictNum": "001032" },
        { "dictName": "香港", "dictNum": "001033" },
        { "dictName": "黑龙江", "dictNum": "001034" }
    ];

    hotInfoVisual.mapArea.name["浙江"] = [
        { "dictName": "丽水市", "dictNum": "001020001" },
        { "dictName": "台州市", "dictNum": "001020002" },
        { "dictName": "嘉兴市", "dictNum": "001020003" },
        { "dictName": "宁波市", "dictNum": "001020004" },
        { "dictName": "杭州市", "dictNum": "001020005" },
        { "dictName": "温州市", "dictNum": "001020006" },
        { "dictName": "湖州市", "dictNum": "001020007" },
        { "dictName": "绍兴市", "dictNum": "001020008" },
        { "dictName": "舟山市", "dictNum": "001020009" },
        { "dictName": "衢州市", "dictNum": "001020010" },
        { "dictName": "金华市", "dictNum": "001020011" }
    ]

    hotInfoVisual.mapArea.geo = {
        "china": [
            { "n": "北京", "g": "116.395645,39.929986" },
            { "n": "上海", "g": "121.487899,31.249162" },
            { "n": "天津", "g": "117.210813,39.14393" },
            { "n": "重庆", "g": "106.530635,29.544606" },
            { "n": "安徽", "g": "117.216005,31.859252" },
            { "n": "福建", "g": "117.984943,26.050118" },
            { "n": "甘肃", "g": "102.457625,38.103267" },
            { "n": "广东", "g": "113.394818,23.408004" },
            { "n": "广西", "g": "108.924274,23.552255" },
            { "n": "贵州", "g": "106.734996,26.902826" },
            { "n": "海南", "g": "109.733755,19.180501" },
            { "n": "河北", "g": "115.661434,38.61384" },
            { "n": "河南", "g": "113.486804,34.157184" },
            { "n": "黑龙江", "g": "128.047414,47.356592" },
            { "n": "湖北", "g": "112.410562,31.209316" },
            { "n": "湖南", "g": "111.720664,27.695864" },
            { "n": "江苏", "g": "119.368489,33.013797" },
            { "n": "江西", "g": "115.676082,27.757258" },
            { "n": "吉林", "g": "126.262876,43.678846" },
            { "n": "辽宁", "g": "122.753592,41.6216" },
            { "n": "内蒙古", "g": "114.415868,43.468238" },
            { "n": "宁夏", "g": "106.155481,37.321323" },
            { "n": "青海", "g": "96.202544,35.499761" },
            { "n": "山东", "g": "118.527663,36.09929" },
            { "n": "山西", "g": "112.515496,37.866566" },
            { "n": "陕西", "g": "109.503789,35.860026" },
            { "n": "四川", "g": "102.89916,30.367481" },
            { "n": "西藏", "g": "89.137982,31.367315" },
            { "n": "新疆", "g": "85.614899,42.127001" },
            { "n": "云南", "g": "101.592952,24.864213" },
            { "n": "浙江", "g": "119.957202,29.159494" },
            { "n": "香港", "g": "114.186124,22.293586" },
            { "n": "澳门", "g": "113.557519,22.204118" },
            { "n": "台湾", "g": "120.961454,23.80406" }
        ],
        "浙江": [
            { "n": "杭州", "g": "120.219375,30.259244" },
            { "n": "湖州", "g": "120.137243,30.877925" },
            { "n": "嘉兴", "g": "120.760428,30.773992" },
            { "n": "金华", "g": "119.652576,29.102899" },
            { "n": "丽水", "g": "119.929576,28.4563" },
            { "n": "宁波", "g": "121.579006,29.885259" },
            { "n": "衢州", "g": "118.875842,28.95691" },
            { "n": "绍兴", "g": "120.592467,30.002365" },
            { "n": "台州", "g": "121.440613,28.668283" },
            { "n": "温州", "g": "120.690635,28.002838" },
            { "n": "舟山", "g": "122.169872,30.03601" }
        ],
        "杭州市": [
            { "n": "杭州市", "g": "120.15,30.28" },
            { "n": "上城区", "g": "120.17,30.25" },
            { "n": "下城区", "g": "120.17,30.28" },
            { "n": "江干区", "g": "120.2,30.27" },
            { "n": "拱墅区", "g": "120.13,30.32" },
            { "n": "西湖区", "g": "120.13,30.27" },
            { "n": "滨江区", "g": "120.2,30.2" },
            { "n": "萧山区", "g": "120.27,30.17" },
            { "n": "余杭区", "g": "120.3,30.42" },
            { "n": "桐庐县", "g": "119.67,29.8" },
            { "n": "淳安县", "g": "119.03,29.6" },
            { "n": "建德市", "g": "119.28,29.48" },
            { "n": "富阳市", "g": "119.95,30.05" },
            { "n": "临安市", "g": "119.72,30.23" }
        ],

        "宁波市": [
            { "n": "宁波市", "g": "121.55,29.88" },
            { "n": "海曙区", "g": "121.55,29.87" },
            { "n": "江东区", "g": "121.57,29.87" },
            { "n": "江北区", "g": "121.55,29.88" },
            { "n": "北仑区", "g": "121.85,29.93" },
            { "n": "镇海区", "g": "121.72,29.95" },
            { "n": "鄞州区", "g": "121.53,29.83" },
            { "n": "象山县", "g": "121.87,29.48" },
            { "n": "宁海县", "g": "121.43,29.28" },
            { "n": "余姚市", "g": "121.15,30.03" },
            { "n": "慈溪市", "g": "121.23,30.17" },
            { "n": "奉化市", "g": "121.4,29.65" }
        ],
        "温州市": [
            { "n": "温州市", "g": "120.7,28.0" },
            { "n": "鹿城区", "g": "120.65,28.02" },
            { "n": "龙湾区", "g": "120.82,27.93" },
            { "n": "洞头县", "g": "121.15,27.83" },
            { "n": "永嘉县", "g": "120.68,28.15" },
            { "n": "平阳县", "g": "120.57,27.67" },
            { "n": "苍南县", "g": "120.4,27.5" },
            { "n": "文成县", "g": "120.08,27.78" },
            { "n": "泰顺县", "g": "119.72,27.57" },
            { "n": "瑞安市", "g": "120.63,27.78" },
            { "n": "乐清市", "g": "120.95,28.13" }
        ],
        "嘉兴市": [
            { "n": "嘉兴市", "g": "120.75,30.75" },
            { "n": "秀洲区", "g": "120.7,30.77" },
            { "n": "嘉善县", "g": "120.92,30.85" },
            { "n": "海盐县", "g": "120.95,30.53" },
            { "n": "海宁市", "g": "120.68,30.53" },
            { "n": "平湖市", "g": "121.02,30.7" },
            { "n": "桐乡市", "g": "120.57,30.63" }
        ],
        "湖州市": [
            { "n": "湖州市", "g": "120.08,30.9" },
            { "n": "吴兴区", "g": "120.12,30.87" },
            { "n": "南浔区", "g": "120.43,30.88" },
            { "n": "德清县", "g": "119.97,30.53" },
            { "n": "长兴县", "g": "119.9,31.02" },
            { "n": "安吉县", "g": "119.68,30.63" }
        ],
        "绍兴市": [
            { "n": "绍兴市", "g": "120.57,30.0" },
            { "n": "越城区", "g": "120.57,30.0" },
            { "n": "绍兴县", "g": "120.47,30.08" },
            { "n": "新昌县", "g": "120.9,29.5" },
            { "n": "诸暨市", "g": "120.23,29.72" },
            { "n": "上虞市", "g": "120.87,30.03" },
            { "n": "嵊州市", "g": "120.82,29.58" }
        ],
        "金华市": [
            { "n": "金华市", "g": "119.65,29.08" },
            { "n": "婺城区", "g": "119.65,29.08" },
            { "n": "金东区", "g": "119.7,29.08" },
            { "n": "武义县", "g": "119.82,28.9" },
            { "n": "浦江县", "g": "119.88,29.45" },
            { "n": "磐安县", "g": "120.43,29.05" },
            { "n": "兰溪市", "g": "119.45,29.22" },
            { "n": "义乌市", "g": "120.07,29.3" },
            { "n": "东阳市", "g": "120.23,29.28" },
            { "n": "永康市", "g": "120.03,28.9" }
        ],
        "衢州市": [
            { "n": "衢州市", "g": "118.87,28.93" },
            { "n": "柯城区", "g": "118.87,28.93" },
            { "n": "衢江区", "g": "118.93,28.98" },
            { "n": "常山县", "g": "118.52,28.9" },
            { "n": "开化县", "g": "118.42,29.13" },
            { "n": "龙游县", "g": "119.17,29.03" },
            { "n": "江山市", "g": "118.62,28.75" }
        ],
        "舟山市": [
            { "n": "舟山市", "g": "122.2,30.0" },
            { "n": "定海区", "g": "122.1,30.02" },
            { "n": "普陀区", "g": "122.3,29.95" },
            { "n": "岱山县", "g": "122.2,30.25" },
            { "n": "嵊泗县", "g": "122.45,30.73" }
        ],
        "台州市": [
            { "n": "台州市", "g": "121.43,28.68" },
            { "n": "椒江区", "g": "121.43,28.68" },
            { "n": "黄岩区", "g": "121.27,28.65" },
            { "n": "路桥区", "g": "121.38,28.58" },
            { "n": "玉环县", "g": "121.23,28.13" },
            { "n": "三门县", "g": "121.38,29.12" },
            { "n": "天台县", "g": "121.03,29.13" },
            { "n": "仙居县", "g": "120.73,28.87" },
            { "n": "温岭市", "g": "121.37,28.37" },
            { "n": "临海市", "g": "121.12,28.85" }
        ],
        "丽水市": [
            { "n": "丽水市", "g": "119.92,28.45" },
            { "n": "莲都区", "g": "119.92,28.45" },
            { "n": "青田县", "g": "120.28,28.15" },
            { "n": "缙云县", "g": "120.07,28.65" },
            { "n": "遂昌县", "g": "119.27,28.6" },
            { "n": "松阳县", "g": "119.48,28.45" },
            { "n": "云和县", "g": "119.57,28.12" },
            { "n": "庆元县", "g": "119.05,27.62" },
            { "n": "景宁畲族自治县", "g": "119.63,27.98" },
            { "n": "龙泉市", "g": "119.13,28.08" }
        ]
    };
})();
