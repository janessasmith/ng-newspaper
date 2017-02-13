hotInfoVisual.drawChart = function(chartEle, container, curTime, parameters) {
    if (!chartEle) {
        return;
    }
    //$.get("/widget/hotpoint/pointnewscount", parameters, function(data) {
    parameters.typeid = "widget";
    parameters.serviceid = "hotpoint";
    parameters.modelid = "pointnewscount";
    $.ajax({
        url: "/wcm/bigdata.do",
        data: parameters,
        dataType: "text",
        success: function(data) {
            var jsonData = JSON.parse(data);
            if (jsonData.ISSUCESS == 'false') {
                console.log("获取‘热点趋势图’数据失败");
                return;
            }
            var maxDataValue = 0;

            var pushData = function(srcDatas, targetData) {
                var data0 = targetData[0] ? targetData[0].CLUSTER_NUMS : 0;
                var data1 = targetData[1] ? targetData[1].CLUSTER_NUMS : 0;
                var data2 = targetData[2] ? targetData[2].CLUSTER_NUMS : 0;
                srcDatas[0].push(data0);
                srcDatas[1].push(data1);
                srcDatas[2].push(data2);
                maxDataValue = maxDataValue >= data0 ? maxDataValue : data0;
                maxDataValue = maxDataValue >= data1 ? maxDataValue : data1;
                maxDataValue = maxDataValue >= data2 ? maxDataValue : data2;
            }
            var chartDatas = [
                [],
                [],
                []
            ];
            pushData(chartDatas, jsonData.FIRST || []);
            pushData(chartDatas, jsonData.SECOND || []);
            pushData(chartDatas, jsonData.THIRD || []);
            pushData(chartDatas, jsonData.FOURTH || []);
            pushData(chartDatas, jsonData.FIFTH || []);
            pushData(chartDatas, jsonData.SIXTH || []);
            pushData(chartDatas, jsonData.SEVENTH || []);

            $(chartEle).prev().children("#tendencyChartMaxvalue").html(maxDataValue);

            // 日期处理
            var xDatas = [];
            var tmpTime = {
                year: curTime.year,
                month: curTime.month - 1,
                day: curTime.day
            };
            for (var i = 6; i > 0; i--) {
                var date = new Date(curTime.year, curTime.month - 1, curTime.day - i);
                hotInfoVisual.time.update(tmpTime, date);
                xDatas.push(hotInfoVisual.time.toDayNoYearString(tmpTime));
            }
            xDatas.push(hotInfoVisual.time.toDayNoYearString(curTime));

            var chartOption = {
                tooltip: {
                    trigger: 'axis'
                },
                calculable: true,
                grid: {
                    borderColor: 'transparent'
                },
                xAxis: [{
                    splitLine: { show: false },
                    splitArea: { show: false },
                    type: 'category',
                    data: xDatas
                }],
                yAxis: [{
                    show: false,
                    type: 'value'
                }],
                series: [{
                    name: '第一',
                    type: 'bar',
                    data: chartDatas[0]
                }, {
                    name: '第二',
                    type: 'bar',
                    data: chartDatas[1]
                }, {
                    name: '第三',
                    type: 'bar',
                    data: chartDatas[2]
                }]
            };

            if (!container.chartContainer) {
                container.chartContainer = echarts.init(chartEle, 'macarons');
            }
            // 使用刚指定的配置项和数据显示图表。
            container.chartContainer.setOption(chartOption);
        }
    });
    //});
}
